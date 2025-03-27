import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { GET_USER_MOODS, GET_RECEIVED_HUGS, GET_PENDING_HUG_REQUESTS, GET_MOOD_STREAK } from '../graphql/queries';
import '../styles/dashboard.css';

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
};

const headerVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 90
    }
  }
};

function DashboardPage() {
  const { currentUser } = useAuth();
  const [moodScore, setMoodScore] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState('');

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

  // Set time of day greeting
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setTimeOfDay('morning');
    } else if (hours < 18) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }
  }, []);

  // Calculate average mood score and prepare chart data
  useEffect(() => {
    if (moodsData && moodsData.userMoods && moodsData.userMoods.length > 0) {
      const sum = moodsData.userMoods.reduce((acc, mood) => acc + mood.score, 0);
      setMoodScore((sum / moodsData.userMoods.length).toFixed(1));
      
      // Prepare data for mood sparkline visualization
      const moodPoints = [...moodsData.userMoods]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map(mood => ({
          score: mood.score,
          date: new Date(mood.createdAt).toLocaleDateString('en-US', { weekday: 'short' })
        }));
      
      setMoodData(moodPoints);
    }
  }, [moodsData]);

  // Get mood emoji based on score
  const getMoodEmoji = (score) => {
    if (score === null) return '😶';
    if (score >= 8.5) return '😁';
    if (score >= 7) return '😊';
    if (score >= 5.5) return '🙂';
    if (score >= 4) return '😐';
    if (score >= 2.5) return '😔';
    if (score >= 1) return '😢';
    return '😭';
  };

  // Get mood color based on score
  const getMoodColor = (score) => {
    if (score === null) return '#9ca3af'; // gray-400
    if (score >= 8.5) return '#10b981'; // success-color
    if (score >= 7) return '#34d399'; // success-light
    if (score >= 5.5) return '#60a5fa'; // info-light
    if (score >= 4) return '#f59e0b'; // warning-color
    if (score >= 2.5) return '#f97316'; // orange
    if (score >= 1) return '#ef4444'; // danger-color
    return '#dc2626'; // danger-dark
  };

  // Generate personalized message based on mood score
  const getMoodMessage = (score) => {
    if (score === null) return "Track your first mood to see insights!";
    if (score >= 8) return "You're thriving! Keep that positive energy flowing.";
    if (score >= 6) return "You're doing well! Remember to celebrate small wins.";
    if (score >= 4) return "Your mood is balanced. What little things can brighten your day?";
    if (score >= 2) return "It's been a bit tough lately. Be gentle with yourself.";
    return "You've been going through a difficult time. Remember, you're not alone.";
  };

  // Count of unread hugs
  const unreadHugsCount = hugsData?.receivedHugs?.length || 0;
  
  // Count of pending requests
  const pendingRequestsCount = requestsData?.pendingHugRequests?.length || 0;

  // Generate points for sparkline
  const generateSparklinePoints = (data) => {
    if (!data || data.length === 0) return '';
    
    const height = 50;
    const width = 100;
    const padding = 5;
    
    const min = 1;
    const max = 10;
    
    // Map scores to y positions (inverted, since SVG y increases downward)
    const points = data.map((point, index) => {
      const x = padding + (index * ((width - padding * 2) / (data.length - 1 || 1)));
      const normalized = (point.score - min) / (max - min);
      const y = height - padding - normalized * (height - padding * 2);
      return `${x},${y}`;
    });
    
    return points.join(' ');
  };

  return (
    <MainLayout>
      <motion.div 
        className="dashboard-page"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="dashboard-header" variants={headerVariants}>
          <div className="greeting-container">
            <div className="greeting-emoji">
              {timeOfDay === 'morning' ? '🌅' : timeOfDay === 'afternoon' ? '☀️' : '🌙'}
            </div>
            <div className="greeting-text">
              <h1>Good {timeOfDay}, {currentUser?.name || currentUser?.username || 'Friend'}</h1>
              <p>Here's a snapshot of your emotional wellness journey today.</p>
            </div>
          </div>
        </motion.div>
        
        {/* Quick Actions Section - Floating at top */}
        <motion.section 
          className="quick-actions-section"
          variants={itemVariants}
        >
          <div className="actions-container">
            <motion.div 
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Link to="/mood-tracker" className="quick-action-btn mood">
                <span className="action-icon">📊</span>
                <span className="action-text">Track Mood</span>
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Link to="/hug-center" className="quick-action-btn hug">
                <span className="action-icon">🤗</span>
                <span className="action-text">Send Hug</span>
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Link to="/hug-center/requests" className="quick-action-btn request">
                {pendingRequestsCount > 0 && (
                  <motion.span 
                    className="notification-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 10,
                      delay: 0.5
                    }}
                  >
                    {pendingRequestsCount}
                  </motion.span>
                )}
                <span className="action-icon">✉️</span>
                <span className="action-text">Request Hug</span>
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Link to="/mood-history" className="quick-action-btn history">
                <span className="action-icon">📈</span>
                <span className="action-text">View History</span>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <div className="dashboard-grid">
          {/* Current Mood Card with Visualization */}
          <motion.div 
            className="dashboard-card mood-summary-card" 
            variants={itemVariants}
          >
            <h3>Your Mood Pulse</h3>
            <div className="mood-overview">
              <motion.div 
                className="mood-emoji"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ 
                  type: "spring", 
                  damping: 10, 
                  stiffness: 100,
                  delay: 0.3
                }}
                style={{ color: getMoodColor(moodScore) }}
              >
                {getMoodEmoji(moodScore)}
              </motion.div>
              <div className="mood-details">
                <div className="mood-score-container">
                  <div className="mood-score" style={{ color: getMoodColor(moodScore) }}>
                    {moodScore || '–'}
                  </div>
                  <div className="mood-label">7-day average</div>
                </div>
                <motion.div 
                  className="mood-message"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {getMoodMessage(moodScore)}
                </motion.div>
              </div>
            </div>
            
            {/* Mood Sparkline */}
            <div className="mood-sparkline-container">
              {moodData.length > 0 ? (
                <>
                  <div className="sparkline-header">
                    <span>7-Day Mood Trend</span>
                  </div>
                  <div className="sparkline">
                    <svg width="100%" height="60" viewBox="0 0 100 50" preserveAspectRatio="none">
                      {/* Gradient for the line */}
                      <defs>
                        <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={getMoodColor(moodData[0]?.score || 5)} />
                          <stop offset="100%" stopColor={getMoodColor(moodData[moodData.length-1]?.score || 5)} />
                        </linearGradient>
                      </defs>
                      
                      {/* Sparkline Fill */}
                      <motion.path
                        d={`M ${generateSparklinePoints(moodData)} L ${100-5},${50-5} L ${5},${50-5} Z`}
                        fill="url(#moodGradient)"
                        fillOpacity="0.2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                      
                      {/* Sparkline Line */}
                      <motion.polyline
                        points={generateSparklinePoints(moodData)}
                        fill="none"
                        stroke="url(#moodGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                      />
                      
                      {/* Data points */}
                      {moodData.map((point, index) => {
                        const height = 50;
                        const width = 100;
                        const padding = 5;
                        const min = 1;
                        const max = 10;
                        
                        const x = padding + (index * ((width - padding * 2) / (moodData.length - 1 || 1)));
                        const normalized = (point.score - min) / (max - min);
                        const y = height - padding - normalized * (height - padding * 2);
                        
                        return (
                          <motion.circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="3"
                            fill={getMoodColor(point.score)}
                            stroke="#fff"
                            strokeWidth="1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                          />
                        );
                      })}
                    </svg>
                    
                    {/* X-axis day labels */}
                    <div className="sparkline-labels">
                      {moodData.map((point, index) => (
                        <div key={index} className="day-label">
                          {point.date}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-data-message">
                  {moodsLoading ? "Loading mood data..." : "No mood data available yet."}
                </div>
              )}
            </div>
            
            <div className="streak-container">
              <div className="streak-info">
                {streakLoading ? (
                  <div className="loading-indicator">Loading streak info...</div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="streak-content">
                      <span className="streak-emoji">🔥</span>
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
            variants={itemVariants}
          >
            <h3>
              <span className="card-icon">💌</span>
              Unread Hugs
            </h3>
            {hugsLoading ? (
              <div className="loading-indicator">Loading hugs...</div>
            ) : (
              <>
                <div className="hugs-overview">
                  <motion.div 
                    className="hugs-count"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <span className="count-number">{unreadHugsCount}</span>
                    <span className="count-label">{unreadHugsCount === 1 ? 'hug' : 'hugs'} to view</span>
                  </motion.div>
                </div>
                
                <div className="content-wrapper">
                  {unreadHugsCount > 0 ? (
                    <motion.div 
                      className="hugs-preview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p>New hugs from:</p>
                      <ul className="hugs-list">
                        {hugsData.receivedHugs.slice(0, 3).map((hug, index) => (
                          <motion.li 
                            key={hug.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            <div className="hug-sender-avatar">
                              {(hug.sender.name || hug.sender.username || "?")[0].toUpperCase()}
                            </div>
                            <div className="hug-details">
                              <strong>{hug.sender.name || hug.sender.username}</strong> 
                              <span className="hug-type">{hug.type} Hug</span>
                            </div>
                          </motion.li>
                        ))}
                        {unreadHugsCount > 3 && (
                          <motion.li 
                            className="and-more"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            And {unreadHugsCount - 3} more...
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
                      No unread hugs at the moment.
                      <br />
                      <span className="subtext">Send a hug to brighten someone's day!</span>
                    </motion.p>
                  )}
                </div>
                
                <div className="card-actions">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/hug-center/received" className="btn btn-secondary">
                      <span className="btn-icon">📩</span>
                      View All Hugs
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/hug-center" className="btn btn-outline-secondary">
                      <span className="btn-icon">✨</span>
                      Send a Hug
                    </Link>
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>

          {/* Hug Requests Card */}
          <motion.div 
            className="dashboard-card requests-card"
            variants={itemVariants}
          >
            <h3>
              <span className="card-icon">🙏</span>
              Hug Requests
            </h3>
            {requestsLoading ? (
              <div className="loading-indicator">Loading requests...</div>
            ) : (
              <>
                <div className="requests-overview">
                  <motion.div 
                    className="requests-count"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <span className="count-number">{pendingRequestsCount}</span>
                    <span className="count-label">waiting for response</span>
                  </motion.div>
                </div>
                
                <div className="content-wrapper">
                  {pendingRequestsCount > 0 ? (
                    <motion.div 
                      className="requests-preview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p>People who need your support:</p>
                      <ul className="requests-list">
                        {requestsData.pendingHugRequests.slice(0, 3).map((request, index) => (
                          <motion.li 
                            key={request.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="request-item"
                          >
                            <div className="requester-avatar">
                              {(request.requester.name || request.requester.username || "?")[0].toUpperCase()}
                            </div>
                            <div className="request-details">
                              <strong>{request.requester.name || request.requester.username}</strong>
                              {request.message && (
                                <span className="request-message">"{request.message}"</span>
                              )}
                            </div>
                            <motion.div 
                              className="request-urgency"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                            >
                              {request.urgent ? "Urgent" : ""}
                            </motion.div>
                          </motion.li>
                        ))}
                        {pendingRequestsCount > 3 && (
                          <motion.li 
                            className="and-more"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                          >
                            And {pendingRequestsCount - 3} more...
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
                      No pending requests right now.
                      <br />
                      <span className="subtext">Everyone's feeling well today!</span>
                    </motion.p>
                  )}
                </div>
                
                <div className="card-actions">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/hug-center/requests/pending" className="btn btn-primary">
                      <span className="btn-icon">❤️</span>
                      Respond to Requests
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/hug-center/requests/new" className="btn btn-outline-primary">
                      <span className="btn-icon">🔔</span>
                      Request a Hug
                    </Link>
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
          
          {/* Community Insights Card */}
          <motion.div 
            className="dashboard-card community-card"
            variants={itemVariants}
          >
            <h3>
              <span className="card-icon">👥</span>
              Community Wellness
            </h3>
            
            <div className="community-stats">
              <div className="stat-item">
                <div className="stat-icon">🌈</div>
                <div className="stat-details">
                  <div className="stat-value">86%</div>
                  <div className="stat-label">Community Mood</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">🤗</div>
                <div className="stat-details">
                  <div className="stat-value">142</div>
                  <div className="stat-label">Hugs Today</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">👋</div>
                <div className="stat-details">
                  <div className="stat-value">23</div>
                  <div className="stat-label">New Members</div>
                </div>
              </div>
            </div>
            
            <div className="community-insights">
              <h4>Trending Mood</h4>
              <div className="trending-mood">
                <div className="trend-emoji">😊</div>
                <div className="trend-info">
                  <div className="trend-name">Contentment</div>
                  <div className="trend-description">People are feeling satisfied with life's simple pleasures</div>
                </div>
              </div>
            </div>
            
            <div className="card-actions">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/community" className="btn btn-tertiary">
                  <span className="btn-icon">🌍</span>
                  Join Community
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Daily Reflection Card */}
          <motion.div 
            className="dashboard-card reflection-card"
            variants={itemVariants}
          >
            <h3>
              <span className="card-icon">🌱</span>
              Daily Reflection
            </h3>
            
            <div className="daily-quote">
              <blockquote>
                "Your emotional well-being is a journey, not a destination. Every step, no matter how small, matters."
              </blockquote>
              <cite>— The HugMeNow Team</cite>
            </div>
            
            <div className="reflection-prompt">
              <h4>Today's Question</h4>
              <p>What is one small thing that brought you joy today?</p>
            </div>
            
            <div className="card-actions">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/reflections" className="btn btn-outline-tertiary">
                  <span className="btn-icon">✏️</span>
                  Write Reflection
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="dashboard-footer"
          variants={itemVariants}
        >
          <div className="footer-content">
            <p>Remember, taking time for your emotional wellness is always worth it. 💖</p>
            <div className="footer-actions">
              <Link to="/settings" className="footer-link">Settings</Link>
              <Link to="/help" className="footer-link">Get Help</Link>
              <Link to="/feedback" className="footer-link">Give Feedback</Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}

export default DashboardPage;