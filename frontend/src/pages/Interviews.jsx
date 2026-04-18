import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function Interviews({ user }) {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/interviews/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status, currentFeedback) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/interviews/${id}`, { status, feedback: currentFeedback }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInterviews();
      toast.success("Interview status updated");
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const updateFeedback = async (id, currentStatus, feedback) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/interviews/${id}`, { status: currentStatus, feedback }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInterviews();
      toast.success("Feedback saved");
    } catch (err) {
      toast.error("Error updating feedback");
    }
  };

  if (user.role !== 'admin') return <h2>Access Denied</h2>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <header style={{ marginBottom: '30px' }}>
        <h2>Interview Tracking</h2>
        <p>Manage scheduled interview rounds and feedback dynamically</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {interviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No interviews scheduled yet. You can schedule them directly from the Applications page.</p>
        ) : (
          interviews.map((inv, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: idx * 0.05 }} 
              key={inv.id} 
              className="glass-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span className={`badge badge-primary`} style={{ fontSize: '0.8rem' }}>{inv.round_name} Round</span>
                <select 
                  className="input-field" 
                  style={{ padding: '6px', fontSize: '0.8rem' }}
                  value={inv.status}
                  onChange={(e) => updateStatus(inv.id, e.target.value, inv.feedback)}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <h3 style={{ fontSize: '1.4rem', margin: '10px 0 5px' }}>{inv.student_name}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {inv.job_title} at <strong style={{ color: 'var(--primary)', fontWeight: 500 }}>{inv.company_name}</strong>
              </p>
              
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                 <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginBottom: '10px', fontWeight: 500 }}>Interview Feedback:</label>
                 <textarea 
                   className="input-field" 
                   style={{ width: '100%', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.05)' }} 
                   rows="3"
                   placeholder="Enter technical/HR notes..."
                   defaultValue={inv.feedback}
                   onBlur={(e) => {
                     if (e.target.value !== inv.feedback) {
                       updateFeedback(inv.id, inv.status, e.target.value);
                     }
                   }}
                 ></textarea>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

export default Interviews;
