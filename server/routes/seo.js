import { Router } from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/seo/:page — public, get SEO for a page
router.get('/:page', async (req, res) => {
    try {
        const { page } = req.params;
        const [rows] = await pool.execute('SELECT * FROM seo_settings WHERE page = ?', [page]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'SEO settings not found for this page.' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('SEO fetch error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/seo — admin, get all SEO settings
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM seo_settings ORDER BY page ASC');
        res.json(rows);
    } catch (err) {
        console.error('SEO fetch error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// PUT /api/seo/:page — admin, update SEO settings
router.put('/:page', authenticateToken, async (req, res) => {
    try {
        const { page } = req.params;
        const { meta_title, meta_description, meta_keywords } = req.body;

        const [existing] = await pool.execute('SELECT id FROM seo_settings WHERE page = ?', [page]);

        if (existing.length === 0) {
            await pool.execute(
                'INSERT INTO seo_settings (page, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?)',
                [page, meta_title || '', meta_description || '', meta_keywords || '']
            );
        } else {
            await pool.execute(
                'UPDATE seo_settings SET meta_title = ?, meta_description = ?, meta_keywords = ? WHERE page = ?',
                [meta_title || '', meta_description || '', meta_keywords || '', page]
            );
        }

        res.json({ message: 'SEO settings updated.' });
    } catch (err) {
        console.error('SEO update error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;
