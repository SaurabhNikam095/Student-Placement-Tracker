import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

function Overview({ user }) {
  const [stats, setStats] = useState({ students: 0, jobs: 0, companies: 0, apps: 0 });
  const [analytics, setAnalytics] = useState({ pipeline: [], jobsByCompany: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        // Load counts
        let stuCount = 0;
        if (user.role === 'admin') {
          const stRes = await axios.get('http://localhost:5000/api/students', { headers });
          stuCount = stRes.data.length;
        }
        
        const [compRes, jobsRes, appsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/companies', { headers }),
          axios.get('http://localhost:5000/api/jobs', { headers }),
          axios.get('http://localhost:5000/api/applications', { headers })
        ]);

        setStats({
          students: stuCount,
          companies: compRes.data.length,
          jobs: jobsRes.data.length,
          apps: appsRes.data.length
        });
        
        // Load AI Analytics
        if (user.role === 'admin') {
          const anRes = await axios.get('http://localhost:5000/api/analytics', { headers });
          setAnalytics(anRes.data);
        }

      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    fetchStats();
  }, [user]);

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -5 }}
      className="glass-card glass-card-interactive" 
      style={{ display: 'flex', alignItems: 'center', gap: '20px' }}
    >
      <div style={{ padding: '16px', borderRadius: '12px', background: `var(--bg-surface)` }} className={colorClass}>
        <Icon size={32} />
      </div>
      <div>
        <h3 style={{ fontSize: '2.2rem', margin: 0 }}><CountUp end={value} duration={2.5} /></h3>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>{title}</p>
      </div>
    </motion.div>
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header style={{ marginBottom: '40px' }}>
        <h1>Welcome, {user.role === 'admin' ? 'Administrator' : 'Student'}</h1>
        <p>Here is the overview of the placement tracker</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {user.role === 'admin' && (
          <StatCard title="Total Students" value={stats.students} icon={Users} colorClass="text-primary" />
        )}
        <StatCard title="Partner Companies" value={stats.companies} icon={Building2} colorClass="text-primary" />
        <StatCard title="Active Jobs" value={stats.jobs} icon={Briefcase} colorClass="text-primary" />
        <StatCard title={user.role === 'admin' ? "Total Applications" : "My Applications"} value={stats.apps} icon={GraduationCap} colorClass="text-primary" />
      </div>

      {user.role === 'admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 2fr)', gap: '24px' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '20px' }}>Application Pipeline</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics.pipeline} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                    {analytics.pipeline.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card">
            <h3 style={{ marginBottom: '20px' }}>Top Hiring Companies</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.jobsByCompany}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1d24', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Overview;
