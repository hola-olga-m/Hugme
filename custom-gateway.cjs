/**
 * Simple Custom GraphQL Gateway for HugMeNow (CommonJS version)
 */

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');
const { shield, rule, allow, deny, and, or, not } = require('graphql-shield');
const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const http = require('http');
const https = require('https');

// Configuration
const PORT = process.env.PORT || 5000;
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3002/graphql';
const AUTH_TOKEN = process.env.GRAPHQL_AUTH_TOKEN || '';

console.log(`Starting gateway on port ${PORT}, connecting to API at ${API_ENDPOINT}`);

// Custom directives for the schema
const directiveTypeDefs = gql`
  # Auth directive for authorization checking
  directive @auth(requires: Role = USER) on FIELD_DEFINITION
  
  # Format directive for string formatting
  directive @format(
    date: String, 
    time: String, 
    trim: Boolean, 
    uppercase: Boolean, 
    lowercase: Boolean
  ) on FIELD_DEFINITION
  
  # Log directive for logging resolver calls
  directive @log(level: String = "info") on FIELD_DEFINITION
  
  # Rate limit directive to prevent abuse
  directive @rateLimit(
    max: Int = 5, 
    window: String = "1m", 
    message: String = "Too many requests"
  ) on FIELD_DEFINITION
  
  # Deprecated field directive with reason
  directive @deprecated(reason: String) on FIELD_DEFINITION
  
  # Transform directives for data transformation
  directive @transform(
    from: String,
    to: String
  ) on FIELD_DEFINITION
  
  # Public field access control
  directive @public on FIELD_DEFINITION
  
  # Role enumeration
  enum Role {
    ADMIN
    USER
    GUEST
  }
`;

// Type definitions for virtual fields and client-specific types
const typeDefs = gql`
  ${directiveTypeDefs}
  
  # Base schema types are extended from the underlying API
  type Query {
    # Standard API fields (proxy to backend)
    hello: String @public
    users: [User] @auth(requires: ADMIN) @log(level: "debug")
    currentUser: User @auth @log
    user(id: ID!): User @auth @log
    userByUsername(username: String!): User @auth @log
    moods(userId: ID, limit: Int, offset: Int): [MoodEntry] @auth @log
    moodById(id: ID!): MoodEntry @auth @log
    moodStreak(userId: ID): MoodStreak @auth @log
    publicMoods(limit: Int, offset: Int): [PublicMood] @public @log
    hugs(userId: ID, type: String, limit: Int, offset: Int): [Hug] @auth @log @rateLimit(max: 50)
    hugById(id: ID!): Hug @auth @log
    hugRequests(userId: ID): [HugRequest] @auth @log
    
    # Client-specific fields and aliases
    clientInfo: ClientInfo! @public
    friendsMoods: [PublicMood] @public @log
    userMoods(userId: ID, limit: Int, offset: Int): [MoodEntry] @auth @log
    sentHugs(userId: ID, limit: Int, offset: Int): [Hug] @auth @log
    receivedHugs(userId: ID, limit: Int, offset: Int): [Hug] @auth @log
  }
  
  type Mutation {
    # Proxy to underlying API
    login(email: String!, password: String!): AuthPayload @public @rateLimit(max: 5, window: "5m")
    register(username: String!, email: String!, password: String!): AuthPayload @public @rateLimit(max: 3, window: "1h")
    createMood(input: MoodInput!): MoodEntry @auth @log
    updateMood(id: ID!, input: MoodInput!): MoodEntry @auth @log
    deleteMood(id: ID!): Boolean @auth @log
    sendHug(input: HugInput!): Hug @auth @log @rateLimit(max: 10, window: "1m")
    markHugAsRead(id: ID!): Hug @auth @log
    createHugRequest(input: HugRequestInput!): HugRequest @auth @log
    updateProfile(input: ProfileInput!): User @auth @log
    
    # Client-specific mutations
    sendFriendHug(toUserId: ID!, moodId: ID!, message: String): Hug @auth @log @rateLimit(max: 10, window: "1m")
  }
  
  # Define basic types needed for the resolvers
  type User {
    id: ID!
    username: String! @transform(from: "name", to: "username")
    email: String @auth
    profileImage: String
    bio: String
    createdAt: String @format(date: "YYYY-MM-DD")
  }
  
  type MoodEntry {
    id: ID!
    mood: String!
    intensity: Int!
    note: String
    isPrivate: Boolean
    createdAt: String! @format(date: "YYYY-MM-DD")
    user: User
  }
  
  type PublicMood {
    id: ID!
    mood: String!
    intensity: Int!
    createdAt: String! @format(date: "YYYY-MM-DD")
    user: User
    score: Int
  }
  
  type Hug {
    id: ID!
    message: String
    isRead: Boolean
    createdAt: String! @format(date: "YYYY-MM-DD")
    sender: User
    recipient: User
    mood: MoodEntry
    fromUser: User
    toUser: User
    read: Boolean
  }
  
  type HugRequest {
    id: ID!
    status: String!
    createdAt: String! @format(date: "YYYY-MM-DD")
    fromUser: User
    toUser: User
  }
  
  type MoodStreak {
    userId: ID!
    currentStreak: Int!
    longestStreak: Int!
    lastMoodDate: String @format(date: "YYYY-MM-DD")
  }
  
  type AuthPayload {
    token: String!
    user: User!
  }
  
  input MoodInput {
    mood: String!
    intensity: Int!
    note: String
    isPrivate: Boolean
  }
  
  input HugInput {
    toUserId: ID!
    moodId: ID!
    message: String
  }
  
  input HugRequestInput {
    toUserId: ID!
  }
  
  input ProfileInput {
    username: String
    bio: String
    email: String
    profileImage: String
  }
  
  type ClientInfo {
    version: String!
    buildDate: String!
    platform: String
    deviceInfo: String
    features: [String]
  }
`;

