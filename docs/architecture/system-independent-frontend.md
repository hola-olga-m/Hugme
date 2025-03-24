# System-Independent Frontend Architecture

## Introduction

This document outlines the architecture for HugMood's system-independent frontend, designed to work seamlessly across multiple backend implementations including WebSocket-based, REST API, and GraphQL approaches. By implementing a flexible communication layer, the frontend can adapt to different backend technologies while maintaining consistency in user experience.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                       Client Applications                           │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │                 │  │                 │  │                     │  │
│  │   Web App       │  │   Mobile App    │  │   Progressive       │  │
│  │   (React)       │  │   (React Native)│  │   Web App           │  │
│  │                 │  │                 │  │                     │  │
│  └────────┬────────┘  └────────┬────────┘  └──────────┬──────────┘  │
│           │                    │                      │             │
│           └────────────────────┼──────────────────────┘             │
│                                │                                    │
└────────────────────────────────┼────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                     Frontend Domain Layer                           │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │                 │  │                 │  │                     │  │
│  │   Contexts      │  │   Providers     │  │   Custom Hooks      │  │
│  │                 │  │                 │  │                     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │                 │  │                 │  │                     │  │
│  │   State         │  │   Reducers      │  │   Actions           │  │
│  │   Management    │  │                 │  │                     │  │
│  │                 │  │                 │  │                     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │
│                                                                     │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                   Communication Bridge Layer                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │                  Feature Flags & Routing                    │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │                 │  │                 │  │                     │  │
│  │   WebSocket     │  │   REST API      │  │   GraphQL           │  │
│  │   Client        │  │   Client        │  │   Client            │  │
│  │                 │  │                 │  │                     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │              Unified Request/Response Handling              │    │
│  │                                                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                       Service Layer                                 │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │                 │  │                 │  │                     │  │
│  │  Auth Service   │  │  User Service   │  │  Mood Service       │  │
│  │                 │  │                 │  │                     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │                 │  │                 │  │                     │  │
│  │  Hug Service    │  │  Social Service │  │  Analytics Service  │  │
│  │                 │  │                 │  │                     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │
│                                                                     │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                     Utility & Support Layer                         │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │                 │  │                 │  │                     │  │
│  │  Offline Cache  │  │  Error Handling │  │  Authentication     │  │
│  │                 │  │                 │  │                     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │                 │  │                 │  │                     │  │
│  │  Logging        │  │  Analytics      │  │  Feature Flags      │  │
│  │                 │  │                 │  │                     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. Communication Bridge Layer

The Communication Bridge is the core component that allows the frontend to interact with any backend implementation seamlessly.

#### Feature Flags & Routing

```javascript
// src/services/communicationBridge.js

/**
 * Feature flags for communication methods
 */
export const FEATURES = {
  // Core features
  AUTH: { useGraphQL: true, useREST: true, useWebSocket: false },
  USER_PROFILE: { useGraphQL: true, useREST: true, useWebSocket: false },
  MOOD_TRACKING: { useGraphQL: true, useREST: true, useWebSocket: false },
  HUGS: { useGraphQL: true, useREST: false, useWebSocket: true },
  
  // Real-time features
  NOTIFICATIONS: { useGraphQL: false, useREST: false, useWebSocket: true },
  FRIEND_STATUS: { useGraphQL: false, useREST: false, useWebSocket: true },
  MOOD_UPDATES: { useGraphQL: false, useREST: false, useWebSocket: true },
  
  // Default for unspecified features
  DEFAULT: { useGraphQL: false, useREST: true, useWebSocket: false }
};

/**
 * Check if any GraphQL feature is enabled
 * @returns {boolean} True if any GraphQL feature is enabled
 */
export const isGraphQLEnabled = () => {
  return Object.values(FEATURES).some(feature => feature.useGraphQL);
};

/**
 * Check if all communication is using GraphQL
 * @returns {boolean} True if all features use GraphQL
 */
export const isFullGraphQLMode = () => {
  return Object.values(FEATURES).every(feature => feature.useGraphQL);
};

/**
 * Check if a message type should use GraphQL based on feature flags
 * @param {string} type - Message type
 * @returns {boolean} True if this message type should use GraphQL
 */
function shouldUseGraphQL(type) {
  // Map message types to features
  const messageTypeToFeature = {
    'auth.login': 'AUTH',
    'auth.register': 'AUTH',
    'auth.logout': 'AUTH',
    'user.update': 'USER_PROFILE',
    'user.get': 'USER_PROFILE',
    'mood.update': 'MOOD_TRACKING',
    'mood.get': 'MOOD_TRACKING',
    'mood.history': 'MOOD_TRACKING',
    'hug.send': 'HUGS',
    'hug.request': 'HUGS',
    'notification.get': 'NOTIFICATIONS',
    'friend.status': 'FRIEND_STATUS',
    'mood.friend_update': 'MOOD_UPDATES'
  };
  
  const feature = messageTypeToFeature[type] || 'DEFAULT';
  return FEATURES[feature]?.useGraphQL || false;
}

/**
 * Determine which communication method to use for a message type
 * @param {string} type - Message type
 * @param {string} preferredMethod - Preferred method ('websocket', 'graphql', 'rest', 'auto')
 * @returns {string} The communication method to use
 */
export function getCommunicationMethod(type, preferredMethod = 'auto') {
  // If preferred method is specified and not 'auto', use it
  if (preferredMethod !== 'auto') {
    return preferredMethod;
  }
  
  // Map message type to feature
  const messageTypeToFeature = {
    'auth.login': 'AUTH',
    'auth.register': 'AUTH',
    'auth.logout': 'AUTH',
    'user.update': 'USER_PROFILE',
    'user.get': 'USER_PROFILE',
    'mood.update': 'MOOD_TRACKING',
    'mood.get': 'MOOD_TRACKING',
    'mood.history': 'MOOD_TRACKING',
    'hug.send': 'HUGS',
    'hug.request': 'HUGS',
    'notification.get': 'NOTIFICATIONS',
    'friend.status': 'FRIEND_STATUS',
    'mood.friend_update': 'MOOD_UPDATES'
  };
  
  const feature = messageTypeToFeature[type] || 'DEFAULT';
  const featureFlags = FEATURES[feature] || FEATURES.DEFAULT;
  
  // Check if offline
  if (!navigator.onLine) {
    return 'offline';
  }
  
  // Prioritize GraphQL if enabled for this feature
  if (featureFlags.useGraphQL) {
    return 'graphql';
  }
  
  // Use WebSocket for real-time features if enabled
  if (featureFlags.useWebSocket) {
    return 'websocket';
  }
  
  // Use REST API as default fallback
  return 'rest';
}
```

