const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Sequelize, Op } = require('sequelize');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'hugmood-secret-key';

// Database configuration
const { sequelize, testConnection, syncModels } = require('./src/config/database');

// Import authentication routes
const authRoutes = require('./src/routes/auth');
const googleAuthRoutes = require('./src/routes/google-auth');
const facebookAuthRoutes = require('./src/routes/facebook-auth');
const appleAuthRoutes = require('./src/routes/apple-auth');

// Import database models
const User = require('./src/models/User');
const Mood = require('./src/models/Mood');
const Hug = require('./src/models/Hug');
const MediaHug = require('./src/models/MediaHug');
const Badge = require('./src/models/Badge');
const UserBadge = require('./src/models/UserBadge');
const GroupHug = require('./src/models/GroupHug');
const GroupHugParticipant = require('./src/models/GroupHugParticipant');
const Follow = require('./src/models/Follow');
const UserStreak = require('./src/models/UserStreak');
const WellnessActivity = require('./src/models/WellnessActivity');
const StreakReward = require('./src/models/StreakReward');

// Import services
const streakRewardService = require('./src/services/streakRewardService');

// Import GraphQL dependencies
const { createYoga } = require('graphql-yoga');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { PubSub } = require('graphql-subscriptions');
const fs = require('fs');

// Create PubSub instance for GraphQL subscriptions
const pubsub = new PubSub();

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ 
  server, 
  path: '/ws',
  // Add additional WebSocket server options for better debugging
  clientTracking: true,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size below which messages shouldn't be compressed
  }
});

// Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false // Disabled for development, enable and configure in production
}));
app.use(morgan('dev'));
app.use(compression());

// Serve static files with appropriate MIME types and caching
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    // Set content types for JS and CSS files
    if (filePath.endsWith('.js') || filePath.endsWith('.chunk.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css') || filePath.endsWith('.chunk.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    
    // Set cache headers for static assets
    if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$/)) {
      // Check if the file has a content hash in its name
      if (filePath.match(/\.[a-f0-9]{8}\.(js|css|chunk\.js|chunk\.css)$/)) {
        // Long cache for hashed assets (1 year)
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        // Shorter cache for other static assets (1 day)
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    } else if (filePath.endsWith('index.html') || filePath.endsWith('serviceWorker.js')) {
      // No cache for HTML and service worker
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Use authentication routes
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);
app.use('/auth', facebookAuthRoutes);
app.use('/auth', appleAuthRoutes);

// GraphQL proxy route using http-proxy-middleware
const graphqlProxy = createProxyMiddleware({
  target: 'http://localhost:4000',
  pathRewrite: {
    '^/api/graphql': '/graphql' // rewrite path
  },
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // Log proxy requests
    console.log('Proxying GraphQL request:', req.method, req.url);
    
    // If the request body is already parsed, we need to restream it
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('GraphQL proxy error:', err);
    res.status(500).json({
      errors: [{ message: 'GraphQL server connection error' }]
    });
  }
});

// Setup local GraphQL Yoga endpoint
const setupGraphQL = async () => {
  try {
    // Get the GraphQL schema from file
    let typeDefs;
    try {
      typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');
    } catch (err) {
      console.error('Error reading schema.graphql:', err);
      console.log('GraphQL schema not found, using proxy only');
      return false;
    }
    
    // Import resolvers
    let resolvers;
    try {
      resolvers = require('./src/graphql/resolvers');
    } catch (err) {
      console.error('Error importing resolvers:', err);
      console.log('GraphQL resolvers not found, using proxy only');
      return false;
    }
    
    // Create executable schema
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    
    // Extract user from token for context
    const getUserFromToken = async (req) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return null;
      }
      
      try {
        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user from database
        return await User.findByPk(decoded.userId);
      } catch (error) {
        console.error('Token verification error:', error);
        return null;
      }
    };
    
    // Create Yoga instance
    const yoga = createYoga({
      schema,
      context: async ({ req }) => {
        const user = await getUserFromToken(req);
        return { user, pubsub };
      },
      graphiql: true,
      cors: {
        origin: '*',
        credentials: true,
      },
      multipart: true
    });
    
    // Apply Yoga middleware to Express
    app.use('/graphql', yoga);
    console.log('Local GraphQL endpoint setup successfully');
    return true;
  } catch (error) {
    console.error('Error setting up GraphQL endpoint:', error);
    return false;
  }
};

// Apply GraphQL proxy middleware for backward compatibility
app.use('/api/graphql', graphqlProxy);

// Provide GraphQL endpoint information to clients
app.get('/api/graphql-info', (req, res) => {
  res.json({
    endpoint: '/graphql',  // Direct endpoint
    backupEndpoint: '/api/graphql',  // Proxy endpoint
    subscriptionsEndpoint: null  // No WebSocket subscriptions in this design
  });
});

// JWT authentication middleware for protected routes
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'hugmood-secret-key', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Make middleware available to route files
app.set('authenticateJWT', authenticateJWT);

// In-memory storage for temporary data and connections
const users = new Map();
const onlineUsers = new Map();
const hugHistory = new Map();
const hugRequests = new Map(); // Store hug requests by user ID
const moodHistory = new Map();
const userBadges = new Map();
const followConnections = new Map();
const groupHugs = new Map();

// Store client WebSocket connections 
const clients = new Map();

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  console.log('Client connected:', {
    ip: req.socket.remoteAddress,
    path: req.url,
    headers: {
      origin: req.headers.origin,
      host: req.headers.host,
      upgrade: req.headers.upgrade
    }
  });

  // Generate temporary client ID
  const clientId = uuidv4();
  let userId = null;

  // Store the client connection
  clients.set(clientId, {
    ws,
    userId: null,
    isAuthenticated: false
  });

  // Handle messages from clients
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message from client:', data);
      handleClientMessage(ws, data);
    } catch (error) {
      console.error('Error parsing message:', error);
      console.error('Raw message content:', message.toString());
    }
  });

  // Handle client disconnection
  ws.on('close', (code, reason) => {
    console.log(`Client disconnected with code: ${code}, reason: ${reason ? reason.toString() : 'none'}`);
    
    // Find the client entry for this connection
    const clientEntry = Array.from(clients.entries()).find(([_, c]) => c.ws === ws);
    
    if (clientEntry) {
      const [clientId, client] = clientEntry;
      console.log(`Client details: ${clientId}, authenticated: ${client.isAuthenticated}, userId: ${client.userId || 'none'}`);
      
      // If the client was authenticated, update their online status
      if (client.userId) {
        console.log(`Removing user ${client.userId} from online users`);
        onlineUsers.delete(client.userId);
        broadcastUserStatus(client.userId, false);
      }
      
      // Remove from clients map
      clients.delete(clientId);
    } else {
      console.log(`Client not found in clients map`);
    }
    
    console.log(`Clients remaining: ${clients.size}`);
  });

  // Send a welcome message
  send(ws, {
    type: 'welcome',
    message: 'Connected to HugMood WebSocket server'
  });
});

/**
 * Handle messages from clients
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Object} message - The parsed message from the client
 */
function handleClientMessage(ws, message) {
  const { type, data } = message;

  switch (type) {
    case 'ping':
      // Respond to ping with pong
      send(ws, { type: 'pong' });
      break;

    case 'authenticate':
      // Authenticate the user
      console.log('Full authentication message:', message);
      
      // Check if the message contains method directly or in data
      const method = message.method || (message.data ? message.data.method : null);
      const token = message.token || (message.data ? message.data.token : null);
      const userId = message.userId || (message.data ? message.data.userId : null);
      const userData = message.userData || (message.data ? message.data.userData : null);
      const credentials = message.credentials || (message.data ? message.data.credentials : null);
      
      // Construct a consolidated authData object
      const authData = {
        method,
        token,
        userId,
        userData,
        credentials
      };
      
      console.log('Processed authentication data:', authData);
      
      if (authData && (authData.userId || authData.token || authData.method)) {
        handleAuthentication(ws, clients, authData);
      } else if (authData && authData.credentials) {
        // If only credentials are provided, assume login
        authData.method = 'login';
        handleAuthentication(ws, clients, authData);
      } else {
        console.error('Authentication data is missing or in an unexpected format');
        send(ws, { 
          type: 'auth_error', 
          message: 'Authentication data is missing or in an unexpected format' 
        });
      }
      break;

    case 'mood_update':
      // Update user mood
      handleMoodUpdate(ws, clients, data);
      break;

    case 'send_hug':
      // Send a hug to another user
      handleSendHug(ws, clients, data);
      break;

    case 'request_hug':
      // Request a hug from another user
      handleHugRequest(ws, clients, data);
      break;

    case 'create_group_hug':
      // Create a group hug
      handleCreateGroupHug(ws, clients, data);
      break;

    case 'follow_user':
      // Follow or unfollow a user
      handleFollowUser(ws, clients, data);
      break;

    case 'social_share':
      // Share content to social platform
      handleSocialShare(ws, clients, data);
      break;

    case 'fetch_data':
      // Fetch data
      handleFetchData(ws, clients, data);
      break;

    default:
      console.log(`Unhandled message type: ${type}`);
  }
}

/**
 * Handle user authentication
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Map} clients - The map of client connections
 * @param {Object} data - The authentication data
 */
function handleAuthentication(ws, clients, data) {
  console.log('Authentication request:', data);
  
  // Find the client entry
  const clientEntry = Array.from(clients.entries())
    .find(([_, client]) => client.ws === ws);

  if (!clientEntry) {
    console.error('Client not found in clients map');
    return;
  }

  const [clientId, client] = clientEntry;
  
  // Handle different authentication methods
  if (data.method === 'register') {
    handleRegistration(ws, clientId, client, data);
  } else if (data.method === 'login') {
    handleLogin(ws, clientId, client, data);
  } else if (data.method === 'anonymous') {
    handleAnonymousLogin(ws, clientId, client, data);
  } else if (data.method === 'token') {
    // Token-based authentication
    // If token is missing, try to get from localStorage on client side via a challenge
    if (!data.token) {
      console.log('Token method specified but no token provided, sending auth challenge');
      send(ws, {
        type: 'auth_challenge',
        challenge: 'token_required'
      });
    } else {
      handleTokenAuth(ws, clientId, client, data);
    }
  } else if (data.token || data.userId) {
    // Fallback to token auth if token is provided but method isn't specified
    handleTokenAuth(ws, clientId, client, data);
  } else {
    console.log('Invalid authentication method:', data);
    send(ws, {
      type: 'auth_error',
      message: 'Invalid authentication method'
    });
  }
}

/**
 * Handle user registration
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {string} clientId - The client ID
 * @param {Object} client - The client object
 * @param {Object} data - The registration data
 */
/**
 * Handle user registration
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {string} clientId - The client ID
 * @param {Object} client - The client object
 * @param {Object} data - The registration data
 */
async function handleRegistration(ws, clientId, client, data) {
  const { userData } = data;
  
  if (!userData || !userData.username || !userData.email || !userData.password) {
    send(ws, {
      type: 'authentication_response',
      success: false,
      error: 'Missing required registration fields'
    });
    return;
  }
  
  try {
    // Check if username or email already exists in database
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: userData.username },
          { email: userData.email }
        ]
      }
    });
    
    if (existingUser) {
      send(ws, {
        type: 'authentication_response',
        success: false,
        error: existingUser.username === userData.username ? 
          'Username already exists' : 'Email already exists'
      });
      return;
    }
    
    // Create user in database - password will be hashed via model hooks
    const newUser = await User.create({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      name: userData.name || userData.username,
      isOnline: true,
      lastActive: new Date()
    });
    
    const userId = newUser.id;
    
    // Store user in memory for quick access
    const userMemObj = {
      id: userId,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      badges: [],
      mood: null,
      lastActivity: Date.now(),
      createdAt: newUser.createdAt.getTime()
    };
    users.set(userId, userMemObj);
    
    // Update client with user ID and authenticated status
    client.userId = userId;
    client.isAuthenticated = true;
    clients.set(clientId, client);
    
    // Add user to online users
    onlineUsers.set(userId, ws);
    
    // Generate token
    const token = jwt.sign(
      { userId, username: userData.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Send authentication response
    send(ws, {
      type: 'authentication_response',
      success: true,
      user: {
        id: userId,
        username: userData.username,
        email: userData.email,
        name: newUser.name
      },
      token
    });
    
    console.log(`User ${userId} (${userData.username}) registered and authenticated`);
  } catch (error) {
    console.error('Error registering user:', error);
    send(ws, {
      type: 'authentication_response',
      success: false,
      error: 'Error registering user: ' + (error.message || 'Unknown error')
    });
  }
}

/**
 * Handle user login
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {string} clientId - The client ID
 * @param {Object} client - The client object
 * @param {Object} data - The login data
 */
/**
 * Handle user login
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {string} clientId - The client ID
 * @param {Object} client - The client object
 * @param {Object} data - The login data
 */
async function handleLogin(ws, clientId, client, data) {
  const { credentials } = data;
  
  if (!credentials || !credentials.email || !credentials.password) {
    send(ws, {
      type: 'authentication_response',
      success: false,
      error: 'Missing login credentials'
    });
    return;
  }
  
  try {
    // Find user by email or username in database
    const dbUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: credentials.email },
          { username: credentials.email }
        ]
      }
    });
    
    if (!dbUser) {
      send(ws, {
        type: 'authentication_response',
        success: false,
        error: 'Invalid credentials'
      });
      return;
    }
    
    // Verify password using bcrypt comparison
    const isPasswordValid = await bcrypt.compare(credentials.password, dbUser.password);
    
    if (!isPasswordValid) {
      send(ws, {
        type: 'authentication_response',
        success: false,
        error: 'Invalid credentials'
      });
      return;
    }
    
    // Update user's online status in database
    await dbUser.update({
      isOnline: true,
      lastActive: new Date()
    });
    
    // Store user in memory for quick access
    const memUser = {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      name: dbUser.name,
      badges: [],
      mood: null,
      lastActivity: Date.now(),
      createdAt: dbUser.createdAt.getTime()
    };
    users.set(dbUser.id, memUser);
    
    // Update client with user ID and authenticated status
    client.userId = dbUser.id;
    client.isAuthenticated = true;
    clients.set(clientId, client);
    
    // Add user to online users
    onlineUsers.set(dbUser.id, ws);
    
    // Generate token
    const token = jwt.sign(
      { userId: dbUser.id, username: dbUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Send authentication response
    send(ws, {
      type: 'authentication_response',
      success: true,
      user: {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        name: dbUser.name
      },
      token
    });
    
    console.log(`User ${dbUser.id} (${dbUser.username}) logged in`);
  } catch (error) {
    console.error('Error during login:', error);
    send(ws, {
      type: 'authentication_response',
      success: false,
      error: 'Error during login: ' + (error.message || 'Unknown error')
    });
  }
}

/**
 * Handle anonymous login
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {string} clientId - The client ID
 * @param {Object} client - The client object
 * @param {Object} data - The anonymous login data
 */
async function handleAnonymousLogin(ws, clientId, client, data) {
  // Generate user ID for anonymous user
  const userId = `anon-${uuidv4()}`;
  
  // Get any custom nickname and avatarId if provided
  const nickname = data.nickname || `Guest-${userId.substring(5, 10)}`;
  const avatarId = data.avatarId || Math.floor(Math.random() * 8) + 1; // Random avatar between 1-8
  
  // Create anonymous user
  const user = {
    id: userId,
    username: nickname,
    avatarId: avatarId,
    isAnonymous: true,
    badges: [],
    mood: null,
    lastActivity: Date.now(),
    createdAt: Date.now()
  };
  
  // Store user in memory
  users.set(userId, user);
  
  // Update client with user ID and authenticated status
  client.userId = userId;
  client.isAuthenticated = true;
  client.isAnonymous = true;
  clients.set(clientId, client);
  
  // Add user to online users
  onlineUsers.set(userId, ws);
  
  // Generate token
  const token = jwt.sign(
    { userId, isAnonymous: true },
    JWT_SECRET,
    { expiresIn: '24h' } // Shorter expiry for anonymous users
  );
  
  // Try to create user in GraphQL Mesh service
  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: `
          mutation CreateAnonymousUser($input: CreateAnonymousUserInput!) {
            createAnonymousUser(input: $input) {
              id
              nickname
              avatarId
              createdAt
              expiresAt
            }
          }
        `,
        variables: { 
          input: {
            id: userId,
            nickname: nickname,
            avatarId: avatarId
          }
        }
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('Error creating anonymous user in GraphQL:', result.errors[0].message);
    } else {
      console.log('Anonymous user also created in GraphQL Mesh service');
    }
  } catch (error) {
    console.error('Failed to sync anonymous user with GraphQL service:', error.message);
  }
  
  // Send authentication response
  send(ws, {
    type: 'authentication_response',
    success: true,
    user: {
      id: userId,
      username: user.username,
      displayName: user.username,
      avatarUrl: `/avatars/${avatarId}.png`,
      isAnonymous: true
    },
    token
  });
  
  console.log(`Anonymous user ${userId} created and authenticated`);
}

/**
 * Handle token-based authentication
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {string} clientId - The client ID
 * @param {Object} client - The client object
 * @param {Object} data - The token data
 */
/**
 * Handle token-based authentication
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {string} clientId - The client ID
 * @param {Object} client - The client object
 * @param {Object} data - The token data
 */
/**
 * Create a new anonymous session for a user
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {string} clientId - The client ID
 * @param {Object} client - The client object
 * @returns {Promise<Object>} The created anonymous user
 */
async function createNewAnonymousSession(ws, clientId, client) {
  // Generate user ID for anonymous user
  const userId = `anon-${uuidv4()}`;
  
  // Create anonymous user
  const user = {
    id: userId,
    username: `Guest-${userId.substring(5, 10)}`,
    isAnonymous: true,
    badges: [],
    mood: null,
    lastActivity: Date.now(),
    createdAt: Date.now()
  };
  
  // Store user in memory
  users.set(userId, user);
  
  // Update client with user ID and authenticated status
  client.userId = userId;
  client.isAuthenticated = true;
  client.isAnonymous = true;
  clients.set(clientId, client);
  
  // Add user to online users
  onlineUsers.set(userId, ws);
  
  // Generate token
  const token = jwt.sign(
    { userId, isAnonymous: true },
    JWT_SECRET,
    { expiresIn: '24h' } // Shorter expiry for anonymous users
  );
  
  // Send authentication response
  send(ws, {
    type: 'authentication_response',
    success: true,
    user: {
      id: userId,
      username: user.username,
      isAnonymous: true
    },
    token
  });
  
  console.log(`New anonymous user ${userId} created and authenticated`);
  
  // Also create this user in the GraphQL Mesh service if possible
  try {
    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: `
          mutation CreateAnonymousUser($input: CreateAnonymousUserInput!) {
            createAnonymousUser(input: $input) {
              id
              nickname
              avatarId
              createdAt
              expiresAt
            }
          }
        `,
        variables: { 
          input: {
            id: userId,
            nickname: user.username,
            avatarId: 1 // Default avatar
          }
        }
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('Error creating anonymous user in GraphQL:', result.errors[0].message);
    } else {
      console.log('Anonymous user also created in GraphQL Mesh service');
    }
  } catch (error) {
    console.error('Failed to sync anonymous user with GraphQL service:', error.message);
  }
  
  return user;
}

