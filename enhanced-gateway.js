/**
 * Enhanced GraphQL Gateway for HugMeNow
 * 
 * This gateway implementation combines GraphQL Shield for permissions
 * and Schema Merger for advanced schema manipulation.
 */

import { ApolloServer, gql } from 'apollo-server';
import { execute, parse } from 'graphql';
import fetch from 'node-fetch';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { SERVICE_PORTS, SERVICE_ENDPOINTS, CLIENT_INFO } from './gateway-config.js';
import { applyShield } from './shield-rules.js';
import { loadSchema } from './schema-merger.js';

// Set port from environment or configuration
const PORT = process.env.PORT || SERVICE_PORTS.CUSTOM_GATEWAY;
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

// Virtual type definitions for client-specific fields
const virtualTypeDefs = gql`
  # Empty schema extension - we've moved everything to the base schema
  type _EmptyType {
    _empty: String
  }
`;

// Virtual resolvers for client-specific fields
const virtualResolvers = {
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
          allMoods(first: $limit, offset: $offset) {
            nodes {
              id
              mood
              intensity
              createdAt
              user {
                id
                username
                profileImageUrl
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
        ...mood,
        user: {
          ...mood.user,
          profileImage: mood.user?.profileImageUrl
        }
      }));
    },
    
    userMoods: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.userMoods -> moods', args);
      const result = await executeGraphQL(`
        query GetMoods($userId: ID, $limit: Int, $offset: Int) {
          allMoods(
            filter: { userId: { equalTo: $userId } }
            first: $limit
            offset: $offset
          ) {
            nodes {
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
        }
      `, {
        userId: args.userId,
        limit: args.limit || 10,
        offset: args.offset || 0
      }, context.token);
      
      return result.data?.allMoods?.nodes || [];
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
      if (result && result.allMoods && result.allMoods.nodes) {
        return result.allMoods.nodes.map(mood => ({
          id: mood.id,
          mood: "Happy", // Default mood since PostGraphile doesn't have this field
          intensity: mood.score, // Map score to intensity
          message: mood.note || "",
          createdAt: mood.createdAt,
          user: {
            id: mood.userByUserId?.id || "unknown",
            username: mood.userByUserId?.username || "unknown",
            avatar: mood.userByUserId?.avatarUrl || ""
          }
        }));
      }
      
      return [];
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
    
    // These were in the original virtualResolvers
    sentHugs: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.sentHugs -> hugs (sent)', args);
      const result = await executeGraphQL(`
        query GetSentHugs($userId: ID, $limit: Int, $offset: Int) {
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
              sender {
                id
                username
                profileImageUrl
              }
              recipient {
                id
                username
                profileImageUrl
              }
              mood {
                id
                mood
                intensity
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
        ...hug,
        sender: {
          ...hug.sender,
          profileImage: hug.sender?.profileImageUrl
        },
        recipient: {
          ...hug.recipient,
          profileImage: hug.recipient?.profileImageUrl
        }
      }));
    },
    
    receivedHugs: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Query.receivedHugs -> hugs (received)', args);
      const result = await executeGraphQL(`
        query GetReceivedHugs($userId: ID, $limit: Int, $offset: Int) {
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
              sender {
                id
                username
                profileImageUrl
              }
              recipient {
                id
                username
                profileImageUrl
              }
              mood {
                id
                mood
                intensity
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
        ...hug,
        sender: {
          ...hug.sender,
          profileImage: hug.sender?.profileImageUrl
        },
        recipient: {
          ...hug.recipient,
          profileImage: hug.recipient?.profileImageUrl
        }
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
    
    markHugAsRead: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Mutation.markHugAsRead', args);
      const result = await executeGraphQL(`
        mutation MarkHugAsRead($id: ID!) {
          updateHug(input: {
            id: $id
            patch: {
              isRead: true
            }
          }) {
            hug {
              id
              isRead
              message
              createdAt
              sender {
                id
                username
              }
              recipient {
                id
                username
              }
            }
          }
        }
      `, {
        id: args.id
      }, context.token);
      
      return result.data?.updateHug?.hug || null;
    },
    
    updateProfile: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Mutation.updateProfile', args);
      if (!context.user || !context.user.id) {
        throw new Error("User not authenticated");
      }
      
      const result = await executeGraphQL(`
        mutation UpdateUser($id: ID!, $input: UserPatch!) {
          updateUser(input: {
            id: $id
            patch: $input
          }) {
            user {
              id
              username
              email
              bio
              profileImage
            }
          }
        }
      `, {
        id: context.user.id,
        input: args.input
      }, context.token);
      
      return result.data?.updateUser?.user || null;
    },
    
    sendFriendHug: async (_, args, context) => {
      console.log('[Enhanced Gateway] Resolving Mutation.sendFriendHug -> sendHug', args);
      const result = await executeGraphQL(`
        mutation SendHug($input: CreateHugInput!) {
          createHug(input: $input) {
            hug {
              id
              message
              isRead
              createdAt
              sender {
                id
                username
                profileImageUrl
              }
              recipient {
                id
                username
                profileImageUrl
              }
              mood {
                id
                mood
                intensity
              }
            }
          }
        }
      `, {
        input: {
          hug: {
            recipientId: args.toUserId,
            moodId: args.moodId,
            message: args.message
          }
        }
      }, context.token);
      
      const hug = result.data?.createHug?.hug;
      if (!hug) return null;
      
      // Transform the response to match our schema
      return {
        ...hug,
        sender: {
          ...hug.sender,
          profileImage: hug.sender?.profileImageUrl
        },
        recipient: {
          ...hug.recipient,
          profileImage: hug.recipient?.profileImageUrl
        }
      };
    }
  }
};

