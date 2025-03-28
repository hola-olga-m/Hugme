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
import { createProxyMiddleware } from 'http-proxy-middleware';
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
    POSTGRAPHILE: `http://localhost:${SERVICE_PORTS.POSTGRAPHILE}/graphql`
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
`;

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
      // Maps friendsMoods to publicMoods
      return executeGraphQL(
        'query GetPublicMoods($limit: Int, $offset: Int) { publicMoods(limit: $limit, offset: $offset) { id intensity emoji message createdAt userId user { id name avatar } } }',
        { limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      );
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
      return executeGraphQL(
        'query GetPublicMoods($limit: Int, $offset: Int) { publicMoods(limit: $limit, offset: $offset) { id intensity emoji message createdAt userId user { id name avatar } } }',
        { limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      ).then(data => data?.publicMoods);
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
      return executeGraphQL(
        'mutation CreateMood($input: CreateMoodInput!) { createMood(input: $input) { id intensity emoji message createdAt userId } }',
        { input: args.input },
        context.headers?.authorization
      ).then(data => data?.createMood);
    },
    
    sendHug: async (_, args, context) => {
      console.log('[Gateway] Resolving Mutation.sendHug');
      return executeGraphQL(
        'mutation SendHug($input: SendHugInput!) { sendHug(input: $input) { id message sentAt senderId recipientId moodId isRead } }',
        { input: args.input },
        context.headers?.authorization
      ).then(data => data?.sendHug);
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
async function executeGraphQL(query, variables = {}, token = null) {
  try {
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
      console.error('[Gateway] GraphQL errors:', result.errors);
      throw new Error(result.errors[0].message);
    }
    
    return result.data;
  } catch (error) {
    console.error('[Gateway] Error executing GraphQL:', error);
    return null;
  }
}

async function startServer() {
  // Create Express app
  const app = express();
  
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });
  
  // Start Apollo Server
  await server.start();
  
  // Set up middleware
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
  const httpServer = http.createServer(app);
  await new Promise((resolve) => httpServer.listen({ port: PORT, host: '0.0.0.0' }, resolve));
  
  console.log(`🚀 Apollo Mesh Gateway ready at http://0.0.0.0:${PORT}/graphql`);
  
  // Add explicit console log for port binding to help with workflow detection
  console.log(`NOTICE: Server is listening on port ${PORT}`);
}

// Start the server
startServer().catch((error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});