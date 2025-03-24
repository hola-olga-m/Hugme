const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.API_GATEWAY_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001/graphql';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4002/graphql';
const MOOD_SERVICE_URL = process.env.MOOD_SERVICE_URL || 'http://localhost:4003/graphql';
const HUG_SERVICE_URL = process.env.HUG_SERVICE_URL || 'http://localhost:4004/graphql';
const GRAPHQL_GATEWAY_URL = process.env.GRAPHQL_GATEWAY_URL || 'http://localhost:4000/graphql';

// WebSocket Server
const wss = new WebSocket.Server({ server, path: '/ws' });

// Map to track active clients
const clients = new Map();

// Handler for incoming WebSocket connections
wss.on('connection', (ws, req) => {
  // Generate unique client ID
  const clientId = uuidv4();
  
  // Log connection info
  console.log('Client connected:', {
    ip: req.socket.remoteAddress,
    path: req.url,
    headers: {
      origin: req.headers.origin,
      host: req.headers.host,
      upgrade: req.headers.upgrade
    }
  });
  
  // Store client details
  const clientInfo = {
    id: clientId,
    ws,
    authenticated: false,
    userId: null,
    lastActivity: new Date()
  };
  
  clients.set(clientId, clientInfo);
  
  // Handle messages from this client
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log('Received message from client:', message);
      
      // Update last activity timestamp
      clientInfo.lastActivity = new Date();
      
      // Process message based on type
      handleClientMessage(ws, clientId, message);
    } catch (error) {
      console.error('Error processing message:', error);
      send(ws, { type: 'error', message: 'Invalid message format' });
    }
  });
  
  // Handle client disconnection
  ws.on('close', (code, reason) => {
    const client = clients.get(clientId);
    console.log('Client disconnected with code:', code, 'reason:', reason);
    console.log('Client details:', clientId, 'authenticated:', client.authenticated, 'userId:', client.userId || 'none');
    
    // Clean up client resources
    if (client && client.authenticated && client.userId) {
      // Broadcast user offline status
      broadcastUserStatus(client.userId, false);
    }
    
    // Remove client from map
    clients.delete(clientId);
    console.log('Clients remaining:', clients.size);
  });
  
  // Handle WebSocket errors
  ws.on('error', (error) => {
    console.error('WebSocket error for client', clientId, ':', error);
  });
  
  // Send welcome message
  send(ws, { type: 'connection_established', message: 'Connected to HugMood API' });
});

/**
 * Handle messages from clients
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {string} clientId - The client ID
 * @param {Object} message - The parsed message from the client
 */
