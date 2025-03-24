/**
 * Communication Service
 * 
 * Provides a unified API for all communication with the server,
 * with support for WebSockets, REST API, and offline functionality.
 */

import connectionManager from './connectionManager';
import { 
  storeUserData, 
  getUserData, 
  queueAction, 
  getPendingActions, 
  updateActionStatus,
  getCachedApiResponse,
  cacheApiResponse 
} from './offlineStorage';
import { getToken, getCurrentUser } from './authService';

/**
 * Initialize the communication service
 */
export const initialize = () => {
  // Initialize connection manager
  connectionManager.initialize();
  
  // Process any pending actions from previous sessions
  processPendingActions();
  
  // Set up event listeners
  connectionManager.addListener(handleConnectionEvent);
  
  return true;
};

/**
 * Handle connection events
 * @param {Object} event - Connection event
 */
const handleConnectionEvent = (event) => {
  console.log('Connection event:', event);
  
  if (event.type === 'connection' && event.status === 'online') {
    // Process any pending actions when we come back online
    processPendingActions();
  }
  
  if (event.type === 'message') {
    // Process incoming message
    processIncomingMessage(event.data);
  }
};

/**
 * Process incoming messages from server
 * @param {Object} message - The message from the server
 */
const processIncomingMessage = (message) => {
  const { type } = message;
  
  // Parse the message based on type
  switch (type) {
    case 'auth_success':
      console.log('Authentication successful');
      // Request initial data
      requestInitialData();
      break;
      
    case 'hugs_data':
    case 'hug_requests_data':
    case 'group_hugs_data':
    case 'mood_history_data':
    case 'following_data':
    case 'followers_data':
    case 'badges_data':
    case 'hug_types_data':
    case 'contacts_data':
    case 'status_tags_data':
    case 'notification_settings_data':
      // Cache data for offline use
      const dataType = type.replace('_data', '');
      storeUserData(dataType, message[dataType] || message);
      break;
      
    case 'hug_received':
    case 'hug_requested':
    case 'community_hug_requested':
    case 'group_hug_invitation':
    case 'new_follower':
    case 'friend_mood_update':
    case 'badge_awarded':
      // Store these events too as they update app state
      storeUserData(`event_${type}`, message);
      break;
      
    default:
      console.log('Received message of type:', type);
  }
  
  // Dispatch message to any registered handlers
  if (messageHandlers[type]) {
    messageHandlers[type].forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error(`Error in message handler for ${type}:`, error);
      }
    });
  }
};

/**
 * Send a message to the server
 * @param {Object} message - The message to send
 * @param {string} preferredMethod - Preferred method ('websocket', 'rest', 'auto')
 * @returns {Promise<Object>} Response or status
 */
export const sendMessage = async (message, preferredMethod = 'auto') => {
  try {
    const result = await connectionManager.send(message, preferredMethod);
    return result;
  } catch (error) {
    console.error('Error sending message:', error);
    
    // If we're offline, queue the message for later
    if (!navigator.onLine) {
      await queueAction({
        message,
        type: message.type,
        method: preferredMethod
      });
      
      console.log('Message queued for offline processing');
      return { queued: true };
    }
    
    throw error;
  }
};

/**
 * Process any pending actions when coming back online
 */
const processPendingActions = async () => {
  const pendingActions = await getPendingActions();
  
  if (pendingActions.length === 0) {
    console.log('No pending actions to process');
    return;
  }
  
  console.log(`Processing ${pendingActions.length} pending actions`);
  
  for (const action of pendingActions) {
    try {
      const result = await connectionManager.send(
        action.message, 
        action.method
      );
      
      await updateActionStatus(action.id, 'completed');
      console.log('Action processed successfully:', action.type);
    } catch (error) {
      console.error('Error processing queued action:', error);
      await updateActionStatus(action.id, 'failed');
    }
  }
};

/**
 * Request initial data after authentication
 */