async function handleTokenAuth(ws, clientId, client, data) {
  const token = data.token || data;
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId || data.userId;
    
    // Handle anonymous users
    if (decoded.isAnonymous) {
      try {
        // Try to find the anonymous user via GraphQL Mesh
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              query GetAnonymousUser($userId: ID!) {
                anonymousUser(userId: $userId) {
                  id
                  nickname
                  avatarId
                  createdAt
                  expiresAt
                }
              }
            `,
            variables: { userId }
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        if (!result.data || !result.data.anonymousUser) {
          throw new Error('Anonymous user not found');
        }
        
        const anonUser = result.data.anonymousUser;
        
        // Update client with user ID and authenticated status
        client.userId = userId;
        client.isAuthenticated = true;
        client.isAnonymous = true;
        clients.set(clientId, client);
        
        // Add user to online users
        onlineUsers.set(userId, ws);
        
        // Store or update user in memory for quick access
        const user = {
          id: userId,
          username: anonUser.nickname,
          avatarId: anonUser.avatarId,
          isAnonymous: true,
          createdAt: new Date(anonUser.createdAt).getTime(),
          expiresAt: new Date(anonUser.expiresAt).getTime(),
          lastActivity: Date.now()
        };
        users.set(userId, user);
        
        // Send authentication response
        send(ws, {
          type: 'authentication_response',
          success: true,
          user: {
            id: userId,
            username: anonUser.nickname,
            displayName: anonUser.nickname,
            avatarUrl: `/avatars/${anonUser.avatarId}.png`,
            isAnonymous: true
          }
        });
        
        console.log(`Anonymous user ${userId} authenticated with token`);
        return;
      } catch (error) {
        console.error('Error finding anonymous user:', error.message);
        
        // Fallback to local memory if GraphQL query fails
        if (users.has(userId)) {
          const user = users.get(userId);
          
          // Update client with user ID and authenticated status
          client.userId = userId;
          client.isAuthenticated = true;
          client.isAnonymous = true;
          clients.set(clientId, client);
          
          // Add user to online users
          onlineUsers.set(userId, ws);
          
          // Update last activity
          user.lastActivity = Date.now();
          users.set(userId, user);
          
          // Send authentication response
          send(ws, {
            type: 'authentication_response',
            success: true,
            user: {
              id: userId,
              username: user.username,
              isAnonymous: true
            }
          });
          
          console.log(`Anonymous user ${userId} authenticated with token (memory fallback)`);
          return;
        } else {
          // Create a new anonymous session if user not found
          await createNewAnonymousSession(ws, clientId, client);
          return;
        }
      }
    }
    
    // For regular users, check in database first
    const dbUser = await User.findByPk(userId);
    
    if (!dbUser) {
      throw new Error('User not found in database');
    }
    
    // Update user's online status in database
    await dbUser.update({
      isOnline: true,
      lastActive: new Date()
    });
    
    // Store or update user in memory for quick access
    let memUser;
    if (users.has(userId)) {
      memUser = users.get(userId);
      memUser.lastActivity = Date.now();
    } else {
      memUser = {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        name: dbUser.name,
        badges: [],
        mood: null,
        lastActivity: Date.now(),
        createdAt: dbUser.createdAt.getTime()
      };
    }
    users.set(userId, memUser);
    
    // Update client with user ID and authenticated status
    client.userId = userId;
    client.isAuthenticated = true;
    client.isAnonymous = false;
    clients.set(clientId, client);
    
    // Add user to online users
    onlineUsers.set(userId, ws);
    
    // Send authentication response
    send(ws, {
      type: 'authentication_response',
      success: true,
      user: {
        id: userId,
        username: dbUser.username,
        email: dbUser.email,
        name: dbUser.name
      }
    });
    
    console.log(`User ${userId} authenticated with token`);
    
  } catch (error) {
    console.error('Token authentication error:', error.message);
    send(ws, {
      type: 'authentication_response',
      success: false,
      error: 'Invalid or expired token: ' + error.message
    });
  }
}

/**
 * Handle mood update
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Map} clients - The map of client connections
 * @param {Object} data - The mood data
 */
/**
 * Handle mood update
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Map} clients - The map of client connections
 * @param {Object} data - The mood data
 */
async function handleMoodUpdate(ws, clients, data) {
  const { mood, intensity = 5, note = null, isPublic = false, activities = [], location = null } = data;

  // Find the client info
  const clientEntry = Array.from(clients.entries())
    .find(([_, client]) => client.ws === ws);

  if (!clientEntry || !clientEntry[1].isAuthenticated) {
    console.error('Client not authenticated');
    send(ws, {
      type: 'mood_update_error',
      error: 'Authentication required',
      authRequired: true
    });
    return;
  }

  const userId = clientEntry[1].userId;
  
  try {
    // Check if user exists in database
    const user = await User.findByPk(userId);
    if (!user) {
      console.error(`User ${userId} not found in database`);
      send(ws, {
        type: 'mood_update_error',
        error: 'User not found'
      });
      return;
    }
    
    // Create mood entry in database
    const moodEntryDb = await Mood.create({
      userId,
      mood,
      intensity,
      note,
      isPrivate: !isPublic,
      activities: activities || [],
      location
    });

    // Create mood entry for memory cache too
    const moodEntry = {
      id: moodEntryDb.id,
      userId,
      mood,
      intensity,
      note,
      isPublic,
      activities,
      location,
      timestamp: moodEntryDb.createdAt.getTime()
    };

    // Store in memory mood history for quick access
    if (!moodHistory.has(userId)) {
      moodHistory.set(userId, []);
    }

    moodHistory.get(userId).unshift(moodEntry);

    // Update user's current mood
    await user.update({
      currentMood: mood
    });
    
    // Update in-memory user object too
    const memUser = users.get(userId);
    if (memUser) {
      memUser.mood = {
        mood,
        intensity,
        timestamp: moodEntry.timestamp
      };
      users.set(userId, memUser);
    }

    // Broadcast mood update to followers if public
    if (isPublic) {
      broadcastMoodUpdate(userId, moodEntry);
    }

    // Record wellness activity for streak tracking
    let streakResult = null;
    try {
      // Record the wellness activity for streak tracking
      streakRewardService.recordWellnessActivity(userId, 'mood_log', moodEntryDb.id, {
        mood,
        intensity,
        isPublic
      }).then(result => {
        streakResult = result;
        
        // If user reached a new streak milestone, send notification
        if (streakResult.streakUpdate && streakResult.streakUpdate.newMilestoneReached) {
          sendStreakMilestoneNotification(ws, userId, streakResult.streakUpdate);
        }
      }).catch(error => {
        console.error('Error updating streak for mood:', error);
      });
    } catch (error) {
      console.error('Error recording mood for streak:', error);
    }

    // Check for mood-related badges
    checkAndAwardMoodBadges(userId);

    // Generate fresh mood analytics
    const analytics = generateMoodAnalytics(userId, 30, true);

    // Send confirmation with analytics
    send(ws, {
      type: 'mood_update_success',
      data: {
        analytics,
        moodId: moodEntryDb.id,
        // Include streak info if available
        streakInfo: streakResult ? {
          currentStreak: streakResult.streakUpdate?.userStreak?.currentStreak || 0,
          streakMessage: streakResult.streakUpdate?.streakMessage || null
        } : null
      }
    });
    
    console.log(`Mood updated for user ${userId}: ${mood} (intensity: ${intensity})`);
  } catch (error) {
    console.error('Error updating mood:', error);
    send(ws, {
      type: 'mood_update_error',
      error: 'Error saving mood: ' + (error.message || 'Unknown error')
    });
  }
}

/**
 * Handle sending a hug
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Map} clients - The map of client connections
 * @param {Object} data - The hug data
 */
function handleSendHug(ws, clients, data) {
  const { recipientId, hugType, message = null } = data;

  // Find the client info
  const clientEntry = Array.from(clients.entries())
    .find(([_, client]) => client.ws === ws);

  if (!clientEntry || !clientEntry[1].isAuthenticated) {
    console.error('Client not authenticated');
    send(ws, {
      type: 'hug_send_error',
      error: 'Authentication required',
      authRequired: true
    });
    return;
  }

  const senderId = clientEntry[1].userId;

  // Create hug entry
  const hug = {
    id: uuidv4(),
    senderId,
    senderName: users.get(senderId)?.username || 'User',
    recipientId,
    hugType,
    message,
    timestamp: Date.now(),
    viewed: false
  };

  // Store in hug history
  if (!hugHistory.has(recipientId)) {
    hugHistory.set(recipientId, []);
  }
  if (!hugHistory.has(senderId)) {
    hugHistory.set(senderId, []);
  }

  hugHistory.get(recipientId).unshift(hug);
  hugHistory.get(senderId).unshift({ ...hug, viewed: true });

  // Send hug to recipient if online
  if (onlineUsers.has(recipientId)) {
    sendToUser(recipientId, {
      type: 'hug_received',
      hug
    });
  }

  // Check for hug-related badges
  checkAndAwardHugBadges(senderId);
  
  // Record wellness activity for streak tracking
  try {
    // Record the wellness activity for streak tracking
    streakRewardService.recordWellnessActivity(senderId, 'hug_sent', hug.id, {
      recipientId: hug.recipientId,
      hugType: hug.hugType
    }).then(result => {
      // If user reached a new streak milestone, send notification
      if (result.streakUpdate && result.streakUpdate.newMilestoneReached) {
        sendStreakMilestoneNotification(ws, senderId, result.streakUpdate);
      }
    }).catch(error => {
      console.error('Error updating streak for hug:', error);
    });
    
    // Also record for recipient (but worth less streak points)
    streakRewardService.recordWellnessActivity(recipientId, 'hug_received', hug.id, {
      senderId: hug.senderId,
      hugType: hug.hugType
    }).catch(error => {
      console.error('Error updating streak for hug recipient:', error);
    });
  } catch (error) {
    console.error('Error recording hug for streak:', error);
  }

  // Send confirmation
  send(ws, {
    type: 'hug_sent',
    data: {
      hugId: hug.id
    }
  });
}

/**
 * Handle requesting a hug
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Map} clients - The map of client connections
 * @param {Object} data - The request data
 */
function handleHugRequest(ws, clients, data) {
  const { recipientId, urgency = 'normal', message = null, hugType = null, timestamp = Date.now() } = data;

  // Find the client info
  const clientEntry = Array.from(clients.entries())
    .find(([_, client]) => client.ws === ws);

  if (!clientEntry || !clientEntry[1].isAuthenticated) {
    console.error('Client not authenticated');
    send(ws, {
      type: 'hug_request_error',
      data: {
        message: 'Authentication required'
      }
    });
    return;
  }

  // Check if this is an anonymous request (no specific recipient)
  const isAnonymous = !recipientId || data.senderId === 'anonymous';
  const senderId = isAnonymous ? 'anonymous' : clientEntry[1].userId;
  const senderName = isAnonymous ? 'Anonymous' : users.get(clientEntry[1].userId)?.username || 'User';

  // Create request object
  const request = {
    id: data.id || uuidv4(),
    senderId,
    senderName,
    recipientId,
    hugType,
    message,
    urgency,
    timestamp,
    status: 'pending',
    isAnonymous
  };

  // Save the request in memory
  const userRequests = hugRequests.get(senderId) || [];
  userRequests.push(request);
  hugRequests.set(senderId, userRequests);

  // For anonymous requests, broadcast to all online users
  if (isAnonymous) {
    broadcastHugRequest(request);
  } 
  // For directed requests, send to specific recipient if online
  else if (onlineUsers.has(recipientId)) {
    sendToUser(recipientId, {
      type: 'hug_requested',
      request
    });
  }

  // Send confirmation to the requester
  send(ws, {
    type: 'hug_request_success',
    data: {
      requestId: request.id,
      message: isAnonymous ? 
        'Your anonymous request has been sent to the community' : 
        `Your request has been sent to ${users.get(recipientId)?.username || 'the recipient'}`
    }
  });
}

/**
 * Broadcast a hug request to the community
 * @param {Object} request - The hug request object
 */
function broadcastHugRequest(request) {
  // Send to all online users except the sender
  onlineUsers.forEach(userId => {
    // Skip the sender if not anonymous
    if (request.senderId !== 'anonymous' && userId === request.senderId) return;

    sendToUser(userId, {
      type: 'community_hug_requested',
      request: {
        ...request,
        // For privacy, don't expose the sender's information for anonymous requests
        senderId: request.isAnonymous ? 'anonymous' : request.senderId,
        senderName: request.isAnonymous ? 'Anonymous' : request.senderName
      }
    });
  });
}

/**
 * Handle creating a group hug
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Map} clients - The map of client connections
 * @param {Object} data - The group hug data
 */
function handleCreateGroupHug(ws, clients, data) {
  const { participantIds, hugType, message = null } = data;

  // Find the client info
  const clientEntry = Array.from(clients.entries())
    .find(([_, client]) => client.ws === ws);

  if (!clientEntry || !clientEntry[1].isAuthenticated) {
    console.error('Client not authenticated');
    send(ws, {
      type: 'group_hug_error',
      error: 'Authentication required',
      authRequired: true
    });
    return;
  }

  const creatorId = clientEntry[1].userId;

  // Create group hug
  const groupHug = {
    id: uuidv4(),
    creatorId,
    creatorName: users.get(creatorId)?.username || 'User',
    participantIds: [...participantIds, creatorId],
    hugType,
    message,
    timestamp: Date.now(),
    status: 'active',
    joinedParticipants: [creatorId]
  };

  // Store group hug
  groupHugs.set(groupHug.id, groupHug);

  // Send invitation to all participants
  for (const participantId of participantIds) {
    if (onlineUsers.has(participantId)) {
      sendToUser(participantId, {
        type: 'group_hug_invitation',
        groupHug
      });
    }
  }

  // Send confirmation
  send(ws, {
    type: 'group_hug_created',
    data: {
      groupId: groupHug.id
    }
  });
}

/**
 * Handle following or unfollowing a user
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Map} clients - The map of client connections
 * @param {Object} data - The follow data
 */
function handleFollowUser(ws, clients, data) {
  const { targetUserId, action } = data;

  // Find the client info
  const clientEntry = Array.from(clients.entries())
    .find(([_, client]) => client.ws === ws);

  if (!clientEntry || !clientEntry[1].isAuthenticated) {
    console.error('Client not authenticated');
    send(ws, {
      type: 'follow_action_error',
      error: 'Authentication required',
      authRequired: true
    });
    return;
  }

  const followerId = clientEntry[1].userId;

  // Generate unique follow key
  const followKey = `${followerId}:${targetUserId}`;

  if (action === 'follow') {
    // Add follow connection
    followConnections.set(followKey, {
      followerId,
      followingId: targetUserId,
      timestamp: Date.now()
    });

    // Notify the followed user if online
    if (onlineUsers.has(targetUserId)) {
      sendToUser(targetUserId, {
        type: 'new_follower',
        followerId,
        followerName: users.get(followerId)?.username || 'User'
      });
    }
  } else if (action === 'unfollow') {
    // Remove follow connection
    followConnections.delete(followKey);
  }

  // Send confirmation
  send(ws, {
    type: 'follow_action_success',
    data: {
      targetUserId,
      action
    }
  });
}

/**
 * Handle sharing to social platforms
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Map} clients - The map of client connections
 * @param {Object} data - The share data
 */
function handleSocialShare(ws, clients, data) {
  const { platform, contentType, contentId } = data;

  // Find the client info
  const clientEntry = Array.from(clients.entries())
    .find(([_, client]) => client.ws === ws);

  if (!clientEntry || !clientEntry[1].isAuthenticated) {
    console.error('Client not authenticated');
    send(ws, {
      type: 'social_share_error',
      error: 'Authentication required',
      authRequired: true
    });
    return;
  }

  const userId = clientEntry[1].userId;

  // In a real app, this would integrate with social media APIs
  // For demo, just pretend it worked

  // Check and award sharing badges
  checkAndAwardSharingBadges(userId, platform);

  // Send confirmation
  send(ws, {
    type: 'social_share_success',
    data: {
      platform,
      contentType,
      contentId
    }
  });
}

/**
 * Send a message to a WebSocket client
 * @param {WebSocket} ws - The WebSocket client
 * @param {Object} message - The message to send
 */
function send(ws, message) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

/**
 * Send a message to a specific user
 * @param {string} userId - The user ID
 * @param {Object} message - The message to send
 */
function sendToUser(userId, message) {
  const ws = onlineUsers.get(userId);
  if (ws) {
    send(ws, message);
  }
}

/**
 * Broadcast a user's online status
 * @param {string} userId - The user ID
 * @param {boolean} isOnline - The online status
 */
function broadcastUserStatus(userId, isOnline) {
  // Find all followers
  const followers = Array.from(followConnections.values())
    .filter(follow => follow.followingId === userId)
    .map(follow => follow.followerId);

  // Notify followers
  for (const followerId of followers) {
    if (onlineUsers.has(followerId)) {
      sendToUser(followerId, {
        type: 'friend_status_update',
        userId,
        username: users.get(userId)?.username || 'User',
        isOnline
      });
    }
  }
}

/**
 * Broadcast a user's mood update
 * @param {string} userId - The user ID
 * @param {Object} moodData - The mood data
 */
function broadcastMoodUpdate(userId, moodData) {
  // Find all followers
  const followers = Array.from(followConnections.values())
    .filter(follow => follow.followingId === userId)
    .map(follow => follow.followerId);

  // Notify followers
  for (const followerId of followers) {
    if (onlineUsers.has(followerId)) {
      sendToUser(followerId, {
        type: 'friend_mood_update',
        userId,
        username: users.get(userId)?.username || 'User',
        mood: moodData.mood,
        intensity: moodData.intensity,
        timestamp: moodData.timestamp
      });
    }
  }
}

/**
 * Check and award mood-related badges
 * @param {string} userId - The user ID
 */
function checkAndAwardMoodBadges(userId) {
  const userMoods = moodHistory.get(userId) || [];

  // Badge: First Mood - Log your first mood
  if (userMoods.length === 1) {
    const badge = {
      id: 'first_mood',
      name: 'Mood Starter',
      description: 'Logged your first mood',
      category: 'mood_tracking'
    };

    awardBadge(userId, badge);
  }

  // Badge: Mood Streak - Log mood for consecutive days
  const streak = calculateMoodStreak(userMoods);

  if (streak >= 7 && !hasBadge(userId, 'mood_streak_7')) {
    const badge = {
      id: 'mood_streak_7',
      name: 'Week Tracker',
      description: 'Logged your mood for 7 consecutive days',
      category: 'streaks'
    };

    awardBadge(userId, badge);
  }

  if (streak >= 30 && !hasBadge(userId, 'mood_streak_30')) {
    const badge = {
      id: 'mood_streak_30',
      name: 'Mood Master',
      description: 'Logged your mood for 30 consecutive days',
      category: 'streaks'
    };

    awardBadge(userId, badge);
  }

  // Badge: Mood Variety - Experience different moods
  const uniqueMoods = new Set(userMoods.map(m => m.mood));

  if (uniqueMoods.size >= 5 && !hasBadge(userId, 'mood_variety')) {
    const badge = {
      id: 'mood_variety',
      name: 'Emotional Range',
      description: 'Experienced and logged 5 different moods',
      category: 'mood_tracking'
    };

    awardBadge(userId, badge);
  }
}

/**
 * Check and award hug-related badges
 * @param {string} userId - The user ID
 */
function checkAndAwardHugBadges(userId) {
  const userHugs = hugHistory.get(userId) || [];
  const sentHugs = userHugs.filter(h => h.senderId === userId);

  // Badge: First Hug - Send your first hug
  if (sentHugs.length === 1) {
    const badge = {
      id: 'first_hug',
      name: 'First Embrace',
      description: 'Sent your first virtual hug',
      category: 'hugs'
    };

    awardBadge(userId, badge);
  }

  // Badge: Hug Enthusiast - Send 10 hugs
  if (sentHugs.length >= 10 && !hasBadge(userId, 'hug_enthusiast')) {
    const badge = {
      id: 'hug_enthusiast',
      name: 'Hug Enthusiast',
      description: 'Sent 10 virtual hugs',
      category: 'hugs'
    };

    awardBadge(userId, badge);
  }

  // Badge: Hug Master - Send 50 hugs
  if (sentHugs.length >= 50 && !hasBadge(userId, 'hug_master')) {
    const badge = {
      id: 'hug_master',
      name: 'Hug Master',
      description: 'Sent 50 virtual hugs',
      category: 'hugs'
    };

    awardBadge(userId, badge);
  }

  // Badge: Group Hug Creator
  const createdGroupHugs = Array.from(groupHugs.values())
    .filter(g => g.creatorId === userId);

  if (createdGroupHugs.length >= 1 && !hasBadge(userId, 'group_hug_creator')) {
    const badge = {
      id: 'group_hug_creator',
      name: 'Group Hug Leader',
      description: 'Created your first group hug',
      category: 'hugs'
    };

    awardBadge(userId, badge);
  }
}

/**
 * Send streak milestone notification to user
 * @param {WebSocket} ws - The WebSocket connection
 * @param {string} userId - The user ID
 * @param {Object} streakUpdate - The streak update data
 */
function sendStreakMilestoneNotification(ws, userId, streakUpdate) {
  if (!streakUpdate || !streakUpdate.rewards) return;
  
  const { rewards, userStreak } = streakUpdate;
  const streakCount = userStreak.currentStreak;
  
  // Create a nice message with the rewards
  let rewardMessages = rewards.map(reward => {
    if (reward.rewardType === 'badge') {
      return `Badge: ${reward.rewardName} - ${reward.rewardDescription}`;
    } else if (reward.rewardType === 'points') {
      return `${reward.rewardValue} streak points`;
    } else if (reward.rewardType === 'hugType') {
      return `New hug type: ${reward.rewardName}`;
    } else if (reward.rewardType === 'theme') {
      return `New theme: ${reward.rewardName}`;
    } else if (reward.rewardType === 'avatarItem') {
      return `New avatar item: ${reward.rewardName}`;
    }
    return reward.rewardName;
  });
  
  // Send the notification
  send(ws, {
    type: 'streak_milestone_reached',
    data: {
      milestone: streakCount,
      message: `Congratulations! You've reached a ${streakCount}-day wellness streak!`,
      rewards: rewardMessages
    }
  });
  
  // Also send to user if they have multiple devices connected
  sendToUser(userId, {
    type: 'streak_milestone_reached',
    data: {
      milestone: streakCount,
      message: `Congratulations! You've reached a ${streakCount}-day wellness streak!`,
      rewards: rewardMessages
    }
  });
}

