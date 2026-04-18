import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function Students({ user }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (user.role !== 'admin') {
    return <h2>Access Denied</h2>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <header style={{ marginBottom: '30px' }}>
        <h2>Students Directory</h2>
        <p>View all registered students and their profiles</p>
      </header>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px' }}>Name</th>
              <th style={{ padding: '16px' }}>Email</th>
              <th style={{ padding: '16px' }}>Branch</th>
              <th style={{ padding: '16px' }}>Grad Year</th>
              <th style={{ padding: '16px' }}>CGPA</th>
              <th style={{ padding: '16px' }}>Skills</th>
              <th style={{ padding: '16px' }}>Resume</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>No students found.</td></tr>
            ) : (
              students.map(student => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  key={student.id} 
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <td style={{ padding: '16px', fontWeight: 500 }}>{student.name || 'N/A'}</td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{student.email}</td>
                  <td style={{ padding: '16px' }}>{student.branch || '-'}</td>
                  <td style={{ padding: '16px' }}>{student.graduation_year || '-'}</td>
                  <td style={{ padding: '16px', fontWeight: 500, color: 'var(--primary)' }}>{student.cgpa || '-'}</td>
                  <td style={{ padding: '16px', fontSize: '0.85rem' }}>{student.skills || '-'}</td>
                  <td style={{ padding: '16px' }}>
                      {student.resume_path ? (
                        <a href={`http://localhost:5000${student.resume_path}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--success)' }}>View PDF</a>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None</span>
                      )}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default Students;
