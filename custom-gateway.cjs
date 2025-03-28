/**
 * Simple Custom GraphQL Gateway for HugMeNow (CommonJS version)
 */

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const http = require('http');
const https = require('https');

// Configuration
const PORT = process.env.PORT || 5000;
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3002/graphql';
const AUTH_TOKEN = process.env.GRAPHQL_AUTH_TOKEN || '';

console.log(`Starting gateway on port ${PORT}, connecting to API at ${API_ENDPOINT}`);

// Type definitions for virtual fields and client-specific types
const typeDefs = gql`
  # Base schema types are extended from the underlying API
  type Query {
    # Standard API fields (proxy to backend)
    hello: String
    users: [User]
    currentUser: User
    user(id: ID!): User
    userByUsername(username: String!): User
    moods(userId: ID, limit: Int, offset: Int): [MoodEntry]
    moodById(id: ID!): MoodEntry
    moodStreak(userId: ID): MoodStreak
    publicMoods(limit: Int, offset: Int): [PublicMood]
    hugs(userId: ID, type: String, limit: Int, offset: Int): [Hug]
    hugById(id: ID!): Hug
    hugRequests(userId: ID): [HugRequest]
    
    # Client-specific fields and aliases
    clientInfo: ClientInfo!
    friendsMoods: [PublicMood]
    userMoods(userId: ID, limit: Int, offset: Int): [MoodEntry]
    sentHugs(userId: ID, limit: Int, offset: Int): [Hug]
    receivedHugs(userId: ID, limit: Int, offset: Int): [Hug]
  }
  
  type Mutation {
    # Proxy to underlying API
    login(email: String!, password: String!): AuthPayload
    register(username: String!, email: String!, password: String!): AuthPayload
    createMood(input: MoodInput!): MoodEntry
    updateMood(id: ID!, input: MoodInput!): MoodEntry
    deleteMood(id: ID!): Boolean
    sendHug(input: HugInput!): Hug
    markHugAsRead(id: ID!): Hug
    createHugRequest(input: HugRequestInput!): HugRequest
    updateProfile(input: ProfileInput!): User
    
    # Client-specific mutations
    sendFriendHug(toUserId: ID!, moodId: ID!, message: String): Hug
  }
  
  # Define basic types needed for the resolvers
  type User {
    id: ID!
    username: String!
    email: String
    profileImage: String
    bio: String
    createdAt: String
  }
  
  type MoodEntry {
    id: ID!
    mood: String!
    intensity: Int!
    note: String
    isPrivate: Boolean
    createdAt: String!
    user: User
  }
  
  type PublicMood {
    id: ID!
    mood: String!
    intensity: Int!
    createdAt: String!
    user: User
    score: Int
  }
  
  type Hug {
    id: ID!
    message: String
    isRead: Boolean
    createdAt: String!
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
    createdAt: String!
    fromUser: User
    toUser: User
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
      return {
        version: process.env.CLIENT_VERSION || '1.0.0',
        buildDate: new Date().toISOString()
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

/**
 * Main function to start the server
 */
async function startServer() {
  try {
    // Create Express app
    const app = express();
    
    // Create a GraphQL schema
    const schema = makeExecutableSchema({ 
      typeDefs,
      resolvers 
    });
    
    // Create Apollo Server
    const server = new ApolloServer({
      schema,
      introspection: true,
      playground: true,
      context: ({ req }) => {
        // Pass the authorization header if present
        const token = req.headers.authorization || '';
        return { token };
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