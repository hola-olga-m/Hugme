/**
 * HugMood API Service
 * 
 * A unified client-side API service that integrates with the new microservices architecture.
 * Provides access to GraphQL and REST API endpoints for all communication.
 */

import { getToken, updateCurrentUser } from './authService';
import * as graphqlClient from './graphqlClient';
import { storeItem, getItem, queryItems, storeUserData, getUserData } from './offlineStorage';
import { playNotificationHaptic } from '../utils/haptics';

// Configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://api.hugmood.app';
const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL || 'https://api.hugmood.app/graphql';

// Service status (initialized on connection)
let graphqlActive = false;
let messageHandlers = {};
let isAuthenticated = false;
let currentUser = null;

// Feature flags for service routing
const FEATURES = {
  auth: {
    useGraphQL: true,
    useWebSocket: false
  },
  mood: {
    useGraphQL: true,
    useWebSocket: false
  },
  hugs: {
    useGraphQL: true,
    useWebSocket: false
  },
  profiles: {
    useGraphQL: true,
    useWebSocket: false
  },
  friends: {
    useGraphQL: true,
    useWebSocket: false
  },
  insights: {
    useGraphQL: true, 
    useWebSocket: false
  },
  analytics: {
    useGraphQL: true,
    useWebSocket: false
  },
  media: {
    useGraphQL: true,
    useWebSocket: false
  },
  community: {
    useGraphQL: true,
    useWebSocket: false
  },
  settings: {
    useGraphQL: true,
    useWebSocket: false
  }
};

/**
 * Initialize the HugMood API service
 */
export const initialize = async () => {
  // Initialize GraphQL client
  try {
    await graphqlClient.initialize({ url: GRAPHQL_URL });
    graphqlActive = true;
    console.log('GraphQL client initialized');
  } catch (error) {
    console.warn('Failed to initialize GraphQL client:', error);
    graphqlActive = false;
  }
  
  // Initialize authentication
  const token = getToken();
  if (token && graphqlActive) {
    graphqlClient.setAuthToken(token);
    
    // Verify the token by fetching user data
    try {
      const userData = await fetchDataGraphQL('user_profile', {});
      if (userData) {
        isAuthenticated = true;
        currentUser = userData;
        
        // Request initial data
        requestInitialData();
      }
    } catch (error) {
      console.warn('Failed to verify authentication token:', error);
    }
  }
  
  // Set up polling for real-time updates
  setupPollingForUpdates();
  
  return { graphqlActive };
};

/**
 * Set up polling for real-time updates
 */
function setupPollingForUpdates() {
  // Poll for incoming hugs every 30 seconds
  const hugPollingInterval = setInterval(async () => {
    if (isAuthenticated) {
      try {
        const hugs = await fetchDataGraphQL('hugs_received', { 
          limit: 5,
          since: Date.now() - 60000 // Last minute
        });
        
        if (hugs && hugs.length > 0) {
          hugs.forEach(hug => {
            // Create a message in the same format as WebSocket messages
            const message = {
              type: 'hug_received',
              hug
            };
            
            // Process it
            handleHugReceived(message);
          });
        }
      } catch (error) {
        console.error('Error polling for hugs:', error);
      }
    }
  }, 30000);
  
  // Poll for hug requests every 30 seconds
  const requestPollingInterval = setInterval(async () => {
    if (isAuthenticated) {
      try {
        const requests = await fetchDataGraphQL('hug_requests', { 
          status: 'pending',
          limit: 5,
          since: Date.now() - 60000 // Last minute
        });
        
        if (requests && requests.length > 0) {
          requests.forEach(request => {
            // Create a message in the same format as WebSocket messages
            const message = {
              type: 'hug_request_received',
              request
            };
            
            // Process it
            handleHugRequestReceived(message);
          });
        }
      } catch (error) {
        console.error('Error polling for hug requests:', error);
      }
    }
  }, 30000);
  
  // Poll for notifications every 30 seconds
  const notificationPollingInterval = setInterval(async () => {
    if (isAuthenticated) {
      try {
        const notifications = await fetchDataGraphQL('notifications', { 
          limit: 10,
          unreadOnly: true
        });
        
        if (notifications && notifications.length > 0) {
          notifications.forEach(notification => {
            // Create messages based on notification type
            let message;
            
            switch (notification.type) {
              case 'badge_earned':
                message = {
                  type: 'badge_earned',
                  badge: notification.data
                };
                handleBadgeEarned(message);
                break;
              
              case 'streak_milestone':
                message = {
                  type: 'streak_milestone',
                  ...notification.data
                };
                handleStreakMilestone(message);
                break;
              
              case 'follower_update':
                message = {
                  type: 'follower_update',
                  ...notification.data
                };
                handleFollowerUpdate(message);
                break;
                
              case 'group_hug_invite':
                message = {
                  type: 'group_hug_invite',
                  groupHug: notification.data
                };
                handleGroupHugInvite(message);
                break;
                
              default:
                // Handle other notification types
                if (messageHandlers[notification.type]) {
                  messageHandlers[notification.type].forEach(handler => handler(notification.data));
                }
            }
          });
        }
      } catch (error) {
        console.error('Error polling for notifications:', error);
      }
    }
  }, 30000);
  
  // Clean up intervals on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(hugPollingInterval);
    clearInterval(requestPollingInterval);
    clearInterval(notificationPollingInterval);
  });
}

