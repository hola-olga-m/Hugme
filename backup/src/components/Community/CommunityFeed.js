
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import '../../styles/Community.css';

const CommunityFeed = () => {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Function to fetch community feed data using GraphQL
    const fetchCommunityFeed = async () => {
      setIsLoading(true);
      
      try {
        // GraphQL query for community feed
        const query = `
          query CommunityFeed($filter: String!, $limit: Int) {
            communityFeed(filter: $filter, limit: $limit) {
              id
              type
              userId
              username
              userAvatar
              timestamp
              isAnonymous
              likeCount
              commentCount
              data
              
              # Extra fields for specific post types
              senderName
              recipientName
              isActive
              participantCount
              creatorName
            }
          }
        `;
        
        // Variables for the query
        const variables = {
          filter: filter,
          limit: 20 // Fetch 20 posts at a time
        };
        
        // Prepare headers with authentication if user is logged in
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (user && localStorage.getItem('token')) {
          headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        }
        
        // Execute the GraphQL query
        const response = await fetch('/graphql', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query,
            variables
          })
        });
        
        const result = await response.json();
        
        if (result.data && result.data.communityFeed) {
          setCommunityPosts(result.data.communityFeed);
        } else if (result.errors) {
          console.error('GraphQL errors:', result.errors);
        }
      } catch (error) {
        console.error('Error fetching community feed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Fetch data when component mounts or filter changes
    fetchCommunityFeed();
    
    // Set up periodic refresh (every 30 seconds)
    const refreshInterval = setInterval(fetchCommunityFeed, 30000);
    
    // Clean up interval on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [user, filter]);
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setIsLoading(true);
  };
  
  const renderPostContent = (post) => {
    switch (post.type) {
      case 'mood':
        return (
          <div className="community-mood-post">
            <div className={`mood-emoji mood-${post.data.mood}`}>
              {getMoodEmoji(post.data.mood)}
            </div>
            <div className="mood-details">
              <p className="mood-text">{post.username} is feeling <strong>{post.data.mood}</strong></p>
              {post.data.note && <p className="mood-note">"{post.data.note}"</p>}
            </div>
            <div className="post-actions">
              <button className="send-hug-btn">Send Hug</button>
            </div>
          </div>
        );
        
      case 'hug':
        return (
          <div className="community-hug-post">
            <div className="hug-icon">
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <div className="hug-details">
              <p className="hug-text">
                {post.isAnonymous ? 'Someone' : post.senderName} sent a 
                <strong> {post.data.hugType} hug </strong> 
                to {post.isAnonymous ? 'someone' : post.recipientName}
              </p>
              {post.data.message && <p className="hug-message">"{post.data.message}"</p>}
            </div>
            <div className="post-timestamp">
              {formatTimeAgo(post.timestamp)}
            </div>
          </div>
        );
        
      case 'group_hug':
        return (
          <div className="community-group-hug-post">
            <div className="group-hug-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="group-hug-details">
              <p className="group-hug-text">
                {post.creatorName} started a group hug with {post.participantCount} people
              </p>
              {post.data.message && <p className="group-hug-message">"{post.data.message}"</p>}
            </div>
            <div className="group-hug-join">
              {post.isActive && <button className="join-group-hug-btn">Join Group Hug</button>}
            </div>
          </div>
        );
        
      case 'achievement':
        return (
          <div className="community-achievement-post">
            <div className="achievement-icon">
              <i className="fas fa-award"></i>
            </div>
            <div className="achievement-details">
              <p className="achievement-text">
                {post.username} earned the <strong>{post.data.name}</strong> badge!
              </p>
              <p className="achievement-description">{post.data.description}</p>
            </div>
          </div>
        );
        
      default:
        return <div>Unknown post type</div>;
    }
  };
  
  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      'happy': '😊',
      'joyful': '😁',
      'excited': '🤩',
      'content': '😌',
      'peaceful': '😇',
      'relaxed': '🙂',
      'neutral': '😐',
      'tired': '😴',
      'bored': '🥱',
      'anxious': '😰',
      'stressed': '😖',
      'sad': '😔',
      'depressed': '😢',
      'angry': '😠',
      'irritated': '😤'
    };
    
    return moodEmojis[mood] || '😶';
  };
  
  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Convert diff to minutes, hours, days
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };
  
  return (
    <div className={`community-feed-container theme-${theme}`}>
      <div className="feed-header">
        <h2>Community Feed</h2>
        <div className="feed-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'moods' ? 'active' : ''}`}
            onClick={() => handleFilterChange('moods')}
          >
            Moods
          </button>
          <button 
            className={`filter-btn ${filter === 'hugs' ? 'active' : ''}`}
            onClick={() => handleFilterChange('hugs')}
          >
            Hugs
          </button>
          <button 
            className={`filter-btn ${filter === 'achievements' ? 'active' : ''}`}
            onClick={() => handleFilterChange('achievements')}
          >
            Achievements
          </button>
        </div>
      </div>
      
      <div className="feed-content">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading community activity...</p>
          </div>
        ) : communityPosts.length > 0 ? (
          communityPosts.map((post) => (
            <div key={post.id} className="community-post">
              <div className="post-header">
                <div className="post-user">
                  <div className="user-avatar">
                    {post.userAvatar ? (
                      <img src={post.userAvatar} alt={post.username} />
                    ) : (
                      <div className="default-avatar">
                        {post.username ? post.username.charAt(0).toUpperCase() : 'A'}
                      </div>
                    )}
                  </div>
                  <Link to={`/profile/${post.userId}`} className="user-name">
                    {post.username}
                  </Link>
                </div>
                <div className="post-time">{formatTimeAgo(post.timestamp)}</div>
              </div>
              
              <div className="post-content">
                {renderPostContent(post)}
              </div>
              
              <div className="post-footer">
                <div className="post-reactions">
                  <button className="reaction-btn">
                    <i className="far fa-heart"></i>
                    <span>{post.likeCount || 0}</span>
                  </button>
                  <button className="reaction-btn">
                    <i className="far fa-comment"></i>
                    <span>{post.commentCount || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-feed">
            <i className="fas fa-search"></i>
            <p>No community posts match your filter</p>
            <button onClick={() => handleFilterChange('all')} className="reset-filter-btn">
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
