import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { HugContext } from '../../contexts/HugContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { playHapticFeedback } from '../../utils/haptics';

const StatusBadges = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [statusTags, setStatusTags] = useState([]);
  const [displayedBadges, setDisplayedBadges] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showBadgeDetail, setShowBadgeDetail] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [selectedStatusTags, setSelectedStatusTags] = useState([]);
  
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { getUserBadges, getStatusTags, updateDisplayedBadges, updateStatusTags } = useContext(HugContext);
  const { theme } = useContext(ThemeContext);
  
  // Badge categories
  const badgeCategories = [
    { id: 'all', name: 'All Badges', icon: 'fa-certificate' },
    { id: 'mood_tracking', name: 'Mood Tracking', icon: 'fa-chart-line' },
    { id: 'hugs', name: 'Hugs', icon: 'fa-hand-holding-heart' },
    { id: 'social', name: 'Social', icon: 'fa-users' },
    { id: 'streaks', name: 'Streaks', icon: 'fa-fire' },
    { id: 'premium', name: 'Premium', icon: 'fa-crown' }
  ];
  
  // Initialize data
  useEffect(() => {
    const loadBadges = async () => {
      setIsLoading(true);
      
      try {
        // Load user badges
        const userBadges = await getUserBadges(user.id);
        setBadges(userBadges);
        
        // Load status tags
        const tags = await getStatusTags(user.id);
        setStatusTags(tags);
        
        // Load displayed badges
        const displayed = userBadges.filter(badge => badge.isDisplayed);
        setDisplayedBadges(displayed);
        
        // Set selected tags
        const selected = tags.filter(tag => tag.isSelected);
        setSelectedStatusTags(selected);
        
      } catch (error) {
        console.error('Error loading badges:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBadges();
  }, [user.id, getUserBadges, getStatusTags]);
  
  // Filter badges based on category
  const filteredBadges = activeFilter === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === activeFilter);
  
  // Handle badge selection
  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    setShowBadgeDetail(true);
    playHapticFeedback('selection');
  };
  
  // Toggle badge display
  const toggleBadgeDisplay = async (badgeId) => {
    // Update local state
    const updatedDisplayed = displayedBadges.some(b => b.id === badgeId)
      ? displayedBadges.filter(b => b.id !== badgeId)
      : [...displayedBadges, badges.find(b => b.id === badgeId)];
    
    // Maximum of 3 displayed badges
    if (updatedDisplayed.length > 3) {
      // Remove oldest badge
      updatedDisplayed.shift();
    }
    
    setDisplayedBadges(updatedDisplayed);
    
    try {
      // Update on server
      await updateDisplayedBadges(user.id, updatedDisplayed.map(b => b.id));
      playHapticFeedback('success');
    } catch (error) {
      console.error('Error updating displayed badges:', error);
    }
  };
  
  // Toggle status tag selection
  const toggleStatusTag = async (tagId) => {
    // Update local state
    const updatedSelected = selectedStatusTags.some(t => t.id === tagId)
      ? selectedStatusTags.filter(t => t.id !== tagId)
      : [...selectedStatusTags, statusTags.find(t => t.id === tagId)];
    
    // Maximum of 2 displayed tags
    if (updatedSelected.length > 2) {
      // Remove oldest tag
      updatedSelected.shift();
    }
    
    setSelectedStatusTags(updatedSelected);
    
    try {
      // Update on server
      await updateStatusTags(user.id, updatedSelected.map(t => t.id));
      playHapticFeedback('success');
    } catch (error) {
      console.error('Error updating status tags:', error);
    }
  };
  
  // Calculate achievement stats
  const achievementStats = {
    total: badges.length,
    unlocked: badges.filter(badge => badge.unlocked).length,
    percentComplete: Math.round((badges.filter(badge => badge.unlocked).length / badges.length) * 100)
  };
  
  // Format date in readable format
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className={`status-badges-container theme-${theme}`}>
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading badges and achievements...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`status-badges-container theme-${theme}`}>
      <header className="page-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Badges & Status</h1>
      </header>
      
      {/* Display Preview */}
      <div className="display-preview">
        <h2>Public Profile</h2>
        
        <div className="profile-preview">
          <div className="preview-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <div className="avatar-placeholder">
                {user.username?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          
          <div className="preview-info">
            <h3>{user.username}</h3>
            
            {/* Status Tags */}
            <div className="status-tags">
              {selectedStatusTags.length > 0 ? (
                selectedStatusTags.map(tag => (
                  <div key={tag.id} className="status-tag" style={{ backgroundColor: tag.color }}>
                    <i className={`fas ${tag.icon}`}></i>
                    <span>{tag.name}</span>
                  </div>
                ))
              ) : (
                <div className="no-tags">No status tags selected</div>
              )}
              
              <button
                className="edit-tags-button"
                onClick={() => setShowTagSelector(true)}
              >
                <i className="fas fa-pen"></i>
              </button>
            </div>
            
            {/* Displayed Badges */}
            <div className="displayed-badges">
              {displayedBadges.length > 0 ? (
                displayedBadges.map(badge => (
                  <div key={badge.id} className="displayed-badge">
                    <div className="badge-icon">
                      <i className={`fas ${badge.icon}`}></i>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-badges">No badges displayed</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="display-instructions">
          <i className="fas fa-info-circle"></i>
          <p>Select up to 3 badges and 2 status tags to display on your public profile</p>
        </div>
      </div>
      
      {/* Achievement Stats */}
      <div className="achievement-stats">
        <div className="stats-card">
          <div className="stats-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="stats-info">
            <h3>Badges Earned</h3>
            <div className="stats-numbers">
              <span className="stats-value">{achievementStats.unlocked}</span>
              <span className="stats-total">/ {achievementStats.total}</span>
            </div>
          </div>
          <div className="completion-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${achievementStats.percentComplete}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Badge Filter */}
      <div className="badge-filter">
        <h2>Your Badges</h2>
        
        <div className="filter-tabs">
          {badgeCategories.map(category => (
            <button
              key={category.id}
              className={`filter-tab ${activeFilter === category.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(category.id)}
            >
              <i className={`fas ${category.icon}`}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Badges Grid */}
      <div className="badges-grid">
        {filteredBadges.length === 0 ? (
          <div className="no-badges-message">
            <div className="empty-state-icon">
              <i className="fas fa-medal"></i>
            </div>
            <h3>No Badges Found</h3>
            <p>Complete activities to earn badges in this category</p>
          </div>
        ) : (
          filteredBadges.map(badge => (
            <div
              key={badge.id}
              className={`badge-item ${!badge.unlocked ? 'locked' : ''} ${
                displayedBadges.some(b => b.id === badge.id) ? 'displayed' : ''
              }`}
              onClick={() => badge.unlocked && handleBadgeClick(badge)}
            >
              <div className="badge-content">
                <div className="badge-icon">
                  <i className={`fas ${badge.unlocked ? badge.icon : 'fa-lock'}`}></i>
                </div>
                <h3 className="badge-name">{badge.name}</h3>
                
                {badge.unlocked ? (
                  <p className="badge-date">Earned {formatDate(badge.timestamp)}</p>
                ) : (
                  <p className="badge-locked">Complete tasks to unlock</p>
                )}
              </div>
              
              {badge.unlocked && (
                <button
                  className="display-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBadgeDisplay(badge.id);
                  }}
                >
                  {displayedBadges.some(b => b.id === badge.id) ? (
                    <i className="fas fa-eye"></i>
                  ) : (
                    <i className="fas fa-eye-slash"></i>
                  )}
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Badge Detail Modal */}
      {showBadgeDetail && selectedBadge && (
        <div className="badge-detail-modal">
          <div className="modal-overlay" onClick={() => setShowBadgeDetail(false)}></div>
          <div className="modal-content">
            <button 
              className="close-modal"
              onClick={() => setShowBadgeDetail(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="badge-showcase">
              <div 
                className="badge-icon-large"
                style={{ backgroundColor: selectedBadge.color || '#7C5CBF' }}
              >
                <i className={`fas ${selectedBadge.icon}`}></i>
              </div>
              
              <h2>{selectedBadge.name}</h2>
              <p className="badge-description">{selectedBadge.description}</p>
              <p className="badge-earned">Earned on {formatDate(selectedBadge.timestamp)}</p>
              
              <div className="badge-category">
                <span>{badgeCategories.find(c => c.id === selectedBadge.category)?.name || 'General'}</span>
              </div>
            </div>
            
            <div className="badge-actions">
              <button
                className={`badge-display-toggle ${
                  displayedBadges.some(b => b.id === selectedBadge.id) ? 'active' : ''
                }`}
                onClick={() => toggleBadgeDisplay(selectedBadge.id)}
              >
                <i className={`fas ${
                  displayedBadges.some(b => b.id === selectedBadge.id) ? 'fa-eye' : 'fa-eye-slash'
                }`}></i>
                <span>
                  {displayedBadges.some(b => b.id === selectedBadge.id)
                    ? 'Remove from Profile'
                    : 'Display on Profile'
                  }
                </span>
              </button>
              
              <button
                className="badge-share"
                onClick={() => {
                  setShowBadgeDetail(false);
                  navigate('/social-connections', { 
                    state: { shareContent: { type: 'badge', id: selectedBadge.id } } 
                  });
                }}
              >
                <i className="fas fa-share-alt"></i>
                <span>Share Achievement</span>
              </button>
            </div>
            
            {selectedBadge.relatedBadges && selectedBadge.relatedBadges.length > 0 && (
              <div className="related-badges">
                <h3>Related Badges</h3>
                <div className="related-badges-list">
                  {selectedBadge.relatedBadges.map(relatedBadge => {
                    const badge = badges.find(b => b.id === relatedBadge);
                    return badge ? (
                      <div
                        key={badge.id}
                        className={`related-badge-item ${!badge.unlocked ? 'locked' : ''}`}
                        onClick={() => {
                          if (badge.unlocked) {
                            setSelectedBadge(badge);
                          }
                        }}
                      >
                        <div className="related-badge-icon">
                          <i className={`fas ${badge.unlocked ? badge.icon : 'fa-lock'}`}></i>
                        </div>
                        <div className="related-badge-info">
                          <h4>{badge.name}</h4>
                          <p>{badge.unlocked ? 'Unlocked' : 'Locked'}</p>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Status Tag Selector Modal */}
      {showTagSelector && (
        <div className="tag-selector-modal">
          <div className="modal-overlay" onClick={() => setShowTagSelector(false)}></div>
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setShowTagSelector(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            
            <h2>Status Tags</h2>
            <p className="selector-instructions">Select up to 2 tags to display on your profile</p>
            
            <div className="tag-grid">
              {statusTags.map(tag => (
                <div
                  key={tag.id}
                  className={`tag-item ${
                    selectedStatusTags.some(t => t.id === tag.id) ? 'selected' : ''
                  }`}
                  onClick={() => toggleStatusTag(tag.id)}
                  style={{ backgroundColor: tag.color }}
                >
                  <div className="tag-icon">
                    <i className={`fas ${tag.icon}`}></i>
                  </div>
                  <div className="tag-name">{tag.name}</div>
                  
                  {selectedStatusTags.some(t => t.id === tag.id) && (
                    <div className="selected-indicator">
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <button
              className="save-tags-button"
              onClick={() => setShowTagSelector(false)}
            >
              Save Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusBadges;