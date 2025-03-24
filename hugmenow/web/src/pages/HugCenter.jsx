import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

// GraphQL operations
const GET_HUG_DATA = gql`
  query GetHugData {
    me {
      id
      name
      username
      avatarUrl
    }
    sentHugs {
      id
      type
      message
      recipient {
        id
        name
        username
        avatarUrl
      }
      createdAt
    }
    receivedHugs {
      id
      type
      message
      isRead
      sender {
        id
        name
        username
        avatarUrl
      }
      createdAt
    }
    myHugRequests {
      id
      message
      status
      recipient {
        id
        name
        username
        avatarUrl
      }
      isCommunityRequest
      createdAt
      respondedAt
    }
    pendingHugRequests {
      id
      message
      requester {
        id
        name
        username
        avatarUrl
      }
      isCommunityRequest
      createdAt
    }
    communityHugRequests {
      id
      message
      requester {
        id
        name
        username
        avatarUrl
      }
      createdAt
      status
    }
  }
`;

const SEND_HUG = gql`
  mutation SendHug($sendHugInput: SendHugInput!) {
    sendHug(sendHugInput: $sendHugInput) {
      id
      type
      message
      recipient {
        id
        name
      }
      createdAt
    }
  }
`;

const MARK_HUG_AS_READ = gql`
  mutation MarkHugAsRead($hugId: ID!) {
    markHugAsRead(hugId: $hugId) {
      id
      isRead
    }
  }
`;

const CREATE_HUG_REQUEST = gql`
  mutation CreateHugRequest($createHugRequestInput: CreateHugRequestInput!) {
    createHugRequest(createHugRequestInput: $createHugRequestInput) {
      id
      message
      status
      isCommunityRequest
      createdAt
    }
  }
`;

const RESPOND_TO_HUG_REQUEST = gql`
  mutation RespondToHugRequest($respondToRequestInput: RespondToRequestInput!) {
    respondToHugRequest(respondToRequestInput: $respondToRequestInput) {
      id
      status
      respondedAt
    }
  }
`;

const CANCEL_HUG_REQUEST = gql`
  mutation CancelHugRequest($requestId: ID!) {
    cancelHugRequest(requestId: $requestId) {
      id
      status
    }
  }
`;

