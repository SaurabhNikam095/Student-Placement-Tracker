# 🚀 Student Placement Tracker

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express-black)
![SQLite](https://img.shields.io/badge/Database-SQLite-orange)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow)
![Docker](https://img.shields.io/badge/Containerized-Docker-blue)

A full-stack **Placement Management System** that streamlines the recruitment workflow for students and administrators, replacing manual processes with a centralized digital platform.

---

## 📌 Overview

The **Student Placement Tracker** is a role-based system that enables:

* Students to manage profiles and apply for jobs
* Admins to manage companies, jobs, and hiring workflows
* Tracking of interview rounds and application progress
* Visualization of placement analytics

---

## ❗ Problem Statement

Traditional placement systems rely on manual processes like spreadsheets and messaging, leading to:

* lack of centralized data
* poor tracking of applications
* inefficient interview management
* no analytics or insights

This project solves these issues with a structured and scalable system.

---

## ⚙️ Core Features

### 🔐 Authentication
* JWT-based authentication
* Role-based access control (Admin / Student)

### 🧑‍🎓 Student Features
* Profile creation and update
* Resume upload
* View eligible jobs
* Apply for jobs
* Track application and interview status

### 🛠️ Admin Features
* Manage students
* Add companies
* Create job postings
* Track applications
* Manage interview rounds
* Update hiring status

### 📊 Analytics
* Total students
* Total jobs
* Total applications
* Hired candidates
* Branch-wise insights
* Monthly trends

### 💡 Advanced Features
* Skill-based job matching
* Eligibility filtering
* Dashboard insights
---

## 🧠 System Architecture
```
React (Frontend)
        ↓
REST API (Node.js + Express)
        ↓
SQLite Database
```


## 🗂️ Project Structure

```
student_placement_tracker/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── schema.sql
│   │   └── db.js
│   ├── uploads/
│   ├── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── api.js
│
├── docker-compose.yml
└── README.md
```

---

## 🧩 Tech Stack

### Frontend

* React
* Axios
* React Router
* Recharts
* Framer Motion

### Backend

* Node.js
* Express.js
* JWT
* bcrypt
* multer

### Database
* SQLite

## 🚀 How to Run the Project
#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run dev

## 📊 Workflow
### Student Flow
1. Register
2. Create profile
3. Upload resume
4. Apply for jobs
5. Track status

### Admin Flow
1. Login
2. Add company
3. Create job
4. Track applications
5. Manage interviews
6. Final selection

## 🌟 Key Highlights

* Full-stack real-world application
* Role-based architecture
* REST API design
* SQL database relationships
* Analytics dashboard
* Dockerized setup

## 👨‍💻 Author
**Saurabh Nikam**

## ⭐ Support
If you like this project, give it a ⭐ on GitHub!
