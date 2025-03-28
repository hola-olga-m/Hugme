/**
 * GraphQL Mesh + Apollo Server Integration
 * This file configures Apollo Server to work with GraphQL Mesh
 */

import { getMesh } from '@graphql-mesh/runtime';
import { findAndParseConfig } from '@graphql-mesh/config';
import { ApolloServer } from 'apollo-server';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';
import express from 'express';
import cors from 'cors';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { createYoga } from 'graphql-yoga';

// Port configuration
const PORT = process.env.PORT || 5000;

// Authentication token
const AUTH_TOKEN = process.env.GRAPHQL_AUTH_TOKEN || '';

// Set environment variables for Mesh
process.env.GRAPHQL_AUTH_TOKEN = AUTH_TOKEN;
process.env.CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

async function main() {
  console.log('🌐 Starting GraphQL Mesh with Apollo integration...');
  
  try {
    // Get Mesh configuration
    const meshConfig = await findAndParseConfig();
    
    // Initialize Mesh
    console.log('⚙️ Initializing GraphQL Mesh...');
    const { schema, contextBuilder } = await getMesh(meshConfig);
    
    // Create Express app
    const app = express();
    app.use(cors());
    
    // Create Apollo Server
    console.log('🚀 Creating Apollo Server...');
    const apolloServer = new ApolloServer({
      schema,
      context: async ({ req }) => {
        // Get Mesh context
        const contextData = await contextBuilder({
          req,
          headers: req.headers
        });
        
        // Add user authentication data
        return {
          ...contextData,
          auth: {
            token: req.headers.authorization || '',
            isAuthenticated: !!req.headers.authorization,
          }
        };
      },
      introspection: true,
      playground: true,
    });
    
    // Start Apollo Server
    await apolloServer.start();
    
    // Apply middleware to Express
    apolloServer.applyMiddleware({ 
      app, 
      path: '/graphql',
      cors: {
        origin: '*',
        credentials: true,
      } 
    });
    
    // Create HTTP server for WebSockets support
    const httpServer = createServer(app);
    
    // Add WebSocket support
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    });
    
    // Configure WebSocket server with schema
    useServer(
      {
        schema,
        context: async (ctx) => {
          return await contextBuilder({
            headers: ctx.connectionParams,
          });
        },
      },
      wsServer
    );
    
    // Start HTTP server
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 GraphQL API Gateway running at http://0.0.0.0:${PORT}/graphql`);
      console.log(`🔌 WebSocket server running at ws://0.0.0.0:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('❌ Error starting GraphQL Mesh + Apollo server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error('🔥 Fatal error:', error);
  process.exit(1);
});