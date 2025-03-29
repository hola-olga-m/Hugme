
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { checkAuthToken, getUserFromStorage } from './debug-auth';

const DebugContainer = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
  max-width: 300px;
  max-height: 200px;
  overflow: auto;
`;

const DebugItem = styled.div`
  margin-bottom: 5px;
`;

const DebugValue = styled.span`
  color: ${props => props.valid ? '#6CFF5C' : '#FF5C5C'};
  font-weight: bold;
`;

const AuthDebugOverlay = () => {
  const { isAuthenticated, loading, user, authToken } = useAuth();
  
  // Check localStorage directly
  const hasStorageToken = checkAuthToken();
  const storageUser = getUserFromStorage();
  
  return (
    <DebugContainer>
      <DebugItem>
        <strong>Auth Context:</strong>
      </DebugItem>
      <DebugItem>
        Loading: <DebugValue valid={!loading}>{loading ? 'true' : 'false'}</DebugValue>
      </DebugItem>
      <DebugItem>
        Authenticated: <DebugValue valid={isAuthenticated}>{isAuthenticated ? 'true' : 'false'}</DebugValue>
      </DebugItem>
      <DebugItem>
        User: <DebugValue valid={!!user}>{user ? `${user.name} (${user.id})` : 'null'}</DebugValue>
      </DebugItem>
      <DebugItem>
        Token: <DebugValue valid={!!authToken}>{authToken ? 'present' : 'missing'}</DebugValue>
      </DebugItem>
      
      <DebugItem>
        <strong>Storage:</strong>
      </DebugItem>
      <DebugItem>
        Storage Token: <DebugValue valid={hasStorageToken}>{hasStorageToken ? 'present' : 'missing'}</DebugValue>
      </DebugItem>
      <DebugItem>
        Storage User: <DebugValue valid={!!storageUser}>{storageUser ? `${storageUser.name} (${storageUser.id})` : 'null'}</DebugValue>
      </DebugItem>
      
      <DebugItem>
        <strong>Location:</strong> {window.location.pathname}
      </DebugItem>
    </DebugContainer>
  );
};

export default AuthDebugOverlay;
