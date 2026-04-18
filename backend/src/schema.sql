-- Users (Admin or Student)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' -- 'admin' or 'student'
);

-- Students Profile (Linked to Users)
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL,
    branch TEXT NOT NULL,
    graduation_year INTEGER NOT NULL,
    cgpa REAL NOT NULL,
    skills TEXT, -- comma separated
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    industry TEXT,
    description TEXT,
    website TEXT
);

-- Job Openings
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    package TEXT, -- e.g., '10 LPA'
    eligibility_cgpa REAL,
    FOREIGN KEY(company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, short-listed, rejected, hired
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Interviews
CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    round_name TEXT NOT NULL, -- 'Aptitude', 'Technical', 'HR'
    status TEXT DEFAULT 'scheduled', -- scheduled, passed, failed
    feedback TEXT,
    FOREIGN KEY(application_id) REFERENCES applications(id) ON DELETE CASCADE
);
