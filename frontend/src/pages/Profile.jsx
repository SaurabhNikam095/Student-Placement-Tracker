import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function Profile({ user }) {
  const [formData, setFormData] = useState({ name: '', branch: '', graduation_year: '', cgpa: '', skills: '' });
  const [resumePath, setResumePath] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/students/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setFormData({
          name: res.data.name || '',
          branch: res.data.branch || '',
          graduation_year: res.data.graduation_year || '',
          cgpa: res.data.cgpa || '',
          skills: res.data.skills || ''
        });
        setResumePath(res.data.resume_path);
      }
    } catch (err) {
      console.log('No profile exists yet');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:5000/api/students/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resumeFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('resume', resumeFile);
        const resUpload = await axios.post('http://localhost:5000/api/students/profile/resume', formDataUpload, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        setResumePath(resUpload.data.resume_path);
      }

      toast.success('Profile saved successfully! 🎉');
    } catch (err) {
      toast.error('Failed to save profile');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <header style={{ marginBottom: '30px' }}>
        <h2>My Profile</h2>
        <p>Complete your profile to become eligible to apply for jobs.</p>
      </header>
      
      <div className="glass-card" style={{ maxWidth: '650px' }}>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">Branch (e.g. Computer Science)</label>
              <input className="input-field" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} required />
            </div>
            <div className="input-group">
              <label className="input-label">Graduation Year</label>
              <input type="number" className="input-field" value={formData.graduation_year} onChange={e => setFormData({...formData, graduation_year: e.target.value})} required />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">CGPA (Required for Job Eligibility)</label>
            <input type="number" step="0.1" className="input-field" value={formData.cgpa} onChange={e => setFormData({...formData, cgpa: e.target.value})} required />
          </div>
          <div className="input-group">
            <label className="input-label">Skills (Comma separated)</label>
            <input className="input-field" placeholder="React, Node, SQL..." value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '8px', fontWeight: 500 }}>
              ✨ These skills are used by our AI algorithm to dynamically match you to jobs.
            </span>
          </div>
          <div className="input-group" style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
            <label className="input-label" style={{ marginBottom: '10px' }}>Upload Resume (PDF)</label>
            {resumePath && <p style={{ fontSize:'0.85rem', color: 'var(--success)', marginBottom: '10px' }}>✓ Current Resume Active: <a href={`http://localhost:5000${resumePath}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>View PDF</a></p>}
            <input type="file" className="input-field" style={{ padding: '10px' }} accept="application/pdf" onChange={e => setResumeFile(e.target.files[0])} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Save Profile Changes</button>
        </form>
      </div>
    </motion.div>
  );
}

export default Profile;
