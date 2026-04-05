import { Router } from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { authenticateToken } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    console.log('💾 R2 not configured — uploads will be stored in DATABASE (persistent)');
}

const BUCKET = process.env.R2_BUCKET_NAME || 'mg-films';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// Keep local uploads dir for backwards compat (but DB is primary now)
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer — store in memory
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg|mp4|webm|mov|quicktime/;
        const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
        const mime = allowed.test(file.mimetype);
        if (mime && allowed.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (jpg, png, gif, webp, svg) and videos (mp4, webm) are allowed.'));
        }
    },
});

/**
 * Save file to the database (media_files table).
 * Returns { url, key } where url is served via /api/media/db/:key
 */
async function saveToDatabase(fileBuffer, originalName, mimetype, folder) {
    const ext = path.extname(originalName).toLowerCase();
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    const fileKey = `${folder}/${uniqueName}`;

    await pool.execute(
        'INSERT INTO media_files (file_key, mime_type, file_data, file_size) VALUES (?, ?, ?, ?)',
        [fileKey, mimetype, fileBuffer, fileBuffer.length]
    );

    // URL that the frontend will use — served by /api/media/db/:key route
    const url = `/api/media/db/${fileKey}`;
    return { url, key: fileKey };
}

/**
 * (Legacy) Save a file to local disk under server/uploads/<folder>/
 * Only used as backup alongside DB storage.
 */
function saveToLocalDisk(fileBuffer, originalName, mimetype, folder) {
    const ext = path.extname(originalName).toLowerCase();
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    const folderPath = path.join(UPLOADS_DIR, folder);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, uniqueName);
    fs.writeFileSync(filePath, fileBuffer);

    const key = `${folder}/${uniqueName}`;
    const url = `/uploads/${key}`;

    return { url, key };
}

// POST /api/upload — upload a file (R2 → DB → local fallback)
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided.' });
        }

        const folder = req.body.folder || 'general';

        // ---- R2 upload ----
        if (R2) {
            const ext = path.extname(req.file.originalname).toLowerCase();
            const uniqueName = `${folder}/${crypto.randomUUID()}${ext}`;

            await R2.send(new PutObjectCommand({
                Bucket: BUCKET,
                Key: uniqueName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            }));

            const fileUrl = `${PUBLIC_URL}/${uniqueName}`;
            return res.status(201).json({
                url: fileUrl,
                key: uniqueName,
                size: req.file.size,
                type: req.file.mimetype,
            });
        }

        // ---- Database storage (persistent — survives restarts) ----
        const DB_MAX_SIZE = 16 * 1024 * 1024; // 16MB limit for DB storage
        const isLargeFile = req.file.size > DB_MAX_SIZE;

        if (isLargeFile) {
            // Large files (videos) go to disk only — recommend YouTube/Google Drive
            console.log(`⚠️ File too large for DB (${(req.file.size / 1024 / 1024).toFixed(1)}MB), saving to disk only`);
            const { url, key } = saveToLocalDisk(req.file.buffer, req.file.originalname, req.file.mimetype, folder);
            return res.status(201).json({
                url,
                key,
                size: req.file.size,
                type: req.file.mimetype,
                warning: 'File is too large for permanent DB storage. It may be lost on server restart. For videos, use YouTube or Google Drive links instead.',
            });
        }

        try {
            const { url, key } = await saveToDatabase(req.file.buffer, req.file.originalname, req.file.mimetype, folder);

            // Also save to local disk as cache (non-critical)
            try {
                saveToLocalDisk(req.file.buffer, req.file.originalname, req.file.mimetype, folder);
            } catch (localErr) {
                console.warn('⚠️ Local disk save failed (non-critical):', localErr.message);
            }

            return res.status(201).json({
                url,
                key,
                size: req.file.size,
                type: req.file.mimetype,
            });
        } catch (dbErr) {
            console.error('DB upload failed, falling back to local:', dbErr.message);
            // Fallback to local disk if DB fails
            const { url, key } = saveToLocalDisk(req.file.buffer, req.file.originalname, req.file.mimetype, folder);
            return res.status(201).json({
                url,
                key,
                size: req.file.size,
                type: req.file.mimetype,
                warning: 'DB storage unavailable — file saved to disk only. It may be lost on server restart.',
            });
        }
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Upload failed.' });
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
            if (R2) {
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
            } else {
                // Database storage
                try {
                    const { url, key } = await saveToDatabase(file.buffer, file.originalname, file.mimetype, folder);
                    results.push({ url, key, originalName: file.originalname, size: file.size, type: file.mimetype });
                } catch (dbErr) {
                    const { url, key } = saveToLocalDisk(file.buffer, file.originalname, file.mimetype, folder);
                    results.push({ url, key, originalName: file.originalname, size: file.size, type: file.mimetype });
                }
            }
        }

        res.status(201).json({ files: results });
    } catch (err) {
        console.error('Multi-upload error:', err);
        res.status(500).json({ error: 'Upload failed.' });
    }
});

// DELETE /api/upload — delete a file from R2, DB, or local disk
router.delete('/', authenticateToken, async (req, res) => {
    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).json({ error: 'File key is required.' });
        }

        if (R2) {
            await R2.send(new DeleteObjectCommand({
                Bucket: BUCKET,
                Key: key,
            }));
        }

        // Delete from database
        try {
            await pool.execute('DELETE FROM media_files WHERE file_key = ?', [key]);
        } catch (e) { /* ignore */ }

        // Delete from local disk
        const filePath = path.join(UPLOADS_DIR, key);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'File deleted.' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Delete failed.' });
    }
});

export default router;
