import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';
import { moodEmojis } from '../../assets/moodEmojis';
import { playHapticFeedback } from '../../utils/haptics';

const MoodFollowing = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState([]);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'mood', 'alphabetical'
  const [filterMood, setFilterMood] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadFollowingMoods = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // In a real app, this would call your API service
        // For now, we'll simulate a successful API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data
        const data = generateMockFollowing();
        setFollowing(data);
      } catch (error) {
        console.error('Failed to load following moods:', error);
        setError('Failed to load moods from people you follow. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFollowingMoods();
  }, [currentUser?.id]);
  
  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    
    // Sort the following array based on the selected sort type
    const sortedFollowing = [...following];
    
    switch (sortType) {
      case 'recent':
        sortedFollowing.sort((a, b) => new Date(b.lastMoodUpdate.date) - new Date(a.lastMoodUpdate.date));
        break;
      case 'mood':
        sortedFollowing.sort((a, b) => b.lastMoodUpdate.value - a.lastMoodUpdate.value);
        break;
      case 'alphabetical':
        sortedFollowing.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    setFollowing(sortedFollowing);
  };
  
  const handleFilterChange = (mood) => {
    setFilterMood(mood);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSendHug = (userId) => {
    playHapticFeedback('impact');
    // In a real app, this would open a modal or navigate to the send hug page
    console.log(`Sending hug to user ${userId}`);
  };
  
  // Filter the following array based on selected filters and search term
  const filteredFollowing = following.filter(user => {
    // Filter by mood if a specific mood is selected
    if (filterMood !== 'all' && user.lastMoodUpdate.mood !== filterMood) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  if (isLoading) {
    return <Loading text="Loading moods from people you follow..." />;
  }
  
  return (
    <div className="mood-following">
      <div className="following-header">
        <h1>Friend Moods</h1>
        <p className="following-subtitle">
          Track moods of people you care about
        </p>
      </div>
      
      {error && (
        <div className="following-error">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      
      <div className="following-controls">
        <div className="search-filter">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          
          <div className="mood-filter">
            <button 
              className={`filter-button ${filterMood === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All
            </button>
            <button 
              className={`filter-button positive ${filterMood === 'ecstatic' || filterMood === 'happy' ? 'active' : ''}`}
              onClick={() => handleFilterChange('happy')}
            >
              <span className="filter-emoji">😊</span> Happy
            </button>
            <button 
              className={`filter-button neutral ${filterMood === 'good' || filterMood === 'neutral' ? 'active' : ''}`}
              onClick={() => handleFilterChange('neutral')}
            >
              <span className="filter-emoji">😐</span> Neutral
            </button>
            <button 
              className={`filter-button negative ${filterMood === 'down' || filterMood === 'sad' ? 'active' : ''}`}
              onClick={() => handleFilterChange('sad')}
            >
              <span className="filter-emoji">😔</span> Sad
            </button>
          </div>
        </div>
        
        <div className="sort-container">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => handleSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="recent">Most Recent</option>
            <option value="mood">Mood Score</option>
            <option value="alphabetical">Name</option>
          </select>
        </div>
      </div>
      
      <div className="following-list">
        {filteredFollowing.length === 0 ? (
          <div className="no-following">
            {searchTerm || filterMood !== 'all' ? (
              <p>No matches found for your current filters</p>
            ) : (
              <>
                <p>You're not following anyone yet</p>
                <Link to="/friends" className="find-friends-btn">
                  <i className="fas fa-user-plus"></i> Find Friends
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="following-grid">
            {filteredFollowing.map((user) => (
              <div key={user.id} className="following-card">
                <div className="following-user-info">
                  <Link to={`/profile/${user.username}`} className="user-avatar">
                    <img src={user.avatar} alt={user.name} />
                    {user.isOnline && <div className="online-indicator"></div>}
                  </Link>
                  <div className="user-details">
                    <Link to={`/profile/${user.username}`} className="user-name">
                      {user.name}
                    </Link>
                    <div className="user-username">@{user.username}</div>
                  </div>
                </div>
                
                <div className="following-mood-info">
                  <div className="mood-info">
                    <div className="mood-emoji">
                      {moodEmojis[user.lastMoodUpdate.mood]?.emoji || '😐'}
                    </div>
                    <div className="mood-details">
                      <div className="mood-label">
                        {moodEmojis[user.lastMoodUpdate.mood]?.label || 'Unknown'}
                      </div>
                      <div className="mood-time">
                        {formatTimeAgo(user.lastMoodUpdate.date)}
                      </div>
                    </div>
                  </div>
                  
                  {user.lastMoodUpdate.note && (
                    <div className="mood-note">
                      "{user.lastMoodUpdate.note}"
                    </div>
                  )}
                  
                  <div className="mood-actions">
                    <button 
                      className="send-hug-btn"
                      onClick={() => handleSendHug(user.id)}
                    >
                      <i className="fas fa-heart"></i> Send Hug
                    </button>
                    
                    {user.requestingHug && (
                      <div className="hug-request-indicator">
                        <i className="fas fa-hand-holding-heart"></i> Requesting a hug
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="streak-indicator">
                  <i className="fas fa-fire"></i> 
                  <span>{user.streak} day streak</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="following-cta">
        <div className="cta-card find-friends">
          <h3>Expand Your Circle</h3>
          <p>Find more friends to follow and share your mood journey with</p>
          <Link to="/friends" className="find-friends-btn">
            <i className="fas fa-user-plus"></i> Find Friends
          </Link>
        </div>
        
        <div className="cta-card update-mood">
          <h3>Update Your Mood</h3>
          <p>Let your friends know how you're feeling today</p>
          <Link to="/mood/update" className="update-mood-btn">
            <i className="fas fa-plus"></i> Record Your Mood
          </Link>
        </div>
      </div>
      
      <div className="virality-feature">
        <div className="challenge-card">
          <div className="challenge-header">
            <div className="challenge-icon">
              <i className="fas fa-star"></i>
            </div>
            <h3>Mood Challenge</h3>
          </div>
          <div className="challenge-content">
            <p>Invite 3 friends to track their mood for 7 consecutive days!</p>
            <p className="challenge-reward">Reward: 7-day streak booster & exclusive badge</p>
            <button className="challenge-button">
              <i className="fas fa-paper-plane"></i> Invite Friends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

// Mock data generation
function generateMockFollowing() {
  const moods = ['ecstatic', 'happy', 'good', 'neutral', 'down', 'sad', 'upset', 'terrible'];
  const moodNotes = [
    "Having a great day!",
    "Just finished a big project",
    "Feeling a bit tired today",
    "Excited about the weekend",
    "Nothing special today",
    "Missing my family",
    "Stressed about work",
    "Had a tough conversation",
    "Learned something new today",
    "Grateful for small things"
  ];
  
  const users = [
    {
      id: 'user1',
      name: 'Alex Johnson',
      username: 'alexj',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isOnline: true,
      streak: 5,
      requestingHug: false
    },
    {
      id: 'user2',
      name: 'Sam Chen',
      username: 'samchen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      isOnline: false,
      streak: 12,
      requestingHug: true
    },
    {
      id: 'user3',
      name: 'Taylor Kim',
      username: 'tkim',
      avatar: 'https://i.pravatar.cc/150?img=3',
      isOnline: true,
      streak: 3,
      requestingHug: false
    },
    {
      id: 'user4',
      name: 'Jordan Smith',
      username: 'jsmith',
      avatar: 'https://i.pravatar.cc/150?img=4',
      isOnline: false,
      streak: 21,
      requestingHug: false
    },
    {
      id: 'user5',
      name: 'Riley Patel',
      username: 'rpatel',
      avatar: 'https://i.pravatar.cc/150?img=5',
      isOnline: true,
      streak: 7,
      requestingHug: true
    },
    {
      id: 'user6',
      name: 'Casey Williams',
      username: 'cwilliams',
      avatar: 'https://i.pravatar.cc/150?img=6',
      isOnline: false,
      streak: 1,
      requestingHug: false
    },
    {
      id: 'user7',
      name: 'Avery Garcia',
      username: 'agarcia',
      avatar: 'https://i.pravatar.cc/150?img=7',
      isOnline: true,
      streak: 14,
      requestingHug: false
    },
    {
      id: 'user8',
      name: 'Morgan Lee',
      username: 'mlee',
      avatar: 'https://i.pravatar.cc/150?img=8',
      isOnline: false,
      streak: 9,
      requestingHug: false
    }
  ];
  
  // Generate random last mood updates for users
  return users.map(user => {
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    const randomNote = Math.random() > 0.3 ? moodNotes[Math.floor(Math.random() * moodNotes.length)] : '';
    const randomHoursAgo = Math.floor(Math.random() * 72); // 0-72 hours ago
    
    const date = new Date();
    date.setHours(date.getHours() - randomHoursAgo);
    
    return {
      ...user,
      lastMoodUpdate: {
        mood: randomMood,
        value: moodEmojis[randomMood]?.value || 5,
        note: randomNote,
        date: date.toISOString()
      }
    };
  });
}

export default MoodFollowing;