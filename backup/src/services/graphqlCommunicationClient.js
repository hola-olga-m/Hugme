/**
 * GraphQL Communication Client
 * 
 * A comprehensive client for communicating with the GraphQL API,
 * completely replacing WebSocket-based communication.
 */

import { getToken } from './authService';
import * as offlineStorage from './offlineStorage';

// Events that can be subscribed to
export const EVENTS = {
  MOOD_UPDATED: 'MOOD_UPDATED',
  HUG_RECEIVED: 'HUG_RECEIVED',
  HUG_REQUEST_CREATED: 'HUG_REQUEST_CREATED',
  USER_STATUS_CHANGED: 'USER_STATUS_CHANGED',
  STREAK_MILESTONE_REACHED: 'STREAK_MILESTONE_REACHED',
  BADGE_EARNED: 'BADGE_EARNED',
  GROUP_HUG_UPDATED: 'GROUP_HUG_UPDATED',
  CONNECTION_STATUS_CHANGED: 'CONNECTION_STATUS_CHANGED'
};

// Connection states
export const CONNECTION_STATES = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting'
};

// Base GraphQL API URL
const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL || '/graphql';
const SUBSCRIPTION_URL = process.env.REACT_APP_SUBSCRIPTION_URL || 'ws://localhost:4000/graphql';

// Internal state
let connectionStatus = CONNECTION_STATES.DISCONNECTED;
let authToken = null;
let eventHandlers = {};
let subscriptions = {};
let wsClient = null;
let reconnectAttempts = 0;
let reconnectTimer = null;
let isOffline = false;
let offlineQueue = [];
let pollingIntervals = {};
let lastEventTimestamps = {};

/**
 * Initialize the GraphQL communication client
 * @param {Object} options - Configuration options
 */
export const initialize = (options = {}) => {
  authToken = getToken();
  
  // Set up the WebSocket client for subscriptions
  if (options.useSubscriptions !== false) {
    initializeWebSocketClient();
  }
  
  // Set up network status listeners
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  isOffline = !navigator.onLine;
  
  if (isOffline) {
    connectionStatus = CONNECTION_STATES.DISCONNECTED;
    notifyConnectionStatusChange();
    
    // Load offline queue
    loadOfflineQueue();
  } else {
    // Start in connecting state
    connectionStatus = CONNECTION_STATES.CONNECTING;
    notifyConnectionStatusChange();
  }
  
  // Use polling as fallback for subscriptions
  if (options.usePollFallback !== false) {
    initializePolling();
  }
};

/**
 * Initialize WebSocket client for GraphQL subscriptions
 */
function initializeWebSocketClient() {
  try {
    // In a production app, we would use a proper GraphQL subscription client
    // like subscriptions-transport-ws or graphql-ws
    // For this example, we use a simplified version
    
    wsClient = new WebSocket(SUBSCRIPTION_URL);
    
    wsClient.onopen = () => {
      console.log('Subscription WebSocket connected');
      connectionStatus = CONNECTION_STATES.CONNECTED;
      notifyConnectionStatusChange();
      reconnectAttempts = 0;
      
      // Authenticate the connection
      if (authToken) {
        wsClient.send(JSON.stringify({
          type: 'connection_init',
          payload: { authToken }
        }));
      }
      
      // Resubscribe to all active subscriptions
      resubscribeAll();
    };
    
    wsClient.onclose = () => {
      console.log('Subscription WebSocket disconnected');
      connectionStatus = CONNECTION_STATES.DISCONNECTED;
      notifyConnectionStatusChange();
      
      // Try to reconnect
      scheduleReconnect();
    };
    
    wsClient.onerror = (error) => {
      console.error('Subscription WebSocket error:', error);
      connectionStatus = CONNECTION_STATES.DISCONNECTED;
      notifyConnectionStatusChange();
    };
    
    wsClient.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleSubscriptionMessage(message);
      } catch (error) {
        console.error('Error parsing subscription message:', error);
      }
    };
  } catch (error) {
    console.error('Failed to initialize WebSocket client:', error);
    // Fall back to polling
    initializePolling();
  }
}

