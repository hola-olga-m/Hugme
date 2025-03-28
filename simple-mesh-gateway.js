/**
 * Simple GraphQL Mesh Gateway for HugMeNow
 * 
 * This implementation leverages GraphQL Mesh's runtime capabilities to avoid GraphQL version conflicts
 * while still providing all the benefits of Mesh's plugin ecosystem including Live Queries.
 */

import express from 'express';
import { createYoga } from 'graphql-yoga';
import { getMesh } from '@graphql-mesh/runtime';
import { parseConfig } from '@graphql-mesh/config';
import { SERVICE_PORTS } from './gateway-config.js';
import { resolvers } from './mesh-resolvers.mjs';
import cors from 'cors';
import chalk from 'chalk';
import { printSchema } from 'graphql';
import fs from 'fs';

// Environment configuration
const PORT = process.env.PORT || SERVICE_PORTS.SIMPLE_MESH_GATEWAY || 5006;
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3003/postgraphile/graphql';

console.log(chalk.blue('🔍 Starting Simple Mesh Gateway...'));
console.log(chalk.blue(`🔗 Connecting to API at ${API_ENDPOINT}`));
console.log(chalk.blue(`🚀 Server will run at http://0.0.0.0:${PORT}/graphql`));

// Define the live query directive
const liveQueryDirective = `
directive @live on QUERY
`;

/**
 * Main function to start the gateway server
 */
async function startServer() {
  try {
    // Load mesh configuration from .meshrc.yml
    console.log(chalk.green('📦 Loading GraphQL Mesh configuration...'));
    // Parse the mesh config from the current directory
    const meshConfig = await parseConfig({
      dir: process.cwd()
    });
    
    // Override the API endpoint from the environment
    if (meshConfig.sources && meshConfig.sources.length > 0) {
      meshConfig.sources[0].handler.graphql.endpoint = API_ENDPOINT;
    }
    
    // Create mesh instance
    console.log(chalk.green('🔧 Building GraphQL Mesh...'));
    const { execute, schema, contextBuilder } = await getMesh(meshConfig);
    
    // Log schema details (for debugging)
    console.log(chalk.green('📋 Schema built successfully!'));
    console.log(chalk.blue(`   Types: ${Object.keys(schema.getTypeMap()).length}`));
    console.log(chalk.blue(`   Queries: ${Object.keys(schema.getQueryType()?.getFields() || {}).length}`));
    console.log(chalk.blue(`   Mutations: ${Object.keys(schema.getMutationType()?.getFields() || {}).length}`));
    
    // Save schema to file for debugging (optional)
    fs.writeFileSync('mesh-schema.graphql', printSchema(schema));
    console.log(chalk.green('📄 Schema saved to mesh-schema.graphql'));
    
    // Create Express app
    const app = express();
    app.use(cors());
    
    // Create Yoga server (modern GraphQL server with WebSockets support)
    const yoga = createYoga({
      schema,
      context: (req) => {
        // Get authorization header
        const authHeader = req.request.headers.get('authorization');
        
        // Check for mock authentication token
        const isMockAuth = authHeader && authHeader.includes('mock-auth-token');
        
        // Create mock user if using mock auth token
        const mockUser = isMockAuth ? {
          id: 'mock-user-123',
          username: 'mockuser',
          email: 'mock@example.com',
          authenticated: true
        } : null;
        
        // Merge context from mesh with original request
        return {
          ...contextBuilder(req),
          headers: req.request.headers,
          request: req.request,
          user: mockUser, // Add mock user to context if token is present
          mockAuth: isMockAuth // Flag to indicate mock authentication
        };
      },
      graphqlEndpoint: '/graphql',
      landingPage: true,
      maskedErrors: false,
      graphiql: {
        title: 'HugMeNow Simple Mesh Gateway',
        defaultQuery: `# Welcome to HugMeNow GraphQL API
# Try a query with @live directive for real-time updates

query PublicMoods @live {
  publicMoods(limit: 5) {
    id
    mood
    intensity
    message
    createdAt
    user {
      id
      username
    }
  }
}`,
      }
    });
    
    // Mount the GraphQL server
    app.use('/graphql', yoga);
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: process.env.CLIENT_VERSION || '2.0.0'
      });
    });
    
    // Schema endpoint for client consumption
    app.get('/schema.graphql', (req, res) => {
      res.set('Content-Type', 'text/plain');
      res.send(printSchema(schema));
    });
    
    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(chalk.green(`✅ Simple Mesh Gateway running at http://0.0.0.0:${PORT}/graphql`));
      console.log(chalk.cyan('📱 GraphiQL playground available at the same URL'));
      console.log(chalk.yellow('📡 Live Query support enabled - use @live directive on queries'));
      console.log(chalk.green('⚡ Schema available at http://0.0.0.0:${PORT}/schema.graphql'));
    });
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to start the server:'), error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Start the server
startServer();