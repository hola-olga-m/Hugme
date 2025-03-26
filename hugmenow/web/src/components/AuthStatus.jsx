import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const StatusContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const StatusTitle = styled.h3`
  margin: 0;
  color: #555;
  font-size: 16px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${(props) => 
    props.$authenticated ? '#d4edda' : '#f8d7da'};
  color: ${(props) => 
    props.$authenticated ? '#155724' : '#721c24'};
`;

const UserInfo = styled.div`
  margin-top: 10px;
  font-size: 14px;
`;

const InfoItem = styled.div`
  margin-bottom: 5px;
  display: flex;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  width: 90px;
  color: #666;
`;

const InfoValue = styled.span`
  color: #333;
`;

/**
 * Component that displays the current authentication status
 * Useful for debugging and showing user information
 */
const AuthStatus = () => {
  const { currentUser, authToken, loading, error, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner size="small" message="Loading auth status..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <StatusContainer>
      <StatusHeader>
        <StatusTitle>Authentication Status</StatusTitle>
        <StatusBadge $authenticated={isAuthenticated}>
          {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </StatusBadge>
      </StatusHeader>

      {isAuthenticated && currentUser ? (
        <UserInfo>
          <InfoItem>
            <InfoLabel>User ID:</InfoLabel>
            <InfoValue>{currentUser.id}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Username:</InfoLabel>
            <InfoValue>{currentUser.username}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email:</InfoLabel>
            <InfoValue>{currentUser.email}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Name:</InfoLabel>
            <InfoValue>{currentUser.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Anonymous:</InfoLabel>
            <InfoValue>{currentUser.isAnonymous ? 'Yes' : 'No'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Token:</InfoLabel>
            <InfoValue>
              {authToken ? `${authToken.substring(0, 15)}...` : 'None'}
            </InfoValue>
          </InfoItem>
        </UserInfo>
      ) : (
        <InfoItem>Not logged in</InfoItem>
      )}
    </StatusContainer>
  );
};

export default AuthStatus;