#### Unified Request/Response Handling

```javascript
// src/services/communicationBridge.js

/**
 * Send a message to the server
 * @param {Object} message - The message to send
 * @param {string} preferredMethod - Preferred method ('websocket', 'graphql', 'rest', 'auto')
 * @returns {Promise<Object>} Response or status
 */
export const sendMessage = async (message, preferredMethod = 'auto') => {
  const method = getCommunicationMethod(message.type, preferredMethod);
  
  try {
    switch (method) {
      case 'graphql':
        return await sendGraphQLMessage(message);
      case 'websocket':
        return await sendWebSocketMessage(message);
      case 'rest':
        return await sendRestMessage(message);
      case 'offline':
        return await queueOfflineMessage(message);
      default:
        return await sendRestMessage(message);
    }
  } catch (error) {
    // If the preferred method fails, try fallbacks
    console.error(`Communication error using ${method}:`, error);
    
    if (method === 'graphql') {
      console.log('Falling back to REST API');
      return await sendRestMessage(message);
    }
    
    if (method === 'websocket') {
      console.log('Falling back to REST API');
      return await sendRestMessage(message);
    }
    
    if (method === 'rest' && navigator.onLine) {
      // If REST fails and we're online, it's a server error
      throw error;
    }
    
    // If all else fails, queue for offline
    return await queueOfflineMessage(message);
  }
};

/**
 * Send a message via GraphQL
 * @param {Object} message - The message to send
 * @returns {Promise<Object>} Response data
 */
async function sendGraphQLMessage(message) {
  const operationType = getOperationTypeForMessage(message);
  const operationName = getOperationNameForMessage(message);
  const variables = getVariablesForMessage(message);
  
  if (operationType === 'query') {
    return await graphqlClient.query(operationName, variables);
  } else if (operationType === 'mutation') {
    return await graphqlClient.mutate(operationName, variables);
  } else {
    throw new Error(`Unsupported GraphQL operation type: ${operationType}`);
  }
}

/**
 * Send a message via WebSocket
 * @param {Object} message - The message to send
 * @returns {Promise<Object>} Response or status
 */
async function sendWebSocketMessage(message) {
  return new Promise((resolve, reject) => {
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      reject(new Error('WebSocket is not connected'));
      return;
    }
    
    // Generate a unique ID for this message
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    message.id = messageId;
    
    // Set up response handler for this specific message
    const responseTimeout = setTimeout(() => {
      delete pendingResponses[messageId];
      reject(new Error('WebSocket response timeout'));
    }, 30000); // 30 second timeout
    
    pendingResponses[messageId] = {
      resolve,
      reject,
      timeout: responseTimeout
    };
    
    // Send the message
    websocket.send(JSON.stringify(message));
  });
}

/**
 * Send a message via REST API
 * @param {Object} message - The message to send
 * @returns {Promise<Object>} Response data
 */
async function sendRestMessage(message) {
  const endpoint = getEndpointForMessageType(message.type);
  const method = getMethodForMessageType(message.type);
  
  const response = await fetch(`/api/v1/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: method !== 'GET' ? JSON.stringify(message.data) : undefined
  });
  
  if (!response.ok) {
    throw new Error(`REST API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Queue a message for offline processing
 * @param {Object} message - The message to queue
 * @returns {Promise<Object>} Status object
 */
async function queueOfflineMessage(message) {
  await offlineStorage.queueAction({
    id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: message.type,
    data: message.data,
    timestamp: Date.now()
  });
  
  return {
    success: true,
    offline: true,
    message: 'Message queued for offline processing'
  };
}
```

### 2. Service Layer

The Service Layer provides domain-specific APIs that abstract the underlying communication methods.

#### Example: Mood Service

```javascript
// src/services/moodService.js
import { sendMessage } from './communicationBridge';
import { offlineStorage } from './offlineStorage';

/**
 * Fetch mood history for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Mood history data
 */
export const getMoodHistory = async (userId, options = {}) => {
  try {
    const response = await sendMessage({
      type: 'mood.history',
      data: {
        userId,
        limit: options.limit || 20,
        offset: options.offset || 0,
        startDate: options.startDate,
        endDate: options.endDate
      }
    });
    
    // Cache the response for offline use
    if (response.items) {
      await offlineStorage.storeUserData('mood_history', response.items);
    }
    
    return response;
  } catch (error) {
    // If offline and we have cached data, return it
    if (!navigator.onLine) {
      const cachedData = await offlineStorage.getUserData('mood_history');
      if (cachedData) {
        return {
          items: cachedData,
          total: cachedData.length,
          offline: true
        };
      }
    }
    
    throw error;
  }
};

/**
 * Record a new mood entry
 * @param {Object} moodData - Mood data to record
 * @returns {Promise<Object>} Created mood entry
 */
export const recordMood = async (moodData) => {
  try {
    return await sendMessage({
      type: 'mood.update',
      data: moodData
    });
  } catch (error) {
    // Handle offline recording
    if (!navigator.onLine) {
      const offlineId = `offline_mood_${Date.now()}`;
      const offlineMood = {
        ...moodData,
        id: offlineId,
        createdAt: new Date().toISOString(),
        offline: true
      };
      
      // Store in offline mood list
      const existingMoods = await offlineStorage.getUserData('mood_history') || [];
      await offlineStorage.storeUserData('mood_history', [offlineMood, ...existingMoods]);
      
      // Queue for syncing when back online
      await offlineStorage.queueAction({
        type: 'mood.update',
        data: moodData,
        timestamp: Date.now(),
        offlineId
      });
      
      return offlineMood;
    }
    
    throw error;
  }
};

/**
 * Get mood analytics
 * @param {string} userId - User ID
 * @param {string} timeRange - Time range ('week', 'month', 'year')
 * @returns {Promise<Object>} Mood analytics data
 */
export const getMoodAnalytics = async (userId, timeRange = 'month') => {
  return await sendMessage({
    type: 'mood.analytics',
    data: {
      userId,
      timeRange
    }
  }, 'graphql'); // Force GraphQL for this complex query
};
```

#### Example: Hug Service

```javascript
// src/services/hugService.js
import { sendMessage } from './communicationBridge';
import { offlineStorage } from './offlineStorage';

/**
 * Send a hug to a user
 * @param {Object} hugData - Hug data
 * @returns {Promise<Object>} Sent hug data
 */
export const sendHug = async (hugData) => {
  try {
    return await sendMessage({
      type: 'hug.send',
      data: hugData
    });
  } catch (error) {
    // Handle offline sending
    if (!navigator.onLine) {
      const offlineId = `offline_hug_${Date.now()}`;
      const offlineHug = {
        ...hugData,
        id: offlineId,
        sentAt: new Date().toISOString(),
        status: 'pending',
        offline: true
      };
      
      // Store in offline sent hugs
      const existingSentHugs = await offlineStorage.getUserData('sent_hugs') || [];
      await offlineStorage.storeUserData('sent_hugs', [offlineHug, ...existingSentHugs]);
      
      // Queue for syncing when back online
      await offlineStorage.queueAction({
        type: 'hug.send',
        data: hugData,
        timestamp: Date.now(),
        offlineId
      });
      
      return offlineHug;
    }
    
    throw error;
  }
};

/**
 * Get received hugs
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Received hugs
 */
export const getReceivedHugs = async (options = {}) => {
  try {
    const response = await sendMessage({
      type: 'hug.received',
      data: {
        limit: options.limit || 20,
        offset: options.offset || 0
      }
    });
    
    // Cache the response for offline use
    if (response.items) {
      await offlineStorage.storeUserData('received_hugs', response.items);
    }
    
    return response;
  } catch (error) {
    // If offline and we have cached data, return it
    if (!navigator.onLine) {
      const cachedData = await offlineStorage.getUserData('received_hugs');
      if (cachedData) {
        return {
          items: cachedData,
          total: cachedData.length,
          offline: true
        };
      }
    }
    
    throw error;
  }
};

/**
 * Request a hug
 * @param {Object} requestData - Hug request data
 * @returns {Promise<Object>} Request result
 */
export const requestHug = async (requestData) => {
  return await sendMessage({
    type: 'hug.request',
    data: requestData
  });
};

/**
 * Set up real-time hug notifications
 * @param {Function} onHugReceived - Callback for received hugs
 * @returns {Function} Cleanup function
 */
export const setupHugNotifications = (onHugReceived) => {
  // Register for real-time updates through the bridge
  const unregister = registerMessageHandler('hug.received', (hugData) => {
    onHugReceived(hugData);
  });
  
  return unregister;
};
```

### 3. Frontend Domain Layer

This layer maintains application state and provides it to UI components.

#### Example: Mood Context

```javascript
// src/contexts/MoodContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getMoodHistory, recordMood, getMoodAnalytics } from '../services/moodService';
import { isGraphQLEnabled } from '../services/communicationBridge';

// Create the context
const MoodContext = createContext();

// Initial state
const initialState = {
  moodHistory: [],
  currentMood: null,
  analytics: null,
  isLoading: false,
  error: null
};

// Reducer for state management
function moodReducer(state, action) {
  switch (action.type) {
    case 'FETCH_MOODS_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_MOODS_SUCCESS':
      return { 
        ...state, 
        moodHistory: action.payload,
        currentMood: action.payload[0] || state.currentMood,
        isLoading: false 
      };
    case 'FETCH_MOODS_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'RECORD_MOOD_START':
      return { ...state, isLoading: true, error: null };
    case 'RECORD_MOOD_SUCCESS':
      return { 
        ...state, 
        currentMood: action.payload,
        moodHistory: [action.payload, ...state.moodHistory],
        isLoading: false 
      };
    case 'RECORD_MOOD_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'FETCH_ANALYTICS_SUCCESS':
      return { ...state, analytics: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

// Provider component
export const MoodProvider = ({ children }) => {
  const [state, dispatch] = useReducer(moodReducer, initialState);
  
  // Load initial mood history
  useEffect(() => {
    const loadMoodHistory = async () => {
      dispatch({ type: 'FETCH_MOODS_START' });
      try {
        const response = await getMoodHistory('current');
        dispatch({ type: 'FETCH_MOODS_SUCCESS', payload: response.items });
        
        // Only fetch analytics if GraphQL is enabled (more efficient)
        if (isGraphQLEnabled()) {
          const analyticsData = await getMoodAnalytics('current');
          dispatch({ type: 'FETCH_ANALYTICS_SUCCESS', payload: analyticsData });
        }
      } catch (error) {
        dispatch({ type: 'FETCH_MOODS_FAILURE', payload: error.message });
      }
    };
    
    loadMoodHistory();
  }, []);
  
  // Function to record a new mood
  const addMoodEntry = async (moodData) => {
    dispatch({ type: 'RECORD_MOOD_START' });
    try {
      const newMood = await recordMood(moodData);
      dispatch({ type: 'RECORD_MOOD_SUCCESS', payload: newMood });
      
      // Update analytics if available
      if (isGraphQLEnabled()) {
        const analyticsData = await getMoodAnalytics('current');
        dispatch({ type: 'FETCH_ANALYTICS_SUCCESS', payload: analyticsData });
      }
      
      return newMood;
    } catch (error) {
      dispatch({ type: 'RECORD_MOOD_FAILURE', payload: error.message });
      throw error;
    }
  };
  
  // Function to refresh mood data
  const refreshMoods = async () => {
    dispatch({ type: 'FETCH_MOODS_START' });
    try {
      const response = await getMoodHistory('current');
      dispatch({ type: 'FETCH_MOODS_SUCCESS', payload: response.items });
      return response.items;
    } catch (error) {
      dispatch({ type: 'FETCH_MOODS_FAILURE', payload: error.message });
      throw error;
    }
  };
  
  // Provide the state and functions to consumers
  const value = {
    ...state,
    addMoodEntry,
    refreshMoods
  };
  
  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};

// Custom hook for using the context
export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
```

### 4. Utility & Support Layer

This layer provides cross-cutting concerns like offline support, error handling, and logging.

#### Example: Offline Storage

```javascript
// src/services/offlineStorage.js

/**
 * Open the offline database
 * @returns {Promise<IDBDatabase>} The database instance
 */
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('hugmood-offline-db', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores
      if (!db.objectStoreNames.contains('user_data')) {
        db.createObjectStore('user_data', { keyPath: 'key' });
      }
      
      if (!db.objectStoreNames.contains('action_queue')) {
        db.createObjectStore('action_queue', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

/**
 * Store user data locally
 * @param {string} key - The key for the data
 * @param {any} data - The data to store
 * @returns {Promise<void>}
 */
export const storeUserData = async (key, data) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['user_data'], 'readwrite');
    const store = transaction.objectStore('user_data');
    
    const request = store.put({
      key,
      data,
      timestamp: Date.now()
    });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get user data from local storage
 * @param {string} key - The key for the data
 * @returns {Promise<any>} The stored data
 */
export const getUserData = async (key) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['user_data'], 'readonly');
    const store = transaction.objectStore('user_data');
    
    const request = store.get(key);
    
    request.onsuccess = () => {
      resolve(request.result ? request.result.data : null);
    };
    
    request.onerror = () => reject(request.error);
  });
};

/**
 * Queue an action for offline processing
 * @param {Object} action - The action to queue
 * @returns {Promise<number>} The ID of the queued action
 */
export const queueAction = async (action) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['action_queue'], 'readwrite');
    const store = transaction.objectStore('action_queue');
    
    const request = store.add({
      ...action,
      status: 'pending',
      created: Date.now()
    });
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all pending actions in the queue
 * @returns {Promise<Array>} The queued actions
 */
export const getPendingActions = async () => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['action_queue'], 'readonly');
    const store = transaction.objectStore('action_queue');
    
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result.filter(action => action.status === 'pending'));
    };
    
    request.onerror = () => reject(request.error);
  });
};

/**
 * Mark an action as processed
 * @param {number} id - The action ID
 * @param {string} status - The new status
 * @returns {Promise<void>}
 */
export const updateActionStatus = async (id, status) => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['action_queue'], 'readwrite');
    const store = transaction.objectStore('action_queue');
    
    // First get the action
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      if (!getRequest.result) {
        reject(new Error(`Action with ID ${id} not found`));
        return;
      }
      
      // Update the status
      const action = getRequest.result;
      action.status = status;
      action.processedAt = Date.now();
      
      // Put it back
      const putRequest = store.put(action);
      
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };
    
    getRequest.onerror = () => reject(getRequest.error);
  });
};

export const offlineStorage = {
  storeUserData,
  getUserData,
  queueAction,
  getPendingActions,
  updateActionStatus
};
```

#### Example: Error Handling

```javascript
// src/services/errorHandling.js

/**
 * Error types for the application
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTHENTICATION_ERROR',
  SERVER: 'SERVER_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  OFFLINE: 'OFFLINE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Process an error to determine its type and create a user-friendly message
 * @param {Error} error - The error object
 * @returns {Object} Processed error with type and message
 */
export const processError = (error) => {
  // Default error information
  let errorType = ERROR_TYPES.UNKNOWN;
  let userMessage = 'An unexpected error occurred. Please try again.';
  let technicalDetails = error.message || 'No details available';
  
  // Network errors
  if (error.name === 'NetworkError' || error.message.includes('network') || !navigator.onLine) {
    errorType = ERROR_TYPES.NETWORK;
    userMessage = 'Unable to connect to the server. Please check your internet connection.';
  }
  // Authentication errors
  else if (error.status === 401 || error.message.includes('unauthorized') || error.message.includes('token')) {
    errorType = ERROR_TYPES.AUTH;
    userMessage = 'Your session has expired. Please log in again.';
  }
  // Server errors
  else if (error.status >= 500 || error.message.includes('server')) {
    errorType = ERROR_TYPES.SERVER;
    userMessage = 'The server encountered an error. Please try again later.';
  }
  // Validation errors
  else if (error.status === 400 || error.message.includes('validation') || error.details) {
    errorType = ERROR_TYPES.VALIDATION;
    userMessage = 'Please check your input and try again.';
    
    // Add validation details if available
    if (error.details) {
      technicalDetails = JSON.stringify(error.details);
    }
  }
  // Offline errors
  else if (error.offline) {
    errorType = ERROR_TYPES.OFFLINE;
    userMessage = 'This action is not available offline. Please connect to the internet and try again.';
  }
  
  return {
    type: errorType,
    userMessage,
    technicalDetails,
    originalError: error
  };
};

/**
 * Handle an error globally
 * @param {Error} error - The error object
 * @param {Object} options - Options for handling the error
 */
export const handleGlobalError = (error, options = {}) => {
  const processedError = processError(error);
  
  // Log the error
  console.error('Global error:', processedError);
  
  // Track in analytics
  if (window.analytics) {
    window.analytics.track('Error', {
      type: processedError.type,
      message: processedError.userMessage,
      details: processedError.technicalDetails
    });
  }
  
  // Show user notification if requested
  if (options.showNotification !== false) {
    // Use a notification system (e.g., toast)
    if (window.showToast) {
      window.showToast({
        type: 'error',
        message: processedError.userMessage
      });
    }
  }
  
  // Special handling for authentication errors
  if (processedError.type === ERROR_TYPES.AUTH && options.handleAuth !== false) {
    // Redirect to login
    if (window.authService) {
      window.authService.logout();
      window.location.href = '/login?session=expired';
    }
  }
  
  return processedError;
};

/**
 * Create an async error handler that processes errors for async functions
 * @param {Function} fn - The async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function that handles errors
 */
export const withErrorHandling = (fn, options = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleGlobalError(error, options);
    }
  };
};
```

## Integration Strategy

### 1. React Component Integration

Components can use the services through React hooks without needing to know about the underlying communication methods.

```jsx
// src/components/MoodTracker.jsx
import React, { useState } from 'react';
import { useMood } from '../contexts/MoodContext';
import MoodSelector from './MoodSelector';
import MoodHistoryChart from './MoodHistoryChart';
import { ERROR_TYPES } from '../services/errorHandling';

const MoodTracker = () => {
  const { currentMood, moodHistory, analytics, isLoading, error, addMoodEntry, refreshMoods } = useMood();
  const [note, setNote] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  
  const handleMoodSubmit = async () => {
    if (!selectedMood) {
      return;
    }
    
    try {
      await addMoodEntry({
        mood: selectedMood.name,
        intensity: selectedMood.intensity,
        note: note,
        isPublic: false
      });
      
      // Reset form
      setNote('');
      setSelectedMood(null);
    } catch (error) {
      // Error is already handled by the context
      console.error('Failed to submit mood:', error);
    }
  };
  
  // Handle offline state
  const isOfflineError = error && error.type === ERROR_TYPES.OFFLINE;
  
  return (
    <div className="mood-tracker">
      <h2>How are you feeling today?</h2>
      
      {isOfflineError && (
        <div className="offline-notice">
          You're currently offline. Your mood will be saved and synchronized when you're back online.
        </div>
      )}
      
      <MoodSelector
        selectedMood={selectedMood}
        onMoodSelect={setSelectedMood}
        disabled={isLoading}
      />
      
      <textarea
        placeholder="Add a note about how you're feeling (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={isLoading}
      />
      
      <button 
        onClick={handleMoodSubmit} 
        disabled={!selectedMood || isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Mood'}
      </button>
      
      {currentMood && (
        <div className="current-mood">
          <h3>Current Mood</h3>
          <p>
            You're feeling <strong>{currentMood.mood}</strong> 
            {currentMood.note && ` - "${currentMood.note}"`}
          </p>
          {currentMood.offline && (
            <span className="offline-badge">Not yet synchronized</span>
          )}
        </div>
      )}
      
      {moodHistory.length > 0 && (
        <div className="mood-history">
          <h3>Your Mood History</h3>
          <button onClick={refreshMoods}>Refresh</button>
          <MoodHistoryChart moodData={moodHistory} />
        </div>
      )}
      
      {analytics && (
        <div className="mood-analytics">
          <h3>Mood Insights</h3>
          <p>Your dominant mood: <strong>{analytics.dominantMood}</strong></p>
          <p>Mood trend: <strong>{analytics.moodTrend}</strong></p>
          {/* More analytics visualizations */}
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
```

### 2. Backend Switching Strategy

To enable switching between different backend implementations, the application needs to be configured properly.

```javascript
// src/config/appConfig.js

/**
 * Application configuration
 */
export const APP_CONFIG = {
  // API endpoints
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || '/api/v1',
  graphqlUrl: process.env.REACT_APP_GRAPHQL_URL || '/graphql',
  websocketUrl: process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080',
  
  // Communication preferences
  preferGraphQL: process.env.REACT_APP_PREFER_GRAPHQL === 'true',
  enableWebsockets: process.env.REACT_APP_ENABLE_WEBSOCKETS !== 'false',
  
  // Feature flags
  features: {
    offlineMode: true,
    analytics: true,
    hapticFeedback: true,
    pushNotifications: process.env.REACT_APP_PUSH_NOTIFICATIONS === 'true'
  }
};

/**
 * Update feature flags from the server configuration
 * @param {Object} serverConfig - Configuration from the server
 */
export const updateFeatureFlags = (serverConfig) => {
  if (serverConfig && serverConfig.features) {
    // Merge server-provided feature flags
    APP_CONFIG.features = {
      ...APP_CONFIG.features,
      ...serverConfig.features
    };
  }
  
  // Update communication preferences
  if (serverConfig && serverConfig.communication) {
    if (serverConfig.communication.preferGraphQL !== undefined) {
      APP_CONFIG.preferGraphQL = serverConfig.communication.preferGraphQL;
    }
    
    if (serverConfig.communication.enableWebsockets !== undefined) {
      APP_CONFIG.enableWebsockets = serverConfig.communication.enableWebsockets;
    }
  }
  
  // Update feature flags in the communication bridge
  import('../services/communicationBridge').then(({ updateFeatures }) => {
    updateFeatures({
      useGraphQL: APP_CONFIG.preferGraphQL,
      useWebSocket: APP_CONFIG.enableWebsockets
    });
  });
};
```

### 3. Application Initialization

Proper initialization ensures the communication bridge is set up correctly.

```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { initialize as initializeCommunication } from './services/communicationBridge';
import { APP_CONFIG, updateFeatureFlags } from './config/appConfig';
import { AuthProvider } from './contexts/AuthContext';
import { MoodProvider } from './contexts/MoodContext';
import { HugProvider } from './contexts/HugContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Initialize the application
const initializeApp = async () => {
  // Fetch initial configuration from the server
  try {
    const response = await fetch('/api/v1/config');
    if (response.ok) {
      const serverConfig = await response.json();
      updateFeatureFlags(serverConfig);
    }
  } catch (error) {
    console.warn('Failed to fetch server configuration:', error);
  }
  
  // Initialize communication bridge
  await initializeCommunication({
    websocketUrl: APP_CONFIG.websocketUrl,
    graphqlUrl: APP_CONFIG.graphqlUrl,
    apiBaseUrl: APP_CONFIG.apiBaseUrl,
    preferGraphQL: APP_CONFIG.preferGraphQL,
    enableWebsockets: APP_CONFIG.enableWebsockets
  });
  
  // Render the application
  ReactDOM.render(
    <React.StrictMode>
      <AuthProvider>
        <MoodProvider>
          <HugProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </HugProvider>
        </MoodProvider>
      </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
};

// Start the application
initializeApp().catch(error => {
  console.error('Failed to initialize application:', error);
  
  // Render error state
  ReactDOM.render(
    <div className="app-error">
      <h1>Application Error</h1>
      <p>Failed to initialize the application. Please try again later.</p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>,
    document.getElementById('root')
  );
});
```

## Migration Strategy

### Moving from WebSockets to GraphQL/REST

To transition from a WebSocket-based implementation to a GraphQL or REST implementation, follow these steps:

1. **Implement Communication Bridge**: Deploy the communication bridge layer without changing existing code.

2. **Update Feature Flags**: Start with all features using WebSockets, then gradually switch them.

```javascript
// Initial configuration - all WebSockets
export const FEATURES = {
  AUTH: { useGraphQL: false, useREST: false, useWebSocket: true },
  USER_PROFILE: { useGraphQL: false, useREST: false, useWebSocket: true },
  MOOD_TRACKING: { useGraphQL: false, useREST: false, useWebSocket: true },
  HUGS: { useGraphQL: false, useREST: false, useWebSocket: true },
  NOTIFICATIONS: { useGraphQL: false, useREST: false, useWebSocket: true },
  DEFAULT: { useGraphQL: false, useREST: false, useWebSocket: true }
};

// Phase 1 - Move non-real-time features to REST
export const FEATURES = {
  AUTH: { useGraphQL: false, useREST: true, useWebSocket: false },
  USER_PROFILE: { useGraphQL: false, useREST: true, useWebSocket: false },
  MOOD_TRACKING: { useGraphQL: false, useREST: true, useWebSocket: false },
  HUGS: { useGraphQL: false, useREST: false, useWebSocket: true },
  NOTIFICATIONS: { useGraphQL: false, useREST: false, useWebSocket: true },
  DEFAULT: { useGraphQL: false, useREST: true, useWebSocket: false }
};

// Phase 2 - Introduce GraphQL for complex data needs
export const FEATURES = {
  AUTH: { useGraphQL: false, useREST: true, useWebSocket: false },
  USER_PROFILE: { useGraphQL: true, useREST: true, useWebSocket: false },
  MOOD_TRACKING: { useGraphQL: true, useREST: true, useWebSocket: false },
  HUGS: { useGraphQL: false, useREST: true, useWebSocket: false },
  NOTIFICATIONS: { useGraphQL: false, useREST: false, useWebSocket: true },
  DEFAULT: { useGraphQL: false, useREST: true, useWebSocket: false }
};

// Phase 3 - GraphQL for most features, WebSockets only for real-time
export const FEATURES = {
  AUTH: { useGraphQL: true, useREST: true, useWebSocket: false },
  USER_PROFILE: { useGraphQL: true, useREST: true, useWebSocket: false },
  MOOD_TRACKING: { useGraphQL: true, useREST: true, useWebSocket: false },
  HUGS: { useGraphQL: true, useREST: true, useWebSocket: false },
  NOTIFICATIONS: { useGraphQL: false, useREST: false, useWebSocket: true },
  DEFAULT: { useGraphQL: true, useREST: true, useWebSocket: false }
};

// Final phase - GraphQL Subscriptions replace WebSockets
export const FEATURES = {
  AUTH: { useGraphQL: true, useREST: true, useWebSocket: false },
  USER_PROFILE: { useGraphQL: true, useREST: true, useWebSocket: false },
  MOOD_TRACKING: { useGraphQL: true, useREST: true, useWebSocket: false },
  HUGS: { useGraphQL: true, useREST: true, useWebSocket: false },
  NOTIFICATIONS: { useGraphQL: true, useREST: false, useWebSocket: false },
  DEFAULT: { useGraphQL: true, useREST: true, useWebSocket: false }
};
```

3. **Implement Server-Side Components**: Build the Flask/GraphQL backend implementations in parallel.

4. **Feature Flag Control**: Implement admin controls to adjust feature flags for testing.

5. **A/B Testing**: Use feature flags to test different implementations with subsets of users.

6. **Metrics Collection**: Monitor performance and errors for each implementation.

7. **Gradual Rollout**: Switch features one by one, monitoring for issues.

## Testing Strategy

### Unit Testing

Test each layer of the architecture independently:

```javascript
// Example test for Communication Bridge
import { getCommunicationMethod } from '../src/services/communicationBridge';

describe('Communication Bridge', () => {
  test('should use GraphQL when feature flag is enabled', () => {
    // Mock feature flags
    jest.mock('../src/services/communicationBridge', () => ({
      FEATURES: {
        MOOD_TRACKING: { useGraphQL: true, useREST: false, useWebSocket: false },
      },
      ...jest.requireActual('../src/services/communicationBridge')
    }));
    
    const method = getCommunicationMethod('mood.update');
    expect(method).toBe('graphql');
  });
  
  test('should fall back to REST when offline and feature supports it', () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    
    const method = getCommunicationMethod('user.update');
    expect(method).toBe('offline');
    
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
  });
});

// Example test for Service Layer
import { recordMood } from '../src/services/moodService';
import { sendMessage } from '../src/services/communicationBridge';

// Mock dependencies
jest.mock('../src/services/communicationBridge');

describe('Mood Service', () => {
  test('should send mood update message', async () => {
    // Mock sendMessage implementation
    sendMessage.mockResolvedValueOnce({ id: 'test-id', mood: 'happy' });
    
    const result = await recordMood({ mood: 'happy', intensity: 0.8 });
    
    // Verify sendMessage was called correctly
    expect(sendMessage).toHaveBeenCalledWith({
      type: 'mood.update',
      data: { mood: 'happy', intensity: 0.8 }
    });
    
    // Verify result
    expect(result).toEqual({ id: 'test-id', mood: 'happy' });
  });
  
  test('should handle offline recording', async () => {
    // Mock sendMessage to throw network error
    sendMessage.mockRejectedValueOnce(new Error('Network error'));
    
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    
    // Mock storage functions
    jest.mock('../src/services/offlineStorage', () => ({
      getUserData: jest.fn().mockResolvedValue([]),
      storeUserData: jest.fn().mockResolvedValue(true),
      queueAction: jest.fn().mockResolvedValue(true)
    }));
    
    const result = await recordMood({ mood: 'sad', intensity: 0.4 });
    
    // Verify result has offline flag
    expect(result.offline).toBe(true);
    expect(result.mood).toBe('sad');
    
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
  });
});
```

### Integration Testing

Test complete flows across layers:

```javascript
// Example integration test for mood tracking flow
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MoodProvider } from '../src/contexts/MoodContext';
import MoodTracker from '../src/components/MoodTracker';
import { recordMood, getMoodHistory } from '../src/services/moodService';

// Mock services
jest.mock('../src/services/moodService');

describe('Mood Tracking Flow', () => {
  beforeEach(() => {
    // Setup mocks
    getMoodHistory.mockResolvedValue({ 
      items: [
        { id: 'mood-1', mood: 'happy', intensity: 0.8, createdAt: new Date().toISOString() }
      ] 
    });
    
    recordMood.mockResolvedValue({ 
      id: 'new-mood', 
      mood: 'excited', 
      intensity: 0.9, 
      createdAt: new Date().toISOString() 
    });
  });
  
  test('should record a new mood and update history', async () => {
    // Render component with context
    render(
      <MoodProvider>
        <MoodTracker />
      </MoodProvider>
    );
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText(/current mood/i)).toBeInTheDocument();
    });
    
    // Select a mood
    fireEvent.click(screen.getByTestId('mood-excited'));
    
    // Add a note
    fireEvent.change(screen.getByPlaceholderText(/add a note/i), {
      target: { value: 'Feeling great today!' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Mood'));
    
    // Verify service was called
    await waitFor(() => {
      expect(recordMood).toHaveBeenCalledWith({
        mood: 'excited',
        intensity: 0.9,
        note: 'Feeling great today!',
        isPublic: false
      });
    });
    
    // Verify UI was updated
    await waitFor(() => {
      expect(screen.getByText(/you're feeling excited/i)).toBeInTheDocument();
    });
  });
  
  test('should handle offline mode', async () => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
    
    // Mock error for recordMood
    recordMood.mockRejectedValue({ offline: true, type: 'OFFLINE_ERROR' });
    
    // Render component
    render(
      <MoodProvider>
        <MoodTracker />
      </MoodProvider>
    );
    
    // Select a mood and submit
    fireEvent.click(screen.getByTestId('mood-happy'));
    fireEvent.click(screen.getByText('Save Mood'));
    
    // Verify offline notice is shown
    await waitFor(() => {
      expect(screen.getByText(/you're currently offline/i)).toBeInTheDocument();
    });
    
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
  });
});
```

### End-to-End Testing

Test the complete system with different backend implementations:

```javascript
// cypress/integration/mood_tracking_spec.js
describe('Mood Tracking with Different Backends', () => {
  context('Using REST API', () => {
    beforeEach(() => {
      // Configure app to use REST
      cy.visit('/?useGraphQL=false&useWebSocket=false');
      cy.login('testuser', 'password123');
    });
    
    it('should record a mood and show it in history', () => {
      // Select mood
      cy.get('[data-testid=mood-happy]').click();
      
      // Add note
      cy.get('[placeholder="Add a note about how you\'re feeling (optional)"]')
        .type('Feeling great with REST API!');
      
      // Submit
      cy.get('button').contains('Save Mood').click();
      
      // Verify saved
      cy.contains('You\'re feeling happy').should('be.visible');
      cy.contains('Feeling great with REST API!').should('be.visible');
      
      // Check history updated
      cy.get('.mood-history').should('contain', 'happy');
    });
  });
  
  context('Using GraphQL API', () => {
    beforeEach(() => {
      // Configure app to use GraphQL
      cy.visit('/?useGraphQL=true&useWebSocket=false');
      cy.login('testuser', 'password123');
    });
    
    it('should record a mood and show analytics', () => {
      // Select mood
      cy.get('[data-testid=mood-sad]').click();
      
      // Add note
      cy.get('[placeholder="Add a note about how you\'re feeling (optional)"]')
        .type('Testing with GraphQL');
      
      // Submit
      cy.get('button').contains('Save Mood').click();
      
      // Verify saved
      cy.contains('You\'re feeling sad').should('be.visible');
      
      // Check analytics (only available with GraphQL)
      cy.get('.mood-analytics').should('be.visible');
      cy.get('.mood-analytics').should('contain', 'Mood Insights');
    });
  });
  
  context('Using WebSocket API', () => {
    beforeEach(() => {
      // Configure app to use WebSockets
      cy.visit('/?useGraphQL=false&useWebSocket=true');
      cy.login('testuser', 'password123');
    });
    
    it('should record a mood and receive real-time updates', () => {
      // Select mood
      cy.get('[data-testid=mood-excited]').click();
      
      // Submit
      cy.get('button').contains('Save Mood').click();
      
      // Verify saved
      cy.contains('You\'re feeling excited').should('be.visible');
      
      // In another browser tab (simulated), record a mood as a friend
      cy.task('triggerFriendMoodUpdate', {
        userId: 'friend1',
        mood: 'happy',
        message: 'Friend is happy!'
      });
      
      // Verify real-time notification received
      cy.get('.notification-toast').should('contain', 'Friend is happy!');
    });
  });
});
```

## Performance Considerations

### 1. Request Batching

For GraphQL operations, batch multiple requests:

```javascript
// src/services/graphqlClient.js

/**
 * Batch multiple GraphQL operations into a single request
 * @param {Array<Object>} operations - Array of operations
 * @returns {Promise<Array>} Array of results
 */
export const batchOperations = async (operations) => {
  if (!operations.length) {
    return [];
  }
  
  const batchedQuery = operations
    .map((op, index) => `
      op${index}: ${op.type}${op.variables ? `(${formatVariables(op.variables)})` : ''} {
        ${op.query}
      }
    `)
    .join('\n');
  
  const wrappedQuery = `{ ${batchedQuery} }`;
  
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getAuthToken() ? `Bearer ${getAuthToken()}` : ''
    },
    body: JSON.stringify({
      query: wrappedQuery
    })
  });
  
  if (!response.ok) {
    throw new Error(`GraphQL batch request failed: ${response.status}`);
  }
  
  const result = await response.json();
  
  // Distribute results back to individual operations
  return operations.map((_, index) => {
    const operationKey = `op${index}`;
    return result.data[operationKey];
  });
};
```

### 2. Optimistic Updates

Update the UI immediately before server confirmation:

```javascript
// Example in MoodContext.js

const addMoodEntry = async (moodData) => {
  // Create optimistic update
  const optimisticMood = {
    id: `temp-${Date.now()}`,
    mood: moodData.mood,
    intensity: moodData.intensity,
    note: moodData.note,
    createdAt: new Date().toISOString(),
    isOptimistic: true
  };
  
  // Update state immediately
  dispatch({ 
    type: 'RECORD_MOOD_SUCCESS', 
    payload: optimisticMood 
  });
  
  try {
    // Send to server
    const newMood = await recordMood(moodData);
    
    // Replace optimistic update with server response
    dispatch({ 
      type: 'REPLACE_OPTIMISTIC_MOOD', 
      payload: {
        optimisticId: optimisticMood.id,
        serverMood: newMood
      } 
    });
    
    return newMood;
  } catch (error) {
    // Revert optimistic update on error
    dispatch({ 
      type: 'REMOVE_OPTIMISTIC_MOOD', 
      payload: optimisticMood.id 
    });
    
    throw error;
  }
};
```

### 3. Caching Strategies

Implement effective caching:

```javascript
// src/services/cacheService.js

// Cache storage
const cache = {
  data: new Map(),
  metadata: new Map()
};

/**
 * Cache configuration for different data types
 */
const CACHE_CONFIG = {
  'mood.history': { ttl: 60 * 1000 }, // 1 minute
  'user.profile': { ttl: 5 * 60 * 1000 }, // 5 minutes
  'analytics': { ttl: 15 * 60 * 1000 }, // 15 minutes
  'default': { ttl: 2 * 60 * 1000 } // 2 minutes
};

/**
 * Get cache configuration for a data type
 * @param {string} dataType - Type of data
 * @returns {Object} Cache configuration
 */
const getCacheConfig = (dataType) => {
  return CACHE_CONFIG[dataType] || CACHE_CONFIG.default;
};

/**
 * Get an item from cache
 * @param {string} key - Cache key
 * @returns {any|null} Cached item or null if not found/expired
 */
export const getCachedItem = (key) => {
  if (!cache.data.has(key)) {
    return null;
  }
  
  const metadata = cache.metadata.get(key);
  const now = Date.now();
  
  // Check if expired
  if (metadata && metadata.expires && metadata.expires < now) {
    // Remove expired item
    cache.data.delete(key);
    cache.metadata.delete(key);
    return null;
  }
  
  return cache.data.get(key);
};

/**
 * Store an item in cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {string} dataType - Type of data (for TTL configuration)
 */
export const cacheItem = (key, data, dataType = 'default') => {
  const config = getCacheConfig(dataType);
  const now = Date.now();
  
  cache.data.set(key, data);
  cache.metadata.set(key, {
    cachedAt: now,
    expires: now + config.ttl,
    dataType
  });
};

/**
 * Invalidate cache for a data type
 * @param {string} dataType - Type of data to invalidate
 */
export const invalidateCache = (dataType) => {
  // Get all keys for this data type
  const keysToInvalidate = [];
  
  cache.metadata.forEach((metadata, key) => {
    if (metadata.dataType === dataType) {
      keysToInvalidate.push(key);
    }
  });
  
  // Remove from cache
  keysToInvalidate.forEach(key => {
    cache.data.delete(key);
    cache.metadata.delete(key);
  });
};

/**
 * Clear all cached data
 */
export const clearCache = () => {
  cache.data.clear();
  cache.metadata.clear();
};
```

## Conclusion

The system-independent frontend architecture for HugMood provides a flexible, maintainable approach to building a robust client application that can work with different backend implementations. By abstracting communication details behind a bridge layer, the application can seamlessly switch between WebSocket, REST, and GraphQL backends while maintaining consistent user experience.

Key benefits of this architecture include:

1. **Flexibility**: The ability to use different backend technologies based on needs.

2. **Incremental Migration**: Support for gradual migration between communication methods.

3. **Feature Toggling**: Fine-grained control over which features use which communication methods.

4. **Offline Support**: Built-in handling for offline scenarios.

5. **Performance Optimization**: Strategies for caching, batching, and optimistic updates.

6. **Maintainability**: Clear separation of concerns between layers.

This approach ensures that the frontend can evolve independently of the backend, allowing the development team to choose the best technologies for each part of the system while preserving a consistent user experience.