function handleClientMessage(ws, clientId, message) {
  const client = clients.get(clientId);
  
  // Handle ping for connection keepalive
  if (message.type === 'ping') {
    send(ws, { type: 'pong', timestamp: Date.now() });
    return;
  }
  
  // Handle authentication
  if (message.type === 'authenticate') {
    console.log('Full authentication message:', message);
    handleAuthentication(ws, clientId, message);
    return;
  }
  
  // Handle data fetching
  if (message.type === 'fetch_data') {
    handleFetchData(ws, client, message)
      .catch(error => {
        console.error('Error fetching data:', error);
        send(ws, { 
          type: 'error', 
          requestId: message.requestId,
          dataType: message.dataType,
          message: 'Failed to fetch data'
        });
      });
    return;
  }
  
  // Handle mood updates
  if (message.type === 'update_mood') {
    handleMoodUpdate(ws, client, message)
      .catch(error => {
        console.error('Error updating mood:', error);
        send(ws, { 
          type: 'error', 
          callbackId: message.callbackId,
          message: 'Failed to update mood: ' + error.message
        });
      });
    return;
  }
  
  // Handle sending hugs
  if (message.type === 'send_hug') {
    handleSendHug(ws, client, message)
      .catch(error => {
        console.error('Error sending hug:', error);
        send(ws, { 
          type: 'error', 
          callbackId: message.callbackId,
          message: 'Failed to send hug: ' + error.message
        });
      });
    return;
  }
  
  // Handle hug requests
  if (message.type === 'request_hug') {
    handleHugRequest(ws, client, message)
      .catch(error => {
        console.error('Error requesting hug:', error);
        send(ws, { 
          type: 'error', 
          callbackId: message.callbackId,
          message: 'Failed to request hug: ' + error.message
        });
      });
    return;
  }
  
  // Handle group hug creation
  if (message.type === 'create_group_hug') {
    handleCreateGroupHug(ws, client, message)
      .catch(error => {
        console.error('Error creating group hug:', error);
        send(ws, { 
          type: 'error', 
          callbackId: message.callbackId,
          message: 'Failed to create group hug: ' + error.message
        });
      });
    return;
  }
  
  // Handle following a user
  if (message.type === 'follow_user') {
    handleFollowUser(ws, client, message)
      .catch(error => {
        console.error('Error following user:', error);
        send(ws, { 
          type: 'error', 
          callbackId: message.callbackId,
          message: 'Failed to follow user: ' + error.message
        });
      });
    return;
  }
  
  // Handle social sharing
  if (message.type === 'social_share') {
    handleSocialShare(ws, client, message)
      .catch(error => {
        console.error('Error sharing to social platform:', error);
        send(ws, { 
          type: 'error', 
          callbackId: message.callbackId,
          message: 'Failed to share content: ' + error.message
        });
      });
    return;
  }
  
  // If we reach here, the message type was not recognized
  console.log('Unrecognized message type:', message.type);
  send(ws, { 
    type: 'error', 
    callbackId: message.callbackId,
    message: 'Unrecognized message type'
  });
}

/**
 * Handle user authentication
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {string} clientId - The client ID
 * @param {Object} message - The authentication data
 */