// Field transformers (example for consistent naming)
const fieldTransformers = [
  {
    type: 'field',
    transform: (typeName, fieldName) => {
      // Transform snake_case to camelCase for specific fields
      if (fieldName.includes('_')) {
        return fieldName
          .split('_')
          .map((part, i) => 
            i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
          )
          .join('');
      }
      return fieldName;
    }
  }
];

// Main function to start the server
async function startServer() {
  try {
    // Introspect the API schema if available
    let remoteSchema;
    try {
      remoteSchema = await loadSchema(API_ENDPOINT);
      console.log('[Enhanced Gateway] Successfully loaded remote schema');
    } catch (error) {
      console.warn('[Enhanced Gateway] Could not load remote schema:', error.message);
      console.log('[Enhanced Gateway] Falling back to local schema definition');
      
      // Use a minimal schema as fallback
      remoteSchema = gql`
        type Query {
          allMoods: MoodsConnection
          allHugs: HugsConnection
          allUsers: UsersConnection
          userById(id: ID!): User
          userByUsername(username: String!): User
          userByEmail(email: String!): User
          moodById(id: ID!): Mood
          hugById(id: ID!): Hug
          # Add virtual fields here to match the resolvers
          sentHugs(userId: ID, limit: Int, offset: Int): [Hug]
          receivedHugs(userId: ID, limit: Int, offset: Int): [Hug]
          friendsMoods: [PublicMood]
          userMoods(userId: ID, limit: Int, offset: Int): [MoodEntry]
          publicMoods(limit: Int, offset: Int): [PublicMood]
          moodStreak(userId: ID): MoodStreak
          currentUser: User
          clientInfo: ClientInfo!
          login(email: String!, password: String!): AuthPayload
          register(username: String!, email: String!, password: String!): AuthPayload
        }
        
        type Mutation {
          createUser(input: CreateUserInput!): CreateUserPayload
          updateUser(input: UpdateUserInput!): UpdateUserPayload
          createMood(input: CreateMoodInput!): CreateMoodPayload
          updateMood(input: UpdateMoodInput!): UpdateMoodPayload
          createHug(input: CreateHugInput!): CreateHugPayload
          updateHug(input: UpdateHugInput!): UpdateHugPayload
          # Add virtual mutation fields to match resolvers
          sendFriendHug(toUserId: ID!, moodId: ID!, message: String): Hug
          login(email: String!, password: String!): AuthPayload
          register(username: String!, email: String!, password: String!): AuthPayload
          markHugAsRead(id: ID!): Hug
          updateProfile(input: ProfileInput!): User
        }
        
        type User {
          id: ID!
          username: String!
          email: String
          profileImage: String
          bio: String
          createdAt: Datetime
          moods(first: Int, offset: Int): MoodsConnection
          sentHugs(first: Int, offset: Int): HugsConnection
          receivedHugs(first: Int, offset: Int): HugsConnection
        }
        
        type Mood {
          id: ID!
          mood: String!
          intensity: Int!
          note: String
          isPrivate: Boolean
          createdAt: Datetime
          userId: ID
          user: User
          hugs(first: Int, offset: Int): HugsConnection
        }
        
        type Hug {
          id: ID!
          message: String
          isRead: Boolean
          createdAt: Datetime
          senderId: ID
          recipientId: ID
          moodId: ID
          sender: User
          recipient: User
          mood: Mood
        }
        
        type MoodsConnection {
          nodes: [Mood]
          edges: [MoodsEdge]
          pageInfo: PageInfo
        }
        
        type MoodsEdge {
          cursor: Cursor
          node: Mood
        }
        
        type HugsConnection {
          nodes: [Hug]
          edges: [HugsEdge]
          pageInfo: PageInfo
        }
        
        type HugsEdge {
          cursor: Cursor
          node: Hug
        }
        
        type UsersConnection {
          nodes: [User]
          edges: [UsersEdge]
          pageInfo: PageInfo
        }
        
        type UsersEdge {
          cursor: Cursor
          node: User
        }
        
        type PageInfo {
          hasNextPage: Boolean!
          hasPreviousPage: Boolean!
          startCursor: Cursor
          endCursor: Cursor
        }
        
        type CreateUserPayload {
          user: User
        }
        
        type CreateMoodPayload {
          mood: Mood
        }
        
        type CreateHugPayload {
          hug: Hug
        }
        
        type UpdateUserPayload {
          user: User
        }
        
        type UpdateMoodPayload {
          mood: Mood
        }
        
        type UpdateHugPayload {
          hug: Hug
        }
        
        input CreateUserInput {
          user: UserInput!
        }
        
        input UserInput {
          username: String!
          email: String!
          password: String!
          profileImage: String
          bio: String
        }
        
        input CreateMoodInput {
          mood: MoodInput!
        }
        
        input MoodInput {
          mood: String!
          intensity: Int!
          note: String
          isPrivate: Boolean
          userId: ID
        }
        
        input CreateHugInput {
          hug: HugInput!
        }
        
        input HugInput {
          message: String
          recipientId: ID!
          moodId: ID!
        }
        
        input UpdateUserInput {
          id: ID!
          patch: UserPatch!
        }
        
        input UserPatch {
          username: String
          email: String
          profileImage: String
          bio: String
          password: String
        }
        
        input UpdateMoodInput {
          id: ID!
          patch: MoodPatch!
        }
        
        input MoodPatch {
          mood: String
          intensity: Int
          note: String
          isPrivate: Boolean
        }
        
        input UpdateHugInput {
          id: ID!
          patch: HugPatch!
        }
        
        input HugPatch {
          isRead: Boolean
          message: String
        }
        
        # Custom client-specific types
        type MoodEntry {
          id: ID!
          mood: String!
          intensity: Int!
          note: String
          isPrivate: Boolean
          createdAt: String
          user: User
        }
        
        type PublicMood {
          id: ID!
          mood: String!
          intensity: Int!
          createdAt: String
          user: User
        }
        
        type MoodStreak {
          userId: ID!
          currentStreak: Int!
          longestStreak: Int!
          lastMoodDate: String
        }
        
        type AuthPayload {
          token: String!
          user: User!
        }

        type ClientInfo {
          version: String!
          buildDate: String!
          platform: String
          deviceInfo: String
          features: [String]
        }
        
        input ProfileInput {
          username: String
          bio: String
          email: String
          profileImage: String
        }

        scalar Datetime
        scalar Cursor
      `;
    }
    
    // Create the merged schema with virtual fields
    console.log('Merging schema with virtual type defs...');
    
    // We'll always use our local schema definition to ensure it has all our custom fields
    console.log('Using local schema definition for consistency...');
    remoteSchema = gql`
      type Query {
        allMoods: MoodsConnection
        allHugs: HugsConnection
        allUsers: UsersConnection
        userById(id: ID!): User
        userByUsername(username: String!): User
        userByEmail(email: String!): User
        moodById(id: ID!): Mood
        hugById(id: ID!): Hug
        # Add virtual fields here to match the resolvers
        sentHugs(userId: ID, limit: Int, offset: Int): [Hug]
        receivedHugs(userId: ID, limit: Int, offset: Int): [Hug]
        friendsMoods: [PublicMood]
        userMoods(userId: ID, limit: Int, offset: Int): [MoodEntry]
        publicMoods(limit: Int, offset: Int): [PublicMood]
        moodStreak(userId: ID): MoodStreak
        currentUser: User
        clientInfo: ClientInfo!
        login(email: String!, password: String!): AuthPayload
        register(username: String!, email: String!, password: String!): AuthPayload
      }
      
      type Mutation {
        createUser(input: CreateUserInput!): CreateUserPayload
        updateUser(input: UpdateUserInput!): UpdateUserPayload
        createMood(input: CreateMoodInput!): CreateMoodPayload
        updateMood(input: UpdateMoodInput!): UpdateMoodPayload
        createHug(input: CreateHugInput!): CreateHugPayload
        updateHug(input: UpdateHugInput!): UpdateHugPayload
        # Add virtual mutation fields to match resolvers
        sendFriendHug(toUserId: ID!, moodId: ID!, message: String): Hug
        login(email: String!, password: String!): AuthPayload
        register(username: String!, email: String!, password: String!): AuthPayload
        markHugAsRead(id: ID!): Hug
        updateProfile(input: ProfileInput!): User
      }
      
      type User {
        id: ID!
        username: String!
        email: String
        profileImage: String
        bio: String
        createdAt: Datetime
        moods(first: Int, offset: Int): MoodsConnection
        sentHugs(first: Int, offset: Int): HugsConnection
        receivedHugs(first: Int, offset: Int): HugsConnection
      }
      
      type Mood {
        id: ID!
        mood: String!
        intensity: Int!
        note: String
        isPrivate: Boolean
        createdAt: Datetime
        userId: ID
        user: User
        hugs(first: Int, offset: Int): HugsConnection
      }
      
      type Hug {
        id: ID!
        message: String
        isRead: Boolean
        createdAt: Datetime
        senderId: ID
        recipientId: ID
        moodId: ID
        sender: User
        recipient: User
        mood: Mood
      }
      
      type MoodsConnection {
        nodes: [Mood]
        edges: [MoodsEdge]
        pageInfo: PageInfo
      }
      
      type MoodsEdge {
        cursor: Cursor
        node: Mood
      }
      
      type HugsConnection {
        nodes: [Hug]
        edges: [HugsEdge]
        pageInfo: PageInfo
      }
      
      type HugsEdge {
        cursor: Cursor
        node: Hug
      }
      
      type UsersConnection {
        nodes: [User]
        edges: [UsersEdge]
        pageInfo: PageInfo
      }
      
      type UsersEdge {
        cursor: Cursor
        node: User
      }
      
      type PageInfo {
        hasNextPage: Boolean!
        hasPreviousPage: Boolean!
        startCursor: Cursor
        endCursor: Cursor
      }
      
      type CreateUserPayload {
        user: User
      }
      
      type CreateMoodPayload {
        mood: Mood
      }
      
      type CreateHugPayload {
        hug: Hug
      }
      
      type UpdateUserPayload {
        user: User
      }
      
      type UpdateMoodPayload {
        mood: Mood
      }
      
      type UpdateHugPayload {
        hug: Hug
      }
      
      input CreateUserInput {
        user: UserInput!
      }
      
      input UserInput {
        username: String!
        email: String!
        password: String!
        profileImage: String
        bio: String
      }
      
      input CreateMoodInput {
        mood: MoodInput!
      }
      
      input MoodInput {
        mood: String!
        intensity: Int!
        note: String
        isPrivate: Boolean
        userId: ID
      }
      
      input CreateHugInput {
        hug: HugInput!
      }
      
      input HugInput {
        message: String
        recipientId: ID!
        moodId: ID!
      }
      
      input UpdateUserInput {
        id: ID!
        patch: UserPatch!
      }
      
      input UserPatch {
        username: String
        email: String
        profileImage: String
        bio: String
        password: String
      }
      
      input UpdateMoodInput {
        id: ID!
        patch: MoodPatch!
      }
      
      input MoodPatch {
        mood: String
        intensity: Int
        note: String
        isPrivate: Boolean
      }
      
      input UpdateHugInput {
        id: ID!
        patch: HugPatch!
      }
      
      input HugPatch {
        isRead: Boolean
        message: String
      }
      
      # Custom client-specific types
      type MoodEntry {
        id: ID!
        mood: String!
        intensity: Int!
        note: String
        isPrivate: Boolean
        createdAt: String
        user: User
      }
      
      type PublicMood {
        id: ID!
        mood: String!
        intensity: Int!
        createdAt: String
        user: User
      }
      
      type MoodStreak {
        userId: ID!
        currentStreak: Int!
        longestStreak: Int!
        lastMoodDate: String
      }
      
      type AuthPayload {
        token: String!
        user: User!
      }

      type ClientInfo {
        version: String!
        buildDate: String!
        platform: String
        deviceInfo: String
        features: [String]
      }
      
      input ProfileInput {
        username: String
        bio: String
        email: String
        profileImage: String
      }

      scalar Datetime
      scalar Cursor
    `;
    
    const virtualSchema = makeExecutableSchema({
      typeDefs: [remoteSchema, virtualTypeDefs],
      resolvers: virtualResolvers
    });
    
    // Apply transformers if needed
    let mergedSchema = virtualSchema;
    
    // Apply Shield rules for permissions
    const protectedSchema = applyShield(mergedSchema);
    
    // Create the server
    const server = new ApolloServer({
      schema: protectedSchema,
      context: ({ req }) => {
        // Extract token from Authorization header
        const token = req.headers.authorization?.replace('Bearer ', '') || '';
        
        // For demo purposes we'll create a simple user object based on token
        // In production, this would verify the token and load the full user
        let user = null;
        if (token) {
          try {
            // Simple mock user for demonstration
            // In production, decode and verify the JWT
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
      formatError: (error) => {
        console.error('[Enhanced Gateway] GraphQL error:', error);
        
        // Return a sanitized error message to client
        return {
          message: error.message,
          path: error.path,
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
          }
        };
      },
      plugins: [
        {
          requestDidStart: async () => ({
            didEncounterErrors: async ({ errors }) => {
              // Log errors in detail
              errors.forEach(error => {
                console.error('[Enhanced Gateway] GraphQL execution error:', error);
              });
            }
          })
        }
      ]
    });
    
    // Start the server
    const { url } = await server.listen(PORT, '0.0.0.0');
    console.log(`🚀 Enhanced GraphQL Gateway running at ${url}`);
    console.log(`📝 Virtual fields and Shield protection enabled`);
    console.log(`💡 API Endpoint: ${API_ENDPOINT}`);
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

// Start the server
startServer();

// ES Module exports
export { startServer, executeGraphQL };