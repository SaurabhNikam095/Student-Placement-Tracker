require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./src/db'); // ensure DB connects on start

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/students', require('./src/routes/students'));
app.use('/api/companies', require('./src/routes/companies'));
app.use('/api/jobs', require('./src/routes/jobs'));
app.use('/api/applications', require('./src/routes/applications'));
app.use('/api/interviews', require('./src/routes/interviews'));
app.use('/api/analytics', require('./src/routes/analytics'));

// Base Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Student Placement Tracker API' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