/**
 * Check and award sharing badges
 * @param {string} userId - The user ID
 * @param {string} platform - The social platform
 */
function checkAndAwardSharingBadges(userId, platform) {
  // Badge: First Share - Share your first hug on social media
  if (!hasBadge(userId, 'first_share')) {
    const badge = {
      id: 'first_share',
      name: 'Social Butterfly',
      description: 'Shared your first hug on social media',
      category: 'social'
    };

    awardBadge(userId, badge);
  }

  // Platform-specific badges could be added here
}

/**
 * Handle fetching data
 * @param {WebSocket} ws - The client WebSocket connection
 * @param {Map} clients - The map of client connections
 * @param {Object} data - The fetch request data
 */
// Import the optimized fetch handler
const handleFetchDataFromMesh = require('./fixedHandleFetchData');

/**
 * Generate a token for a user
 * @param {string} userId - The user ID
 * @returns {string} JWT token
 */
function getTokenForUser(userId) {
  // Check if this is an anonymous user
  const isAnonymous = userId.startsWith('anon-');
  
  // Generate token
  return jwt.sign(
    { 
      userId, 
      isAnonymous 
    },
    JWT_SECRET,
    { 
      expiresIn: isAnonymous ? '24h' : '7d' 
    }
  );
}

async function handleFetchData(ws, clients, data) {
  try {
    // First, let's try to use the GraphQL Mesh gateway if it's available
    try {
      // Add client info to the fixed handler format
      const clientId = [...clients.entries()].find(([_, client]) => client.ws === ws)?.[0];
      
      if (clientId) {
        const client = clients.get(clientId);
        
        // Add token and user info to client object for the handler
        if (client && client.isAuthenticated) {
          client.user = {
            id: client.userId,
            token: client.token || getTokenForUser(client.userId)
          };
        }
        
        // Try to use the optimized GraphQL Mesh handler
        return await handleFetchDataFromMesh(ws, clients, data);
      }
    } catch (meshError) {
      console.log('GraphQL Mesh fetch failed, falling back to legacy method:', meshError.message);
      // If the optimized handler fails, fall back to the original implementation
    }
    
    // Legacy implementation as fallback
    const { dataType, timeRange, includeCorrelations } = data;

    // Find the client info
    const clientEntry = Array.from(clients.entries())
      .find(([_, client]) => client.ws === ws);

    if (!clientEntry || !clientEntry[1].isAuthenticated) {
      console.error('Client not authenticated');
      send(ws, {
        type: 'fetch_data_error',
        error: 'Authentication required',
        authRequired: true
      });
      return;
    }

    const userId = clientEntry[1].userId;
    
    // Check if user is anonymous (stored only in memory)
    const isAnonymous = userId && userId.startsWith('anon-');

    switch (dataType) {
      case 'hugs':
        if (isAnonymous) {
          // For anonymous users, use in-memory data
          const userHugs = hugHistory.get(userId) || [];
          send(ws, {
            type: 'hugs_data',
            hugs: userHugs
          });
        } else {
          // For registered users, query from database
          const hugs = await Hug.findAll({
            where: {
              [Op.or]: [
                { senderId: userId },
                { recipientId: userId }
              ]
            },
            order: [['createdAt', 'DESC']],
            limit: data.limit || 10
          });
          
          // Format hugs for the client
          const formattedHugs = hugs.map(hug => ({
            id: hug.id,
            senderId: hug.senderId,
            senderName: hug.senderName, // This should come from a join with User model ideally
            recipientId: hug.recipientId,
            hugType: hug.hugType,
            message: hug.message,
            timestamp: hug.createdAt.getTime(),
            viewed: hug.viewed
          }));
          
          send(ws, {
            type: 'hugs_data',
            hugs: formattedHugs
          });
        }
        break;

      case 'hug_requests':
        if (isAnonymous) {
          // For anonymous users, use in-memory data
          // Fetch directed requests first (where user is recipient)
          const directedRequests = Array.from(hugRequests.values())
            .flat()
            .filter(req => req.recipientId === userId && req.status === 'pending');

          // Now get anonymous community requests
          const communityRequests = Array.from(hugRequests.values())
            .flat()
            .filter(req => req.isAnonymous && req.status === 'pending' && req.senderId !== userId);

          // Combine both types
          const allRequests = [...directedRequests, ...communityRequests];

          send(ws, {
            type: 'hug_requests_data',
            requests: allRequests
          });
        } else {
          // For registered users, we would query from database
          // Note: Since HugRequest model isn't implemented yet, we'll use in-memory for now
          // TODO: Implement HugRequest model and database queries
          
          // Temporary fallback to in-memory data:
          const directedRequests = Array.from(hugRequests.values())
            .flat()
            .filter(req => req.recipientId === userId && req.status === 'pending');

          const communityRequests = Array.from(hugRequests.values())
            .flat()
            .filter(req => req.isAnonymous && req.status === 'pending' && req.senderId !== userId);

          const allRequests = [...directedRequests, ...communityRequests];

          send(ws, {
            type: 'hug_requests_data',
            requests: allRequests
          });
        }
        break;

      case 'group_hugs':
        if (isAnonymous) {
          // Anonymous users don't have group hugs
          send(ws, {
            type: 'group_hugs_data',
            groupHugs: []
          });
        } else {
          // For registered users, query from database through joins
          // TODO: Implement proper GroupHug model querying
          // For now, use in-memory data
          const userGroupHugs = Array.from(groupHugs.values())
            .filter(group => group.participantIds.includes(userId));

          send(ws, {
            type: 'group_hugs_data',
            groupHugs: userGroupHugs
          });
        }
        break;

      case 'mood_analytics': // Changed from moodAnalytics for consistency
        // Generate and send advanced mood analytics
        let analytics;
        
        if (isAnonymous) {
          // For anonymous users, use in-memory data
          analytics = generateMoodAnalytics(userId, timeRange, includeCorrelations);
        } else {
          // For registered users, query mood data from database
          const moodEntries = await Mood.findAll({
            where: {
              userId: userId,
              createdAt: {
                [Op.gte]: new Date(Date.now() - (timeRange * 24 * 60 * 60 * 1000))
              }
            },
            order: [['createdAt', 'DESC']]
          });
          
          // If user has no mood entries, return starter data
          if (moodEntries.length === 0) {
            analytics = {
              moodEntries: [],
              summary: {
                dominantMoodGroup: 'neutral',
                moodVariability: 'insufficientdata',
                longestStreak: 0,
                currentStreak: 0,
                improvementTrend: 'insufficient_data',
                averageMoodScore: 5,
              },
              insights: [],
              recommendations: [
                {
                  type: 'general',
                  title: 'Start Your Mood Journey',
                  description: 'Track your mood daily to receive personalized recommendations.',
                  actionLabel: 'Log Mood'
                }
              ]
            };
          } else {
            // Convert DB entities to the format expected by generateMoodAnalytics
            const formattedEntries = moodEntries.map(entry => ({
              id: entry.id,
              userId: entry.userId,
              mood: entry.mood,
              intensity: entry.intensity,
              note: entry.note,
              isPublic: !entry.isPrivate,
              activities: entry.activities,
              location: entry.location,
              timestamp: entry.createdAt.getTime()
            }));
            
            // Store in memory for analytics processing
            moodHistory.set(userId, formattedEntries);
            
            // Generate analytics
            analytics = generateMoodAnalytics(userId, timeRange, includeCorrelations);
          }
        }
        
        send(ws, {
          type: 'mood_analytics_data',
          data: analytics
        });
        break;

      case 'mood_history':
        // We'll implement a database approach for registered users
        if (isAnonymous) {
          // For anonymous users, use in-memory data
          const userMoodHistory = moodHistory.get(userId) || [];
          
          // Format the response
          const formattedMoodHistory = {
            [userId]: {
              history: userMoodHistory,
              latestMood: userMoodHistory.length > 0 ? {
                mood: userMoodHistory[0].mood,
                intensity: userMoodHistory[0].intensity,
                timestamp: userMoodHistory[0].timestamp
              } : null
            }
          };
          
          send(ws, {
            type: 'mood_history_data',
            moodHistory: formattedMoodHistory
          });
        } else {
          // For registered users, query from database
          const moodEntries = await Mood.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: data.limit || 50
          });
          
          // Convert DB entities to the expected format
          const formattedEntries = moodEntries.map(entry => ({
            id: entry.id,
            userId: entry.userId,
            mood: entry.mood,
            intensity: entry.intensity,
            note: entry.note,
            isPublic: !entry.isPrivate,
            activities: entry.activities || [],
            location: entry.location,
            timestamp: entry.createdAt.getTime()
          }));
          
          // Format the response
          const formattedMoodHistory = {
            [userId]: {
              history: formattedEntries,
              latestMood: formattedEntries.length > 0 ? {
                mood: formattedEntries[0].mood,
                intensity: formattedEntries[0].intensity,
                timestamp: formattedEntries[0].timestamp
              } : null
            }
          };
          
          // TODO: Add mood data for followed users (requires database joins)
          
          send(ws, {
            type: 'mood_history_data',
            moodHistory: formattedMoodHistory
          });
        }
        break;

      case 'following':
        // Send users that this user follows
        const following = Array.from(followConnections.values())
          .filter(follow => follow.followerId === userId)
          .map(follow => {
            const user = users.get(follow.followingId);
            return {
              id: follow.followingId,
              username: user?.username || 'User',
              avatar: user?.avatar || null,
              isOnline: onlineUsers.has(follow.followingId)
            };
          });

        send(ws, {
          type: 'following_data',
          following
        });
        break;

      case 'followers':
        // Send users that follow this user
        const followers = Array.from(followConnections.values())
          .filter(follow => follow.followingId === userId)
          .map(follow => {
            const user = users.get(follow.followerId);
            return {
              id: follow.followerId,
              username: user?.username || 'User',
              avatar: user?.avatar || null,
              isOnline: onlineUsers.has(follow.followerId)
            };
          });

        send(ws, {
          type: 'followers_data',
          followers
        });
        break;

      case 'badges':
        // Send badges earned by this user
        const userBadgesList = [];

        if (userId in userBadges) {
          userBadgesList.push(...userBadges.get(userId));
        }

        send(ws, {
          type: 'badges_data',
          badges: userBadgesList
        });
        break;

      case 'hug_types':
        // Send available hug types
        send(ws, {
          type: 'hug_types_data',
          hugTypes: [
            {
              id: 'comfort',
              name: 'Comfort Hug',
              description: 'A warm embrace to lift your spirits',
              icon: 'fas fa-cloud'
            },
            {
              id: 'celebration',
              name: 'Celebration Hug',
              description: 'Share your joy with someone special',
              icon: 'fas fa-birthday-cake'
            },
            {
              id: 'support',
              name: 'Support Hug',
              description: 'Let them know you\'re there for them',
              icon: 'fas fa-hands-helping'
            },
            {
              id: 'energizing',
              name: 'Energizing Hug',
              description: 'A burst of positive energy and encouragement',
              icon: 'fas fa-bolt'
            },
            {
              id: 'bear',
              name: 'Bear Hug',
              description: 'A big, strong, enveloping hug',
              icon: 'fas fa-paw'
            },
            {
              id: 'healing',
              name: 'Healing Hug',
              description: 'A gentle embrace to help recovery',
              icon: 'fas fa-heart'
            },
            {
              id: 'friendship',
              name: 'Friendship Hug',
              description: 'A hug that celebrates your special bond',
              icon: 'fas fa-user-friends'
            }
          ]
        });
        break;

      case 'contacts':
        // Send user contacts (including additional data for RequestHug component)
        const userContacts = Array.from(followConnections.values())
          .filter(follow => follow.followerId === userId || follow.followingId === userId)
          .map(follow => {
            const contactId = follow.followerId === userId ? follow.followingId : follow.followerId;
            const user = users.get(contactId);
            const lastMood = moodHistory.get(contactId)?.find(m => m.isPublic)?.mood || null;

            return {
              contactId: contactId,  // Use contactId property name for consistency
              name: user?.username || 'User',  // Usename property name for consistency
              avatar: user?.avatar || null,
              isOnline: onlineUsers.has(contactId),
              isFavorite: false,
              mood: lastMood,
              lastInteraction: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
              recentHugs: (hugHistory.get(contactId) || [])
                .filter(hug => hug.recipientId === userId || hug.senderId === userId)
                .slice(0, 3)
                .map(hug => ({
                  type: hug.hugType,
                  timestamp: hug.timestamp
                }))
            };
          });

        // Add some default recommended contacts if none exist
        if (userContacts.length === 0) {
          // Generate a couple of default contacts for demo purposes
          const defaultContactIds = ['user1', 'user2', 'user3'];
          for (const contactId of defaultContactIds) {
            if (!users.has(contactId)) {
              users.set(contactId, {
                id: contactId,
                username: `Friend ${contactId.slice(-1)}`,
                avatar: null,
                mood: null,
                lastActivity: Date.now() - (24 * 60 * 60 * 1000)
              });
            }

            userContacts.push({
              contactId: contactId,
              name: users.get(contactId).username,
              avatar: null,
              isOnline: onlineUsers.has(contactId),
              isFavorite: false,
              mood: null,
              lastInteraction: Date.now() - (24 * 60 * 60 * 1000),
              recentHugs: []
            });
          }
        }

        send(ws, {
          type: 'contacts_data',
          contacts: userContacts
        });
        break;

      case 'status_tags':
        // Send available status tags
        send(ws, {
          type: 'status_tags_data',
          statusTags: [
            {
              id: 'relaxing',
              name: 'Relaxing',
              icon: 'fa-couch',
              color: '#4CAF50',
              isSelected: false
            },
            {
              id: 'working',
              name: 'Working',
              icon: 'fa-briefcase',
              color: '#2196F3',
              isSelected: false
            },
            {
              id: 'traveling',
              name: 'Traveling',
              icon: 'fa-plane',
              color: '#FF9800',
              isSelected: false
            },
            {
              id: 'gaming',
              name: 'Gaming',
              icon: 'fa-gamepad',
              color: '#9C27B0',
              isSelected: false
            },
            {
              id: 'exercising',
              name: 'Exercising',
              icon: 'fa-running',
              color: '#F44336',
              isSelected: false
            },
            {
              id: 'eating',
              name: 'Eating',
              icon: 'fa-utensils',
              color: '#795548',
              isSelected: false
            },
            {
              id: 'studying',
              name: 'Studying',
              icon: 'fa-book',
              color: '#3F51B5',
              isSelected: false
            }
          ]
        });
        break;

      case 'notification_settings':
        // Send notification settings for followed users
        const notificationSettings = {};
        const followedUserIds = Array.from(followConnections.values())
          .filter(follow => follow.followerId === userId)
          .map(follow => follow.followingId);

        for (const followedId of followedUserIds) {
          notificationSettings[followedId] = {
            notifyOnUpdate: true,
            notifyOnLowMood: true
          };
        }

        send(ws, {
          type: 'notification_settings_data',
          settings: notificationSettings
        });
        break;

      case 'community_feed':
        // Get filter parameter if provided
        const feedFilter = data.filter || 'all';

        // Generate sample community feed data
        const communityPosts = generateCommunityFeedData(feedFilter);

        send(ws, {
          type: 'community_feed_data',
          posts: communityPosts
        });
        break;

      default:
        console.log(`Unknown data type requested: ${dataType}`);
        send(ws, {
          type: 'error',
          message: `Unknown data type: ${dataType}`
        });
    }
  } catch (error) {
    console.error('Error handling fetch data request:', error);
    send(ws, {
      type: 'error',
      message: 'Error processing your request'
    });
  }
}

