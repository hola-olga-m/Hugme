/**
 * GraphQL Server
 * 
 * This file sets up the GraphQL server using Apollo Server and Express.
 * It provides a unified GraphQL API for clients to interact with HugMood services.
 */

const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const path = require('path');
const fs = require('fs');

// Import utilities and services
const { getTokenForUser } = require('./server-utils');

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'hugmood-secret-key';

// Read the schema from a file
const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8'
);

// Define resolvers
const resolvers = {
  Query: {
    verifyToken: async (_, __, context) => {
      if (!context.user) {
        return { isValid: false, user: null };
      }
      return {
        isValid: true,
        user: context.user
      };
    },
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return context.user;
    },
    userProfile: async (_, { userId }, context) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      // Fetch user data
      const user = await getUserById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      // Fetch related data
      const moods = await getMoodsByUserId(userId);
      const moodStreak = await getMoodStreakByUserId(userId);
      
      return {
        user,
        moods,
        moodStreak
      };
    },
    // Add more query resolvers as needed
  },
  Mutation: {
    login: async (_, { input }) => {
      const { email, password } = input;
      
      // Authenticate user (replace with actual auth logic)
      const user = await authenticateUser(email, password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Generate JWT token
      const token = getTokenForUser(user.id);
      
      return {
        token,
        user
      };
    },
    register: async (_, { input }) => {
      const { username, email, password, displayName } = input;
      
      // Check if user already exists
      const existingUser = await getUserByEmail(email) || await getUserByUsername(username);
      
      if (existingUser) {
        throw new Error('User already exists with this email or username');
      }
      
      // Create new user (replace with actual registration logic)
      const user = await createUser({
        username,
        email,
        password,
        displayName: displayName || username
      });
      
      // Generate JWT token
      const token = getTokenForUser(user.id);
      
      return {
        token,
        user
      };
    },
    createMood: async (_, { input }, context) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      const { value, score, note, isPublic } = input;
      
      // Create mood entry (replace with actual mood creation logic)
      const mood = await createMoodEntry({
        userId: context.user.id,
        value,
        score,
        note,
        isPublic: isPublic || false,
        createdAt: new Date()
      });
      
      return mood;
    },
    sendHug: async (_, { input }, context) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      const { type, message, recipientId } = input;
      
      // Send hug (replace with actual hug sending logic)
      const hug = await sendHugToUser({
        senderId: context.user.id,
        recipientId,
        type,
        message,
        createdAt: new Date()
      });
      
      return hug;
    },
    requestHug: async (_, { input }, context) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      const { message, mood, isPublic } = input;
      
      // Create hug request (replace with actual request creation logic)
      const request = await createHugRequest({
        userId: context.user.id,
        message,
        mood,
        isPublic: isPublic || false,
        createdAt: new Date()
      });
      
      return request;
    },
    // Add more mutation resolvers as needed
  },
  // Add more type resolvers as needed
};

// Placeholder functions (replace with actual implementations)
async function getUserById(userId) {
  // This would normally fetch from database
  return {
    id: userId,
    username: `user${userId}`,
    email: `user${userId}@example.com`,
    displayName: `User ${userId}`
  };
}

async function authenticateUser(email, password) {
  // This would normally verify credentials in database
  return {
    id: '123',
    username: 'testuser',
    email: email,
    displayName: 'Test User'
  };
}

async function getUserByEmail(email) {
  // Check if user exists with this email
  return null; // Placeholder
}

async function getUserByUsername(username) {
  // Check if user exists with this username
  return null; // Placeholder
}

async function createUser(userData) {
  // Create new user in database
  return {
    id: '456',
    username: userData.username,
    email: userData.email,
    displayName: userData.displayName
  };
}

async function getMoodsByUserId(userId) {
  // Get mood entries for user
  return []; // Placeholder
}

async function getMoodStreakByUserId(userId) {
  // Get mood streak data for user
  return {
    currentStreak: 5,
    longestStreak: 10
  };
}

async function createMoodEntry(moodData) {
  // Create mood entry in database
  return {
    id: 'mood123',
    value: moodData.value,
    score: moodData.score,
    note: moodData.note,
    isPublic: moodData.isPublic,
    createdAt: moodData.createdAt.toISOString()
  };
}

async function sendHugToUser(hugData) {
  // Send hug and record in database
  return {
    id: 'hug123',
    type: hugData.type,
    message: hugData.message,
    senderId: hugData.senderId,
    recipientId: hugData.recipientId,
    createdAt: hugData.createdAt.toISOString()
  };
}

async function createHugRequest(requestData) {
  // Create hug request in database
  return {
    id: 'request123',
    message: requestData.message,
    mood: requestData.mood,
    isPublic: requestData.isPublic,
    userId: requestData.userId,
    createdAt: requestData.createdAt.toISOString()
  };
}

// Create the schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Context function to extract user from request
const getContext = ({ req }) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Get user by ID
      const user = getUserById(decoded.userId);
      
      return { user };
    } catch (error) {
      console.error('Token verification error:', error);
    }
  }
  
  return { user: null };
};

// Function to start the server
async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  
  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  
  // WebSocket server setup
  const serverCleanup = useServer({ schema }, wsServer);
  
  // Creating the Apollo server
  const server = new ApolloServer({
    schema,
    context: getContext,
    plugins: [
      // Proper shutdown
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper cleanup for WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  
  // Starting the Apollo server
  await server.start();
  
  // Apply middleware
  server.applyMiddleware({ app });
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  
  console.log(`🚀 GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`);
  
  return { server, app, httpServer };
}

module.exports = { startApolloServer };