/**
 * Handle subscription messages from the server
 * @param {Object} message - Message from the server
 */
function handleSubscriptionMessage(message) {
  if (message.type === 'data' && message.payload && message.payload.data) {
    // Extract subscription data and topic
    const data = message.payload.data;
    const topic = Object.keys(data)[0];
    
    // Find appropriate handler
    if (eventHandlers[topic]) {
      // Call all handlers for this topic
      eventHandlers[topic].forEach(handler => {
        handler(data[topic]);
      });
      
      // Update last event timestamp
      lastEventTimestamps[topic] = Date.now();
    }
  } else if (message.type === 'connection_ack') {
    console.log('Subscription connection acknowledged');
  } else if (message.type === 'error') {
    console.error('Subscription error:', message.payload);
  }
}

/**
 * Initialize polling for GraphQL subscriptions
 * as a fallback when WebSocket is not available
 */
function initializePolling() {
  // Set up polling intervals for different event types
  setupPollingForEvent(EVENTS.MOOD_UPDATED, 30000);
  setupPollingForEvent(EVENTS.HUG_RECEIVED, 15000);
  setupPollingForEvent(EVENTS.HUG_REQUEST_CREATED, 20000);
  setupPollingForEvent(EVENTS.USER_STATUS_CHANGED, 60000);
  setupPollingForEvent(EVENTS.STREAK_MILESTONE_REACHED, 60000);
  setupPollingForEvent(EVENTS.BADGE_EARNED, 60000);
}

/**
 * Set up polling for a specific event type
 * @param {string} eventType - The event type to poll for
 * @param {number} interval - Polling interval in milliseconds
 */
function setupPollingForEvent(eventType, interval) {
  if (pollingIntervals[eventType]) {
    clearInterval(pollingIntervals[eventType]);
  }
  
  // Set the initial timestamp
  if (!lastEventTimestamps[eventType]) {
    lastEventTimestamps[eventType] = Date.now();
  }
  
  pollingIntervals[eventType] = setInterval(() => {
    if (isOffline || connectionStatus === CONNECTION_STATES.CONNECTED) {
      return; // Don't poll if offline or if we have a WebSocket connection
    }
    
    // Poll for new events since the last timestamp
    pollForEvents(eventType, lastEventTimestamps[eventType]);
  }, interval);
}

/**
 * Poll for events of a specific type
 * @param {string} eventType - The event type to poll for
 * @param {number} since - Timestamp to fetch events since
 */
async function pollForEvents(eventType, since) {
  try {
    // Skip if we're offline
    if (isOffline) return;
    
    // Map event types to appropriate query operations
    const operations = {
      [EVENTS.MOOD_UPDATED]: { query: 'getMoodUpdates', variables: { since } },
      [EVENTS.HUG_RECEIVED]: { query: 'getHugUpdates', variables: { since } },
      [EVENTS.HUG_REQUEST_CREATED]: { query: 'getHugRequestUpdates', variables: { since } },
      [EVENTS.USER_STATUS_CHANGED]: { query: 'getUserStatusUpdates', variables: { since } },
      [EVENTS.STREAK_MILESTONE_REACHED]: { query: 'getStreakUpdates', variables: { since } },
      [EVENTS.BADGE_EARNED]: { query: 'getBadgeUpdates', variables: { since } }
    };
    
    const operation = operations[eventType];
    if (!operation) return;
    
    // Execute the appropriate query
    const result = await executeGraphQLOperation('query', operation.query, operation.variables);
    
    if (result && result.data) {
      const data = result.data[operation.query];
      
      // Update timestamp
      lastEventTimestamps[eventType] = Date.now();
      
      // Notify handlers if we have any updates
      if (data && data.length > 0 && eventHandlers[eventType]) {
        data.forEach(item => {
          eventHandlers[eventType].forEach(handler => {
            handler(item);
          });
        });
      }
    }
  } catch (error) {
    console.error(`Error polling for ${eventType}:`, error);
  }
}