/**
 * Generate advanced mood analytics data
 * @param {string} userId - The user ID
 * @param {number} timeRange - Time range in days
 * @param {boolean} includeCorrelations - Whether to include correlation data
 * @returns {Object} Mood analytics data
 */
function generateMoodAnalytics(userId, timeRange = 30, includeCorrelations = true) {
  const userMoodHistory = moodHistory.get(userId) || [];

  if (!userMoodHistory || userMoodHistory.length === 0) {
    return {
      moodEntries: [],
      summary: {
        dominantMoodGroup: 'neutral',
        moodVariability: 'insufficientdata',
        longestStreak: 0,
        currentStreak: 0,
        improvementTrend: 'insufficient_data',
        averageMoodScore: 5,
      },
      insights: [],
      recommendations: [
        {
          type: 'general',
          title: 'Start Your Mood Journey',
          description: 'Track your mood daily to receive personalized recommendations.',
          actionLabel: 'Log Mood'
        }
      ]
    };
  }

  // Filter mood entries based on time range
  const now = Date.now();
  const timeRangeMs = timeRange * 24 * 60 * 60 * 1000; // Convert days to ms
  const filteredMoodEntries = userMoodHistory.filter(entry => {
    return (now - entry.timestamp) <= timeRangeMs;
  });

  // Calculate basic metrics
  const currentStreak = calculateMoodStreak(userMoodHistory);
  const longestStreak = calculateLongestStreak(userMoodHistory);

  // Calculate mood frequency
  const moodFrequency = calculateMoodFrequency(filteredMoodEntries);

  // Calculate mood by day of week
  const moodByDayOfWeek = calculateMoodByDayOfWeek(filteredMoodEntries);

  // Calculate mood by time of day
  const moodByTimeOfDay = calculateMoodByTimeOfDay(filteredMoodEntries);

  // Generate correlations data if requested
  let correlations = null;
  if (includeCorrelations) {
    correlations = generateCorrelationsData(userId, filteredMoodEntries);
  }

  // Process entries to include numeric mood values
  const processedEntries = filteredMoodEntries.map(entry => {
    // Mapping mood names to numeric values (1-10 scale)
    const moodValues = {
      'happy': 9,
      'joyful': 10,
      'excited': 8,
      'content': 7,
      'peaceful': 6,
      'relaxed': 7,
      'neutral': 5,
      'tired': 4,
      'bored': 4,
      'anxious': 3,
      'stressed': 2,
      'sad': 2,
      'depressed': 1,
      'angry': 2,
      'irritated': 3
    };

    return {
      ...entry,
      moodValue: moodValues[entry.mood] || 5
    };
  });

  // Group moods into categories
  const moodGroups = {
    'joyful': ['happy', 'joyful', 'excited'],
    'peaceful': ['content', 'peaceful', 'relaxed'],
    'neutral': ['neutral'],
    'sad': ['sad', 'depressed'],
    'anxious': ['anxious', 'stressed', 'tired'],
    'angry': ['angry', 'irritated', 'bored']
  };

  // Calculate dominant mood group
  let dominantGroup = 'neutral';
  let maxCount = 0;

  Object.entries(moodGroups).forEach(([group, moods]) => {
    const count = moods.reduce((sum, mood) => {
      return sum + (moodFrequency[mood] || 0);
    }, 0);

    if (count > maxCount) {
      maxCount = count;
      dominantGroup = group;
    }
  });

  // Calculate average mood score
  const totalMoodScore = processedEntries.reduce((sum, entry) => sum + entry.moodValue, 0);
  const averageMoodScore = processedEntries.length > 0 ? (totalMoodScore / processedEntries.length) : 5;

  // Determine mood variability
  let moodVariability = 'insufficient_data';

  if (processedEntries.length >= 5) {
    const moodValues = processedEntries.map(entry => entry.moodValue);
    const mean = moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length;
    const squaredDifferences = moodValues.map(value => Math.pow(value - mean, 2));
    const variance = squaredDifferences.reduce((sum, value) => sum + value, 0) / moodValues.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev < 1.0) moodVariability = 'low';
    else if (stdDev < 2.0) moodVariability = 'moderate';
    else moodVariability = 'high';
  }

  // Determine improvement trend
  let improvementTrend = 'insufficient_data';

  if (processedEntries.length >= 7) {
    // Sort entries by date
    const sortedEntries = [...processedEntries].sort((a, b) => {
      return a.timestamp - b.timestamp;
    });

    // Calculate linear regression
    const n = sortedEntries.length;
    const xValues = Array.from({ length: n }, (_, i) => i + 1);
    const yValues = sortedEntries.map(entry => entry.moodValue);

    const sumX = xValues.reduce((sum, x) => sum + x, 0);
    const sumY = yValues.reduce((sum, y) => sum + y, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXSquared = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXSquared - sumX * sumX);

    if (slope > 0.05) improvementTrend = 'improving';
    else if (slope < -0.05) improvementTrend = 'declining';
    else improvementTrend = 'stable';
  }

  // Generate insights
  const insights = generateInsights(
    processedEntries,
    moodFrequency,
    moodByDayOfWeek,
    moodByTimeOfDay,
    correlations,
    currentStreak,
    dominantGroup,
    moodVariability,
    improvementTrend
  );

  // Generate recommendations
  const recommendations = generateRecommendations(
    processedEntries,
    moodFrequency,
    moodByDayOfWeek,
    moodByTimeOfDay,
    correlations,
    currentStreak,
    dominantGroup,
    moodVariability,
    improvementTrend
  );

  // Compile analytics data
  return {
    moodEntries: processedEntries,
    moodFrequency,
    moodByDayOfWeek,
    moodByTimeOfDay,
    correlations,
    longestStreak,
    currentStreak,
    summary: {
      dominantMoodGroup: dominantGroup,
      moodVariability,
      longestStreak,
      currentStreak,
      improvementTrend,
      averageMoodScore: parseFloat(averageMoodScore.toFixed(1)),
    },
    insights,
    recommendations
  };
}

