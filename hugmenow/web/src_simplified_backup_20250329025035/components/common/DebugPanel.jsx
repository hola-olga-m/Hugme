import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

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
  max-width: 300px;
  max-height: 200px;
  overflow: auto;
  z-index: 9999;
  opacity: ${props => props.expanded ? 1 : 0.7};
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #00ff00;
  cursor: pointer;
  padding: 0;
  margin-bottom: 5px;
  font-family: monospace;
  font-size: 12px;
`;

const DebugItem = styled.div`
  margin-bottom: 5px;
  word-break: break-all;
  
  span.label {
    color: #00ff00;
    margin-right: 5px;
  }
  
  span.value {
    color: #ffffff;
  }
`;

// This component is only for development use
const DebugPanel = () => {
  const [expanded, setExpanded] = useState(false);
  const [isDev, setIsDev] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Check if we're in development environment
    setIsDev(process.env.NODE_ENV === 'development' || 
             window.location.hostname === 'localhost' ||
             window.location.hostname.includes('replit'));
  }, []);
  
  // Only render in development
  if (!isDev) return null;
  
  return (
    <DebugContainer expanded={expanded}>
      <ToggleButton onClick={() => setExpanded(!expanded)}>
        {expanded ? '[-] Debug Info' : '[+] Debug Info'}
      </ToggleButton>
      
      {expanded && (
        <>
          <DebugItem>
            <span className="label">Auth:</span>
            <span className="value">{isAuthenticated ? 'Logged In' : 'Not Logged In'}</span>
          </DebugItem>
          
          {currentUser && (
            <>
              <DebugItem>
                <span className="label">User ID:</span>
                <span className="value">{currentUser.id}</span>
              </DebugItem>
              
              <DebugItem>
                <span className="label">Username:</span>
                <span className="value">{currentUser.username}</span>
              </DebugItem>
              
              <DebugItem>
                <span className="label">Anonymous:</span>
                <span className="value">{currentUser.isAnonymous ? 'Yes' : 'No'}</span>
              </DebugItem>
            </>
          )}
          
          <DebugItem>
            <span className="label">Route:</span>
            <span className="value">{window.location.pathname}</span>
          </DebugItem>
          
          <DebugItem>
            <span className="label">Env:</span>
            <span className="value">{process.env.NODE_ENV}</span>
          </DebugItem>
        </>
      )}
    </DebugContainer>
  );
};

export default DebugPanel;