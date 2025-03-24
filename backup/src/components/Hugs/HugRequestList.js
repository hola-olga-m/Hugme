import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useHug } from '../../contexts/HugContext';
import Loading from '../common/Loading';
import { playHapticFeedback } from '../../utils/haptics';

const HugRequestList = () => {
  const { currentUser } = useAuth();
  const { respondToHugRequest } = useHug();
  
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming', 'outgoing', 'community'
  const [isResponding, setIsResponding] = useState(false);
  const [respondingToRequest, setRespondingToRequest] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [showResponseInput, setShowResponseInput] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // In a real app, this would call your API service
        // For now, we'll simulate a successful API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock request data
        const mockRequests = generateMockRequests();
        setRequests(mockRequests);
      } catch (error) {
        console.error('Failed to load hug requests:', error);
        setError('Failed to load requests. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRequests();
  }, [currentUser?.id]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    playHapticFeedback('selection');
    
    // Reset response state
    setShowResponseInput(false);
    setRespondingToRequest(null);
    setResponseMessage('');
  };
  
  const handleResponseClick = (request, action) => {
    setRespondingToRequest(request);
    
    if (action === 'accept') {
      setShowResponseInput(true);
      playHapticFeedback('selection');
    } else {
      // For decline, just proceed without message
      handleSubmitResponse(request, action);
    }
  };
  
  const handleCancelResponse = () => {
    setShowResponseInput(false);
    setRespondingToRequest(null);
    setResponseMessage('');
  };
  
  const handleMessageChange = (e) => {
    setResponseMessage(e.target.value);
  };
  
  const handleSubmitResponse = async (request, action, message = '') => {
    setIsResponding(true);
    setError('');
    
    try {
      // In a real app, this would call your API service
      // For now, we'll simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate responding to the request
      respondToHugRequest({
        requestId: request.id,
        response: action,
        message: message || responseMessage
      });
      
      // Update the local state to reflect the response
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === request.id 
            ? { ...req, status: action === 'accept' ? 'accepted' : 'declined' } 
            : req
        )
      );
      
      playHapticFeedback('success');
      setSuccess(`Request ${action === 'accept' ? 'accepted' : 'declined'} successfully!`);
      
      // Reset response state
      setShowResponseInput(false);
      setRespondingToRequest(null);
      setResponseMessage('');
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      setError(`Failed to ${action} request. Please try again.`);
      playHapticFeedback('error');
    } finally {
      setIsResponding(false);
    }
  };
  
  // Filter requests based on active tab
  const filteredRequests = requests.filter(request => {
    if (activeTab === 'incoming') {
      return request.type === 'direct' && request.recipientId === currentUser?.id;
    } else if (activeTab === 'outgoing') {
      return request.requesterId === currentUser?.id;
    } else if (activeTab === 'community') {
      return request.type === 'community';
    }
    return false;
  });
  
  if (isLoading) {
    return <Loading text="Loading hug requests..." />;
  }
  
  return (
    <div className="hug-requests-container">
      <div className="hug-requests-header">
        <h1>Hug Requests</h1>
        <p className="subtitle">
          View and respond to hug requests
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
      
      <div className="request-tabs">
        <button 
          className={`tab-button ${activeTab === 'incoming' ? 'active' : ''}`}
          onClick={() => handleTabChange('incoming')}
        >
          <i className="fas fa-inbox"></i> Incoming
          {getRequestCount(requests, 'incoming', currentUser?.id) > 0 && (
            <span className="request-count">
              {getRequestCount(requests, 'incoming', currentUser?.id)}
            </span>
          )}
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'outgoing' ? 'active' : ''}`}
          onClick={() => handleTabChange('outgoing')}
        >
          <i className="fas fa-paper-plane"></i> Outgoing
          {getRequestCount(requests, 'outgoing', currentUser?.id) > 0 && (
            <span className="request-count">
              {getRequestCount(requests, 'outgoing', currentUser?.id)}
            </span>
          )}
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'community' ? 'active' : ''}`}
          onClick={() => handleTabChange('community')}
        >
          <i className="fas fa-users"></i> Community
          {getRequestCount(requests, 'community', currentUser?.id) > 0 && (
            <span className="request-count">
              {getRequestCount(requests, 'community', currentUser?.id)}
            </span>
          )}
        </button>
      </div>
      
      <div className="requests-list">
        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <div className="no-requests-icon">
              <i className={`fas fa-${getEmptyStateIcon(activeTab)}`}></i>
            </div>
            <h3>No {activeTab} requests</h3>
            <p>{getEmptyStateMessage(activeTab)}</p>
            {activeTab !== 'incoming' && (
              <Link to="/hugs/request" className="create-request-btn">
                <i className="fas fa-plus"></i> Create Request
              </Link>
            )}
          </div>
        ) : (
          <div className="request-cards">
            {filteredRequests.map(request => (
              <div 
                key={request.id} 
                className={`request-card ${request.isUrgent ? 'urgent' : ''} ${request.status}`}
              >
                <div className="request-header">
                  <div className="user-avatar">
                    <img 
                      src={activeTab === 'incoming' ? request.requesterAvatar : request.recipientAvatar || '/images/community-avatar.png'} 
                      alt={activeTab === 'incoming' ? request.requesterName : request.recipientName || 'Community'} 
                    />
                    {request.isOnline && <div className="online-indicator"></div>}
                  </div>
                  
                  <div className="request-info">
                    <div className="user-name">
                      {activeTab === 'incoming' ? request.requesterName : (request.type === 'community' ? 'Community' : request.recipientName)}
                    </div>
                    <div className="request-time">
                      {formatTimeAgo(request.createdAt)}
                      {request.isUrgent && (
                        <span className="urgent-badge">
                          <i className="fas fa-exclamation-circle"></i> Urgent
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {request.status !== 'pending' && (
                    <div className={`status-badge ${request.status}`}>
                      <i className={`fas fa-${request.status === 'accepted' ? 'check' : 'times'}`}></i>
                      {request.status === 'accepted' ? 'Accepted' : 'Declined'}
                    </div>
                  )}
                </div>
                
                {request.message && (
                  <div className="request-message">
                    <p>{request.message}</p>
                  </div>
                )}
                
                {activeTab === 'incoming' && request.status === 'pending' && !showResponseInput && (
                  <div className="request-actions">
                    <button 
                      className="accept-btn"
                      onClick={() => handleResponseClick(request, 'accept')}
                      disabled={isResponding}
                    >
                      <i className="fas fa-check"></i> Accept
                    </button>
                    <button 
                      className="decline-btn"
                      onClick={() => handleResponseClick(request, 'decline')}
                      disabled={isResponding}
                    >
                      <i className="fas fa-times"></i> Decline
                    </button>
                  </div>
                )}
                
                {activeTab === 'community' && request.status === 'pending' && !showResponseInput && (
                  <div className="request-actions">
                    <button 
                      className="accept-btn"
                      onClick={() => handleResponseClick(request, 'accept')}
                      disabled={isResponding}
                    >
                      <i className="fas fa-heart"></i> Send a Hug
                    </button>
                  </div>
                )}
                
                {showResponseInput && respondingToRequest?.id === request.id && (
                  <div className="response-form">
                    <textarea
                      value={responseMessage}
                      onChange={handleMessageChange}
                      placeholder="Add a personal message... (optional)"
                      rows={3}
                      disabled={isResponding}
                    />
                    
                    <div className="response-actions">
                      <button 
                        className="cancel-btn"
                        onClick={handleCancelResponse}
                        disabled={isResponding}
                      >
                        Cancel
                      </button>
                      <button 
                        className="send-btn"
                        onClick={() => handleSubmitResponse(request, 'accept')}
                        disabled={isResponding}
                      >
                        {isResponding ? (
                          <Loading type="spinner" size="small" text="" />
                        ) : (
                          <>
                            <i className="fas fa-paper-plane"></i> Send
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
                
                {(request.status === 'accepted' || request.status === 'declined') && request.responseMessage && (
                  <div className="response-message">
                    <div className="response-header">
                      <i className={`fas fa-${request.status === 'accepted' ? 'reply' : 'comment-slash'}`}></i>
                      <span>Response:</span>
                    </div>
                    <p>{request.responseMessage}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="virality-feature">
        <div className="challenge-card">
          <div className="challenge-header">
            <div className="challenge-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h3>Hug Exchange</h3>
          </div>
          <div className="challenge-content">
            <p>Respond to 5 community hug requests this week!</p>
            <p className="challenge-reward">Reward: Exclusive "Community Supporter" badge & mood insights boost</p>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <div className="progress-text">3/5 completed</div>
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

function getRequestCount(requests, tab, userId) {
  return requests.filter(request => {
    if (tab === 'incoming') {
      return request.type === 'direct' && request.recipientId === userId && request.status === 'pending';
    } else if (tab === 'outgoing') {
      return request.requesterId === userId && request.status === 'pending';
    } else if (tab === 'community') {
      return request.type === 'community' && request.status === 'pending';
    }
    return false;
  }).length;
}

function getEmptyStateIcon(tab) {
  switch (tab) {
    case 'incoming':
      return 'inbox';
    case 'outgoing':
      return 'paper-plane';
    case 'community':
      return 'users';
    default:
      return 'envelope';
  }
}

function getEmptyStateMessage(tab) {
  switch (tab) {
    case 'incoming':
      return 'You have no incoming hug requests at the moment';
    case 'outgoing':
      return 'You haven\'t sent any hug requests yet';
    case 'community':
      return 'There are no community hug requests at the moment';
    default:
      return 'No requests found';
  }
}

// Mock data generation
function generateMockRequests() {
  const users = [
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
  ];
  
  const currentUserId = 'currentUser123';
  
  const incomingRequests = [
    {
      id: 'req1',
      type: 'direct',
      requesterId: users[0].id,
      requesterName: users[0].name,
      requesterUsername: users[0].username,
      requesterAvatar: users[0].avatar,
      recipientId: currentUserId,
      message: 'Could use a virtual hug today. Having a rough day at work.',
      isUrgent: true,
      status: 'pending',
      createdAt: '2025-03-24T07:30:00.000Z',
      isOnline: users[0].isOnline
    },
    {
      id: 'req2',
      type: 'direct',
      requesterId: users[1].id,
      requesterName: users[1].name,
      requesterUsername: users[1].username,
      requesterAvatar: users[1].avatar,
      recipientId: currentUserId,
      message: 'Just wanted to check in and see if you could send some positive vibes my way!',
      isUrgent: false,
      status: 'pending',
      createdAt: '2025-03-23T15:45:00.000Z',
      isOnline: users[1].isOnline
    },
    {
      id: 'req3',
      type: 'direct',
      requesterId: users[2].id,
      requesterName: users[2].name,
      requesterUsername: users[2].username,
      requesterAvatar: users[2].avatar,
      recipientId: currentUserId,
      message: 'Feeling a bit down today, could use some encouragement.',
      isUrgent: false,
      status: 'accepted',
      responseMessage: 'Sending you a big virtual hug! Hope your day gets better.',
      createdAt: '2025-03-22T10:15:00.000Z',
      isOnline: users[2].isOnline
    },
    {
      id: 'req4',
      type: 'direct',
      requesterId: users[3].id,
      requesterName: users[3].name,
      requesterUsername: users[3].username,
      requesterAvatar: users[3].avatar,
      recipientId: currentUserId,
      message: 'Miss talking to you! Can I get a hug?',
      isUrgent: false,
      status: 'declined',
      responseMessage: 'Sorry, I\'ve been really busy lately. Let\'s catch up soon though!',
      createdAt: '2025-03-21T09:20:00.000Z',
      isOnline: users[3].isOnline
    }
  ];
  
  const outgoingRequests = [
    {
      id: 'req5',
      type: 'direct',
      requesterId: currentUserId,
      recipientId: users[4].id,
      recipientName: users[4].name,
      recipientUsername: users[4].username,
      recipientAvatar: users[4].avatar,
      message: 'Hey, could use some positive energy today!',
      isUrgent: false,
      status: 'pending',
      createdAt: '2025-03-24T06:10:00.000Z',
      isOnline: users[4].isOnline
    },
    {
      id: 'req6',
      type: 'direct',
      requesterId: currentUserId,
      recipientId: users[0].id,
      recipientName: users[0].name,
      recipientUsername: users[0].username,
      recipientAvatar: users[0].avatar,
      message: 'Feeling a bit stressed about my presentation tomorrow, could use some encouragement.',
      isUrgent: true,
      status: 'accepted',
      responseMessage: 'You\'re going to do great! Remember to breathe and take your time.',
      createdAt: '2025-03-22T14:30:00.000Z',
      isOnline: users[0].isOnline
    },
    {
      id: 'req7',
      type: 'community',
      requesterId: currentUserId,
      message: 'Having a tough day and could use some community support.',
      isUrgent: false,
      status: 'pending',
      createdAt: '2025-03-23T18:45:00.000Z'
    }
  ];
  
  const communityRequests = [
    {
      id: 'req8',
      type: 'community',
      requesterId: users[1].id,
      requesterName: users[1].name,
      requesterUsername: users[1].username,
      requesterAvatar: users[1].avatar,
      message: 'Going through a tough breakup and could use some support from the community.',
      isUrgent: true,
      status: 'pending',
      createdAt: '2025-03-24T08:15:00.000Z',
      isOnline: users[1].isOnline
    },
    {
      id: 'req9',
      type: 'community',
      requesterId: users[3].id,
      requesterName: users[3].name,
      requesterUsername: users[3].username,
      requesterAvatar: users[3].avatar,
      message: 'Feeling really anxious about my upcoming job interview. Any encouragement would be appreciated!',
      isUrgent: false,
      status: 'pending',
      createdAt: '2025-03-23T21:30:00.000Z',
      isOnline: users[3].isOnline
    },
    {
      id: 'req10',
      type: 'community',
      requesterId: users[4].id,
      requesterName: users[4].name,
      requesterUsername: users[4].username,
      requesterAvatar: users[4].avatar,
      message: 'Just finished a big project and would love some celebration hugs!',
      isUrgent: false,
      status: 'pending',
      createdAt: '2025-03-22T16:20:00.000Z',
      isOnline: users[4].isOnline
    }
  ];
  
  return [...incomingRequests, ...outgoingRequests, ...communityRequests];
}

export default HugRequestList;