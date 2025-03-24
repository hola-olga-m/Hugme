/**
 * Communication Bridge
 * 
 * Bridges between the existing WebSocket communication and the new GraphQL/REST API architecture.
 * Allows for a gradual transition between architectures without breaking existing functionality.
 */

import { getToken, isAuthenticated } from './authService';
import * as graphqlClient from './graphqlClient';
import * as restApiService from './restApiService';
import * as websocketService from './websocketService';
import * as offlineStorage from './offlineStorage';

// Configuration for feature flags
export const FEATURES = {
  USE_GRAPHQL_FOR_AUTH: true,
  USE_GRAPHQL_FOR_MOOD: true,
  USE_GRAPHQL_FOR_HUGS: true,
  USE_GRAPHQL_FOR_PROFILE: true,
  USE_GRAPHQL_FOR_FEED: true,
  USE_GRAPHQL_FOR_ANALYTICS: true,
  USE_REST_FALLBACK: true,
  ENABLE_OFFLINE_SUPPORT: true,
  DISABLE_WEBSOCKETS: true,  // Confirm WebSockets are disabled
  FORCE_HTTP_ONLY: true      // Add HTTP-only mode flag
};

// Connection state
let isConnected = false;
let ws = null;
let queuedMessages = [];
let messageHandlers = new Map();
let connectionListeners = [];

/**
 * Initialize the communication bridge
 * @param {Object} options - Initialization options
 */
export const initialize = (options = {}) => {
  // Override default feature flags
  if (options.features) {
    Object.assign(FEATURES, options.features);
  }
  
  // Initialize GraphQL client if using any GraphQL features
  if (isUsingGraphQL()) {
    graphqlClient.initialize({
      endpoint: options.graphqlEndpoint || '/graphql',
      wsEndpoint: options.graphqlWsEndpoint || '/graphql'
    });
  }
  
  // Connect to WebSocket if still using it for some features and not disabled
  if (!isUsingGraphQLForEverything() && !FEATURES.DISABLE_WEBSOCKETS) {
    connectWebSocket(options.wsEndpoint || '/ws');
  }
  
  // Load any queued offline actions
  if (FEATURES.ENABLE_OFFLINE_SUPPORT) {
    loadOfflineQueue();
  }
  
  // Set up network state monitoring
  window.addEventListener('online', () => {
    isConnected = true;
    
    if (queuedMessages.length > 0) {
      processOfflineQueue();
    }
    
    if (!ws && !isUsingGraphQLForEverything() && !FEATURES.DISABLE_WEBSOCKETS) {
      connectWebSocket();
    }
    
    // Notify listeners
    connectionListeners.forEach(listener => 
      listener({ type: 'online', timestamp: Date.now() })
    );
  });
  
  window.addEventListener('offline', () => {
    isConnected = false;
    
    // Notify listeners
    connectionListeners.forEach(listener => 
      listener({ type: 'offline', timestamp: Date.now() })
    );
  });
  
  // Initially check if we're online
  isConnected = navigator.onLine;
};

/**
 * Check if any GraphQL feature is enabled
 * @returns {boolean} True if any GraphQL feature is enabled
 */
const isUsingGraphQL = () => {
  return (
    FEATURES.USE_GRAPHQL_FOR_AUTH ||
    FEATURES.USE_GRAPHQL_FOR_MOOD ||
    FEATURES.USE_GRAPHQL_FOR_HUGS ||
    FEATURES.USE_GRAPHQL_FOR_PROFILE ||
    FEATURES.USE_GRAPHQL_FOR_FEED ||
    FEATURES.USE_GRAPHQL_FOR_ANALYTICS
  );
};

/**
 * Check if all communication is using GraphQL
 * @returns {boolean} True if all features use GraphQL
 */
