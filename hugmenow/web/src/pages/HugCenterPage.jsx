import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_RECEIVED_HUGS, 
  GET_SENT_HUGS, 
  GET_MY_HUG_REQUESTS,
  GET_PENDING_HUG_REQUESTS,
  GET_COMMUNITY_HUG_REQUESTS 
} from '../graphql/queries';
import { 
  SEND_HUG, 
  CREATE_HUG_REQUEST, 
  RESPOND_TO_HUG_REQUEST,
  CANCEL_HUG_REQUEST,
  MARK_HUG_AS_READ
} from '../graphql/mutations';

const HugCenterPage = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [showSendHugForm, setShowSendHugForm] = useState(false);
  const [showRequestHugForm, setShowRequestHugForm] = useState(false);
  const [sendHugData, setSendHugData] = useState({
    recipientId: '',
    type: 'WARM',
    message: ''
  });
  const [requestHugData, setRequestHugData] = useState({
    recipientId: '',
    message: '',
    isCommunityRequest: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Queries
  const { 
    data: receivedHugsData, 
    loading: receivedHugsLoading, 
    refetch: refetchReceivedHugs 
  } = useQuery(GET_RECEIVED_HUGS);

  const { 
    data: sentHugsData, 
    loading: sentHugsLoading, 
    refetch: refetchSentHugs 
  } = useQuery(GET_SENT_HUGS);

  const {
    data: myRequestsData,
    loading: myRequestsLoading,
    refetch: refetchMyRequests
  } = useQuery(GET_MY_HUG_REQUESTS);

  const {
    data: pendingRequestsData,
    loading: pendingRequestsLoading,
    refetch: refetchPendingRequests
  } = useQuery(GET_PENDING_HUG_REQUESTS);

  const {
    data: communityRequestsData,
    loading: communityRequestsLoading,
    refetch: refetchCommunityRequests
  } = useQuery(GET_COMMUNITY_HUG_REQUESTS);

  // Mutations
  const [sendHug, { loading: sendingHug }] = useMutation(SEND_HUG, {
    onCompleted: () => {
      setSendHugData({ recipientId: '', type: 'WARM', message: '' });
      setShowSendHugForm(false);
      setSuccess('Hug sent successfully!');
      refetchSentHugs();
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error) => {
      console.error('Error sending hug:', error);
      setError('Failed to send hug. Please try again.');
    }
  });

  const [createHugRequest, { loading: creatingRequest }] = useMutation(CREATE_HUG_REQUEST, {
    onCompleted: () => {
      setRequestHugData({ recipientId: '', message: '', isCommunityRequest: false });
      setShowRequestHugForm(false);
      setSuccess('Hug request created successfully!');
      refetchMyRequests();
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error) => {
      console.error('Error creating hug request:', error);
      setError('Failed to create hug request. Please try again.');
    }
  });

  const [respondToHugRequest] = useMutation(RESPOND_TO_HUG_REQUEST, {
    onCompleted: () => {
      setSuccess('Response submitted successfully!');
      refetchPendingRequests();
      refetchCommunityRequests();
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error) => {
      console.error('Error responding to request:', error);
      setError('Failed to respond to request. Please try again.');
    }
  });

  const [cancelHugRequest] = useMutation(CANCEL_HUG_REQUEST, {
    onCompleted: () => {
      setSuccess('Request cancelled successfully!');
      refetchMyRequests();
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error) => {
      console.error('Error cancelling request:', error);
      setError('Failed to cancel request. Please try again.');
    }
  });

  const [markHugAsRead] = useMutation(MARK_HUG_AS_READ, {
    onCompleted: () => {
      refetchReceivedHugs();
    },
    onError: (error) => {
      console.error('Error marking hug as read:', error);
    }
  });

  // Handlers
  const handleSendHugChange = (e) => {
    setSendHugData({
      ...sendHugData,
      [e.target.name]: e.target.value
    });
  };

  const handleRequestHugChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setRequestHugData({
      ...requestHugData,
      [e.target.name]: value
    });
  };

  const handleSendHugSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!sendHugData.recipientId) {
      setError('Please enter a recipient ID');
      return;
    }

    try {
      await sendHug({
        variables: {
          sendHugInput: sendHugData
        }
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  const handleRequestHugSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!requestHugData.isCommunityRequest && !requestHugData.recipientId) {
      setError('Please enter a recipient ID or make this a community request');
      return;
    }

    try {
      await createHugRequest({
        variables: {
          createHugRequestInput: {
            ...requestHugData,
            recipientId: requestHugData.isCommunityRequest ? null : requestHugData.recipientId
          }
        }
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  const handleRespondToRequest = async (requestId, status) => {
    try {
      await respondToHugRequest({
        variables: {
          respondToRequestInput: {
            requestId,
            status
          }
        }
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await cancelHugRequest({
        variables: {
          id: requestId
        }
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  const handleMarkAsRead = async (hugId) => {
    try {
      await markHugAsRead({
        variables: {
          id: hugId
        }
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  // Render helpers
  const renderReceivedHugs = () => {
    if (receivedHugsLoading) return <div className="loading-spinner">Loading hugs...</div>;
    
    const hugs = receivedHugsData?.receivedHugs || [];
    
    if (hugs.length === 0) {
      return (
        <div className="empty-state">
          <p>You haven't received any hugs yet.</p>
        </div>
      );
    }
    
    return (
      <div className="hug-list">
        {hugs.map(hug => (
          <div 
            key={hug.id} 
            className={`hug-card ${!hug.isRead ? 'unread' : ''}`}
            onClick={() => !hug.isRead && handleMarkAsRead(hug.id)}
          >
            <div className="hug-sender">
              From: {hug.sender.name}
            </div>
            <div className="hug-type">
              {hug.type} Hug
            </div>
            {hug.message && (
              <div className="hug-message">
                "{hug.message}"
              </div>
            )}
            <div className="hug-time">
              {new Date(hug.createdAt).toLocaleString()}
            </div>
            {!hug.isRead && (
              <div className="unread-marker">New</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSentHugs = () => {
    if (sentHugsLoading) return <div className="loading-spinner">Loading hugs...</div>;
    
    const hugs = sentHugsData?.sentHugs || [];
    
    if (hugs.length === 0) {
      return (
        <div className="empty-state">
          <p>You haven't sent any hugs yet.</p>
        </div>
      );
    }
    
    return (
      <div className="hug-list">
        {hugs.map(hug => (
          <div key={hug.id} className="hug-card">
            <div className="hug-recipient">
              To: {hug.recipient.name}
            </div>
            <div className="hug-type">
              {hug.type} Hug
            </div>
            {hug.message && (
              <div className="hug-message">
                "{hug.message}"
              </div>
            )}
            <div className="hug-time">
              {new Date(hug.createdAt).toLocaleString()}
            </div>
            <div className="hug-status">
              {hug.isRead ? 'Read' : 'Unread'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMyRequests = () => {
    if (myRequestsLoading) return <div className="loading-spinner">Loading requests...</div>;
    
    const requests = myRequestsData?.myHugRequests || [];
    
    if (requests.length === 0) {
      return (
        <div className="empty-state">
          <p>You haven't made any hug requests yet.</p>
        </div>
      );
    }
    
    return (
      <div className="request-list">
        {requests.map(request => (
          <div key={request.id} className="request-card">
            <div className="request-type">
              {request.isCommunityRequest ? 'Community Request' : `To: ${request.recipient?.name || 'Unknown'}`}
            </div>
            {request.message && (
              <div className="request-message">
                "{request.message}"
              </div>
            )}
            <div className="request-status">
              Status: {request.status}
            </div>
            <div className="request-time">
              {new Date(request.createdAt).toLocaleString()}
            </div>
            {request.status === 'PENDING' && (
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => handleCancelRequest(request.id)}
              >
                Cancel Request
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPendingRequests = () => {
    if (pendingRequestsLoading) return <div className="loading-spinner">Loading requests...</div>;
    
    const requests = pendingRequestsData?.pendingHugRequests || [];
    
    if (requests.length === 0) {
      return (
        <div className="empty-state">
          <p>You don't have any pending hug requests.</p>
        </div>
      );
    }
    
    return (
      <div className="request-list">
        {requests.map(request => (
          <div key={request.id} className="request-card">
            <div className="request-sender">
              From: {request.requester.name}
            </div>
            {request.message && (
              <div className="request-message">
                "{request.message}"
              </div>
            )}
            <div className="request-time">
              {new Date(request.createdAt).toLocaleString()}
            </div>
            <div className="request-actions">
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => handleRespondToRequest(request.id, 'ACCEPTED')}
              >
                Accept
              </button>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => handleRespondToRequest(request.id, 'DECLINED')}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCommunityRequests = () => {
    if (communityRequestsLoading) return <div className="loading-spinner">Loading requests...</div>;
    
    const requests = communityRequestsData?.communityHugRequests || [];
    
    if (requests.length === 0) {
      return (
        <div className="empty-state">
          <p>There are no community hug requests at the moment.</p>
        </div>
      );
    }
    
    return (
      <div className="request-list">
        {requests.map(request => (
          <div key={request.id} className="request-card">
            <div className="request-sender">
              From: {request.requester.name}
            </div>
            {request.message && (
              <div className="request-message">
                "{request.message}"
              </div>
            )}
            <div className="request-time">
              {new Date(request.createdAt).toLocaleString()}
            </div>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => handleRespondToRequest(request.id, 'ACCEPTED')}
            >
              Send a Hug
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderSendHugForm = () => {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Send a Hug</h3>
            <button 
              className="modal-close"
              onClick={() => setShowSendHugForm(false)}
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleSendHugSubmit} className="send-hug-form">
            <div className="form-group">
              <label htmlFor="recipientId" className="form-label">Recipient ID</label>
              <input
                type="text"
                id="recipientId"
                name="recipientId"
                value={sendHugData.recipientId}
                onChange={handleSendHugChange}
                className="form-input"
                placeholder="Enter recipient's ID"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="type" className="form-label">Hug Type</label>
              <select
                id="type"
                name="type"
                value={sendHugData.type}
                onChange={handleSendHugChange}
                className="form-select"
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
              <label htmlFor="message" className="form-label">Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                value={sendHugData.message}
                onChange={handleSendHugChange}
                className="form-textarea"
                placeholder="Add a personal message..."
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={sendingHug}
              >
                {sendingHug ? 'Sending...' : 'Send Hug'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderRequestHugForm = () => {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Request a Hug</h3>
            <button 
              className="modal-close"
              onClick={() => setShowRequestHugForm(false)}
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleRequestHugSubmit} className="request-hug-form">
            <div className="form-group form-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="isCommunityRequest"
                  checked={requestHugData.isCommunityRequest}
                  onChange={handleRequestHugChange}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">Make this a community request</span>
              </label>
            </div>
            
            {!requestHugData.isCommunityRequest && (
              <div className="form-group">
                <label htmlFor="recipientId" className="form-label">Recipient ID</label>
                <input
                  type="text"
                  id="recipientId"
                  name="recipientId"
                  value={requestHugData.recipientId}
                  onChange={handleRequestHugChange}
                  className="form-input"
                  placeholder="Enter recipient's ID"
                  required={!requestHugData.isCommunityRequest}
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                value={requestHugData.message}
                onChange={handleRequestHugChange}
                className="form-textarea"
                placeholder="Why do you need a hug today?"
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={creatingRequest}
              >
                {creatingRequest ? 'Requesting...' : 'Request Hug'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="hug-center-page">
      <div className="page-header">
        <h1>Hug Center</h1>
        <div className="page-actions">
          <button 
            className="btn btn-primary mr-2"
            onClick={() => setShowSendHugForm(true)}
          >
            Send Hug
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => setShowRequestHugForm(true)}
          >
            Request Hug
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <div className="alert-content">
            <p>{error}</p>
            <button onClick={() => setError('')} className="alert-close">&times;</button>
          </div>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <div className="alert-content">
            <p>{success}</p>
            <button onClick={() => setSuccess('')} className="alert-close">&times;</button>
          </div>
        </div>
      )}

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Received Hugs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent Hugs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'myRequests' ? 'active' : ''}`}
          onClick={() => setActiveTab('myRequests')}
        >
          My Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'pendingRequests' ? 'active' : ''}`}
          onClick={() => setActiveTab('pendingRequests')}
        >
          Pending Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'communityRequests' ? 'active' : ''}`}
          onClick={() => setActiveTab('communityRequests')}
        >
          Community Requests
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'received' && renderReceivedHugs()}
        {activeTab === 'sent' && renderSentHugs()}
        {activeTab === 'myRequests' && renderMyRequests()}
        {activeTab === 'pendingRequests' && renderPendingRequests()}
        {activeTab === 'communityRequests' && renderCommunityRequests()}
      </div>

      {showSendHugForm && renderSendHugForm()}
      {showRequestHugForm && renderRequestHugForm()}
    </div>
  );
};

export default HugCenterPage;