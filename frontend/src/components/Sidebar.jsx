import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, GraduationCap, LogOut, Building2, CalendarCheck } from 'lucide-react';

function Sidebar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    `btn btn-outline ${isActive ? 'btn-primary' : ''}`;

  return (
    <aside className="sidebar">
      <div style={{ padding: '0 24px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GraduationCap className="text-primary" /> Placement Cell
        </h2>
        <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
          Role: <span className="badge badge-primary">{user.role}</span>
        </p>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 16px', flex: 1 }}>
        <NavLink to="/dashboard" className={navClass}>
          <LayoutDashboard size={18} /> Overview
        </NavLink>
        {user.role === 'student' && (
          <NavLink to="/profile" className={navClass}>
            <Users size={18} /> My Profile
          </NavLink>
        )}
        {user.role === 'admin' && (
          <NavLink to="/students" className={navClass}>
            <Users size={18} /> Students Directory
          </NavLink>
        )}
        <NavLink to="/companies" className={navClass}>
          <Building2 size={18} /> Partner Companies
        </NavLink>
        <NavLink to="/jobs" className={navClass}>
          <Briefcase size={18} /> Job Openings
        </NavLink>
        <NavLink to="/applications" className={navClass}>
          <GraduationCap size={18} /> {user.role === 'admin' ? 'All Applications' : 'My Applications'}
        </NavLink>
        {user.role === 'admin' && (
          <NavLink to="/interviews" className={navClass}>
            <CalendarCheck size={18} /> Interview Tracking
          </NavLink>
        )}
      </nav>

      <div style={{ padding: '0 16px' }}>
        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