async function handleAuthentication(ws, clientId, message) {
  const client = clients.get(clientId);
  
  try {
    // Extract auth data
    const authData = {
      method: message.method,
      token: message.token,
      userId: message.userId,
      userData: message.userData,
      credentials: message.credentials
    };
    
    console.log('Processed authentication data:', authData);
    console.log('Authentication request:', authData);
    
    // Handle token authentication
    if (authData.method === 'token' && authData.token && authData.token !== 'undefined') {
      try {
        // Verify token with Auth Service
        const response = await fetch(AUTH_SERVICE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token}`
          },
          body: JSON.stringify({
            query: `
              query {
                me {
                  id
                  username
                  email
                  name
                  isAnonymous
                  isVerified
                }
              }
            `
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        if (!result.data || !result.data.me) {
          throw new Error('Invalid token');
        }
        
        const userData = result.data.me;
        
        // Update client info
        client.authenticated = true;
        client.userId = userData.id;
        
        // Send authentication success response
        send(ws, {
          type: 'auth_success',
          userId: userData.id,
          user: userData,
          token: authData.token
        });
        
        // Broadcast user online status
        broadcastUserStatus(userData.id, true);
        
        console.log(`Client ${clientId} authenticated as user ${userData.id}`);
      } catch (error) {
        console.error('Token authentication error:', error.message);
        send(ws, { 
          type: 'auth_error', 
          callbackId: message.callbackId,
          message: 'Authentication failed: ' + error.message
        });
      }
      return;
    }
    
    // Handle username/password authentication
    if (authData.method === 'credentials' && authData.credentials) {
      try {
        const { emailOrUsername, password } = authData.credentials;
        
        // Authenticate with Auth Service
        const response = await fetch(AUTH_SERVICE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              mutation {
                login(input: {
                  emailOrUsername: "${emailOrUsername}",
                  password: "${password}"
                }) {
                  token
                  refreshToken
                  user {
                    id
                    username
                    email
                    name
                    isAnonymous
                    isVerified
                  }
                }
              }
            `
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        if (!result.data || !result.data.login) {
          throw new Error('Login failed');
        }
        
        const { token, refreshToken, user } = result.data.login;
        
        // Update client info
        client.authenticated = true;
        client.userId = user.id;
        
        // Send authentication success response
        send(ws, {
          type: 'login_success',
          userId: user.id,
          user,
          token,
          refreshToken
        });
        
        // Broadcast user online status
        broadcastUserStatus(user.id, true);
        
        console.log(`Client ${clientId} logged in as user ${user.id}`);
      } catch (error) {
        console.error('Login error:', error.message);
        send(ws, { 
          type: 'auth_error', 
          callbackId: message.callbackId,
          message: 'Login failed: ' + error.message
        });
      }
      return;
    }
    
    // Handle registration
    if (authData.method === 'register' && authData.userData) {
      try {
        const { email, username, password, name } = authData.userData;
        
        // Register with Auth Service
        const response = await fetch(AUTH_SERVICE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              mutation {
                register(input: {
                  email: "${email}",
                  username: "${username}",
                  password: "${password}",
                  name: "${name || username}"
                }) {
                  token
                  refreshToken
                  user {
                    id
                    username
                    email
                    name
                    isAnonymous
                    isVerified
                  }
                }
              }
            `
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        if (!result.data || !result.data.register) {
          throw new Error('Registration failed');
        }
        
        const { token, refreshToken, user } = result.data.register;
        
        // Update client info
        client.authenticated = true;
        client.userId = user.id;
        
        // Send registration success response
        send(ws, {
          type: 'registration_success',
          userId: user.id,
          user,
          token,
          refreshToken
        });
        
        // Broadcast user online status
        broadcastUserStatus(user.id, true);
        
        console.log(`Client ${clientId} registered and logged in as user ${user.id}`);
      } catch (error) {
        console.error('Registration error:', error.message);
        send(ws, { 
          type: 'auth_error', 
          callbackId: message.callbackId,
          message: 'Registration failed: ' + error.message
        });
      }
      return;
    }
    
    // Handle anonymous login
    if (authData.method === 'anonymous') {
      try {
        const nickname = authData.userData?.nickname;
        const avatarId = authData.userData?.avatarId;
        
        // Anonymous login with Auth Service
        const response = await fetch(AUTH_SERVICE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              mutation {
                anonymousLogin(
                  nickname: ${nickname ? `"${nickname}"` : null},
                  avatarId: ${avatarId || null}
                ) {
                  token
                  refreshToken
                  user {
                    id
                    username
                    name
                    isAnonymous
                    isVerified
                  }
                }
              }
            `
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        if (!result.data || !result.data.anonymousLogin) {
          throw new Error('Anonymous login failed');
        }
        
        const { token, refreshToken, user } = result.data.anonymousLogin;
        
        // Update client info
        client.authenticated = true;
        client.userId = user.id;
        
        // Send anonymous login success response
        send(ws, {
          type: 'anonymous_login_success',
          userId: user.id,
          user,
          token,
          refreshToken
        });
        
        // Broadcast user online status
        broadcastUserStatus(user.id, true);
        
        console.log(`Client ${clientId} logged in anonymously as user ${user.id}`);
      } catch (error) {
        console.error('Anonymous login error:', error.message);
        send(ws, { 
          type: 'auth_error', 
          callbackId: message.callbackId,
          message: 'Anonymous login failed: ' + error.message
        });
      }
      return;
    }
    
    // If we reach here, no valid authentication method was provided
    console.error('Invalid authentication method:', authData.method);
    send(ws, { 
      type: 'auth_error', 
      callbackId: message.callbackId,
      message: 'Invalid authentication method'
    });
  } catch (error) {
    console.error('Authentication error:', error);
    send(ws, { 
      type: 'auth_error', 
      callbackId: message.callbackId,
      message: 'Authentication failed: ' + error.message
    });
  }
}

/**
 * Handle fetching data
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Object} client - The client object
 * @param {Object} message - The fetch request data
 */
async function handleFetchData(ws, client, message) {
  if (!client.authenticated) {
    send(ws, { 
      type: 'error', 
      callbackId: message.callbackId,
      message: 'Authentication required'
    });
    return;
  }
  
  // Extract request data
  const { dataType, ...params } = message;
  
  // Determine which service to use
  let serviceUrl;
  let query;
  
  switch (dataType) {
    case 'mood_history':
    case 'mood_analytics':
    case 'mood_insights':
    case 'mood_streak':
      serviceUrl = MOOD_SERVICE_URL;
      break;
      
    case 'user_profile':
    case 'following':
    case 'followers':
      serviceUrl = USER_SERVICE_URL;
      break;
      
    case 'hugs_received':
    case 'hugs_sent':
    case 'hug_requests':
    case 'group_hugs':
    case 'media_hugs':
      serviceUrl = HUG_SERVICE_URL;
      break;
      
    case 'community_feed':
      serviceUrl = MOOD_SERVICE_URL;
      break;
      
    default:
      // Use GraphQL Gateway for other data types
      serviceUrl = GRAPHQL_GATEWAY_URL;
  }
  
  // Build GraphQL query based on data type
  switch (dataType) {
    case 'mood_history':
      query = `
        query {
          moodHistory(userId: "${client.userId}", period: "${params.period || '30days'}") {
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
      break;
      
    case 'mood_analytics':
      query = `
        query {
          moodAnalytics(
            userId: "${client.userId}", 
            timeRange: ${params.timeRange || 30}, 
            includeCorrelations: ${params.includeCorrelations !== false}
          ) {
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
      break;
      
    case 'mood_insights':
      query = `
        query {
          moodInsights(userId: "${client.userId}") {
            id
            type
            title
            description
            data
            priority
            isRead
            createdAt
          }
        }
      `;
      break;
      
    case 'mood_streak':
      query = `
        query {
          moodStreak(userId: "${client.userId}") {
            currentStreak
            longestStreak
            lastRecordedAt
          }
        }
      `;
      break;
      
    case 'user_profile':
      query = `
        query {
          userProfile(userId: "${params.userId || client.userId}") {
            id
            userId
            displayName
            bio
            location
            website
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
          }
        }
      `;
      break;
      
    case 'following':
      query = `
        query {
          following(
            userId: "${params.userId || client.userId}", 
            limit: ${params.limit || 20}, 
            offset: ${params.offset || 0}
          ) {
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
      break;
      
    case 'followers':
      query = `
        query {
          followers(
            userId: "${params.userId || client.userId}", 
            limit: ${params.limit || 20}, 
            offset: ${params.offset || 0}
          ) {
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
      break;
      
    case 'hugs_received':
    case 'hugs_sent':
      const type = dataType === 'hugs_sent' ? 'sent' : 'received';
      query = `
        query {
          hugs(
            userId: "${client.userId}", 
            type: "${type}", 
            limit: ${params.limit || 20}, 
            offset: ${params.offset || 0}
          ) {
            hugs {
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
              isRead
              createdAt
            }
            totalCount
            hasMore
          }
        }
      `;
      break;
      
    case 'hug_requests':
      query = `
        query {
          hugRequests(
            userId: "${client.userId}", 
            status: "${params.status || 'pending'}", 
            limit: ${params.limit || 20}, 
            offset: ${params.offset || 0}
          ) {
            requests {
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
            totalCount
            hasMore
          }
        }
      `;
      break;
      
    case 'group_hugs':
      query = `
        query {
          groupHugs(
            userId: "${client.userId}", 
            status: "${params.status || 'active'}", 
            limit: ${params.limit || 20}, 
            offset: ${params.offset || 0}
          ) {
            groups {
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
              participantCount
              hasJoined
              expiresAt
              createdAt
            }
            totalCount
            hasMore
          }
        }
      `;
      break;
      
    case 'media_hugs':
      query = `
        query {
          mediaHugs(
            category: ${params.category ? `"${params.category}"` : null}, 
            mood: ${params.mood ? `"${params.mood}"` : null}, 
            limit: ${params.limit || 20}, 
            offset: ${params.offset || 0}
          ) {
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
              category
              tags
              moodTags
              viewCount
              likeCount
              isFavorite
              createdAt
            }
            totalCount
            hasMore
          }
        }
      `;
      break;
      
    case 'community_feed':
      query = `
        query {
          communityMoods(limit: ${params.limit || 20}, offset: ${params.offset || 0}) {
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
      break;
      
    default:
      send(ws, { 
        type: 'error', 
        callbackId: message.callbackId,
        message: `Unknown data type: ${dataType}`
      });
      return;
  }
  
  try {
    // Execute GraphQL query
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${params.token || ''}`
      },
      body: JSON.stringify({ query })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    // Extract data from result
    let data = null;
    
    if (result.data) {
      // The first key in the data object will be the query name
      const key = Object.keys(result.data)[0];
      data = result.data[key];
    }
    
    // Send success response
    send(ws, {
      type: 'fetch_success',
      callbackId: message.callbackId,
      dataType,
      data
    });
  } catch (error) {
    console.error(`Error fetching ${dataType}:`, error);
    send(ws, { 
      type: 'error', 
      callbackId: message.callbackId,
      message: `Failed to fetch ${dataType}: ${error.message}`
    });
  }
}

/**
 * Handle mood update
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Object} client - The client object
 * @param {Object} data - The mood data
 */
async function handleMoodUpdate(ws, client, data) {
  if (!client.authenticated) {
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: 'Authentication required'
    });
    return;
  }
  
  try {
    // Extract mood data
    const { mood, note, isPublic, score } = data;
    
    // Create mood via GraphQL
    const mutation = `
      mutation {
        createMood(input: {
          value: "${mood}",
          note: ${note ? `"${note}"` : null},
          isPublic: ${isPublic || false},
          score: ${score || null}
        }) {
          id
          userId
          value
          score
          note
          isPublic
          createdAt
        }
      }
    `;
    
    const response = await fetch(MOOD_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token || ''}`
      },
      body: JSON.stringify({ query: mutation })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    if (!result.data || !result.data.createMood) {
      throw new Error('Failed to create mood');
    }
    
    const newMood = result.data.createMood;
    
    // Send success response
    send(ws, {
      type: 'mood_update_success',
      callbackId: data.callbackId,
      mood: newMood
    });
    
    // Check if mood is public and broadcast if needed
    if (isPublic) {
      broadcastMoodUpdate(client.userId, {
        id: newMood.id,
        userId: client.userId,
        value: mood,
        score,
        note,
        isPublic,
        timestamp: newMood.createdAt
      });
    }
    
    // Check for streak milestones
    const streakResult = await fetch(MOOD_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token || ''}`
      },
      body: JSON.stringify({
        query: `
          query {
            moodStreak(userId: "${client.userId}") {
              currentStreak
              longestStreak
            }
          }
        `
      })
    });
    
    const streakData = await streakResult.json();
    
    if (streakData.data && streakData.data.moodStreak) {
      const { currentStreak } = streakData.data.moodStreak;
      
      // Check for milestone (e.g., 3, 7, 14, 30, etc.)
      if (
        currentStreak === 3 || 
        currentStreak === 7 || 
        currentStreak === 14 || 
        currentStreak === 30 || 
        currentStreak === 60 || 
        currentStreak === 100 || 
        currentStreak % 100 === 0
      ) {
        sendStreakMilestoneNotification(ws, client.userId, {
          currentStreak,
          milestone: true,
          achievedAt: new Date().toISOString()
        });
      }
    }
    
    // Check and award mood-related badges
    checkAndAwardMoodBadges(client.userId);
  } catch (error) {
    console.error('Error updating mood:', error);
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: 'Failed to update mood: ' + error.message
    });
  }
}

