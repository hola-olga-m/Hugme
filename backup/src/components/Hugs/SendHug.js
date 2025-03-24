import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHug } from '../../contexts/HugContext';
import Loading from '../common/Loading';
import { playHapticFeedback } from '../../utils/haptics';
import { hugTypes } from '../../assets/hugTypes';

const SendHug = () => {
  const { currentUser } = useAuth();
  const { sendHug } = useHug();
  const navigate = useNavigate();
  const location = useLocation();
  const messageInputRef = useRef(null);
  
  // Get selected hug type from URL params
  const queryParams = new URLSearchParams(location.search);
  const initialHugType = queryParams.get('type') || '';
  const recipientId = queryParams.get('recipientId') || '';
  
  const [selectedHugType, setSelectedHugType] = useState(initialHugType);
  const [recipient, setRecipient] = useState(null);
  const [recipientInput, setRecipientInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingHug, setIsSendingHug] = useState(false);
  const [showRecentRecipients, setShowRecentRecipients] = useState(false);
  const [recentRecipients, setRecentRecipients] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Get all available hug types
  const hugTypesList = Object.entries(hugTypes).map(([id, hug]) => ({
    id,
    ...hug
  }));
  
  // If initial hug type is selected, make sure it's valid
  useEffect(() => {
    if (initialHugType && !hugTypes[initialHugType]) {
      setSelectedHugType('');
    }
  }, [initialHugType]);
  
  // If recipientId is provided, fetch recipient details
  useEffect(() => {
    if (recipientId) {
      const fetchRecipient = async () => {
        setIsLoading(true);
        try {
          // In a real app, this would call your API service
          // For now, we'll simulate a successful API call with mock data
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Mock recipient data
          const mockRecipient = {
            id: recipientId,
            name: 'Sam Chen',
            username: 'samchen',
            avatar: 'https://i.pravatar.cc/150?img=2',
            isOnline: true
          };
          
          setRecipient(mockRecipient);
        } catch (error) {
          console.error('Failed to load recipient:', error);
          setError('Failed to load recipient. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchRecipient();
    }
  }, [recipientId]);
  
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
    
    // Focus on message input after selecting recipient
    if (messageInputRef.current && selectedHugType) {
      messageInputRef.current.focus();
    }
  };
  
  const handleClearRecipient = () => {
    setRecipient(null);
    setRecipientInput('');
  };
  
  const handleSelectHugType = (hugTypeId) => {
    setSelectedHugType(hugTypeId);
    playHapticFeedback('selection');
    
    // Focus on message input after selecting hug type
    if (messageInputRef.current && recipient) {
      messageInputRef.current.focus();
    }
  };
  
  const handleTogglePublic = () => {
    setIsPublic(!isPublic);
    playHapticFeedback('selection');
  };
  
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedHugType) {
      setError('Please select a hug type');
      return;
    }
    
    if (!recipient && !isPublic) {
      setError('Please select a recipient or make the hug public');
      return;
    }
    
    setError('');
    setIsSendingHug(true);
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate sending the hug
      sendHug({
        recipientId: recipient?.id,
        hugType: selectedHugType,
        message,
        isPublic
      });
      
      playHapticFeedback('success');
      setSuccess('Hug sent successfully!');
      
      // Reset form and show success for a moment
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to send hug:', error);
      setError('Failed to send hug. Please try again.');
      playHapticFeedback('error');
      setIsSendingHug(false);
    }
  };
  
  if (isLoading) {
    return <Loading text="Loading..." />;
  }
  
  return (
    <div className="send-hug-container">
      <div className="send-hug-header">
        <h1>Send a Hug</h1>
        <p className="subtitle">
          Share a virtual embrace with someone you care about
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
      
      <form className="send-hug-form" onSubmit={handleSubmit}>
        <div className="form-section recipient-section">
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
                disabled={isSendingHug}
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
                  disabled={isSendingHug}
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
              
              <div className="public-toggle">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={handleTogglePublic}
                    disabled={isSendingHug}
                  />
                  <span className="toggle-switch"></span>
                  <span>Share with community</span>
                </label>
                <div className="toggle-description">
                  Your hug will be visible in the community feed
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="form-section hug-type-section">
          <h2>Choose Hug Type</h2>
          
          <div className="hug-type-grid">
            {hugTypesList.map(hug => (
              <div 
                key={hug.id} 
                className={`hug-type-option ${selectedHugType === hug.id ? 'selected' : ''}`}
                onClick={() => handleSelectHugType(hug.id)}
              >
                <div className="hug-icon" style={{ backgroundColor: hug.color || '#3498db' }}>
                  <i className={`fas fa-${hug.icon}`}></i>
                </div>
                <div className="hug-name">{hug.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-section message-section">
          <h2>Add a Personal Message (Optional)</h2>
          
          <textarea
            ref={messageInputRef}
            value={message}
            onChange={handleMessageChange}
            placeholder="Write a message to go with your hug..."
            rows={4}
            maxLength={500}
            disabled={isSendingHug}
          />
          
          <div className="character-count">
            {message.length}/500 characters
          </div>
        </div>
        
        <div className="form-actions">
          <Link 
            to="/hugs/types" 
            className="cancel-btn"
            disabled={isSendingHug}
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            className="send-btn"
            disabled={isSendingHug || (!recipient && !isPublic) || !selectedHugType}
          >
            {isSendingHug ? (
              <Loading type="spinner" size="small" text="Sending..." />
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Send Hug
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="virality-feature">
        <div className="milestone-card">
          <div className="milestone-icon">
            <i className="fas fa-award"></i>
          </div>
          <div className="milestone-content">
            <h3>Hug Milestone</h3>
            <p>You've sent 47 hugs! Send 3 more to unlock the "Compassionate Soul" badge.</p>
            <div className="milestone-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '94%' }}></div>
              </div>
              <div className="progress-text">47/50</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendHug;