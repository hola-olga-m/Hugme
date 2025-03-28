/**
 * Custom GraphQL Gateway for HugMeNow
 * 
 * This server provides a unified GraphQL API that:
 * 1. Proxies requests to the underlying HugMeNow API
 * 2. Transforms field names to maintain client compatibility
 * 3. Adds virtual fields and client-specific resolvers
 */

import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// Configuration
const PORT = process.env.PORT || 5000;
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3002/graphql';
const AUTH_TOKEN = process.env.GRAPHQL_AUTH_TOKEN || '';

// Type definitions for virtual fields and client-specific types
const typeDefs = gql`
  # Base schema types are extended from the underlying API
  # These are the additional client-specific fields and types

  type ClientInfo {
    version: String!
    buildDate: String!
  }

  # Extensions to the root Query type
  extend type Query {
    # Client-only fields
    clientInfo: ClientInfo!
    
    # Virtual fields that map to existing schema fields with potentially different parameters
    friendsMoods: [PublicMood]
    userMoods(userId: ID, limit: Int, offset: Int): [MoodEntry]
    sentHugs(userId: ID, limit: Int, offset: Int): [Hug]
    receivedHugs(userId: ID, limit: Int, offset: Int): [Hug]
  }
  
  # Add client-side field names to existing types
  extend type PublicMood {
    score: Int
  }
  
  extend type Hug {
    fromUser: User
    toUser: User
    read: Boolean
  }
`;

// Define our resolvers - these map client field names to server field names
const resolvers = {
  Query: {
    // Client information - client-only field
    clientInfo: () => {
      console.log('[Gateway] Resolving Query.clientInfo');
      return {
        version: process.env.CLIENT_VERSION || '1.0.0',
        buildDate: new Date().toISOString()
      };
    },
    
    // Virtual field: friendsMoods -> maps to publicMoods
    friendsMoods: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.friendsMoods -> publicMoods');
      try {
        // Execute GraphQL query against the underlying API
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
        
        if (result.errors) {
          console.error('[Gateway] Error getting public moods:', result.errors);
          return [];
        }
        
        console.log(`[Gateway] Found ${result.data?.publicMoods?.length || 0} friend moods`);
        return result.data?.publicMoods || [];
      } catch (error) {
        console.error('[Gateway] Error resolving friendsMoods:', error);
        return [];
      }
    },
    
    // Virtual field: userMoods -> maps to moods with parameters
    userMoods: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.userMoods -> moods', args);
      try {
        // Execute GraphQL query against the underlying API
        const result = await executeGraphQL(`
          query GetUserMoods($userId: ID, $limit: Int, $offset: Int) {
            moods(userId: $userId, limit: $limit, offset: $offset) {
              id
              mood
              intensity
              note
              createdAt
              isPrivate
              user {
                id
                username
              }
            }
          }
        `, {
          userId: args.userId || null,
          limit: args.limit || 10,
          offset: args.offset || 0
        });
        
        if (result.errors) {
          console.error('[Gateway] Error getting user moods:', result.errors);
          return [];
        }
        
        console.log(`[Gateway] Found ${result.data?.moods?.length || 0} user moods`);
        return result.data?.moods || [];
      } catch (error) {
        console.error('[Gateway] Error resolving userMoods:', error);
        return [];
      }
    },
    
    // Virtual field: sentHugs -> maps to hugs with sender filter
    sentHugs: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.sentHugs -> hugs (sender filter)', args);
      try {
        // Execute GraphQL query against the underlying API
        const result = await executeGraphQL(`
          query GetSentHugs($userId: ID, $limit: Int, $offset: Int) {
            hugs(userId: $userId, type: "sent", limit: $limit, offset: $offset) {
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
        `, {
          userId: args.userId || null,
          limit: args.limit || 10,
          offset: args.offset || 0
        });
        
        if (result.errors) {
          console.error('[Gateway] Error getting sent hugs:', result.errors);
          return [];
        }
        
        console.log(`[Gateway] Found ${result.data?.hugs?.length || 0} sent hugs`);
        return result.data?.hugs || [];
      } catch (error) {
        console.error('[Gateway] Error resolving sentHugs:', error);
        return [];
      }
    },
    
    // Virtual field: receivedHugs -> maps to hugs with recipient filter
    receivedHugs: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.receivedHugs -> hugs (recipient filter)', args);
      try {
        // Execute GraphQL query against the underlying API
        const result = await executeGraphQL(`
          query GetReceivedHugs($userId: ID, $limit: Int, $offset: Int) {
            hugs(userId: $userId, type: "received", limit: $limit, offset: $offset) {
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
        `, {
          userId: args.userId || null,
          limit: args.limit || 10,
          offset: args.offset || 0
        });
        
        if (result.errors) {
          console.error('[Gateway] Error getting received hugs:', result.errors);
          return [];
        }
        
        console.log(`[Gateway] Found ${result.data?.hugs?.length || 0} received hugs`);
        return result.data?.hugs || [];
      } catch (error) {
        console.error('[Gateway] Error resolving receivedHugs:', error);
        return [];
      }
    }
  },
  
  // Add virtual fields to existing types
  PublicMood: {
    // Virtual field: score -> maps to intensity
    score: (parent) => {
      return parent.intensity;
    }
  },
  
  Hug: {
    // Virtual field: fromUser -> maps to sender
    fromUser: (parent) => {
      return parent.sender;
    },
    
    // Virtual field: toUser -> maps to recipient
    toUser: (parent) => {
      return parent.recipient;
    },
    
    // Virtual field: read -> maps to isRead
    read: (parent) => {
      return parent.isRead;
    }
  }
};

/**
 * Execute a GraphQL query against the underlying API
 */
async function executeGraphQL(query, variables = {}) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization if available
    if (AUTH_TOKEN) {
      headers['Authorization'] = AUTH_TOKEN;
    }
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    // Parse the JSON response
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
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
    
    // Forward all other GraphQL requests to the API
    app.post('/api/graphql', async (req, res) => {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization || ''
          },
          body: JSON.stringify(req.body)
        });
        
        const result = await response.json();
        res.json(result);
      } catch (error) {
        console.error('Error proxying to API:', error);
        res.status(500).json({ errors: [{ message: 'Internal Server Error' }] });
      }
    });
    
    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(chalk.green(`🚀 Custom GraphQL Gateway running at http://0.0.0.0:${PORT}${server.graphqlPath}`));
      console.log(chalk.cyan(`📝 Proxying API requests to ${API_ENDPOINT}`));
      console.log(chalk.yellow(`✨ Virtual fields and client compatibility enabled`));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();