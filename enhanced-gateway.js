/**
 * Enhanced GraphQL Gateway for HugMeNow
 * 
 * This gateway implementation combines GraphQL Shield for permissions
 * and Schema Merger for advanced schema manipulation.
 */

import { ApolloServer, gql } from 'apollo-server-express';
// Use our unified GraphQL version instead of the direct import
import { execute, parse, subscribe, getGraphQLVersion } from './graphql-resolver.js';
import fetch from 'node-fetch';

// Log the GraphQL version we're using
console.log('Using GraphQL version:', getGraphQLVersion());
import { makeExecutableSchema } from '@graphql-tools/schema';
import { SERVICE_PORTS, SERVICE_ENDPOINTS, CLIENT_INFO } from './gateway-config.js';
import { applyShield } from './shield-rules.js';
import { loadSchema } from './schema-merger.js';
import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import express from 'express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import cors from 'cors';
import bodyParser from 'body-parser';

// Live Query Support
const LIVE_QUERY_DIRECTIVE = `
  # Live Query directive for real-time data updates
  directive @live on QUERY

  # Special type for Live Query updates
  type _LiveQuery {
    refreshMood: Boolean
    refreshHug: Boolean
    moodId: ID
    hugId: ID
    userId: ID
    senderId: ID
    recipientId: ID
  }
`;

// Cache of active live queries
const liveQueryCache = new Map();

// Create a PubSub instance for handling subscription events
const pubsub = new PubSub();

// Define event topics for subscriptions
const EVENTS = {
  NEW_MOOD: 'NEW_MOOD',
  NEW_HUG: 'NEW_HUG',
  NEW_HUG_RECEIVED: 'NEW_HUG_RECEIVED',
  NEW_FRIEND_MOOD: 'NEW_FRIEND_MOOD'
};

// Set port from environment or configuration
const PORT = process.env.PORT || SERVICE_PORTS.ENHANCED_GATEWAY;
const API_ENDPOINT = process.env.API_ENDPOINT || SERVICE_ENDPOINTS.POSTGRAPHILE;

console.log(`Starting Enhanced Gateway on port ${PORT}, connecting to API at ${API_ENDPOINT}`);

// GraphQL query executor against the underlying API
async function executeGraphQL(query, variables = {}, token = null) {
  try {
    console.log(`[Enhanced Gateway] Executing query against ${API_ENDPOINT}`);
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('[Enhanced Gateway] Query execution errors:', JSON.stringify(result.errors));
    }
    
    return result;
  } catch (error) {
    console.error('[Enhanced Gateway] Error executing GraphQL query:', error);
    throw error;
  }
}

// Base schema with subscription definitions
const baseSchema = gql`
  type Query {
    # Root-level fields
    clientInfo: ClientInfo
    currentUser: User
    publicMoods(limit: Int, offset: Int): [PublicMood]
    friendsMoods(limit: Int, offset: Int): [PublicMood]
    userMoods(userId: ID!, limit: Int, offset: Int): [Mood]
    moodStreak(userId: ID!): MoodStreak
    sentHugs(userId: ID!, limit: Int, offset: Int): [Hug]
    receivedHugs(userId: ID!, limit: Int, offset: Int): [Hug]
    login(email: String!, password: String!): AuthPayload
    register(username: String!, email: String!, password: String!): AuthPayload
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    register(username: String!, email: String!, password: String!): AuthPayload
    createMood(input: MoodInput!): Mood
    sendHug(input: HugInput!): Hug
    updateMood(id: ID!, input: MoodInput!): Mood
    deleteMood(id: ID!): Boolean
    updatePreferences(input: PreferencesInput!): User
  }

  type Subscription {
    newMood: Mood
    newHug: Hug
    newHugReceived(userId: ID!): Hug
    newFriendMood(userId: ID!): PublicMood
  }

  # Client-specific types
  type ClientInfo {
    version: String!
    buildDate: String!
    platform: String!
    deviceInfo: String
    features: [String]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # Core domain types
  type User {
    id: ID!
    username: String!
    email: String
    profileImage: String
    bio: String
    joinDate: String
    preferences: UserPreferences
    role: String
  }

  type UserPreferences {
    theme: String
    notifications: Boolean
    privacyLevel: String
  }

  type MoodStreak {
    userId: ID!
    currentStreak: Int!
    longestStreak: Int!
    lastMoodDate: String
  }

  type Mood {
    id: ID!
    userId: ID!
    user: User
    mood: String
    emoji: String
    intensity: Int!
    message: String
    isPublic: Boolean!
    createdAt: String!
    score: Int  # For backward compatibility
  }

  type PublicMood {
    id: ID!
    mood: String
    intensity: Int!
    message: String
    createdAt: String!
    user: User
  }

  type Hug {
    id: ID!
    sender: User!
    recipient: User!
    message: String
    mood: Mood
    isRead: Boolean!
    createdAt: String!
  }

  # Input types
  input MoodInput {
    userId: ID
    mood: String
    emoji: String
    intensity: Int
    message: String
    isPublic: Boolean
    score: Int  # For backward compatibility
  }

  input HugInput {
    senderId: ID!
    recipientId: ID!
    message: String
    moodId: ID
  }

  input PreferencesInput {
    theme: String
    notifications: Boolean
    privacyLevel: String
  }
`;