/**
 * Send a message using GraphQL (instead of WebSocket)
 */
async function sendGraphQLMessage(message) {
  let operation;
  let variables;
  
  // Map message type to GraphQL operation
  switch (message.type) {
    case 'ping':
      operation = 'ping';
      variables = {};
      break;
      
    case 'authenticate':
      operation = 'authenticate';
      variables = {
        token: message.token,
        method: message.method,
        credentials: message.credentials,
        userData: message.userData
      };
      break;
      
    // Map other message types to their GraphQL operations
    // ... more cases here
      
    default:
      console.error(`Unknown message type for GraphQL: ${message.type}`);
      throw new Error(`Unknown message type: ${message.type}`);
  }
  
  // Execute the GraphQL operation
  try {
    const result = await graphqlClient.request(operation, variables);
    return result;
  } catch (error) {
    console.error(`GraphQL operation error (${message.type}):`, error);
    throw error;
  }
}

/**
 * Handle incoming WebSocket messages
 */
function handleWsMessage(message) {
  console.log('Received WebSocket message:', message);
  
  // Handle callback responses
  if (message.callbackId && pendingCallbacks[message.callbackId]) {
    pendingCallbacks[message.callbackId](message);
    delete pendingCallbacks[message.callbackId];
    return;
  }
  
  // Handle message by type
  switch (message.type) {
    case 'auth_success':
      handleAuthResponse(message);
      break;
      
    case 'auth_error':
    case 'error':
      handleError(message);
      break;
      
    case 'fetch_success':
      handleFetchResponse(message);
      break;
      
    case 'mood_update':
      handleMoodUpdateResponse(message);
      break;
      
    case 'mood_update_success':
      // Call any registered handlers
      if (messageHandlers['mood_update_success']) {
        messageHandlers['mood_update_success'].forEach(handler => handler(message));
      }
      break;
      
    case 'hug_received':
      handleHugReceived(message);
      break;
      
    case 'send_hug_success':
      handleSendHugResponse(message);
      break;
      
    case 'hug_request_received':
    case 'community_hug_request':
      handleHugRequestReceived(message);
      break;
      
    case 'request_hug_success':
      handleRequestHugResponse(message);
      break;
      
    case 'group_hug_invite':
      handleGroupHugInvite(message);
      break;
      
    case 'create_group_hug_success':
      handleGroupHugResponse(message);
      break;
      
    case 'badge_earned':
      handleBadgeEarned(message);
      break;
      
    case 'streak_milestone':
      handleStreakMilestone(message);
      break;
      
    case 'user_status':
      handleUserStatusUpdate(message);
      break;
      
    case 'follower_update':
      handleFollowerUpdate(message);
      break;
      
    default:
      // Check if we have any registered handlers for this message type
      if (messageHandlers[message.type]) {
        messageHandlers[message.type].forEach(handler => handler(message));
      }
  }
}

/**
 * Authenticate WebSocket connection
 */
function authenticateWs(token) {
  sendWsMessage({
    type: 'authenticate',
    token,
    method: 'token'
  }, handleAuthResponse);
}