/**
 * Handle device coming online
 */
function handleOnline() {
  console.log('Device is online');
  isOffline = false;
  
  // If we have a WebSocket client, reconnect
  if (wsClient) {
    scheduleReconnect(0); // Immediate reconnect
  }
  
  // Process offline queue
  processOfflineQueue();
  
  connectionStatus = CONNECTION_STATES.CONNECTING;
  notifyConnectionStatusChange();
}

/**
 * Handle device going offline
 */
function handleOffline() {
  console.log('Device is offline');
  isOffline = true;
  
  // Close WebSocket connection if it exists
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    wsClient.close();
  }
  
  connectionStatus = CONNECTION_STATES.DISCONNECTED;
  notifyConnectionStatusChange();
}

/**
 * Schedule a reconnection attempt
 * @param {number} delay - Delay in milliseconds before reconnecting
 */
function scheduleReconnect(delay) {
  // Clear any existing reconnect timer
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }
  
  // Implement exponential backoff for reconnection attempts
  const backoffDelay = delay !== undefined ? delay : Math.min(30000, 1000 * Math.pow(1.5, reconnectAttempts));
  
  console.log(`Scheduling reconnect in ${backoffDelay}ms (attempt ${reconnectAttempts + 1})`);
  
  reconnectTimer = setTimeout(() => {
    connectionStatus = CONNECTION_STATES.RECONNECTING;
    notifyConnectionStatusChange();
    
    reconnectAttempts++;
    initializeWebSocketClient();
  }, backoffDelay);
}

/**
 * Resubscribe to all active subscriptions
 */
function resubscribeAll() {
  Object.keys(subscriptions).forEach(id => {
    const sub = subscriptions[id];
    subscribe(sub.query, sub.variables, sub.id);
  });
}

/**
 * Subscribe to a GraphQL subscription
 * @param {string} query - GraphQL subscription query
 * @param {Object} variables - Variables for the subscription
 * @param {string} id - Subscription ID
 */
function subscribe(query, variables, id) {
  if (!wsClient || wsClient.readyState !== WebSocket.OPEN) {
    console.warn('Cannot subscribe, WebSocket not connected');
    return;
  }
  
  wsClient.send(JSON.stringify({
    id,
    type: 'start',
    payload: {
      query,
      variables
    }
  }));
}

/**
 * Unsubscribe from a GraphQL subscription
 * @param {string} id - Subscription ID
 */
function unsubscribe(id) {
  if (wsClient && wsClient.readyState === WebSocket.OPEN) {
    wsClient.send(JSON.stringify({
      id,
      type: 'stop'
    }));
  }
  
  delete subscriptions[id];
}

/**
 * Process the offline message queue
 */
async function processOfflineQueue() {
  if (offlineQueue.length === 0) return;
  
  console.log(`Processing offline queue (${offlineQueue.length} items)`);
  
  // Process queue in FIFO order
  const queue = [...offlineQueue];
  offlineQueue = [];
  
  for (const item of queue) {
    try {
      await sendMessage(item.message);
      
      // Mark item as processed in offline storage
      await offlineStorage.updateActionStatus(item.id, 'completed');
    } catch (error) {
      console.error('Error processing offline queue item:', error);
      
      // Re-queue if it's a network error
      if (error.name === 'NetworkError') {
        offlineQueue.push(item);
      } else {
        // Mark as failed for other errors
        await offlineStorage.updateActionStatus(item.id, 'failed');
      }
    }
  }
}

/**
 * Queue a message for offline processing
 * @param {Object} message - The message to queue
 * @returns {Promise<Object>} Status object
 */
