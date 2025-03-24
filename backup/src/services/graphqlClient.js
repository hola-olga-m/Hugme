/**
 * GraphQL Client
 * 
 * Low-level GraphQL client for communicating with the GraphQL Mesh gateway.
 * Handles queries, mutations, subscriptions, and authentication.
 */

let authToken = null;
let subscriptionClient = null;
let wsConnection = null;
const wsSubscriptions = new Map();
let nextSubscriptionId = 1;

/**
 * Initialize the WebSocket connection for subscriptions
 * @returns {Promise<WebSocket>} The WebSocket connection
 */
const initSubscriptionClient = () => {
  return new Promise((resolve, reject) => {
    try {
      // Create WebSocket connection to GraphQL subscription endpoint
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/graphql`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('GraphQL subscription connection established');
        
        // If we have a token, send it for authentication
        if (authToken) {
          ws.send(JSON.stringify({
            type: 'connection_init',
            payload: { Authorization: `Bearer ${authToken}` }
          }));
        } else {
          ws.send(JSON.stringify({ type: 'connection_init', payload: {} }));
        }
        
        resolve(ws);
      };
      
      ws.onclose = () => {
        console.log('GraphQL subscription connection closed');
        wsConnection = null;
      };
      
      ws.onerror = (error) => {
        console.error('GraphQL subscription connection error:', error);
        reject(error);
      };
      
      ws.onmessage = (event) => {
        handleSubscriptionMessage(JSON.parse(event.data));
      };
      
      wsConnection = ws;
      return ws;
    } catch (error) {
      console.error('Failed to create subscription client:', error);
      reject(error);
    }
  });
};

/**
 * Handle subscription messages from the server
 * @param {Object} message - The message from the server
 */
const handleSubscriptionMessage = (message) => {
  switch (message.type) {
    case 'connection_ack':
      console.log('GraphQL subscription connection acknowledged');
      break;
      
    case 'data':
      const subscription = wsSubscriptions.get(message.id);
      if (subscription && subscription.onData) {
        subscription.onData(message.payload.data);
      }
      break;
      
    case 'error':
      const errorSub = wsSubscriptions.get(message.id);
      if (errorSub && errorSub.onError) {
        errorSub.onError(message.payload);
      }
      console.error('GraphQL subscription error:', message.payload);
      break;
      
    case 'complete':
      const completeSub = wsSubscriptions.get(message.id);
      if (completeSub && completeSub.onComplete) {
        completeSub.onComplete();
      }
      wsSubscriptions.delete(message.id);
      break;
      
    default:
      console.log('Unknown GraphQL subscription message:', message);
  }
};

/**
 * Send a GraphQL query or mutation to the server
 * @param {string} query - The GraphQL query or mutation
 * @param {Object} variables - The variables for the query
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} The query result
 */
export const request = async (query, variables = {}, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
        operationName: options.operationName
      }),
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw result.errors;
    }
    
    return result.data;
  } catch (error) {
    console.error('GraphQL request error:', error);
    throw error;
  }
};

/**
 * Execute a GraphQL query
 * @param {string} query - The GraphQL query
 * @param {Object} variables - The variables for the query
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} The query result
 */
export const query = (query, variables = {}, options = {}) => {
  return request(query, variables, options);
};

/**
 * Execute a GraphQL mutation
 * @param {string} mutation - The GraphQL mutation
 * @param {Object} variables - The variables for the mutation
 * @param {Object} options - Additional request options
 * @returns {Promise<Object>} The mutation result
 */
export const mutate = (mutation, variables = {}, options = {}) => {
  return request(mutation, variables, options);
};

/**
 * Create a GraphQL subscription
 * @param {string} subscription - The GraphQL subscription
 * @param {Object} variables - The variables for the subscription
 * @param {Function} onData - Callback for received data
 * @param {Function} onError - Callback for errors
 * @returns {Object} Subscription control object
 */
export const subscribe = (subscription, variables = {}, onData, onError) => {
  const subscriptionId = (nextSubscriptionId++).toString();
  
  const setupSubscription = async () => {
    // Ensure we have a WebSocket connection
    if (!wsConnection) {
      try {
        await initSubscriptionClient();
      } catch (error) {
        if (onError) {
          onError('Failed to establish WebSocket connection');
        }
        return { id: subscriptionId };
      }
    }
    
    // Store subscription callbacks
    wsSubscriptions.set(subscriptionId, {
      onData,
      onError,
      onComplete: () => {
        wsSubscriptions.delete(subscriptionId);
      }
    });
    
    // Send subscription request
    wsConnection.send(JSON.stringify({
      id: subscriptionId,
      type: 'start',
      payload: {
        query: subscription,
        variables
      }
    }));
    
    // Return control object
    return {
      id: subscriptionId,
      unsubscribe: () => {
        if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
          wsConnection.send(JSON.stringify({
            id: subscriptionId,
            type: 'stop'
          }));
        }
        wsSubscriptions.delete(subscriptionId);
      }
    };
  };
  
  return setupSubscription();
};

/**
 * Set the authentication token for requests
 * @param {string} token - The JWT token
 */
export const setAuthToken = (token) => {
  authToken = token;
  
  // Update WebSocket connection with new token if it exists
  if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
    wsConnection.send(JSON.stringify({
      type: 'connection_init',
      payload: { Authorization: `Bearer ${authToken}` }
    }));
  }
};

/**
 * Clear the authentication token
 */
export const clearAuthToken = () => {
  authToken = null;
};

/**
 * Get the current authentication token
 * @returns {string|null} The current token
 */
export const getAuthToken = () => {
  return authToken;
};

/**
 * Initialize the GraphQL client
 * @param {Object} options - Initialization options
 */
export const initialize = async (options = {}) => {
  // Set token if provided
  if (options.token) {
    setAuthToken(options.token);
  }
  
  // Initialize subscription client if enabled
  if (options.enableSubscriptions) {
    try {
      await initSubscriptionClient();
    } catch (error) {
      console.warn('Failed to initialize subscription client, will retry when needed', error);
    }
  }
};

/**
 * Close the GraphQL client connections
 */
export const close = () => {
  // Close WebSocket connection
  if (wsConnection) {
    wsConnection.close();
    wsConnection = null;
  }
  
  // Clear subscriptions
  wsSubscriptions.clear();
};

export default {
  query,
  mutate,
  subscribe,
  initialize,
  close,
  setAuthToken,
  clearAuthToken,
  getAuthToken
};