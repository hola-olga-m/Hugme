/**
 * GraphQL Communication Bridge
 * 
 * A complete replacement for the existing WebSocket communication,
 * using GraphQL for all data transfer and real-time updates.
 */

import * as graphqlService from './graphqlService';
import { getToken, setToken, clearToken, isAuthenticated } from './authService';
import * as offlineStorage from './offlineStorage';

// Message handlers by type
const messageHandlers = new Map();
const subscriptionHandlers = new Map();
const activeSubscriptions = new Map();
const pollingIntervals = new Map();

// Connection state
let isConnected = false;
let isInitialized = false;
let queuedMessages = [];
let connectionListeners = [];

/**
 * Initialize the GraphQL communication bridge
 * @param {Object} options - Initialization options
 */
export const initialize = (options = {}) => {
  if (isInitialized) return;
  isInitialized = true;
  
  // Initialize GraphQL service
  graphqlService.initialize({
    token: getToken()
  });
  
  // Load any queued offline actions
  loadOfflineQueue();
  
  // Set up network state monitoring
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Set initial connection state
  isConnected = navigator.onLine;
  
  // Set up polling for subscriptions
  setupSubscriptionPolling();
  
  console.log('GraphQL Communication Bridge initialized');
};

/**
 * Handle device coming online
 */
const handleOnline = () => {
  isConnected = true;
  
  // Process any queued messages
  if (queuedMessages.length > 0) {
    processOfflineQueue();
  }
  
  // Restart subscription polling
  restartSubscriptionPolling();
  
  // Notify listeners
  connectionListeners.forEach(listener => 
    listener({ type: 'online', timestamp: Date.now() })
  );
  
  console.log('Device is online');
};

/**
 * Handle device going offline
 */
const handleOffline = () => {
  isConnected = false;
  
  // Pause subscription polling
  pauseSubscriptionPolling();
  
  // Notify listeners
  connectionListeners.forEach(listener => 
    listener({ type: 'offline', timestamp: Date.now() })
  );
  
  console.log('Device is offline');
};

/**
 * Set up polling for simulating GraphQL subscriptions
 */
const setupSubscriptionPolling = () => {
  // Only set up polling if we're connected
  if (!isConnected) return;
  
  // Clear any existing polling intervals
  pollingIntervals.forEach((interval, type) => {
    clearInterval(interval);
  });
  
  // Set up polling for each subscription type
  setupMoodUpdatesPolling();
  setupHugReceivedPolling();
  setupUserStatusPolling();
  setupBadgeEarnedPolling();
  setupStreakMilestonePolling();
  
  console.log('Subscription polling setup complete');
};

/**
 * Set up polling for mood updates
 */