const isUsingGraphQLForEverything = () => {
  return (
    FEATURES.USE_GRAPHQL_FOR_AUTH &&
    FEATURES.USE_GRAPHQL_FOR_MOOD &&
    FEATURES.USE_GRAPHQL_FOR_HUGS &&
    FEATURES.USE_GRAPHQL_FOR_PROFILE &&
    FEATURES.USE_GRAPHQL_FOR_FEED &&
    FEATURES.USE_GRAPHQL_FOR_ANALYTICS
  );
};

/**
 * Connect to the WebSocket server
 */
const connectWebSocket = (endpoint = '/ws') => {
  if (ws) return; // Already connected
  
  try {
    ws = websocketService.connectWebSocket(endpoint);
    
    ws.onmessage = (event) => {
      handleIncomingMessage(JSON.parse(event.data));
    };
    
    ws.onopen = () => {
      isConnected = true;
      
      // Authenticate if we have a token
      if (isAuthenticated()) {
        sendWebSocketMessage({
          type: 'authenticate',
          token: getToken(),
          method: 'token'
        });
      }
      
      // Process any queued messages
      if (queuedMessages.length > 0) {
        processOfflineQueue();
      }
      
      // Notify listeners
      connectionListeners.forEach(listener => 
        listener({ type: 'websocket_connected', timestamp: Date.now() })
      );
    };
    
    ws.onclose = () => {
      ws = null;
      
      // Notify listeners
      connectionListeners.forEach(listener => 
        listener({ type: 'websocket_disconnected', timestamp: Date.now() })
      );
      
      // Try to reconnect if we're online and websockets are not disabled
      if (isConnected && !isUsingGraphQLForEverything() && !FEATURES.DISABLE_WEBSOCKETS) {
        setTimeout(() => connectWebSocket(endpoint), 5000);
      }
    };
    
    // Set up heartbeat to keep connection alive
    websocketService.setupHeartbeat(ws);
  } catch (error) {
    console.error('Failed to connect to WebSocket server:', error);
  }
};

/**
 * Handle incoming messages
 * @param {Object} message - The message from the server
 */
const handleIncomingMessage = (message) => {
  const { type } = message;
  
  // Handle auth challenges immediately (special case)
  if (type === 'auth_challenge') {
    handleAuthChallenge(message);
    return;
  }
  
  // Get handlers for this message type
  const handlers = messageHandlers.get(type) || [];
  
  // Call all registered handlers
  handlers.forEach(handler => {
    try {
      handler(message);
    } catch (error) {
      console.error(`Error in message handler for ${type}:`, error);
    }
  });
};

/**
 * Handle authentication challenges from the server
 * @param {Object} message - The challenge message
 */
const handleAuthChallenge = (message) => {
  console.log('Received auth challenge:', message);
  
  if (message.challenge === 'token_required') {
    // Get token from storage if available
    const token = getToken();
    
    if (token) {
      console.log('Responding to auth challenge with stored token');
      
      // Use the appropriate method based on feature flags
      if (FEATURES.USE_GRAPHQL_FOR_AUTH) {
        // Set token for GraphQL client
        graphqlClient.setAuthToken(token);
        
        // Send auth response via GraphQL
        graphqlClient.query(`
          query VerifyToken {
            verifyToken {
              isValid
              user {
                id
                username
                email
                displayName
              }
            }
          }
        `).then(result => {
          if (result.verifyToken.isValid) {
            // Also update WebSocket connection for services still using it
            if (!isUsingGraphQLForEverything() && ws) {
              sendWebSocketMessage({
                type: 'authenticate',
                method: 'token',
                token
              });
            }
            
            // Notify auth handlers
            const authHandlers = messageHandlers.get('authentication_response') || [];
            authHandlers.forEach(handler => {
              try {
                handler({
                  type: 'authentication_response',
                  success: true,
                  user: result.verifyToken.user
                });
              } catch (error) {
                console.error('Error in GraphQL auth handler:', error);
              }
            });
          } else {
            // Token invalid, notify handlers
            const authHandlers = messageHandlers.get('authentication_response') || [];
            authHandlers.forEach(handler => {
              try {
                handler({
                  type: 'authentication_response',
                  success: false,
                  error: 'Invalid authentication token'
                });
              } catch (error) {
                console.error('Error in GraphQL auth handler:', error);
              }
            });
          }
        }).catch(error => {
          console.error('GraphQL token verification failed:', error);
          
          // Fall back to WebSocket if available
          if (!isUsingGraphQLForEverything() && ws) {
            sendWebSocketMessage({
              type: 'authenticate',
              method: 'token',
              token
            });
          } else {
            // Notify auth handlers of failure
            const authHandlers = messageHandlers.get('authentication_response') || [];
            authHandlers.forEach(handler => {
              try {
                handler({
                  type: 'authentication_response',
                  success: false,
                  error: 'Authentication failed: ' + error.message
                });
              } catch (handlerError) {
                console.error('Error in auth failure handler:', handlerError);
              }
            });
          }
        });
      } else {
        // Use WebSocket authentication
        sendWebSocketMessage({
          type: 'authenticate',
          method: 'token',
          token
        });
      }
    } else {
      console.log('No token available to respond to auth challenge');
      // Notify any auth listeners about the failed challenge
      const authHandlers = messageHandlers.get('authentication_response') || [];
      authHandlers.forEach(handler => {
        try {
          handler({
            type: 'authentication_response',
            success: false,
            error: 'Authentication token required but not available'
          });
        } catch (error) {
          console.error('Error in auth challenge handler:', error);
        }
      });
    }
  }
};

