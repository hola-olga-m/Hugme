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
    
    // Create a custom executor that handles mock data
    const createExecutor = (originalExecute) => {
      return async (document, variables, context, operationName) => {
        // Check if using mock authentication
        if (context?.mockAuth) {
          const operationText = document.loc?.source?.body || '';
          
          // Handle mock operations based on query/mutation type
          if (operationText.includes('userMoods') && variables?.userId === 'mock-user-123') {
            console.log(chalk.yellow('📝 Mock Auth: Intercepting userMoods query'));
            console.log(chalk.green('📊 Mock Auth: Returning mock data for userMoods query'));
            return {
              data: {
                userMoods: [
                  {
                    id: 'mock-mood-1',
                    mood: 'happy',
                    intensity: 8,
                    message: 'This is a mock mood for testing',
                    isPublic: true,
                    createdAt: new Date().toISOString(),
                    userId: 'mock-user-123'
                  },
                  {
                    id: 'mock-mood-2', 
                    mood: 'excited',
                    intensity: 9,
                    message: 'Testing with mock data',
                    isPublic: false,
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    userId: 'mock-user-123'
                  }
                ]
              }
            };
          }
          
          if (operationText.includes('createMood') && 
              variables?.input?.mood?.userId === 'mock-user-123') {
            console.log(chalk.yellow('📝 Mock Auth: Intercepting createMood mutation'));
            const { mood } = variables.input;
            return {
              data: {
                createMood: {
                  mood: {
                    id: `mock-mood-${Date.now()}`,
                    mood: mood.mood,
                    intensity: mood.intensity,
                    message: mood.message,
                    isPublic: mood.isPublic,
                    createdAt: new Date().toISOString(),
                    userId: 'mock-user-123'
                  }
                }
              }
            };
          }
        }
        
        // For non-mock requests, use the original executor
        return originalExecute(document, variables, context, operationName);
      };
    };
    
    // Create custom executor with mock support
    const customExecute = createExecutor(execute);

    // Create Yoga server (modern GraphQL server with WebSockets support)
    const yoga = createYoga({
      schema,
      execute: customExecute,
      context: async (req) => {
        // Get authorization header
        const authHeader = req.request.headers.get('authorization');
        
        // Check for mock authentication token
        const isMockAuth = authHeader && authHeader.includes('mock-auth-token-for-testing');
        
        // Create mock user if using mock auth token
        const mockUser = isMockAuth ? {
          id: 'mock-user-123',
          username: 'mockuser',
          email: 'mock@example.com',
          authenticated: true
        } : null;
        
        // If using mock auth, create a complete context with mock data
        if (isMockAuth) {
          console.log(chalk.yellow('⚠️ Using mock authentication for testing'));
          
          return {
            ...contextBuilder(req),
            headers: req.request.headers,
            request: req.request,
            user: mockUser,
            mockAuth: true
          };
        }
        
        // Regular authentication flow for non-mock requests
        return {
          ...contextBuilder(req),
          headers: req.request.headers,
          request: req.request
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