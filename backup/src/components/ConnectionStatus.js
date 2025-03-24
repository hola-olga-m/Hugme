/**
 * Connection Status Component
 * 
 * Shows the current connection status to the user.
 * Used by the GraphQLAppProvider to display real-time connection status.
 */

import React from 'react';

// Connection status indicator styles
const styles = {
  container: {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 1000,
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '8px'
  }
};

// Status-specific styles
const statusStyles = {
  connected: {
    backgroundColor: '#e6f4ea',
    color: '#137333',
    borderLeft: '4px solid #137333'
  },
  connecting: {
    backgroundColor: '#fef7e0',
    color: '#b06000',
    borderLeft: '4px solid #b06000'
  },
  reconnecting: {
    backgroundColor: '#fef7e0',
    color: '#b06000',
    borderLeft: '4px solid #b06000'
  },
  disconnected: {
    backgroundColor: '#fce8e6',
    color: '#c5221f',
    borderLeft: '4px solid #c5221f'
  },
  offline: {
    backgroundColor: '#fce8e6',
    color: '#c5221f',
    borderLeft: '4px solid #c5221f'
  }
};

// Status-specific icon styles
const iconStyles = {
  connected: {
    backgroundColor: '#137333'
  },
  connecting: {
    backgroundColor: '#b06000'
  },
  reconnecting: {
    backgroundColor: '#b06000'
  },
  disconnected: {
    backgroundColor: '#c5221f'
  },
  offline: {
    backgroundColor: '#c5221f'
  }
};

/**
 * Renders a connection status indicator
 * @param {Object} props - Component props
 * @param {string} props.status - Connection status
 * @param {boolean} props.isOffline - Whether device is offline
 */
const ConnectionStatus = ({ status, isOffline }) => {
  // Get the appropriate status for styling
  const effectiveStatus = isOffline ? 'offline' : status;
  
  // Get status text based on status
  const getStatusText = () => {
    if (isOffline) return 'Offline Mode';
    
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown Status';
    }
  };
  
  return (
    <div 
      style={{ 
        ...styles.container, 
        ...statusStyles[effectiveStatus] 
      }}
      aria-live="polite"
    >
      <span 
        style={{
          ...styles.icon,
          ...iconStyles[effectiveStatus]
        }}
      />
      {getStatusText()}
    </div>
  );
};

export default ConnectionStatus;