// Define our resolvers
const resolvers = {
  Query: {
    // Proxy standard fields to the backend API
    hello: async () => {
      const result = await executeGraphQL("{ hello }");
      return result.data?.hello;
    },
    
    users: async () => {
      const result = await executeGraphQL("{ users { id username email profileImage } }");
      return result.data?.users || [];
    },
    
    currentUser: async () => {
      const result = await executeGraphQL("{ currentUser { id username email profileImage bio } }");
      return result.data?.currentUser;
    },
    
    user: async (_, args) => {
      const result = await executeGraphQL(`
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            username
            email
            profileImage
            bio
            createdAt
          }
        }
      `, { id: args.id });
      return result.data?.user;
    },
    
    userByUsername: async (_, args) => {
      const result = await executeGraphQL(`
        query GetUserByUsername($username: String!) {
          userByUsername(username: $username) {
            id
            username
            email
            profileImage
            bio
            createdAt
          }
        }
      `, { username: args.username });
      return result.data?.userByUsername;
    },
    
    moods: async (_, args) => {
      const result = await executeGraphQL(`
        query GetMoods($userId: ID, $limit: Int, $offset: Int) {
          moods(userId: $userId, limit: $limit, offset: $offset) {
            id
            mood
            intensity
            note
            isPrivate
            createdAt
            user {
              id
              username
            }
          }
        }
      `, args);
      return result.data?.moods || [];
    },
    
    moodById: async (_, args) => {
      const result = await executeGraphQL(`
        query GetMoodById($id: ID!) {
          moodById(id: $id) {
            id
            mood
            intensity
            note
            isPrivate
            createdAt
            user {
              id
              username
            }
          }
        }
      `, { id: args.id });
      return result.data?.moodById;
    },
    
    moodStreak: async (_, args) => {
      const result = await executeGraphQL(`
        query GetMoodStreak($userId: ID) {
          moodStreak(userId: $userId) {
            userId
            currentStreak
            longestStreak
            lastMoodDate
          }
        }
      `, { userId: args.userId });
      return result.data?.moodStreak;
    },
    
    publicMoods: async (_, args) => {
      const result = await executeGraphQL(`
        query GetPublicMoods($limit: Int, $offset: Int) {
          publicMoods(limit: $limit, offset: $offset) {
            id
            mood
            intensity
            createdAt
            user {
              id
              username
              profileImage
            }
          }
        }
      `, {
        limit: args.limit || 10,
        offset: args.offset || 0
      });
      return result.data?.publicMoods || [];
    },
    
    hugs: async (_, args) => {
      const result = await executeGraphQL(`
        query GetHugs($userId: ID, $type: String, $limit: Int, $offset: Int) {
          hugs(userId: $userId, type: $type, limit: $limit, offset: $offset) {
            id
            message
            isRead
            createdAt
            sender {
              id
              username
              profileImage
            }
            recipient {
              id
              username
              profileImage
            }
            mood {
              id
              mood
              intensity
            }
          }
        }
      `, args);
      return result.data?.hugs || [];
    },
    
    hugById: async (_, args) => {
      const result = await executeGraphQL(`
        query GetHugById($id: ID!) {
          hugById(id: $id) {
            id
            message
            isRead
            createdAt
            sender {
              id
              username
              profileImage
            }
            recipient {
              id
              username
              profileImage
            }
            mood {
              id
              mood
              intensity
            }
          }
        }
      `, { id: args.id });
      return result.data?.hugById;
    },
    
    hugRequests: async (_, args) => {
      const result = await executeGraphQL(`
        query GetHugRequests($userId: ID) {
          hugRequests(userId: $userId) {
            id
            status
            createdAt
            fromUser {
              id
              username
              profileImage
            }
            toUser {
              id
              username
              profileImage
            }
          }
        }
      `, { userId: args.userId });
      return result.data?.hugRequests || [];
    },
    
    // Client-specific resolvers
    clientInfo: () => {
      console.log('[Gateway] Resolving Query.clientInfo');
      
      // Parse features from environment variable if available
      let features = ['mood-tracking', 'friend-moods', 'theme-support', 'streak-tracking'];
      if (process.env.CLIENT_FEATURES) {
        features = process.env.CLIENT_FEATURES.split(',');
      }
      
      return {
        version: process.env.CLIENT_VERSION || '1.0.0',
        buildDate: new Date().toISOString(),
        platform: process.env.CLIENT_PLATFORM || 'web',
        deviceInfo: 'HugMeNow Web Client',
        features: features
      };
    },
    
    friendsMoods: async (_, args) => {
      console.log('[Gateway] Resolving Query.friendsMoods -> publicMoods');
      return resolvers.Query.publicMoods(_, {
        limit: args.limit || 10,
        offset: args.offset || 0
      });
    },
    
    userMoods: async (_, args) => {
      console.log('[Gateway] Resolving Query.userMoods -> moods', args);
      return resolvers.Query.moods(_, args);
    },
    
    sentHugs: async (_, args) => {
      console.log('[Gateway] Resolving Query.sentHugs -> hugs (sent)', args);
      const hugsArgs = {
        userId: args.userId,
        limit: args.limit || 10,
        offset: args.offset || 0,
        type: 'sent'
      };
      return resolvers.Query.hugs(_, hugsArgs);
    },
    
    receivedHugs: async (_, args) => {
      console.log('[Gateway] Resolving Query.receivedHugs -> hugs (received)', args);
      const hugsArgs = {
        userId: args.userId,
        limit: args.limit || 10,
        offset: args.offset || 0,
        type: 'received'
      };
      return resolvers.Query.hugs(_, hugsArgs);
    }
  },
  
  Mutation: {
    // Proxy standard mutations to backend
    login: async (_, args) => {
      const result = await executeGraphQL(`
        mutation Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
            user {
              id
              username
              email
              profileImage
            }
          }
        }
      `, args);
      return result.data?.login;
    },
    
    register: async (_, args) => {
      const result = await executeGraphQL(`
        mutation Register($username: String!, $email: String!, $password: String!) {
          register(username: $username, email: $email, password: $password) {
            token
            user {
              id
              username
              email
              profileImage
            }
          }
        }
      `, args);
      return result.data?.register;
    },
    
    createMood: async (_, args) => {
      const result = await executeGraphQL(`
        mutation CreateMood($input: MoodInput!) {
          createMood(input: $input) {
            id
            mood
            intensity
            note
            isPrivate
            createdAt
            user {
              id
              username
            }
          }
        }
      `, args);
      return result.data?.createMood;
    },
    
    updateMood: async (_, args) => {
      const result = await executeGraphQL(`
        mutation UpdateMood($id: ID!, $input: MoodInput!) {
          updateMood(id: $id, input: $input) {
            id
            mood
            intensity
            note
            isPrivate
            createdAt
            user {
              id
              username
            }
          }
        }
      `, args);
      return result.data?.updateMood;
    },
    
    deleteMood: async (_, args) => {
      const result = await executeGraphQL(`
        mutation DeleteMood($id: ID!) {
          deleteMood(id: $id)
        }
      `, { id: args.id });
      return result.data?.deleteMood;
    },
    
    sendHug: async (_, args) => {
      const result = await executeGraphQL(`
        mutation SendHug($input: HugInput!) {
          sendHug(input: $input) {
            id
            message
            isRead
            createdAt
            sender {
              id
              username
              profileImage
            }
            recipient {
              id
              username
              profileImage
            }
            mood {
              id
              mood
              intensity
            }
          }
        }
      `, args);
      return result.data?.sendHug;
    },
    
    markHugAsRead: async (_, args) => {
      const result = await executeGraphQL(`
        mutation MarkHugAsRead($id: ID!) {
          markHugAsRead(id: $id) {
            id
            isRead
          }
        }
      `, { id: args.id });
      return result.data?.markHugAsRead;
    },
    
    createHugRequest: async (_, args) => {
      const result = await executeGraphQL(`
        mutation CreateHugRequest($input: HugRequestInput!) {
          createHugRequest(input: $input) {
            id
            status
            createdAt
            fromUser {
              id
              username
            }
            toUser {
              id
              username
            }
          }
        }
      `, args);
      return result.data?.createHugRequest;
    },
    
    updateProfile: async (_, args) => {
      const result = await executeGraphQL(`
        mutation UpdateProfile($input: ProfileInput!) {
          updateProfile(input: $input) {
            id
            username
            email
            profileImage
            bio
          }
        }
      `, args);
      return result.data?.updateProfile;
    },
    
    // Client-specific mutations
    sendFriendHug: async (_, args) => {
      console.log('[Gateway] Resolving Mutation.sendFriendHug -> sendHug', args);
      const input = {
        toUserId: args.toUserId,
        moodId: args.moodId,
        message: args.message || ''
      };
      
      return resolvers.Mutation.sendHug(_, { input });
    }
  },
  
  // Virtual field resolvers for mapped fields
  PublicMood: {
    score: (parent) => parent.intensity
  },
  
  Hug: {
    fromUser: (parent) => parent.sender,
    toUser: (parent) => parent.recipient,
    read: (parent) => parent.isRead
  }
};