const setupMoodUpdatesPolling = () => {
  // Only poll if there are active handlers
  if (!subscriptionHandlers.has('moodUpdated')) return;
  
  const interval = setInterval(async () => {
    // Only proceed if connected
    if (!isConnected) return;
    
    try {
      // For each userId being monitored, fetch latest mood
      const userIds = Array.from(activeSubscriptions.get('moodUpdated') || new Set());
      
      for (const userId of userIds) {
        const result = await graphqlService.queries.moodHistory(userId, 1, 0);
        
        if (result && result.data && result.data.moodHistory && result.data.moodHistory.length > 0) {
          const latestMood = result.data.moodHistory[0];
          
          // Get the handler for this userId
          const handlers = subscriptionHandlers.get('moodUpdated') || [];
          
          // Only notify about new moods
          const lastProcessedMood = localStorage.getItem(`last_mood_${userId}`);
          
          if (!lastProcessedMood || lastProcessedMood !== latestMood.id) {
            // Store latest processed mood
            localStorage.setItem(`last_mood_${userId}`, latestMood.id);
            
            // Notify handlers
            handlers.forEach(handler => {
              try {
                handler({
                  type: 'moodUpdated',
                  data: {
                    moodUpdated: latestMood
                  }
                });
              } catch (error) {
                console.error('Error in mood update handler:', error);
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error polling mood updates:', error);
    }
  }, 15000); // Poll every 15 seconds
  
  // Store the interval for later cleanup
  pollingIntervals.set('moodUpdated', interval);
};

/**
 * Set up polling for hug notifications
 */
const setupHugReceivedPolling = () => {
  // Only poll if there are active handlers
  if (!subscriptionHandlers.has('hugReceived')) return;
  
  const interval = setInterval(async () => {
    // Only proceed if connected
    if (!isConnected) return;
    
    try {
      // For each userId being monitored, fetch latest hugs
      const userIds = Array.from(activeSubscriptions.get('hugReceived') || new Set());
      
      for (const userId of userIds) {
        const result = await graphqlService.queries.userHugs(userId, 'RECEIVED', 5, 0);
        
        if (result && result.data && result.data.userHugs && result.data.userHugs.length > 0) {
          const latestHug = result.data.userHugs[0];
          
          // Get the handler for this userId
          const handlers = subscriptionHandlers.get('hugReceived') || [];
          
          // Only notify about new hugs
          const lastProcessedHug = localStorage.getItem(`last_hug_${userId}`);
          
          if (!lastProcessedHug || lastProcessedHug !== latestHug.id) {
            // Store latest processed hug
            localStorage.setItem(`last_hug_${userId}`, latestHug.id);
            
            // Notify handlers
            handlers.forEach(handler => {
              try {
                handler({
                  type: 'hugReceived',
                  data: {
                    hugReceived: latestHug
                  }
                });
              } catch (error) {
                console.error('Error in hug received handler:', error);
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error polling hug updates:', error);
    }
  }, 10000); // Poll every 10 seconds
  
  // Store the interval for later cleanup
  pollingIntervals.set('hugReceived', interval);
};

/**
 * Set up polling for user status changes
 */
const setupUserStatusPolling = () => {
  // Only poll if there are active handlers
  if (!subscriptionHandlers.has('userStatusChanged')) return;
  
  const interval = setInterval(async () => {
    // Only proceed if connected
    if (!isConnected) return;
    
    try {
      // For each userId being monitored, fetch latest status
      const userIds = Array.from(activeSubscriptions.get('userStatusChanged') || new Set());
      
      for (const userId of userIds) {
        const result = await graphqlService.queries.userProfile(userId);
        
        if (result && result.data && result.data.userProfile && result.data.userProfile.user) {
          const user = result.data.userProfile.user;
          
          // Get the handler for this userId
          const handlers = subscriptionHandlers.get('userStatusChanged') || [];
          
          // Only notify about status changes
          const lastStatus = localStorage.getItem(`last_status_${userId}`);
          const currentStatus = `${user.isOnline}_${user.lastActive}`;
          
          if (!lastStatus || lastStatus !== currentStatus) {
            // Store latest status
            localStorage.setItem(`last_status_${userId}`, currentStatus);
            
            // Notify handlers
            handlers.forEach(handler => {
              try {
                handler({
                  type: 'userStatusChanged',
                  data: {
                    userStatusChanged: {
                      userId,
                      isOnline: user.isOnline,
                      lastActive: user.lastActive
                    }
                  }
                });
              } catch (error) {
                console.error('Error in user status handler:', error);
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error polling user status updates:', error);
    }
  }, 30000); // Poll every 30 seconds
  
  // Store the interval for later cleanup
  pollingIntervals.set('userStatusChanged', interval);
};

/**
 * Set up polling for badge earned notifications
 */
const setupBadgeEarnedPolling = () => {
  // Only poll if there are active handlers
  if (!subscriptionHandlers.has('badgeEarned')) return;
  
  const interval = setInterval(async () => {
    // Only proceed if connected
    if (!isConnected) return;
    
    try {
      // For each userId being monitored, fetch latest badges
      const userIds = Array.from(activeSubscriptions.get('badgeEarned') || new Set());
      
      for (const userId of userIds) {
        const result = await graphqlService.queries.userProfile(userId);
        
        if (result && result.data && result.data.userProfile && result.data.userProfile.badges) {
          const badges = result.data.userProfile.badges;
          
          // If there are badges, check for new ones
          if (badges.length > 0) {
            // Get the newest badge
            const latestBadge = badges.sort((a, b) => 
              new Date(b.earnedAt) - new Date(a.earnedAt)
            )[0];
            
            // Get the handler for this userId
            const handlers = subscriptionHandlers.get('badgeEarned') || [];
            
            // Only notify about new badges
            const lastProcessedBadge = localStorage.getItem(`last_badge_${userId}`);
            
            if (!lastProcessedBadge || lastProcessedBadge !== `${latestBadge.id}_${latestBadge.earnedAt}`) {
              // Store latest processed badge
              localStorage.setItem(`last_badge_${userId}`, `${latestBadge.id}_${latestBadge.earnedAt}`);
              
              // Notify handlers
              handlers.forEach(handler => {
                try {
                  handler({
                    type: 'badgeEarned',
                    data: {
                      badgeEarned: {
                        userId,
                        badge: latestBadge.badge,
                        earnedAt: latestBadge.earnedAt
                      }
                    }
                  });
                } catch (error) {
                  console.error('Error in badge earned handler:', error);
                }
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error polling badge updates:', error);
    }
  }, 60000); // Poll every minute
  
  // Store the interval for later cleanup
  pollingIntervals.set('badgeEarned', interval);
};

/**
 * Set up polling for streak milestone notifications
 */
const setupStreakMilestonePolling = () => {
  // Only poll if there are active handlers
  if (!subscriptionHandlers.has('streakMilestoneReached')) return;
  
  const interval = setInterval(async () => {
    // Only proceed if connected
    if (!isConnected) return;
    
    try {
      // For each userId being monitored, fetch latest streak info
      const userIds = Array.from(activeSubscriptions.get('streakMilestoneReached') || new Set());
      
      for (const userId of userIds) {
        const result = await graphqlService.queries.userProfile(userId);
        
        if (result && result.data && result.data.userProfile && result.data.userProfile.moodStreak) {
          const { moodStreak } = result.data.userProfile;
          
          // Get the handler for this userId
          const handlers = subscriptionHandlers.get('streakMilestoneReached') || [];
          
          // Only notify about streak milestones
          const lastProcessedStreak = localStorage.getItem(`last_streak_${userId}`);
          const currentStreak = moodStreak.currentStreak;
          
          if ((!lastProcessedStreak || parseInt(lastProcessedStreak) < currentStreak) && 
              (currentStreak === 7 || currentStreak === 14 || currentStreak === 30 || 
               currentStreak === 60 || currentStreak === 90 || currentStreak === 180 || 
               currentStreak === 365)) {
            // Store latest processed streak
            localStorage.setItem(`last_streak_${userId}`, currentStreak.toString());
            
            // Get rewards for this milestone
            const rewardsResult = await graphqlService.queries.streakRewards(userId);
            const rewards = rewardsResult.data?.streakRewards?.availableRewards || [];
            
            // Notify handlers
            handlers.forEach(handler => {
              try {
                handler({
                  type: 'streakMilestoneReached',
                  data: {
                    streakMilestoneReached: {
                      userId,
                      streakCount: currentStreak,
                      rewards,
                      achievedAt: new Date().toISOString()
                    }
                  }
                });
              } catch (error) {
                console.error('Error in streak milestone handler:', error);
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error polling streak milestone updates:', error);
    }
  }, 60000); // Poll every minute
  
  // Store the interval for later cleanup
  pollingIntervals.set('streakMilestoneReached', interval);
};

/**
 * Restart all subscription polling
 */
const restartSubscriptionPolling = () => {
  // Clear existing intervals
  pollingIntervals.forEach((interval, type) => {
    clearInterval(interval);
  });
  
  // Set up polling again
  setupSubscriptionPolling();
};

/**
 * Pause all subscription polling
 */
const pauseSubscriptionPolling = () => {
  pollingIntervals.forEach((interval, type) => {
    clearInterval(interval);
  });
  
  pollingIntervals.clear();
};

/**
 * Process the offline message queue
 */
const processOfflineQueue = async () => {
  if (queuedMessages.length === 0) return;
  
  const messages = [...queuedMessages];
  queuedMessages = [];
  
  for (const message of messages) {
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error processing queued message:', error);
      // Re-queue failed messages
      queuedMessages.push(message);
    }
  }
};

/**
 * Queue a message for offline processing
 * @param {Object} message - The message to queue
 * @returns {Object} Status object
 */
const queueMessage = (message) => {
  queuedMessages.push(message);
  
  // Store in persistent storage for offline recovery
  if (offlineStorage) {
    offlineStorage.queueAction({
      type: 'message',
      data: message,
      timestamp: Date.now()
    });
  }
  
  return {
    status: 'queued',
    message: 'Device is offline or service unavailable, message queued for later'
  };
};

/**
 * Load offline queue from storage
 */
const loadOfflineQueue = async () => {
  if (!offlineStorage) return;
  
  try {
    const actions = await offlineStorage.getPendingActions();
    if (actions && actions.length > 0) {
      actions.forEach(action => {
        if (action.type === 'message') {
          queuedMessages.push(action.data);
        }
      });
      
      console.log(`Loaded ${actions.length} pending messages from offline storage`);
    }
  } catch (error) {
    console.error('Error loading offline queue:', error);
  }
};

/**
 * Send a message to the server
 * @param {Object} message - The message to send
 * @returns {Promise<Object>} Response or status
 */
export const sendMessage = async (message) => {
  const { type } = message;
  
  // If offline, queue for later
  if (!isConnected) {
    return queueMessage(message);
  }
  
  try {
    // Convert WebSocket-style message to GraphQL operation
    switch (type) {
      case 'authenticate': {
        const { method, token, email, password } = message;
        
        if (method === 'token' && token) {
          // Set token in GraphQL service
          graphqlService.setAuthToken(token);
          
          // Verify token
          const result = await graphqlService.queries.verifyToken(token);
          return {
            type: 'authentication_response',
            success: result.data.verifyToken.isValid,
            user: result.data.verifyToken.user
          };
        } else if (method === 'credentials' && email && password) {
          // Login with credentials
          const result = await graphqlService.mutations.login(email, password);
          
          // Store the token if successful
          if (result.data.login.token) {
            setToken(result.data.login.token);
            graphqlService.setAuthToken(result.data.login.token);
          }
          
          return {
            type: 'authentication_response',
            success: !!result.data.login.token,
            user: result.data.login.user,
            token: result.data.login.token
          };
        }
        
        throw new Error('Invalid authentication method or missing credentials');
      }
      
      case 'register': {
        const { username, email, password, displayName } = message;
        
        // Register new user
        const result = await graphqlService.mutations.register({ 
          username, email, password, displayName 
        });
        
        // Store the token if successful
        if (result.data.register.token) {
          setToken(result.data.register.token);
          graphqlService.setAuthToken(result.data.register.token);
        }
        
        return {
          type: 'registration_response',
          success: !!result.data.register.token,
          user: result.data.register.user,
          token: result.data.register.token
        };
      }
      
      case 'update_mood': {
        const { value, score, note, isPublic } = message;
        
        // Create mood entry
        const result = await graphqlService.mutations.createMood({ 
          value, score, note, isPublic 
        });
        
        return {
          type: 'mood_update_response',
          success: true,
          mood: result.data.createMood
        };
      }
      
      case 'send_hug': {
        const { recipientId, type, message: hugMessage } = message;
        
        // Send hug
        const result = await graphqlService.mutations.sendHug({ 
          recipientId, type, message: hugMessage 
        });
        
        return {
          type: 'hug_sent_response',
          success: true,
          hug: result.data.sendHug
        };
      }
      
      case 'request_hug': {
        const { message: requestMessage, mood, isPublic } = message;
        
        // Request hug
        const result = await graphqlService.mutations.requestHug({ 
          message: requestMessage, mood, isPublic 
        });
        
        return {
          type: 'hug_request_response',
          success: true,
          request: result.data.requestHug
        };
      }
      
      case 'fetch_data': {
        const { dataType, params } = message;
        
        // Fetch data based on type
        const result = await fetchData(dataType, params);
        
        return {
          type: 'fetch_response',
          success: true,
          dataType,
          data: result
        };
      }
      
      default:
        throw new Error(`Unsupported message type: ${type}`);
    }
  } catch (error) {
    console.error(`Error sending GraphQL message (${type}):`, error);
    
    return {
      type: error.code === 'UNAUTHENTICATED' ? 'auth_challenge' : `${type}_error`,
      success: false,
      error: error.message
    };
  }
};

/**
 * Fetch data with GraphQL
 * @param {string} dataType - Type of data to fetch
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Fetched data
 */
export const fetchData = async (dataType, params = {}) => {
  try {
    switch (dataType) {
      case 'user_profile':
        const { userId: profileUserId } = params;
        const profileResult = await graphqlService.queries.userProfile(profileUserId);
        return profileResult.data.userProfile;
      
      case 'mood_history':
        const { userId: moodUserId, limit, offset } = params;
        const moodResult = await graphqlService.queries.moodHistory(moodUserId, limit, offset);
        return moodResult.data.moodHistory;
      
      case 'mood_analytics':
        const { userId: analyticsUserId, timeRange } = params;
        const analyticsResult = await graphqlService.queries.moodAnalytics(analyticsUserId, timeRange);
        return analyticsResult.data.moodAnalytics;
      
      case 'community_feed':
        const { feedLimit, feedOffset } = params;
        const feedResult = await graphqlService.queries.communityFeed(feedLimit, feedOffset);
        return feedResult.data.communityFeed;
      
      case 'user_hugs':
        const { userId: hugsUserId, type: hugType } = params;
        const hugsResult = await graphqlService.queries.userHugs(hugsUserId, hugType, 20, 0);
        return hugsResult.data.userHugs;
      
      case 'streak_rewards':
        const { userId: rewardsUserId } = params;
        const rewardsResult = await graphqlService.queries.streakRewards(rewardsUserId);
        return rewardsResult.data.streakRewards;
      
      default:
        throw new Error(`Unsupported data type: ${dataType}`);
    }
  } catch (error) {
    console.error(`Error fetching data (${dataType}):`, error);
    throw error;
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
  
  return () => {
    const handlers = messageHandlers.get(messageType) || [];
    messageHandlers.set(
      messageType,
      handlers.filter(h => h !== handler)
    );
  };
};

/**
 * Subscribe to real-time updates
 * @param {string} subscriptionType - The type of subscription
 * @param {Object} params - Subscription parameters
 * @param {Function} handler - Event handler
 * @returns {Function} Unsubscribe function
 */
export const subscribe = (subscriptionType, params = {}, handler) => {
  // Register the handler
  if (!subscriptionHandlers.has(subscriptionType)) {
    subscriptionHandlers.set(subscriptionType, []);
  }
  
  subscriptionHandlers.get(subscriptionType).push(handler);
  
  // Track which entities we're monitoring
  if (!activeSubscriptions.has(subscriptionType)) {
    activeSubscriptions.set(subscriptionType, new Set());
  }
  
  // Add the entity ID to the active subscriptions
  if (params.userId) {
    activeSubscriptions.get(subscriptionType).add(params.userId);
  }
  
  if (params.groupId) {
    activeSubscriptions.get(subscriptionType).add(params.groupId);
  }
  
  // Make sure polling is set up for this subscription type
  restartSubscriptionPolling();
  
  // Return unsubscribe function
  return () => {
    const handlers = subscriptionHandlers.get(subscriptionType) || [];
    subscriptionHandlers.set(
      subscriptionType,
      handlers.filter(h => h !== handler)
    );
    
    // If there are no more handlers for this type, stop polling
    if (subscriptionHandlers.get(subscriptionType).length === 0) {
      if (pollingIntervals.has(subscriptionType)) {
        clearInterval(pollingIntervals.get(subscriptionType));
        pollingIntervals.delete(subscriptionType);
      }
      
      // Clean up active subscriptions
      if (activeSubscriptions.has(subscriptionType)) {
        if (params.userId) {
          activeSubscriptions.get(subscriptionType).delete(params.userId);
        }
        
        if (params.groupId) {
          activeSubscriptions.get(subscriptionType).delete(params.groupId);
        }
        
        if (activeSubscriptions.get(subscriptionType).size === 0) {
          activeSubscriptions.delete(subscriptionType);
        }
      }
    }
  };
};

/**
 * Add a connection status listener
 * @param {Function} listener - The listener function
 * @returns {Function} Function to remove the listener
 */
export const addConnectionListener = (listener) => {
  connectionListeners.push(listener);
  
  return () => {
    connectionListeners = connectionListeners.filter(l => l !== listener);
  };
};

/**
 * Get current connection status
 * @returns {Object} Connection status
 */
export const getConnectionStatus = () => {
  return {
    online: isConnected,
    method: 'graphql',
    pendingMessages: queuedMessages.length
  };
};

/**
 * Clean up resources on unmount
 */
export const cleanup = () => {
  // Remove event listeners
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
  
  // Clear all polling intervals
  pollingIntervals.forEach((interval) => {
    clearInterval(interval);
  });
  
  pollingIntervals.clear();
  
  // Clear all handlers
  messageHandlers.clear();
  subscriptionHandlers.clear();
  activeSubscriptions.clear();
  connectionListeners = [];
  
  isInitialized = false;
  
  console.log('GraphQL Communication Bridge cleaned up');
};