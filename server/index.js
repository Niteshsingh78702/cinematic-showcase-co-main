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

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Upload directory for media files
// Set headers to bypass Hostinger CDN image processing (prevents 422 errors)
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, no-transform');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('CDN-Cache-Control', 'no-transform');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Also serve uploads via API route as CDN-bypass fallback
app.get('/api/media/*', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params[0]);
    if (fs.existsSync(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, no-transform');
        res.setHeader('CDN-Cache-Control', 'no-transform');
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'File not found', path: req.params[0] });
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
