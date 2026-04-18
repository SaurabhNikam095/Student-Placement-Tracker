import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import Profile from './pages/Profile';
import Students from './pages/Students';
import Companies from './pages/Companies';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Interviews from './pages/Interviews';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <Router>
      <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Dashboard Routes */}
        {user ? (
          <Route path="/" element={<DashboardLayout user={user} setUser={setUser} />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Overview user={user} />} />
            <Route path="profile" element={<Profile user={user} />} />
            <Route path="students" element={<Students user={user} />} />
            <Route path="companies" element={<Companies user={user} />} />
            <Route path="jobs" element={<Jobs user={user} />} />
            <Route path="applications" element={<Applications user={user} />} />
            <Route path="interviews" element={<Interviews user={user} />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
