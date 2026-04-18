const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { runAsync, getAsync } = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const existingUser = await getAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userRole = role === 'admin' ? 'admin' : 'student';

        const result = await runAsync(
            'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
            [email, hashedPassword, userRole]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.lastID });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await getAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
