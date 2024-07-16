// src/pages/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function AdminDashboard() {
  return (
    <div className="container" style={{alignItems:"center"}}>
      <Header />
      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>
        <div className="dashboard-links">
          <Link to="/eventform" className="dashboard-link">Manage Events</Link>
          <Link to="/matching" className="dashboard-link">Match Volunteers</Link>
          <Link to="/profile" className="dashboard-link">View Volunteer Profiles</Link>
          <Link to="/viewevents" className="dashboard-link">View Events</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
