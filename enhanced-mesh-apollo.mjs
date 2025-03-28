/**
 * Enhanced Apollo Mesh Server (ESM version)
 * 
 * This version utilizes the @graphql-mesh v0.x API and provides a simple Apollo Server 
 * with GraphQL Mesh integration.
 */

import { ApolloServer } from 'apollo-server';
import { createMeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh } from '@graphql-mesh/runtime';
import { processConfig } from '@graphql-mesh/config';
import { PubSub } from 'graphql-subscriptions';
import { print } from 'graphql';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Custom implementation to replace processImport since it's not exported
async function processImport(modulePath, baseDir) {
  try {
    const absolutePath = path.isAbsolute(modulePath) 
      ? modulePath 
      : path.resolve(baseDir, modulePath);
    console.log(`Loading module from: ${absolutePath}`);
    const module = await import(absolutePath);
    return module.default || module;
  } catch (error) {
    console.error(`Error importing module ${modulePath}:`, error);
    throw error;
  }
}

// Get directory name in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment configuration
const ENV = {
  PORT: process.env.PORT || 5003,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_ENDPOINT: process.env.GRAPHQL_API_ENDPOINT || 'http://localhost:3003/graphql',
  DEBUG: process.env.DEBUG_MODE === 'true'
};

// Set global DEBUG flag for mesh verbose logging if needed
if (ENV.DEBUG) {
  process.env.DEBUG = '1';
}

/**
 * Create Apollo server with Mesh integration
 */
async function createApolloServer() {
  console.log(chalk.blue('📊 Starting Apollo Server with GraphQL Mesh...'));
  
  try {
    // Find and load mesh configuration
    const meshConfigFile = path.join(__dirname, '.meshrc.yml');
    const configContent = await fs.readFile(meshConfigFile, 'utf8');
    
    // Create a simple mesh config to avoid processConfig issues
    const simpleMeshConfig = {
      sources: [
        {
          name: 'PostGraphileAPI',
          handler: {
            graphql: {
              endpoint: ENV.API_ENDPOINT
            }
          }
        }
      ],
      additionalResolvers: ['./mesh-resolvers.mjs']
    };
    
    // Update API endpoint for logging
    console.log(chalk.gray(`🔌 Using API endpoint: ${ENV.API_ENDPOINT}`));
    
    // Get resolvers
    let additionalResolvers = {};
    console.log(chalk.gray(`🧩 Loading resolvers from ./mesh-resolvers.mjs...`));
    try {
      const resolverModule = await processImport('./mesh-resolvers.mjs', __dirname);
      additionalResolvers = resolverModule;
    } catch (error) {
      console.error(chalk.yellow(`⚠️ Could not load resolvers:`, error.message));
      console.log(chalk.yellow(`⚠️ Continuing with empty resolvers`));
    }
    
    // Create mesh instance with simplified config
    console.log(chalk.gray(`🔄 Building GraphQL Mesh...`));
    const { schema, contextBuilder } = await getMesh({
      ...simpleMeshConfig,
      additionalResolvers
    });
    
    // Create new PubSub for subscriptions if needed
    const pubsub = new PubSub();
    
    // Create Apollo Server with the mesh schema
    const server = new ApolloServer({
      schema,
      context: async ({ req }) => {
        // Get authorization token
        const token = req?.headers?.authorization || '';
        
        // Get mesh context
        const meshContext = await contextBuilder({
          req,
          headers: req?.headers || {},
        });
        
        // Return enhanced context with additional client fields
        return {
          ...meshContext,
          token,
          pubsub,
          clientInfo: {
            version: process.env.CLIENT_VERSION || '1.0.0',
            platform: process.env.CLIENT_PLATFORM || 'web'
          }
        };
      },
      debug: ENV.NODE_ENV === 'development',
      introspection: true,
      playground: {
        title: 'HugMeNow Apollo Mesh Gateway',
        settings: {
          'request.credentials': 'include',
          'schema.polling.enable': true
        }
      },
      formatError: (error) => {
        // Log errors for debugging
        console.error(chalk.red('⚠️ GraphQL Error:'), error.message);
        
        // Return formatted error
        return {
          message: error.message,
          path: error.path,
          extensions: {
            code: error.extensions?.code || 'ERROR',
            path: error.path
          }
        };
      }
    });
    
    return server;
  } catch (error) {
    console.error(chalk.red('❌ Error creating Apollo server:'), error);
    throw error;
  }
}

/**
 * Start the server
 */
async function startServer() {
  try {
    // Create Apollo server with Mesh integration
    const server = await createApolloServer();
    
    // Start the server
    const { url } = await server.listen({ 
      port: ENV.PORT,
      host: '0.0.0.0' 
    });
    
    console.log(chalk.green(`🚀 Apollo Mesh Gateway running at ${url}`));
    console.log(chalk.green(`🔗 Connected to upstream API at ${ENV.API_ENDPOINT}`));
    
    // Handle graceful shutdown
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, async () => {
        console.log(chalk.yellow(`\n🛑 Received ${signal}, shutting down...`));
        await server.stop();
        console.log(chalk.yellow('🛑 Server stopped gracefully'));
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(chalk.red('❌ Failed to start Apollo Mesh Gateway:'), error);
    process.exit(1);
  }
}

// Start the server
startServer().catch(error => {
  console.error(chalk.red('💥 Fatal error:'), error);
  process.exit(1);
});