const requestInitialData = async () => {
  const dataTypes = [
    'hugs',
    'hug_requests',
    'group_hugs',
    'mood_history',
    'following',
    'followers',
    'badges',
    'hug_types',
    'contacts',
    'status_tags',
    'notification_settings'
  ];
  
  for (const dataType of dataTypes) {
    await sendMessage({
      type: 'fetch_data',
      data: { dataType }
    });
  }
};

// Message handlers registry
const messageHandlers = {};

/**
 * Register a handler for a specific message type
 * @param {string} messageType - The type of message to handle
 * @param {Function} handler - Handler function
 * @returns {Function} Function to unregister the handler
 */
export const registerMessageHandler = (messageType, handler) => {
  if (!messageHandlers[messageType]) {
    messageHandlers[messageType] = [];
  }
  
  messageHandlers[messageType].push(handler);
  
  return () => {
    if (messageHandlers[messageType]) {
      messageHandlers[messageType] = messageHandlers[messageType].filter(h => h !== handler);
    }
  };
};

/**
 * Authenticate with the server
 * @returns {Promise<Object>} Authentication result
 */
export const authenticate = async () => {
  const token = getToken();
  
  if (!token) {
    console.log('No authentication token available');
    return { authenticated: false };
  }
  
  const user = getCurrentUser();
  
  try {
    const result = await sendMessage({
      type: 'authenticate',
      userId: user?.id,
      token
    });
    
    return { authenticated: true, ...result };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, error };
  }
};

/**
 * Fetch data with offline support
 * @param {string} dataType - Type of data to fetch
 * @returns {Promise<Object>} Fetched data
 */
export const fetchData = async (dataType) => {
  try {
    // First try to get from offline storage
    const offlineData = await getUserData(dataType);
    
    // If we're offline and have cached data, use that
    if (!navigator.onLine && offlineData) {
      console.log(`Using offline data for ${dataType}`);
      return offlineData;
    }
    
    // If we're online, fetch fresh data
    if (navigator.onLine) {
      const result = await sendMessage({
        type: 'fetch_data',
        data: { dataType }
      });
      
      // If this is an immediate REST response (not WebSocket), store it
      if (result && result.data) {
        await storeUserData(dataType, result.data);
        return result.data;
      }
      
      // If we have offline data, return it while waiting for WebSocket update
      if (offlineData) {
        return offlineData;
      }
    }
    
    // If we're offline and have no cached data, return empty data
    return dataType.endsWith('s') ? [] : {};
  } catch (error) {
    console.error(`Error fetching ${dataType}:`, error);
    
    // If we have offline data, return that on error
    const offlineData = await getUserData(dataType);
    if (offlineData) {
      return offlineData;
    }
    
    // Otherwise return empty data
    return dataType.endsWith('s') ? [] : {};
  }
};

/**
 * Make REST API request with caching support
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @param {Object} cacheOptions - Caching options
 * @returns {Promise<Object>} Response data
 */
export const apiRequest = async (endpoint, options = {}, cacheOptions = {}) => {
  const {
    method = 'GET',
    body,
    headers = {},
    ...fetchOptions
  } = options;
  
  const {
    useCache = true,
    cacheTTL = 3600000, // 1 hour
    forceRefresh = false
  } = cacheOptions;
  
  const url = `${options.baseUrl || '/api'}${endpoint}`;
  
  // Check cache first if it's a GET request and caching is enabled
  if (method === 'GET' && useCache && !forceRefresh) {
    const cachedResponse = await getCachedApiResponse(url);
    if (cachedResponse) {
      console.log(`Using cached response for ${url}`);
      return cachedResponse;
    }
  }
  
  // If offline and no cached data, throw error for non-GET requests
  if (!navigator.onLine && method !== 'GET') {
    // Queue for later if it's a write operation
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      await queueAction({
        type: 'api_request',
        method,
        url,
        body,
        headers
      });
      
      console.log(`Queued ${method} request to ${url} for offline processing`);
      return { queued: true };
    }
    
    throw new Error('Unable to perform operation offline');
  }
  
  // Add auth token to headers
  const token = getToken();
  const authHeaders = token 
    ? { 'Authorization': `Bearer ${token}` }
    : {};
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      ...fetchOptions
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache GET responses
    if (method === 'GET' && useCache) {
      await cacheApiResponse(url, data, cacheTTL);
    }
    
    return data;
  } catch (error) {
    console.error(`API request error for ${method} ${url}:`, error);
    
    // For GET requests, try to return cached data even if expired
    if (method === 'GET' && useCache) {
      const cachedResponse = await getCachedApiResponse(url, false);
      if (cachedResponse) {
        console.log(`Using expired cached response for ${url} due to error`);
        return {
          ...cachedResponse,
          _cached: true,
          _error: error.message
        };
      }
    }
    
    throw error;
  }
};