async function queueMessage(message) {
  try {
    // Store in offline queue
    const actionId = await offlineStorage.queueAction({
      type: 'message',
      data: message,
      timestamp: Date.now()
    });
    
    // Add to in-memory queue
    offlineQueue.push({
      id: actionId,
      message
    });
    
    return {
      success: true,
      offline: true,
      message: 'Message queued for delivery when online'
    };
  } catch (error) {
    console.error('Error queueing message:', error);
    return {
      success: false,
      offline: true,
      error: 'Failed to queue message for offline processing'
    };
  }
}

/**
 * Load offline queue from storage
 */
async function loadOfflineQueue() {
  try {
    const pendingActions = await offlineStorage.getPendingActions();
    
    offlineQueue = pendingActions
      .filter(action => action.type === 'message')
      .map(action => ({
        id: action.id,
        message: action.data
      }));
    
    console.log(`Loaded offline queue: ${offlineQueue.length} items`);
  } catch (error) {
    console.error('Error loading offline queue:', error);
  }
}

/**
 * Notify all connection status change listeners
 */
function notifyConnectionStatusChange() {
  const event = {
    type: EVENTS.CONNECTION_STATUS_CHANGED,
    status: connectionStatus,
    timestamp: Date.now()
  };
  
  if (eventHandlers[EVENTS.CONNECTION_STATUS_CHANGED]) {
    eventHandlers[EVENTS.CONNECTION_STATUS_CHANGED].forEach(handler => {
      handler(event);
    });
  }
}

/**
 * Execute a GraphQL operation (query or mutation)
 * @param {string} operationType - Type of operation ('query' or 'mutation')
 * @param {string} operationName - Name of the operation
 * @param {Object} variables - Variables for the operation
 * @returns {Promise<Object>} Operation result
 */
async function executeGraphQLOperation(operationType, operationName, variables = {}) {
  try {
    // Skip if we're offline and this isn't being queued
    if (isOffline) {
      throw new Error('Device is offline');
    }
    
    // Get auth token
    const token = authToken || getToken();
    
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Execute the operation
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: `${operationType} ${operationName}($input: ${operationName}Input!) {
          ${operationName}(input: $input) {
            ... on ${operationName}Success {
              success
              data
            }
            ... on ${operationName}Error {
              success
              error
            }
          }
        }`,
        variables: { input: variables }
      })
    });
    
    // Parse response
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    return result;
  } catch (error) {
    console.error(`Error executing GraphQL ${operationType}:`, error);
    
    // Determine if it's a network error
    if (
      error.message === 'Failed to fetch' ||
      error.message === 'Network request failed' ||
      error.message === 'Device is offline'
    ) {
      throw new NetworkError('Network error while executing GraphQL operation');
    }
    
    throw error;
  }
}

/**
 * Send a message using GraphQL mutations
 * @param {Object} message - The message to send
 * @returns {Promise<Object>} Response or status
 */