/**
 * Execute a GraphQL query against the underlying API
 */
async function executeGraphQL(query, variables = {}) {
  return new Promise((resolve, reject) => {
    try {
      // Parse the API endpoint URL to get hostname, port, path
      const url = new URL(API_ENDPOINT);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const data = JSON.stringify({
        query,
        variables
      });
      
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      };
      
      // Add authorization if available
      if (AUTH_TOKEN) {
        options.headers['Authorization'] = AUTH_TOKEN;
      }
      
      const req = client.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(responseData);
            resolve(result);
          } catch (error) {
            console.error('Error parsing JSON response:', error);
            resolve({ errors: [{ message: 'Invalid JSON response' }] });
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('Error executing GraphQL query:', error);
        resolve({ errors: [{ message: error.message }] });
      });
      
      // Write request body
      req.write(data);
      req.end();
    } catch (error) {
      console.error('Error executing GraphQL query:', error);
      resolve({ errors: [{ message: error.message }] });
    }
  });
}

// Implement directive transformers
function authDirectiveTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName, schema) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth');
      
      if (authDirective) {
        const { requires } = authDirective[0] || { requires: 'USER' };
        
        // Save the original resolver
        const originalResolver = fieldConfig.resolve;
        
        // Replace with function that checks auth
        fieldConfig.resolve = async (source, args, context, info) => {
          console.log(`[AuthDirective] Checking authorization for ${typeName}.${info.fieldName}, requires: ${requires}`);
          
          // Get the token from context
          const { token } = context;
          
          // Simple token check (could be improved with actual JWT verification)
          if (!token && requires !== 'GUEST') {
            throw new Error('Not authorized. Authentication required.');
          }
          
          // Check role requirements
          if (requires === 'ADMIN') {
            // Here you would check if the user is an admin
            // For now, we'll just log the requirement
            console.log('[AuthDirective] Admin access required');
          }
          
          // If authorized, run the original resolver
          return originalResolver(source, args, context, info);
        };
      }
      
      return fieldConfig;
    },
  });
}

function logDirectiveTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
      const logDirective = getDirective(schema, fieldConfig, 'log');
      
      if (logDirective) {
        const { level } = logDirective[0] || { level: 'info' };
        const originalResolver = fieldConfig.resolve;
        
        fieldConfig.resolve = async (source, args, context, info) => {
          console.log(`[LogDirective][${level}] Executing ${typeName}.${fieldName}`);
          
          const start = Date.now();
          const result = await originalResolver(source, args, context, info);
          const duration = Date.now() - start;
          
          console.log(`[LogDirective][${level}] Completed ${typeName}.${fieldName} in ${duration}ms`);
          
          return result;
        };
      }
      
      return fieldConfig;
    },
  });
}

function formatDirectiveTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
      const formatDirective = getDirective(schema, fieldConfig, 'format');
      
      if (formatDirective) {
        const { date, time, trim, uppercase, lowercase } = formatDirective[0] || {};
        const originalResolver = fieldConfig.resolve;
        
        fieldConfig.resolve = async (source, args, context, info) => {
          let result = await originalResolver(source, args, context, info);
          
          // Apply transformations based on directive parameters
          if (result) {
            if (date && typeof result === 'string') {
              // Here you could use a date formatting library
              console.log(`[FormatDirective] Formatting date: ${result} with format ${date}`);
              // Simple ISO date formatting for now
              const dateObj = new Date(result);
              result = dateObj.toISOString().split('T')[0];
            }
            
            if (trim && typeof result === 'string') {
              result = result.trim();
            }
            
            if (uppercase && typeof result === 'string') {
              result = result.toUpperCase();
            }
            
            if (lowercase && typeof result === 'string') {
              result = result.toLowerCase();
            }
          }
          
          return result;
        };
      }
      
      return fieldConfig;
    },
  });
}

function rateLimitDirectiveTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
      const rateLimitDirective = getDirective(schema, fieldConfig, 'rateLimit');
      
      if (rateLimitDirective) {
        const { max, window, message } = rateLimitDirective[0] || { max: 5, window: '1m', message: 'Too many requests' };
        const originalResolver = fieldConfig.resolve;
        
        // Create a simple in-memory rate limiter
        const requestCounts = new Map();
        
        fieldConfig.resolve = async (source, args, context, info) => {
          const { token, ip } = context;
          const key = token || ip || 'anonymous';
          
          console.log(`[RateLimitDirective] Checking rate limit for ${key} on ${typeName}.${fieldName}`);
          
          // Get current count and time
          const now = Date.now();
          const requestInfo = requestCounts.get(key) || { count: 0, resetAt: now + parseTimeWindow(window) };
          
          // Reset counter if window expired
          if (now > requestInfo.resetAt) {
            requestInfo.count = 0;
            requestInfo.resetAt = now + parseTimeWindow(window);
          }
          
          // Increment count
          requestInfo.count += 1;
          requestCounts.set(key, requestInfo);
          
          // Check if rate limit exceeded
          if (requestInfo.count > max) {
            console.log(`[RateLimitDirective] Rate limit exceeded for ${key}`);
            throw new Error(message || 'Rate limit exceeded');
          }
          
          return originalResolver(source, args, context, info);
        };
      }
      
      return fieldConfig;
    },
  });
}

// Helper function to parse time window
function parseTimeWindow(window) {
  const value = parseInt(window);
  const unit = window.slice(-1);
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 60 * 1000; // Default 1 minute
  }
}

// Define GraphQL Shield rules
const isAuthenticated = rule()(async (_, __, context) => {
  return !!context.token || 'Not authenticated';
});

const isAdmin = rule()(async (_, __, context) => {
  // Check if token exists and contains admin role
  // For demo purposes, just check if token contains 'admin'
  return context.token && context.token.includes('admin') || 'Not authorized as admin';
});

const hasUserAccess = rule()(async (_, args, context) => {
  // Check if user has access to the requested user data
  // Would typically verify the token contains user ID or admin role
  const requestedUserId = args.userId || args.id;
  return !!context.token || 'Not authorized to access user data';
});