// Virtual resolvers for client-specific fields
const virtualResolvers = {
  // Subscription resolvers
  Subscription: {
    newMood: {
      subscribe: () => {
        console.log('[Enhanced Gateway] Setting up newMood subscription');
        return pubsub.asyncIterator(EVENTS.NEW_MOOD);
      }
    },
    
    newHug: {
      subscribe: () => {
        console.log('[Enhanced Gateway] Setting up newHug subscription');
        return pubsub.asyncIterator(EVENTS.NEW_HUG);
      }
    },
    
    newHugReceived: {
      subscribe: (_, { userId }) => {
        console.log('[Enhanced Gateway] Setting up newHugReceived subscription for userId:', userId);
        return pubsub.asyncIterator(`${EVENTS.NEW_HUG_RECEIVED}.${userId}`);
      }
    },
    
    newFriendMood: {
      subscribe: (_, { userId }) => {
        console.log('[Enhanced Gateway] Setting up newFriendMood subscription for userId:', userId);
        return pubsub.asyncIterator(`${EVENTS.NEW_FRIEND_MOOD}.${userId}`);
      }
    }
  },
  
  // Live query helpers
  _LiveQuery: {
    // This resolver is used by @live directive to detect when a query should be refreshed
    refreshMood: (_, args) => {
      console.log('[Enhanced Gateway] Live Query refresh for mood', args);
      return true;
    },
    refreshHug: (_, args) => {
      console.log('[Enhanced Gateway] Live Query refresh for hug', args);
      return true;
    }
  },
  
  Query: {
    clientInfo: () => {
      console.log('[Enhanced Gateway] Resolving Query.clientInfo');
      
      // Parse features from environment variable if available
      let features = CLIENT_INFO.FEATURES;
      if (process.env.CLIENT_FEATURES) {
        features = process.env.CLIENT_FEATURES.split(',');
      }
      
      return {
        version: process.env.CLIENT_VERSION || CLIENT_INFO.VERSION,
        buildDate: new Date().toISOString(),
        platform: process.env.CLIENT_PLATFORM || CLIENT_INFO.PLATFORM,
        deviceInfo: 'HugMeNow Enhanced Gateway Client',
        features
      };
    },
    
    friendsMoods: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.friendsMoods -> publicMoods');
      const result = await executeGraphQL(`
        query GetPublicMoods($limit: Int, $offset: Int) {
          allMoods(first: $limit, offset: $offset, condition: { isPublic: true }) {
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
                avatarUrl
              }
            }
          }
        }
      `, {
        limit: args.limit || 10,
        offset: args.offset || 0
      }, context.token);
      
      // Transform the response to match our schema
      const moods = result.data?.allMoods?.nodes || [];
      return moods.map(mood => ({
        id: mood.id,
        mood: "Happy", // Default mood since PostGraphile doesn't have this field
        intensity: mood.score, // Map score to intensity
        message: mood.note || "",
        createdAt: mood.createdAt,
        user: {
          id: mood.userByUserId?.id || mood.userId || "unknown",
          username: mood.userByUserId?.username || "unknown",
          profileImage: mood.userByUserId?.avatarUrl || ""
        }
      }));
    },
    
    userMoods: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.userMoods -> moods', args);
      const result = await executeGraphQL(`
        query GetMoods($userId: UUID!, $limit: Int, $offset: Int) {
          allMoods(
            filter: { userId: { equalTo: $userId } }
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
                avatarUrl
              }
            }
          }
        }
      `, {
        userId: args.userId,
        limit: args.limit || 10,
        offset: args.offset || 0
      }, context.token);
      
      // Transform the response to match our schema
      const moods = result.data?.allMoods?.nodes || [];
      return moods.map(mood => ({
        id: mood.id,
        userId: mood.userId,
        mood: "Happy", // Default mood since PostGraphile doesn't have this field
        intensity: mood.score, // Map score to intensity
        message: mood.note || "",
        isPublic: mood.isPublic,
        createdAt: mood.createdAt,
        user: {
          id: mood.userByUserId?.id || mood.userId || "unknown",
          username: mood.userByUserId?.username || "unknown",
          profileImage: mood.userByUserId?.avatarUrl || ""
        }
      }));
    },
    
    publicMoods: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.publicMoods');
      
      // Use real data from PostGraphile
      const result = await executeGraphQL(`
        query GetPublicMoods($limit: Int, $offset: Int) {
          allMoods(
            condition: { isPublic: true }
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
                avatarUrl
              }
            }
          }
        }
      `, 
      { 
        limit: args.limit || 10, 
        offset: args.offset || 0 
      }, 
      context.token);
      
      // Transform PostGraphile's response to match our schema
      const moods = result.data?.allMoods?.nodes || [];
      return moods.map(mood => ({
        id: mood.id,
        mood: "Happy", // Default mood since PostGraphile doesn't have this field
        intensity: mood.score, // Map score to intensity
        message: mood.note || "",
        createdAt: mood.createdAt,
        user: {
          id: mood.userByUserId?.id || mood.userId || "unknown",
          username: mood.userByUserId?.username || "unknown",
          profileImage: mood.userByUserId?.avatarUrl || ""
        }
      }));
    },
    
    moodStreak: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.moodStreak', args);
      // For this demo, we'll return mock data since we don't have a real streak calculation
      // In production, this would call an actual API endpoint
      return {
        userId: args.userId,
        currentStreak: 3,
        longestStreak: 7,
        lastMoodDate: new Date().toISOString()
      };
    },
    
    currentUser: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.currentUser');
      if (!context.user || !context.token) {
        return null;
      }
      
      // We'd normally fetch user data from the API here
      // For now we'll return the context user
      return context.user;
    },
    
    login: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.login');
      // In a real implementation, this would validate credentials and return a token
      return {
        token: "sample_token",
        user: {
          id: "1",
          username: "demouser",
          email: args.email
        }
      };
    },
    
    register: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.register');
      // In a real implementation, this would create a user and return a token
      return {
        token: "sample_token",
        user: {
          id: "1",
          username: args.username,
          email: args.email
        }
      };
    },
    
    sentHugs: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.sentHugs -> hugs (sent)', args);
      const result = await executeGraphQL(`
        query GetSentHugs($userId: UUID!, $limit: Int, $offset: Int) {
          allHugs(
            filter: { senderId: { equalTo: $userId } }
            first: $limit
            offset: $offset
          ) {
            nodes {
              id
              message
              isRead
              createdAt
              senderId
              recipientId
              userBySenderId {
                id
                username
                avatarUrl
              }
              userByRecipientId {
                id
                username
                avatarUrl
              }
              mood {
                id
                score
                note
              }
            }
          }
        }
      `, {
        userId: args.userId,
        limit: args.limit || 10,
        offset: args.offset || 0
      }, context.token);
      
      // Transform the response to match our schema
      const hugs = result.data?.allHugs?.nodes || [];
      return hugs.map(hug => ({
        id: hug.id,
        message: hug.message || "",
        isRead: hug.isRead || false,
        createdAt: hug.createdAt,
        sender: {
          id: hug.userBySenderId?.id || hug.senderId || "unknown",
          username: hug.userBySenderId?.username || "unknown",
          profileImage: hug.userBySenderId?.avatarUrl || ""
        },
        recipient: {
          id: hug.userByRecipientId?.id || hug.recipientId || "unknown",
          username: hug.userByRecipientId?.username || "unknown",
          profileImage: hug.userByRecipientId?.avatarUrl || ""
        },
        mood: hug.mood ? {
          id: hug.mood.id,
          intensity: hug.mood.score,
          message: hug.mood.note || "",
        } : null
      }));
    },
    
    receivedHugs: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.receivedHugs -> hugs (received)', args);
      const result = await executeGraphQL(`
        query GetReceivedHugs($userId: UUID!, $limit: Int, $offset: Int) {
          allHugs(
            filter: { recipientId: { equalTo: $userId } }
            first: $limit
            offset: $offset
          ) {
            nodes {
              id
              message
              isRead
              createdAt
              senderId
              recipientId
              userBySenderId {
                id
                username
                avatarUrl
              }
              userByRecipientId {
                id
                username
                avatarUrl
              }
              mood {
                id
                score
                note
              }
            }
          }
        }
      `, {
        userId: args.userId,
        limit: args.limit || 10,
        offset: args.offset || 0
      }, context.token);
      
      // Transform the response to match our schema
      const hugs = result.data?.allHugs?.nodes || [];
      return hugs.map(hug => ({
        id: hug.id,
        message: hug.message || "",
        isRead: hug.isRead || false,
        createdAt: hug.createdAt,
        sender: {
          id: hug.userBySenderId?.id || hug.senderId || "unknown",
          username: hug.userBySenderId?.username || "unknown",
          profileImage: hug.userBySenderId?.avatarUrl || ""
        },
        recipient: {
          id: hug.userByRecipientId?.id || hug.recipientId || "unknown",
          username: hug.userByRecipientId?.username || "unknown",
          profileImage: hug.userByRecipientId?.avatarUrl || ""
        },
        mood: hug.mood ? {
          id: hug.mood.id,
          intensity: hug.mood.score,
          message: hug.mood.note || "",
        } : null
      }));
    }
  },
  
  Mutation: {
    login: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Mutation.login');
      // In a real implementation, this would validate credentials and return a token
      return {
        token: "sample_token",
        user: {
          id: "1",
          username: "demouser",
          email: args.email
        }
      };
    },
    
    register: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Mutation.register');
      // In a real implementation, this would create a user and return a token
      return {
        token: "sample_token",
        user: {
          id: "1",
          username: args.username,
          email: args.email
        }
      };
    },
    
    createMood: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Mutation.createMood');
      
      // Make direct REST POST request to avoid GraphQL version conflicts
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
      
      console.log('[Enhanced Gateway] Sending createMood with input:', JSON.stringify(mutationInput));
      
      // Make a direct POST request to avoid GraphQL library version conflicts
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(context.token ? { 'Authorization': `Bearer ${context.token}` } : {})
        },
        body: JSON.stringify({ 
          query: `
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
          `,
          variables: { input: mutationInput }
        })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        console.error('[Enhanced Gateway] GraphQL errors:', JSON.stringify(result.errors, null, 2));
        throw new Error('Failed to create mood: ' + result.errors[0].message);
      }
      
      if (!result?.data?.createMood?.mood) {
        throw new Error('Failed to create mood: No data returned');
      }
      
      const mood = result.data.createMood.mood;
      
      // Transform the response to match client expectations
      const transformedMood = {
        id: mood.id,
        userId: mood.userId,
        intensity: mood.score,
        emoji: "😊", // Default emoji since not stored in DB
        message: mood.note || "",
        createdAt: mood.createdAt,
        isPublic: mood.isPublic,
        score: mood.score // For backward compatibility
      };
      
      console.log('[Enhanced Gateway] Successfully created mood in database:', transformedMood.id);
      
      // Publish to subscription channels
      pubsub.publish(EVENTS.NEW_MOOD, { newMood: transformedMood });
      
      // Also publish to the user-specific channel for friend mood notifications
      if (transformedMood.isPublic) {
        pubsub.publish(`${EVENTS.NEW_FRIEND_MOOD}.${transformedMood.userId}`, { 
          newFriendMood: transformedMood 
        });
      }
      
      // Trigger live query invalidation
      console.log('[Enhanced Gateway] 📡 Triggering Live Query invalidation for mood:', transformedMood.id);
      liveQueryCache.forEach((query, id) => {
        if (query.includes('userMoods') || query.includes('friendsMoods')) {
          console.log('[Enhanced Gateway] 📡 Live Query refresh triggered for query ID:', id);
          pubsub.publish(`_HugMeNow_LiveQuery_${id}`, { 
            _LiveQuery: { 
              refreshMood: true, 
              moodId: transformedMood.id,
              userId: transformedMood.userId
            } 
          });
        }
      });
      
      return transformedMood;
    },
    
    sendHug: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Mutation.sendHug');
      
      // Make direct REST POST request to avoid GraphQL version conflicts
      const hugInput = {
        type: "SUPPORTIVE", // Default type
        message: args.input.message || "",
        senderId: args.input.senderId,
        recipientId: args.input.recipientId,
        isRead: false, // Default as unread
        moodId: args.input.moodId
      };
      
      const mutationInput = {
        clientMutationId: "direct-" + Date.now(),
        hug: hugInput
      };
      
      console.log('[Enhanced Gateway] Sending createHug with input:', JSON.stringify(mutationInput));
      
      // Make a direct POST request to avoid GraphQL library version conflicts
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(context.token ? { 'Authorization': `Bearer ${context.token}` } : {})
        },
        body: JSON.stringify({ 
          query: `
            mutation CreateHug($input: CreateHugInput!) {
              createHug(input: $input) {
                hug {
                  id
                  message
                  isRead
                  createdAt
                  senderId
                  recipientId
                  userBySenderId {
                    id
                    username
                    avatarUrl
                  }
                  userByRecipientId {
                    id
                    username
                    avatarUrl
                  }
                  moodId
                  moodByMoodId {
                    id
                    score
                    note
                  }
                }
              }
            }
          `,
          variables: { input: mutationInput }
        })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        console.error('[Enhanced Gateway] GraphQL errors:', JSON.stringify(result.errors, null, 2));
        throw new Error('Failed to send hug: ' + result.errors[0].message);
      }
      
      if (!result?.data?.createHug?.hug) {
        throw new Error('Failed to send hug: No data returned');
      }
      
      const hug = result.data.createHug.hug;
      
      // Transform the response to match client expectations
      const transformedHug = {
        id: hug.id,
        message: hug.message || "",
        isRead: hug.isRead || false,
        createdAt: hug.createdAt,
        sender: {
          id: hug.userBySenderId?.id || hug.senderId || "unknown",
          username: hug.userBySenderId?.username || "unknown",
          profileImage: hug.userBySenderId?.avatarUrl || ""
        },
        recipient: {
          id: hug.userByRecipientId?.id || hug.recipientId || "unknown",
          username: hug.userByRecipientId?.username || "unknown",
          profileImage: hug.userByRecipientId?.avatarUrl || ""
        },
        mood: hug.moodByMoodId ? {
          id: hug.moodByMoodId.id,
          intensity: hug.moodByMoodId.score,
          message: hug.moodByMoodId.note || "",
        } : null
      };
      
      console.log('[Enhanced Gateway] Successfully sent hug in database:', transformedHug.id);
      
      // Publish to subscription channels
      pubsub.publish(EVENTS.NEW_HUG, { newHug: transformedHug });
      
      // Also publish to the recipient-specific channel for received hug notifications
      pubsub.publish(`${EVENTS.NEW_HUG_RECEIVED}.${transformedHug.recipient.id}`, { 
        newHugReceived: transformedHug 
      });
      
      // Trigger live query invalidation for hugs
      console.log('[Enhanced Gateway] 📡 Triggering Live Query invalidation for hug:', transformedHug.id);
      liveQueryCache.forEach((query, id) => {
        if (query.includes('sentHugs') || query.includes('receivedHugs')) {
          console.log('[Enhanced Gateway] 📡 Live Query refresh triggered for query ID:', id);
          pubsub.publish(`_HugMeNow_LiveQuery_${id}`, { 
            _LiveQuery: { 
              refreshHug: true, 
              hugId: transformedHug.id,
              senderId: transformedHug.sender.id,
              recipientId: transformedHug.recipient.id
            } 
          });
        }
      });
      
      return transformedHug;
    },
    
    updateMood: async (_, { id, input }, context) => {
      console.log('[Enhanced Gateway] Resolving Mutation.updateMood');
      // This would implement mood updating
      return {
        id,
        mood: input.mood,
        intensity: input.intensity,
        message: input.message,
        isPublic: input.isPublic,
        createdAt: new Date().toISOString()
      };
    },
    
    deleteMood: async (_, { id }, context) => {
      console.log('[Enhanced Gateway] Resolving Mutation.deleteMood');
      // This would implement mood deletion
      return true;
    },
    
    updatePreferences: async (_, { input }, context) => {
      console.log('[Enhanced Gateway] Resolving Mutation.updatePreferences');
      // This would implement preferences updating
      return {
        id: "1",
        username: "demouser",
        preferences: {
          theme: input.theme,
          notifications: input.notifications,
          privacyLevel: input.privacyLevel
        }
      };
    }
  }
};

