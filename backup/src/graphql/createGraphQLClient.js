/**
 * Create GraphQL Client
 * 
 * A client factory that establishes a unified GraphQL client 
 * to replace WebSocket communication.
 */

import graphqlCommunicationClient from '../services/graphqlCommunicationClient';
import { getToken } from '../services/authService';

// Default GraphQL endpoint URLs
const DEFAULT_HTTP_URL = '/graphql';
const DEFAULT_WS_URL = '';  // Disabling WebSockets completely

/**
 * Create a configured GraphQL client
 * @param {Object} options - Client configuration options
 * @returns {Object} Configured GraphQL client
 */
export const createGraphQLClient = (options = {}) => {
  console.log('Creating GraphQL client with options:', options);
  
  try {
    // Extract options with defaults
    const {
      httpUrl = DEFAULT_HTTP_URL,
      wsUrl = DEFAULT_WS_URL,
      token = getToken(),
      useSubscriptions = false,  // Default to false for no WebSockets
      usePollFallback = true,    // Default to true for polling-based real-time
      onConnectionChange = null,
      onNetworkError = null,
      onAuthError = null
    } = options;
    
    // Log client configuration
    console.log('GraphQL client configuration:', { 
      httpUrl, 
      useSubscriptions: useSubscriptions ? 'enabled' : 'disabled',
      usePollFallback: usePollFallback ? 'enabled' : 'disabled',
      token: token ? 'provided' : 'none'
    });
    
    // Set environment variables for URLs
    window.REACT_APP_GRAPHQL_URL = httpUrl;
    window.REACT_APP_SUBSCRIPTION_URL = wsUrl;
    
    // Initialize the client
    graphqlCommunicationClient.initialize({
      httpUrl,
      wsUrl,
      useSubscriptions,
      usePollFallback
    });
    
    // Set auth token if provided
    if (token) {
      console.log('Setting initial auth token');
      graphqlCommunicationClient.setAuthToken(token);
    }
    
    // Register connection status handler if provided
    if (onConnectionChange) {
      console.log('Registering connection change handler');
      graphqlCommunicationClient.registerEventHandler(
        graphqlCommunicationClient.EVENTS.CONNECTION_STATUS_CHANGED,
        (event) => {
          console.log('Connection status changed:', event);
          onConnectionChange(event);
        }
      );
    }
    
    // Create network error handler
    if (onNetworkError) {
      console.log('Registering network error handler');
      graphqlCommunicationClient.registerEventHandler(
        graphqlCommunicationClient.EVENTS.NETWORK_ERROR,
        onNetworkError
      );
    }
    
    // Create auth error handler
    if (onAuthError) {
      console.log('Registering auth error handler');
      graphqlCommunicationClient.registerEventHandler(
        graphqlCommunicationClient.EVENTS.AUTH_ERROR,
        onAuthError
      );
    }
    
    console.log('GraphQL client created successfully');
    
    return {
      /**
       * Send a message via GraphQL
       * @param {string} type - Message type
       * @param {Object} data - Message data
       * @returns {Promise<Object>} Message response
       */
      send: (type, data) => {
        console.log(`Sending ${type} message:`, data);
        return graphqlCommunicationClient.sendMessage({ type, data })
          .then(response => {
            console.log(`${type} message response:`, response);
            return response;
          })
          .catch(error => {
            console.error(`Error sending ${type} message:`, error);
            throw error;
          });
      },
      
      /**
       * Fetch data via GraphQL
       * @param {string} dataType - Type of data to fetch
       * @param {Object} params - Query parameters
       * @returns {Promise<Object>} Fetched data
       */
      fetch: (dataType, params) => {
        console.log(`Fetching ${dataType} data:`, params);
        return graphqlCommunicationClient.fetchData(dataType, params)
          .then(data => {
            console.log(`${dataType} data fetched:`, data);
            return data;
          })
          .catch(error => {
            console.error(`Error fetching ${dataType} data:`, error);
            throw error;
          });
      },
      
      /**
       * Subscribe to an event
       * @param {string} eventType - Event type to subscribe to
       * @param {Function} handler - Event handler function
       * @returns {Function} Unsubscribe function
       */
      subscribe: (eventType, handler) => {
        console.log(`Subscribing to ${eventType} events`);
        return graphqlCommunicationClient.registerEventHandler(
          eventType,
          handler
        );
      },
      
      /**
       * Update auth token
       * @param {string} newToken - New authentication token
       */
      setToken: (newToken) => {
        console.log('Updating auth token');
        graphqlCommunicationClient.setAuthToken(newToken);
      },
      
      /**
       * Get current connection status
       * @returns {Object} Connection status
       */
      getStatus: () => graphqlCommunicationClient.getConnectionStatus(),
      
      /**
       * Clean up client resources
       */
      cleanup: () => {
        console.log('Cleaning up GraphQL client resources');
        graphqlCommunicationClient.cleanup();
      },
      
      // Export event constants
      events: graphqlCommunicationClient.EVENTS,
      
      // Export connection state constants
      connectionStates: graphqlCommunicationClient.CONNECTION_STATES
    };
  } catch (error) {
    console.error('Failed to create GraphQL client:', error);
    
    // Provide a fallback minimal client that logs errors
    return {
      send: () => Promise.reject(new Error('GraphQL client not available')),
      fetch: () => Promise.reject(new Error('GraphQL client not available')),
      subscribe: () => () => {},
      setToken: () => {},
      getStatus: () => ({ status: 'error', isOffline: true }),
      cleanup: () => {},
      events: {},
      connectionStates: {}
    };
  }
};

export default createGraphQLClient;