export const sendMessage = async (message) => {
  try {
    // If offline, queue the message
    if (isOffline) {
      return await queueMessage(message);
    }
    
    // Map message types to GraphQL mutations
    const mutations = {
      'auth': 'authenticate',
      'register': 'registerUser',
      'login': 'loginUser',
      'anonymousLogin': 'createAnonymousSession',
      'tokenAuth': 'validateToken',
      'mood': 'createMood',
      'sendHug': 'sendHug',
      'requestHug': 'requestHug',
      'createGroupHug': 'createGroupHug',
      'followUser': 'followUser',
      'socialShare': 'shareToSocial',
      'fetch': 'fetchData'
    };
    
    const mutationName = mutations[message.type];
    
    if (!mutationName) {
      throw new Error(`Unknown message type: ${message.type}`);
    }
    
    // Execute the appropriate mutation
    const result = await executeGraphQLOperation('mutation', mutationName, message.data);
    
    return result.data[mutationName];
  } catch (error) {
    console.error('Error sending message:', error);
    
    // If it's a network error, queue the message
    if (error instanceof NetworkError) {
      return await queueMessage(message);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Register a handler for a specific event type
 * @param {string} eventType - The type of event to handle
 * @param {Function} handler - Handler function
 * @returns {Function} Function to unregister the handler
 */
export const registerEventHandler = (eventType, handler) => {
  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = [];
  }
  
  // Add the handler
  eventHandlers[eventType].push(handler);
  
  // Set up subscription if this is the first handler for this event type
  if (eventHandlers[eventType].length === 1) {
    setupSubscription(eventType);
  }
  
  // Return function to unregister
  return () => {
    if (!eventHandlers[eventType]) return;
    
    const index = eventHandlers[eventType].indexOf(handler);
    if (index !== -1) {
      eventHandlers[eventType].splice(index, 1);
    }
    
    // If no more handlers, unsubscribe
    if (eventHandlers[eventType].length === 0) {
      teardownSubscription(eventType);
      delete eventHandlers[eventType];
    }
  };
};

/**
 * Set up a subscription for an event type
 * @param {string} eventType - The event type
 */
function setupSubscription(eventType) {
  // Skip for connection status changes (internal event)
  if (eventType === EVENTS.CONNECTION_STATUS_CHANGED) return;
  
  // Map event types to GraphQL subscriptions
  const subscriptionQueries = {
    [EVENTS.MOOD_UPDATED]: `subscription MoodUpdated($userId: ID!) {
      moodUpdated(userId: $userId) {
        id
        value
        score
        note
        createdAt
        userId
      }
    }`,
    [EVENTS.HUG_RECEIVED]: `subscription HugReceived($userId: ID!) {
      hugReceived(userId: $userId) {
        id
        type
        message
        createdAt
        senderId
        recipientId
      }
    }`,
    [EVENTS.HUG_REQUEST_CREATED]: `subscription HugRequestCreated($isPublic: Boolean) {
      hugRequestCreated(isPublic: $isPublic) {
        id
        userId
        message
        mood
        isPublic
        status
        createdAt
      }
    }`,
    [EVENTS.USER_STATUS_CHANGED]: `subscription UserStatusChanged($userId: ID) {
      userStatusChanged(userId: $userId) {
        userId
        isOnline
        lastActive
      }
    }`,
    [EVENTS.STREAK_MILESTONE_REACHED]: `subscription StreakMilestoneReached($userId: ID!) {
      streakMilestoneReached(userId: $userId) {
        userId
        currentStreak
        milestoneLevel
        rewards {
          id
          type
          description
        }
      }
    }`,
    [EVENTS.BADGE_EARNED]: `subscription BadgeEarned($userId: ID!) {
      badgeEarned(userId: $userId) {
        userId
        badge {
          id
          name
          description
          imageUrl
          category
        }
        earnedAt
      }
    }`,
    [EVENTS.GROUP_HUG_UPDATED]: `subscription GroupHugUpdated($userId: ID!) {
      groupHugUpdated(userId: $userId) {
        id
        name
        createdAt
        creatorId
        totalParticipants
        expiresAt
        status
      }
    }`
  };
  
  const subscriptionQuery = subscriptionQueries[eventType];
  
  if (!subscriptionQuery || !wsClient || wsClient.readyState !== WebSocket.OPEN) {
    return;
  }
  
  // Create a unique ID for this subscription
  const subscriptionId = `${eventType}-${Date.now()}`;
  
  // Set up variables based on event type
  const variables = {};
  
  // For user-specific subscriptions, add userId
  if (
    eventType === EVENTS.MOOD_UPDATED ||
    eventType === EVENTS.HUG_RECEIVED ||
    eventType === EVENTS.STREAK_MILESTONE_REACHED ||
    eventType === EVENTS.BADGE_EARNED ||
    eventType === EVENTS.GROUP_HUG_UPDATED
  ) {
    // Get current user ID
    const userId = getCurrentUserId();
    if (!userId) return;
    
    variables.userId = userId;
  }
  
  // For public/private hug requests
  if (eventType === EVENTS.HUG_REQUEST_CREATED) {
    variables.isPublic = true; // Default to public requests
  }
  
  // Store subscription
  subscriptions[subscriptionId] = {
    id: subscriptionId,
    eventType,
    query: subscriptionQuery,
    variables
  };
  
  // Start the subscription
  subscribe(subscriptionQuery, variables, subscriptionId);
}

/**
 * Tear down a subscription for an event type
 * @param {string} eventType - The event type
 */
function teardownSubscription(eventType) {
  // Find all subscriptions for this event type
  const subsToRemove = Object.keys(subscriptions).filter(
    id => subscriptions[id].eventType === eventType
  );
  
  // Unsubscribe from each
  subsToRemove.forEach(id => {
    unsubscribe(id);
  });
}

/**
 * Get the current user ID
 * @returns {string|null} The current user ID
 */
function getCurrentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user && user.id;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
}

/**
 * Fetch data using GraphQL queries
 * @param {string} dataType - Type of data to fetch
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Fetched data
 */
export const fetchData = async (dataType, params = {}) => {
  try {
    // If offline, try to get from cache
    if (isOffline) {
      const cachedData = await offlineStorage.getUserData(dataType);
      if (cachedData) {
        return {
          success: true,
          offline: true,
          data: cachedData
        };
      }
      
      return {
        success: false,
        offline: true,
        error: 'Data not available offline'
      };
    }
    
    // Map data types to GraphQL queries
    const queries = {
      'profile': 'getUserProfile',
      'moods': 'getMoodHistory',
      'analytics': 'getMoodAnalytics',
      'hugs': 'getUserHugs',
      'badges': 'getUserBadges',
      'streak': 'getUserStreak',
      'feed': 'getCommunityFeed'
    };
    
    const queryName = queries[dataType];
    
    if (!queryName) {
      throw new Error(`Unknown data type: ${dataType}`);
    }
    
    // Execute the appropriate query
    const result = await executeGraphQLOperation('query', queryName, params);
    
    // Cache successful results for offline use
    if (result.data && result.data[queryName].success) {
      await offlineStorage.storeUserData(dataType, result.data[queryName].data);
    }
    
    return result.data[queryName];
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // If offline, try to get from cache
    if (error instanceof NetworkError) {
      const cachedData = await offlineStorage.getUserData(dataType);
      if (cachedData) {
        return {
          success: true,
          offline: true,
          data: cachedData
        };
      }
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get current connection status
 * @returns {Object} Connection status
 */
export const getConnectionStatus = () => {
  return {
    status: connectionStatus,
    isOffline
  };
};

/**
 * Set authentication token
 * @param {string} token - Authentication token
 */
export const setAuthToken = (token) => {
  authToken = token;
  
  // Reconnect WebSocket with new token if connected
  if (wsClient && wsClient.readyState === WebSocket.OPEN && token) {
    wsClient.send(JSON.stringify({
      type: 'connection_init',
      payload: { authToken: token }
    }));
  }
};

/**
 * Clean up resources
 */
export const cleanup = () => {
  // Remove event listeners
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
  
  // Clear polling intervals
  Object.values(pollingIntervals).forEach(interval => {
    clearInterval(interval);
  });
  
  // Clear reconnect timer
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }
  
  // Close WebSocket
  if (wsClient) {
    wsClient.close();
  }
  
  // Clear subscriptions
  subscriptions = {};
  
  // Clear event handlers
  eventHandlers = {};
};

// Custom NetworkError class
class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

export default {
  initialize,
  sendMessage,
  fetchData,
  registerEventHandler,
  getConnectionStatus,
  setAuthToken,
  cleanup,
  EVENTS,
  CONNECTION_STATES
};