import React from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { RESPOND_TO_HUG_REQUEST } from '../../graphql/mutations';

const CardContainer = styled.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--primary-color);
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-3px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
  font-size: 1.2rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.25rem;
`;

const UserUsername = styled.span`
  font-size: 0.8rem;
  color: var(--gray-500);
`;

const RequestDate = styled.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`;

const RequestMessage = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: var(--gray-100);
  border-radius: var(--border-radius-md);
  color: var(--gray-700);
  line-height: 1.5;
  font-size: 0.95rem;
  position: relative;
  
  &::before {
    content: '"';
    font-size: 2rem;
    color: var(--primary-light);
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    opacity: 0.2;
  }
  
  &::after {
    content: '"';
    font-size: 2rem;
    color: var(--primary-light);
    position: absolute;
    bottom: -0.5rem;
    right: 0.5rem;
    opacity: 0.2;
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const HugButton = styled(ActionButton)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
  }
`;

const RequestTag = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: var(--primary-light);
  color: white;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const CommunityHugRequestCard = ({ request, onSuccess }) => {
  const [respondToRequest, { loading }] = useMutation(RESPOND_TO_HUG_REQUEST, {
    onCompleted: () => {
      if (onSuccess) onSuccess();
    }
  });
  
  const handleSendHug = async () => {
    await respondToRequest({
      variables: {
        respondToRequestInput: {
          requestId: request.id,
          accepted: true
        }
      }
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
  
  return (
    <CardContainer>
      <RequestTag>Community Request</RequestTag>
      
      <CardHeader>
        <UserInfo>
          <Avatar>
            {request.requester?.avatarUrl ? (
              <img 
                src={request.requester.avatarUrl} 
                alt={request.requester.name || request.requester.username} 
              />
            ) : (
              getInitials(request.requester?.name || request.requester?.username)
            )}
          </Avatar>
          
          <UserDetails>
            <UserName>{request.requester?.name || 'Anonymous User'}</UserName>
            <UserUsername>@{request.requester?.username || 'anonymous'}</UserUsername>
          </UserDetails>
        </UserInfo>
        
        <RequestDate>{formatDate(request.createdAt)}</RequestDate>
      </CardHeader>
      
      <RequestMessage>
        {request.message || 'I could use a virtual hug right now.'}
      </RequestMessage>
      
      <CardActions>
        <HugButton 
          onClick={handleSendHug}
          disabled={loading}
        >
          {loading ? 'Sending...' : '🤗 Send a Hug'}
        </HugButton>
      </CardActions>
    </CardContainer>
  );
};

export default CommunityHugRequestCard;