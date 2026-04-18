import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function Applications({ user }) {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApps();
  }, [user]);

  const fetchApps = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Application status updated");
      fetchApps();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const scheduleInterview = async (id) => {
    const roundName = prompt('Enter interview round (e.g., Technical, HR):');
    if (!roundName) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/interviews', { application_id: id, round_name: roundName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Interview for ${roundName} round scheduled!`);
    } catch (err) {
      toast.error("Error scheduling interview");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'hired': return 'badge-success';
      case 'rejected': return 'badge-danger';
      case 'short-listed': return 'badge-primary';
      default: return 'badge-warning';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <header style={{ marginBottom: '30px' }}>
        <h2>{user.role === 'admin' ? 'All Applications' : 'My Applications'}</h2>
        <p>Track the status of job applications</p>
      </header>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border)' }}>
              {user.role === 'admin' && <th style={{ padding: '16px' }}>Candidate</th>}
              {user.role === 'admin' && <th style={{ padding: '16px' }}>Resume</th>}
              <th style={{ padding: '16px' }}>Job Title</th>
              <th style={{ padding: '16px' }}>Company</th>
              <th style={{ padding: '16px' }}>Status</th>
              {user.role === 'admin' && <th style={{ padding: '16px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 ? (
              <tr><td colSpan={user.role === 'admin' ? "6" : "3"} style={{ padding: '20px', textAlign: 'center' }}>No applications yet.</td></tr>
            ) : (
              apps.map(app => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  key={app.id} 
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {user.role === 'admin' && <td style={{ padding: '16px', fontWeight: 500 }}>{app.student_name}</td>}
                  {user.role === 'admin' && (
                    <td style={{ padding: '16px' }}>
                      {app.resume_path ? (
                        <a href={`http://localhost:5000${app.resume_path}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem' }}>View PDF</a>
                      ) : (
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None</span>
                      )}
                    </td>
                  )}
                  <td style={{ padding: '16px', fontWeight: 500 }}>{app.job_title}</td>
                  <td style={{ padding: '16px' }}>{app.company_name}</td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge ${getStatusBadge(app.status)}`}>{app.status}</span>
                  </td>
                  {user.role === 'admin' && (
                    <td style={{ padding: '16px', display: 'flex', gap: '10px' }}>
                      <select 
                        className="input-field" 
                        style={{ padding: '8px', fontSize: '0.85rem' }} 
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="short-listed">Short-List</option>
                        <option value="rejected">Reject</option>
                        <option value="hired">Hire</option>
                      </select>
                      <button className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '0.8rem' }} onClick={() => scheduleInterview(app.id)}>
                        + Schedule Round
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default Applications;
