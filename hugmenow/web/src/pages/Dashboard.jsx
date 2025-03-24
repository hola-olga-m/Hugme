import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { useAuth } from '../context/AuthContext';

// GraphQL queries
const GET_USER_DATA = gql`
  query GetUserData {
    me {
      id
      name
      username
      avatarUrl
      isAnonymous
    }
    userMoods {
      id
      score
      note
      isPublic
      createdAt
    }
    sentHugs {
      id
      type
      message
      recipient {
        id
        name
        username
        avatarUrl
      }
      createdAt
    }
    receivedHugs {
      id
      type
      message
      isRead
      sender {
        id
        name
        username
        avatarUrl
      }
      createdAt
    }
    moodStreak
    myHugRequests {
      id
      message
      status
      isCommunityRequest
      createdAt
    }
    pendingHugRequests {
      id
      message
      requester {
        id
        name
        username
        avatarUrl
      }
      isCommunityRequest
      createdAt
    }
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const { loading, error, data, refetch } = useQuery(GET_USER_DATA);
  const [latestMood, setLatestMood] = useState(null);
  const [unreadHugs, setUnreadHugs] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (data) {
      // Set latest mood
      if (data.userMoods && data.userMoods.length > 0) {
        const sortedMoods = [...data.userMoods].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestMood(sortedMoods[0]);
      }

      // Set unread hugs
      if (data.receivedHugs) {
        setUnreadHugs(data.receivedHugs.filter(hug => !hug.isRead));
      }

      // Set pending requests
      if (data.pendingHugRequests) {
        setPendingRequests(data.pendingHugRequests);
      }
    }
  }, [data]);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  
  if (error) return <div className="error">Error loading dashboard: {error.message}</div>;

  const getMoodEmoji = (score) => {
    if (score >= 4) return '😄';
    if (score === 3) return '🙂';
    if (score === 2) return '😐';
    if (score === 1) return '😔';
    return '😢';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        
        <div className="dashboard-welcome">
          <h2>
            Welcome back, {user?.name || 'User'}!
            {user?.isAnonymous && <span className="anonymous-tag"> (Guest)</span>}
          </h2>
        </div>
        
        <div className="dashboard-grid">
          {/* Mood Summary */}
          <div className="dashboard-card mood-summary">
            <h3>Mood Summary</h3>
            
            {latestMood ? (
              <div className="latest-mood">
                <div className="mood-emoji">{getMoodEmoji(latestMood.score)}</div>
                <div className="mood-details">
                  <p>Your latest mood: <strong>{latestMood.score}/5</strong></p>
                  {latestMood.note && <p className="mood-note">"{latestMood.note}"</p>}
                  <p className="mood-time">Recorded: {formatDate(latestMood.createdAt)}</p>
                </div>
              </div>
            ) : (
              <div className="no-mood">
                <p>You haven't recorded your mood yet</p>
              </div>
            )}
            
            <div className="streak-info">
              <p>Your current streak: <strong>{data?.moodStreak || 0} days</strong></p>
            </div>
            
            <Link to="/mood-tracker" className="btn btn-primary">
              Record Today's Mood
            </Link>
          </div>
          
          {/* Hugs Summary */}
          <div className="dashboard-card hugs-summary">
            <h3>Hugs</h3>
            
            <div className="hugs-stats">
              <div className="hug-stat">
                <span className="stat-value">{unreadHugs.length}</span>
                <span className="stat-label">New Hugs</span>
              </div>
              <div className="hug-stat">
                <span className="stat-value">{data?.sentHugs?.length || 0}</span>
                <span className="stat-label">Sent</span>
              </div>
              <div className="hug-stat">
                <span className="stat-value">{data?.receivedHugs?.length || 0}</span>
                <span className="stat-label">Received</span>
              </div>
            </div>
            
            {unreadHugs.length > 0 && (
              <div className="unread-hugs">
                <h4>New Hugs</h4>
                <ul className="hug-list">
                  {unreadHugs.slice(0, 3).map(hug => (
                    <li key={hug.id} className="hug-item">
                      <div className="hug-sender">
                        From <strong>{hug.sender.name}</strong>
                      </div>
                      <div className="hug-type">Type: {hug.type}</div>
                      {hug.message && <div className="hug-message">"{hug.message}"</div>}
                      <div className="hug-time">{formatDate(hug.createdAt)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <Link to="/hug-center" className="btn btn-primary">
              Go to Hug Center
            </Link>
          </div>
          
          {/* Hug Requests */}
          <div className="dashboard-card requests-summary">
            <h3>Hug Requests</h3>
            
            {pendingRequests.length > 0 ? (
              <div className="pending-requests">
                <h4>Pending Requests ({pendingRequests.length})</h4>
                <ul className="request-list">
                  {pendingRequests.slice(0, 3).map(request => (
                    <li key={request.id} className="request-item">
                      <div className="request-from">
                        From <strong>{request.requester.name}</strong>
                      </div>
                      {request.message && (
                        <div className="request-message">"{request.message}"</div>
                      )}
                      <div className="request-time">{formatDate(request.createdAt)}</div>
                    </li>
                  ))}
                </ul>
                
                {pendingRequests.length > 3 && (
                  <div className="more-requests">
                    <Link to="/hug-center">View all requests</Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-requests">
                <p>No pending hug requests</p>
              </div>
            )}
            
            <div className="request-actions">
              <Link to="/hug-center?tab=requests" className="btn btn-outline">
                Request a Hug
              </Link>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="dashboard-card quick-actions">
            <h3>Quick Actions</h3>
            
            <div className="action-buttons">
              <Link to="/mood-tracker" className="btn btn-outline btn-icon">
                Record Mood
              </Link>
              <Link to="/hug-center?tab=send" className="btn btn-outline btn-icon">
                Send a Hug
              </Link>
              <Link to="/hug-center?tab=requests" className="btn btn-outline btn-icon">
                Request a Hug
              </Link>
              <Link to="/profile" className="btn btn-outline btn-icon">
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;