/**
 * Handle WebSocket authentication response
 */
function handleAuthResponse(message) {
  if (message.type === 'auth_success' || message.type === 'login_success' || 
      message.type === 'registration_success' || message.type === 'anonymous_login_success') {
    
    isAuthenticated = true;
    currentUser = message.user;
    
    // Save token if provided
    if (message.token) {
      // Update auth service
      updateCurrentUser(message.user, message.token, message.refreshToken);
      
      // Update GraphQL client
      if (graphqlActive) {
        graphqlClient.setAuthToken(message.token);
      }
    }
    
    // Notify listeners
    if (messageHandlers['auth_state_changed']) {
      messageHandlers['auth_state_changed'].forEach(handler => 
        handler({ isAuthenticated, user: currentUser })
      );
    }
    
    // Request initial data
    requestInitialData();
  }
}

/**
 * Handle WebSocket error messages
 */
function handleError(message) {
  console.error('API error:', message.message || 'Unknown error');
  
  // Notify error listeners
  if (messageHandlers['error']) {
    messageHandlers['error'].forEach(handler => handler(message));
  }
}

/**
 * Handle fetch response
 */
function handleFetchResponse(message) {
  // Cache the data locally
  if (message.dataType && message.data) {
    storeUserData(message.dataType, message.data);
  }
  
  // Notify data listeners
  const listenerType = `fetch_${message.dataType}`;
  if (messageHandlers[listenerType]) {
    messageHandlers[listenerType].forEach(handler => handler(message.data));
  }
}

/**
 * Handle mood update response
 */
function handleMoodUpdateResponse(message) {
  // Notify mood update listeners
  if (messageHandlers['mood_update']) {
    messageHandlers['mood_update'].forEach(handler => handler(message.mood));
  }
}

/**
 * Handle received hug
 */
function handleHugReceived(message) {
  // Trigger haptic feedback
  playNotificationHaptic('hug');
  
  // Notify hug listeners
  if (messageHandlers['hug_received']) {
    messageHandlers['hug_received'].forEach(handler => handler(message.hug));
  }
}

/**
 * Handle send hug response
 */
function handleSendHugResponse(message) {
  // Notify hug sent listeners
  if (messageHandlers['hug_sent']) {
    messageHandlers['hug_sent'].forEach(handler => handler(message.hug));
  }
}

/**
 * Handle hug request received
 */
function handleHugRequestReceived(message) {
  // Trigger haptic feedback
  playNotificationHaptic('request');
  
  // Notify hug request listeners
  if (messageHandlers['hug_request_received']) {
    messageHandlers['hug_request_received'].forEach(handler => handler(message.request));
  }
}

/**
 * Handle request hug response
 */
function handleRequestHugResponse(message) {
  // Notify request hug listeners
  if (messageHandlers['request_hug_success']) {
    messageHandlers['request_hug_success'].forEach(handler => handler(message.request));
  }
}

/**
 * Handle group hug invite
 */
function handleGroupHugInvite(message) {
  // Trigger haptic feedback
  playNotificationHaptic('group');
  
  // Notify group hug invite listeners
  if (messageHandlers['group_hug_invite']) {
    messageHandlers['group_hug_invite'].forEach(handler => handler(message.groupHug));
  }
}

/**
 * Handle group hug response
 */
function handleGroupHugResponse(message) {
  // Notify group hug listeners
  if (messageHandlers['group_hug_created']) {
    messageHandlers['group_hug_created'].forEach(handler => handler(message.groupHug));
  }
}

/**
 * Handle badge earned
 */
function handleBadgeEarned(message) {
  // Trigger haptic feedback
  playNotificationHaptic('achievement');
  
  // Notify badge listeners
  if (messageHandlers['badge_earned']) {
    messageHandlers['badge_earned'].forEach(handler => handler(message.badge));
  }
}

/**
 * Handle streak milestone
 */
function handleStreakMilestone(message) {
  // Trigger haptic feedback
  playNotificationHaptic('achievement');
  
  // Notify streak listeners
  if (messageHandlers['streak_milestone']) {
    messageHandlers['streak_milestone'].forEach(handler => handler(message));
  }
}

