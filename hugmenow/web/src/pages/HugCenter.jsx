import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GET_SENT_HUGS, 
  GET_RECEIVED_HUGS, 
  GET_MY_HUG_REQUESTS, 
  GET_PENDING_HUG_REQUESTS,
  GET_COMMUNITY_HUG_REQUESTS,
  GET_USERS
} from '../graphql/queries';
import { 
  SEND_HUG, 
  MARK_HUG_AS_READ, 
  CREATE_HUG_REQUEST, 
  RESPOND_TO_HUG_REQUEST,
  CANCEL_HUG_REQUEST
} from '../graphql/mutations';
import LoadingScreen from '../components/common/LoadingScreen';
import ErrorMessage from '../components/common/ErrorMessage';

// Styled components
const HugCenterContainer = styled.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`;

const HugCenterHeader = styled.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
`;

const HugCenterContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  margin-bottom: 1.5rem;
  color: var(--gray-800);
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--gray-300);
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--gray-600)'};
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    color: var(--primary-color);
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`;

const FormRow = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--gray-700);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const HugTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const HugTypeOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--gray-200)'};
  border-radius: var(--border-radius);
  background-color: ${props => props.selected ? 'var(--primary-light)' : 'white'};
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    border-color: var(--primary-color);
  }
  
  .emoji {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .label {
    font-weight: ${props => props.selected ? '500' : 'normal'};
    color: ${props => props.selected ? 'var(--primary-color)' : 'var(--gray-700)'};
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
`;

const HugsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const HugCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${props => props.unread ? 'var(--primary-color)' : 'transparent'};
`;

const HugCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--primary-light);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 0.75rem;
  }
  
  .name {
    font-weight: 500;
    color: var(--gray-800);
  }
  
  .username {
    font-size: 0.8rem;
    color: var(--gray-500);
  }
`;

const HugDate = styled.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`;

const HugContent = styled.div`
  margin-bottom: 1rem;
  
  .hug-type {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    
    .emoji {
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }
    
    .type {
      font-weight: 500;
      color: var(--primary-color);
    }
  }
  
  .message {
    color: var(--gray-700);
    line-height: 1.5;
  }
