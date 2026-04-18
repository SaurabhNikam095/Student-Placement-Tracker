const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Helper for AI text similarity: Jaccard-like index
function calculateSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;
    const words1 = str1.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(w => w.length > 2);
    const words2 = str2.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(w => w.length > 2);
    
    if (words1.length === 0 || words2.length === 0) return 0;

    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    
    // Instead of raw jaccard, we measure what % of Job Keywords are satisfied by Student Skills
    return Math.round((intersection.size / set2.size) * 100);
}

// Get all jobs with company names, and inject AI match score for Students
router.get('/', authenticateToken, async (req, res) => {
    try {
        const jobs = await allAsync(`
            SELECT j.*, c.name as company_name 
            FROM jobs j
            JOIN companies c ON j.company_id = c.id
        `);

        // If it's a student, calculate their match score
        if (req.user.role === 'student') {
            const student = await getAsync('SELECT skills FROM students WHERE user_id = ?', [req.user.id]);
            const studentSkills = student ? student.skills : '';

            const jobsWithScores = jobs.map(job => {
                const ai_score = calculateSimilarity(studentSkills, job.description);
                return { ...job, ai_score };
            });
            return res.json(jobsWithScores);
        }

        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Create job opening
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    const { company_id, title, description, package_val, eligibility_cgpa } = req.body;
    
    if (!company_id || !title) return res.status(400).json({ error: 'Company ID and Title are required' });

    try {
        const result = await runAsync(
            'INSERT INTO jobs (company_id, title, description, package, eligibility_cgpa) VALUES (?, ?, ?, ?, ?)',
            [company_id, title, description, package_val, eligibility_cgpa]
        );
        res.status(201).json({ message: 'Job created', id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
