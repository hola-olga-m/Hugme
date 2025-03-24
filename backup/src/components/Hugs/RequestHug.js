import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHug } from '../../contexts/HugContext';
import Loading from '../common/Loading';
import { playHapticFeedback } from '../../utils/haptics';

const RequestHug = () => {
  const { currentUser } = useAuth();
  const { requestHug } = useHug();
  const navigate = useNavigate();
  
  const [recipient, setRecipient] = useState(null);
  const [recipientInput, setRecipientInput] = useState('');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showRecentRecipients, setShowRecentRecipients] = useState(false);
  const [recentRecipients, setRecentRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Load recent recipients
  useEffect(() => {
    const loadRecentRecipients = async () => {
      // In a real app, this would call your API service
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockRecentRecipients = [
        {
          id: 'user1',
          name: 'Alex Johnson',
          username: 'alexj',
          avatar: 'https://i.pravatar.cc/150?img=1',
          lastInteracted: '2023-06-15T09:30:00Z'
        },
        {
          id: 'user2',
          name: 'Sam Chen',
          username: 'samchen',
          avatar: 'https://i.pravatar.cc/150?img=2',
          lastInteracted: '2023-06-14T15:20:00Z'
        },
        {
          id: 'user3',
          name: 'Taylor Kim',
          username: 'tkim',
          avatar: 'https://i.pravatar.cc/150?img=3',
          lastInteracted: '2023-06-12T11:45:00Z'
        }
      ];
      
      setRecentRecipients(mockRecentRecipients);
    };
    
    loadRecentRecipients();
  }, []);
  
  const handleRecipientSearch = async (e) => {
    const searchValue = e.target.value;
    setRecipientInput(searchValue);
    
    if (searchValue.trim() === '') {
      setSearchResults([]);
      setShowRecentRecipients(false);
      return;
    }
    
    setIsSearching(true);
    setShowRecentRecipients(true);
    
    // In a real app, this would call your API service
    // For now, we'll simulate a search with a delay
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results based on input
      const mockSearchResults = [
        {
          id: 'user1',
          name: 'Alex Johnson',
          username: 'alexj',
          avatar: 'https://i.pravatar.cc/150?img=1',
          isOnline: true
        },
        {
          id: 'user2',
          name: 'Sam Chen',
          username: 'samchen',
          avatar: 'https://i.pravatar.cc/150?img=2',
          isOnline: false
        },
        {
          id: 'user5',
          name: 'Riley Patel',
          username: 'rpatel',
          avatar: 'https://i.pravatar.cc/150?img=5',
          isOnline: true
        }
      ].filter(user => 
        user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.username.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      setSearchResults(mockSearchResults);
    } catch (error) {
      console.error('Error searching for users:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSelectRecipient = (user) => {
    setRecipient(user);
    setRecipientInput('');
    setSearchResults([]);
    setShowRecentRecipients(false);
    playHapticFeedback('selection');
  };
  
  const handleClearRecipient = () => {
    setRecipient(null);
    setRecipientInput('');
  };
  
  const handleToggleUrgent = () => {
    setIsUrgent(!isUrgent);
    playHapticFeedback('selection');
  };
  
  const handleTogglePublic = () => {
    setIsPublic(!isPublic);
    
    // If switching to public, clear recipient
    if (!isPublic) {
      setRecipient(null);
      setRecipientInput('');
    }
    
    playHapticFeedback('selection');
  };
  
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPublic && !recipient) {
      setError('Please select a recipient or make the request public');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate sending the request
      requestHug({
        recipientId: recipient?.id,
        isPublic,
        isUrgent,
        message
      });
      
      playHapticFeedback('success');
      setSuccess('Request sent successfully!');
      
      // Reset form and show success for a moment
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to send request:', error);
      setError('Failed to send request. Please try again.');
      playHapticFeedback('error');
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <Loading text="Loading..." />;
  }
  
  return (
    <div className="request-hug-container">
      <div className="request-hug-header">
        <h1>Request a Hug</h1>
        <p className="subtitle">
          Sometimes we all need a little extra support
        </p>
      </div>
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <span>{success}</span>
        </div>
      )}
      
      <form className="request-hug-form" onSubmit={handleSubmit}>
        <div className="request-type-section">
          <h2>Request Type</h2>
          
          <div className="request-type-options">
            <button
              type="button"
              className={`request-type-btn ${!isPublic ? 'active' : ''}`}
              onClick={() => setIsPublic(false)}
              disabled={isSubmitting}
            >
              <i className="fas fa-user"></i>
              <span>Direct Request</span>
              <p>Request a hug from a specific person</p>
            </button>
            
            <button
              type="button"
              className={`request-type-btn ${isPublic ? 'active' : ''}`}
              onClick={() => setIsPublic(true)}
              disabled={isSubmitting}
            >
              <i className="fas fa-users"></i>
              <span>Community Request</span>
              <p>Request a hug from the HugMood community</p>
            </button>
          </div>
        </div>
        
        {!isPublic && (
          <div className="recipient-section">
            <h2>Select Recipient</h2>
            
            {recipient ? (
              <div className="selected-recipient">
                <div className="recipient-avatar">
                  <img src={recipient.avatar} alt={recipient.name} />
                  {recipient.isOnline && <div className="online-indicator"></div>}
                </div>
                <div className="recipient-info">
                  <div className="recipient-name">{recipient.name}</div>
                  <div className="recipient-username">@{recipient.username}</div>
                </div>
                <button 
                  type="button" 
                  className="clear-recipient-btn"
                  onClick={handleClearRecipient}
                  disabled={isSubmitting}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <div className="recipient-search">
                <div className="search-input-container">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    placeholder="Search for a friend..."
                    value={recipientInput}
                    onChange={handleRecipientSearch}
                    disabled={isSubmitting}
                  />
                </div>
                
                {isSearching && (
                  <div className="search-loading">
                    <Loading type="spinner" size="small" text="Searching..." />
                  </div>
                )}
                
                {showRecentRecipients && (
                  <div className="recipient-results">
                    {searchResults.length > 0 ? (
                      <div className="search-results">
                        {searchResults.map(user => (
                          <div 
                            key={user.id} 
                            className="recipient-option"
                            onClick={() => handleSelectRecipient(user)}
                          >
                            <div className="recipient-avatar">
                              <img src={user.avatar} alt={user.name} />
                              {user.isOnline && <div className="online-indicator"></div>}
                            </div>
                            <div className="recipient-info">
                              <div className="recipient-name">{user.name}</div>
                              <div className="recipient-username">@{user.username}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : recipientInput.trim() !== '' ? (
                      <div className="no-results">
                        <p>No users found matching "{recipientInput}"</p>
                      </div>
                    ) : (
                      <div className="recent-recipients">
                        <h3>Recent Recipients</h3>
                        {recentRecipients.map(user => (
                          <div 
                            key={user.id} 
                            className="recipient-option"
                            onClick={() => handleSelectRecipient(user)}
                          >
                            <div className="recipient-avatar">
                              <img src={user.avatar} alt={user.name} />
                            </div>
                            <div className="recipient-info">
                              <div className="recipient-name">{user.name}</div>
                              <div className="recipient-username">@{user.username}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="message-section">
          <h2>Add a Message{isPublic ? ' (Recommended)' : ' (Optional)'}</h2>
          
          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder={isPublic 
              ? "Let the community know why you're looking for support..." 
              : "Add a personal message to your request..."}
            rows={4}
            maxLength={500}
            disabled={isSubmitting}
          />
          
          <div className="character-count">
            {message.length}/500 characters
          </div>
        </div>
        
        <div className="urgent-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={handleToggleUrgent}
              disabled={isSubmitting}
            />
            <span className="toggle-switch"></span>
            <span>Mark as Urgent</span>
          </label>
          <div className="toggle-description">
            Urgent requests are highlighted and prioritized for faster responses
          </div>
        </div>
        
        <div className="form-actions">
          <Link 
            to="/dashboard" 
            className="cancel-btn"
            disabled={isSubmitting}
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            className="send-btn"
            disabled={isSubmitting || (!isPublic && !recipient)}
          >
            {isSubmitting ? (
              <Loading type="spinner" size="small" text="Sending..." />
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Send Request
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="request-info-box">
        <div className="info-icon">
          <i className="fas fa-info-circle"></i>
        </div>
        <div className="info-content">
          <h3>About Hug Requests</h3>
          <p>
            Requesting a hug is a way to let others know you could use some emotional support.
            {isPublic 
              ? ' Your community request will be visible to all HugMood users who can choose to respond.' 
              : ' Direct requests are only visible to the person you selected.'}
          </p>
          <p>
            <strong>Tip:</strong> Adding a message helps others understand how they can best support you.
          </p>
        </div>
      </div>
      
      <div className="virality-feature">
        <div className="challenge-card">
          <div className="challenge-header">
            <div className="challenge-icon">
              <i className="fas fa-hands-helping"></i>
            </div>
            <h3>Community Support</h3>
          </div>
          <div className="challenge-content">
            <p>Share your experience after receiving support from the community!</p>
            <p className="challenge-reward">Reward: Both giver and receiver earn double streak points</p>
            <button className="challenge-button">
              <i className="fas fa-share-alt"></i> Create Testimonial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHug;