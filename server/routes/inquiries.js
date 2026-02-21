import { Router } from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/inquiries — public, submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, phone, email, event_type, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }

        const [result] = await pool.execute(
            'INSERT INTO inquiries (name, phone, email, event_type, message) VALUES (?, ?, ?, ?, ?)',
            [name, phone || null, email, event_type || null, message]
        );

        res.status(201).json({ id: result.insertId, message: 'Inquiry submitted successfully.' });
    } catch (err) {
        console.error('Inquiry submit error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /api/inquiries — admin, get all inquiries
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('Inquiries fetch error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// PUT /api/inquiries/:id/contacted — admin, mark as contacted
router.put('/:id/contacted', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_contacted } = req.body;

        const [result] = await pool.execute(
            'UPDATE inquiries SET is_contacted = ? WHERE id = ?',
            [is_contacted !== undefined ? is_contacted : true, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Inquiry not found.' });
        }

        res.json({ message: 'Inquiry updated.' });
    } catch (err) {
        console.error('Inquiry update error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// DELETE /api/inquiries/:id — admin, delete inquiry
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.execute('DELETE FROM inquiries WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Inquiry not found.' });
        }

        res.json({ message: 'Inquiry deleted.' });
    } catch (err) {
        console.error('Inquiry delete error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

export default router;
