/**
 * GraphQL App Provider
 * 
 * A high-level component that integrates the GraphQL client 
 * with the React application, providing connection status and
 * a complete replacement for WebSocket communication.
 */

import React, { useEffect, useState } from 'react';
import { GraphQLProvider } from '../hooks/useGraphQL.jsx';
import ConnectionStatus from './ConnectionStatus';

// Default GraphQL options - now HTTP only
const DEFAULT_OPTIONS = {
  httpUrl: '/graphql',       // GraphQL HTTP endpoint 
  wsUrl: '',                 // Empty to disable WebSockets
  useSubscriptions: false,   // Disable WebSocket subscriptions
  usePollFallback: true,     // Enable polling for real-time updates
};

/**
 * Application wrapper that provides GraphQL client to the app
 * and shows connection status as needed.
 */
const GraphQLAppProvider = ({ children, options = {} }) => {
  console.log('GraphQLAppProvider rendering');
  
  // Merge provided options with defaults
  const clientOptions = { ...DEFAULT_OPTIONS, ...options };
  console.log('GraphQL client options:', clientOptions);
  
  // Track connection status
  const [connectionStatus, setConnectionStatus] = useState({
    status: 'connecting',
    isOffline: false,
    showIndicator: false
  });
  
  // Handle connection status changes
  const handleConnectionChange = (event) => {
    console.log('GraphQL connection status changed:', event);
    setConnectionStatus(prevStatus => ({
      ...prevStatus,
      status: event.status,
      isOffline: event.isOffline || !navigator.onLine,
      showIndicator: true
    }));
    
    // Hide the indicator after a delay for successful connections
    if (event.status === 'connected') {
      setTimeout(() => {
        setConnectionStatus(prevStatus => ({
          ...prevStatus,
          showIndicator: false
        }));
      }, 2000);
    }
  };
  
  // Track connection status in browser's title
  useEffect(() => {
    const defaultTitle = document.title;
    
    if (connectionStatus.isOffline) {
      document.title = `[Offline] ${defaultTitle}`;
    } else if (connectionStatus.status === 'reconnecting') {
      document.title = `[Reconnecting...] ${defaultTitle}`;
    } else {
      document.title = defaultTitle;
    }
    
    return () => {
      document.title = defaultTitle;
    };
  }, [connectionStatus.status, connectionStatus.isOffline]);
  
  // Log initial render
  useEffect(() => {
    console.log('GraphQLAppProvider mounted');
    
    return () => {
      console.log('GraphQLAppProvider unmounted');
    };
  }, []);
  
  return (
    <GraphQLProvider options={{
      ...clientOptions,
      onConnectionChange: handleConnectionChange
    }}>
      {connectionStatus.showIndicator && (
        <ConnectionStatus 
          status={connectionStatus.status}
          isOffline={connectionStatus.isOffline}
        />
      )}
      {children}
    </GraphQLProvider>
  );
};

export default GraphQLAppProvider;