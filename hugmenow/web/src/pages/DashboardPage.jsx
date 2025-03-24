import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { GET_USER_STATS } from '../graphql/queries';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    moodStreak: 0,
    totalMoods: 0,
    totalHugsSent: 0,
    totalHugsReceived: 0,
  });

  const { data, loading, error } = useQuery(GET_USER_STATS, {
    skip: !currentUser,
  });

  useEffect(() => {
    if (data) {
      setStats({
        moodStreak: data.moodStreak || 0,
        totalMoods: data.userMoods?.length || 0,
        totalHugsSent: data.sentHugs?.length || 0,
        totalHugsReceived: data.receivedHugs?.length || 0,
      });
    }
  }, [data]);

  if (loading) return <div className="loading-spinner centered">Loading dashboard...</div>;

  if (error) {
    console.error('Dashboard query error:', error);
    return (
      <div className="error-message">
        <p>Error loading dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome, {currentUser?.name || 'Friend'}!</h1>
        <p className="dashboard-subtitle">Your emotional wellness hub</p>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Mood Streak</h3>
            <p className="stat-value">{stats.moodStreak} days</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Total Moods</h3>
            <p className="stat-value">{stats.totalMoods}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🤗</div>
          <div className="stat-content">
            <h3>Hugs Sent</h3>
            <p className="stat-value">{stats.totalHugsSent}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💌</div>
          <div className="stat-content">
            <h3>Hugs Received</h3>
            <p className="stat-value">{stats.totalHugsReceived}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <div className="action-card">
          <h3>Track Today's Mood</h3>
          <p>How are you feeling today? Track your mood to maintain your streak.</p>
          <Link to="/mood-tracker" className="btn btn-primary">
            Track Mood
          </Link>
        </div>

        <div className="action-card">
          <h3>Send a Hug</h3>
          <p>Brighten someone's day with a virtual hug.</p>
          <Link to="/hug-center" className="btn btn-primary">
            Send Hug
          </Link>
        </div>

        <div className="action-card">
          <h3>View Your Moods</h3>
          <p>See your mood history and trends.</p>
          <Link to="/mood-history" className="btn btn-outline">
            View History
          </Link>
        </div>

        <div className="action-card">
          <h3>Manage Profile</h3>
          <p>Update your personal information and preferences.</p>
          <Link to="/profile" className="btn btn-outline">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;