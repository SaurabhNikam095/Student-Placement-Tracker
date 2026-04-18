import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function Register({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { email, password, role });
      const loginRes = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));
      setUser(loginRes.data.user);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '400px', zIndex: 10 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <GraduationCap size={48} className="text-primary" style={{ margin: '0 auto', color: 'var(--primary)' }} />
          <h2 style={{ marginTop: '10px' }}>Create Account</h2>
          <p>Join the placement portal</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label">Role</label>
            <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }}>
            Register & Continue
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
