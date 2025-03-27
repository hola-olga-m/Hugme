import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { GET_USER_MOODS, GET_RECEIVED_HUGS, GET_PENDING_HUG_REQUESTS, GET_MOOD_STREAK } from '../graphql/queries';
import '../styles/dashboard.css';

function DashboardPage() {
  const { currentUser } = useAuth();
  const [moodScore, setMoodScore] = useState(null);

  // Fetch user's recent moods
  const { data: moodsData, loading: moodsLoading } = useQuery(GET_USER_MOODS, {
    variables: { limit: 7 },
    fetchPolicy: 'network-only'
  });

  // Fetch user's unread hugs
  const { data: hugsData, loading: hugsLoading } = useQuery(GET_RECEIVED_HUGS, {
    variables: { unreadOnly: true },
    fetchPolicy: 'network-only'
  });

  // Fetch pending hug requests
  const { data: requestsData, loading: requestsLoading } = useQuery(GET_PENDING_HUG_REQUESTS, {
    fetchPolicy: 'network-only'
  });

  // Fetch user's mood streak
  const { data: streakData, loading: streakLoading } = useQuery(GET_MOOD_STREAK, {
    fetchPolicy: 'network-only'
  });

  // Calculate average mood score from last 7 days
  useEffect(() => {
    if (moodsData && moodsData.userMoods && moodsData.userMoods.length > 0) {
      const sum = moodsData.userMoods.reduce((acc, mood) => acc + mood.score, 0);
      setMoodScore((sum / moodsData.userMoods.length).toFixed(1));
    }
  }, [moodsData]);

  // Get mood emoji based on score
  const getMoodEmoji = (score) => {
    if (score === null) return '😶';
    if (score >= 8) return '😁';
    if (score >= 6) return '🙂';
    if (score >= 4) return '😐';
    if (score >= 2) return '😔';
    return '😢';
  };

  // Count of unread hugs
  const unreadHugsCount = hugsData?.receivedHugs?.length || 0;
  
  // Count of pending requests
  const pendingRequestsCount = requestsData?.pendingHugRequests?.length || 0;

  return (
    <MainLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Welcome, {currentUser?.name || currentUser?.username || 'Friend'}</h1>
          <p>Here's a snapshot of your emotional wellness journey today.</p>
        </div>
        
        {/* Quick Actions Section - Floating at top */}
        <section className="quick-actions-section">
          <div className="actions-container">
            <Link to="/mood-tracker" className="quick-action-btn mood">
              <span className="action-icon">📊</span>
              <span className="action-text">Track Mood</span>
            </Link>
            
            <Link to="/hug-center" className="quick-action-btn hug">
              <span className="action-icon">🤗</span>
              <span className="action-text">Send Hug</span>
            </Link>
            
            <Link to="/hug-center/requests" className="quick-action-btn request">
              {pendingRequestsCount > 0 && (
                <span className="notification-badge">{pendingRequestsCount}</span>
              )}
              <span className="action-icon">✉️</span>
              <span className="action-text">Request Hug</span>
            </Link>
            
            <Link to="/mood-history" className="quick-action-btn history">
              <span className="action-icon">📈</span>
              <span className="action-text">View History</span>
            </Link>
          </div>
        </section>

        <div className="dashboard-grid">
          {/* Current Mood Card */}
          <div className="dashboard-card mood-summary-card">
            <h3>Your Mood Summary</h3>
            <div className="mood-overview">
              <div className="mood-emoji">{getMoodEmoji(moodScore)}</div>
              <div className="mood-details">
                <div className="mood-score">{moodScore || '–'}</div>
                <div className="mood-label">7-day average</div>
              </div>
            </div>
            <div className="streak-info">
              {streakLoading ? (
                <div className="loading-indicator">Loading streak info...</div>
              ) : (
                <p>
                  <span className="streak-count">{streakData?.moodStreak || 0}</span> day
                  {(streakData?.moodStreak !== 1) && 's'} streak
                </p>
              )}
            </div>
            <div className="card-actions">
              <Link to="/mood-tracker" className="btn btn-primary">
                Track Today
              </Link>
              <Link to="/mood-history" className="btn btn-outline-primary">
                View History
              </Link>
            </div>
          </div>

          {/* Hugs Card */}
          <div className="dashboard-card hugs-card">
            <h3>Unread Hugs</h3>
            {hugsLoading ? (
              <div className="loading-indicator">Loading hugs...</div>
            ) : (
              <>
                <div className="hugs-overview">
                  <div className="hugs-count">
                    <span className="count-number">{unreadHugsCount}</span>
                    <span className="count-label">{unreadHugsCount === 1 ? 'hug' : 'hugs'} to view</span>
                  </div>
                </div>
                {unreadHugsCount > 0 ? (
                  <div className="hugs-preview">
                    <p>New hugs from:</p>
                    <ul className="hugs-list">
                      {hugsData.receivedHugs.slice(0, 3).map(hug => (
                        <li key={hug.id}>
                          <strong>{hug.sender.name || hug.sender.username}</strong> - {hug.type} Hug
                        </li>
                      ))}
                      {unreadHugsCount > 3 && (
                        <li className="and-more">And {unreadHugsCount - 3} more...</li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <p className="no-data-message">No unread hugs at the moment.</p>
                )}
              </>
            )}
            <div className="card-actions">
              <Link to="/hug-center/received" className="btn btn-secondary">
                View All Hugs
              </Link>
              <Link to="/hug-center" className="btn btn-outline-secondary">
                Send a Hug
              </Link>
            </div>
          </div>

          {/* Hug Requests Card */}
          <div className="dashboard-card requests-card">
            <h3>Pending Hug Requests</h3>
            {requestsLoading ? (
              <div className="loading-indicator">Loading requests...</div>
            ) : (
              <>
                <div className="requests-overview">
                  <div className="requests-count">
                    <span className="count-number">{pendingRequestsCount}</span>
                    <span className="count-label">waiting for response</span>
                  </div>
                </div>
                {pendingRequestsCount > 0 ? (
                  <div className="requests-preview">
                    <p>People who need your support:</p>
                    <ul className="requests-list">
                      {requestsData.pendingHugRequests.slice(0, 3).map(request => (
                        <li key={request.id}>
                          <strong>{request.requester.name || request.requester.username}</strong>
                          {request.message && ` - "${request.message}"`}
                        </li>
                      ))}
                      {pendingRequestsCount > 3 && (
                        <li className="and-more">And {pendingRequestsCount - 3} more...</li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <p className="no-data-message">No pending requests right now.</p>
                )}
              </>
            )}
            <div className="card-actions">
              <Link to="/hug-center/requests/pending" className="btn btn-primary">
                Respond to Requests
              </Link>
              <Link to="/hug-center/requests/new" className="btn btn-outline-primary">
                Request a Hug
              </Link>
            </div>
          </div>
        </div>
        
        <div className="dashboard-footer">
          <p>Remember, taking time for your emotional wellness is always worth it. 💖</p>
        </div>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;