/**
 * Handle user status update
 */
function handleUserStatusUpdate(message) {
  // Notify user status listeners
  if (messageHandlers['user_status']) {
    messageHandlers['user_status'].forEach(handler => handler({
      userId: message.userId,
      isOnline: message.isOnline
    }));
  }
}

/**
 * Handle follower update
 */
function handleFollowerUpdate(message) {
  // Notify follower update listeners
  if (messageHandlers['follower_update']) {
    messageHandlers['follower_update'].forEach(handler => handler({
      userId: message.userId,
      isFollowing: message.isFollowing
    }));
  }
}

/**
 * Request initial data after authentication
 */
function requestInitialData() {
  // Fetch user's mood history
  fetchData('mood_history');
  
  // Fetch user's hug history
  fetchData('hugs_received');
  
  // Fetch user's mood insights
  fetchData('mood_insights');
  
  // Fetch user's streak information
  fetchData('mood_streak');
  
  // Fetch friend data
  fetchData('following');
  fetchData('followers');
  
  // Fetch pending hug requests
  fetchData('hug_requests');
  
  // Fetch active group hugs
  fetchData('group_hugs');
}

/**
 * Register a handler for a specific message type
 */
export const registerMessageHandler = (messageType, handler) => {
  if (!messageHandlers[messageType]) {
    messageHandlers[messageType] = [];
  }
  
  messageHandlers[messageType].push(handler);
  
  // Return a function to unregister the handler
  return () => {
    messageHandlers[messageType] = messageHandlers[messageType].filter(h => h !== handler);
  };
};

/**
 * Fetch data from the server using GraphQL
 */
export const fetchData = async (dataType, params = {}) => {
  const service = getServiceForDataType(dataType);
  
  if (!service) {
    console.error(`Unknown data type: ${dataType}`);
    return null;
  }
  
  // Try to use GraphQL
  if (graphqlActive) {
    try {
      const result = await fetchDataGraphQL(dataType, params);
      
      // Cache successful results
      if (result) {
        storeUserData(dataType, result);
      }
      
      return result;
    } catch (error) {
      console.warn(`GraphQL fetch failed for ${dataType}:`, error);
    }
  }
  
  // If GraphQL fails, try to get cached data
  console.warn(`Failed to fetch ${dataType} from server, trying local cache`);
  const cachedData = await getUserData(dataType);
  
  return cachedData;
};

/**
 * Fetch data using GraphQL
 */