/**
 * Calculate frequency of each mood
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Object} Mood frequency counts
 */
function calculateMoodFrequency(moodEntries) {
  const frequency = {};

  moodEntries.forEach(entry => {
    const mood = entry.mood;
    frequency[mood] = (frequency[mood] || 0) + 1;
  });

  return frequency;
}

/**
 * Calculate mood patterns by day of week
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Object} Mood data by day of week
 */
function calculateMoodByDayOfWeek(moodEntries) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayData = {};

  // Initialize data structure
  dayNames.forEach(day => {
    dayData[day] = {
      count: 0,
      sum: 0,
      entries: []
    };
  });

  // Populate data
  moodEntries.forEach(entry => {
    const date = new Date(entry.timestamp);
    const dayOfWeek = dayNames[date.getDay()];
    const moodValue = entry.moodValue || 5;

    dayData[dayOfWeek].count++;
    dayData[dayOfWeek].sum += moodValue;
    dayData[dayOfWeek].entries.push(entry);
  });

  // Calculate averages
  dayNames.forEach(day => {
    if (dayData[day].count > 0) {
      dayData[day].averageScore = parseFloat((dayData[day].sum / dayData[day].count).toFixed(1));
    } else {
      dayData[day].averageScore = 0;
    }
  });

  return dayData;
}

/**
 * Calculate mood patterns by time of day
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Object} Mood data by time of day
 */
function calculateMoodByTimeOfDay(moodEntries) {
  const timeData = {
    morning: { count: 0, sum: 0, entries: [] },
    afternoon: { count: 0, sum: 0, entries: [] },
    evening: { count: 0, sum: 0, entries: [] },
    night: { count: 0, sum: 0, entries: [] }
  };

  // Populate data
  moodEntries.forEach(entry => {
    const date = new Date(entry.timestamp);
    const hour = date.getHours();
    const moodValue = entry.moodValue || 5;

    let timeOfDay;
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    timeData[timeOfDay].count++;
    timeData[timeOfDay].sum += moodValue;
    timeData[timeOfDay].entries.push(entry);
  });

  // Calculate averages
  Object.keys(timeData).forEach(time => {
    if (timeData[time].count > 0) {
      timeData[time].averageScore = parseFloat((timeData[time].sum / timeData[time].count).toFixed(1));
    } else {
      timeData[time].averageScore = 0;
    }
  });

  return timeData;
}

/**
 * Generate correlations between moods and various factors
 * @param {string} userId - The user ID
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Object} Correlation data
 */
function generateCorrelationsData(userId, moodEntries) {
  // This would normally analyze activities, social interactions, etc.
  // For demo purposes, we'll generate some sample correlations

  const correlations = {
    activities: [
      {
        activity: 'Exercise',
        impact: 0.75,
        frequency: 0.3,
        confidence: 'high'
      },
      {
        activity: 'Reading',
        impact: 0.45,
        frequency: 0.2,
        confidence: 'medium'
      },
      {
        activity: 'Social Media',
        impact: -0.3,
        frequency: 0.8,
        confidence: 'medium'
      },
      {
        activity: 'Outdoor Time',
        impact: 0.6,
        frequency: 0.15,
        confidence: 'medium'
      },
      {
        activity: 'Work Meetings',
        impact: -0.2,
        frequency: 0.5,
        confidence: 'low'
      }
    ],
    social: {
      impact: 0.4,
      frequency: 0.35,
      confidence: 'medium'
    },
    sleep: {
      impact: 0.65,
      quality: {
        good: 0.3,
        average: 0.5,
        poor: 0.2
      },
      confidence: 'medium'
    },
    weather: {
      impact: 0.25,
      conditions: {
        sunny: 0.4,
        cloudy: -0.1,
        rainy: -0.3
      },
      confidence: 'low'
    }
  };

  return correlations;
}

/**
 * Generate personalized insights based on mood data
 * @param {Array} moodEntries - Processed mood entries
 * @param {Object} moodFrequency - Mood frequency data
 * @param {Object} moodByDayOfWeek - Mood by day of week data
 * @param {Object} moodByTimeOfDay - Mood by time of day data
 * @param {Object} correlations - Correlations data
 * @param {number} currentStreak - Current mood tracking streak
 * @param {string} dominantGroup - Dominant mood group
 * @param {string} moodVariability - Mood variability level
 * @param {string} improvementTrend - Mood improvement trend
 * @returns {Array} Array of insight objects
 */
