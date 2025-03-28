/**
 * GraphQL Mesh + Apollo Server Integration
 * This file configures Apollo Server to work with GraphQL Mesh
 * Follows The Guild's recommended integration practices
 */

import { getMesh } from '@graphql-mesh/runtime';
import { findAndParseConfig } from '@graphql-mesh/config';
import { ApolloServer } from 'apollo-server';
import express from 'express';
import cors from 'cors';
import { useServer } from 'graphql-ws/umd/use/ws';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

// Port configuration - use environment variable or default
const PORT = process.env.PORT || 5000;

// Authentication token setting
const AUTH_TOKEN = process.env.GRAPHQL_AUTH_TOKEN || '';

// Set environment variables for Mesh configuration
process.env.GRAPHQL_AUTH_TOKEN = AUTH_TOKEN;
process.env.CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

// Additional configuration
const ENABLE_PLAYGROUND = true;
const ENABLE_INTROSPECTION = true;

/**
 * Main server initialization function
 */
async function main() {
  console.log('🌐 Starting GraphQL Mesh with Apollo integration...');
  
  try {
    // Load Mesh configuration from .meshrc.yml
    console.log('📂 Loading Mesh configuration...');
    const meshConfig = await findAndParseConfig();
    
    // Initialize the GraphQL Mesh instance
    console.log('⚙️ Initializing GraphQL Mesh...');
    const { schema, contextBuilder, execute, subscribe } = await getMesh(meshConfig);
    
    // Setup Express app
    const app = express();
    app.use(cors({
      origin: '*',
      credentials: true
    }));
    
    // Add health check endpoint
    app.get('/healthcheck', (req, res) => {
      res.status(200).send('OK');
    });
    
    // Create Apollo Server with the Mesh schema
    console.log('🚀 Creating Apollo Server with Mesh schema...');
    const apolloServer = new ApolloServer({
      schema,
      context: async ({ req }) => {
        // Extract token from headers for auth
        const token = req?.headers?.authorization || '';
        
        // Build context using Mesh's contextBuilder
        const meshContext = await contextBuilder({
          req,
          headers: req?.headers || {}
        });
        
        // Add additional context data
        return {
          ...meshContext,
          auth: {
            token,
            isAuthenticated: !!token
          },
          // Forward headers to downstream services
          headers: req?.headers || {}
        };
      },
      // Enable features based on configuration
      introspection: ENABLE_INTROSPECTION,
      playground: ENABLE_PLAYGROUND
    });
    
    // Start Apollo Server
    await apolloServer.start();
    
    // Apply Apollo middleware to Express
    apolloServer.applyMiddleware({ 
      app, 
      path: '/graphql',
      cors: {
        origin: '*',
        credentials: true
      }
    });
    
    // Create HTTP server for WebSockets
    const httpServer = createServer(app);
    
    // Setup WebSocket server for subscriptions
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql'
    });
    
    // Configure WebSocket server with schema
    useServer(
      {
        schema,
        execute,
        subscribe,
        context: async (ctx) => {
          // Extract authorization from connection params
          const token = ctx.connectionParams?.authorization || '';
          
          // Build context with Mesh contextBuilder
          const meshContext = await contextBuilder({
            headers: ctx.connectionParams || {}
          });
          
          // Return the final context
          return {
            ...meshContext,
            auth: {
              token,
              isAuthenticated: !!token
            },
            headers: ctx.connectionParams || {}
          };
        }
      },
      wsServer
    );
    
    // Start HTTP server
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 GraphQL API Gateway running at http://0.0.0.0:${PORT}/graphql`);
      console.log(`🔌 WebSocket server running at ws://0.0.0.0:${PORT}/graphql`);
      console.log(`🔍 GraphQL Playground ${ENABLE_PLAYGROUND ? 'enabled' : 'disabled'}`);
      console.log(`ℹ️ Introspection ${ENABLE_INTROSPECTION ? 'enabled' : 'disabled'}`);
    });
  } catch (error) {
    console.error('❌ Error starting GraphQL Mesh + Apollo server:', error);
    console.error(error.stack || error.message || error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error('🔥 Fatal error:', error);
  console.error(error.stack || error.message || error);
  process.exit(1);
});