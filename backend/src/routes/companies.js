const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all companies
router.get('/', authenticateToken, async (req, res) => {
    try {
        const companies = await allAsync('SELECT * FROM companies');
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get specific company
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const company = await getAsync('SELECT * FROM companies WHERE id = ?', [req.params.id]);
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Add Company
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    const { name, industry, description, website } = req.body;
    
    if (!name) return res.status(400).json({ error: 'Company name is required' });

    try {
        const result = await runAsync(
            'INSERT INTO companies (name, industry, description, website) VALUES (?, ?, ?, ?)',
            [name, industry, description, website]
        );
        res.status(201).json({ message: 'Company added', id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