function generateInsights(
  moodEntries, 
  moodFrequency, 
  moodByDayOfWeek, 
  moodByTimeOfDay,
  correlations,
  currentStreak,
  dominantGroup,
  moodVariability,
  improvementTrend
) {
  if (!moodEntries || moodEntries.length < 7) {
    return [{
      type: 'info',
      title: 'Keep Tracking Your Mood',
      description: 'Continue logging your mood daily to unlock personalized insights.'
    }];
  }

  const insights = [];

  // Find best and worst days
  const bestDay = findExtremeDayOfWeek(moodByDayOfWeek, 'best');
  const worstDay = findExtremeDayOfWeek(moodByDayOfWeek, 'worst');

  if (bestDay) {
    insights.push({
      type: 'positive',
      title: `${bestDay.day} is Your Best Day`,
      description: `You tend to feel your best on ${bestDay.day}s. Plan special activities on this day to maximize your well-being.`,
      data: { day: bestDay.day, score: bestDay.score }
    });
  }

  if (worstDay) {
    insights.push({
      type: 'challenge',
      title: `${worstDay.day} is Your Most Challenging Day`,
      description: `You often experience more difficult moods on ${worstDay.day}s. Consider extra self-care on these days.`,
      data: { day: worstDay.day, score: worstDay.score }
    });
  }

  // Find best and worst times of day
  const bestTime = findExtremeTimeOfDay(moodByTimeOfDay, 'best');
  const worstTime = findExtremeTimeOfDay(moodByTimeOfDay, 'worst');

  if (bestTime) {
    insights.push({
      type: 'positive',
      title: `${capitalizeFirstLetter(bestTime.timeOfDay)} is Your Peak Time`,
      description: `You typically feel your best during the ${bestTime.timeOfDay}. Schedule important activities during this time when possible.`,
      data: { timeOfDay: bestTime.timeOfDay, score: bestTime.score }
    });
  }

  // Add correlations insights
  if (correlations && correlations.activities && correlations.activities.length > 0) {
    const positiveActivities = correlations.activities.filter(a => a.impact > 0.3);
    const negativeActivities = correlations.activities.filter(a => a.impact < -0.3);

    if (positiveActivities.length > 0) {
      const topActivity = positiveActivities[0];
      insights.push({
        type: 'positive',
        title: `${topActivity.activity} Boosts Your Mood`,
        description: `When you ${topActivity.activity.toLowerCase()}, your mood tends to improve. Consider making this a regular part of your routine.`,
        data: { activity: topActivity.activity, impact: topActivity.impact }
      });
    }

    if (negativeActivities.length > 0) {
      const topNegativeActivity = negativeActivities[0];
      insights.push({
        type: 'challenge',
        title: `${topNegativeActivity.activity} Affects Your Mood`,
        description: `You often experience mood dips after ${topNegativeActivity.activity.toLowerCase()}. Consider ways to manage or limit this activity.`,
        data: { activity: topNegativeActivity.activity, impact: topNegativeActivity.impact }
      });
    }
  }

  // Add social impact insights
  if (correlations && correlations.social) {
    if (correlations.social.impact > 0.3) {
      insights.push({
        type: 'positive',
        title: 'Social Connection Improves Your Mood',
        description: 'Your mood data shows that social interactions have a positive effect on your wellbeing. Try to prioritize connecting with others regularly.',
        data: { impact: correlations.social.impact }
      });
    } else if (correlations.social.impact < -0.3) {
      insights.push({
        type: 'insight',
        title: 'You May Need More Alone Time',
        description: 'Your data suggests you might benefit from more personal space and alone time to process your emotions.',
        data: { impact: correlations.social.impact }
      });
    }
  }

  // Add variability insight
  if (moodVariability === 'high') {
    insights.push({
      type: 'insight',
      title: 'Your Moods Show Significant Fluctuation',
      description: 'Your emotional landscape is quite varied. Regular mindfulness practices might help you find more stability.',
      data: { variability: moodVariability }
    });
  } else if (moodVariability === 'low') {
    insights.push({
      type: 'insight',
      title: 'Your Mood is Quite Stable',
      description: 'You maintain a consistent emotional state. This stability can be a strength, but don\'t forget to embrace the full range of emotions.',
      data: { variability: moodVariability }
    });
  }

  // Add trend insights
  if (improvementTrend === 'improving') {
    insights.push({
      type: 'positive',
      title: 'Your Mood is Improving',
      description: 'Your overall mood trend is positive. Keep up the good work with whatever changes you\'ve been making!',
      data: { trend: improvementTrend }
    });
  } else if (improvementTrend === 'declining') {
    insights.push({
      type: 'challenge',
      title: 'Your Mood is Declining',
      description: 'Your overall mood trend has been dipping lately. This might be a good time to focus on self-care and supportive activities.',
      data: { trend: improvementTrend }
    });
  }

  // Add streak insights
  if (currentStreak >= 7) {
    insights.push({
      type: 'achievement',
      title: 'Impressive Tracking Streak!',
      description: `You've logged your mood for ${currentStreak} consecutive days. Consistent tracking leads to better self-awareness.`,
      data: { streak: currentStreak }
    });
  }

  return insights;
}

/**
 * Generate personalized recommendations based on mood data
 * @param {Array} moodEntries - Processed mood entries
 * @param {Object} moodFrequency - Mood frequency data
 * @param {Object} moodByDayOfWeek - Mood by day of week data
 * @param {Object} moodByTimeOfDay - Mood by time of day data
 * @param {Object} correlations - Correlations data
 * @param {number} currentStreak - Current mood tracking streak
 * @param {string} dominantGroup - Dominant mood group
 * @param {string} moodVariability - Mood variability level
 * @param {string} improvementTrend - Mood improvement trend
 * @returns {Array} Array of recommendation objects
 */
function generateRecommendations(
  moodEntries, 
  moodFrequency, 
  moodByDayOfWeek, 
  moodByTimeOfDay,
  correlations,
  currentStreak,
  dominantGroup,
  moodVariability,
  improvementTrend
) {
  if (!moodEntries || moodEntries.length < 7) {
    return [{
      type: 'general',
      title: 'Start Your Mood Journey',
      description: 'Track your mood daily to receive personalized recommendations.',
      actionLabel: 'Log Mood'
    }];
  }

  const recommendations = [];

  // Basic recommendations based on dominant mood group
  switch (dominantGroup) {
    case 'joyful':
      recommendations.push({
        type: 'connection',
        title: 'Share Your Positive Energy',
        description: 'You\'re experiencing a lot of positive emotions. Consider using this energy to connect with others who might need support.',
        actionLabel: 'Send a Hug'
      });
      break;

    case 'peaceful':
      recommendations.push({
        type: 'reflection',
        title: 'Deepen Your Mindfulness Practice',
        description: 'Your peaceful state is a great foundation for deeper mindfulness. Consider trying more advanced meditation techniques.',
        actionLabel: 'Explore Mindfulness'
      });
      break;

    case 'sad':
      recommendations.push({
        type: 'support',
        title: 'Gentle Support System',
        description: 'You\'ve been experiencing sadness lately. Consider reaching out to friends or trying mood-boosting activities like nature walks or creative expression.',
        actionLabel: 'Connect with Support'
      });
      break;

    case 'anxious':
      recommendations.push({
        type: 'coping',
        title: 'Anxiety Management Techniques',
        description: 'Your data shows patterns of anxiety. Try grounding exercises, deep breathing, or progressive muscle relaxation.',
        actionLabel: 'Learn Techniques'
      });
      break;

    case 'angry':
      recommendations.push({
        type: 'regulation',
        title: 'Healthy Expression Techniques',
        description: 'Channel your strong emotions into constructive outlets like physical exercise, journaling, or talking with a trusted friend.',
        actionLabel: 'Try Techniques'
      });
      break;

    default:
      recommendations.push({
        type: 'general',
        title: 'Explore Your Emotional Patterns',
        description: 'Try adding context to your mood tracking to discover deeper patterns in your emotional life.',
        actionLabel: 'Add Context'
      });
  }

  // Add time-based recommendations
  if (moodByTimeOfDay) {
    const worstTime = findExtremeTimeOfDay(moodByTimeOfDay, 'worst');
    if (worstTime) {
      recommendations.push({
        type: 'timing',
        title: `${capitalizeFirstLetter(worstTime.timeOfDay)} Support Plan`,
        description: `Your mood tends to dip during the ${worstTime.timeOfDay}. Prepare for this time with mood-supporting activities.`,
        actionLabel: 'Create Plan',
        data: { timeOfDay: worstTime.timeOfDay }
      });
    }
  }

  // Add activity recommendations
  if (correlations && correlations.activities) {
    // Find activities with positive correlation but low frequency
    const positiveActivities = correlations.activities
      .filter(a => a.impact > 0.3 && a.frequency < 0.3)
      .slice(0, 2);

    if (positiveActivities.length > 0) {
      positiveActivities.forEach(activity => {
        recommendations.push({
          type: 'activity',
          title: `Do More ${activity.activity}`,
          description: `This activity has a positive effect on your mood but you don't do it very often.`,
          actionLabel: 'Schedule Activity',
          data: { activity: activity.activity, impact: activity.impact }
        });
      });
    }
  }

  // Add streak-related recommendation
  if (!currentStreak || currentStreak < 3) {
    recommendations.push({
      type: 'habit',
      title: 'Build Your Tracking Habit',
      description: 'Regular mood tracking gives you the most accurate insights. Try setting a daily reminder.',
      actionLabel: 'Set Reminder'
    });
  }

  // Add social recommendations
  if (correlations && correlations.social) {
    const socialImpact = correlations.social.impact;

    if (socialImpact > 0.3 && correlations.social.frequency < 0.4) {
      recommendations.push({
        type: 'social',
        title: 'Increase Social Connections',
        description: 'Social interactions improve your mood. Consider scheduling more time with friends or joining group activities.',
        actionLabel: 'Find Connections'
      });
    } else if (socialImpact < -0.2 && correlations.social.frequency > 0.6) {
      recommendations.push({
        type: 'solitude',
        title: 'Balance Social Energy',
        description: 'You might benefit from more alone time to recharge. Schedule some peaceful solitude in your week.',
        actionLabel: 'Plan Me-Time'
      });
    }
  }

  return recommendations;
}

/**
 * Find the best or worst day of the week based on mood scores
 * @param {Object} moodByDayOfWeek - Mood by day of week data
 * @param {string} type - 'best' or 'worst'
 * @returns {Object|null} Day information or null if insufficient data
 */
function findExtremeDayOfWeek(moodByDayOfWeek, type) {
  if (!moodByDayOfWeek) return null;

  let extremeDay = null;
  let extremeScore = type === 'best' ? -Infinity : Infinity;
  const compare = type === 'best' 
    ? (curr, extreme) => curr > extreme
    : (curr, extreme) => curr < extreme;

  Object.entries(moodByDayOfWeek).forEach(([day, data]) => {
    if (data.count >= 3 && compare(data.averageScore, extremeScore)) {
      extremeScore = data.averageScore;
      extremeDay = {
        day,
        score: data.averageScore,
        count: data.count
      };
    }
  });

  return extremeDay;
}

/**
 * Find the best or worst time of day based on mood scores
 * @param {Object} moodByTimeOfDay - Mood by time of day data
 * @param {string} type - 'best' or 'worst'
 * @returns {Object|null} Time of day information or null if insufficient data
 */
function findExtremeTimeOfDay(moodByTimeOfDay, type) {
  if (!moodByTimeOfDay) return null;

  let extremeTime = null;
  let extremeScore = type === 'best' ? -Infinity : Infinity;
  const compare = type === 'best' 
    ? (curr, extreme) => curr > extreme
    : (curr, extreme) => curr < extreme;

  Object.entries(moodByTimeOfDay).forEach(([timeOfDay, data]) => {
    if (data.count >= 3 && compare(data.averageScore, extremeScore)) {
      extremeScore = data.averageScore;
      extremeTime = {
        timeOfDay,
        score: data.averageScore,
        count: data.count
      };
    }
  });

  return extremeTime;
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} The capitalized string
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Generate sample community feed data
 * @param {string} filter - The feed filter (all, moods, hugs, achievements)
 * @returns {Array} Array of sample feed posts
 */
