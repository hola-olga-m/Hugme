/**
 * HugMood GraphQL Main Server
 * 
 * This is the main server entry point that completely replaces the WebSocket-based
 * server with a fully GraphQL-based implementation using GraphQL Yoga.
 * It supports real-time features through GraphQL subscriptions.
 */

const express = require('express');
const { createServer } = require('http');
const path = require('path');
const cors = require('cors');
const { createYoga, createPubSub } = require('graphql-yoga');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const fs = require('fs');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

// Create a PubSub instance for handling real-time events
const pubsub = createPubSub();

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'hugmood-secret-key';

// Create the Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(morgan('dev'));
app.use(compression());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Extract schema from file
let typeDefs;
try {
  typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');
} catch (err) {
  // If schema.graphql doesn't exist, we'll create a basic schema
  typeDefs = `
    scalar JSON
    
    type Query {
      healthCheck: String
      verifyToken(token: String): TokenVerification
      me: User
    }
    
    type Mutation {
      login(email: String!, password: String!): AuthResponse
      register(username: String!, email: String!, password: String!, displayName: String): AuthResponse
      createMood(value: String!, score: Int!, note: String, isPublic: Boolean): Mood
      sendHug(recipientId: ID!, type: String!, message: String): Hug
    }
    
    type Subscription {
      moodUpdated(userId: ID!): Mood
      hugReceived(userId: ID!): Hug
      userStatusChanged(userId: ID!): UserStatus
    }
    
    type TokenVerification {
      isValid: Boolean!
      user: User
    }
    
    type AuthResponse {
      token: String!
      user: User!
    }
    
    type User {
      id: ID!
      username: String!
      email: String!
      displayName: String
      avatarUrl: String
      isOnline: Boolean
      lastActive: String
      createdAt: String!
      updatedAt: String!
    }
    
    type Mood {
      id: ID!
      userId: ID!
      value: String!
      score: Int!
      note: String
      isPublic: Boolean!
      createdAt: String!
      updatedAt: String!
    }
    
    type Hug {
      id: ID!
      senderId: ID!
      recipientId: ID!
      type: String!
      message: String
      createdAt: String!
    }
    
    type UserStatus {
      userId: ID!
      isOnline: Boolean!
      lastActive: String
    }
  `;
  
  // Write the schema to disk for future use
  fs.writeFileSync(path.join(__dirname, 'schema.graphql'), typeDefs);
  console.log('Created default schema.graphql file');
}

// Define resolvers
const resolvers = {
  Query: {
    healthCheck: () => 'OK',
    
    verifyToken: async (_, { token }, context) => {
      if (!token && context.user) {
        return { isValid: true, user: context.user };
      }
      
      if (!token) {
        return { isValid: false, user: null };
      }
      
      try {
        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user by ID (implementation will vary based on your data access layer)
        const user = await getUserById(decoded.userId);
        
        if (!user) {
          return { isValid: false, user: null };
        }
        
        return { isValid: true, user };
      } catch (error) {
        console.error('Token verification error:', error);
        return { isValid: false, user: null };
      }
    },
    
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return context.user;
    }
  },
  
  Mutation: {
    login: async (_, { email, password }) => {
      try {
        // Authenticate user (implementation will vary based on your auth system)
        const user = await authenticateUser(email, password);
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        // Update user's last active time
        await updateUserLastActive(user.id);
        
        // Publish user status change event
        pubsub.publish('USER_STATUS_CHANGED', {
          userStatusChanged: {
            userId: user.id,
            isOnline: true,
            lastActive: new Date().toISOString()
          }
        });
        
        return {
          token,
          user
        };
      } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Authentication failed');
      }
    },
    
    register: async (_, { username, email, password, displayName }) => {
      try {
        // Create new user (implementation will vary)
        const user = await createUser({
          username,
          email,
          password,
          displayName: displayName || username,
          isOnline: true,
          lastActive: new Date()
        });
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        // Publish user status change event
        pubsub.publish('USER_STATUS_CHANGED', {
          userStatusChanged: {
            userId: user.id,
            isOnline: true,
            lastActive: new Date().toISOString()
          }
        });
        
        return {
          token,
          user
        };
      } catch (error) {
        console.error('Registration error:', error);
        throw new Error(error.message || 'Registration failed');
      }
    },
    
    createMood: async (_, { value, score, note, isPublic = false }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Create new mood entry
        const mood = await createMoodEntry({
          userId: context.user.id,
          value,
          score,
          note,
          isPublic
        });
        
        // Publish mood updated event
        pubsub.publish('MOOD_UPDATED', {
          moodUpdated: {
            ...mood,
            userId: context.user.id
          }
        });
        
        return mood;
      } catch (error) {
        console.error('Error creating mood:', error);
        throw new Error('Failed to create mood entry');
      }
    },
    
    sendHug: async (_, { recipientId, type, message }, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Create a new hug
        const hug = await sendHugToUser({
          senderId: context.user.id,
          recipientId,
          type,
          message
        });
        
        // Publish hug received event for recipient
        pubsub.publish('HUG_RECEIVED', {
          hugReceived: {
            ...hug,
            recipientId
          }
        });
        
        return hug;
      } catch (error) {
        console.error('Error sending hug:', error);
        throw new Error('Failed to send hug');
      }
    }
  },
  
  Subscription: {
    moodUpdated: {
      subscribe: (_, { userId }) => ({
        [Symbol.asyncIterator]: () => pubsub.subscribe('MOOD_UPDATED', { 
          filter: (payload) => payload.moodUpdated.userId === userId
        })
      })
    },
    
    hugReceived: {
      subscribe: (_, { userId }) => ({
        [Symbol.asyncIterator]: () => pubsub.subscribe('HUG_RECEIVED', {
          filter: (payload) => payload.hugReceived.recipientId === userId
        })
      })
    },
    
    userStatusChanged: {
      subscribe: () => ({
        [Symbol.asyncIterator]: () => pubsub.subscribe('USER_STATUS_CHANGED')
      })
    }
  }
};

// Import data access functions from graphql-server.js
const { 
  getUserById,
  authenticateUser,
  getUserByEmail,
  getUserByUsername,
  createUser,
  getMoodsByUserId,
  getMoodStreakByUserId,
  createMoodEntry,
  sendHugToUser,
  createHugRequest,
  updateUserLastActive
} = require('./graphql-server');

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Function to extract user from token for context
const getUserFromToken = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user by ID
    return await getUserById(decoded.userId);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Create Yoga instance
const yoga = createYoga({
  schema,
  context: async ({ req }) => {
    // Extract user from token
    const user = await getUserFromToken(req);
    
    return { 
      user,
      pubsub 
    };
  },
  graphiql: {
    // Enable GraphiQL in development
    defaultQuery: `
      query Health {
        healthCheck
      }
    `
  },
  landingPage: false,
  cors: {
    origin: '*',
    credentials: true,
  },
  multipart: true
});

// Apply Yoga middleware to Express
app.use('/graphql', yoga);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create HTTP server
const httpServer = createServer(app);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🚀 GraphQL API available at http://localhost:${PORT}/graphql`);
});

module.exports = { app, httpServer, pubsub };