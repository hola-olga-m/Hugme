import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';
import { playHapticFeedback } from '../../utils/haptics';

const FriendSystem = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('friends'); // friends, following, followers, pending
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Load friend data
  useEffect(() => {
    const loadFriendData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // In a real app, this would call your API service
        // For now, we'll simulate a successful API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for friends
        const mockFriends = [
          {
            id: 'user1',
            name: 'Alex Johnson',
            username: 'alexj',
            avatar: 'https://i.pravatar.cc/150?img=1',
            isOnline: true,
            currentMood: 'happy',
            lastActive: '2025-03-24T06:30:00Z'
          },
          {
            id: 'user2',
            name: 'Sam Chen',
            username: 'samchen',
            avatar: 'https://i.pravatar.cc/150?img=2',
            isOnline: false,
            currentMood: 'neutral',
            lastActive: '2025-03-23T18:45:00Z'
          },
          {
            id: 'user3',
            name: 'Taylor Kim',
            username: 'tkim',
            avatar: 'https://i.pravatar.cc/150?img=3',
            isOnline: true,
            currentMood: 'focused',
            lastActive: '2025-03-24T07:15:00Z'
          }
        ];
        
        // Mock data for followers (people following you)
        const mockFollowers = [
          ...mockFriends,
          {
            id: 'user4',
            name: 'Jordan Smith',
            username: 'jsmith',
            avatar: 'https://i.pravatar.cc/150?img=4',
            isOnline: false,
            currentMood: 'tired',
            lastActive: '2025-03-23T20:10:00Z'
          },
          {
            id: 'user5',
            name: 'Riley Patel',
            username: 'rpatel',
            avatar: 'https://i.pravatar.cc/150?img=5',
            isOnline: true,
            currentMood: 'excited',
            lastActive: '2025-03-24T07:05:00Z'
          }
        ];
        
        // Mock data for people you follow
        const mockFollowing = [
          ...mockFriends,
          {
            id: 'user6',
            name: 'Casey Williams',
            username: 'cwilliams',
            avatar: 'https://i.pravatar.cc/150?img=6',
            isOnline: false,
            currentMood: 'relaxed',
            lastActive: '2025-03-23T21:30:00Z'
          }
        ];
        
        // Mock data for pending friend requests
        const mockPendingRequests = [
          {
            id: 'request1',
            user: {
              id: 'user7',
              name: 'Avery Garcia',
              username: 'agarcia',
              avatar: 'https://i.pravatar.cc/150?img=7',
              isOnline: true
            },
            message: 'Hey, I found your mood posts inspiring!',
            sentAt: '2025-03-23T14:25:00Z'
          },
          {
            id: 'request2',
            user: {
              id: 'user8',
              name: 'Morgan Lee',
              username: 'mlee',
              avatar: 'https://i.pravatar.cc/150?img=8',
              isOnline: false
            },
            message: 'Would love to connect and share our mood journeys!',
            sentAt: '2025-03-22T16:10:00Z'
          }
        ];
        
        // Mock data for friend requests you've sent
        const mockSentRequests = [
          {
            id: 'sent1',
            user: {
              id: 'user9',
              name: 'Jamie Rodríguez',
              username: 'jrodriguez',
              avatar: 'https://i.pravatar.cc/150?img=9',
              isOnline: false
            },
            message: 'Hi! I really resonated with your mood journey.',
            sentAt: '2025-03-23T11:15:00Z'
          }
        ];
        
        // Mock data for suggested friends
        const mockSuggestedFriends = [
          {
            id: 'user10',
            name: 'Quinn Taylor',
            username: 'qtaylor',
            avatar: 'https://i.pravatar.cc/150?img=10',
            isOnline: true,
            mutualFriends: 3,
            reason: 'Based on similar mood patterns'
          },
          {
            id: 'user11',
            name: 'Reese Park',
            username: 'rpark',
            avatar: 'https://i.pravatar.cc/150?img=11',
            isOnline: false,
            mutualFriends: 2,
            reason: 'Friends with Sam Chen'
          },
          {
            id: 'user12',
            name: 'Dylan Murphy',
            username: 'dmurphy',
            avatar: 'https://i.pravatar.cc/150?img=12',
            isOnline: true,
            mutualFriends: 1,
            reason: 'In your contact list'
          }
        ];
        
        setFriends(mockFriends);
        setFollowers(mockFollowers);
        setFollowing(mockFollowing);
        setPendingRequests(mockPendingRequests);
        setSentRequests(mockSentRequests);
        setSuggestedFriends(mockSuggestedFriends);
      } catch (error) {
        console.error('Failed to load friend data:', error);
        setError('Failed to load friend data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFriendData();
  }, []);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    playHapticFeedback('selection');
  };
  
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a search with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results
      const mockResults = [
        {
          id: 'user13',
          name: 'Jordan Rivera',
          username: 'jrivera',
          avatar: 'https://i.pravatar.cc/150?img=13',
          isOnline: true,
          currentMood: 'creative',
          bio: 'Exploring my emotional journey through art and music'
        },
        {
          id: 'user14',
          name: 'Sasha Reed',
          username: 'sreed',
          avatar: 'https://i.pravatar.cc/150?img=14',
          isOnline: false,
          currentMood: 'thoughtful',
          bio: 'Mindfulness practitioner and psychology enthusiast'
        },
        {
          id: 'user15',
          name: 'Zoe Taylor',
          username: 'ztaylor',
          avatar: 'https://i.pravatar.cc/150?img=15',
          isOnline: true,
          currentMood: 'energetic',
          bio: 'Living each day with intention and gratitude'
        }
      ].filter(user => 
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.username.toLowerCase().includes(value.toLowerCase()) ||
        user.bio.toLowerCase().includes(value.toLowerCase())
      );
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching for users:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleFollowUser = async (userId) => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if already following
      const isAlreadyFollowing = following.some(user => user.id === userId);
      
      if (isAlreadyFollowing) {
        // Unfollow
        setFollowing(following.filter(user => user.id !== userId));
        setSuccess('User unfollowed successfully');
      } else {
        // Follow
        const userToFollow = searchResults.find(user => user.id === userId) || 
                            suggestedFriends.find(user => user.id === userId);
        
        if (userToFollow) {
          setFollowing([...following, userToFollow]);
          setSuccess('Now following user');
        }
      }
      
      playHapticFeedback('success');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Failed to follow/unfollow user:', error);
      setError('Failed to process request. Please try again.');
      playHapticFeedback('error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSendFriendRequest = async (userId, message = '') => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if request already sent
      const isRequestAlreadySent = sentRequests.some(request => request.user.id === userId);
      
      if (!isRequestAlreadySent) {
        // Find user data
        const userToAdd = searchResults.find(user => user.id === userId) || 
                         suggestedFriends.find(user => user.id === userId);
        
        if (userToAdd) {
          // Add to sent requests
          const newRequest = {
            id: `sent-${Date.now()}`,
            user: userToAdd,
            message: message || 'I\'d like to connect with you on HugMood',
            sentAt: new Date().toISOString()
          };
          
          setSentRequests([...sentRequests, newRequest]);
          setSuccess('Friend request sent successfully');
        }
      } else {
        setSuccess('Friend request already sent to this user');
      }
      
      playHapticFeedback('success');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Failed to send friend request:', error);
      setError('Failed to send friend request. Please try again.');
      playHapticFeedback('error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRespondToRequest = async (requestId, response) => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const request = pendingRequests.find(req => req.id === requestId);
      
      if (request) {
        if (response === 'accept') {
          // Add to friends
          setFriends([...friends, request.user]);
          setSuccess('Friend request accepted');
        } else {
          setSuccess('Friend request declined');
        }
        
        // Remove from pending requests
        setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
      }
      
      playHapticFeedback(response === 'accept' ? 'success' : 'selection');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Failed to respond to friend request:', error);
      setError('Failed to process request. Please try again.');
      playHapticFeedback('error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCancelRequest = async (requestId) => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove from sent requests
      setSentRequests(sentRequests.filter(req => req.id !== requestId));
      setSuccess('Friend request canceled');
      
      playHapticFeedback('selection');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Failed to cancel friend request:', error);
      setError('Failed to cancel request. Please try again.');
      playHapticFeedback('error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRemoveFriend = async (userId) => {
    setIsProcessing(true);
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove from friends
      setFriends(friends.filter(friend => friend.id !== userId));
      setSuccess('Friend removed successfully');
      
      playHapticFeedback('selection');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Failed to remove friend:', error);
      setError('Failed to remove friend. Please try again.');
      playHapticFeedback('error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleInviteFriend = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // In a real app, this would call your API service to send an email
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteMessage('');
      setShowInviteForm(false);
      
      playHapticFeedback('success');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Failed to send invitation:', error);
      setError('Failed to send invitation. Please try again.');
      playHapticFeedback('error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const renderFriendsList = () => {
    if (friends.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-user-friends"></i>
          </div>
          <h3>No friends yet</h3>
          <p>Start connecting with others to build your support network</p>
          <button 
            className="action-btn"
            onClick={() => {
              setActiveTab('discover');
              if (searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }}
          >
            <i className="fas fa-search"></i> Find Friends
          </button>
        </div>
      );
    }
    
    return (
      <div className="friends-list">
        {friends.map(friend => (
          <div key={friend.id} className="friend-card">
            <div className="friend-avatar">
              <Link to={`/profile/${friend.username}`}>
                <img src={friend.avatar} alt={friend.name} />
                {friend.isOnline && <div className="online-indicator"></div>}
              </Link>
            </div>
            <div className="friend-info">
              <Link to={`/profile/${friend.username}`} className="friend-name">
                {friend.name}
              </Link>
              <div className="friend-username">@{friend.username}</div>
              <div className="friend-mood">
                <span className={`mood-indicator ${friend.currentMood}`}></span>
                Feeling {friend.currentMood}
              </div>
            </div>
            <div className="friend-actions">
              <Link to={`/hugs/send?recipientId=${friend.id}`} className="action-btn send-hug">
                <i className="fas fa-heart"></i> Send Hug
              </Link>
              <button 
                className="action-btn remove-friend"
                onClick={() => handleRemoveFriend(friend.id)}
                disabled={isProcessing}
              >
                <i className="fas fa-user-minus"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderFollowersList = () => {
    if (followers.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>No followers yet</h3>
          <p>When people follow you, they'll see your mood updates in their feed</p>
          <button 
            className="action-btn"
            onClick={() => setShowInviteForm(true)}
          >
            <i className="fas fa-envelope"></i> Invite Friends
          </button>
        </div>
      );
    }
    
    return (
      <div className="followers-list">
        {followers.map(follower => {
          const isFriend = friends.some(friend => friend.id === follower.id);
          const isFollowing = following.some(user => user.id === follower.id);
          
          return (
            <div key={follower.id} className="follower-card">
              <div className="follower-avatar">
                <Link to={`/profile/${follower.username}`}>
                  <img src={follower.avatar} alt={follower.name} />
                  {follower.isOnline && <div className="online-indicator"></div>}
                </Link>
              </div>
              <div className="follower-info">
                <Link to={`/profile/${follower.username}`} className="follower-name">
                  {follower.name}
                </Link>
                <div className="follower-username">@{follower.username}</div>
                <div className="follower-status">
                  {isFriend ? (
                    <span className="status-badge friend">
                      <i className="fas fa-user-check"></i> Friend
                    </span>
                  ) : isFollowing ? (
                    <span className="status-badge following">
                      <i className="fas fa-user-check"></i> Following
                    </span>
                  ) : (
                    <span className="status-badge follower-only">
                      <i className="fas fa-user"></i> Follows you
                    </span>
                  )}
                </div>
              </div>
              <div className="follower-actions">
                {!isFriend && !isFollowing && (
                  <button 
                    className="action-btn follow-back"
                    onClick={() => handleFollowUser(follower.id)}
                    disabled={isProcessing}
                  >
                    <i className="fas fa-user-plus"></i> Follow Back
                  </button>
                )}
                {isFollowing && !isFriend && (
                  <button 
                    className="action-btn unfollow"
                    onClick={() => handleFollowUser(follower.id)}
                    disabled={isProcessing}
                  >
                    <i className="fas fa-user-minus"></i> Unfollow
                  </button>
                )}
                <Link to={`/hugs/send?recipientId=${follower.id}`} className="action-btn send-hug">
                  <i className="fas fa-heart"></i> Send Hug
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderFollowingList = () => {
    if (following.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-user-plus"></i>
          </div>
          <h3>Not following anyone yet</h3>
          <p>Follow people to see their mood updates in your feed</p>
          <button 
            className="action-btn"
            onClick={() => {
              setActiveTab('discover');
              if (searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }}
          >
            <i className="fas fa-search"></i> Find People to Follow
          </button>
        </div>
      );
    }
    
    return (
      <div className="following-list">
        {following.map(user => {
          const isFriend = friends.some(friend => friend.id === user.id);
          const isFollower = followers.some(follower => follower.id === user.id);
          
          return (
            <div key={user.id} className="following-card">
              <div className="following-avatar">
                <Link to={`/profile/${user.username}`}>
                  <img src={user.avatar} alt={user.name} />
                  {user.isOnline && <div className="online-indicator"></div>}
                </Link>
              </div>
              <div className="following-info">
                <Link to={`/profile/${user.username}`} className="following-name">
                  {user.name}
                </Link>
                <div className="following-username">@{user.username}</div>
                <div className="following-mood">
                  <span className={`mood-indicator ${user.currentMood}`}></span>
                  Feeling {user.currentMood}
                </div>
                <div className="following-status">
                  {isFriend ? (
                    <span className="status-badge friend">
                      <i className="fas fa-user-check"></i> Friend
                    </span>
                  ) : isFollower ? (
                    <span className="status-badge mutual">
                      <i className="fas fa-exchange-alt"></i> Follows you
                    </span>
                  ) : (
                    <span className="status-badge following-only">
                      <i className="fas fa-user"></i> Following
                    </span>
                  )}
                </div>
              </div>
              <div className="following-actions">
                <button 
                  className="action-btn unfollow"
                  onClick={() => handleFollowUser(user.id)}
                  disabled={isProcessing}
                >
                  <i className="fas fa-user-minus"></i> Unfollow
                </button>
                <Link to={`/hugs/send?recipientId=${user.id}`} className="action-btn send-hug">
                  <i className="fas fa-heart"></i> Send Hug
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderPendingRequestsList = () => {
    return (
      <div className="requests-lists">
        {pendingRequests.length > 0 && (
          <div className="incoming-requests">
            <h3>Friend Requests</h3>
            <div className="requests-list">
              {pendingRequests.map(request => (
                <div key={request.id} className="request-card">
                  <div className="requester-avatar">
                    <Link to={`/profile/${request.user.username}`}>
                      <img src={request.user.avatar} alt={request.user.name} />
                      {request.user.isOnline && <div className="online-indicator"></div>}
                    </Link>
                  </div>
                  <div className="request-info">
                    <div className="requester-name">
                      <Link to={`/profile/${request.user.username}`}>
                        {request.user.name}
                      </Link>
                    </div>
                    <div className="requester-username">@{request.user.username}</div>
                    <div className="request-message">
                      "{request.message}"
                    </div>
                    <div className="request-time">
                      {formatTimeAgo(request.sentAt)}
                    </div>
                  </div>
                  <div className="request-actions">
                    <button 
                      className="action-btn accept"
                      onClick={() => handleRespondToRequest(request.id, 'accept')}
                      disabled={isProcessing}
                    >
                      <i className="fas fa-check"></i> Accept
                    </button>
                    <button 
                      className="action-btn decline"
                      onClick={() => handleRespondToRequest(request.id, 'decline')}
                      disabled={isProcessing}
                    >
                      <i className="fas fa-times"></i> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {sentRequests.length > 0 && (
          <div className="sent-requests">
            <h3>Sent Requests</h3>
            <div className="requests-list">
              {sentRequests.map(request => (
                <div key={request.id} className="request-card sent">
                  <div className="recipient-avatar">
                    <Link to={`/profile/${request.user.username}`}>
                      <img src={request.user.avatar} alt={request.user.name} />
                      {request.user.isOnline && <div className="online-indicator"></div>}
                    </Link>
                  </div>
                  <div className="request-info">
                    <div className="recipient-name">
                      <Link to={`/profile/${request.user.username}`}>
                        {request.user.name}
                      </Link>
                    </div>
                    <div className="recipient-username">@{request.user.username}</div>
                    <div className="request-message">
                      "{request.message}"
                    </div>
                    <div className="request-time">
                      Sent {formatTimeAgo(request.sentAt)}
                    </div>
                  </div>
                  <div className="request-actions">
                    <button 
                      className="action-btn cancel"
                      onClick={() => handleCancelRequest(request.id)}
                      disabled={isProcessing}
                    >
                      <i className="fas fa-ban"></i> Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {pendingRequests.length === 0 && sentRequests.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-envelope-open"></i>
            </div>
            <h3>No pending requests</h3>
            <p>Friend requests you send or receive will appear here</p>
            <button 
              className="action-btn"
              onClick={() => {
                setActiveTab('discover');
                if (searchInputRef.current) {
                  searchInputRef.current.focus();
                }
              }}
            >
              <i className="fas fa-search"></i> Find Friends
            </button>
          </div>
        )}
      </div>
    );
  };
  
  const renderDiscoverSection = () => {
    return (
      <div className="discover-section">
        <div className="search-section">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, username, or bio..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSearchResults([]);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          {isSearching && (
            <div className="search-loading">
              <Loading type="spinner" size="small" text="Searching..." />
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results</h3>
              <div className="results-list">
                {searchResults.map(user => {
                  const isFriend = friends.some(friend => friend.id === user.id);
                  const isFollowing = following.some(following => following.id === user.id);
                  const isPendingRequest = sentRequests.some(request => request.user.id === user.id);
                  
                  return (
                    <div key={user.id} className="user-card">
                      <div className="user-avatar">
                        <Link to={`/profile/${user.username}`}>
                          <img src={user.avatar} alt={user.name} />
                          {user.isOnline && <div className="online-indicator"></div>}
                        </Link>
                      </div>
                      <div className="user-info">
                        <Link to={`/profile/${user.username}`} className="user-name">
                          {user.name}
                        </Link>
                        <div className="user-username">@{user.username}</div>
                        <div className="user-bio">{user.bio}</div>
                        <div className="user-mood">
                          <span className={`mood-indicator ${user.currentMood}`}></span>
                          Feeling {user.currentMood}
                        </div>
                      </div>
                      <div className="user-actions">
                        {isFriend ? (
                          <Link to={`/profile/${user.username}`} className="action-btn view-profile">
                            <i className="fas fa-user-check"></i> Friend
                          </Link>
                        ) : isPendingRequest ? (
                          <button className="action-btn pending" disabled>
                            <i className="fas fa-clock"></i> Request Sent
                          </button>
                        ) : (
                          <button 
                            className="action-btn add-friend"
                            onClick={() => handleSendFriendRequest(user.id)}
                            disabled={isProcessing}
                          >
                            <i className="fas fa-user-plus"></i> Add Friend
                          </button>
                        )}
                        
                        {!isFriend && !isPendingRequest && (
                          <button 
                            className={`action-btn ${isFollowing ? 'unfollow' : 'follow'}`}
                            onClick={() => handleFollowUser(user.id)}
                            disabled={isProcessing}
                          >
                            <i className={`fas fa-${isFollowing ? 'user-minus' : 'rss'}`}></i>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {(searchTerm === '' || searchResults.length === 0) && (
          <>
            <div className="suggested-friends">
              <h3>Suggested Friends</h3>
              {suggestedFriends.length > 0 ? (
                <div className="suggested-list">
                  {suggestedFriends.map(user => {
                    const isFollowing = following.some(following => following.id === user.id);
                    
                    return (
                      <div key={user.id} className="suggestion-card">
                        <div className="user-avatar">
                          <Link to={`/profile/${user.username}`}>
                            <img src={user.avatar} alt={user.name} />
                            {user.isOnline && <div className="online-indicator"></div>}
                          </Link>
                        </div>
                        <div className="user-info">
                          <Link to={`/profile/${user.username}`} className="user-name">
                            {user.name}
                          </Link>
                          <div className="user-username">@{user.username}</div>
                          <div className="suggestion-reason">
                            <i className="fas fa-info-circle"></i> {user.reason}
                          </div>
                          {user.mutualFriends > 0 && (
                            <div className="mutual-friends">
                              <i className="fas fa-user-friends"></i> {user.mutualFriends} mutual {user.mutualFriends === 1 ? 'friend' : 'friends'}
                            </div>
                          )}
                        </div>
                        <div className="user-actions">
                          <button 
                            className="action-btn add-friend"
                            onClick={() => handleSendFriendRequest(user.id)}
                            disabled={isProcessing}
                          >
                            <i className="fas fa-user-plus"></i> Add Friend
                          </button>
                          <button 
                            className={`action-btn ${isFollowing ? 'unfollow' : 'follow'}`}
                            onClick={() => handleFollowUser(user.id)}
                            disabled={isProcessing}
                          >
                            <i className={`fas fa-${isFollowing ? 'user-minus' : 'rss'}`}></i>
                            {isFollowing ? 'Unfollow' : 'Follow'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-suggestions">
                  <p>No suggestions available at the moment</p>
                </div>
              )}
            </div>
            
            <div className="invite-friends-section">
              <div className="invite-card">
                <div className="invite-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="invite-content">
                  <h3>Invite Friends to HugMood</h3>
                  <p>Share the emotional support journey with friends and family</p>
                  <button 
                    className="invite-btn"
                    onClick={() => setShowInviteForm(!showInviteForm)}
                  >
                    <i className="fas fa-paper-plane"></i> Send Invitation
                  </button>
                </div>
              </div>
              
              {showInviteForm && (
                <form className="invite-form" onSubmit={handleInviteFriend}>
                  <h3>Invite a Friend</h3>
                  <div className="form-group">
                    <label htmlFor="invite-email">Email Address</label>
                    <input
                      id="invite-email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter friend's email"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="invite-message">Personal Message (Optional)</label>
                    <textarea
                      id="invite-message"
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      placeholder="Add a personal message to your invitation"
                      rows={3}
                      disabled={isProcessing}
                    ></textarea>
                  </div>
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setShowInviteForm(false)}
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="send-btn"
                      disabled={isProcessing || !inviteEmail.trim()}
                    >
                      {isProcessing ? (
                        <Loading type="spinner" size="small" text="" />
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i> Send Invitation
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    );
  };
  
  if (isLoading) {
    return <Loading text="Loading friend data..." />;
  }
  
  return (
    <div className="friend-system-container">
      <div className="friend-system-header">
        <h1>Friends & Following</h1>
        <p className="subtitle">
          Connect with others on your emotional wellness journey
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
      
      <div className="friend-system-tabs">
        <button 
          className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => handleTabChange('friends')}
        >
          <i className="fas fa-user-friends"></i> Friends
          <span className="count-badge">{friends.length}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => handleTabChange('followers')}
        >
          <i className="fas fa-users"></i> Followers
          <span className="count-badge">{followers.length}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => handleTabChange('following')}
        >
          <i className="fas fa-user-plus"></i> Following
          <span className="count-badge">{following.length}</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => handleTabChange('pending')}
        >
          <i className="fas fa-bell"></i> Requests
          {pendingRequests.length > 0 && (
            <span className="count-badge alert">{pendingRequests.length}</span>
          )}
        </button>
        <button 
          className={`tab-button ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => handleTabChange('discover')}
        >
          <i className="fas fa-search"></i> Discover
        </button>
      </div>
      
      <div className="friend-system-content">
        {activeTab === 'friends' && renderFriendsList()}
        {activeTab === 'followers' && renderFollowersList()}
        {activeTab === 'following' && renderFollowingList()}
        {activeTab === 'pending' && renderPendingRequestsList()}
        {activeTab === 'discover' && renderDiscoverSection()}
      </div>
      
      <div className="virality-feature">
        <div className="challenge-card">
          <div className="challenge-header">
            <div className="challenge-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Social Butterfly Challenge</h3>
          </div>
          <div className="challenge-content">
            <p>Connect with 5 new friends this week to expand your support network!</p>
            <p className="challenge-reward">Reward: Early access to group mood insights & special badge</p>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '40%' }}></div>
              </div>
              <div className="progress-text">2/5 completed</div>
            </div>
            <button className="challenge-button">
              <i className="fas fa-share-alt"></i> Share Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time
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

export default FriendSystem;