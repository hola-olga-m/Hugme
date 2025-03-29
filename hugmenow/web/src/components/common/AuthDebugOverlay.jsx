
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { checkAuthToken } from './debug-auth';

const DebugContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
  max-width: 300px;
  max-height: 200px;
  overflow: auto;
  border-radius: 5px 0 0 0;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const ToggleButton = styled.button`
  position: fixed;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 5px;
  font-size: 10px;
  cursor: pointer;
  z-index: 10000;
  border-radius: 5px 0 0 0;
`;

const AuthDebugOverlay = () => {
  const [visible, setVisible] = useState(false);
  const { isAuthenticated, loading, user } = useAuth();
  const [refreshCount, setRefreshCount] = useState(0);
  
  // Refresh debugging data every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount(prev => prev + 1);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const toggleVisibility = () => setVisible(prev => !prev);
  
  // Add double-tap keyboard shortcut (alt+d)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'd') {
        toggleVisibility();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <>
      <ToggleButton onClick={toggleVisibility}>Debug</ToggleButton>
      <DebugContainer visible={visible}>
        <h4>Auth Debug ({refreshCount})</h4>
        <p>Auth State: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
        <p>Loading: {loading ? 'True' : 'False'}</p>
        <p>Has Token: {checkAuthToken() ? 'Yes' : 'No'}</p>
        <p>User: {user ? `${user.name} (${user.id})` : 'No user'}</p>
        <p>Path: {window.location.pathname}</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
      </DebugContainer>
    </>
  );
};

export default AuthDebugOverlay;
