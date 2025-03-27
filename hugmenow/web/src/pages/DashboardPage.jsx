import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { GET_USER_MOODS, GET_RECEIVED_HUGS, GET_PENDING_HUG_REQUESTS, GET_MOOD_STREAK } from '../graphql/queries';
import { Icon, UserAvatar } from '../components/ui/IconComponent';
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
  
  // Group hugs by type for gallery display
  const [hugGroups, setHugGroups] = useState({});
  
  useEffect(() => {
    if (hugsData?.receivedHugs && hugsData.receivedHugs.length > 0) {
      const groups = hugsData.receivedHugs.reduce((acc, hug) => {
        const type = hug.type || 'Standard';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(hug);
        return acc;
      }, {});
      setHugGroups(groups);
    }
  }, [hugsData]);

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
          <motion.div 
            className="dashboard-card mood-summary-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              damping: 12,
              stiffness: 100,
              delay: 0.1
            }}
          >
            <h3>
              <span className="card-icon">
                <Icon type="moodTracker" size={24} />
              </span>
              Your Mood Pulse
            </h3>
            <div className="mood-overview">
              <Icon type="mood" score={moodScore} size={60} />
              <div className="mood-details">
                <div className="mood-score-container">
                  <div className="mood-score">{moodScore || '–'}</div>
                  <div className="mood-label">7-day average</div>
                </div>
                <motion.div 
                  className="mood-message"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {moodScore ? "You're doing great! Keep tracking your moods." : "Start tracking your moods to see insights!"}
                </motion.div>
              </div>
            </div>
            <div className="streak-container">
              <div className="streak-info">
                {streakLoading ? (
                  <div className="loading-indicator">Loading streak info...</div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="streak-content">
                      <Icon type="fire" size={24} />
                      <p>
                        <span className="streak-count">{streakData?.moodStreak || 0}</span> day
                        {(streakData?.moodStreak !== 1) && 's'} streak
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="card-actions">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/mood-tracker" className="btn btn-primary">
                  <span className="btn-icon">➕</span>
                  Track Today
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/mood-history" className="btn btn-outline-primary">
                  <span className="btn-icon">📊</span>
                  View History
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Hugs Card */}
          <motion.div 
            className="dashboard-card hugs-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              damping: 12,
              stiffness: 100,
              delay: 0.2
            }}
          >
            <h3>
              <span className="card-icon">
                <Icon type="hugIcon" size={24} />
              </span>
              Virtual Hugs
            </h3>
            {hugsLoading ? (
              <div className="loading-indicator">Loading hugs...</div>
            ) : (
              <>
                <div className="hugs-overview">
                  <div className="hugs-count">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        damping: 8,
                        stiffness: 100,
                        delay: 0.3
                      }}
                    >
                      <Icon type="heart" size={32} />
                      <span className="count-number">{hugsData?.receivedHugs?.length || 0}</span>
                    </motion.div>
                    <span className="count-label">unread {hugsData?.receivedHugs?.length === 1 ? 'hug' : 'hugs'}</span>
                  </div>
                </div>
                {hugsData?.receivedHugs?.length > 0 ? (
                  <motion.div 
                    className="hugs-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p>You have unread hugs from:</p>
                    <ul className="hugs-list">
                      {hugsData.receivedHugs.slice(0, 3).map((hug, index) => (
                        <motion.li 
                          key={hug.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + (index * 0.1) }}
                        >
                          <UserAvatar 
                            name={hug.sender.name || hug.sender.username}
                            size={24}
                            bgColor="#8B5CF6"
                          />
                          <div className="hug-info">
                            <strong>{hug.sender.name || hug.sender.username}</strong>
                            <span className="hug-type">{hug.type} Hug</span>
                          </div>
                        </motion.li>
                      ))}
                      {hugsData.receivedHugs.length > 3 && (
                        <motion.li 
                          className="and-more"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          And {hugsData.receivedHugs.length - 3} more...
                        </motion.li>
                      )}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.p 
                    className="no-data-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    No unread hugs at the moment. Send some hugs to friends!
                  </motion.p>
                )}
              </>
            )}
            <div className="card-actions">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/hug-center" className="btn btn-secondary">
                  <span className="btn-icon">💌</span>
                  Send a Hug
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/hug-center/received" className="btn btn-outline-secondary">
                  <span className="btn-icon">📬</span>
                  View All
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Hug Requests Card */}
          <motion.div 
            className="dashboard-card requests-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              damping: 12,
              stiffness: 100,
              delay: 0.3
            }}
          >
            <h3>
              <span className="card-icon">
                <Icon type="community" size={24} />
              </span>
              Hug Requests
            </h3>
            {requestsLoading ? (
              <div className="loading-indicator">Loading requests...</div>
            ) : (
              <>
                <div className="requests-overview">
                  <div className="requests-count">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        damping: 8,
                        stiffness: 100,
                        delay: 0.4
                      }}
                    >
                      <span className="request-badge">{requestsData?.pendingHugRequests?.length || 0}</span>
                    </motion.div>
                    <span className="count-label">pending {requestsData?.pendingHugRequests?.length === 1 ? 'request' : 'requests'}</span>
                  </div>
                </div>
                {requestsData?.pendingHugRequests?.length > 0 ? (
                  <motion.div 
                    className="requests-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p>People who need your support:</p>
                    <ul className="requests-list">
                      {requestsData.pendingHugRequests.slice(0, 3).map((request, index) => (
                        <motion.li 
                          key={request.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + (index * 0.1) }}
                          className="request-item"
                        >
                          <UserAvatar 
                            name={request.requester.name || request.requester.username}
                            size={24}
                            bgColor="#EC4899"
                          />
                          <div className="request-info">
                            <strong>{request.requester.name || request.requester.username}</strong>
                            {request.message && (
                              <span className="request-message">"{request.message}"</span>
                            )}
                          </div>
                        </motion.li>
                      ))}
                      {requestsData.pendingHugRequests.length > 3 && (
                        <motion.li 
                          className="and-more"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9 }}
                        >
                          And {requestsData.pendingHugRequests.length - 3} more people need hugs...
                        </motion.li>
                      )}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="no-data-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="no-data-message">No pending hug requests at the moment.</p>
                    <p className="no-data-subtext">The community is doing well today!</p>
                  </motion.div>
                )}
              </>
            )}
            <div className="card-actions">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/hug-center/requests" className="btn btn-tertiary">
                  <span className="btn-icon">🙏</span>
                  Manage Requests
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/hug-center/community" className="btn btn-outline-tertiary">
                  <span className="btn-icon">👋</span>
                  Community Feed
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div 
            className="dashboard-card actions-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              damping: 12,
              stiffness: 100,
              delay: 0.4
            }}
          >
            <h3>
              <span className="card-icon">
                <Icon type="happyFace" size={24} />
              </span>
              Quick Actions
            </h3>
            <div className="action-buttons-grid">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="action-button-wrapper"
              >
                <Link to="/mood-tracker" className="action-button">
                  <Icon type="moodTracker" size={32} />
                  <span className="action-text">Track Mood</span>
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="action-button-wrapper"
              >
                <Link to="/hug-center" className="action-button">
                  <Icon type="hugIcon" size={32} />
                  <span className="action-text">Send Hug</span>
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="action-button-wrapper"
              >
                <Link to="/mood-history" className="action-button">
                  <Icon type="moodTracker" size={32} />
                  <span className="action-text">Mood History</span>
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="action-button-wrapper"
              >
                <Link to="/hug-center/community" className="action-button">
                  <Icon type="community" size={32} />
                  <span className="action-text">Community</span>
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="action-button-wrapper"
              >
                <Link to="/profile" className="action-button">
                  <UserAvatar name={currentUser?.name || currentUser?.username || "?"} size={32} />
                  <span className="action-text">Profile</span>
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="action-button-wrapper"
              >
                <Link to="/settings" className="action-button">
                  <span className="action-icon">⚙️</span>
                  <span className="action-text">Settings</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Unread Hugs Gallery Card */}
          <motion.div 
            className="dashboard-card hugs-gallery-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              damping: 12,
              stiffness: 100,
              delay: 0.5
            }}
          >
            <h3>
              <span className="card-icon">
                <Icon type="hugIcon" size={24} />
              </span>
              Hug Gallery
            </h3>
            {hugsLoading ? (
              <div className="loading-indicator">Loading hugs gallery...</div>
            ) : hugsData?.receivedHugs?.length > 0 ? (
              <div className="carousel-container">
                <motion.div 
                  className="carousel-track"
                  drag="x"
                  dragConstraints={{ 
                    left: -(Object.keys(hugGroups).length * 150), 
                    right: 0 
                  }}
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  {Object.entries(hugGroups).map(([hugType, hugs], index) => (
                    <motion.div 
                      key={hugType}
                      className="carousel-item"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + (index * 0.1) }}
                    >
                      <div className="hug-card">
                        <div className="hug-icon-container">
                          <Icon type={hugType} size={48} />
                        </div>
                        <div className="hug-count">
                          <span className="count-number">{hugs.length}</span>
                          <span className="hug-type-label">{hugType} {hugs.length === 1 ? "Hug" : "Hugs"}</span>
                        </div>
                        <div className="hug-senders">
                          {hugs.slice(0, 2).map((hug, idx) => (
                            <div key={hug.id} className="hug-sender-item">
                              <UserAvatar 
                                name={hug.sender.name || hug.sender.username}
                                size={20}
                                bgColor={idx % 2 === 0 ? "#8B5CF6" : "#EC4899"}
                              />
                              <span className="sender-name">{hug.sender.name || hug.sender.username}</span>
                            </div>
                          ))}
                          {hugs.length > 2 && (
                            <div className="more-senders">+ {hugs.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                <div className="carousel-instructions">
                  <span>← Swipe to see more →</span>
                </div>
              </div>
            ) : (
              <motion.div 
                className="no-data-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="no-data-message">No unread hugs to display.</p>
                <p className="no-data-subtext">Check back later or invite friends to send you hugs!</p>
              </motion.div>
            )}
            <div className="card-actions">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/hug-center/received" className="btn btn-secondary">
                  <span className="btn-icon">🤗</span>
                  View All Hugs
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}

export default DashboardPage;