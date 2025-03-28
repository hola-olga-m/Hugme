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

  # Authentication types
  type AuthPayload {
    token: String!
    user: User!
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
    me: User
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

  # Register input type
  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  # Mutation definitions
  type Mutation {
    createMood(input: CreateMoodInput!): MoodEntry
    sendHug(input: SendHugInput!): Hug
    login(email: String!, password: String!): AuthPayload
    register(input: RegisterInput!): AuthPayload
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
        // Filter to only include public moods
        const publicMoods = moods.filter(mood => mood.isPublic === true);
        return publicMoods.map(mood => ({
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
      console.log('[Gateway] Resolving Query.publicMoods with REST approach');
      
      try {
        // Get raw JSON data to avoid GraphQL schema conflicts
        // This approach fetches data as JSON directly from PostgreSQL via PostGraphile's non-GraphQL endpoint
        const response = await fetch(`${TARGET_API.replace('/postgraphile/graphql', '')}/postgraphile/status?moodData=true&limit=${args.limit || 10}&offset=${args.offset || 0}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            ...(context.headers?.authorization ? { 'Authorization': context.headers.authorization } : {})
          }
        });
        
        if (!response.ok) {
          console.error(`[Gateway] Error fetching public moods: ${response.status} ${response.statusText}`);
          return [];
        }
        
        const result = await response.json();
        
        if (!result.moods || !Array.isArray(result.moods)) {
          console.log('[Gateway] No moods data found or invalid format:', result);
          
          // As a fallback, use a simpler GraphQL query that avoids complex types
          return fetchMoodsWithSimpleQuery(args, context);
        }
        
        // Transform to match our PublicMood schema
        return result.moods.map(mood => ({
          id: mood.id,
          intensity: mood.score,
          emoji: "😊", // Default emoji mapping
          message: mood.note || "",
          createdAt: mood.created_at,
          userId: mood.user_id,
          user: {
            id: mood.user?.id,
            name: mood.user?.username,
            avatar: mood.user?.avatar_url || ""
          }
        }));
      } catch (error) {
        console.error('[Gateway] Error in publicMoods resolver:', error);
        
        // As a fallback, try a simpler approach if the REST endpoint fails
        return fetchMoodsWithSimpleQuery(args, context);
      }
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
    },
    
    me: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.me');
      if (!context.headers?.authorization) {
        console.log('[Gateway] No authorization token, returning null for me query');
        return null;
      }
      
      try {
        // Use a direct HTTP request to fetch the current user data
        const response = await fetch(TARGET_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': context.headers.authorization
          },
          body: JSON.stringify({
            query: `
              query GetCurrentUser {
                currentUser {
                  id
                  username
                  email
                  avatarUrl
                }
              }
            `
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          console.error('[Gateway] GraphQL errors in me query:', result.errors);
          return null;
        }
        
        const user = result.data?.currentUser;
        if (!user) {
          return null;
        }
        
        // Transform to match our User type
        return {
          id: user.id,
          name: user.username,
          email: user.email,
          avatar: user.avatarUrl
        };
      } catch (error) {
        console.error('[Gateway] Error in me resolver:', error);
        return null;
      }
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
    },
    
    login: async (_, { email, password }, context) => {
      console.log('[Gateway] Resolving Mutation.login');
      
      try {
        // Use a direct HTTP request to authenticate with PostGraphile
        const response = await fetch(TARGET_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: `
              mutation Login($email: String!, $password: String!) {
                authenticate(input: {email: $email, password: $password}) {
                  jwt
                  user {
                    id
                    username
                    email
                    avatarUrl
                  }
                }
              }
            `,
            variables: { email, password }
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          console.error('[Gateway] GraphQL errors in login:', result.errors);
          throw new Error(result.errors[0].message || "Login failed");
        }
        
        const authData = result.data?.authenticate;
        if (!authData) {
          throw new Error("Authentication failed");
        }
        
        // Transform to match our AuthPayload type
        return {
          token: authData.jwt,
          user: {
            id: authData.user.id,
            name: authData.user.username,
            email: authData.user.email,
            avatar: authData.user.avatarUrl
          }
        };
      } catch (error) {
        console.error('[Gateway] Error in login resolver:', error);
        throw new Error(error.message || "Login failed");
      }
    },
    
    register: async (_, { input }, context) => {
      console.log('[Gateway] Resolving Mutation.register');
      
      try {
        // Use a direct HTTP request to register with PostGraphile
        const response = await fetch(TARGET_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: `
              mutation Register($name: String!, $email: String!, $password: String!) {
                registerUser(input: {username: $name, email: $email, password: $password}) {
                  user {
                    id
                    username
                    email
                    avatarUrl
                  }
                  jwt
                }
              }
            `,
            variables: { 
              name: input.name,
              email: input.email,
              password: input.password
            }
          })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          console.error('[Gateway] GraphQL errors in register:', result.errors);
          throw new Error(result.errors[0].message || "Registration failed");
        }
        
        const registerData = result.data?.registerUser;
        if (!registerData) {
          throw new Error("Registration failed");
        }
        
        // Transform to match our AuthPayload type
        return {
          token: registerData.jwt,
          user: {
            id: registerData.user.id,
            name: registerData.user.username,
            email: registerData.user.email,
            avatar: registerData.user.avatarUrl
          }
        };
      } catch (error) {
        console.error('[Gateway] Error in register resolver:', error);
        throw new Error(error.message || "Registration failed");
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

/**
 * Fallback query for fetching public moods when the REST approach fails
 * Uses a simpler GraphQL query structure to minimize schema conflicts
 */
async function fetchMoodsWithSimpleQuery(args, context) {
  console.log('[Gateway] Falling back to simple GraphQL query for public moods');
  
  try {
    // Use allMoods query which works better with PostGraphile's default schema
    return executeGraphQL(`
      query GetPublicMoods($limit: Int, $offset: Int) {
        allMoods(
          first: $limit
          offset: $offset
          filter: {
            isPublic: { equalTo: true }
          }
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
      // Transform the response to match our PublicMood type
      const moods = data?.allMoods?.nodes || [];
      return moods.map(mood => ({
        id: mood.id,
        intensity: mood.score,
        emoji: "😊", // Default emoji mapping
        message: mood.note || "",
        createdAt: mood.createdAt,
        userId: mood.userId,
        user: {
          id: mood.userByUserId?.id,
          name: mood.userByUserId?.username || mood.userByUserId?.name,
          avatar: mood.userByUserId?.avatarUrl || ""
        }
      }));
    });
  } catch (error) {
    console.error('[Gateway] Error in fetchMoodsWithSimpleQuery:', error);
    return [];
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