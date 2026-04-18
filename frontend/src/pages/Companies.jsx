import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

function Companies({ user }) {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', industry: '', description: '', website: '' });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/companies', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({ name: '', industry: '', description: '', website: '' });
      fetchCompanies();
      toast.success("Partner company added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error adding company");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Partner Companies</h2>
          <p>Directory of companies participating in placement</p>
        </div>
        {user.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add New Company'}
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
            <h3>Add a Partner Company</h3>
            <form onSubmit={handleCreateCompany} style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="input-group">
                <label className="input-label">Company Name</label>
                <input className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Industry</label>
                <input className="input-field" required value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Website</label>
                <input className="input-field" type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Description</label>
                <textarea className="input-field" rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Save Company</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {companies.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No companies have been added yet.</p>
        ) : (
          companies.map((company, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: idx * 0.05 }} 
              key={company.id} 
              className="glass-card glass-card-interactive"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                  <Building2 size={24} className="text-primary" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{company.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 500 }}>{company.industry}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
                {company.description}
              </p>
              {company.website && (
                <a href={company.website} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                  Visit Website &rarr;
                </a>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

export default Companies;