/**
 * Handle sending a hug
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Object} client - The client object
 * @param {Object} data - The hug data
 */
async function handleSendHug(ws, client, data) {
  if (!client.authenticated) {
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: 'Authentication required'
    });
    return;
  }
  
  try {
    // Extract hug data
    const { recipientId, hugType, message, mediaUrl } = data;
    
    // Create hug via GraphQL
    const mutation = `
      mutation {
        sendHug(input: {
          recipientId: "${recipientId}",
          hugType: "${hugType}",
          message: ${message ? `"${message}"` : null},
          mediaUrl: ${mediaUrl ? `"${mediaUrl}"` : null}
        }) {
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
          mediaUrl
          createdAt
        }
      }
    `;
    
    const response = await fetch(HUG_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token || ''}`
      },
      body: JSON.stringify({ query: mutation })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    if (!result.data || !result.data.sendHug) {
      throw new Error('Failed to send hug');
    }
    
    const hug = result.data.sendHug;
    
    // Send success response to sender
    send(ws, {
      type: 'send_hug_success',
      callbackId: data.callbackId,
      hug
    });
    
    // Notify recipient
    sendToUser(recipientId, {
      type: 'hug_received',
      hug
    });
    
    // Check and award hug-related badges
    checkAndAwardHugBadges(client.userId);
  } catch (error) {
    console.error('Error sending hug:', error);
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: 'Failed to send hug: ' + error.message
    });
  }
}

/**
 * Handle requesting a hug
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Object} client - The client object
 * @param {Object} data - The request data
 */
async function handleHugRequest(ws, client, data) {
  if (!client.authenticated) {
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: 'Authentication required'
    });
    return;
  }
  
  try {
    // Extract request data
    const { recipientId, message, isPublic } = data;
    
    // Create hug request via GraphQL
    const mutation = `
      mutation {
        requestHug(input: {
          recipientId: ${recipientId ? `"${recipientId}"` : null},
          message: ${message ? `"${message}"` : null},
          isPublic: ${isPublic || false}
        }) {
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
    
    const response = await fetch(HUG_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token || ''}`
      },
      body: JSON.stringify({ query: mutation })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    if (!result.data || !result.data.requestHug) {
      throw new Error('Failed to create hug request');
    }
    
    const request = result.data.requestHug;
    
    // Send success response to requester
    send(ws, {
      type: 'request_hug_success',
      callbackId: data.callbackId,
      request
    });
    
    // If directed to a specific user, notify them
    if (recipientId) {
      sendToUser(recipientId, {
        type: 'hug_request_received',
        request
      });
    }
    
    // If public, broadcast to community
    if (isPublic) {
      broadcastHugRequest(request);
    }
  } catch (error) {
    console.error('Error requesting hug:', error);
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: 'Failed to request hug: ' + error.message
    });
  }
}

/**
 * Broadcast a hug request to the community
 * @param {Object} request - The hug request object
 */
function broadcastHugRequest(request) {
  // Broadcast to all authenticated clients except the requester
  clients.forEach((client, clientId) => {
    if (
      client.authenticated && 
      client.userId !== request.requester.id && 
      client.ws.readyState === WebSocket.OPEN
    ) {
      send(client.ws, {
        type: 'community_hug_request',
        request
      });
    }
  });
}

/**
 * Handle creating a group hug
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Object} client - The client object
 * @param {Object} data - The group hug data
 */
async function handleCreateGroupHug(ws, client, data) {
  if (!client.authenticated) {
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: 'Authentication required'
    });
    return;
  }
  
  try {
    // Extract group hug data
    const { 
      title, message, hugType, maxParticipants, 
      isPublic, duration, invitedUsers 
    } = data;
    
    // Create group hug via GraphQL
    const mutation = `
      mutation {
        createGroupHug(input: {
          title: "${title}",
          message: ${message ? `"${message}"` : null},
          hugType: "${hugType}",
          maxParticipants: ${maxParticipants || 0},
          isPublic: ${isPublic || false},
          duration: ${duration || 24},
          invitedUsers: ${invitedUsers ? JSON.stringify(invitedUsers) : null}
        }) {
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
    
    const response = await fetch(HUG_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token || ''}`
      },
      body: JSON.stringify({ query: mutation })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    if (!result.data || !result.data.createGroupHug) {
      throw new Error('Failed to create group hug');
    }
    
    const groupHug = result.data.createGroupHug;
    
    // Send success response to creator
    send(ws, {
      type: 'create_group_hug_success',
      callbackId: data.callbackId,
      groupHug
    });
    
    // Notify invited users
    if (invitedUsers && invitedUsers.length > 0) {
      invitedUsers.forEach(userId => {
        sendToUser(userId, {
          type: 'group_hug_invite',
          groupHug
        });
      });
    }
  } catch (error) {
    console.error('Error creating group hug:', error);
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: 'Failed to create group hug: ' + error.message
    });
  }
}

/**
 * Handle following or unfollowing a user
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Object} client - The client object
 * @param {Object} data - The follow data
 */
async function handleFollowUser(ws, client, data) {
  if (!client.authenticated) {
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: 'Authentication required'
    });
    return;
  }
  
  try {
    // Extract follow data
    const { targetUserId, action } = data;
    
    // Determine mutation based on action
    const mutationName = action === 'follow' ? 'followUser' : 'unfollowUser';
    
    // Create follow/unfollow mutation
    const mutation = `
      mutation {
        ${mutationName}(userId: "${targetUserId}") {
          success
          user {
            id
            userId
            displayName
            isFollowing
            isFollowedBy
            isFriend
          }
        }
      }
    `;
    
    const response = await fetch(USER_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token || ''}`
      },
      body: JSON.stringify({ query: mutation })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    if (!result.data || !result.data[mutationName]) {
      throw new Error(`Failed to ${action} user`);
    }
    
    const followResult = result.data[mutationName];
    
    // Send success response to follower
    send(ws, {
      type: `${action}_user_success`,
      callbackId: data.callbackId,
      targetUserId,
      isFollowing: action === 'follow',
      result: followResult
    });
    
    // Notify target user
    sendToUser(targetUserId, {
      type: 'follower_update',
      userId: client.userId,
      action,
      isFollowing: action === 'follow'
    });
  } catch (error) {
    console.error(`Error ${data.action}ing user:`, error);
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: `Failed to ${data.action} user: ${error.message}`
    });
  }
}

