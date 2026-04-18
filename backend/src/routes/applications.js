const express = require('express');
const router = express.Router();
const { runAsync, getAsync, allAsync } = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all applications (Admin) or My Applications (Student)
router.get('/', authenticateToken, async (req, res) => {
    try {
        let query = `
            SELECT a.*, j.title as job_title, c.name as company_name, s.name as student_name, s.resume_path
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN companies c ON j.company_id = c.id
            JOIN students s ON a.student_id = s.id
        `;
        let params = [];
        
        if (req.user.role !== 'admin') {
            const student = await getAsync('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
            if (!student) return res.status(404).json({ error: 'Student profile not found. Complete profile first.' });
            
            query += ' WHERE a.student_id = ?';
            params.push(student.id);
        }
        
        const applications = await allAsync(query, params);
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Student: Apply for a job
router.post('/', authenticateToken, async (req, res) => {
    const { job_id } = req.body;
    
    if (req.user.role === 'admin') {
        return res.status(403).json({ error: 'Admins cannot apply for jobs' });
    }

    try {
        const student = await getAsync('SELECT id, cgpa FROM students WHERE user_id = ?', [req.user.id]);
        if (!student) return res.status(400).json({ error: 'Complete your student profile first' });

        const job = await getAsync('SELECT eligibility_cgpa FROM jobs WHERE id = ?', [job_id]);
        if (!job) return res.status(404).json({ error: 'Job not found' });

        if (student.cgpa < job.eligibility_cgpa) {
            return res.status(400).json({ error: 'CGPA does not meet eligibility criteria' });
        }

        const existingApp = await getAsync('SELECT * FROM applications WHERE student_id = ? AND job_id = ?', [student.id, job_id]);
        if (existingApp) return res.status(400).json({ error: 'Already applied for this job' });

        const result = await runAsync(
            'INSERT INTO applications (student_id, job_id, status) VALUES (?, ?, ?)',
            [student.id, job_id, 'pending']
        );
        res.status(201).json({ message: 'Applied successfully', id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Update application status
router.put('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    const { status } = req.body; // 'short-listed', 'rejected', 'hired'
    
    try {
        await runAsync('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
