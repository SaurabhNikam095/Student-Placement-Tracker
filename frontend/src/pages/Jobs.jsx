import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

function Jobs({ user }) {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ company_id: '', title: '', description: '', package_val: '', eligibility_cgpa: '' });

  useEffect(() => {
    fetchJobs();
    if (user.role === 'admin') fetchCompanies();
  }, [user]);

  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/jobs', { headers: { Authorization: `Bearer ${token}` } });
    setJobs(res.data);
  };

  const fetchCompanies = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/companies', { headers: { Authorization: `Bearer ${token}` } });
    setCompanies(res.data);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/jobs', formData, { headers: { Authorization: `Bearer ${token}` } });
      setShowForm(false);
      fetchJobs();
      toast.success("Job listing created successfully!");
    } catch (err) {
      toast.error("Error creating job");
    }
  };

  const applyJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/applications', { job_id: jobId }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Applied successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error applying");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Job Openings</h2>
          <p>Explore and apply for placement opportunities</p>
        </div>
        {user.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Create New Job'}
          </button>
        )}
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="glass-card" 
            style={{ marginBottom: '30px', overflow: 'hidden' }}
          >
            <h3>Post a New Job</h3>
            <form onSubmit={handleCreateJob} style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="input-group">
                <label className="input-label">Company</label>
                <select className="input-field" required onChange={e => setFormData({...formData, company_id: e.target.value})}>
                  <option value="">Select Company</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Job Title</label>
                <input className="input-field" required onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Package (e.g. 10 LPA)</label>
                <input className="input-field" required onChange={e => setFormData({...formData, package_val: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Eligibility CGPA</label>
                <input className="input-field" type="number" step="0.1" required onChange={e => setFormData({...formData, eligibility_cgpa: e.target.value})} />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Description</label>
                <textarea className="input-field" rows="3" required onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit Job Listing</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {jobs.map((job, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.05 }} 
            key={job.id} 
            className="glass-card glass-card-interactive"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                <Briefcase size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{job.title}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 500 }}>{job.company_name}</p>
              </div>
            </div>
            
            <p style={{ fontSize: '0.9rem', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {job.description}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Package</span> <strong style={{fontSize: '1rem'}}>{job.package}</strong></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Min CGPA</span> <strong style={{fontSize: '1rem'}}>{job.eligibility_cgpa}</strong></div>
            </div>

            {user.role === 'student' && job.ai_score !== undefined && (
              <div style={{ marginBottom: '15px', padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>✨ AI Match</span>
                <span className={`badge ${job.ai_score > 75 ? 'badge-success' : job.ai_score > 40 ? 'badge-warning' : 'badge-danger'}`}>
                  {job.ai_score}% Match
                </span>
              </div>
            )}

            {user.role === 'student' && (
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} onClick={() => applyJob(job.id)}>
                Apply Now
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Jobs;
