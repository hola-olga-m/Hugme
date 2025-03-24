import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { GET_USER_MOODS, GET_RECEIVED_HUGS, GET_PENDING_HUG_REQUESTS, GET_MOOD_STREAK } from '../graphql/queries';

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

  return (
    <MainLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Welcome, {currentUser?.name || currentUser?.username || 'Friend'}</h1>
          <p>Here's a summary of your emotional wellness journey.</p>
        </div>

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
            <Link to="/mood-tracker" className="btn btn-primary btn-block">
              Track Today's Mood
            </Link>
          </div>

          {/* Hugs Card */}
          <div className="dashboard-card hugs-card">
            <h3>Hugs</h3>
            {hugsLoading ? (
              <div className="loading-indicator">Loading hugs...</div>
            ) : (
              <>
                <div className="hugs-overview">
                  <div className="hugs-count">
                    <span className="count-number">{hugsData?.receivedHugs?.length || 0}</span>
                    <span className="count-label">unread {hugsData?.receivedHugs?.length === 1 ? 'hug' : 'hugs'}</span>
                  </div>
                </div>
                {hugsData?.receivedHugs?.length > 0 ? (
                  <div className="hugs-preview">
                    <p>You have unread hugs from:</p>
                    <ul className="hugs-list">
                      {hugsData.receivedHugs.slice(0, 3).map(hug => (
                        <li key={hug.id}>
                          <strong>{hug.sender.name || hug.sender.username}</strong> - {hug.type} Hug
                        </li>
                      ))}
                      {hugsData.receivedHugs.length > 3 && (
                        <li className="and-more">And {hugsData.receivedHugs.length - 3} more...</li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <p className="no-data-message">No unread hugs at the moment.</p>
                )}
              </>
            )}
            <Link to="/hug-center" className="btn btn-outline btn-block">
              Go to Hug Center
            </Link>
          </div>

          {/* Hug Requests Card */}
          <div className="dashboard-card requests-card">
            <h3>Hug Requests</h3>
            {requestsLoading ? (
              <div className="loading-indicator">Loading requests...</div>
            ) : (
              <>
                <div className="requests-overview">
                  <div className="requests-count">
                    <span className="count-number">{requestsData?.pendingHugRequests?.length || 0}</span>
                    <span className="count-label">pending {requestsData?.pendingHugRequests?.length === 1 ? 'request' : 'requests'}</span>
                  </div>
                </div>
                {requestsData?.pendingHugRequests?.length > 0 ? (
                  <div className="requests-preview">
                    <p>You have pending requests from:</p>
                    <ul className="requests-list">
                      {requestsData.pendingHugRequests.slice(0, 3).map(request => (
                        <li key={request.id}>
                          <strong>{request.requester.name || request.requester.username}</strong>
                          {request.message && ` - "${request.message}"`}
                        </li>
                      ))}
                      {requestsData.pendingHugRequests.length > 3 && (
                        <li className="and-more">And {requestsData.pendingHugRequests.length - 3} more...</li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <p className="no-data-message">No pending hug requests at the moment.</p>
                )}
              </>
            )}
            <Link to="/hug-center" className="btn btn-outline btn-block">
              Manage Requests
            </Link>
          </div>

          {/* Quick Actions Card */}
          <div className="dashboard-card actions-card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link to="/mood-tracker" className="action-button">
                <span className="action-icon">📊</span>
                <span className="action-text">Track Mood</span>
              </Link>
              <Link to="/hug-center" className="action-button">
                <span className="action-icon">🤗</span>
                <span className="action-text">Send Hug</span>
              </Link>
              <Link to="/mood-history" className="action-button">
                <span className="action-icon">📈</span>
                <span className="action-text">View History</span>
              </Link>
              <Link to="/profile" className="action-button">
                <span className="action-icon">👤</span>
                <span className="action-text">Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;