function generateCommunityFeedData(filter) {
  // Sample user data for feed
  const sampleUsers = [
    { id: 'user1', username: 'Emily', avatar: null },
    { id: 'user2', username: 'Michael', avatar: null },
    { id: 'user3', username: 'Sophie', avatar: null },
    { id: 'user4', username: 'David', avatar: null },
    { id: 'user5', username: 'Olivia', avatar: null }
  ];

  // Sample moods
  const moodPosts = [
    {
      id: 'mood1',
      type: 'mood',
      userId: 'user1',
      username: 'Emily',
      userAvatar: null,
      timestamp: Date.now() - 1800000, // 30 minutes ago
      data: {
        mood: 'happy',
        intensity: 8,
        note: 'Just finished a great workout!'
      },
      likeCount: 5,
      commentCount: 2
    },
    {
      id: 'mood2',
      type: 'mood',
      userId: 'user3',
      username: 'Sophie',
      userAvatar: null,
      timestamp: Date.now() - 7200000, // 2 hours ago
      data: {
        mood: 'relaxed',
        intensity: 7,
        note: 'Enjoying a quiet afternoon with a good book'
      },
      likeCount: 3,
      commentCount: 1
    },
    {
      id: 'mood3',
      type: 'mood',
      userId: 'user5',
      username: 'Olivia',
      userAvatar: null,
      timestamp: Date.now() - 10800000, // 3 hours ago
      data: {
        mood: 'excited',
        intensity: 9,
        note: 'Just booked tickets for my dream vacation!'
      },
      likeCount: 8,
      commentCount: 4
    }
  ];

  // Sample hugs
  const hugPosts = [
    {
      id: 'hug1',
      type: 'hug',
      userId: 'user2',
      username: 'Michael',
      userAvatar: null,
      senderName: 'Michael',
      recipientName: 'Emily',
      isAnonymous: false,
      timestamp: Date.now() - 3600000, // 1 hour ago
      data: {
        hugType: 'comfort',
        message: 'Hang in there, everything will be okay!'
      },
      likeCount: 2,
      commentCount: 0
    },
    {
      id: 'hug2',
      type: 'hug',
      userId: 'user4',
      username: 'David',
      userAvatar: null,
      senderName: 'David',
      recipientName: 'Sophie',
      isAnonymous: false,
      timestamp: Date.now() - 5400000, // 1.5 hours ago
      data: {
        hugType: 'celebration',
        message: 'Congratulations on your new job!'
      },
      likeCount: 6,
      commentCount: 3
    },
    {
      id: 'anon1',
      type: 'hug',
      userId: 'anonymous',
      username: 'Anonymous',
      userAvatar: null,
      senderName: 'Anonymous',
      recipientName: 'Someone',
      isAnonymous: true,
      timestamp: Date.now() - 9000000, // 2.5 hours ago
      data: {
        hugType: 'support',
        message: 'You are not alone in this struggle'
      },
      likeCount: 10,
      commentCount: 5
    }
  ];

  // Sample group hugs
  const groupHugPosts = [
    {
      id: 'group1',
      type: 'group_hug',
      userId: 'user5',
      username: 'Olivia',
      userAvatar: null,
      creatorName: 'Olivia',
      participantCount: 3,
      isActive: true,
      timestamp: Date.now() - 1200000, // 20 minutes ago
      data: {
        hugType: 'friendship',
        message: 'Big group hug for our study group!'
      },
      likeCount: 3,
      commentCount: 1
    }
  ];

  // Sample achievements
  const achievementPosts = [
    {
      id: 'achieve1',
      type: 'achievement',
      userId: 'user1',
      username: 'Emily',
      userAvatar: null,
      timestamp: Date.now() - 4500000, // 1.25 hours ago
      data: {
        name: 'Mood Streak Master',
        description: 'Tracked mood for 30 consecutive days',
        badgeIcon: 'fa-calendar-check'
      },
      likeCount: 7,
      commentCount: 2
    },
    {
      id: 'achieve2',
      type: 'achievement',
      userId: 'user4',
      username: 'David',
      userAvatar: null,
      timestamp: Date.now() - 8400000, // 2.33 hours ago
      data: {
        name: 'Hug Enthusiast',
        description: 'Sent 50 virtual hugs',
        badgeIcon: 'fa-hand-holding-heart'
      },
      likeCount: 4,
      commentCount: 1
    }
  ];

  // Combine posts based on filter
  let combinedPosts = [];

  switch (filter) {
    case 'moods':
      combinedPosts = [...moodPosts];
      break;
    case 'hugs':
      combinedPosts = [...hugPosts, ...groupHugPosts];
      break;
    case 'achievements':
      combinedPosts = [...achievementPosts];
      break;
    default: // 'all'
      combinedPosts = [...moodPosts, ...hugPosts, ...groupHugPosts, ...achievementPosts];
  }

  // Sort posts by timestamp (newest first)
  return combinedPosts.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Calculate the longest mood tracking streak
 * @param {Array} moodEntries - Array of mood entries
 * @returns {number} The longest streak in days
 */
function calculateLongestStreak(moodEntries) {
  if (!moodEntries || moodEntries.length === 0) return 0;

  // Sort by timestamp
  const sortedEntries = [...moodEntries].sort((a, b) => a.timestamp - b.timestamp);

  // Get dates (ignoring time)
  const dates = sortedEntries.map(entry => {
    const date = new Date(entry.timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  });

  // Remove duplicates (multiple entries on same day)
  const uniqueDates = [...new Set(dates)];

  // Track streaks
  let currentStreak = 1;
  let longestStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(sortedEntries.find(e => {
      const date = new Date(e.timestamp);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` === uniqueDates[i];
    }).timestamp);

    const prevDate = new Date(sortedEntries.find(e => {
      const date = new Date(e.timestamp);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` === uniqueDates[i-1];
    }).timestamp);

    const diffTime = Math.abs(currentDate - prevDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

/**
 * Calculate the current mood streak
 * @param {Array} moodEntries - Array of mood entries
 * @returns {number} The streak length in days
 */
function calculateMoodStreak(moodEntries) {
  if (!moodEntries || moodEntries.length === 0) return 0;

  // Sort by timestamp
  const sortedEntries = [...moodEntries].sort((a, b) => b.timestamp - a.timestamp);

  // Get dates (ignoring time)
  const dates = sortedEntries.map(entry => {
    const date = new Date(entry.timestamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  });

  // Remove duplicates (multiple entries on same day)
  const uniqueDates = [...new Set(dates)];

  // Check for consecutive days
  let streak = 1;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  // If no entry for today, streak may have been broken
  if (uniqueDates[0] !== todayStr) {
    const lastEntryDate = new Date(sortedEntries[0].timestamp);
    const diffTime = Math.abs(today - lastEntryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If more than 1 day since last entry, streak is broken
    if (diffDays > 1) return 0;
  }

  // Count consecutive days
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(sortedEntries.find(e => {
      const date = new Date(e.timestamp);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` === uniqueDates[i];
    }).timestamp);

    const prevDate = new Date(sortedEntries.find(e => {
      const date = new Date(e.timestamp);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` === uniqueDates[i-1];
    }).timestamp);

    const diffTime = Math.abs(prevDate - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Check if a user has a specific badge
 * @param {string} userId - The user ID
 * @param {string} badgeId - The badge ID
 * @returns {boolean} True if the user has the badge
 */
function hasBadge(userId, badgeId) {
  const badges = userBadges.get(userId) || [];
  return badges.some(b => b.id === badgeId);
}

/**
 * Award a badge to a user
 * @param {string} userId - The user ID
 * @param {Object} badge - The badge to award
 */
function awardBadge(userId, badge) {
  // Check if user already has the badge
  if (hasBadge(userId, badge.id)) return;

  // Add timestamp to badge
  const badgeWithTimestamp = {
    ...badge,
    timestamp: Date.now()
  };

  // Add badge to user's collection
  if (!userBadges.has(userId)) {
    userBadges.set(userId, []);
  }

  userBadges.get(userId).push(badgeWithTimestamp);

  // Notify user if online
  if (onlineUsers.has(userId)) {
    sendToUser(userId, {
      type: 'badge_awarded',
      badge: badgeWithTimestamp
    });
  }
}

// API Routes with JWT authentication
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Get current user data
app.get('/api/user', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile data (can be used for viewing other users' profiles)
app.get('/api/user/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password', 'email'] },
      include: [
        { 
          model: Mood, 
          as: 'moods',
          limit: 1,
          order: [['createdAt', 'DESC']]
        },
        {
          model: Badge,
          through: UserBadge,
          as: 'badges'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's mood history
app.get('/api/user/moods', authenticateJWT, async (req, res) => {
  try {
    const moods = await Mood.findAll({
      where: { userId: req.user.userId },
      order: [['createdAt', 'DESC']],
      limit: 30
    });

    res.json(moods);
  } catch (error) {
    console.error('Error fetching mood history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's received hugs
app.get('/api/user/hugs/received', authenticateJWT, async (req, res) => {
  try {
    const hugs = await Hug.findAll({
      where: { recipientId: req.user.userId },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'profileImage'] }
      ]
    });

    res.json(hugs);
  } catch (error) {
    console.error('Error fetching received hugs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Authentication Routes

// User Registration
app.post('/api/register', async (req, res) => {
  try {    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [sequelize.Op.or]: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already exists' });
      } else {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      status: 'active',
      profileImage: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return token and user data (excluding password)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
      profileImage: user.profileImage,
    };

    res.status(201).json({ user: userData, token });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({ 
      where: { 
        [sequelize.Op.or]: [
          { username: username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return token and user data (excluding password)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
      profileImage: user.profileImage,
    };

    res.json({ user: userData, token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});



// Logout (client-side only, just for completeness)
app.post('/api/logout', (req, res) => {
  // JWT tokens are stateless, so we don't need to do anything server-side
  // The client should discard the token
  res.status(200).json({ message: 'Logged out successfully' });
});

// All other routes serve the index.html for client-side routing
// Handle all other routes - SPA client-side routing support
app.get('*', (req, res) => {
  // Don't handle API routes with this catch-all
  if (req.url.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  // Send the main index.html file for all other routes
  // This allows React Router to handle the routes client-side
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define database associations
User.hasMany(Mood, { foreignKey: 'userId' });
Mood.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Hug, { foreignKey: 'senderId', as: 'sentHugs' });
User.hasMany(Hug, { foreignKey: 'recipientId', as: 'receivedHugs' });
Hug.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Hug.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

User.hasMany(UserBadge, { foreignKey: 'userId' });
UserBadge.belongsTo(User, { foreignKey: 'userId' });
UserBadge.belongsTo(Badge, { foreignKey: 'badgeId' });
Badge.hasMany(UserBadge, { foreignKey: 'badgeId' });

User.hasMany(GroupHug, { foreignKey: 'creatorId', as: 'createdGroupHugs' });
GroupHug.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

User.hasMany(GroupHugParticipant, { foreignKey: 'userId' });
GroupHugParticipant.belongsTo(User, { foreignKey: 'userId' });
GroupHugParticipant.belongsTo(GroupHug, { foreignKey: 'groupHugId' });
GroupHug.hasMany(GroupHugParticipant, { foreignKey: 'groupHugId' });

User.hasMany(Follow, { foreignKey: 'followerId', as: 'following' });
User.hasMany(Follow, { foreignKey: 'followingId', as: 'followers' });
Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'followedUser' });

User.hasMany(MediaHug, { foreignKey: 'artistId', as: 'createdMedia' });
MediaHug.belongsTo(User, { foreignKey: 'artistId', as: 'artist' });

// Initialize the database and start the server
(async () => {
  try {
    // Test database connection
    const connected = await testConnection();

    if (!connected) {
      console.error('Failed to connect to database. Please check your database configuration.');
      process.exit(1);
    }

    // Sync models with database (set force to true to recreate tables - use with caution!)
    await syncModels(false);

    // Setup GraphQL endpoint
    await setupGraphQL();
    
    // Start the server
    server.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port} (accessible at external port 80)`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
})();