import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHug } from '../../contexts/HugContext';
import Loading from '../common/Loading';
import { playHapticFeedback } from '../../utils/haptics';
import { hugTypes } from '../../assets/hugTypes';

const GroupHug = () => {
  const { currentUser } = useAuth();
  const { createGroupHug, joinGroupHug } = useHug();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const messageInputRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(!groupId);
  const [selectedHugType, setSelectedHugType] = useState('support');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(24); // hours
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [isPublic, setIsPublic] = useState(true);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  
  // Get all available hug types
  const hugTypesList = Object.entries(hugTypes).map(([id, hug]) => ({
    id,
    ...hug
  })).filter(hug => hug.supportsGroup === true || !('supportsGroup' in hug));
  
  // Load group data if viewing an existing group
  useEffect(() => {
    if (!isCreatingGroup) {
      const loadGroupData = async () => {
        setIsLoading(true);
        setError('');
        
        try {
          // In a real app, this would call your API service
          // For now, we'll simulate a successful API call with mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock group data
          const mockGroupData = {
            id: groupId,
            title: 'Support Circle: Finals Week',
            message: 'Let\'s support each other through finals week! Join this group hug for positive vibes and encouragement.',
            hugType: 'support',
            creator: {
              id: 'user2',
              name: 'Sam Chen',
              username: 'samchen',
              avatar: 'https://i.pravatar.cc/150?img=2',
            },
            participants: [
              {
                id: 'user2',
                name: 'Sam Chen',
                username: 'samchen',
                avatar: 'https://i.pravatar.cc/150?img=2',
                joinedAt: '2025-03-23T09:30:00Z',
                isOnline: true,
                isCreator: true
              },
              {
                id: 'user1',
                name: 'Alex Johnson',
                username: 'alexj',
                avatar: 'https://i.pravatar.cc/150?img=1',
                joinedAt: '2025-03-23T10:15:00Z',
                isOnline: false,
                isCreator: false
              },
              {
                id: 'user5',
                name: 'Riley Patel',
                username: 'rpatel',
                avatar: 'https://i.pravatar.cc/150?img=5',
                joinedAt: '2025-03-23T11:45:00Z',
                isOnline: true,
                isCreator: false
              }
            ],
            maxParticipants: 10,
            duration: 24, // hours
            createdAt: '2025-03-23T09:30:00Z',
            expiresAt: '2025-03-24T09:30:00Z',
            isPublic: true,
            invitedUsers: [
              {
                id: 'user3',
                name: 'Taylor Kim',
                username: 'tkim',
                avatar: 'https://i.pravatar.cc/150?img=3',
              },
              {
                id: 'user4',
                name: 'Jordan Smith',
                username: 'jsmith',
                avatar: 'https://i.pravatar.cc/150?img=4',
              }
            ],
            messages: [
              {
                id: 'msg1',
                senderId: 'user2',
                senderName: 'Sam Chen',
                senderAvatar: 'https://i.pravatar.cc/150?img=2',
                text: 'Welcome to our Finals Week support group! Let\'s help each other stay motivated!',
                timestamp: '2025-03-23T09:35:00Z'
              },
              {
                id: 'msg2',
                senderId: 'user1',
                senderName: 'Alex Johnson',
                senderAvatar: 'https://i.pravatar.cc/150?img=1',
                text: 'Thanks for creating this group! I\'m really stressed about my Computer Science final.',
                timestamp: '2025-03-23T10:20:00Z'
              },
              {
                id: 'msg3',
                senderId: 'user5',
                senderName: 'Riley Patel',
                senderAvatar: 'https://i.pravatar.cc/150?img=5',
                text: 'We\'ve got this! Remember to take breaks and practice self-care.',
                timestamp: '2025-03-23T11:50:00Z'
              }
            ]
          };
          
          setGroupData(mockGroupData);
          
          // Check if current user is a participant
          const isParticipant = mockGroupData.participants.some(
            participant => participant.id === currentUser?.id
          );
          
          setHasJoined(isParticipant);
        } catch (error) {
          console.error('Failed to load group data:', error);
          setError('Failed to load group data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadGroupData();
    } else {
      setIsLoading(false);
    }
  }, [groupId, isCreatingGroup, currentUser?.id]);
  
  const handleHugTypeSelect = (hugTypeId) => {
    setSelectedHugType(hugTypeId);
    playHapticFeedback('selection');
  };
  
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  
  const handleDurationChange = (e) => {
    setDuration(parseInt(e.target.value, 10));
  };
  
  const handleMaxParticipantsChange = (e) => {
    setMaxParticipants(parseInt(e.target.value, 10));
  };
  
  const handleTogglePublic = () => {
    setIsPublic(!isPublic);
    playHapticFeedback('selection');
  };
  
  const handleUserSearch = async (e) => {
    const searchValue = e.target.value;
    setUserSearch(searchValue);
    
    if (searchValue.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
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
          id: 'user3',
          name: 'Taylor Kim',
          username: 'tkim',
          avatar: 'https://i.pravatar.cc/150?img=3',
          isOnline: true
        },
        {
          id: 'user4',
          name: 'Jordan Smith',
          username: 'jsmith',
          avatar: 'https://i.pravatar.cc/150?img=4',
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
  
  const handleAddInvitedUser = (user) => {
    // Check if user is already invited
    if (!invitedUsers.some(invited => invited.id === user.id)) {
      setInvitedUsers([...invitedUsers, user]);
      playHapticFeedback('selection');
    }
    
    // Clear search
    setUserSearch('');
    setSearchResults([]);
  };
  
  const handleRemoveInvitedUser = (userId) => {
    setInvitedUsers(invitedUsers.filter(user => user.id !== userId));
  };
  
  const handleJoinGroup = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate joining the group
      joinGroupHug(groupId);
      
      // Update local state to reflect joining
      setHasJoined(true);
      setGroupData(prevData => ({
        ...prevData,
        participants: [
          ...prevData.participants,
          {
            id: currentUser?.id || 'currentUser123',
            name: currentUser?.name || 'You',
            username: currentUser?.username || 'you',
            avatar: currentUser?.avatar || 'https://i.pravatar.cc/150?img=7',
            joinedAt: new Date().toISOString(),
            isOnline: true,
            isCreator: false
          }
        ]
      }));
      
      playHapticFeedback('success');
      setSuccess('You\'ve joined the group hug!');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Failed to join group:', error);
      setError('Failed to join group. Please try again.');
      playHapticFeedback('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title for the group hug');
      return;
    }
    
    if (!selectedHugType) {
      setError('Please select a hug type');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate creating the group
      const groupData = {
        title,
        message,
        hugType: selectedHugType,
        maxParticipants,
        duration,
        isPublic,
        invitedUsers: invitedUsers.map(user => user.id)
      };
      
      createGroupHug(groupData);
      
      playHapticFeedback('success');
      setSuccess('Group hug created successfully!');
      
      // Reset form and navigate to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to create group:', error);
      setError('Failed to create group. Please try again.');
      playHapticFeedback('error');
      setIsSubmitting(false);
    }
  };
  
  const renderGroupForm = () => {
    return (
      <form className="create-group-form" onSubmit={handleCreateGroup}>
        <div className="form-section">
          <h2>Group Hug Details</h2>
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Give your group hug a name..."
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message (Optional)</label>
            <textarea
              id="message"
              ref={messageInputRef}
              value={message}
              onChange={handleMessageChange}
              placeholder="Add a message for the group..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Hug Type</h2>
          
          <div className="hug-type-grid">
            {hugTypesList.map(hug => (
              <div 
                key={hug.id} 
                className={`hug-type-option ${selectedHugType === hug.id ? 'selected' : ''}`}
                onClick={() => handleHugTypeSelect(hug.id)}
              >
                <div className="hug-icon" style={{ backgroundColor: hug.color || '#3498db' }}>
                  <i className={`fas fa-${hug.icon}`}></i>
                </div>
                <div className="hug-name">{hug.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-section">
          <h2>Group Settings</h2>
          
          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <select
              id="duration"
              value={duration}
              onChange={handleDurationChange}
              disabled={isSubmitting}
            >
              <option value={1}>1 hour</option>
              <option value={3}>3 hours</option>
              <option value={6}>6 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={48}>2 days</option>
              <option value={72}>3 days</option>
              <option value={168}>1 week</option>
            </select>
            <div className="form-hint">How long the group hug will last</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="maxParticipants">Maximum Participants</label>
            <select
              id="maxParticipants"
              value={maxParticipants}
              onChange={handleMaxParticipantsChange}
              disabled={isSubmitting}
            >
              <option value={5}>5 people</option>
              <option value={10}>10 people</option>
              <option value={25}>25 people</option>
              <option value={50}>50 people</option>
              <option value={100}>100 people</option>
              <option value={0}>No limit</option>
            </select>
            <div className="form-hint">Maximum number of participants allowed</div>
          </div>
          
          <div className="form-group">
            <div className="public-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={handleTogglePublic}
                  disabled={isSubmitting}
                />
                <span className="toggle-switch"></span>
                <span>Public Group</span>
              </label>
              <div className="toggle-description">
                Public groups are visible to all users. Private groups are invite-only.
              </div>
            </div>
          </div>
        </div>
        
        {!isPublic && (
          <div className="form-section">
            <h2>Invite People</h2>
            
            <div className="invite-search">
              <div className="search-input-container">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search for users to invite..."
                  value={userSearch}
                  onChange={handleUserSearch}
                  disabled={isSubmitting}
                />
              </div>
              
              {isSearching && (
                <div className="search-loading">
                  <Loading type="spinner" size="small" text="Searching..." />
                </div>
              )}
              
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map(user => (
                    <div 
                      key={user.id} 
                      className="user-option"
                      onClick={() => handleAddInvitedUser(user)}
                    >
                      <div className="user-avatar">
                        <img src={user.avatar} alt={user.name} />
                        {user.isOnline && <div className="online-indicator"></div>}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-username">@{user.username}</div>
                      </div>
                      <div className="add-user-btn">
                        <i className="fas fa-plus"></i>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {invitedUsers.length > 0 && (
              <div className="invited-users">
                <h3>Invited Users</h3>
                <div className="invited-user-list">
                  {invitedUsers.map(user => (
                    <div key={user.id} className="invited-user">
                      <div className="user-avatar">
                        <img src={user.avatar} alt={user.name} />
                      </div>
                      <div className="user-name">{user.name}</div>
                      <button 
                        type="button" 
                        className="remove-user-btn"
                        onClick={() => handleRemoveInvitedUser(user.id)}
                        disabled={isSubmitting}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
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
            className="create-btn"
            disabled={isSubmitting || !title.trim() || !selectedHugType}
          >
            {isSubmitting ? (
              <Loading type="spinner" size="small" text="Creating..." />
            ) : (
              <>
                <i className="fas fa-users"></i> Create Group Hug
              </>
            )}
          </button>
        </div>
      </form>
    );
  };
  
  const renderGroupView = () => {
    if (!groupData) return null;
    
    const isExpired = new Date(groupData.expiresAt) < new Date();
    const isCreator = groupData.creator.id === currentUser?.id;
    const participantCount = groupData.participants.length;
    const isFull = groupData.maxParticipants > 0 && participantCount >= groupData.maxParticipants;
    
    return (
      <div className="group-view">
        <div className="group-header" style={{ backgroundColor: `${hugTypes[groupData.hugType]?.color}22` || '#3498db22' }}>
          <div className="group-type-icon" style={{ color: hugTypes[groupData.hugType]?.color || '#3498db' }}>
            <i className={`fas fa-${hugTypes[groupData.hugType]?.icon || 'heart'}`}></i>
          </div>
          
          <h1>{groupData.title}</h1>
          
          <div className="group-meta">
            <div className="created-by">
              Created by{' '}
              <Link to={`/profile/${groupData.creator.username}`} className="creator-link">
                {groupData.creator.name}
              </Link>
            </div>
            
            <div className="group-stats">
              <div className="stat">
                <i className="fas fa-users"></i> {participantCount}
                {groupData.maxParticipants > 0 && ` / ${groupData.maxParticipants}`}
              </div>
              
              <div className="stat">
                <i className="fas fa-clock"></i> {isExpired ? 'Ended' : 'Ends in ' + getTimeRemaining(groupData.expiresAt)}
              </div>
              
              <div className="stat">
                <i className={`fas fa-${groupData.isPublic ? 'globe' : 'lock'}`}></i>
                {groupData.isPublic ? ' Public' : ' Private'}
              </div>
            </div>
          </div>
        </div>
        
        {groupData.message && (
          <div className="group-message">
            <p>{groupData.message}</p>
          </div>
        )}
        
        {!hasJoined && !isExpired && !isFull && (
          <div className="join-group-section">
            <p>Join this group hug to connect with others!</p>
            <button 
              className="join-btn"
              onClick={handleJoinGroup}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loading type="spinner" size="small" text="Joining..." />
              ) : (
                <>
                  <i className="fas fa-heart"></i> Join Group Hug
                </>
              )}
            </button>
          </div>
        )}
        
        {!hasJoined && isExpired && (
          <div className="expired-message">
            <div className="expired-icon">
              <i className="fas fa-hourglass-end"></i>
            </div>
            <h3>This group hug has ended</h3>
            <p>This group is no longer active as it has reached its end time.</p>
            <Link to="/hugs/group/create" className="create-new-btn">
              <i className="fas fa-plus"></i> Create a New Group
            </Link>
          </div>
        )}
        
        {!hasJoined && isFull && !isExpired && (
          <div className="full-message">
            <div className="full-icon">
              <i className="fas fa-users-slash"></i>
            </div>
            <h3>This group hug is full</h3>
            <p>The maximum number of participants has been reached.</p>
            <Link to="/hugs/group/create" className="create-new-btn">
              <i className="fas fa-plus"></i> Create a New Group
            </Link>
          </div>
        )}
        
        {hasJoined && (
          <>
            <div className="group-content">
              <div className="participants-section">
                <h2>Participants</h2>
                <div className="participants-list">
                  {groupData.participants.map(participant => (
                    <div key={participant.id} className="participant">
                      <Link to={`/profile/${participant.username}`} className="participant-avatar">
                        <img src={participant.avatar} alt={participant.name} />
                        {participant.isOnline && <div className="online-indicator"></div>}
                        {participant.isCreator && <div className="creator-badge" title="Group Creator"><i className="fas fa-crown"></i></div>}
                      </Link>
                      <div className="participant-name">{participant.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="message-section">
                <h2>Group Messages</h2>
                <div className="messages-list">
                  {groupData.messages.map(message => (
                    <div key={message.id} className={`message ${message.senderId === currentUser?.id ? 'own-message' : ''}`}>
                      <div className="message-avatar">
                        <img src={message.senderAvatar} alt={message.senderName} />
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          <div className="message-sender">{message.senderName}</div>
                          <div className="message-time">{formatTimeAgo(message.timestamp)}</div>
                        </div>
                        <div className="message-text">{message.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!isExpired && (
                  <div className="message-input">
                    <textarea 
                      placeholder="Write a message to the group..."
                      rows={2}
                    />
                    <button className="send-btn">
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="group-actions">
              {isCreator && (
                <button className="invite-more-btn">
                  <i className="fas fa-user-plus"></i> Invite More People
                </button>
              )}
              
              <Link to="/hugs/group/create" className="create-new-btn">
                <i className="fas fa-plus"></i> Create Another Group
              </Link>
            </div>
          </>
        )}
      </div>
    );
  };
  
  if (isLoading) {
    return <Loading text={isCreatingGroup ? "Loading group hug form..." : "Loading group hug..."} />;
  }
  
  return (
    <div className="group-hug-container">
      <div className="group-hug-header">
        <h1>{isCreatingGroup ? 'Create Group Hug' : 'Group Hug'}</h1>
        <p className="subtitle">
          {isCreatingGroup 
            ? 'Create a shared virtual space for multiple people to connect'
            : 'A shared virtual space for group support and connection'
          }
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
      
      {isCreatingGroup ? renderGroupForm() : renderGroupView()}
      
      <div className="virality-feature">
        <div className="challenge-card">
          <div className="challenge-header">
            <div className="challenge-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Group Hug Challenge</h3>
          </div>
          <div className="challenge-content">
            <p>Create a group hug with 5+ participants that lasts for 24 hours!</p>
            <p className="challenge-reward">Reward: Unlock "Community Builder" badge & animated group hug effects</p>
            <button className="challenge-button">
              <i className="fas fa-share-alt"></i> Share Challenge
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

function getTimeRemaining(dateString) {
  const endDate = new Date(dateString);
  const now = new Date();
  const diffMs = endDate - now;
  
  if (diffMs <= 0) return 'Ended';
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
  if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`;
  return `${diffMins}m`;
}

export default GroupHug;