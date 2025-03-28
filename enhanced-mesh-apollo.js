/**
 * Enhanced GraphQL Mesh + Apollo Server Integration
 * 
 * This file provides a simplified but powerful integration between
 * Apollo Server and GraphQL Mesh with advanced features:
 * 
 * 1. Schema transformations (field naming, types)
 * 2. Virtual fields and resolvers
 * 3. Caching and performance optimizations
 * 4. Enhanced error handling and logging
 */

const { createMeshHTTPHandler } = require('@graphql-mesh/http');
const { ApolloServer } = require('apollo-server');
const { buildClientSchema, printSchema } = require('graphql');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const yaml = require('js-yaml');

// Environment configuration
const ENV = {
  PORT: process.env.PORT || 5003,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_ENDPOINT: process.env.GRAPHQL_API_ENDPOINT || 'http://localhost:3003/graphql',
  AUTH_TOKEN: process.env.GRAPHQL_AUTH_TOKEN || '',
  CLIENT_VERSION: process.env.CLIENT_VERSION || '2.0.0',
  CLIENT_PLATFORM: process.env.CLIENT_PLATFORM || 'web',
  CLIENT_FEATURES: process.env.CLIENT_FEATURES || 'mood-tracking,friend-moods,theme-customization,mood-streaks',
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '300', 10),
  DISABLE_CACHE: process.env.DISABLE_CACHE === 'true'
};

// Set environment variables for Mesh configuration
Object.entries(ENV).forEach(([key, value]) => {
  process.env[key] = value.toString();
});

/**
 * Load the Mesh configuration file
 */
function loadMeshConfig() {
  console.log(chalk.cyan('📂 Loading Mesh configuration from .meshrc.yml...'));
  
  try {
    const configPath = path.join(__dirname, '.meshrc.yml');
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(fileContents);
    
    // Inject environment variables
    if (config.sources && config.sources.length > 0) {
      config.sources[0].endpoint = ENV.API_ENDPOINT;
    }
    
    return config;
  } catch (error) {
    console.error(chalk.red('❌ Error loading Mesh configuration:'), error.message);
    throw new Error(`Failed to load Mesh configuration: ${error.message}`);
  }
}

/**
 * Create custom resolvers for virtual fields and client-specific functionality
 */
function createCustomResolvers() {
  // Helper functions for logging and error handling
  const logResolver = (path, args = {}) => {
    const argStr = Object.keys(args).length ? JSON.stringify(args) : '';
    console.log(chalk.gray(`[Mesh] Resolving ${path}${argStr ? ` with args: ${argStr}` : ''}`));
  };

  // Error handler with improved error categorization
  const handleError = (path, error) => {
    const isNetworkError = error.message.includes('ECONNREFUSED') || 
                          error.message.includes('ETIMEDOUT') ||
                          error.message.includes('fetch failed');
    
    const isAuthError = error.message.includes('unauthorized') || 
                      error.message.includes('forbidden') ||
                      error.message.includes('not authenticated');
    
    const errorCategory = isNetworkError ? 'NETWORK_ERROR' : 
                        isAuthError ? 'AUTHENTICATION_ERROR' : 'EXECUTION_ERROR';
    
    console.error(chalk.red(`[Mesh] Error in ${path} (${errorCategory}): ${error.message}`));
    
    return null;
  };

  return {
    Query: {
      // Client information field
      clientInfo: () => {
        logResolver('Query.clientInfo');
        return {
          version: ENV.CLIENT_VERSION,
          buildDate: new Date().toISOString(),
          platform: ENV.CLIENT_PLATFORM,
          deviceInfo: 'HugMeNow Enhanced Mesh Gateway',
          features: ENV.CLIENT_FEATURES.split(',')
        };
      }
    }
  };
}

/**
 * Create and start the Apollo Server with Mesh handler
 */
async function startServer() {
  console.log(chalk.blue('🌐 Starting Enhanced GraphQL Mesh with Apollo integration...'));
  console.log(chalk.gray(`Environment: ${ENV.NODE_ENV}`));
  console.log(chalk.gray(`Using API endpoint: ${ENV.API_ENDPOINT}`));
  
  try {
    // Load mesh configuration
    const meshConfig = loadMeshConfig();
    
    // Create Mesh HTTP handler
    const { getBuiltMesh } = await createMeshHTTPHandler({
      sources: meshConfig.sources,
      transforms: meshConfig.transforms,
      additionalTypeDefs: meshConfig.additionalTypeDefs,
      additionalResolvers: createCustomResolvers(),
      cache: meshConfig.cache,
      debug: ENV.NODE_ENV === 'development'
    });
    
    // Get the built mesh
    const { schema, contextBuilder, cache } = await getBuiltMesh();
    
    // Create Apollo Server with Mesh schema
    const server = new ApolloServer({
      schema,
      context: async ({ req }) => {
        // Extract token from headers
        const token = req?.headers?.authorization || '';
        
        // Build context using Mesh's contextBuilder
        const meshContext = await contextBuilder({
          req,
          headers: req?.headers || {}
        });
        
        // Return enhanced context
        return {
          ...meshContext,
          auth: {
            token,
            isAuthenticated: !!token
          },
          clientInfo: {
            version: ENV.CLIENT_VERSION,
            platform: ENV.CLIENT_PLATFORM,
            features: ENV.CLIENT_FEATURES.split(',')
          }
        };
      },
      cors: {
        origin: '*',
        credentials: true
      },
      introspection: true,
      playground: true,
      debug: ENV.NODE_ENV === 'development',
      formatError: (error) => {
        console.error(chalk.red('🔥 GraphQL Error:'), error.message);
        
        return {
          message: error.message,
          path: error.path,
          extensions: {
            category: error.extensions?.code || 'UNKNOWN'
          }
        };
      }
    });
    
    // Start Apollo Server
    const { url } = await server.listen({ 
      port: ENV.PORT,
      host: '0.0.0.0' 
    });
    
    console.log(chalk.green(`🚀 Enhanced GraphQL API Gateway running at ${url}`));
    console.log(chalk.green(`📝 Proxying API requests to ${ENV.API_ENDPOINT}`));
    console.log(chalk.green(`✨ Enhanced GraphQL schema with Mesh transformations`));
    
    // Handle shutdown gracefully
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, async () => {
        console.log(chalk.yellow(`\n🛑 Received ${signal}, shutting down...`));
        await server.stop();
        if (cache) cache.destroy();
        console.log(chalk.yellow('🛑 Server stopped gracefully'));
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(chalk.red('❌ Error starting GraphQL Mesh + Apollo server:'), error);
    process.exit(1);
  }
}

// Start the server
startServer().catch(error => {
  console.error(chalk.red('🔥 Fatal error:'), error);
  process.exit(1);
});