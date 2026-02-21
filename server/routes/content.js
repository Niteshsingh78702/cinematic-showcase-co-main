import { Router } from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/content — public, get all active content
router.get('/', async (req, res) => {
    try {
        const { section } = req.query;
        let query = 'SELECT * FROM site_content WHERE is_active = TRUE';
        const params = [];

        if (section) {
            query += ' AND section = ?';
            params.push(section);
        }

        query += ' ORDER BY display_order ASC';

        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (err) {
        console.error('Content fetch error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/content/all — admin, get all content including inactive
router.get('/all', authenticateToken, async (req, res) => {
    try {
        const { section } = req.query;
        let query = 'SELECT * FROM site_content';
        const params = [];

        if (section) {
            query += ' WHERE section = ?';
            params.push(section);
        }

        query += ' ORDER BY display_order ASC';

        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (err) {
        console.error('Content fetch error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /api/content — admin, add new content
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { section, title, description, media_url, media_type, link_url, category, display_order } = req.body;

        if (!section) {
            return res.status(400).json({ error: 'Section is required.' });
        }

        const [result] = await pool.execute(
            'INSERT INTO site_content (section, title, description, media_url, media_type, link_url, category, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [section, title || '', description || '', media_url || null, media_type || 'image', link_url || null, category || null, display_order || 0]
        );

        res.status(201).json({ id: result.insertId, message: 'Content added.' });
    } catch (err) {
        console.error('Content add error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// PUT /api/content/:id — admin, update content
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, media_url, media_type, link_url, category, display_order, is_active } = req.body;

        const [result] = await pool.execute(
            'UPDATE site_content SET title = ?, description = ?, media_url = ?, media_type = ?, link_url = ?, category = ?, display_order = ?, is_active = ? WHERE id = ?',
            [title, description, media_url || null, media_type || 'image', link_url || null, category || null, display_order || 0, is_active !== undefined ? is_active : true, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Content not found.' });
        }

        res.json({ message: 'Content updated.' });
    } catch (err) {
        console.error('Content update error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// DELETE /api/content/:id — admin, delete content
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.execute('DELETE FROM site_content WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Content not found.' });
        }

        res.json({ message: 'Content deleted.' });
    } catch (err) {
        console.error('Content delete error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;
