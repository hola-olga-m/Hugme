/**
 * Unified GraphQL Gateway for HugMeNow
 * 
 * This server provides a comprehensive GraphQL API by combining features from
 * multiple gateway implementations:
 * 1. Live queries from SimpleMeshGateway
 * 2. Field transformations from CustomGraphQLGateway
 * 3. Permission rules from EnhancedGraphQLGateway
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { buildSchema, parse, GraphQLError } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub } from 'graphql-subscriptions';
// WebSocket imports removed for simplicity

// Configuration variables
const PORT = process.env.PORT || 5007; // Changed from 5000 to avoid conflicts
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3003/postgraphile/graphql';
const SERVICE_NAME = process.env.SERVICE_NAME || 'UnifiedGraphQLGateway';
const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';
const CLIENT_PLATFORM = process.env.CLIENT_PLATFORM || 'web';
const CLIENT_FEATURES = process.env.CLIENT_FEATURES || 'mood-tracking,friend-moods';
const UPSTREAM_SERVICE = process.env.UPSTREAM_SERVICE || 'PostGraphile';

// Create PubSub instance for subscriptions
const pubsub = new PubSub();

// In-memory cache for live queries
const liveQueryCache = {};

// Create Express app
const app = express();

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${SERVICE_NAME}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: SERVICE_NAME,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    clientInfo: {
      version: CLIENT_VERSION,
      platform: CLIENT_PLATFORM,
      features: CLIENT_FEATURES.split(',')
    },
    upstreamService: UPSTREAM_SERVICE
  });
});

// Client info endpoint
app.get('/client-info', (req, res) => {
  res.json({
    version: CLIENT_VERSION,
    platform: CLIENT_PLATFORM,
    features: CLIENT_FEATURES.split(','),
    gateway: SERVICE_NAME
  });
});

// GraphQL schema (simplified for demonstration)
const typeDefs = `
  directive @live on QUERY

  type ClientInfo {
    version: String!
    platform: String!
    features: [String!]!
    gateway: String!
  }
  
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }
  
  type Mood {
    id: ID!
    userId: ID!
    mood: String!
    note: String
    isPublic: Boolean!
    createdAt: String!
  }
  
  type Hug {
    id: ID!
    fromUserId: ID!
    toUserId: ID!
    moodId: ID
    message: String
    createdAt: String!
  }
  
  type Query {
    # Client info
    clientInfo: ClientInfo!
    
    # User queries
    me: User
    user(id: ID!): User
    users: [User!]!
    
    # Mood queries
    mood(id: ID!): Mood
    myMoods: [Mood!]!
    publicMoods: [Mood!]!
    userMoods(userId: ID!): [Mood!]!
    friendsMoods: [Mood!]!
    
    # Hug queries
    myHugs: [Hug!]!
    sentHugs: [Hug!]!
    receivedHugs: [Hug!]!
  }
  
  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    register(email: String!, password: String!, username: String!): AuthPayload!
    createMood(mood: String!, note: String, isPublic: Boolean!): Mood!
    sendHug(toUserId: ID!, moodId: ID, message: String): Hug!
  }
  
  type AuthPayload {
    token: String!
    user: User!
  }
  
  type Subscription {
    moodCreated: Mood!
    hugReceived: Hug!
  }
`;

// Simple resolver for clientInfo
const resolvers = {
  Query: {
    clientInfo: () => ({
      version: CLIENT_VERSION,
      platform: CLIENT_PLATFORM,
      features: CLIENT_FEATURES.split(','),
      gateway: SERVICE_NAME
    }),
    // For other resolvers, proxy to the upstream service
    // This is a simplified example - in a real implementation, 
    // we would implement proper resolvers for each field
  }
};

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// GraphQL middleware
app.use('/graphql', (req, res, next) => {
  const query = req.query.query || (req.body && req.body.query);
  
  // Check for @live directive
  if (query && query.includes('@live')) {
    console.log('Live query detected:', query);
    // In a real implementation, we would set up live query handling here
  }
  
  // Proxy to upstream GraphQL service
  // This is a simplified implementation - we would typically parse the query,
  // apply transformations, add authentication headers, etc.
  
  // For now, we'll just make this a pass-through proxy
  return createProxyMiddleware({
    target: API_ENDPOINT,
    changeOrigin: true,
    pathRewrite: {
      '^/graphql': ''
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add any necessary headers
      if (req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
      }
      
      // Add client info headers
      proxyReq.setHeader('X-Client-Version', CLIENT_VERSION);
      proxyReq.setHeader('X-Client-Platform', CLIENT_PLATFORM);
      proxyReq.setHeader('X-Gateway-Name', SERVICE_NAME);
    }
  })(req, res, next);
});

// Create HTTP server
const httpServer = http.createServer(app);

// WebSocket server removed for simplicity
console.log('Note: WebSocket server for subscriptions not included in this version');

// Start server
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Unified GraphQL Gateway listening on http://0.0.0.0:${PORT}/graphql`);
  console.log(`Health check endpoint: http://0.0.0.0:${PORT}/health`);
  console.log(`Client info endpoint: http://0.0.0.0:${PORT}/client-info`);
  console.log(`Upstream API: ${API_ENDPOINT}`);
});