/**
 * Send a message to the server
 * @param {Object} message - The message to send
 * @param {string} preferredMethod - Preferred method ('websocket', 'graphql', 'rest', 'auto')
 * @returns {Promise<Object>} Response or status
 */
export const sendMessage = async (message, preferredMethod = 'auto') => {
  const { type } = message;
  
  // Determine which method to use
  let method = preferredMethod;
  
  if (method === 'auto') {
    // If offline, queue for later and return
    if (!isConnected) {
      return queueMessage(message);
    }
    
    // Check feature flags to determine method
    if (shouldUseGraphQL(type)) {
      method = 'graphql';
    } else if (!ws || FEATURES.DISABLE_WEBSOCKETS) {
      method = FEATURES.USE_REST_FALLBACK ? 'rest' : 'queue';
    } else {
      method = 'websocket';
    }
  }
  
  // Override websocket if disabled
  if (method === 'websocket' && FEATURES.DISABLE_WEBSOCKETS) {
    method = FEATURES.USE_REST_FALLBACK ? 'rest' : 'graphql';
  }
  
  // Send with selected method
  switch (method) {
    case 'websocket':
      return sendWebSocketMessage(message);
    
    case 'graphql':
      return sendGraphQLMessage(message);
    
    case 'rest':
      return sendRESTMessage(message);
    
    case 'queue':
      return queueMessage(message);
    
    default:
      throw new Error(`Unknown communication method: ${method}`);
  }
};

/**
 * Check if a message type should use GraphQL based on feature flags
 * @param {string} type - Message type
 * @returns {boolean} True if this message type should use GraphQL
 */
const shouldUseGraphQL = (type) => {
  const authTypes = ['authenticate', 'register', 'login', 'token', 'forgot_password', 'reset_password'];
  const moodTypes = ['update_mood', 'get_mood_history', 'get_mood_analytics'];
  const hugTypes = ['send_hug', 'request_hug', 'respond_to_hug', 'create_group_hug', 'join_group_hug'];
  const profileTypes = ['get_user_profile', 'update_profile', 'follow_user', 'unfollow_user'];
  const feedTypes = ['get_community_feed', 'get_user_feed'];
  const analyticsTypes = ['get_wellness_dashboard', 'get_mood_insights', 'get_mood_recommendations'];
  
  if (authTypes.includes(type)) {
    return FEATURES.USE_GRAPHQL_FOR_AUTH;
  }
  
  if (moodTypes.includes(type)) {
    return FEATURES.USE_GRAPHQL_FOR_MOOD;
  }
  
  if (hugTypes.includes(type)) {
    return FEATURES.USE_GRAPHQL_FOR_HUGS;
  }
  
  if (profileTypes.includes(type)) {
    return FEATURES.USE_GRAPHQL_FOR_PROFILE;
  }
  
  if (feedTypes.includes(type)) {
    return FEATURES.USE_GRAPHQL_FOR_FEED;
  }
  
  if (analyticsTypes.includes(type)) {
    return FEATURES.USE_GRAPHQL_FOR_ANALYTICS;
  }
  
  return false;
};