const HugCenter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'received');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form states
  const [sendHugForm, setSendHugForm] = useState({
    recipientId: '',
    type: 'WARM',
    message: '',
  });
  
  const [requestHugForm, setRequestHugForm] = useState({
    recipientId: '',
    message: '',
    isCommunityRequest: false,
  });
  
  const [responseForm, setResponseForm] = useState({
    requestId: '',
    status: 'ACCEPTED',
    message: '',
  });
  
  // GraphQL hooks
  const { loading, error, data, refetch } = useQuery(GET_HUG_DATA);
  const [sendHugMutation] = useMutation(SEND_HUG);
  const [markHugAsReadMutation] = useMutation(MARK_HUG_AS_READ);
  const [createHugRequestMutation] = useMutation(CREATE_HUG_REQUEST);
  const [respondToHugRequestMutation] = useMutation(RESPOND_TO_HUG_REQUEST);
  const [cancelHugRequestMutation] = useMutation(CANCEL_HUG_REQUEST);
  
  // Update active tab based on URL param
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  // Mark hugs as read when viewing received tab
  useEffect(() => {
    const markUnreadHugsAsRead = async () => {
      if (activeTab === 'received' && data?.receivedHugs) {
        const unreadHugs = data.receivedHugs.filter(hug => !hug.isRead);
        
        for (const hug of unreadHugs) {
          try {
            await markHugAsReadMutation({
              variables: { hugId: hug.id }
            });
          } catch (error) {
            console.error('Error marking hug as read:', error);
          }
        }
        
        // Refetch data after marking hugs as read
        if (unreadHugs.length > 0) {
          refetch();
        }
      }
    };
    
    markUnreadHugsAsRead();
  }, [activeTab, data, markHugAsReadMutation, refetch]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/hug-center?tab=${tab}`, { replace: true });
    clearMessages();
  };
  
  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };
  
  const handleSendHugChange = (e) => {
    const { name, value } = e.target;
    setSendHugForm({ ...sendHugForm, [name]: value });
    clearMessages();
  };
  
  const handleRequestHugChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setRequestHugForm({ ...requestHugForm, [name]: newValue });
    clearMessages();
  };
  
  const handleResponseChange = (e) => {
    const { name, value } = e.target;
    setResponseForm({ ...responseForm, [name]: value });
    clearMessages();
  };
  
  const handleSendHug = async (e) => {
    e.preventDefault();
    
    try {
      const { data } = await sendHugMutation({
        variables: {
          sendHugInput: {
            recipientId: sendHugForm.recipientId,
            type: sendHugForm.type,
            message: sendHugForm.message.trim() || null,
          },
        },
      });
      
      if (data.sendHug) {
        setSuccessMessage(`Hug sent successfully to ${data.sendHug.recipient.name}!`);
        setSendHugForm({
          recipientId: '',
          type: 'WARM',
          message: '',
        });
        refetch();
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to send hug. Please try again.');
    }
  };
  
  const handleCreateHugRequest = async (e) => {
    e.preventDefault();
    
    try {
      const { data } = await createHugRequestMutation({
        variables: {
          createHugRequestInput: {
            recipientId: requestHugForm.isCommunityRequest ? null : requestHugForm.recipientId,
            message: requestHugForm.message.trim() || null,
            isCommunityRequest: requestHugForm.isCommunityRequest,
          },
        },
      });
      
      if (data.createHugRequest) {
        setSuccessMessage(
          requestHugForm.isCommunityRequest
            ? 'Hug request posted to the community!'
            : 'Hug request sent successfully!'
        );
        setRequestHugForm({
          recipientId: '',
          message: '',
          isCommunityRequest: false,
        });
        refetch();
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create hug request. Please try again.');
    }
  };
  
  const handleRespondToRequest = async (requestId, status) => {
    try {
      const { data } = await respondToHugRequestMutation({
        variables: {
          respondToRequestInput: {
            requestId,
            status,
            message: responseForm.message || null,
          },
        },
      });
      
      if (data.respondToHugRequest) {
        setSuccessMessage(
          status === 'ACCEPTED'
            ? 'You accepted the hug request!'
            : 'You declined the hug request.'
        );
        setResponseForm({
          requestId: '',
          status: 'ACCEPTED',
          message: '',
        });
        refetch();
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to respond to hug request. Please try again.');
    }
  };
  
  const handleCancelRequest = async (requestId) => {
    try {
      const { data } = await cancelHugRequestMutation({
        variables: { requestId },
      });
      
      if (data.cancelHugRequest) {
        setSuccessMessage('Hug request cancelled successfully.');
        refetch();
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to cancel hug request. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getHugTypeLabel = (type) => {
    switch (type) {
      case 'QUICK': return 'Quick Hug';
      case 'WARM': return 'Warm Hug';
      case 'SUPPORTIVE': return 'Supportive Hug';
      case 'COMFORTING': return 'Comforting Hug';
      case 'ENCOURAGING': return 'Encouraging Hug';
      case 'CELEBRATORY': return 'Celebratory Hug';
      default: return 'Hug';
    }
  };
  
  const getRequestStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'ACCEPTED': return 'Accepted';
      case 'DECLINED': return 'Declined';
      case 'EXPIRED': return 'Expired';
      case 'CANCELLED': return 'Cancelled';
      default: return 'Unknown';
    }
  };
  
  if (loading) return <div className="loading">Loading hug center...</div>;
  
  if (error) return <div className="error">Error loading hug data: {error.message}</div>;
  
  return (
    <div className="hug-center-page">
      <div className="container">
        <h1 className="page-title">Hug Center</h1>
        
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        
        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}
        
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
              onClick={() => handleTabChange('received')}
            >
              Received Hugs
            </button>
            <button
              className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
              onClick={() => handleTabChange('sent')}
            >
              Sent Hugs
            </button>
            <button
              className={`tab-btn ${activeTab === 'send' ? 'active' : ''}`}
              onClick={() => handleTabChange('send')}
            >
              Send a Hug
            </button>
            <button
              className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => handleTabChange('requests')}
            >
              Hug Requests
            </button>
            <button
              className={`tab-btn ${activeTab === 'community' ? 'active' : ''}`}
              onClick={() => handleTabChange('community')}
            >
              Community
            </button>
          </div>
          
          <div className="tab-content">
            {/* Received Hugs Tab */}
            {activeTab === 'received' && (
              <div className="tab-pane">
                <h2>Hugs You've Received</h2>
                
                {data.receivedHugs.length > 0 ? (
                  <div className="hugs-list">
                    {data.receivedHugs.map(hug => (
                      <div key={hug.id} className={`hug-card ${!hug.isRead ? 'unread' : ''}`}>
                        <div className="hug-header">
                          <div className="hug-sender">
                            {hug.sender.avatarUrl ? (
                              <img
                                src={hug.sender.avatarUrl}
                                alt={hug.sender.name}
                                className="avatar avatar-small"
                              />
                            ) : (
                              <div className="avatar-placeholder avatar-small">
                                {hug.sender.name.charAt(0)}
                              </div>
                            )}
                            <span className="sender-name">From: {hug.sender.name}</span>
                          </div>
                          <div className="hug-type-badge">{getHugTypeLabel(hug.type)}</div>
                        </div>
                        
                        {hug.message && (
                          <div className="hug-message">"{hug.message}"</div>
                        )}
                        
                        <div className="hug-footer">
                          <div className="hug-timestamp">
                            Received: {formatDate(hug.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>You haven't received any hugs yet.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Sent Hugs Tab */}
            {activeTab === 'sent' && (
              <div className="tab-pane">
                <h2>Hugs You've Sent</h2>
                
                {data.sentHugs.length > 0 ? (
                  <div className="hugs-list">
                    {data.sentHugs.map(hug => (
                      <div key={hug.id} className="hug-card">
                        <div className="hug-header">
                          <div className="hug-recipient">
                            {hug.recipient.avatarUrl ? (
                              <img
                                src={hug.recipient.avatarUrl}
                                alt={hug.recipient.name}
                                className="avatar avatar-small"
                              />
                            ) : (
                              <div className="avatar-placeholder avatar-small">
                                {hug.recipient.name.charAt(0)}
                              </div>
                            )}
                            <span className="recipient-name">To: {hug.recipient.name}</span>
                          </div>
                          <div className="hug-type-badge">{getHugTypeLabel(hug.type)}</div>
                        </div>
                        
                        {hug.message && (
                          <div className="hug-message">"{hug.message}"</div>
                        )}
                        
                        <div className="hug-footer">
                          <div className="hug-timestamp">
                            Sent: {formatDate(hug.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>You haven't sent any hugs yet.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Send a Hug Tab */}
            {activeTab === 'send' && (
              <div className="tab-pane">
                <h2>Send a Virtual Hug</h2>
                
                <form onSubmit={handleSendHug} className="hug-form">
                  <div className="form-group">
                    <label htmlFor="recipientId">Recipient:</label>
                    <select
                      id="recipientId"
                      name="recipientId"
                      value={sendHugForm.recipientId}
                      onChange={handleSendHugChange}
                      required
                    >
                      <option value="">Select a recipient</option>
                      {/* This would be populated with contacts or suggestions */}
                      <option value="user-id-1">John Doe</option>
                      <option value="user-id-2">Jane Smith</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="type">Hug Type:</label>
                    <select
                      id="type"
                      name="type"
                      value={sendHugForm.type}
                      onChange={handleSendHugChange}
                      required
                    >
                      <option value="QUICK">Quick Hug</option>
                      <option value="WARM">Warm Hug</option>
                      <option value="SUPPORTIVE">Supportive Hug</option>
                      <option value="COMFORTING">Comforting Hug</option>
                      <option value="ENCOURAGING">Encouraging Hug</option>
                      <option value="CELEBRATORY">Celebratory Hug</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message (optional):</label>
                    <textarea
                      id="message"
                      name="message"
                      value={sendHugForm.message}
                      onChange={handleSendHugChange}
                      placeholder="Add a personal message with your hug..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Send Hug
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Hug Requests Tab */}
            {activeTab === 'requests' && (
              <div className="tab-pane">
                <div className="requests-section">
                  <h2>Request a Hug</h2>
                  
                  <form onSubmit={handleCreateHugRequest} className="hug-request-form">
                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isCommunityRequest"
                          checked={requestHugForm.isCommunityRequest}
                          onChange={handleRequestHugChange}
                        />
                        Post as community request (visible to all users)
                      </label>
                    </div>
                    
                    {!requestHugForm.isCommunityRequest && (
                      <div className="form-group">
                        <label htmlFor="request-recipientId">Send request to:</label>
                        <select
                          id="request-recipientId"
                          name="recipientId"
                          value={requestHugForm.recipientId}
                          onChange={handleRequestHugChange}
                          required={!requestHugForm.isCommunityRequest}
                        >
                          <option value="">Select a recipient</option>
                          {/* This would be populated with contacts or suggestions */}
                          <option value="user-id-1">John Doe</option>
                          <option value="user-id-2">Jane Smith</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="form-group">
                      <label htmlFor="request-message">Message (optional):</label>
                      <textarea
                        id="request-message"
                        name="message"
                        value={requestHugForm.message}
                        onChange={handleRequestHugChange}
                        placeholder={
                          requestHugForm.isCommunityRequest
                            ? "Share why you're looking for a hug..."
                            : "Add a message to your request..."
                        }
                        rows={4}
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        {requestHugForm.isCommunityRequest
                          ? 'Post Community Request'
                          : 'Send Request'}
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="requests-section">
                  <h2>Pending Requests for You</h2>
                  
                  {data.pendingHugRequests.length > 0 ? (
                    <div className="requests-list">
                      {data.pendingHugRequests.map(request => (
                        <div key={request.id} className="request-card">
                          <div className="request-header">
                            <div className="request-from">
                              {request.requester.avatarUrl ? (
                                <img
                                  src={request.requester.avatarUrl}
                                  alt={request.requester.name}
                                  className="avatar avatar-small"
                                />
                              ) : (
                                <div className="avatar-placeholder avatar-small">
                                  {request.requester.name.charAt(0)}
                                </div>
                              )}
                              <span className="requester-name">From: {request.requester.name}</span>
                            </div>
                            {request.isCommunityRequest && (
                              <span className="community-badge">Community</span>
                            )}
                          </div>
                          
                          {request.message && (
                            <div className="request-message">"{request.message}"</div>
                          )}
                          
                          <div className="request-timestamp">
                            Requested: {formatDate(request.createdAt)}
                          </div>
                          
                          <div className="request-actions">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleRespondToRequest(request.id, 'ACCEPTED')}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRespondToRequest(request.id, 'DECLINED')}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No pending hug requests.</p>
                    </div>
                  )}
                </div>
                
                <div className="requests-section">
                  <h2>Your Sent Requests</h2>
                  
                  {data.myHugRequests.length > 0 ? (
                    <div className="requests-list">
                      {data.myHugRequests.map(request => (
                        <div key={request.id} className="request-card">
                          <div className="request-header">
                            <div className="request-to">
                              {request.isCommunityRequest ? (
                                <span className="community-badge">Community Request</span>
                              ) : (
                                <>
                                  {request.recipient?.avatarUrl ? (
                                    <img
                                      src={request.recipient.avatarUrl}
                                      alt={request.recipient.name}
                                      className="avatar avatar-small"
                                    />
                                  ) : (
                                    <div className="avatar-placeholder avatar-small">
                                      {request.recipient?.name.charAt(0) || '?'}
                                    </div>
                                  )}
                                  <span className="recipient-name">
                                    To: {request.recipient?.name || 'Unknown'}
                                  </span>
                                </>
                              )}
                            </div>
                            <span className={`status-badge status-${request.status.toLowerCase()}`}>
                              {getRequestStatusLabel(request.status)}
                            </span>
                          </div>
                          
                          {request.message && (
                            <div className="request-message">"{request.message}"</div>
                          )}
                          
                          <div className="request-timestamps">
                            <div>Requested: {formatDate(request.createdAt)}</div>
                            {request.respondedAt && (
                              <div>Responded: {formatDate(request.respondedAt)}</div>
                            )}
                          </div>
                          
                          {request.status === 'PENDING' && (
                            <div className="request-actions">
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => handleCancelRequest(request.id)}
                              >
                                Cancel Request
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>You haven't sent any hug requests.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Community Tab */}
            {activeTab === 'community' && (
              <div className="tab-pane">
                <h2>Community Hug Requests</h2>
                
                {data.communityHugRequests.length > 0 ? (
                  <div className="community-requests-list">
                    {data.communityHugRequests
                      .filter(request => request.status === 'PENDING')
                      .map(request => (
                        <div key={request.id} className="request-card">
                          <div className="request-header">
                            <div className="request-from">
                              {request.requester.avatarUrl ? (
                                <img
                                  src={request.requester.avatarUrl}
                                  alt={request.requester.name}
                                  className="avatar avatar-small"
                                />
                              ) : (
                                <div className="avatar-placeholder avatar-small">
                                  {request.requester.name.charAt(0)}
                                </div>
                              )}
                              <span className="requester-name">From: {request.requester.name}</span>
                            </div>
                            <span className="community-badge">Community</span>
                          </div>
                          
                          {request.message && (
                            <div className="request-message">"{request.message}"</div>
                          )}
                          
                          <div className="request-timestamp">
                            Requested: {formatDate(request.createdAt)}
                          </div>
                          
                          <div className="request-actions">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleRespondToRequest(request.id, 'ACCEPTED')}
                            >
                              Send a Hug
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No community hug requests at the moment.</p>
                  </div>
                )}
                
                <div className="community-action">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setRequestHugForm({
                        ...requestHugForm,
                        isCommunityRequest: true,
                      });
                      handleTabChange('requests');
                    }}
                  >
                    Create Community Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HugCenter;