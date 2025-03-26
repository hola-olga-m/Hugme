import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { 
  SEND_HUG, 
  MARK_HUG_AS_READ, 
  CREATE_HUG_REQUEST,
  RESPOND_TO_HUG_REQUEST
} from '../graphql/mutations';
import { 
  GET_USERS, 
  GET_SENT_HUGS, 
  GET_RECEIVED_HUGS,
  GET_MY_HUG_REQUESTS,
  GET_PENDING_HUG_REQUESTS
} from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import LoadingScreen from '../components/common/LoadingScreen';

const HugCenter = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('received');
  
  // Form state for sending a hug
  const [sendHugForm, setSendHugForm] = useState({
    recipientId: '',
    type: 'SUPPORTIVE',
    message: ''
  });
  
  // Request form state
  const [requestForm, setRequestForm] = useState({
    recipientId: '',
    message: '',
    isCommunityRequest: false
  });
  
  // UI states
  const [formVisibility, setFormVisibility] = useState({
    sendHug: false,
    createRequest: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // GraphQL queries
  const { loading: loadingUsers, data: usersData } = useQuery(GET_USERS, {
    fetchPolicy: 'cache-and-network'
  });
  
  const { loading: loadingSent, data: sentData, refetch: refetchSent } = useQuery(GET_SENT_HUGS, {
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });
  
  const { loading: loadingReceived, data: receivedData, refetch: refetchReceived } = useQuery(GET_RECEIVED_HUGS, {
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });
  
  const { loading: loadingMyRequests, data: myRequestsData, refetch: refetchMyRequests } = useQuery(GET_MY_HUG_REQUESTS, {
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });
  
  const { loading: loadingPendingRequests, data: pendingRequestsData, refetch: refetchPendingRequests } = useQuery(GET_PENDING_HUG_REQUESTS, {
    skip: !user?.id,
    fetchPolicy: 'cache-and-network'
  });
  
  // GraphQL mutations
  const [sendHug] = useMutation(SEND_HUG);
  const [markHugAsRead] = useMutation(MARK_HUG_AS_READ);
  const [createHugRequest] = useMutation(CREATE_HUG_REQUEST);
  const [respondToHugRequest] = useMutation(RESPOND_TO_HUG_REQUEST);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormVisibility({
      sendHug: false,
      createRequest: false
    });
    setError(null);
    setSuccess(null);
  };
  
  // Toggle form visibility
  const toggleForm = (formName) => {
    setFormVisibility(prev => ({
      ...prev,
      [formName]: !prev[formName]
    }));
    setError(null);
    setSuccess(null);
  };
  
  // Handle send hug form change
  const handleSendHugChange = (e) => {
    const { name, value } = e.target;
    setSendHugForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle request form change
  const handleRequestFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRequestForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle send hug submission
  const handleSendHug = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError(t('error.notAuthenticated'));
      return;
    }
    
    if (!sendHugForm.recipientId) {
      setError(t('hugCenter.selectRecipient'));
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      await sendHug({
        variables: {
          sendHugInput: {
            recipientId: sendHugForm.recipientId,
            type: sendHugForm.type,
            message: sendHugForm.message.trim() || null
          }
        }
      });
      
      // Show success message
      setSuccess(t('hugCenter.hugSent'));
      
      // Reset form
      setSendHugForm({
        recipientId: '',
        type: 'SUPPORTIVE',
        message: ''
      });
      
      // Hide form
      setFormVisibility(prev => ({
        ...prev,
        sendHug: false
      }));
      
      // Refetch data
      refetchSent();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.message || t('error.unknownError'));
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle mark hug as read
  const handleMarkAsRead = async (hugId) => {
    if (!user) {
      setError(t('error.notAuthenticated'));
      return;
    }
    
    try {
      await markHugAsRead({
        variables: {
          hugId
        }
      });
      
      // Refetch received hugs
      refetchReceived();
    } catch (err) {
      console.error('Error marking hug as read:', err);
    }
  };
  
  // Handle create hug request
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError(t('error.notAuthenticated'));
      return;
    }
    
    if (!requestForm.isCommunityRequest && !requestForm.recipientId) {
      setError(t('hugCenter.selectRecipient'));
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      await createHugRequest({
        variables: {
          createHugRequestInput: {
            recipientId: requestForm.isCommunityRequest ? null : requestForm.recipientId,
            message: requestForm.message.trim() || null,
            isCommunityRequest: requestForm.isCommunityRequest
          }
        }
      });
      
      // Show success message
      setSuccess(t('hugCenter.requestCreated'));
      
      // Reset form
      setRequestForm({
        recipientId: '',
        message: '',
        isCommunityRequest: false
      });
      
      // Hide form
      setFormVisibility(prev => ({
        ...prev,
        createRequest: false
      }));
      
      // Refetch data
      refetchMyRequests();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.message || t('error.unknownError'));
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle respond to hug request
  const handleRespondToRequest = async (requestId, status) => {
    if (!user) {
      setError(t('error.notAuthenticated'));
      return;
    }
    
    try {
      await respondToHugRequest({
        variables: {
          respondToRequestInput: {
            requestId,
            status
          }
        }
      });
      
      // Refetch pending requests
      refetchPendingRequests();
      
      // Show temporary success message
      const statusText = status === 'ACCEPTED' 
        ? t('hugCenter.requestAccepted') 
        : t('hugCenter.requestDeclined');
      
      setSuccess(statusText);
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err.message || t('error.unknownError'));
    }
  };
  
  // Format date to relative time (today, yesterday, or date)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return t('common.today') + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('common.yesterday') + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  // Display an appropriate avatar for a user
  const renderAvatar = (userObj) => {
    if (!userObj) return null;
    
    if (userObj.avatarUrl) {
      return <img src={userObj.avatarUrl} alt={userObj.name || userObj.username} />;
    } else {
      return (
        <div className="avatar-placeholder">
          {(userObj.name || userObj.username || '?').charAt(0).toUpperCase()}
        </div>
      );
    }
  };
  
  // Check if any data is loading
  const isLoading = loadingUsers || loadingSent || loadingReceived || 
                    loadingMyRequests || loadingPendingRequests;
  
  // If loading, show loading screen
  if (isLoading && !usersData && !sentData && !receivedData && !myRequestsData && !pendingRequestsData) {
    return (
      <AppLayout>
        <LoadingScreen message={t('hugCenter.loading')} />
      </AppLayout>
    );
  }
  
  // Extract data
  const users = usersData?.users || [];
  const sentHugs = sentData?.sentHugs || [];
  const receivedHugs = receivedData?.receivedHugs || [];
  const myRequests = myRequestsData?.myHugRequests || [];
  const pendingRequests = pendingRequestsData?.pendingHugRequests || [];
  
  // Filter out current user from users list
  const otherUsers = users.filter(u => u.id !== user?.id);
  
  return (
    <AppLayout>
      <div className="hug-center-container">
        <div className="hug-center-header">
          <h1>{t('hugCenter.title')}</h1>
          <p>{t('hugCenter.subtitle')}</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}
        
        <div className="hug-actions">
          <button 
            className="btn btn-primary"
            onClick={() => toggleForm('sendHug')}
          >
            {t('hugCenter.sendHug')}
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => toggleForm('createRequest')}
          >
            {t('hugCenter.requestHug')}
          </button>
        </div>
        
        {/* Send Hug Form */}
        {formVisibility.sendHug && (
          <div className="hug-form-container">
            <h2>{t('hugCenter.sendHug')}</h2>
            <form onSubmit={handleSendHug} className="hug-form">
              <div className="form-group">
                <label htmlFor="recipientId">{t('hugCenter.recipient')}</label>
                <select
                  id="recipientId"
                  name="recipientId"
                  value={sendHugForm.recipientId}
                  onChange={handleSendHugChange}
                  required
                >
                  <option value="">{t('hugCenter.selectRecipient')}</option>
                  {otherUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.username}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="type">{t('hugCenter.hugType')}</label>
                <select
                  id="type"
                  name="type"
                  value={sendHugForm.type}
                  onChange={handleSendHugChange}
                  required
                >
                  <option value="SUPPORTIVE">{t('hugCenter.supportive')}</option>
                  <option value="COMFORTING">{t('hugCenter.comforting')}</option>
                  <option value="ENCOURAGING">{t('hugCenter.encouraging')}</option>
                  <option value="CELEBRATORY">{t('hugCenter.celebratory')}</option>
                  <option value="QUICK">{t('hugCenter.quick')}</option>
                  <option value="WARM">{t('hugCenter.warm')}</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">{t('hugCenter.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={sendHugForm.message}
                  onChange={handleSendHugChange}
                  placeholder={t('hugCenter.messagePlaceholder')}
                  rows={3}
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={submitting}
                >
                  {submitting ? t('common.sending') : t('hugCenter.sendHug')}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => toggleForm('sendHug')}
                  disabled={submitting}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Create Hug Request Form */}
        {formVisibility.createRequest && (
          <div className="hug-form-container">
            <h2>{t('hugCenter.requestHug')}</h2>
            <form onSubmit={handleCreateRequest} className="hug-form">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isCommunityRequest"
                    checked={requestForm.isCommunityRequest}
                    onChange={handleRequestFormChange}
                  />
                  <span>{t('hugCenter.communityRequest')}</span>
                </label>
                <p className="form-help-text">{t('hugCenter.communityRequestHelp')}</p>
              </div>
              
              {!requestForm.isCommunityRequest && (
                <div className="form-group">
                  <label htmlFor="requestRecipientId">{t('hugCenter.recipient')}</label>
                  <select
                    id="requestRecipientId"
                    name="recipientId"
                    value={requestForm.recipientId}
                    onChange={handleRequestFormChange}
                    required={!requestForm.isCommunityRequest}
                  >
                    <option value="">{t('hugCenter.selectRecipient')}</option>
                    {otherUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="requestMessage">{t('hugCenter.message')}</label>
                <textarea
                  id="requestMessage"
                  name="message"
                  value={requestForm.message}
                  onChange={handleRequestFormChange}
                  placeholder={t('hugCenter.requestMessagePlaceholder')}
                  rows={3}
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={submitting}
                >
                  {submitting ? t('common.requesting') : t('hugCenter.requestHug')}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => toggleForm('createRequest')}
                  disabled={submitting}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Tabs */}
        <div className="hug-tabs">
          <button 
            className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => handleTabChange('received')}
          >
            {t('hugCenter.receivedHugs')}
            {receivedHugs.filter(h => !h.isRead).length > 0 && (
              <span className="notification-badge">
                {receivedHugs.filter(h => !h.isRead).length}
              </span>
            )}
          </button>
          <button 
            className={`tab-button ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => handleTabChange('sent')}
          >
            {t('hugCenter.sentHugs')}
          </button>
          <button 
            className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => handleTabChange('requests')}
          >
            {t('hugCenter.hugRequests')}
            {pendingRequests.length > 0 && (
              <span className="notification-badge">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="tab-content">
          {/* Received Hugs Tab */}
          {activeTab === 'received' && (
            <div className="hugs-list received-hugs">
              {receivedHugs.length === 0 ? (
                <div className="empty-state">
                  <p>{t('hugCenter.noReceivedHugs')}</p>
                </div>
              ) : (
                <>
                  {receivedHugs.map(hug => (
                    <div 
                      key={hug.id} 
                      className={`hug-card ${!hug.isRead ? 'unread' : ''}`}
                      onClick={() => !hug.isRead && handleMarkAsRead(hug.id)}
                    >
                      <div className="hug-avatar">
                        {renderAvatar(hug.sender)}
                      </div>
                      <div className="hug-content">
                        <div className="hug-sender">
                          {hug.sender.name || hug.sender.username}
                        </div>
                        <div className="hug-type">
                          {t(`hugCenter.${hug.type.toLowerCase()}`)}
                        </div>
                        {hug.message && (
                          <div className="hug-message">
                            <p>{hug.message}</p>
                          </div>
                        )}
                        <div className="hug-time">
                          {formatDate(hug.createdAt)}
                        </div>
                      </div>
                      {!hug.isRead && (
                        <div className="hug-unread-badge">
                          {t('hugCenter.new')}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
          
          {/* Sent Hugs Tab */}
          {activeTab === 'sent' && (
            <div className="hugs-list sent-hugs">
              {sentHugs.length === 0 ? (
                <div className="empty-state">
                  <p>{t('hugCenter.noSentHugs')}</p>
                </div>
              ) : (
                <>
                  {sentHugs.map(hug => (
                    <div key={hug.id} className="hug-card">
                      <div className="hug-avatar">
                        {renderAvatar(hug.recipient)}
                      </div>
                      <div className="hug-content">
                        <div className="hug-recipient">
                          {t('hugCenter.to')}: {hug.recipient.name || hug.recipient.username}
                        </div>
                        <div className="hug-type">
                          {t(`hugCenter.${hug.type.toLowerCase()}`)}
                        </div>
                        {hug.message && (
                          <div className="hug-message">
                            <p>{hug.message}</p>
                          </div>
                        )}
                        <div className="hug-time">
                          {formatDate(hug.createdAt)}
                        </div>
                      </div>
                      {hug.isRead ? (
                        <div className="hug-read-badge">
                          {t('hugCenter.read')}
                        </div>
                      ) : (
                        <div className="hug-unread-badge">
                          {t('hugCenter.unread')}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
          
          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="hug-requests">
              {/* Pending requests section */}
              <div className="hug-requests-section">
                <h3>{t('hugCenter.pendingRequests')}</h3>
                {pendingRequests.length === 0 ? (
                  <div className="empty-state">
                    <p>{t('hugCenter.noPendingRequests')}</p>
                  </div>
                ) : (
                  <div className="requests-list">
                    {pendingRequests.map(request => (
                      <div key={request.id} className="request-card">
                        <div className="request-avatar">
                          {renderAvatar(request.requester)}
                        </div>
                        <div className="request-content">
                          <div className="request-user">
                            {request.requester.name || request.requester.username}
                          </div>
                          {request.message && (
                            <div className="request-message">
                              <p>{request.message}</p>
                            </div>
                          )}
                          <div className="request-time">
                            {formatDate(request.createdAt)}
                          </div>
                        </div>
                        <div className="request-actions">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleRespondToRequest(request.id, 'ACCEPTED')}
                          >
                            {t('hugCenter.accept')}
                          </button>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => handleRespondToRequest(request.id, 'DECLINED')}
                          >
                            {t('hugCenter.decline')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* My requests section */}
              <div className="hug-requests-section">
                <h3>{t('hugCenter.myRequests')}</h3>
                {myRequests.length === 0 ? (
                  <div className="empty-state">
                    <p>{t('hugCenter.noMyRequests')}</p>
                  </div>
                ) : (
                  <div className="requests-list">
                    {myRequests.map(request => (
                      <div key={request.id} className="request-card">
                        <div className="request-content">
                          <div className="request-type">
                            {request.isCommunityRequest 
                              ? t('hugCenter.communityRequestLabel')
                              : t('hugCenter.personalRequestLabel', { 
                                  name: request.recipient?.name || request.recipient?.username 
                                })
                            }
                          </div>
                          {request.message && (
                            <div className="request-message">
                              <p>{request.message}</p>
                            </div>
                          )}
                          <div className="request-time">
                            {formatDate(request.createdAt)}
                          </div>
                          <div className="request-status">
                            {t(`hugCenter.status${request.status.charAt(0) + request.status.slice(1).toLowerCase()}`)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default HugCenter;