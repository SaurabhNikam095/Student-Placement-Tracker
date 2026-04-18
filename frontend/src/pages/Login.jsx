import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
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
          <h2 style={{ marginTop: '10px' }}>Welcome Back</h2>
          <p>Login to your placement dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '12px' }}>
            Sign In
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
