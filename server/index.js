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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Debug endpoint to check env vars (remove in production later)
app.get('/api/debug', (req, res) => {
    res.json({
        DB_HOST: process.env.DB_HOST ? '✅ set' : '❌ missing',
        DB_PORT: process.env.DB_PORT ? '✅ set' : '❌ missing',
        DB_USER: process.env.DB_USER ? '✅ set' : '❌ missing',
        DB_PASSWORD: process.env.DB_PASSWORD ? '✅ set' : '❌ missing',
        DB_NAME: process.env.DB_NAME ? '✅ set' : '❌ missing',
        DB_SSL: process.env.DB_SSL || 'not set',
        JWT_SECRET: process.env.JWT_SECRET ? '✅ set' : '❌ missing',
        NODE_ENV: process.env.NODE_ENV || 'not set',
        PORT: process.env.PORT || 'not set',
    });
});

// Serve static frontend (always — dist is committed to repo)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// Initialize database tables on startup
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🎬 MG Films API Server running on port ${PORT}`);
    });
});