async function fetchDataGraphQL(dataType, params) {
  let query;
  let variables = {};
  
  // Build query based on data type
  switch (dataType) {
    case 'user_profile':
      query = `
        query GetUserProfile($userId: ID!) {
          userProfile(userId: $userId) {
            id
            userId
            displayName
            bio
            location
            website
            pronouns
            profileVisibility
            moodVisibility
            isFollowing
            isFollowedBy
            isFriend
            stats {
              followingCount
              followersCount
              hugsGiven
              hugsReceived
              moodEntries
              currentStreak
            }
            createdAt
            updatedAt
          }
        }
      `;
      variables = { userId: params.userId || currentUser?.id };
      break;
      
    case 'mood_history':
      query = `
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
      variables = { 
        userId: params.userId || currentUser?.id,
        period: params.period || '30days'
      };
      break;
      
    case 'mood_analytics':
      query = `
        query GetMoodAnalytics($userId: ID!, $timeRange: Int, $includeCorrelations: Boolean) {
          moodAnalytics(userId: $userId, timeRange: $timeRange, includeCorrelations: $includeCorrelations) {
            userId
            timeRange
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
              moodByDayOfWeek
              moodByTimeOfDay
            }
            correlations {
              activities
              sleep {
                correlation
                impact
                direction
              }
              weather {
                correlation
                impact
                direction
              }
              screenTime {
                correlation
                impact
                direction
              }
            }
            insights {
              id
              type
              title
              description
              priority
              isRead
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
      variables = { 
        userId: params.userId || currentUser?.id,
        timeRange: params.timeRange || 30,
        includeCorrelations: params.includeCorrelations !== false
      };
      break;
      
    case 'mood_insights':
      query = `
        query GetMoodInsights($userId: ID!, $limit: Int, $offset: Int) {
          moodInsights(userId: $userId, limit: $limit, offset: $offset) {
            id
            userId
            type
            title
            description
            data
            priority
            isRead
            expiresAt
            createdAt
          }
        }
      `;
      variables = { 
        userId: params.userId || currentUser?.id,
        limit: params.limit || 10,
        offset: params.offset || 0
      };
      break;
      
    case 'mood_streak':
      query = `
        query GetMoodStreak($userId: ID!) {
          moodStreak(userId: $userId) {
            userId
            currentStreak
            longestStreak
            lastRecordedAt
          }
        }
      `;
      variables = { userId: params.userId || currentUser?.id };
      break;
      
    case 'hugs_received':
      query = `
        query GetHugs($userId: ID!, $type: String, $limit: Int, $offset: Int) {
          hugs(userId: $userId, type: $type, limit: $limit, offset: $offset) {
            hugs {
              id
              sender {
                id
                name
                username
                avatar
                isOnline
              }
              recipient {
                id
                name
                username
                avatar
                isOnline
              }
              hugType
              message
              isRead
              mediaUrl
              createdAt
              updatedAt
            }
            totalCount
            hasMore
          }
        }
      `;
      variables = { 
        userId: params.userId || currentUser?.id,
        type: params.type || 'received',
        limit: params.limit || 20,
        offset: params.offset || 0
      };
      break;
      
    case 'hug_requests':
      query = `
        query GetHugRequests($userId: ID!, $status: String, $limit: Int, $offset: Int) {
          hugRequests(userId: $userId, status: $status, limit: $limit, offset: $offset) {
            requests {
              id
              requester {
                id
                name
                username
                avatar
                isOnline
              }
              recipient {
                id
                name
                username
                avatar
                isOnline
              }
              message
              isPublic
              status
              expiresAt
              createdAt
              updatedAt
            }
            totalCount
            hasMore
          }
        }
      `;
      variables = { 
        userId: params.userId || currentUser?.id,
        status: params.status || 'pending',
        limit: params.limit || 20,
        offset: params.offset || 0
      };
      break;
      
    case 'group_hugs':
      query = `
        query GetGroupHugs($userId: ID!, $status: String, $limit: Int, $offset: Int) {
          groupHugs(userId: $userId, status: $status, limit: $limit, offset: $offset) {
            groups {
              id
              creator {
                id
                name
                username
                avatar
                isOnline
              }
              title
              message
              hugType
              maxParticipants
              isPublic
              expiresAt
              createdAt
              updatedAt
              participantCount
              hasJoined
            }
            totalCount
            hasMore
          }
        }
      `;
      variables = { 
        userId: params.userId || currentUser?.id,
        status: params.status || 'active',
        limit: params.limit || 20,
        offset: params.offset || 0
      };
      break;
      
    case 'following':
      query = `
        query GetFollowing($userId: ID!, $limit: Int, $offset: Int) {
          following(userId: $userId, limit: $limit, offset: $offset) {
            users {
              id
              userId
              displayName
              isFollowing
              isFollowedBy
              isFriend
            }
            totalCount
            hasMore
          }
        }
      `;
      variables = { 
        userId: params.userId || currentUser?.id,
        limit: params.limit || 20,
        offset: params.offset || 0
      };
      break;
      
    case 'followers':
      query = `
        query GetFollowers($userId: ID!, $limit: Int, $offset: Int) {
          followers(userId: $userId, limit: $limit, offset: $offset) {
            users {
              id
              userId
              displayName
              isFollowing
              isFollowedBy
              isFriend
            }
            totalCount
            hasMore
          }
        }
      `;
      variables = { 
        userId: params.userId || currentUser?.id,
        limit: params.limit || 20,
        offset: params.offset || 0
      };
      break;
      
    case 'media_hugs':
      query = `
        query GetMediaHugs($category: String, $mood: String, $limit: Int, $offset: Int) {
          mediaHugs(category: $category, mood: $mood, limit: $limit, offset: $offset) {
            mediaHugs {
              id
              title
              description
              creator {
                id
                name
                username
                avatar
              }
              mediaType
              mediaUrl
              thumbnailUrl
              duration
              category
              tags
              moodTags
              viewCount
              likeCount
              isFavorite
              isLiked
              createdAt
            }
            totalCount
            hasMore
          }
        }
      `;
      variables = { 
        category: params.category,
        mood: params.mood,
        limit: params.limit || 20,
        offset: params.offset || 0
      };
      break;
      
    case 'user_settings':
      query = `
        query GetUserSettings {
          userSettings {
            id
            userId
            themePreference
            enableMoodReminders
            moodReminderTime
            enableHapticFeedback
            receiveHugNotifications
            receiveMoodNotifications
            enableSounds
            createdAt
            updatedAt
          }
        }
      `;
      break;
      
    case 'community_feed':
      query = `
        query GetCommunityMoods($limit: Int, $offset: Int) {
          communityMoods(limit: $limit, offset: $offset) {
            moods {
              id
              userId
              value
              score
              note
              isPublic
              createdAt
            }
            totalCount
            hasMore
          }
        }
      `;
      variables = { 
        limit: params.limit || 20,
        offset: params.offset || 0
      };
      break;
      
    default:
      throw new Error(`Unknown data type: ${dataType}`);
  }
  
  // Execute query
  const result = await graphqlClient.query(query, variables);
  
  // Extract data from the response
  if (result.data) {
    // Convert to a simpler format that matches the WebSocket API
    // The first key in the data object will be the query name
    const key = Object.keys(result.data)[0];
    return result.data[key];
  }
  
  return null;
}

/**
 * Get the service for a data type
 */
function getServiceForDataType(dataType) {
  if (['user_profile', 'following', 'followers', 'friend_requests'].includes(dataType)) {
    return 'profiles';
  } else if (['mood_history', 'mood_analytics', 'mood_insights', 'mood_streak'].includes(dataType)) {
    return 'mood';
  } else if (['hugs_received', 'hugs_sent', 'hug_requests', 'group_hugs'].includes(dataType)) {
    return 'hugs';
  } else if (['media_hugs', 'featured_media', 'popular_media'].includes(dataType)) {
    return 'media';
  } else if (['user_settings', 'notification_preferences'].includes(dataType)) {
    return 'settings';
  } else if (['community_feed'].includes(dataType)) {
    return 'community';
  }
  
  return null;
}

/**
 * Update user's mood
 */
export const updateMood = async (mood, note = null, isPublic = false) => {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  if (!graphqlActive) {
    throw new Error('GraphQL service is not available');
  }
  
  // Get mood score
  const moodScore = typeof getMoodScore === 'function' ? getMoodScore(mood) : 5;
  
  try {
    const mutation = `
      mutation CreateMood($input: CreateMoodInput!) {
        createMood(input: $input) {
          id
          userId
          value
          score
          note
          isPublic
          createdAt
          updatedAt
        }
      }
    `;
    
    const variables = {
      input: {
        value: mood,
        note,
        isPublic,
        score: moodScore
      }
    };
    
    const result = await graphqlClient.mutate(mutation, variables);
    
    if (result.data?.createMood) {
      // Notify listeners
      if (messageHandlers['mood_update_success']) {
        messageHandlers['mood_update_success'].forEach(handler => 
          handler({ mood: result.data.createMood })
        );
      }
      
      return result.data.createMood;
    }
    
    throw new Error('Failed to update mood');
  } catch (error) {
    console.error('GraphQL mood update failed:', error);
    throw error;
  }
};

/**
 * Send a hug to a user
 */
export const sendHug = async (recipientId, hugType, message = null) => {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  if (!graphqlActive) {
    throw new Error('GraphQL service is not available');
  }
  
  try {
    const mutation = `
      mutation SendHug($input: SendHugInput!) {
        sendHug(input: $input) {
          id
          sender {
            id
            name
            username
            avatar
          }
          recipient {
            id
            name
            username
            avatar
          }
          hugType
          message
          createdAt
        }
      }
    `;
    
    const variables = {
      input: {
        recipientId,
        hugType,
        message
      }
    };
    
    const result = await graphqlClient.mutate(mutation, variables);
    
    if (result.data?.sendHug) {
      // Notify listeners
      if (messageHandlers['hug_sent']) {
        messageHandlers['hug_sent'].forEach(handler => 
          handler({ hug: result.data.sendHug })
        );
      }
      
      return result.data.sendHug;
    }
    
    throw new Error('Failed to send hug');
  } catch (error) {
    console.error('GraphQL send hug failed:', error);
    throw error;
  }
};

/**
 * Request a hug
 */
export const requestHug = async (requestData) => {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  if (!graphqlActive) {
    throw new Error('GraphQL service is not available');
  }
  
  try {
    const mutation = `
      mutation RequestHug($input: RequestHugInput!) {
        requestHug(input: $input) {
          id
          requester {
            id
            name
            username
            avatar
          }
          recipient {
            id
            name
            username
            avatar
          }
          message
          isPublic
          status
          expiresAt
          createdAt
        }
      }
    `;
    
    const variables = {
      input: {
        recipientId: requestData.recipientId,
        message: requestData.message,
        isPublic: requestData.isPublic
      }
    };
    
    const result = await graphqlClient.mutate(mutation, variables);
    
    if (result.data?.requestHug) {
      // Notify listeners if needed
      if (messageHandlers['request_hug_success']) {
        messageHandlers['request_hug_success'].forEach(handler => 
          handler({ request: result.data.requestHug })
        );
      }
      
      return result.data.requestHug;
    }
    
    throw new Error('Failed to request hug');
  } catch (error) {
    console.error('GraphQL request hug failed:', error);
    throw error;
  }
};

/**
 * Create a group hug
 */
export const createGroupHug = async (groupData) => {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  if (!graphqlActive) {
    throw new Error('GraphQL service is not available');
  }
  
  try {
    const mutation = `
      mutation CreateGroupHug($input: CreateGroupHugInput!) {
        createGroupHug(input: $input) {
          id
          creator {
            id
            name
            username
            avatar
          }
          title
          message
          hugType
          maxParticipants
          isPublic
          expiresAt
          participantCount
          hasJoined
          createdAt
        }
      }
    `;
    
    const variables = {
      input: {
        title: groupData.title,
        message: groupData.message,
        hugType: groupData.hugType,
        maxParticipants: groupData.maxParticipants,
        isPublic: groupData.isPublic,
        duration: groupData.duration,
        invitedUsers: groupData.invitedUsers
      }
    };
    
    const result = await graphqlClient.mutate(mutation, variables);
    
    if (result.data?.createGroupHug) {
      // Notify listeners if needed
      if (messageHandlers['group_hug_created']) {
        messageHandlers['group_hug_created'].forEach(handler => 
          handler({ groupHug: result.data.createGroupHug })
        );
      }
      
      return result.data.createGroupHug;
    }
    
    throw new Error('Failed to create group hug');
  } catch (error) {
    console.error('GraphQL create group hug failed:', error);
    throw error;
  }
};

/**
 * Join a group hug
 */
export const joinGroupHug = async (groupId) => {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  if (!graphqlActive) {
    throw new Error('GraphQL service is not available');
  }
  
  try {
    const mutation = `
      mutation JoinGroupHug($id: ID!) {
        joinGroupHug(id: $id) {
          id
          user {
            id
            name
            username
            avatar
          }
          status
          joinedAt
        }
      }
    `;
    
    const variables = { id: groupId };
    
    const result = await graphqlClient.mutate(mutation, variables);
    
    if (result.data?.joinGroupHug) {
      return result.data.joinGroupHug;
    }
    
    throw new Error('Failed to join group hug');
  } catch (error) {
    console.error('GraphQL join group hug failed:', error);
    throw error;
  }
};

/**
 * Follow a user
 */
export const followUser = async (userId) => {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  if (!graphqlActive) {
    throw new Error('GraphQL service is not available');
  }
  
  try {
    const mutation = `
      mutation FollowUser($userId: ID!) {
        followUser(userId: $userId) {
          success
          user {
            id
            userId
            displayName
            isFollowing
            isFollowedBy
          }
        }
      }
    `;
    
    const variables = { userId };
    
    const result = await graphqlClient.mutate(mutation, variables);
    
    if (result.data?.followUser) {
      // Notify listeners if needed
      if (messageHandlers['follower_update']) {
        messageHandlers['follower_update'].forEach(handler => 
          handler({ 
            userId: userId,
            isFollowing: true
          })
        );
      }
      
      return result.data.followUser;
    }
    
    throw new Error('Failed to follow user');
  } catch (error) {
    console.error('GraphQL follow user failed:', error);
    throw error;
  }
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (userId) => {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  if (!graphqlActive) {
    throw new Error('GraphQL service is not available');
  }
  
  try {
    const mutation = `
      mutation UnfollowUser($userId: ID!) {
        unfollowUser(userId: $userId) {
          success
          user {
            id
            userId
            displayName
            isFollowing
            isFollowedBy
          }
        }
      }
    `;
    
    const variables = { userId };
    
    const result = await graphqlClient.mutate(mutation, variables);
    
    if (result.data?.unfollowUser) {
      // Notify listeners if needed
      if (messageHandlers['follower_update']) {
        messageHandlers['follower_update'].forEach(handler => 
          handler({ 
            userId: userId,
            isFollowing: false
          })
        );
      }
      
      return result.data.unfollowUser;
    }
    
    throw new Error('Failed to unfollow user');
  } catch (error) {
    console.error('GraphQL unfollow user failed:', error);
    throw error;
  }
};

/**
 * Share to social platform
 */
export const shareToSocial = async (platform, contentType, contentId, text) => {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  if (!graphqlActive) {
    throw new Error('GraphQL service is not available');
  }
  
  try {
    const mutation = `
      mutation ShareToSocial($input: SocialShareInput!) {
        shareToSocial(input: $input) {
          success
          message
          url
        }
      }
    `;
    
    const variables = {
      input: {
        platform,
        contentType,
        contentId,
        text
      }
    };
    
    const result = await graphqlClient.mutate(mutation, variables);
    
    if (result.data?.shareToSocial) {
      return result.data.shareToSocial;
    }
    
    throw new Error('Failed to share to social platform');
  } catch (error) {
    console.error('GraphQL social share failed:', error);
    throw error;
  }
};

/**
 * View media hug
 */
export const viewMediaHug = async (mediaId) => {
  if (!graphqlActive) {
    throw new Error('GraphQL service is not available');
  }
  
  try {
    const mutation = `
      mutation ViewMediaHug($id: ID!) {
        viewMediaHug(id: $id) {
          id
          title
          viewCount
          likeCount
        }
      }
    `;
    
    const variables = { id: mediaId };
    
    const result = await graphqlClient.mutate(mutation, variables);
    
    if (result.data?.viewMediaHug) {
      return result.data.viewMediaHug;
    }
    
    throw new Error('Failed to view media hug');
  } catch (error) {
    console.error('GraphQL view media failed:', error);
    throw error;
  }
};

/**
 * Favorite media hug
 */
export const favoriteMediaHug = async (mediaId, isFavorite) => {
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  if (!graphqlActive) {
    throw new Error('GraphQL service is not available');
  }
  
  try {
    const mutation = `
      mutation FavoriteMediaHug($id: ID!, $isFavorite: Boolean!) {
        favoriteMediaHug(id: $id, isFavorite: $isFavorite) {
          id
          mediaHug {
            id
            title
            isFavorite
            likeCount
          }
        }
      }
    `;
    
    const variables = { 
      id: mediaId,
      isFavorite
    };
    
    const result = await graphqlClient.mutate(mutation, variables);
    
    if (result.data?.favoriteMediaHug) {
      return result.data.favoriteMediaHug;
    }
    
    throw new Error('Failed to favorite media hug');
  } catch (error) {
    console.error('GraphQL favorite media failed:', error);
    throw error;
  }
};

/**
 * Get a numeric score for a mood
 */
function getMoodScore(mood) {
  const moodScores = {
    'angry': 1,
    'frustrated': 2,
    'sad': 2,
    'anxious': 3,
    'tired': 4,
    'bored': 4,
    'neutral': 5,
    'calm': 6,
    'relaxed': 7,
    'focused': 7,
    'happy': 8,
    'excited': 9,
    'grateful': 9,
    'joyful': 10
  };
  
  return moodScores[mood.toLowerCase()] || 5;
}

/**
 * Close the API service connections
 */
export const close = () => {
  if (graphqlActive) {
    graphqlClient.close();
    graphqlActive = false;
  }
};

export const features = FEATURES;