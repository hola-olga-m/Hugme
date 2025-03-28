/**
 * Apollo Mesh Gateway
 * 
 * This file provides a lightweight Apollo Server that incorporates mesh-like 
 * transformation capabilities without requiring the full GraphQL Mesh library.
 */

import http from 'http';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { PubSub } from 'graphql-subscriptions';
// Use our unified GraphQL version instead of the built-in one
import { GraphQLError, execute, parse, subscribe } from './graphql-resolver.js';
import cors from 'cors';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse body data
const { json } = bodyParser;

// Import configuration
let SERVICE_PORTS, SERVICE_ENDPOINTS;
try {
  // Try to load from gateway-config.js
  const config = await import('./gateway-config.js');
  SERVICE_PORTS = config.SERVICE_PORTS;
  SERVICE_ENDPOINTS = config.SERVICE_ENDPOINTS;
} catch (error) {
  console.warn('Could not load gateway-config.js, using fallback configuration');
  // Fallback configuration
  SERVICE_PORTS = {
    POSTGRAPHILE: 3003,
    APOLLO_MESH: 5003
  };
  SERVICE_ENDPOINTS = {
    POSTGRAPHILE: `http://localhost:${SERVICE_PORTS.POSTGRAPHILE}/postgraphile/graphql`
  };
}

// Read env variables with defaults from config
const PORT = parseInt(process.env.PORT || SERVICE_PORTS.APOLLO_MESH);
const TARGET_API = process.env.TARGET_API || SERVICE_ENDPOINTS.POSTGRAPHILE;
const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';
const CLIENT_PLATFORM = process.env.CLIENT_PLATFORM || 'web';
const CLIENT_FEATURES = (process.env.CLIENT_FEATURES || 'mood-tracking,friend-moods').split(',');

console.log(`🌐 Starting Apollo Mesh Gateway...`);
console.log(`Port: ${PORT}`);
console.log(`Targeting API: ${TARGET_API}`);
console.log(`Client Version: ${CLIENT_VERSION}`);
console.log(`Client Platform: ${CLIENT_PLATFORM}`);
console.log(`Client Features: ${CLIENT_FEATURES.join(', ')}`);

// ===== GraphQL Schema =====
// Extended schema with mesh-like capabilities
const typeDefs = `#graphql
  # Client-specific types
  type ClientInfo {
    version: String!
    buildDate: String!
    platform: String!
    deviceInfo: String
    features: [String]
  }

  # Basic type definitions
  type User {
    id: ID!
    name: String
    email: String
    avatar: String
    streak: Int
  }

  type MoodEntry {
    id: ID!
    intensity: Int!
    emoji: String
    message: String
    createdAt: String
    userId: ID!
    user: User
    score: Int
  }

  type PublicMood {
    id: ID!
    intensity: Int!
    emoji: String
    message: String
    createdAt: String
    userId: ID!
    user: User
    score: Int
  }

  type Hug {
    id: ID!
    message: String
    sentAt: String
    senderId: ID!
    recipientId: ID!
    moodId: ID
    sender: User
    recipient: User
    mood: MoodEntry
    isRead: Boolean
    fromUser: User
    toUser: User
    read: Boolean
  }

  type UserStreak {
    userId: ID!
    currentStreak: Int!
    longestStreak: Int!
    lastMoodDate: String
    user: User
  }

  # Root Query type definition
  type Query {
    # Client information field - provides version info
    clientInfo: ClientInfo!
    
    # Virtual fields that map to existing schema fields with different parameters
    friendsMoods(limit: Int, offset: Int): [PublicMood]
    userMoods(userId: ID, limit: Int, offset: Int): [MoodEntry]
    sentHugs(userId: ID, limit: Int, offset: Int): [Hug]
    receivedHugs(userId: ID, limit: Int, offset: Int): [Hug]
    
    # Direct fields that pass through to the API
    user(id: ID!): User
    mood(id: ID!): MoodEntry
    publicMoods(limit: Int, offset: Int): [PublicMood]
    moods(userId: ID!, limit: Int, offset: Int): [MoodEntry]
    hugs(userId: ID!, type: String, limit: Int, offset: Int): [Hug]
    moodStreak(userId: ID!): UserStreak
  }

  # Input types for mutations
  input CreateMoodInput {
    intensity: Int!
    emoji: String
    message: String
    userId: ID!
  }

  input SendHugInput {
    message: String
    senderId: ID!
    recipientId: ID!
    moodId: ID
  }

  # Mutation definitions
  type Mutation {
    createMood(input: CreateMoodInput!): MoodEntry
    sendHug(input: SendHugInput!): Hug
  }
  
  # Subscription definitions for real-time updates
  type Subscription {
    # Triggered when a new mood is created
    newMood: MoodEntry
    
    # Triggered when a new hug is sent
    newHug: Hug
    
    # Triggered when a new hug is sent to a specific user
    newHugReceived(userId: ID!): Hug
    
    # Triggered when a new mood is created by a user's friend
    newFriendMood(userId: ID!): PublicMood
  }
`;