// Mood Tracking API

/**
 * Update user mood
 * @param {string} userId - User ID
 * @param {string} mood - Mood value
 * @param {string} note - Optional note
 * @param {boolean} isPublic - Whether mood is public
 * @returns {Promise<Object>} Result 
 */
export const updateMood = async (userId, mood, note = null, isPublic = false) => {
  const timestamp = new Date().toISOString();
  
  const moodData = {
    userId,
    mood,
    intensity: 5, // On a scale of 1-10
    note,
    isPublic,
    timestamp
  };
  
  // Optimistically update the local state
  await storeUserData('mood_update', {
    userId,
    mood: moodData,
    timestamp
  });
  
  return sendMessage({
    type: 'mood_update',
    data: moodData
  });
};

// Hug APIs

/**
 * Send a hug to a user
 * @param {string} recipientId - Recipient user ID
 * @param {string} hugType - Type of hug
 * @param {string} message - Optional message
 * @returns {Promise<Object>} Result
 */
export const sendHug = async (recipientId, hugType, message = null) => {
  return sendMessage({
    type: 'send_hug',
    data: { recipientId, hugType, message }
  });
};

/**
 * Request a hug
 * @param {Object} requestData - Hug request data
 * @returns {Promise<Object>} Result
 */
export const requestHug = async (requestData) => {
  return sendMessage({
    type: 'request_hug',
    data: requestData
  });
};

/**
 * Respond to a hug request
 * @param {string} requestId - Request ID
 * @param {string} response - Response ('accept' or 'decline')
 * @param {string} message - Optional message
 * @returns {Promise<Object>} Result
 */
export const respondToHugRequest = async (requestId, response, message = null) => {
  if (response === 'accept') {
    return sendMessage({
      type: 'send_hug',
      data: {
        requestId,
        message
      }
    });
  } else {
    return sendMessage({
      type: 'decline_hug_request',
      data: { requestId }
    });
  }
};

// Social APIs

/**
 * Follow or unfollow a user
 * @param {string} targetUserId - User ID to follow/unfollow
 * @param {string} action - Action ('follow' or 'unfollow')
 * @returns {Promise<Object>} Result
 */
export const followUser = async (targetUserId, action = 'follow') => {
  return sendMessage({
    type: 'follow_user',
    data: { targetUserId, action }
  });
};

/**
 * Share content to social platform
 * @param {string} platform - Social platform
 * @param {Object} content - Content to share
 * @param {string} contentType - Type of content
 * @returns {Promise<Object>} Result
 */
export const shareToSocial = async (platform, content, contentType) => {
  return sendMessage({
    type: 'social_share',
    data: { platform, content, contentType }
  });
};

// Group Hug APIs

/**
 * Create a group hug
 * @param {Object} groupHugData - Group hug data
 * @returns {Promise<Object>} Result
 */
export const createGroupHug = async (groupHugData) => {
  return sendMessage({
    type: 'create_group_hug',
    data: groupHugData
  });
};

/**
 * Join a group hug
 * @param {string} groupId - Group ID
 * @returns {Promise<Object>} Result
 */
export const joinGroupHug = async (groupId) => {
  return sendMessage({
    type: 'join_group_hug',
    data: { groupId }
  });
};

/**
 * Check connection status
 * @returns {Object} Connection status
 */
export const getConnectionStatus = () => {
  return {
    online: navigator.onLine,
    websocketConnected: connectionManager.isWebSocketConnected,
    connectionQuality: connectionManager.connectionQuality
  };
};

// Initialize on module load
initialize();