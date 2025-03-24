import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { HugContext } from '../../contexts/HugContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { playHapticFeedback } from '../../utils/haptics';

const UserProfile = () => {
  const [hugsStats, setHugsStats] = useState({
    sent: 0,
    received: 0,
    byType: {}
  });
  const [moodStats, setMoodStats] = useState({
    count: 0,
    average: null,
    lastWeek: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const { user, updateUserProfile, logout } = useContext(UserContext);
  const { getUserHugStats, getUserMoodStats } = useContext(HugContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Get user stats
        const hugStats = await getUserHugStats(user.id);
        const userMoodStats = await getUserMoodStats(user.id);
        
        setHugsStats(hugStats);
        setMoodStats(userMoodStats);
        setUserProfile({ ...user });
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user, getUserHugStats, getUserMoodStats]);
  
  const handleEditProfile = () => {
    setIsEditing(true);
    playHapticFeedback('selection');
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUserProfile({ ...user });
    playHapticFeedback('selection');
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(userProfile);
      setIsEditing(false);
      playHapticFeedback('success');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Determine mood trend emoji
  const getMoodTrendEmoji = () => {
    if (!moodStats.lastWeek || moodStats.lastWeek.length < 2) return '😐';
    
    const firstHalf = moodStats.lastWeek.slice(0, Math.floor(moodStats.lastWeek.length / 2));
    const secondHalf = moodStats.lastWeek.slice(Math.floor(moodStats.lastWeek.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, mood) => sum + mood.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, mood) => sum + mood.value, 0) / secondHalf.length;
    
    if (secondAvg - firstAvg > 0.5) return '📈 Improving';
    if (firstAvg - secondAvg > 0.5) return '📉 Declining';
    return '➡️ Stable';
  };
  
  if (isLoading) {
    return (
      <div className={`profile-container theme-${theme}`}>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <div className={`profile-container theme-${theme}`}>
      <header className="profile-header">
        <h1>My Profile</h1>
        {!isEditing ? (
          <button className="edit-profile-button" onClick={handleEditProfile}>
            <i className="fas fa-edit"></i>
          </button>
        ) : (
          <button className="cancel-edit-button" onClick={handleCancelEdit}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </header>
      
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="edit-profile-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userProfile.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userProfile.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <button className="save-profile-button" onClick={handleSaveProfile}>
                Save Changes
              </button>
            </div>
          ) : (
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              
              <div className="profile-actions">
                <Link to="/themes" className="profile-action-button">
                  <i className="fas fa-palette"></i>
                  Change Theme
                </Link>
                
                <Link to="/achievements" className="profile-action-button">
                  <i className="fas fa-trophy"></i>
                  Achievements
                </Link>
                
                <button className="logout-button" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="stats-section">
          <h2>Hug Stats</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{hugsStats.sent}</div>
              <div className="stat-label">Hugs Sent</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{hugsStats.received}</div>
              <div className="stat-label">Hugs Received</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{Object.keys(hugsStats.byType).length}</div>
              <div className="stat-label">Hug Types Used</div>
            </div>
          </div>
          
          {Object.keys(hugsStats.byType).length > 0 && (
            <div className="hug-types-stats">
              <h3>Most Used Hug Types</h3>
              <div className="hug-type-bars">
                {Object.entries(hugsStats.byType)
                  .sort(([, countA], [, countB]) => countB - countA)
                  .slice(0, 3)
                  .map(([type, count], index) => (
                    <div key={type} className="hug-type-bar">
                      <div className="hug-type-name">{type}</div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill" 
                          style={{ 
                            width: `${Math.min(100, (count / (hugsStats.sent || 1)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="hug-type-count">{count}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
        
        <div className="stats-section">
          <h2>Mood Stats</h2>
          
          <div className="mood-stats-content">
            <div className="mood-stat-card">
              <div className="mood-stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="mood-stat-details">
                <h3>Mood Trend</h3>
                <p>{getMoodTrendEmoji()}</p>
              </div>
            </div>
            
            <div className="mood-stat-card">
              <div className="mood-stat-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="mood-stat-details">
                <h3>Check-ins</h3>
                <p>{moodStats.count} mood entries</p>
              </div>
            </div>
            
            <Link to="/mood/history" className="view-mood-history-button">
              <i className="fas fa-history"></i>
              View Full Mood History
            </Link>
          </div>
        </div>
        
        <div className="profile-footer">
          <Link to="/artist/submit" className="artist-link">
            <i className="fas fa-paint-brush"></i>
            Submit Hug Animations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