// Main function to start the server
async function startServer() {
  try {
    console.log(`🔍 Loading configuration from gateway-config.js...`);
    console.log(`🚀 Starting EnhancedGraphQLGateway...`);
    console.log(`🔪 Cleaning up any existing processes on port ${PORT}...`);
    console.log(`🌐 Starting gateway on http://0.0.0.0:${PORT}/graphql...`);
    
    // Create Express application
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    
    // Create HTTP server
    const httpServer = createServer(app);
    
    // Create executable schema with Live Query directive
    const schema = makeExecutableSchema({
      typeDefs: [
        baseSchema,
        LIVE_QUERY_DIRECTIVE
      ],
      resolvers: virtualResolvers,
    });
    
    // Apply Shield rules for permissions
    const protectedSchema = applyShield(schema);
    
    // Create Apollo Server
    const server = new ApolloServer({
      schema: protectedSchema,
      plugins: [
        {
          // Add plugin to intercept requests and track Live Queries
          requestDidStart: () => ({
            didResolveOperation: ({ request, document }) => {
              try {
                // Check if this is a query with @live directive
                const queryString = request.query;
                if (queryString && queryString.includes('@live')) {
                  // Store the query in the cache with a unique ID
                  const queryId = `live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                  console.log('[Enhanced Gateway] 📡 Detected Live Query, assigning ID:', queryId);
                  liveQueryCache.set(queryId, queryString);
                }
              } catch (error) {
                console.error('[Enhanced Gateway] Error tracking Live Query:', error);
              }
            }
          })
        }
      ],
      context: ({ req }) => {
        // Extract token from Authorization header
        const token = req.headers.authorization?.replace('Bearer ', '') || '';
        let user = null;
        
        // Simple user for demonstration purposes
        if (token) {
          try {
            user = {
              id: '1',
              username: 'demouser',
              email: 'demo@example.com',
              role: 'USER'
            };
          } catch (error) {
            console.error('[Enhanced Gateway] Token verification error:', error);
          }
        }
        
        return { token, user };
      },
    });
    
    // Set up subscription server
    const subscriptionServer = SubscriptionServer.create(
      {
        schema: protectedSchema,
        execute,
        subscribe,
        onConnect: (connectionParams, webSocket) => {
          console.log('[Enhanced Gateway] New WebSocket connection established');
          
          // Extract token from connection parameters
          const token = connectionParams.Authorization || '';
          let user = null;
          
          // Simple user for demonstration purposes
          if (token) {
            try {
              user = {
                id: '1',
                username: 'demouser',
                email: 'demo@example.com',
                role: 'USER'
              };
            } catch (error) {
              console.error('[Enhanced Gateway] WebSocket token verification error:', error);
            }
          }
          
          return { token, user };
        },
        onDisconnect: () => {
          console.log('[Enhanced Gateway] WebSocket connection closed');
        },
      },
      {
        server: httpServer,
        path: '/graphql',
      }
    );
    
    // Start the server
    await server.start();
    server.applyMiddleware({ app });
    
    // Start the HTTP server
    await new Promise(resolve => httpServer.listen(PORT, '0.0.0.0', resolve));
    
    const url = `http://0.0.0.0:${PORT}${server.graphqlPath}`;
    console.log(`🚀 Enhanced GraphQL Gateway running at ${url}`);
    console.log(`🔌 WebSocket subscriptions available at ws://0.0.0.0:${PORT}${server.graphqlPath}`);
    console.log(`📝 Virtual fields and Shield protection enabled`);
    console.log(`💡 API Endpoint: ${API_ENDPOINT}`);
    console.log(`📡 Live Query support enabled - use @live directive on queries`);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

// Start the server
startServer();

// ES Module exports
export { startServer, executeGraphQL };