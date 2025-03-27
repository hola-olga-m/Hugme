import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import MainLayout from '../layouts/MainLayout';
import { 
  GET_USERS, 
  GET_SENT_HUGS, 
  GET_RECEIVED_HUGS, 
  GET_PENDING_HUG_REQUESTS,
  GET_MY_HUG_REQUESTS,
  GET_COMMUNITY_HUG_REQUESTS
} from '../graphql/queries';
import { 
  SEND_HUG, 
  MARK_HUG_AS_READ, 
  CREATE_HUG_REQUEST, 
  RESPOND_TO_HUG_REQUEST,
  CANCEL_HUG_REQUEST
} from '../graphql/mutations';
import { useAuth } from '../contexts/AuthContext';
import { HugIcon, HugEmoji, HugTypeLabel, AnimatedHug } from '../components/HugIcons';
import HugGallery from '../components/HugGallery';
import EnhancedHugItem from '../components/EnhancedHugItem';

function HugCenterPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('received');
  const [showSendHugModal, setShowSendHugModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [hugType, setHugType] = useState('QUICK');
  const [hugMessage, setHugMessage] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [isCommunityRequest, setIsCommunityRequest] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Queries
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: sentHugsData, loading: sentHugsLoading, refetch: refetchSentHugs } = useQuery(GET_SENT_HUGS);
  const { data: receivedHugsData, loading: receivedHugsLoading, refetch: refetchReceivedHugs } = useQuery(GET_RECEIVED_HUGS);
  const { data: pendingRequestsData, loading: pendingRequestsLoading, refetch: refetchPendingRequests } = useQuery(GET_PENDING_HUG_REQUESTS);
  const { data: myRequestsData, loading: myRequestsLoading, refetch: refetchMyRequests } = useQuery(GET_MY_HUG_REQUESTS);
  const { data: communityRequestsData, loading: communityRequestsLoading, refetch: refetchCommunityRequests } = useQuery(GET_COMMUNITY_HUG_REQUESTS);

  // Mutations
  const [sendHug] = useMutation(SEND_HUG, {
    onCompleted: () => {
      refetchSentHugs();
      setSuccess('Hug sent successfully!');
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(`Failed to send hug: ${error.message}`);
      setTimeout(() => setError(null), 5000);
    }
  });

  const [markHugAsRead] = useMutation(MARK_HUG_AS_READ, {
    onCompleted: () => {
      refetchReceivedHugs();
    }
  });

  const [createHugRequest] = useMutation(CREATE_HUG_REQUEST, {
    onCompleted: () => {
      refetchMyRequests();
      refetchCommunityRequests();
      setSuccess('Hug request created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(`Failed to create request: ${error.message}`);
      setTimeout(() => setError(null), 5000);
    }
  });

  const [respondToHugRequest] = useMutation(RESPOND_TO_HUG_REQUEST, {
    onCompleted: () => {
      refetchPendingRequests();
      refetchSentHugs();
      refetchReceivedHugs();
      setSuccess('Response sent successfully!');
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(`Failed to respond to request: ${error.message}`);
      setTimeout(() => setError(null), 5000);
    }
  });

  const [cancelHugRequest] = useMutation(CANCEL_HUG_REQUEST, {
    onCompleted: () => {
      refetchMyRequests();
      setSuccess('Request cancelled successfully!');
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error) => {
      setError(`Failed to cancel request: ${error.message}`);
      setTimeout(() => setError(null), 5000);
    }
  });

  // Handle sending a hug
  const handleSendHug = (e) => {
    e.preventDefault();
    
    sendHug({
      variables: {
        sendHugInput: {
          recipientId: selectedUserId,
          type: hugType,
          message: hugMessage.trim() || undefined
        }
      }
    });

    // Reset form and close modal
    setHugType('QUICK');
    setHugMessage('');
    setSelectedUserId('');
    setShowSendHugModal(false);
  };

  // Handle creating a hug request
  const handleCreateRequest = (e) => {
    e.preventDefault();
    
    createHugRequest({
      variables: {
        createHugRequestInput: {
          recipientId: isCommunityRequest ? undefined : selectedUserId,
          message: requestMessage.trim() || undefined,
          isCommunityRequest
        }
      }
    });

    // Reset form and close modal
    setRequestMessage('');
    setSelectedUserId('');
    setIsCommunityRequest(false);
    setShowRequestModal(false);
  };

  // Handle responding to a hug request
  const handleRespondToRequest = (requestId, status, message = '') => {
    respondToHugRequest({
      variables: {
        respondToRequestInput: {
          requestId,
          status,
          message: message.trim() || undefined
        }
      }
    });
  };

  // Handle cancelling a hug request
  const handleCancelRequest = (requestId) => {
    cancelHugRequest({
      variables: {
        requestId
      }
    });
  };

  // Handle marking a hug as read
  const handleMarkAsRead = (hugId) => {
    markHugAsRead({
      variables: {
        hugId
      }
    });
  };

  // Open send hug modal
  const openSendHugModal = (userId = '') => {
    setSelectedUserId(userId);
    setHugType('QUICK');
    setHugMessage('');
    setError(null);
    setShowSendHugModal(true);
  };

  // Open request hug modal
  const openRequestModal = (userId = '') => {
    setSelectedUserId(userId);
    setRequestMessage('');
    setIsCommunityRequest(!userId);
    setError(null);
    setShowRequestModal(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get hug type display
  const getHugTypeDisplay = (type) => {
    switch (type) {
      case 'QUICK': return 'Quick Hug';
      case 'WARM': return 'Warm Hug';
      case 'SUPPORTIVE': return 'Supportive Hug';
      case 'COMFORTING': return 'Comforting Hug';
      case 'ENCOURAGING': return 'Encouraging Hug';
      case 'CELEBRATORY': return 'Celebratory Hug';
      default: return type;
    }
  };

  // Get request status display
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'ACCEPTED': return 'Accepted';
      case 'DECLINED': return 'Declined';
      case 'EXPIRED': return 'Expired';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  };

  // Filter out the current user from the users list
  const otherUsers = usersData?.users?.filter(user => user.id !== currentUser?.id) || [];

  return (
    <MainLayout>
      <div className="hug-center-page" style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(135deg, #fdfbfb 0%, #f8f7ff 100%)',
          padding: '20px',
          minHeight: '80vh'
        }}>
        {/* Ambient Background Animation */}
        <div className="ambient-background" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.5,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="floating-shape" style={{
              position: 'absolute',
              width: `${Math.random() * 40 + 30}px`,
              height: `${Math.random() * 40 + 30}px`,
              backgroundColor: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, ${Math.random() * 200 + 55}, 0.2)`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s infinite ease-in-out`,
              filter: 'blur(8px)',
              transform: `scale(${Math.random() * 2 + 1})`,
              opacity: Math.random() * 0.6 + 0.4
            }} />
          ))}
        </div>
        
        <div className="hug-center-content" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hug-center-header" style={{
            textAlign: 'center',
            padding: '20px 0 30px',
            position: 'relative'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: '0',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              position: 'relative'
            }}>
              Hug Center
              <span style={{ 
                position: 'absolute',
                fontSize: '0.8rem',
                top: '-10px',
                right: '-30px',
                background: '#ED64A6',
                color: 'white',
                padding: '3px 10px',
                borderRadius: '20px',
                transform: 'rotate(15deg)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>✨ New</span>
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#6B7280',
              maxWidth: '600px',
              margin: '10px auto',
              lineHeight: 1.5
            }}>Connect through meaningful virtual embraces that brighten your day and strengthen bonds</p>
            
            <div className="heartbeat-indicator" style={{
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              height: '30px',
              opacity: 0.7
            }}>
              <svg width="100%" height="100%" viewBox="0 0 100 30" fill="none">
                <path 
                  d="M0 15 H20 L25 5 L30 25 L35 10 L40 20 L45 15 L50 5 L55 15 L60 10 L65 20 L70 5 L75 25 L80 15 H100" 
                  stroke="#F472B6" 
                  strokeWidth="2"
                  style={{ animation: 'pulse 1.5s infinite' }}
                />
              </svg>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{
              backgroundColor: '#FEE2E2',
              borderLeft: '4px solid #EF4444',
              color: '#B91C1C',
              padding: '12px 16px',
              borderRadius: '8px',
              margin: '10px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div className="alert-content" style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>⚠️</span>
                <span>{error}</span>
              </div>
              <button 
                className="alert-close" 
                onClick={() => setError(null)}
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B91C1C',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{
              backgroundColor: '#D1FAE5',
              borderLeft: '4px solid #10B981',
              color: '#065F46',
              padding: '12px 16px',
              borderRadius: '8px',
              margin: '10px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div className="alert-content" style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>✅</span>
                <span>{success}</span>
              </div>
              <button 
                className="alert-close" 
                onClick={() => setSuccess(null)}
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#065F46',
                  fontSize: '1.2rem',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
            </div>
          )}

          <div className="hug-center-actions" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            margin: '20px 0 30px'
          }}>
            <button 
              className="btn btn-primary send-hug-btn"
              onClick={() => openSendHugModal()}
              style={{
                backgroundColor: '#8B5CF6',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>👐</span>
              Send a Hug
            </button>
            <button 
              className="btn btn-outline request-hug-btn"
              onClick={() => openRequestModal()}
              style={{
                backgroundColor: 'transparent',
                color: '#8B5CF6',
                border: '2px solid #8B5CF6',
                padding: '12px 24px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>✋</span>
              Request a Hug
            </button>
          </div>

          <div className="hug-visualizer" style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div className="hug-stat-circles" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div className="stat-circle" style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#EDE9FE',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(139, 92, 246, 0.15)'
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B5CF6' }}>
                  {sentHugsData?.sentHugs?.length || 0}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Sent</span>
              </div>
              <div className="stat-circle" style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#DDD6FE',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.25)',
                position: 'relative',
                zIndex: 1
              }}>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7C3AED' }}>
                  {(sentHugsData?.sentHugs?.length || 0) + (receivedHugsData?.receivedHugs?.length || 0)}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Total Hugs</span>
              </div>
              <div className="stat-circle" style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#EDE9FE',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(139, 92, 246, 0.15)'
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B5CF6' }}>
                  {receivedHugsData?.receivedHugs?.length || 0}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Received</span>
              </div>
            </div>
          </div>

          <div className="hug-center-tabs" style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }}>
            <div className="tabs-header" style={{
              display: 'flex',
              borderBottom: '1px solid #E5E7EB',
              position: 'relative',
              backgroundColor: 'white'
            }}>
              <button 
                className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
                onClick={() => setActiveTab('received')}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: 'none',
                  background: 'none',
                  fontWeight: activeTab === 'received' ? 'bold' : 'normal',
                  color: activeTab === 'received' ? '#7C3AED' : '#6B7280',
                  borderBottom: activeTab === 'received' ? '3px solid #7C3AED' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                Received
              </button>
              <button 
                className={`tab-button ${activeTab === 'sent' ? 'active' : ''}`}
                onClick={() => setActiveTab('sent')}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: 'none',
                  background: 'none',
                  fontWeight: activeTab === 'sent' ? 'bold' : 'normal',
                  color: activeTab === 'sent' ? '#7C3AED' : '#6B7280',
                  borderBottom: activeTab === 'sent' ? '3px solid #7C3AED' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                Sent
              </button>
              <button 
                className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: 'none',
                  background: 'none',
                  fontWeight: activeTab === 'pending' ? 'bold' : 'normal',
                  color: activeTab === 'pending' ? '#7C3AED' : '#6B7280',
                  borderBottom: activeTab === 'pending' ? '3px solid #7C3AED' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                Requests
              </button>
              <button 
                className={`tab-button ${activeTab === 'my-requests' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-requests')}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: 'none',
                  background: 'none',
                  fontWeight: activeTab === 'my-requests' ? 'bold' : 'normal',
                  color: activeTab === 'my-requests' ? '#7C3AED' : '#6B7280',
                  borderBottom: activeTab === 'my-requests' ? '3px solid #7C3AED' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                My Requests
              </button>
              <button 
                className={`tab-button ${activeTab === 'community' ? 'active' : ''}`}
                onClick={() => setActiveTab('community')}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: 'none',
                  background: 'none',
                  fontWeight: activeTab === 'community' ? 'bold' : 'normal',
                  color: activeTab === 'community' ? '#7C3AED' : '#6B7280',
                  borderBottom: activeTab === 'community' ? '3px solid #7C3AED' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                Community
              </button>
              
              {/* Animated Indicator */}
              <div 
                className="tab-indicator" 
                style={{
                  height: '3px',
                  backgroundColor: '#7C3AED',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '20%',
                  transform: `translateX(${['received', 'sent', 'pending', 'my-requests', 'community'].indexOf(activeTab) * 100}%)`,
                  transition: 'transform 0.3s ease',
                  display: 'none' // Hidden because we're using individual border-bottom
                }}
              />
            </div>

          <div className="tabs-content">
            {/* Received Hugs Tab */}
            {activeTab === 'received' && (
              <div className="tab-pane">
                <h3>Received Hugs</h3>
                {receivedHugsLoading ? (
                  <div className="loading-spinner centered" />
                ) : receivedHugsData?.receivedHugs?.length > 0 ? (
                  <div className="hugs-list">
                    {receivedHugsData.receivedHugs.map(hug => (
                      <EnhancedHugItem 
                        key={hug.id} 
                        hug={hug}
                        isSent={false}
                        onMarkAsRead={() => handleMarkAsRead(hug.id)}
                        onSendHug={() => openSendHugModal(hug.sender.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 20px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(237, 233, 254, 0.3)',
                    borderRadius: '16px',
                    margin: '20px 0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div className="empty-state-decoration" style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      opacity: 0.1,
                      zIndex: 0,
                      pointerEvents: 'none'
                    }}>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{
                          position: 'absolute',
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          border: '3px solid #8B5CF6',
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: Math.random() * 0.8 + 0.2
                        }} />
                      ))}
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <p style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#6D28D9',
                        marginBottom: '20px'
                      }}>Your hug inbox is waiting for warmth!</p>
                      <div style={{ margin: '20px 0' }}>
                        <AnimatedHug type="WARM" size="large" speed="slow" />
                      </div>
                      <p style={{
                        fontSize: '1rem',
                        color: '#6B7280',
                        maxWidth: '400px',
                        margin: '15px auto',
                        lineHeight: 1.5
                      }}>When friends send you hugs, they'll appear here. Why not spread some joy by sending the first hug?</p>
                      <button 
                        onClick={() => openSendHugModal()}
                        style={{
                          backgroundColor: '#8B5CF6',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '50px',
                          fontWeight: 'bold',
                          marginTop: '15px',
                          boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>👐</span>
                        Send Your First Hug
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sent Hugs Tab */}
            {activeTab === 'sent' && (
              <div className="tab-pane">
                <h3>Sent Hugs</h3>
                {sentHugsLoading ? (
                  <div className="loading-spinner centered" />
                ) : sentHugsData?.sentHugs?.length > 0 ? (
                  <div className="hugs-list">
                    {sentHugsData.sentHugs.map(hug => (
                      <EnhancedHugItem 
                        key={hug.id} 
                        hug={hug}
                        isSent={true}
                        onSendHug={() => openSendHugModal(hug.recipient.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 20px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(237, 233, 254, 0.3)',
                    borderRadius: '16px',
                    margin: '20px 0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div className="empty-state-decoration" style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      opacity: 0.1,
                      zIndex: 0,
                      pointerEvents: 'none'
                    }}>
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} style={{
                          position: 'absolute',
                          width: '15px',
                          height: '15px',
                          backgroundColor: '#8B5CF6',
                          borderRadius: '50%',
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: Math.random() * 0.5 + 0.1,
                          transform: `scale(${Math.random() * 1.5 + 0.5})`
                        }} />
                      ))}
                    </div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <p style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#6D28D9',
                        marginBottom: '20px'
                      }}>Time to share some positive vibes!</p>
                      <div style={{ margin: '20px 0' }}>
                        <AnimatedHug type="ENCOURAGING" size="large" speed="slow" />
                      </div>
                      <p style={{
                        fontSize: '1rem',
                        color: '#6B7280',
                        maxWidth: '400px',
                        margin: '15px auto',
                        lineHeight: 1.5
                      }}>Your sent hugs will appear here. A simple virtual embrace can make someone's day brighter!</p>
                      <button 
                        onClick={() => openSendHugModal()}
                        style={{
                          backgroundColor: '#8B5CF6',
                          color: 'white',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '50px',
                          fontWeight: 'bold',
                          marginTop: '15px',
                          boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>💫</span>
                        Send a Hug Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pending Requests Tab */}
            {activeTab === 'pending' && (
              <div className="tab-pane">
                <h3>Pending Hug Requests</h3>
                {pendingRequestsLoading ? (
                  <div className="loading-spinner centered" />
                ) : pendingRequestsData?.pendingHugRequests?.length > 0 ? (
                  <div className="requests-list">
                    {pendingRequestsData.pendingHugRequests.map(request => (
                      <div key={request.id} className="request-item">
                        <div className="request-content">
                          <div className="request-header">
                            <span className="request-sender">
                              From: {request.requester.name || request.requester.username}
                            </span>
                            <span className="request-type">
                              {request.isCommunityRequest ? 'Community Request' : 'Personal Request'}
                            </span>
                          </div>
                          {request.message && (
                            <div className="request-message">"{request.message}"</div>
                          )}
                          <div className="request-footer">
                            <span className="request-date">{formatDate(request.createdAt)}</span>
                            <span className="request-status">{getStatusDisplay(request.status)}</span>
                          </div>
                        </div>
                        <div className="request-actions">
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleRespondToRequest(request.id, 'ACCEPTED')}
                          >
                            Accept
                          </button>
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => handleRespondToRequest(request.id, 'DECLINED')}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 20px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(237, 233, 254, 0.3)',
                    borderRadius: '16px',
                    margin: '20px 0',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ 
                        fontSize: '4rem', 
                        marginBottom: '15px',
                        opacity: 0.8
                      }}>
                        🧸
                      </div>
                      <p style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#6D28D9',
                        marginBottom: '10px'
                      }}>All caught up!</p>
                      <p style={{
                        fontSize: '1rem',
                        color: '#6B7280',
                        maxWidth: '400px',
                        margin: '15px auto',
                        lineHeight: 1.5
                      }}>You don't have any pending hug requests at the moment. Check back later!</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* My Requests Tab */}
            {activeTab === 'my-requests' && (
              <div className="tab-pane">
                <h3>My Hug Requests</h3>
                {myRequestsLoading ? (
                  <div className="loading-spinner centered" />
                ) : myRequestsData?.myHugRequests?.length > 0 ? (
                  <div className="requests-list">
                    {myRequestsData.myHugRequests.map(request => (
                      <div key={request.id} className="request-item">
                        <div className="request-content">
                          <div className="request-header">
                            <span className="request-recipient">
                              {request.isCommunityRequest 
                                ? 'To: Community'
                                : `To: ${request.recipient?.name || request.recipient?.username}`}
                            </span>
                            <span className="request-type">
                              {request.isCommunityRequest ? 'Community Request' : 'Personal Request'}
                            </span>
                          </div>
                          {request.message && (
                            <div className="request-message">"{request.message}"</div>
                          )}
                          <div className="request-footer">
                            <span className="request-date">{formatDate(request.createdAt)}</span>
                            <span className={`request-status status-${request.status.toLowerCase()}`}>
                              {getStatusDisplay(request.status)}
                            </span>
                          </div>
                        </div>
                        <div className="request-actions">
                          {request.status === 'PENDING' && (
                            <button 
                              className="btn btn-sm btn-outline btn-danger"
                              onClick={() => handleCancelRequest(request.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>You haven't made any hug requests yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Community Tab */}
            {activeTab === 'community' && (
              <div className="tab-pane">
                <h3>Community Hug Requests</h3>
                {communityRequestsLoading ? (
                  <div className="loading-spinner centered" />
                ) : communityRequestsData?.communityHugRequests?.length > 0 ? (
                  <div className="requests-list">
                    {communityRequestsData.communityHugRequests
                      .filter(request => request.requester.id !== currentUser?.id) // Don't show own requests
                      .map(request => (
                        <div key={request.id} className="request-item">
                          <div className="request-content">
                            <div className="request-header">
                              <span className="request-sender">
                                From: {request.requester.name || request.requester.username}
                              </span>
                              <span className="request-type">Community Request</span>
                            </div>
                            {request.message && (
                              <div className="request-message">"{request.message}"</div>
                            )}
                            <div className="request-footer">
                              <span className="request-date">{formatDate(request.createdAt)}</span>
                              <span className="request-status">{getStatusDisplay(request.status)}</span>
                            </div>
                          </div>
                          <div className="request-actions">
                            {request.status === 'PENDING' && (
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => handleRespondToRequest(request.id, 'ACCEPTED')}
                              >
                                Send a Hug
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>There are no community hug requests at the moment.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Hug Modal */}
      {showSendHugModal && (
        <div className="modal hug-selection-modal" onClick={() => setShowSendHugModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send a Hug</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowSendHugModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSendHug}>
                <div className="form-group">
                  <label className="form-label" htmlFor="recipient">Recipient</label>
                  <select
                    id="recipient"
                    className="form-select"
                    value={selectedUserId}
                    onChange={e => setSelectedUserId(e.target.value)}
                    required
                  >
                    <option value="">Select a recipient</option>
                    {otherUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.username}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Choose a Hug Type</label>
                  <HugGallery selectedType={hugType} onSelectHug={setHugType} />
                  
                  <div className="hug-selection-preview">
                    <AnimatedHug type={hugType} size="large" />
                    <h4 className="hug-preview-title">
                      {getHugTypeDisplay(hugType)}
                    </h4>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="hugMessage">Message (Optional)</label>
                  <textarea
                    id="hugMessage"
                    className="form-textarea"
                    value={hugMessage}
                    onChange={e => setHugMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    maxLength={200}
                  ></textarea>
                  <div className="textarea-counter">
                    {hugMessage.length}/200 characters
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowSendHugModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Send Hug
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Request Hug Modal */}
      {showRequestModal && (
        <div className="modal" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request a Hug</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowRequestModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateRequest}>
                <div className="form-group">
                  <div className="form-toggle">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={isCommunityRequest}
                        onChange={() => setIsCommunityRequest(!isCommunityRequest)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">
                      Community Request
                    </span>
                  </div>
                  <div className="form-hint">
                    Anyone in the community can respond to your request
                  </div>
                </div>
                
                {!isCommunityRequest && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="requestRecipient">Recipient</label>
                    <select
                      id="requestRecipient"
                      className="form-select"
                      value={selectedUserId}
                      onChange={e => setSelectedUserId(e.target.value)}
                      required={!isCommunityRequest}
                    >
                      <option value="">Select a recipient</option>
                      {otherUsers.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name || user.username}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="form-group">
                  <label className="form-label" htmlFor="requestMessage">
                    {isCommunityRequest ? 'Why do you need a hug?' : 'Message (Optional)'}
                  </label>
                  <textarea
                    id="requestMessage"
                    className="form-textarea"
                    value={requestMessage}
                    onChange={e => setRequestMessage(e.target.value)}
                    placeholder={isCommunityRequest ? "Share why you need a hug today..." : "Add a personal message..."}
                    maxLength={200}
                    required={isCommunityRequest}
                  ></textarea>
                  <div className="textarea-counter">
                    {requestMessage.length}/200 characters
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowRequestModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  );
}

export default HugCenterPage;