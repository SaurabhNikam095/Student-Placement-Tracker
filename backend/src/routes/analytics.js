const express = require('express');
const router = express.Router();
const { allAsync } = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        // App pipeline status
        const pipelineData = await allAsync(`
            SELECT status, COUNT(*) as count 
            FROM applications 
            GROUP BY status
        `);

        // Jobs by company
        const jobsByCompanyData = await allAsync(`
            SELECT c.name, COUNT(j.id) as count 
            FROM companies c
            LEFT JOIN jobs j ON c.id = j.company_id
            GROUP BY c.id
            ORDER BY count DESC
            LIMIT 5
        `);

        res.json({
            pipeline: pipelineData,
            jobsByCompany: jobsByCompanyData
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
