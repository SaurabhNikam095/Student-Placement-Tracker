const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get interviews for an application
router.get('/application/:application_id', authenticateToken, async (req, res) => {
    try {
        const interviews = await allAsync(
            'SELECT * FROM interviews WHERE application_id = ?', 
            [req.params.application_id]
        );
        res.json(interviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get all interviews globally
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const interviews = await allAsync(`
            SELECT i.*, a.status as app_status, s.name as student_name, j.title as job_title, c.name as company_name
            FROM interviews i
            JOIN applications a ON i.application_id = a.id
            JOIN students s ON a.student_id = s.id
            JOIN jobs j ON a.job_id = j.id
            JOIN companies c ON j.company_id = c.id
        `);
        res.json(interviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Schedule an interview
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    const { application_id, round_name } = req.body;
    
    if (!application_id || !round_name) {
        return res.status(400).json({ error: 'Application ID and Round Name are required' });
    }

    try {
        const result = await runAsync(
            'INSERT INTO interviews (application_id, round_name, status) VALUES (?, ?, ?)',
            [application_id, round_name, 'scheduled']
        );
        res.status(201).json({ message: 'Interview scheduled', id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update interview status/feedback
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    const { status, feedback } = req.body;
    
    try {
        await runAsync(
            'UPDATE interviews SET status = ?, feedback = ? WHERE id = ?',
            [status, feedback, req.params.id]
        );
        res.json({ message: 'Interview updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