// Create a PubSub instance for handling subscription events
const pubsub = new PubSub();

// Log the PubSub instance to confirm its capabilities
console.log('PubSub instance created with methods:', Object.keys(pubsub));
console.log('PubSub asyncIterator exists:', typeof pubsub.asyncIterator === 'function');

// Define event topics for subscriptions
const EVENTS = {
  NEW_MOOD: 'NEW_MOOD',
  NEW_HUG: 'NEW_HUG',
  NEW_HUG_RECEIVED: 'NEW_HUG_RECEIVED',
  NEW_FRIEND_MOOD: 'NEW_FRIEND_MOOD'
};

// ===== Custom Resolvers =====
const resolvers = {
  Query: {
    // Client information resolver
    clientInfo: () => {
      console.log('[Gateway] Resolving Query.clientInfo');
      return {
        version: CLIENT_VERSION,
        buildDate: new Date().toISOString(),
        platform: CLIENT_PLATFORM,
        deviceInfo: `HugMeNow ${CLIENT_PLATFORM} Client`,
        features: CLIENT_FEATURES
      };
    },
    
    // Virtual field resolvers with proxying to the API
    friendsMoods: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.friendsMoods');
      // Maps friendsMoods to allMoods from PostGraphile
      return executeGraphQL(`
        query GetFriendsMoods($limit: Int, $offset: Int) {
          allMoods(
            first: $limit
            offset: $offset
          ) {
            nodes {
              id
              score
              note
              isPublic
              createdAt
              userId
              userByUserId {
                id
                username
                name
                avatarUrl
              }
            }
          }
        }
      `,
        { limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      ).then(data => {
        // Transform the response from allMoods.nodes to match our PublicMood type
        const moods = data?.allMoods?.nodes || [];
        return moods.map(mood => ({
          id: mood.id,
          intensity: mood.score, // Map score to intensity
          emoji: "😊", // Default emoji since we don't have mood field
          message: mood.note || "",
          createdAt: mood.createdAt,
          userId: mood.userId,
          user: {
            id: mood.userByUserId?.id,
            name: mood.userByUserId?.username,
            avatar: mood.userByUserId?.avatarUrl || ""
          }
        }));
      });
    },
    
    userMoods: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.userMoods');
      // Maps userMoods to moods
      return executeGraphQL(
        'query GetUserMoods($userId: ID!, $limit: Int, $offset: Int) { moods(userId: $userId, limit: $limit, offset: $offset) { id intensity emoji message createdAt userId user { id name avatar } } }',
        { userId: args.userId, limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      );
    },

    sentHugs: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.sentHugs');
      // Maps sentHugs to hugs with type='sent'
      return executeGraphQL(
        'query GetSentHugs($userId: ID!, $limit: Int, $offset: Int) { hugs(userId: $userId, type: "sent", limit: $limit, offset: $offset) { id message sentAt senderId recipientId moodId isRead sender { id name avatar } recipient { id name avatar } } }',
        { userId: args.userId, limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      );
    },

    receivedHugs: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.receivedHugs');
      // Maps receivedHugs to hugs with type='received'
      return executeGraphQL(
        'query GetReceivedHugs($userId: ID!, $limit: Int, $offset: Int) { hugs(userId: $userId, type: "received", limit: $limit, offset: $offset) { id message sentAt senderId recipientId moodId isRead sender { id name avatar } recipient { id name avatar } } }',
        { userId: args.userId, limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      );
    },
    
    // Direct pass-through resolvers
    user: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.user');
      return executeGraphQL(
        'query GetUser($id: ID!) { user(id: $id) { id name email avatar streak } }',
        { id: args.id },
        context.headers?.authorization
      ).then(data => data?.user);
    },

    mood: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.mood');
      return executeGraphQL(
        'query GetMood($id: ID!) { mood(id: $id) { id intensity emoji message createdAt userId user { id name avatar } } }',
        { id: args.id },
        context.headers?.authorization
      ).then(data => data?.mood);
    },

    publicMoods: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.publicMoods');
      return executeGraphQL(`
        query GetPublicMoods($limit: Int, $offset: Int) {
          allMoods(
            first: $limit
            offset: $offset
          ) {
            nodes {
              id
              score
              note
              isPublic
              createdAt
              userId
              userByUserId {
                id
                username
                name
                avatarUrl
              }
            }
          }
        }
      `,
        { limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      ).then(data => {
        // Transform the response from allMoods.nodes to match our PublicMood type
        const moods = data?.allMoods?.nodes || [];
        return moods.map(mood => ({
          id: mood.id,
          intensity: mood.score, // Map score to intensity
          emoji: "😊", // Default emoji since we don't have mood field
          message: mood.note || "",
          createdAt: mood.createdAt,
          userId: mood.userId,
          user: {
            id: mood.userByUserId?.id,
            name: mood.userByUserId?.username,
            avatar: mood.userByUserId?.avatarUrl || ""
          }
        }));
      });
    },

    moods: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.moods');
      return executeGraphQL(
        'query GetMoods($userId: ID!, $limit: Int, $offset: Int) { moods(userId: $userId, limit: $limit, offset: $offset) { id intensity emoji message createdAt userId user { id name avatar } } }',
        { userId: args.userId, limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      ).then(data => data?.moods);
    },

    hugs: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.hugs');
      return executeGraphQL(
        'query GetHugs($userId: ID!, $type: String, $limit: Int, $offset: Int) { hugs(userId: $userId, type: $type, limit: $limit, offset: $offset) { id message sentAt senderId recipientId moodId isRead sender { id name avatar } recipient { id name avatar } } }',
        { userId: args.userId, type: args.type, limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      ).then(data => data?.hugs);
    },

    moodStreak: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.moodStreak');
      return executeGraphQL(
        'query GetMoodStreak($userId: ID!) { moodStreak(userId: $userId) { userId currentStreak longestStreak lastMoodDate user { id name avatar } } }',
        { userId: args.userId },
        context.headers?.authorization
      ).then(data => data?.moodStreak);
    }
  },
  
  // Mutation resolvers
  Mutation: {
    createMood: async (_, args, context) => {
      console.log('[Gateway] Resolving Mutation.createMood');
      
      const isDevelopment = process.env.NODE_ENV !== 'production';
      // Only enforce auth in production
      if (!isDevelopment && !context.headers?.authorization) {
        throw new Error("Authentication required to create moods");
      }
      
      // Use a default token for testing if in development and no auth provided
      const authToken = isDevelopment && !context.headers?.authorization 
        ? 'Bearer test-token-for-development-only'
        : context.headers?.authorization;
      
      try {
        // Make a direct REST POST request to the PostGraphile API without using GraphQL libraries
        // This avoids GraphQL version conflicts by not using any GraphQL types
        const moodInput = {
          score: args.input.intensity || args.input.score || 5,
          note: args.input.message || "",
          isPublic: args.input.isPublic === undefined ? true : args.input.isPublic,
          userId: args.input.userId || "1"
        };
        
        const mutationInput = { 
          clientMutationId: "direct-" + Date.now(),
          mood: moodInput
        };
        
        const queryString = `
          mutation CreateMood($input: CreateMoodInput!) {
            createMood(input: $input) {
              mood {
                id
                score
                note
                isPublic
                createdAt
                userId
                userByUserId {
                  id
                  username
                }
              }
            }
          }
        `;
        
        console.log('[Gateway] Sending direct REST request to create mood');
        
        // Make a direct POST request to avoid GraphQL library version conflicts
        const response = await fetch(TARGET_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { 'Authorization': authToken } : {})
          },
          body: JSON.stringify({ 
            query: queryString,
            variables: { input: mutationInput }
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.errors) {
          console.error('[Gateway] GraphQL errors:', JSON.stringify(result.errors, null, 2));
          throw new Error('Failed to create mood: ' + result.errors[0].message);
        }
        
        if (!result?.data?.createMood?.mood) {
          throw new Error('Failed to create mood: No data returned');
        }
        
        const mood = result.data.createMood.mood;
        
        // Transform the response to match client expectations
        const transformedMood = {
          id: mood.id,
          intensity: mood.score,
          emoji: "😊", // Default emoji since not stored in DB
          message: mood.note || "",
          createdAt: mood.createdAt,
          userId: mood.userId,
          isPublic: mood.isPublic,
          score: mood.score // For backward compatibility
        };
        
        console.log('[Gateway] Successfully created mood in database:', transformedMood.id);
        
        // Publish the new mood event for subscriptions
        console.log('[Gateway] Publishing NEW_MOOD event:', transformedMood.id);
        pubsub.publish(EVENTS.NEW_MOOD, { newMood: transformedMood });
        
        // If the mood is public, also publish it as a friend mood event
        if (mood.isPublic) {
          console.log('[Gateway] Publishing NEW_FRIEND_MOOD event for user:', transformedMood.userId);
          pubsub.publish(`${EVENTS.NEW_FRIEND_MOOD}.${transformedMood.userId}`, { 
            newFriendMood: transformedMood
          });
        }
        
        return transformedMood;
      } catch (error) {
        console.error('[Gateway] Error in createMood resolver:', error);
        throw error;
      }
    },
    
    sendHug: async (_, args, context) => {
      console.log('[Gateway] Resolving Mutation.sendHug');
      
      const isDevelopment = process.env.NODE_ENV !== 'production';
      // Only enforce auth in production
      if (!isDevelopment && !context.headers?.authorization) {
        throw new Error("Authentication required to send hugs");
      }
      
      // Use a default token for testing if in development and no auth provided
      const authToken = isDevelopment && !context.headers?.authorization 
        ? 'Bearer test-token-for-development-only'
        : context.headers?.authorization;
      
      try {
        // Make a direct REST POST request to the PostGraphile API without using GraphQL libraries
        // This avoids GraphQL version conflicts by not using any GraphQL types
        const hugInput = {
          type: "SUPPORTIVE", // Default type
          message: args.input.message || "",
          senderId: args.input.senderId,
          recipientId: args.input.recipientId,
          isRead: false // Default as unread
        };
        
        const mutationInput = {
          clientMutationId: "direct-" + Date.now(),
          hug: hugInput
        };
        
        const queryString = `
          mutation CreateHug($input: CreateHugInput!) {
            createHug(input: $input) {
              hug {
                id
                message
                type
                senderId
                recipientId
                isRead
                createdAt
                userBySenderId {
                  id
                  username
                }
                userByRecipientId {
                  id
                  username
                }
              }
            }
          }
        `;
        
        console.log('[Gateway] Sending direct REST request to create hug');
        
        // Make a direct POST request to avoid GraphQL library version conflicts
        const response = await fetch(TARGET_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { 'Authorization': authToken } : {})
          },
          body: JSON.stringify({
            query: queryString,
            variables: { input: mutationInput }
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.errors) {
          console.error('[Gateway] GraphQL errors:', JSON.stringify(result.errors, null, 2));
          throw new Error('Failed to create hug: ' + result.errors[0].message);
        }
        
        if (!result?.data?.createHug?.hug) {
          throw new Error('Failed to create hug: No data returned');
        }
        
        const hug = result.data.createHug.hug;
        
        // Transform the response to match client expectations
        const transformedHug = {
          id: hug.id,
          message: hug.message || "",
          sentAt: hug.createdAt,
          senderId: hug.senderId,
          recipientId: hug.recipientId,
          isRead: hug.isRead,
          moodId: args.input.moodId, // Keep the original moodId from the input
          type: hug.type
        };
        
        console.log('[Gateway] Successfully created hug in database:', transformedHug.id);
        
        // Publish the new hug event for subscriptions
        console.log('[Gateway] Publishing NEW_HUG event:', transformedHug.id);
        pubsub.publish(EVENTS.NEW_HUG, { newHug: transformedHug });
        
        // Publish specific event for the recipient
        console.log('[Gateway] Publishing NEW_HUG_RECEIVED event for user:', transformedHug.recipientId);
        pubsub.publish(`${EVENTS.NEW_HUG_RECEIVED}.${transformedHug.recipientId}`, { 
          newHugReceived: transformedHug
        });
        
        return transformedHug;
      } catch (error) {
        console.error('[Gateway] Error in sendHug resolver:', error);
        throw error;
      }
    }
  },
  
  // Subscription resolvers
  Subscription: {
    newMood: {
      subscribe: () => {
        console.log('[Gateway] Setting up newMood subscription');
        return pubsub.asyncIterator(EVENTS.NEW_MOOD);
      }
    },
    
    newHug: {
      subscribe: () => {
        console.log('[Gateway] Setting up newHug subscription');
        return pubsub.asyncIterator(EVENTS.NEW_HUG);
      }
    },
    
    newHugReceived: {
      subscribe: (_, { userId }) => {
        console.log('[Gateway] Setting up newHugReceived subscription for userId:', userId);
        return pubsub.asyncIterator(`${EVENTS.NEW_HUG_RECEIVED}.${userId}`);
      }
    },
    
    newFriendMood: {
      subscribe: (_, { userId }) => {
        console.log('[Gateway] Setting up newFriendMood subscription for userId:', userId);
        return pubsub.asyncIterator(`${EVENTS.NEW_FRIEND_MOOD}.${userId}`);
      },
      resolve: (payload, { userId }) => {
        // In a real app, we would check if the mood creator is a friend of the subscriber
        // For now, we'll pass through all public moods
        return payload.newFriendMood;
      }
    }
  },
  
  // Virtual field resolvers for entity types
  PublicMood: {
    score: parent => parent.intensity
  },
  
  MoodEntry: {
    score: parent => parent.intensity
  },
  
  Hug: {
    fromUser: parent => parent.sender,
    toUser: parent => parent.recipient,
    read: parent => parent.isRead
  }
};