/**
 * Handle sharing to social platforms
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Object} client - The client object
 * @param {Object} data - The share data
 */
async function handleSocialShare(ws, client, data) {
  if (!client.authenticated) {
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: 'Authentication required'
    });
    return;
  }
  
  try {
    // Extract share data
    const { platform, contentType, content } = data;
    
    // Create share mutation
    const mutation = `
      mutation {
        shareToSocial(input: {
          platform: "${platform}",
          contentType: "${contentType}",
          contentId: ${content.id ? `"${content.id}"` : null},
          text: ${content.text ? `"${content.text}"` : null}
        }) {
          success
          message
          url
        }
      }
    `;
    
    // Determine service based on content type
    let serviceUrl;
    
    if (contentType === 'mood') {
      serviceUrl = MOOD_SERVICE_URL;
    } else if (contentType === 'hug' || contentType === 'group_hug' || contentType === 'media_hug') {
      serviceUrl = HUG_SERVICE_URL;
    } else {
      // Default to Hug Service
      serviceUrl = HUG_SERVICE_URL;
    }
    
    const response = await fetch(serviceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token || ''}`
      },
      body: JSON.stringify({ query: mutation })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    
    if (!result.data || !result.data.shareToSocial) {
      throw new Error('Failed to share content');
    }
    
    const shareResult = result.data.shareToSocial;
    
    // Send success response
    send(ws, {
      type: 'social_share_success',
      callbackId: data.callbackId,
      platform,
      contentType,
      result: shareResult
    });
    
    // Check and award sharing badges
    checkAndAwardSharingBadges(client.userId, platform);
  } catch (error) {
    console.error('Error sharing to social platform:', error);
    send(ws, { 
      type: 'error', 
      callbackId: data.callbackId,
      message: 'Failed to share content: ' + error.message
    });
  }
}

/**
 * Send a message to a WebSocket client
 * @param {WebSocket} ws - The WebSocket client
 * @param {Object} message - The message to send
 */
function send(ws, message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * Send a message to a specific user
 * @param {string} userId - The user ID
 * @param {Object} message - The message to send
 */
function sendToUser(userId, message) {
  let delivered = false;
  
  clients.forEach((client) => {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      send(client.ws, message);
      delivered = true;
    }
  });
  
  return delivered;
}

/**
 * Broadcast a user's online status
 * @param {string} userId - The user ID
 * @param {boolean} isOnline - The online status
 */
function broadcastUserStatus(userId, isOnline) {
  clients.forEach((client) => {
    if (client.userId !== userId && client.authenticated && client.ws.readyState === WebSocket.OPEN) {
      send(client.ws, {
        type: 'user_status',
        userId,
        isOnline
      });
    }
  });
}

/**
 * Broadcast a user's mood update
 * @param {string} userId - The user ID
 * @param {Object} moodData - The mood data
 */
function broadcastMoodUpdate(userId, moodData) {
  // Only broadcast to followers or friends
  clients.forEach((client) => {
    if (client.userId !== userId && client.authenticated && client.ws.readyState === WebSocket.OPEN) {
      // In a real app, check if the client follows this user
      // For now, just broadcast to all authenticated clients
      send(client.ws, {
        type: 'mood_update',
        userId,
        mood: moodData
      });
    }
  });
}

/**
 * Check and award mood-related badges
 * @param {string} userId - The user ID
 */
function checkAndAwardMoodBadges(userId) {
  // This is a simplified implementation that would actually
  // make requests to a Badge Service in a real application
  
  // For now, just simulate checking for badges
  setTimeout(() => {
    // Simulated badge check
    const badges = [];
    
    // Send badge notifications if any were earned
    if (badges.length > 0) {
      badges.forEach(badge => {
        sendToUser(userId, {
          type: 'badge_earned',
          badge
        });
      });
    }
  }, 1000);
}

/**
 * Check and award hug-related badges
 * @param {string} userId - The user ID
 */
function checkAndAwardHugBadges(userId) {
  // This is a simplified implementation that would actually
  // make requests to a Badge Service in a real application
  
  // For now, just simulate checking for badges
  setTimeout(() => {
    // Simulated badge check
    const badges = [];
    
    // Send badge notifications if any were earned
    if (badges.length > 0) {
      badges.forEach(badge => {
        sendToUser(userId, {
          type: 'badge_earned',
          badge
        });
      });
    }
  }, 1000);
}

/**
 * Send streak milestone notification to user
 * @param {WebSocket} ws - The WebSocket connection
 * @param {string} userId - The user ID
 * @param {Object} streakUpdate - The streak update data
 */
function sendStreakMilestoneNotification(ws, userId, streakUpdate) {
  send(ws, {
    type: 'streak_milestone',
    milestone: streakUpdate.currentStreak,
    currentStreak: streakUpdate.currentStreak,
    achievedAt: streakUpdate.achievedAt
  });
}

/**
 * Check and award sharing badges
 * @param {string} userId - The user ID
 * @param {string} platform - The social platform
 */
function checkAndAwardSharingBadges(userId, platform) {
  // This is a simplified implementation that would actually
  // make requests to a Badge Service in a real application
  
  // For now, just simulate checking for badges
  setTimeout(() => {
    // Simulated badge check
    const badges = [];
    
    // Send badge notifications if any were earned
    if (badges.length > 0) {
      badges.forEach(badge => {
        sendToUser(userId, {
          type: 'badge_earned',
          badge
        });
      });
    }
  }, 1000);
}

// Routes
app.get('/', (req, res) => {
  res.send('HugMood API Gateway');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    clients: clients.size,
    uptime: process.uptime()
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${PORT}`);
});

// Clean up inactive clients periodically
setInterval(() => {
  const now = new Date();
  clients.forEach((client, clientId) => {
    // Check if client has been inactive for too long (30 minutes)
    const inactiveTime = now - client.lastActivity;
    if (inactiveTime > 30 * 60 * 1000) {
      console.log(`Closing inactive client connection: ${clientId}`);
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.close(1000, 'Inactive timeout');
      }
      clients.delete(clientId);
    }
  });
}, 5 * 60 * 1000); // Check every 5 minutes

module.exports = app;