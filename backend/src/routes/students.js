const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { runAsync, getAsync, allAsync } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: './uploads/resumes/',
    filename: function(req, file, cb) {
        cb(null, 'resume-' + req.user.id + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Get all students
router.get('/', authenticateToken, async (req, res) => {
    try {
        const students = await allAsync(`
            SELECT s.*, u.email 
            FROM students s
            JOIN users u ON s.user_id = u.id
        `);
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get student by User ID
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const student = await getAsync(`
            SELECT s.*, u.email 
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE u.id = ?
        `, [req.user.id]);
        
        if (!student) return res.status(404).json({ error: 'Profile not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create/Update Student Profile
router.post('/profile', authenticateToken, async (req, res) => {
    const { name, branch, graduation_year, cgpa, skills } = req.body;
    
    try {
        const existingProfile = await getAsync('SELECT * FROM students WHERE user_id = ?', [req.user.id]);
        
        if (existingProfile) {
            await runAsync(
                'UPDATE students SET name = ?, branch = ?, graduation_year = ?, cgpa = ?, skills = ? WHERE user_id = ?',
                [name, branch, graduation_year, cgpa, skills, req.user.id]
            );
            res.json({ message: 'Profile updated' });
        } else {
            await runAsync(
                'INSERT INTO students (user_id, name, branch, graduation_year, cgpa, skills) VALUES (?, ?, ?, ?, ?, ?)',
                [req.user.id, name, branch, graduation_year, cgpa, skills]
            );
            res.status(201).json({ message: 'Profile created' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload Resume Route
router.post('/profile/resume', authenticateToken, upload.single('resume'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    try {
        const resumePath = '/uploads/resumes/' + req.file.filename;
        await runAsync('UPDATE students SET resume_path = ? WHERE user_id = ?', [resumePath, req.user.id]);
        res.json({ message: 'Resume uploaded successfully', resume_path: resumePath });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
