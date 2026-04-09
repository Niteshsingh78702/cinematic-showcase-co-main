import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import inquiriesRoutes from './routes/inquiries.js';
import seoRoutes from './routes/seo.js';
import uploadRoutes from './routes/upload.js';
import initDatabase from './initDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware — CORS: allow same-origin (production) + dev origins
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (same-origin, mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        // Allow configured frontend URL and common dev URLs
        const allowed = [
            process.env.FRONTEND_URL,
            'http://localhost:8080',
            'http://localhost:3000',
            'http://localhost:5173',
        ].filter(Boolean);
        if (allowed.includes(origin) || !process.env.FRONTEND_URL) {
            return callback(null, true);
        }
        // In production, also allow the same domain
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ============================================================
// MEDIA SERVING — Database-first (persistent), local disk fallback
// ============================================================

// Serve uploaded files from DATABASE (survives restarts)
app.get('/api/media/db/*', async (req, res) => {
    // Ensure media files are never blocked by CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    try {
        const fileKey = req.params[0];
        const pool = (await import('./config/db.js')).default;
        const [rows] = await pool.execute(
            'SELECT mime_type, file_data FROM media_files WHERE file_key = ? LIMIT 1',
            [fileKey]
        );

        if (rows.length > 0) {
            res.setHeader('Content-Type', rows[0].mime_type);
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.setHeader('CDN-Cache-Control', 'no-transform');
            return res.send(rows[0].file_data);
        }

        // Not in DB — try local disk as fallback
        const filePath = path.join(__dirname, 'uploads', fileKey);
        if (fs.existsSync(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, no-transform');
            return res.sendFile(filePath);
        }

        res.status(404).json({ error: 'File not found', key: fileKey });
    } catch (err) {
        console.error('Media serve error:', err.message);
        res.status(500).json({ error: 'Failed to serve media' });
    }
});

// Serve /uploads/* paths — check DB first (for old URLs), then local disk
app.get('/uploads/*', async (req, res, next) => {
    try {
        const fileKey = req.params[0];
        const pool = (await import('./config/db.js')).default;
        const [rows] = await pool.execute(
            'SELECT mime_type, file_data FROM media_files WHERE file_key = ? LIMIT 1',
            [fileKey]
        );

        if (rows.length > 0) {
            res.setHeader('Content-Type', rows[0].mime_type);
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.setHeader('CDN-Cache-Control', 'no-transform');
            return res.send(rows[0].file_data);
        }
    } catch (err) {
        // DB failed, fall through to static files
    }

    // Fall through to static file serving
    next();
});

// Static uploads directory (fallback for any files still on disk)
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, no-transform');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('CDN-Cache-Control', 'no-transform');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Legacy /api/media/* (non-db) — local disk fallback
app.get('/api/media/*', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params[0]);
    if (fs.existsSync(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, no-transform');
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'File not found', path: req.params[0] });
    }
});

// POST /api/migrate-uploads — one-time migration: move old /uploads/ files from disk to DB
app.post('/api/migrate-uploads', async (req, res) => {
    try {
        const pool = (await import('./config/db.js')).default;

        // Find all content items with old /uploads/ URLs
        const [items] = await pool.execute(
            "SELECT id, media_url FROM site_content WHERE media_url LIKE '/uploads/%'"
        );

        let migrated = 0;
        let failed = 0;
        let alreadyInDb = 0;

        for (const item of items) {
            const fileKey = item.media_url.replace('/uploads/', '');
            const filePath = path.join(__dirname, 'uploads', fileKey);

            // Check if already in DB
            const [exists] = await pool.execute(
                'SELECT id FROM media_files WHERE file_key = ?', [fileKey]
            );
            if (exists.length > 0) {
                // Update URL to point to DB endpoint
                await pool.execute(
                    'UPDATE site_content SET media_url = ? WHERE id = ?',
                    [`/api/media/db/${fileKey}`, item.id]
                );
                alreadyInDb++;
                continue;
            }

            // Read from disk and store in DB
            if (fs.existsSync(filePath)) {
                const fileBuffer = fs.readFileSync(filePath);
                const ext = path.extname(filePath).toLowerCase();
                const mimeMap = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webm': 'video/webm' };
                const mime = mimeMap[ext] || 'application/octet-stream';

                await pool.execute(
                    'INSERT IGNORE INTO media_files (file_key, mime_type, file_data, file_size) VALUES (?, ?, ?, ?)',
                    [fileKey, mime, fileBuffer, fileBuffer.length]
                );

                // Update the content URL to DB endpoint
                await pool.execute(
                    'UPDATE site_content SET media_url = ? WHERE id = ?',
                    [`/api/media/db/${fileKey}`, item.id]
                );
                migrated++;
            } else {
                failed++;
            }
        }

        res.json({ message: 'Migration complete', total: items.length, migrated, alreadyInDb, failed });
    } catch (err) {
        console.error('Migration error:', err);
        res.status(500).json({ error: err.message });
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint — tests actual DB connection
app.get('/api/debug', async (req, res) => {
    let dbStatus = 'untested';
    try {
        const pool = (await import('./config/db.js')).default;
        const [rows] = await pool.execute('SELECT 1 as test');
        dbStatus = '✅ connected';
    } catch (err) {
        dbStatus = `❌ ${err.message}`;
    }

    const distPath = path.join(__dirname, '..', 'dist');
    let distFiles = [];
    try {
        if (fs.existsSync(distPath)) {
            distFiles = fs.readdirSync(distPath);
        }
    } catch (e) {
        distFiles = [`error: ${e.message}`];
    }

    res.json({
        database: dbStatus,
        NODE_ENV: process.env.NODE_ENV || 'not set',
        distPath: distPath,
        distExists: fs.existsSync(distPath),
        distFiles: distFiles,
        cwd: process.cwd(),
        dirname: __dirname,
    });
});

// Serve static frontend — always register (dist is committed to repo)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`Not Found. distPath=${distPath}, exists=${fs.existsSync(distPath)}, indexExists=${fs.existsSync(indexPath)}`);
    }
});

// Initialize database tables on startup
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🎬 MG Films API Server running on port ${PORT}`);
    });
});
