/**
 * useGraphQL Hook
 * 
 * Provides a React Hook for consuming GraphQL APIs with Apollo Client.
 * This is a simplified version that uses HTTP instead of WebSockets.
 */

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { 
  ApolloClient, 
  InMemoryCache, 
  HttpLink,
  ApolloProvider,
  from
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// Create a context for the GraphQL client
const GraphQLContext = createContext({
  client: null,
  options: {}
});

/**
 * Error handling link that logs errors and triggers connection status updates
 */
const createErrorLink = (onConnectionChange) => {
  return onError(({ graphQLErrors, networkError }) => {
    // Handle GraphQL errors
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }

    // Handle network errors and trigger connection status update
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
      
      if (onConnectionChange) {
        // Trigger connection status update
        onConnectionChange({
          status: 'disconnected',
          isOffline: true,
          error: networkError
        });
      }
    }
  });
};

/**
 * Create an Apollo Client instance with the provided options
 */
const createApolloClient = (options) => {
  const { httpUrl, onConnectionChange } = options;
  
  // Create the HTTP link
  const httpLink = new HttpLink({
    uri: httpUrl,
    credentials: 'include'
  });
  
  // Create the error handling link
  const errorLink = createErrorLink(onConnectionChange);
  
  // Combine the links
  const link = from([errorLink, httpLink]);
  
  // Create and return the Apollo Client instance
  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: process.env.NODE_ENV !== 'production',
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
};

/**
 * Provider component for the GraphQL client
 */
export const GraphQLProvider = ({ children, options }) => {
  // Create the Apollo Client instance
  const client = useMemo(() => createApolloClient(options), [options]);
  
  // Set up online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      console.log('Browser is online');
      if (options.onConnectionChange) {
        options.onConnectionChange({
          status: 'connected',
          isOffline: false,
        });
      }
    };
    
    const handleOffline = () => {
      console.log('Browser is offline');
      if (options.onConnectionChange) {
        options.onConnectionChange({
          status: 'disconnected',
          isOffline: true,
        });
      }
    };
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial status check
    if (options.onConnectionChange) {
      options.onConnectionChange({
        status: navigator.onLine ? 'connected' : 'disconnected',
        isOffline: !navigator.onLine,
      });
    }
    
    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [options]);
  
  return (
    <GraphQLContext.Provider value={{ client, options }}>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </GraphQLContext.Provider>
  );
};

/**
 * Hook for consuming the GraphQL client
 */
export const useGraphQL = () => {
  const context = useContext(GraphQLContext);
  
  if (!context) {
    throw new Error('useGraphQL must be used within a GraphQLProvider');
  }
  
  return context;
};

export default useGraphQL;