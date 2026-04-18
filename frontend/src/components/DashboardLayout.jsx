import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function DashboardLayout({ user, setUser }) {
  return (
    <div className="app-container">
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <Sidebar user={user} setUser={setUser} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