`;

const HugActions = styled.div`
  display: flex;
  justify-content: flex-end;
  
  button {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 0.9rem;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RequestsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const RequestCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${props => {
    if (props.status === 'PENDING') return 'var(--warning-color)';
    if (props.status === 'ACCEPTED') return 'var(--success-color)';
    if (props.status === 'REJECTED') return 'var(--danger-color)';
    if (props.status === 'CANCELLED') return 'var(--gray-500)';
    return 'transparent';
  }};
`;

const RequestCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const RequestCardStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  
  background-color: ${props => {
    if (props.status === 'PENDING') return 'var(--warning-light)';
    if (props.status === 'ACCEPTED') return 'var(--success-light)';
    if (props.status === 'REJECTED') return 'var(--danger-light)';
    if (props.status === 'CANCELLED') return 'var(--gray-200)';
    return 'transparent';
  }};
  
  color: ${props => {
    if (props.status === 'PENDING') return 'var(--warning-color)';
    if (props.status === 'ACCEPTED') return 'var(--success-color)';
    if (props.status === 'REJECTED') return 'var(--danger-color)';
    if (props.status === 'CANCELLED') return 'var(--gray-700)';
    return 'var(--gray-700)';
  }};
`;

const RequestContent = styled.div`
  margin-bottom: 1rem;
  
  .message {
    color: var(--gray-700);
    line-height: 1.5;
  }
  
  .community-tag {
    display: inline-block;
    background-color: var(--primary-light);
    color: var(--primary-color);
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    margin-top: 0.5rem;
  }
`;

const RequestActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  
  button {
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    cursor: pointer;
    transition: var(--transition-base);
  }
  
  .accept-btn {
    background-color: var(--success-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: var(--success-dark);
    }
  }
  
  .reject-btn {
    background-color: var(--danger-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: var(--danger-dark);
    }
  }
  
  .cancel-btn {
    background: none;
    border: 1px solid var(--gray-400);
    color: var(--gray-700);
    
    &:hover {
      background-color: var(--gray-100);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`;

// Helper functions
const getHugTypeEmoji = (type) => {
  const emojiMap = {
    STANDARD: '🤗',
    VIRTUAL: '💻',
    SPECIAL: '✨',
    ANIMATED: '🎭',
    CUSTOM: '🎨'
  };
  return emojiMap[type] || '🤗';
};

const getHugTypeLabel = (type) => {
  const labelMap = {
    STANDARD: 'Standard',
    VIRTUAL: 'Virtual',
    SPECIAL: 'Special',
    ANIMATED: 'Animated',
    CUSTOM: 'Custom'
  };
  return labelMap[type] || 'Standard';
};

const getRequestStatusLabel = (status) => {
  const statusMap = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled'
  };
  return statusMap[status] || 'Unknown';
};

const getFormattedDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const HugCenter = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('send');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [hugType, setHugType] = useState('STANDARD');
  const [hugMessage, setHugMessage] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [isCommunityRequest, setIsCommunityRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // GraphQL queries
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_USERS);
  const { data: sentHugsData, loading: sentHugsLoading, error: sentHugsError, refetch: refetchSentHugs } = useQuery(GET_SENT_HUGS);
  const { data: receivedHugsData, loading: receivedHugsLoading, error: receivedHugsError, refetch: refetchReceivedHugs } = useQuery(GET_RECEIVED_HUGS);
  const { data: myRequestsData, loading: myRequestsLoading, error: myRequestsError, refetch: refetchMyRequests } = useQuery(GET_MY_HUG_REQUESTS);
  const { data: pendingRequestsData, loading: pendingRequestsLoading, error: pendingRequestsError, refetch: refetchPendingRequests } = useQuery(GET_PENDING_HUG_REQUESTS);
  const { data: communityRequestsData, loading: communityRequestsLoading, error: communityRequestsError, refetch: refetchCommunityRequests } = useQuery(GET_COMMUNITY_HUG_REQUESTS);
  
  // GraphQL mutations
  const [sendHug, { loading: sendHugLoading }] = useMutation(SEND_HUG, {
    onCompleted: () => {
      refetchSentHugs();
      resetSendForm();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  const [markHugAsRead] = useMutation(MARK_HUG_AS_READ, {
    onCompleted: () => {
      refetchReceivedHugs();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  const [createHugRequest, { loading: createRequestLoading }] = useMutation(CREATE_HUG_REQUEST, {
    onCompleted: () => {
      refetchMyRequests();
      refetchCommunityRequests();
      resetRequestForm();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  const [respondToHugRequest] = useMutation(RESPOND_TO_HUG_REQUEST, {
    onCompleted: () => {
      refetchPendingRequests();
      refetchCommunityRequests();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  const [cancelHugRequest] = useMutation(CANCEL_HUG_REQUEST, {
    onCompleted: () => {
      refetchMyRequests();
      refetchCommunityRequests();
    },
    onError: (error) => {
      setError(error.message);
    }
  });
  
  useEffect(() => {
    // Set loading state based on all query statuses
    setLoading(
      usersLoading || 
      sentHugsLoading || 
      receivedHugsLoading || 
      myRequestsLoading || 
      pendingRequestsLoading || 
      communityRequestsLoading
    );
    
    // Set error if any query has an error
    if (usersError) setError(usersError.message);
    if (sentHugsError) setError(sentHugsError.message);
    if (receivedHugsError) setError(receivedHugsError.message);
    if (myRequestsError) setError(myRequestsError.message);
    if (pendingRequestsError) setError(pendingRequestsError.message);
    if (communityRequestsError) setError(communityRequestsError.message);
  }, [
    usersLoading, sentHugsLoading, receivedHugsLoading, myRequestsLoading, pendingRequestsLoading, communityRequestsLoading,
    usersError, sentHugsError, receivedHugsError, myRequestsError, pendingRequestsError, communityRequestsError
  ]);
  
  const resetSendForm = () => {
    setSelectedRecipient('');
    setHugType('STANDARD');
    setHugMessage('');
  };
  
  const resetRequestForm = () => {
    setSelectedRecipient('');
    setRequestMessage('');
    setIsCommunityRequest(false);
  };
  
  const handleSendHug = async (e) => {
    e.preventDefault();
    
    await sendHug({
      variables: {
        sendHugInput: {
          recipientId: selectedRecipient,
          type: hugType,
          message: hugMessage
        }
      }
    });
  };
  
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    
    await createHugRequest({
      variables: {
        createHugRequestInput: {
          recipientId: isCommunityRequest ? null : selectedRecipient,
          message: requestMessage,
          isCommunityRequest
        }
      }
    });
  };
  
  const handleMarkAsRead = async (hugId) => {
    await markHugAsRead({
      variables: { id: hugId }
    });
  };
  
  const handleRespondToRequest = async (requestId, accepted) => {
    await respondToHugRequest({
      variables: {
        respondToRequestInput: {
          requestId,
          accepted
        }
      }
    });
  };
  
  const handleCancelRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      await cancelHugRequest({
        variables: { id: requestId }
      });
    }
  };
  
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  if (loading) {
    return <LoadingScreen text="Loading hug center..." />;
  }
  
  const users = usersData?.users || [];
  const filteredUsers = users.filter(user => user.id !== currentUser?.id);
  const sentHugs = sentHugsData?.sentHugs || [];
  const receivedHugs = receivedHugsData?.receivedHugs || [];
  const myRequests = myRequestsData?.myHugRequests || [];
  const pendingRequests = pendingRequestsData?.pendingHugRequests || [];
  const communityRequests = communityRequestsData?.communityHugRequests || [];
  
  return (
    <HugCenterContainer>
      <HugCenterHeader>
        <Logo onClick={navigateToDashboard}>HugMeNow</Logo>
      </HugCenterHeader>
      
      <HugCenterContent>
        <PageTitle>Hug Center</PageTitle>
        
        {error && <ErrorMessage error={error} />}
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'send'} 
            onClick={() => setActiveTab('send')}
          >
            Send a Hug
          </Tab>
          <Tab 
            active={activeTab === 'received'} 
            onClick={() => setActiveTab('received')}
          >
            Received Hugs
          </Tab>
          <Tab 
            active={activeTab === 'sent'} 
            onClick={() => setActiveTab('sent')}
          >
            Sent Hugs
          </Tab>
          <Tab 
            active={activeTab === 'request'} 
            onClick={() => setActiveTab('request')}
          >
            Request a Hug
          </Tab>
          <Tab 
            active={activeTab === 'myRequests'} 
            onClick={() => setActiveTab('myRequests')}
          >
            My Requests
          </Tab>
          <Tab 
            active={activeTab === 'pendingRequests'} 
            onClick={() => setActiveTab('pendingRequests')}
          >
            Pending Requests
          </Tab>
          <Tab 
            active={activeTab === 'communityRequests'} 
            onClick={() => setActiveTab('communityRequests')}
          >
            Community
          </Tab>
        </TabsContainer>
        
        {activeTab === 'send' && (
          <Card>
            <h2>Send a Virtual Hug</h2>
            <p>Brighten someone's day with a virtual hug!</p>
            
            <form onSubmit={handleSendHug}>
              <FormRow>
                <label htmlFor="recipient">Select Recipient</label>
                <Select 
                  id="recipient" 
                  value={selectedRecipient} 
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  required
                >
                  <option value="">Select a user...</option>
                  {filteredUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.username})
                    </option>
                  ))}
                </Select>
              </FormRow>
              
              <FormRow>
                <label>Hug Type</label>
                <HugTypeSelector>
                  {['STANDARD', 'VIRTUAL', 'SPECIAL', 'ANIMATED', 'CUSTOM'].map(type => (
                    <HugTypeOption 
                      key={type}
                      type="button"
                      selected={hugType === type}
                      onClick={() => setHugType(type)}
                    >
                      <span className="emoji">{getHugTypeEmoji(type)}</span>
                      <span className="label">{getHugTypeLabel(type)}</span>
                    </HugTypeOption>
                  ))}
                </HugTypeSelector>
              </FormRow>
              
              <FormRow>
                <label htmlFor="message">Message (Optional)</label>
                <TextArea 
                  id="message" 
                  value={hugMessage} 
                  onChange={(e) => setHugMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  maxLength={500}
                />
              </FormRow>
              
              <SubmitButton 
                type="submit" 
                disabled={!selectedRecipient || sendHugLoading}
              >
                Send Hug
              </SubmitButton>
            </form>
          </Card>
        )}
        
        {activeTab === 'received' && (
          <div>
            <h2>Received Hugs</h2>
            
            {receivedHugs.length === 0 ? (
              <EmptyState>
                <p>You haven't received any hugs yet.</p>
                <p>Hugs you receive will appear here.</p>
              </EmptyState>
            ) : (
              <HugsList>
                {receivedHugs.map(hug => (
                  <HugCard key={hug.id} unread={!hug.isRead}>
                    <HugCardHeader>
                      <UserInfo>
                        <div className="avatar">{getInitials(hug.sender.name)}</div>
                        <div>
                          <div className="name">{hug.sender.name}</div>
                          <div className="username">@{hug.sender.username}</div>
                        </div>
                      </UserInfo>
                      <HugDate>{getFormattedDate(hug.createdAt)}</HugDate>
                    </HugCardHeader>
                    
                    <HugContent>
                      <div className="hug-type">
                        <span className="emoji">{getHugTypeEmoji(hug.type)}</span>
                        <span className="type">{getHugTypeLabel(hug.type)} Hug</span>
                      </div>
                      
                      {hug.message && <div className="message">{hug.message}</div>}
                    </HugContent>
                    
                    {!hug.isRead && (
                      <HugActions>
                        <button onClick={() => handleMarkAsRead(hug.id)}>
                          Mark as Read
                        </button>
                      </HugActions>
                    )}
                  </HugCard>
                ))}
              </HugsList>
            )}
          </div>
        )}
        
        {activeTab === 'sent' && (
          <div>
            <h2>Sent Hugs</h2>
            
            {sentHugs.length === 0 ? (
              <EmptyState>
                <p>You haven't sent any hugs yet.</p>
                <p>Use the "Send a Hug" tab to send your first hug!</p>
              </EmptyState>
            ) : (
              <HugsList>
                {sentHugs.map(hug => (
                  <HugCard key={hug.id}>
                    <HugCardHeader>
                      <UserInfo>
                        <div className="avatar">{getInitials(hug.recipient.name)}</div>
                        <div>
                          <div className="name">{hug.recipient.name}</div>
                          <div className="username">@{hug.recipient.username}</div>
                        </div>
                      </UserInfo>
                      <HugDate>{getFormattedDate(hug.createdAt)}</HugDate>
                    </HugCardHeader>
                    
                    <HugContent>
                      <div className="hug-type">
                        <span className="emoji">{getHugTypeEmoji(hug.type)}</span>
                        <span className="type">{getHugTypeLabel(hug.type)} Hug</span>
                      </div>
                      
                      {hug.message && <div className="message">{hug.message}</div>}
                    </HugContent>
                    
                    <HugActions>
                      <span>{hug.isRead ? 'Read' : 'Unread'}</span>
                    </HugActions>
                  </HugCard>
                ))}
              </HugsList>
            )}
          </div>
        )}
        
        {activeTab === 'request' && (
          <Card>
            <h2>Request a Hug</h2>
            <p>Need a virtual hug? Request one here!</p>
            
            <form onSubmit={handleCreateRequest}>
              <FormRow>
                <label>Request Type</label>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isCommunityRequest}
                      onChange={() => setIsCommunityRequest(!isCommunityRequest)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Request from the community
                  </label>
                </div>
                
                {!isCommunityRequest && (
                  <Select 
                    value={selectedRecipient} 
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    required={!isCommunityRequest}
                  >
                    <option value="">Select a specific user...</option>
                    {filteredUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.username})
                      </option>
                    ))}
                  </Select>
                )}
              </FormRow>
              
              <FormRow>
                <label htmlFor="requestMessage">Your Message</label>
                <TextArea 
                  id="requestMessage" 
                  value={requestMessage} 
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Why do you need a hug today?"
                  maxLength={500}
                  required
                />
              </FormRow>
              
              <SubmitButton 
                type="submit" 
                disabled={(
                  (!isCommunityRequest && !selectedRecipient) || 
                  !requestMessage || 
                  createRequestLoading
                )}
              >
                Request Hug
              </SubmitButton>
            </form>
          </Card>
        )}
        
        {activeTab === 'myRequests' && (
          <div>
            <h2>My Hug Requests</h2>
            
            {myRequests.length === 0 ? (
              <EmptyState>
                <p>You haven't created any hug requests yet.</p>
                <p>Use the "Request a Hug" tab to create your first request!</p>
              </EmptyState>
            ) : (
              <RequestsList>
                {myRequests.map(request => (
                  <RequestCard key={request.id} status={request.status}>
                    <RequestCardHeader>
                      <div>
                        {request.recipient ? (
                          <UserInfo>
                            <div className="avatar">{getInitials(request.recipient.name)}</div>
                            <div>
                              <div className="name">{request.recipient.name}</div>
                              <div className="username">@{request.recipient.username}</div>
                            </div>
                          </UserInfo>
                        ) : (
                          <div>Community Request</div>
                        )}
                      </div>
                      <RequestCardStatus status={request.status}>
                        {getRequestStatusLabel(request.status)}
                      </RequestCardStatus>
                    </RequestCardHeader>
                    
                    <RequestContent>
                      <div className="message">{request.message}</div>
                      
                      {request.isCommunityRequest && (
                        <div className="community-tag">Community Request</div>
                      )}
                    </RequestContent>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <HugDate>{getFormattedDate(request.createdAt)}</HugDate>
                      
                      {request.status === 'PENDING' && (
                        <RequestActions>
                          <button 
                            className="cancel-btn"
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            Cancel Request
                          </button>
                        </RequestActions>
                      )}
                    </div>
                  </RequestCard>
                ))}
              </RequestsList>
            )}
          </div>
        )}
        
        {activeTab === 'pendingRequests' && (
          <div>
            <h2>Pending Requests For You</h2>
            
            {pendingRequests.length === 0 ? (
              <EmptyState>
                <p>You don't have any pending hug requests.</p>
                <p>When someone requests a hug from you, it will appear here.</p>
              </EmptyState>
            ) : (
              <RequestsList>
                {pendingRequests.map(request => (
                  <RequestCard key={request.id} status={request.status}>
                    <RequestCardHeader>
                      <UserInfo>
                        <div className="avatar">{getInitials(request.requester.name)}</div>
                        <div>
                          <div className="name">{request.requester.name}</div>
                          <div className="username">@{request.requester.username}</div>
                        </div>
                      </UserInfo>
                      <RequestCardStatus status={request.status}>
                        {getRequestStatusLabel(request.status)}
                      </RequestCardStatus>
                    </RequestCardHeader>
                    
                    <RequestContent>
                      <div className="message">{request.message}</div>
                    </RequestContent>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <HugDate>{getFormattedDate(request.createdAt)}</HugDate>
                      
                      <RequestActions>
                        <button 
                          className="accept-btn"
                          onClick={() => handleRespondToRequest(request.id, true)}
                        >
                          Accept
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleRespondToRequest(request.id, false)}
                        >
                          Decline
                        </button>
                      </RequestActions>
                    </div>
                  </RequestCard>
                ))}
              </RequestsList>
            )}
          </div>
        )}
        
        {activeTab === 'communityRequests' && (
          <div>
            <h2>Community Hug Requests</h2>
            
            {communityRequests.length === 0 ? (
              <EmptyState>
                <p>There are no active community hug requests.</p>
                <p>When someone requests a hug from the community, it will appear here.</p>
              </EmptyState>
            ) : (
              <RequestsList>
                {communityRequests.map(request => (
                  <RequestCard key={request.id} status={request.status}>
                    <RequestCardHeader>
                      <UserInfo>
                        <div className="avatar">{getInitials(request.requester.name)}</div>
                        <div>
                          <div className="name">{request.requester.name}</div>
                          <div className="username">@{request.requester.username}</div>
                        </div>
                      </UserInfo>
                      <RequestCardStatus status={request.status}>
                        {getRequestStatusLabel(request.status)}
                      </RequestCardStatus>
                    </RequestCardHeader>
                    
                    <RequestContent>
                      <div className="message">{request.message}</div>
                      <div className="community-tag">Community Request</div>
                    </RequestContent>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <HugDate>{getFormattedDate(request.createdAt)}</HugDate>
                      
                      {request.status === 'PENDING' && request.requester.id !== currentUser?.id && (
                        <RequestActions>
                          <button 
                            className="accept-btn"
                            onClick={() => handleRespondToRequest(request.id, true)}
                          >
                            Send a Hug
                          </button>
                        </RequestActions>
                      )}
                      
                      {request.status === 'PENDING' && request.requester.id === currentUser?.id && (
                        <RequestActions>
                          <button 
                            className="cancel-btn"
                            onClick={() => handleCancelRequest(request.id)}
                          >
                            Cancel Request
                          </button>
                        </RequestActions>
                      )}
                    </div>
                  </RequestCard>
                ))}
              </RequestsList>
            )}
          </div>
        )}
      </HugCenterContent>
    </HugCenterContainer>
  );
};

export default HugCenter;