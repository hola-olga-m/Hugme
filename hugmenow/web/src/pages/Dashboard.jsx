import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        {currentUser && (
          <div className="user-welcome">
            <p>Hello, {currentUser.name || currentUser.username || 'User'}!</p>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Your Mood Tracker</h2>
          <p>Track your daily moods and see patterns over time.</p>
          <button className="btn btn-primary">Record Mood</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Hug Center</h2>
          <p>Send and receive virtual hugs to support others.</p>
          <button className="btn btn-primary">Send a Hug</button>
        </div>
        
        <div className="dashboard-card">
          <h2>Community</h2>
          <p>Connect with others and share support.</p>
          <button className="btn btn-primary">View Community</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;