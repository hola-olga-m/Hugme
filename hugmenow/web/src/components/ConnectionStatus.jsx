import React from 'react';
import styled, { keyframes } from 'styled-components';

// Status-based animations
const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(5px); }
  50% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
  100% { transform: translateX(0); }
`;

// Styled container for connection status
const StatusContainer = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${props => {
    switch (props.status) {
      case 'connected': return '#4CAF50';
      case 'connecting': return '#FF9800';
      case 'reconnecting': return '#FF9800';
      case 'disconnected': return '#F44336';
      default: return '#757575';
    }
  }};
  color: white;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  animation: ${props => {
    if (props.status === 'connecting' || props.status === 'reconnecting') {
      return pulse;
    }
    if (props.status === 'disconnected') {
      return shake;
    }
    return 'none';
  }} 1.5s ease-in-out infinite;
  transition: background-color 0.3s ease;
`;

// Status indicator dot
const StatusDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.isOffline ? '#f44336' : '#ffffff'};
`;

/**
 * Component to display the current connection status
 */
const ConnectionStatus = ({ status = 'unknown', isOffline = false }) => {
  // Get status text based on current state
  const getStatusText = () => {
    if (isOffline) {
      return 'Offline';
    }
    
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'disconnected':
        return 'Connection Error';
      default:
        return 'Unknown Status';
    }
  };
  
  return (
    <StatusContainer status={status}>
      <StatusDot isOffline={isOffline} />
      {getStatusText()}
    </StatusContainer>
  );
};

export default ConnectionStatus;