// Create the GraphQL Shield permissions
const permissions = shield({
  Query: {
    hello: allow,
    clientInfo: allow,
    publicMoods: allow,
    friendsMoods: allow,
    users: isAdmin,
    currentUser: isAuthenticated,
    user: and(isAuthenticated, hasUserAccess),
    userByUsername: isAuthenticated,
    moods: and(isAuthenticated, hasUserAccess),
    moodById: and(isAuthenticated, hasUserAccess),
    moodStreak: and(isAuthenticated, hasUserAccess),
    hugs: and(isAuthenticated, hasUserAccess),
    hugById: and(isAuthenticated, hasUserAccess),
    hugRequests: and(isAuthenticated, hasUserAccess),
    sentHugs: and(isAuthenticated, hasUserAccess),
    receivedHugs: and(isAuthenticated, hasUserAccess),
    userMoods: and(isAuthenticated, hasUserAccess)
  },
  Mutation: {
    login: allow,
    register: allow,
    createMood: isAuthenticated,
    updateMood: isAuthenticated,
    deleteMood: isAuthenticated,
    sendHug: isAuthenticated,
    markHugAsRead: isAuthenticated,
    createHugRequest: isAuthenticated,
    updateProfile: isAuthenticated,
    sendFriendHug: isAuthenticated
  },
  // Allow access to all fields of client info type
  ClientInfo: allow
}, {
  allowExternalErrors: true,
  fallbackRule: deny,
  fallbackError: 'Not authorized to access this resource'
});

/**
 * Main function to start the server
 */
async function startServer() {
  try {
    // Create Express app
    const app = express();
    
    // Create a GraphQL schema
    let schema = makeExecutableSchema({ 
      typeDefs,
      resolvers 
    });
    
    // Apply directive transformers
    schema = authDirectiveTransformer(schema);
    schema = logDirectiveTransformer(schema);
    schema = formatDirectiveTransformer(schema);
    schema = rateLimitDirectiveTransformer(schema);
    
    // Apply GraphQL Shield permissions middleware
    schema = applyMiddleware(schema, permissions);
    
    // Create Apollo Server
    const server = new ApolloServer({
      schema,
      introspection: true,
      playground: true,
      context: ({ req }) => {
        // Pass the authorization header if present
        const token = req.headers.authorization || '';
        const ip = req.ip || req.connection.remoteAddress || '';
        return { token, ip };
      }
    });
    
    // Apply middleware
    await server.start();
    server.applyMiddleware({ app, path: '/graphql', cors: { origin: '*' } });
    
    // Proxy endpoint for direct API access
    app.post('/api/graphql', (req, res) => {
      try {
        // Parse the API endpoint URL to get hostname, port, path
        const url = new URL(API_ENDPOINT);
        const isHttps = url.protocol === 'https:';
        const client = isHttps ? https : http;
        
        const data = JSON.stringify(req.body);
        
        const options = {
          hostname: url.hostname,
          port: url.port || (isHttps ? 443 : 80),
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
            'Authorization': req.headers.authorization || ''
          }
        };
        
        const proxyReq = client.request(options, (proxyRes) => {
          let responseData = '';
          
          proxyRes.on('data', (chunk) => {
            responseData += chunk;
          });
          
          proxyRes.on('end', () => {
            try {
              const result = JSON.parse(responseData);
              res.json(result);
            } catch (error) {
              console.error('Error parsing proxy response:', error);
              res.status(500).json({ errors: [{ message: 'Invalid JSON response' }] });
            }
          });
        });
        
        proxyReq.on('error', (error) => {
          console.error('Error proxying to API:', error);
          res.status(500).json({ errors: [{ message: error.message }] });
        });
        
        // Write request body
        proxyReq.write(data);
        proxyReq.end();
      } catch (error) {
        console.error('Error proxying to API:', error);
        res.status(500).json({ errors: [{ message: 'Internal Server Error' }] });
      }
    });
    
    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Custom GraphQL Gateway running at http://0.0.0.0:${PORT}${server.graphqlPath}`);
      console.log(`📝 Proxying API requests to ${API_ENDPOINT}`);
      console.log(`✨ Virtual fields and client compatibility enabled`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();