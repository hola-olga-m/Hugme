import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHug } from '../../contexts/HugContext';
import { useTheme } from '../../contexts/ThemeContext';
import Loading from '../common/Loading';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { receivedHugs, sentHugs, hugRequests } = useHug();
  const { currentMood } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    streak: 0,
    moodEntries: 0,
    hugsSent: 0,
    hugsReceived: 0,
    pendingRequests: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simulate fetching dashboard data
    const loadDashboardData = async () => {
      try {
        // In a real implementation, this would call your API service
        // For now, we'll use the data from contexts
        setTimeout(() => {
          setStats({
            streak: currentUser?.streak || 0,
            moodEntries: currentUser?.moodEntries?.length || 0,
            hugsSent: sentHugs?.length || 0,
            hugsReceived: receivedHugs?.length || 0,
            pendingRequests: hugRequests?.filter(req => req.status === 'pending')?.length || 0
          });
          
          // Combine activities
          const activities = [
            ...(receivedHugs || []).map(hug => ({
              type: 'hug_received',
              timestamp: new Date(hug.createdAt),
              data: hug
            })),
            ...(sentHugs || []).map(hug => ({
              type: 'hug_sent',
              timestamp: new Date(hug.createdAt),
              data: hug
            })),
            ...(currentUser?.moodEntries || []).map(entry => ({
              type: 'mood_update',
              timestamp: new Date(entry.createdAt),
              data: entry
            })),
            ...(hugRequests || []).map(request => ({
              type: 'hug_request',
              timestamp: new Date(request.createdAt),
              data: request
            }))
          ];
          
          // Sort by timestamp (newest first) and take top 5
          activities.sort((a, b) => b.timestamp - a.timestamp);
          setRecentActivity(activities.slice(0, 5));
          
          setIsLoading(false);
        }, 1000); // Simulate network delay
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [currentUser, receivedHugs, sentHugs, hugRequests]);

  if (isLoading) {
    return <Loading text="Loading dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {currentUser?.name || 'Friend'}!</h1>
        <p className="greeting-message">
          {getGreetingByTime()} How are you feeling today?
        </p>
        
        {currentMood ? (
          <div className="current-mood">
            <p>You're feeling <span className="mood-value">{currentMood}</span> today</p>
            <Link to="/mood/update" className="update-mood-btn">Update Mood</Link>
          </div>
        ) : (
          <div className="no-mood">
            <p>You haven't logged your mood today</p>
            <Link to="/mood/update" className="record-mood-btn">Record Your Mood</Link>
          </div>
        )}
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card streak">
          <div className="stat-icon">
            <i className="fas fa-fire"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.streak} Days</h3>
            <p className="stat-label">Current Streak</p>
          </div>
        </div>
        
        <div className="stat-card mood-entries">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.moodEntries}</h3>
            <p className="stat-label">Mood Entries</p>
          </div>
        </div>
        
        <div className="stat-card hugs-sent">
          <div className="stat-icon">
            <i className="fas fa-heart"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.hugsSent}</h3>
            <p className="stat-label">Hugs Sent</p>
          </div>
        </div>
        
        <div className="stat-card hugs-received">
          <div className="stat-icon">
            <i className="fas fa-hands-helping"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.hugsReceived}</h3>
            <p className="stat-label">Hugs Received</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="dashboard-section requests">
          <div className="section-header">
            <h2>Hug Requests</h2>
            <Link to="/hugs/requests" className="section-link">
              View All <i className="fas fa-chevron-right"></i>
            </Link>
          </div>
          
          {stats.pendingRequests > 0 ? (
            <div className="pending-requests">
              <div className="request-icon">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <div className="request-content">
                <p>You have <strong>{stats.pendingRequests}</strong> pending hug requests</p>
                <Link to="/hugs/requests" className="respond-btn">
                  Respond Now
                </Link>
              </div>
            </div>
          ) : (
            <div className="no-requests">
              <p>No pending hug requests</p>
              <p className="secondary-text">You're all caught up!</p>
            </div>
          )}
        </div>
        
        <div className="dashboard-section quick-actions">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          
          <div className="action-buttons">
            <Link to="/hugs/send" className="action-btn send-hug">
              <i className="fas fa-heart"></i>
              <span>Send a Hug</span>
            </Link>
            
            <Link to="/hugs/request" className="action-btn request-hug">
              <i className="fas fa-hand-holding-heart"></i>
              <span>Request a Hug</span>
            </Link>
            
            <Link to="/mood/history" className="action-btn view-moods">
              <i className="fas fa-chart-bar"></i>
              <span>View Mood History</span>
            </Link>
            
            <Link to="/friends" className="action-btn find-friends">
              <i className="fas fa-user-friends"></i>
              <span>Find Friends</span>
            </Link>
          </div>
        </div>
        
        <div className="dashboard-section recent-activity">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link to="/activity" className="section-link">
              View All <i className="fas fa-chevron-right"></i>
            </Link>
          </div>
          
          {recentActivity.length > 0 ? (
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className={`activity-item ${activity.type}`}>
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      {getActivityText(activity)}
                    </p>
                    <p className="activity-time">
                      {formatActivityTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activity">
              <p>No recent activity</p>
              <p className="secondary-text">Your activity will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getGreetingByTime() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 17) return 'Good afternoon!';
  return 'Good evening!';
}

function getActivityIcon(activityType) {
  switch (activityType) {
    case 'hug_received':
      return <i className="fas fa-heart"></i>;
    case 'hug_sent':
      return <i className="fas fa-paper-plane"></i>;
    case 'mood_update':
      return <i className="fas fa-smile"></i>;
    case 'hug_request':
      return <i className="fas fa-hand-holding-heart"></i>;
    default:
      return <i className="fas fa-bell"></i>;
  }
}

function getActivityText(activity) {
  switch (activity.type) {
    case 'hug_received':
      return `You received a ${activity.data.hugType} hug from ${activity.data.senderName}`;
    case 'hug_sent':
      return `You sent a ${activity.data.hugType} hug to ${activity.data.recipientName}`;
    case 'mood_update':
      return `You updated your mood to ${activity.data.mood}`;
    case 'hug_request':
      return activity.data.isPublic
        ? 'You requested a hug from the community'
        : `You requested a hug from ${activity.data.recipientName}`;
    default:
      return 'Unknown activity';
  }
}

function formatActivityTime(timestamp) {
  // Simple relative time formatting
  const now = new Date();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  // Fall back to date
  return timestamp.toLocaleDateString();
}

export default Dashboard;