/**
 * Send a message via WebSocket
 * @param {Object} message - The message to send
 * @returns {Promise<Object>} Response data or status
 */
const sendWebSocketMessage = (message) => {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      // If WebSocket is not connected, try to connect and queue message
      connectWebSocket();
      queueMessage(message);
      resolve({ status: 'queued', message: 'WebSocket not connected, message queued' });
      return;
    }
    
    try {
      // Generate a unique message ID for tracking responses
      const messageId = Date.now() + Math.random().toString(36).substr(2, 9);
      
      // Send the message with ID
      ws.send(JSON.stringify({
        ...message,
        messageId
      }));
      
      // For messages that don't have responses, resolve immediately
      const noResponseTypes = ['ping', 'pong', 'presence'];
      if (noResponseTypes.includes(message.type)) {
        resolve({ status: 'sent' });
        return;
      }
      
      // For other messages, wait for response
      const responseType = getResponseType(message.type);
      const responseHandler = (response) => {
        if (response.messageId === messageId) {
          // Remove this one-time handler
          const handlers = messageHandlers.get(responseType) || [];
          messageHandlers.set(
            responseType,
            handlers.filter(h => h !== responseHandler)
          );
          
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        }
      };
      
      // Register temporary handler for the response
      registerMessageHandler(responseType, responseHandler);
      
      // Set timeout for response
      setTimeout(() => {
        // Remove handler after timeout
        const handlers = messageHandlers.get(responseType) || [];
        messageHandlers.set(
          responseType,
          handlers.filter(h => h !== responseHandler)
        );
        
        reject(new Error(`Timeout waiting for ${responseType} response`));
      }, 30000);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Send a message via GraphQL
 * @param {Object} message - The message to send
 * @returns {Promise<Object>} Response data
 */
const sendGraphQLMessage = async (message) => {
  const { type, ...data } = message;
  
  try {
    switch (type) {
      case 'authenticate': {
        const { method, token, email, password } = data;
        
        if (method === 'token' && token) {
          graphqlClient.setAuthToken(token);
          
          const query = `
            query VerifyToken {
              verifyToken {
                isValid
                user {
                  id
                  username
                  email
                  displayName
                }
              }
            }
          `;
          
          const result = await graphqlClient.query(query);
          return {
            type: 'auth_response',
            authenticated: result.verifyToken.isValid,
            user: result.verifyToken.user
          };
        } else if (method === 'credentials' && email && password) {
          const mutation = `
            mutation Login($email: String!, $password: String!) {
              login(input: { email: $email, password: $password }) {
                token
                user {
                  id
                  username
                  email
                  displayName
                }
              }
            }
          `;
          
          const variables = { email, password };
          const result = await graphqlClient.mutate(mutation, variables);
          
          graphqlClient.setAuthToken(result.login.token);
          
          return {
            type: 'auth_response',
            authenticated: true,
            token: result.login.token,
            user: result.login.user
          };
        }
        
        throw new Error('Invalid authentication method or missing credentials');
      }
      
      case 'register': {
        const mutation = `
          mutation Register($input: RegisterInput!) {
            register(input: $input) {
              token
              user {
                id
                username
                email
                displayName
              }
            }
          }
        `;
        
        const result = await graphqlClient.mutate(mutation, { input: data });
        
        graphqlClient.setAuthToken(result.register.token);
        
        return {
          type: 'registration_response',
          success: true,
          token: result.register.token,
          user: result.register.user
        };
      }
      
      case 'update_mood': {
        const mutation = `
          mutation CreateMood($input: CreateMoodInput!) {
            createMood(input: $input) {
              id
              value
              score
              note
              isPublic
              createdAt
            }
          }
        `;
        
        const result = await graphqlClient.mutate(mutation, { input: data });
        
        return {
          type: 'mood_update_response',
          success: true,
          mood: result.createMood
        };
      }
      
      case 'send_hug': {
        const mutation = `
          mutation SendHug($input: SendHugInput!) {
            sendHug(input: $input) {
              id
              type
              message
              senderId
              recipientId
              createdAt
            }
          }
        `;
        
        const result = await graphqlClient.mutate(mutation, { input: data });
        
        return {
          type: 'send_hug_response',
          success: true,
          hug: result.sendHug
        };
      }
      
      case 'request_hug': {
        const mutation = `
          mutation RequestHug($input: HugRequestInput!) {
            requestHug(input: $input) {
              id
              message
              mood
              isPublic
              userId
              createdAt
            }
          }
        `;
        
        const result = await graphqlClient.mutate(mutation, { input: data });
        
        return {
          type: 'request_hug_response',
          success: true,
          request: result.requestHug
        };
      }
      
      case 'fetch': {
        const { dataType, params } = data;
        return fetchData(dataType, params);
      }
      
      // Add more message type handlers as needed
      
      default:
        throw new Error(`Unsupported GraphQL message type: ${type}`);
    }
  } catch (error) {
    console.error(`GraphQL message error (${type}):`, error);
    throw error;
  }
};

/**
 * Send a message via REST API
 * @param {Object} message - The message to send
 * @returns {Promise<Object>} Response data
 */
const sendRESTMessage = async (message) => {
  const { type, ...data } = message;
  
  try {
    switch (type) {
      case 'authenticate': {
        const { method, token, email, password } = data;
        
        if (method === 'token' && token) {
          return await restApiService.apiRequest('/auth/verify-token', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } else if (method === 'credentials' && email && password) {
          return await restApiService.apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
          });
        }
        
        throw new Error('Invalid authentication method or missing credentials');
      }
      
      case 'register': {
        return await restApiService.apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
      
      case 'update_mood': {
        return await restApiService.apiRequest('/moods', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
      
      case 'send_hug': {
        return await restApiService.apiRequest('/hugs', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
      
      case 'request_hug': {
        return await restApiService.apiRequest('/hugs/request', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
      
      case 'fetch': {
        const { dataType, params = {} } = data;
        
        switch (dataType) {
          case 'user_profile':
            return await restApiService.apiRequest(`/users/${params.userId}/profile`);
          
          case 'mood_history':
            return await restApiService.apiRequest(`/users/${params.userId}/moods`, {
              method: 'GET',
              params: {
                period: params.period || '30days'
              }
            });
          
          case 'mood_analytics':
            return await restApiService.apiRequest(`/users/${params.userId}/mood-analytics`, {
              method: 'GET',
              params: {
                timeRange: params.timeRange || 30,
                includeCorrelations: params.includeCorrelations || true
              }
            });
          
          case 'community_feed':
            return await restApiService.apiRequest('/community/feed', {
              method: 'GET',
              params: {
                limit: params.limit || 20,
                offset: params.offset || 0,
                filter: params.filter || 'all'
              }
            });
          
          default:
            throw new Error(`Unsupported data type: ${dataType}`);
        }
      }
      
      default:
        throw new Error(`Unsupported REST message type: ${type}`);
    }
  } catch (error) {
    console.error(`REST message error (${type}):`, error);
    throw error;
  }
};

/**
 * Queue a message for offline processing
 * @param {Object} message - The message to queue
 * @returns {Object} Status object
 */
const queueMessage = (message) => {
  // Skip non-important messages when offline
  const skipTypes = ['ping', 'pong', 'presence', 'fetch'];
  if (skipTypes.includes(message.type)) {
    return { status: 'skipped', reason: 'Non-essential message skipped when offline' };
  }
  
  // Add to queue
  queuedMessages.push({
    message,
    timestamp: Date.now()
  });
  
  // Store in offline storage if available
  if (FEATURES.ENABLE_OFFLINE_SUPPORT) {
    offlineStorage.queueAction({
      type: message.type,
      data: message,
      timestamp: Date.now()
    });
  }
  
  return { status: 'queued', message: 'Message queued for later delivery' };
};

/**
 * Load offline queue from storage
 */
const loadOfflineQueue = async () => {
  if (!FEATURES.ENABLE_OFFLINE_SUPPORT) return;
  
  try {
    const pendingActions = await offlineStorage.getPendingActions();
    
    // Add to memory queue
    pendingActions.forEach(action => {
      queuedMessages.push({
        message: action.data,
        timestamp: action.timestamp,
        id: action.id
      });
    });
    
    console.log(`Loaded ${pendingActions.length} pending actions from offline storage`);
  } catch (error) {
    console.error('Failed to load offline queue:', error);
  }
};

/**
 * Process the offline queue when online
 */
const processOfflineQueue = async () => {
  if (queuedMessages.length === 0) return;
  
  console.log(`Processing ${queuedMessages.length} queued messages`);
  
  // Process in order (oldest first)
  const sortedQueue = [...queuedMessages].sort((a, b) => a.timestamp - b.timestamp);
  
  // Clear queue before processing to avoid duplication if new messages come in
  queuedMessages = [];
  
  for (const item of sortedQueue) {
    try {
      console.log(`Processing queued message: ${item.message.type}`);
      await sendMessage(item.message);
      
      // Mark as processed in offline storage
      if (FEATURES.ENABLE_OFFLINE_SUPPORT && item.id) {
        await offlineStorage.updateActionStatus(item.id, 'completed');
      }
    } catch (error) {
      console.error(`Failed to process queued message (${item.message.type}):`, error);
      
      // Mark as failed in offline storage
      if (FEATURES.ENABLE_OFFLINE_SUPPORT && item.id) {
        await offlineStorage.updateActionStatus(item.id, 'failed');
      }
    }
  }
};

/**
 * Register a handler for a specific message type
 * @param {string} messageType - The type of message to handle
 * @param {Function} handler - Handler function
 * @returns {Function} Function to unregister the handler
 */
export const registerMessageHandler = (messageType, handler) => {
  if (!messageHandlers.has(messageType)) {
    messageHandlers.set(messageType, []);
  }
  
  messageHandlers.get(messageType).push(handler);
  
  // Set up GraphQL subscription if using GraphQL
  if (shouldUseGraphQL(messageType)) {
    setupGraphQLSubscription(messageType);
  }
  
  // Return function to unregister handler
  return () => {
    const handlers = messageHandlers.get(messageType) || [];
    messageHandlers.set(
      messageType,
      handlers.filter(h => h !== handler)
    );
  };
};

/**
 * Set up GraphQL subscription for a message type
 * @param {string} messageType - The type of message
 */
const setupGraphQLSubscription = (messageType) => {
  // Skip if GraphQL not enabled for this message type
  if (!shouldUseGraphQL(messageType)) return;
  
  // Skip if already subscribed
  if (graphqlClient.hasSubscription(messageType)) return;
  
  // Set up appropriate subscription based on message type
  switch (messageType) {
    case 'hug_received': {
      const subscription = `
        subscription OnHugReceived {
          hugReceived {
            id
            type
            message
            senderId
            recipientId
            createdAt
          }
        }
      `;
      
      graphqlClient.subscribe(
        subscription,
        {},
        (data) => {
          handleIncomingMessage({
            type: 'hug_received',
            hug: data.hugReceived
          });
        },
        (error) => {
          console.error('Hug subscription error:', error);
        }
      );
      break;
    }
    
    case 'mood_update': {
      const subscription = `
        subscription OnMoodUpdated {
          moodUpdated {
            userId
            mood {
              id
              value
              score
              note
              isPublic
              createdAt
            }
          }
        }
      `;
      
      graphqlClient.subscribe(
        subscription,
        {},
        (data) => {
          handleIncomingMessage({
            type: 'mood_update',
            userId: data.moodUpdated.userId,
            mood: data.moodUpdated.mood
          });
        },
        (error) => {
          console.error('Mood subscription error:', error);
        }
      );
      break;
    }
    
    case 'hug_request': {
      const subscription = `
        subscription OnHugRequested {
          hugRequested {
            id
            userId
            message
            mood
            isPublic
            createdAt
          }
        }
      `;
      
      graphqlClient.subscribe(
        subscription,
        {},
        (data) => {
          handleIncomingMessage({
            type: 'hug_request',
            request: data.hugRequested
          });
        },
        (error) => {
          console.error('Hug request subscription error:', error);
        }
      );
      break;
    }
    
    // Add more subscriptions as needed
  }
};

/**
 * Get the expected response type for a message type
 * @param {string} messageType - Type of message
 * @returns {string} Response message type
 */
const getResponseType = (messageType) => {
  switch (messageType) {
    case 'authenticate': return 'auth_response';
    case 'register': return 'registration_response';
    case 'login': return 'auth_response';
    case 'update_mood': return 'mood_update_response';
    case 'send_hug': return 'send_hug_response';
    case 'request_hug': return 'request_hug_response';
    case 'fetch': return 'fetch_response';
    default: return `${messageType}_response`;
  }
};

/**
 * Authenticate with the server
 * @returns {Promise<Object>} Authentication result
 */
export const authenticate = async () => {
  if (!isAuthenticated()) {
    return { authenticated: false };
  }
  
  const token = getToken();
  
  return sendMessage({
    type: 'authenticate',
    token,
    method: 'token'
  });
};

/**
 * Fetch data with offline support
 * @param {string} dataType - Type of data to fetch
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Fetched data
 */
export const fetchData = async (dataType, params = {}) => {
  try {
    // Try GraphQL if enabled for this data type
    if (shouldUseGraphQL(dataType)) {
      return await fetchDataGraphQL(dataType, params);
    }
    
    // Fall back to WebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
      return await sendWebSocketMessage({
        type: 'fetch',
        dataType,
        params
      });
    }
    
    // Fall back to REST if enabled
    if (FEATURES.USE_REST_FALLBACK) {
      return await sendRESTMessage({
        type: 'fetch',
        dataType,
        params
      });
    }
    
    throw new Error('No available communication method for fetching data');
  } catch (error) {
    console.error(`Error fetching ${dataType}:`, error);
    
    // Try to get from offline storage
    if (FEATURES.ENABLE_OFFLINE_SUPPORT) {
      const cachedData = await offlineStorage.getUserData(dataType);
      if (cachedData) {
        console.log(`Using cached data for ${dataType}`);
        return {
          type: 'fetch_response',
          dataType,
          data: cachedData,
          source: 'cache'
        };
      }
    }
    
    throw error;
  }
};

/**
 * Fetch data using GraphQL
 */
async function fetchDataGraphQL(dataType, params) {
  switch (dataType) {
    case 'user_profile': {
      const query = `
        query GetUserProfile($userId: ID!) {
          userProfile(userId: $userId) {
            user {
              id
              username
              displayName
              avatarUrl
              createdAt
            }
            moods {
              id
              value
              score
              createdAt
            }
            moodStreak {
              currentStreak
              longestStreak
            }
            sentHugs {
              id
              type
              createdAt
            }
            receivedHugs {
              id
              type
              createdAt
            }
          }
        }
      `;
      
      const result = await graphqlClient.query(query, { userId: params.userId });
      
      return {
        type: 'fetch_response',
        dataType,
        data: result.userProfile
      };
    }
    
    case 'mood_history': {
      const query = `
        query GetMoodHistory($userId: ID!, $period: String) {
          moodHistory(userId: $userId, period: $period) {
            days {
              date
              value
              score
              note
            }
            summary {
              averageScore
              moodFrequency {
                mood
                count
                percentage
              }
              startDate
              endDate
            }
          }
        }
      `;
      
      const variables = {
        userId: params.userId,
        period: params.period || '30days'
      };
      
      const result = await graphqlClient.query(query, variables);
      
      return {
        type: 'fetch_response',
        dataType,
        data: result.moodHistory
      };
    }
    
    case 'mood_analytics': {
      const query = `
        query GetMoodAnalytics($userId: ID!, $timeRange: Int, $includeCorrelations: Boolean) {
          moodAnalytics(userId: $userId, timeRange: $timeRange, includeCorrelations: $includeCorrelations) {
            statistics {
              totalEntries
              uniqueMoods
              currentStreak
              longestStreak
              averageScore
              moodVariability
              dominantMood
              improvementTrend
            }
            metrics {
              moodFrequency
              moodByDayOfWeek {
                day
                average
                count
              }
              moodByTimeOfDay {
                period
                average
                count
              }
            }
            correlations @include(if: $includeCorrelations) {
              activities
              sleep
              weather
              screenTime
            }
            insights {
              id
              type
              title
              description
              priority
            }
            recommendations {
              type
              title
              description
              priority
            }
          }
        }
      `;
      
      const variables = {
        userId: params.userId,
        timeRange: params.timeRange || 30,
        includeCorrelations: params.includeCorrelations !== false
      };
      
      const result = await graphqlClient.query(query, variables);
      
      return {
        type: 'fetch_response',
        dataType,
        data: result.moodAnalytics
      };
    }
    
    case 'community_feed': {
      const query = `
        query GetCommunityFeed($limit: Int, $offset: Int) {
          communityFeed(limit: $limit, offset: $offset) {
            items {
              type
              createdAt
              ... on MoodFeedItem {
                mood {
                  id
                  value
                  note
                  userId
                  createdAt
                }
              }
              ... on HugFeedItem {
                hug {
                  id
                  type
                  senderId
                  recipientId
                  createdAt
                }
              }
            }
            hasMore
          }
        }
      `;
      
      const variables = {
        limit: params.limit || 20,
        offset: params.offset || 0
      };
      
      const result = await graphqlClient.query(query, variables);
      
      return {
        type: 'fetch_response',
        dataType,
        data: result.communityFeed
      };
    }
    
    case 'wellness_dashboard': {
      const query = `
        query GetWellnessDashboard($userId: ID!) {
          wellnessDashboard(userId: $userId) {
            user {
              id
              username
              displayName
            }
            streak {
              currentStreak
              longestStreak
            }
            insights {
              id
              type
              title
              description
              priority
              isRead
            }
            analytics {
              statistics {
                totalEntries
                averageScore
                dominantMood
                improvementTrend
              }
            }
            recentActivities {
              id
              activityType
              duration
              createdAt
            }
          }
        }
      `;
      
      const result = await graphqlClient.query(query, { userId: params.userId });
      
      return {
        type: 'fetch_response',
        dataType,
        data: result.wellnessDashboard
      };
    }
    
    default:
      throw new Error(`Unsupported GraphQL data type: ${dataType}`);
  }
}

/**
 * Get the service for a data type
 */
function getServiceForDataType(dataType) {
  if (dataType.startsWith('mood_')) return 'mood';
  if (dataType.startsWith('hug_')) return 'hug';
  if (dataType.startsWith('user_')) return 'user';
  if (dataType === 'community_feed') return 'social';
  if (dataType === 'wellness_dashboard') return 'wellness';
  return 'unknown';
}

/**
 * Get connection status information
 * @returns {Object} Connection status
 */
export const getConnectionStatus = () => {
  return {
    online: isConnected,
    websocket: ws ? ws.readyState === WebSocket.OPEN : false,
    graphql: isUsingGraphQL(),
    restFallback: FEATURES.USE_REST_FALLBACK,
    offlineSupport: FEATURES.ENABLE_OFFLINE_SUPPORT,
    queuedMessages: queuedMessages.length
  };
};