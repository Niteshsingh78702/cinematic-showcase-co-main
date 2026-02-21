import { Router } from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { authenticateToken } from '../middleware/auth.js';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Cloudflare R2 Configuration (S3-compatible)
const R2_CONFIGURED = process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY
    && !process.env.R2_ENDPOINT.includes('YOUR_ACCOUNT_ID');

let R2 = null;
if (R2_CONFIGURED) {
    R2 = new S3Client({
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
    });
    console.log('☁️  Cloudflare R2 connected');
} else {
    console.log('⚠️  R2 not configured — uploads will use local storage');
}

const BUCKET = process.env.R2_BUCKET_NAME || 'mg-films';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// Multer — store in memory, upload to R2
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB max
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg|mp4|webm/;
        const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
        const mime = allowed.test(file.mimetype);
        if (mime && allowed.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (jpg, png, gif, webp, svg) and videos (mp4, webm) are allowed.'));
        }
    },
});

// POST /api/upload — upload a file to R2
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!R2) {
            return res.status(503).json({ error: 'File uploads not available — Cloudflare R2 not configured. Add R2 credentials to .env' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided.' });
        }

        const folder = req.body.folder || 'general';  // e.g., 'albums', 'films', 'weddings', 'actress'
        const ext = path.extname(req.file.originalname).toLowerCase();
        const uniqueName = `${folder}/${crypto.randomUUID()}${ext}`;

        await R2.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: uniqueName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }));

        const fileUrl = `${PUBLIC_URL}/${uniqueName}`;

        res.status(201).json({
            url: fileUrl,
            key: uniqueName,
            size: req.file.size,
            type: req.file.mimetype,
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Upload failed. Check R2 configuration.' });
    }
});

// POST /api/upload/multiple — upload multiple files at once
router.post('/multiple', authenticateToken, upload.array('files', 20), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files provided.' });
        }

        const folder = req.body.folder || 'general';
        const results = [];

        for (const file of req.files) {
            const ext = path.extname(file.originalname).toLowerCase();
            const uniqueName = `${folder}/${crypto.randomUUID()}${ext}`;

            await R2.send(new PutObjectCommand({
                Bucket: BUCKET,
                Key: uniqueName,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));

            results.push({
                url: `${PUBLIC_URL}/${uniqueName}`,
                key: uniqueName,
                originalName: file.originalname,
                size: file.size,
                type: file.mimetype,
            });
        }

        res.status(201).json({ files: results });
    } catch (err) {
        console.error('Multi-upload error:', err);
        res.status(500).json({ error: 'Upload failed.' });
    }
});

// DELETE /api/upload — delete a file from R2
router.delete('/', authenticateToken, async (req, res) => {
    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).json({ error: 'File key is required.' });
        }

        await R2.send(new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: key,
        }));

        res.json({ message: 'File deleted.' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Delete failed.' });
    }
});

export default router;
