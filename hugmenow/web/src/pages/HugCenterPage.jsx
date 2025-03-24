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
import { useAuth } from '../context/AuthContext';

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
      <div className="hug-center-page">
        <div className="hug-center-header">
          <h1>Hug Center</h1>
          <p>Send and receive virtual hugs with friends and the community.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <div className="alert-content">
              <span>{error}</span>
              <button 
                className="alert-close" 
                onClick={() => setError(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <div className="alert-content">
              <span>{success}</span>
              <button 
                className="alert-close" 
                onClick={() => setSuccess(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        <div className="hug-center-actions">
          <button 
            className="btn btn-primary"
            onClick={() => openSendHugModal()}
          >
            Send a Hug
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => openRequestModal()}
          >
            Request a Hug
          </button>
        </div>

        <div className="hug-center-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
              onClick={() => setActiveTab('received')}
            >
              Received Hugs
            </button>
            <button 
              className={`tab-button ${activeTab === 'sent' ? 'active' : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              Sent Hugs
            </button>
            <button 
              className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Requests
            </button>
            <button 
              className={`tab-button ${activeTab === 'my-requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-requests')}
            >
              My Requests
            </button>
            <button 
              className={`tab-button ${activeTab === 'community' ? 'active' : ''}`}
              onClick={() => setActiveTab('community')}
            >
              Community
            </button>
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
                      <div 
                        key={hug.id} 
                        className={`hug-item ${!hug.isRead ? 'unread' : ''}`}
                        onClick={() => !hug.isRead && handleMarkAsRead(hug.id)}
                      >
                        <div className="hug-icon">{hug.type === 'CELEBRATORY' ? '🎉' : '🤗'}</div>
                        <div className="hug-content">
                          <div className="hug-header">
                            <span className="hug-sender">{hug.sender.name || hug.sender.username}</span>
                            <span className="hug-type">{getHugTypeDisplay(hug.type)}</span>
                          </div>
                          {hug.message && (
                            <div className="hug-message">"{hug.message}"</div>
                          )}
                          <div className="hug-footer">
                            <span className="hug-date">{formatDate(hug.createdAt)}</span>
                            {!hug.isRead && <span className="hug-status">New</span>}
                          </div>
                        </div>
                        <div className="hug-actions">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSendHugModal(hug.sender.id);
                            }}
                          >
                            Send Back
                          </button>
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
                <h3>Sent Hugs</h3>
                {sentHugsLoading ? (
                  <div className="loading-spinner centered" />
                ) : sentHugsData?.sentHugs?.length > 0 ? (
                  <div className="hugs-list">
                    {sentHugsData.sentHugs.map(hug => (
                      <div key={hug.id} className="hug-item">
                        <div className="hug-icon">{hug.type === 'CELEBRATORY' ? '🎉' : '🤗'}</div>
                        <div className="hug-content">
                          <div className="hug-header">
                            <span className="hug-sender">To: {hug.recipient.name || hug.recipient.username}</span>
                            <span className="hug-type">{getHugTypeDisplay(hug.type)}</span>
                          </div>
                          {hug.message && (
                            <div className="hug-message">"{hug.message}"</div>
                          )}
                          <div className="hug-footer">
                            <span className="hug-date">{formatDate(hug.createdAt)}</span>
                            <span className="hug-status">{hug.isRead ? 'Read' : 'Unread'}</span>
                          </div>
                        </div>
                        <div className="hug-actions">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => openSendHugModal(hug.recipient.id)}
                          >
                            Send Again
                          </button>
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
                  <div className="empty-state">
                    <p>You don't have any pending hug requests.</p>
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
        <div className="modal" onClick={() => setShowSendHugModal(false)}>
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
                  <label className="form-label">Hug Type</label>
                  <div className="hug-type-options">
                    <div className="hug-type-option">
                      <input
                        type="radio"
                        id="quick"
                        name="hugType"
                        value="QUICK"
                        checked={hugType === 'QUICK'}
                        onChange={() => setHugType('QUICK')}
                      />
                      <label htmlFor="quick">Quick Hug</label>
                    </div>
                    <div className="hug-type-option">
                      <input
                        type="radio"
                        id="warm"
                        name="hugType"
                        value="WARM"
                        checked={hugType === 'WARM'}
                        onChange={() => setHugType('WARM')}
                      />
                      <label htmlFor="warm">Warm Hug</label>
                    </div>
                    <div className="hug-type-option">
                      <input
                        type="radio"
                        id="supportive"
                        name="hugType"
                        value="SUPPORTIVE"
                        checked={hugType === 'SUPPORTIVE'}
                        onChange={() => setHugType('SUPPORTIVE')}
                      />
                      <label htmlFor="supportive">Supportive Hug</label>
                    </div>
                    <div className="hug-type-option">
                      <input
                        type="radio"
                        id="comforting"
                        name="hugType"
                        value="COMFORTING"
                        checked={hugType === 'COMFORTING'}
                        onChange={() => setHugType('COMFORTING')}
                      />
                      <label htmlFor="comforting">Comforting Hug</label>
                    </div>
                    <div className="hug-type-option">
                      <input
                        type="radio"
                        id="encouraging"
                        name="hugType"
                        value="ENCOURAGING"
                        checked={hugType === 'ENCOURAGING'}
                        onChange={() => setHugType('ENCOURAGING')}
                      />
                      <label htmlFor="encouraging">Encouraging Hug</label>
                    </div>
                    <div className="hug-type-option">
                      <input
                        type="radio"
                        id="celebratory"
                        name="hugType"
                        value="CELEBRATORY"
                        checked={hugType === 'CELEBRATORY'}
                        onChange={() => setHugType('CELEBRATORY')}
                      />
                      <label htmlFor="celebratory">Celebratory Hug</label>
                    </div>
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
    </MainLayout>
  );
}

export default HugCenterPage;