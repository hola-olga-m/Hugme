/**
 * useGraphQL Hook
 * 
 * A React hook that provides access to the GraphQL client
 * and manages client lifecycle.
 */

import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { createGraphQLClient } from '../graphql/createGraphQLClient';

// Create a context for the GraphQL client
const GraphQLContext = createContext(null);

/**
 * Provider component that makes GraphQL client available to any
 * child component that calls useGraphQL().
 */
export const GraphQLProvider = ({ children, options = {} }) => {
  // Create a GraphQL client on mount
  const [client] = useState(() => createGraphQLClient(options));
  
  // Clean up when the component unmounts
  useEffect(() => {
    return () => {
      client.cleanup();
    };
  }, [client]);
  
  return (
    <GraphQLContext.Provider value={client}>
      {children}
    </GraphQLContext.Provider>
  );
};

/**
 * Hook for components to get access to the GraphQL client 
 * and its functionality.
 */
export const useGraphQL = () => {
  const client = useContext(GraphQLContext);
  
  // Connection state tracking
  const [connectionState, setConnectionState] = useState(
    client ? client.getStatus().status : client.connectionStates.DISCONNECTED
  );
  
  // Online/offline state tracking
  const [isOffline, setIsOffline] = useState(
    client ? client.getStatus().isOffline : !navigator.onLine
  );
  
  // Track when the client has been initialized
  const [isInitialized, setIsInitialized] = useState(!!client);
  
  // Subscribe to connection status changes
  useEffect(() => {
    if (!client) return;
    
    const unsubscribe = client.subscribe(
      client.events.CONNECTION_STATUS_CHANGED,
      (event) => {
        setConnectionState(event.status);
        setIsOffline(client.getStatus().isOffline);
      }
    );
    
    return unsubscribe;
  }, [client]);
  
  // Hook to send a message via GraphQL mutation
  const sendMessage = useCallback(
    (type, data) => {
      if (!client) throw new Error('GraphQL client not available');
      return client.send(type, data);
    },
    [client]
  );
  
  // Hook to fetch data via GraphQL query
  const fetchData = useCallback(
    (dataType, params) => {
      if (!client) throw new Error('GraphQL client not available');
      return client.fetch(dataType, params);
    },
    [client]
  );
  
  // Hook to subscribe to events
  const subscribe = useCallback(
    (eventType, handler) => {
      if (!client) throw new Error('GraphQL client not available');
      return client.subscribe(eventType, handler);
    },
    [client]
  );
  
  // Hook to update auth token
  const setToken = useCallback(
    (token) => {
      if (!client) throw new Error('GraphQL client not available');
      client.setToken(token);
    },
    [client]
  );
  
  // Return the wrapped client functions and state
  return {
    isInitialized,
    connectionState,
    isOffline,
    isConnected: connectionState === client?.connectionStates.CONNECTED,
    isConnecting: connectionState === client?.connectionStates.CONNECTING,
    isReconnecting: connectionState === client?.connectionStates.RECONNECTING,
    events: client?.events,
    connectionStates: client?.connectionStates,
    sendMessage,
    fetchData,
    subscribe,
    setToken
  };
};

export default useGraphQL;