// Helper function to execute GraphQL requests against the API
/**
 * Execute a GraphQL query against the PostGraphile API
 * This function is similar to how GraphQL Mesh executes remote queries
 */
async function executeGraphQL(query, variables = {}, token = null) {
  try {
    console.log(`[Gateway] Executing GraphQL query to ${TARGET_API}`);
    console.log('[Gateway] Variables:', JSON.stringify(variables, null, 2));
    
    const response = await fetch(TARGET_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': token } : {})
      },
      body: JSON.stringify({ query, variables })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('[Gateway] GraphQL errors:', JSON.stringify(result.errors, null, 2));
    }
    
    return result; // Return the full result object including data and errors
  } catch (error) {
    console.error('[Gateway] Error executing GraphQL:', error);
    throw error; // Rethrow to allow caller to handle the error
  }
}

async function startServer() {
  // Create Express app
  const app = express();
  
  // Create HTTP server
  const httpServer = http.createServer(app);
  
  // Create WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  
  // Create executable schema from type definitions and resolvers
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  
  // Set up WebSocket server for subscriptions
  console.log('🔌 Setting up WebSocket server for GraphQL subscriptions');
  
  const serverCleanup = useServer(
    { 
      schema,
      // This function is called when a client connects
      onConnect: async (ctx) => {
        console.log('👋 Client connected to WebSocket', ctx.connectionParams);
        return true; // Allow connection
      },
      // This function is called when a client disconnects
      onDisconnect: (ctx) => {
        console.log('👋 Client disconnected from WebSocket');
      },
      // This function builds the context for subscriptions
      context: async (ctx) => {
        // Extract the token from connection params if present
        const token = ctx.connectionParams?.authorization || '';
        console.log(`🔑 Building context for subscription with token: ${token ? 'Present' : 'Not present'}`);
        return { 
          headers: { authorization: token },
          auth: {
            token,
            isAuthenticated: !!token
          }
        };
      }
    }, 
    wsServer
  );
  
  // Create Apollo Server with plugins for HTTP server draining
  const server = new ApolloServer({
    schema,
    introspection: true,
    plugins: [
      // Proper shutdown for HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),
      
      // Proper shutdown for WebSocket server
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
  
  // Start Apollo Server
  await server.start();
  
  // Set up middleware for HTTP server
  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ 
        headers: req.headers,
        auth: {
          token: req.headers.authorization || '',
          isAuthenticated: !!req.headers.authorization
        }
      })
    })
  );
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });
  
  // Start server
  await new Promise((resolve) => httpServer.listen({ port: PORT, host: '0.0.0.0' }, resolve));
  
  console.log(`🚀 Apollo Mesh Gateway ready at http://0.0.0.0:${PORT}/graphql`);
  console.log(`🔌 WebSocket subscriptions available at ws://0.0.0.0:${PORT}/graphql`);
  
  // Add explicit console log for port binding to help with workflow detection
  console.log(`NOTICE: Server is listening on port ${PORT}`);
}

// Start the server
startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});