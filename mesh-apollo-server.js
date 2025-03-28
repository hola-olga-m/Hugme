/**
 * Enhanced GraphQL Mesh + Apollo Server Integration
 * 
 * This file configures Apollo Server to work with GraphQL Mesh,
 * providing a unified API gateway with advanced transformation capabilities:
 * 
 * 1. Schema normalization (camelCase, PascalCase)
 * 2. Field and type renaming for client compatibility
 * 3. Virtual fields and resolvers for enhanced functionality
 * 4. Caching with optimized settings
 * 5. Error categorization and handling
 */

import { getMesh } from '@graphql-mesh/runtime';
import { processConfig } from '@graphql-mesh/config';
import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import chalk from 'chalk';
// Import LiveQuery plugin (installed via @graphql-mesh/plugin-live-query)
import { LiveQueryPlugin } from '@graphql-mesh/plugin-live-query';

// Getting current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment configuration
const ENV = {
  // Server configuration
  PORT: process.env.PORT || 5003,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // API Endpoint configuration with fallback
  API_ENDPOINT: process.env.GRAPHQL_API_ENDPOINT || 'http://localhost:3003/graphql',
  
  // Authentication settings
  AUTH_TOKEN: process.env.GRAPHQL_AUTH_TOKEN || '',
  
  // Client information
  CLIENT_VERSION: process.env.CLIENT_VERSION || '2.0.0',
  CLIENT_PLATFORM: process.env.CLIENT_PLATFORM || 'web',
  CLIENT_FEATURES: process.env.CLIENT_FEATURES || 'mood-tracking,friend-moods,theme-customization',
  
  // Cache settings
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '300', 10),
  DISABLE_CACHE: process.env.DISABLE_CACHE === 'true'
};

// Set environment variables for Mesh configuration
// This ensures the mesh config has access to these values
Object.entries(ENV).forEach(([key, value]) => {
  process.env[key] = value;
});

/**
 * Main server initialization function
 */
async function main() {
  console.log(chalk.blue('🌐 Starting Enhanced GraphQL Mesh with Apollo integration...'));
  console.log(chalk.gray(`Environment: ${ENV.NODE_ENV}`));
  console.log(chalk.gray(`Using API endpoint: ${ENV.API_ENDPOINT}`));
  
  try {
    // Load and parse Mesh configuration from .meshrc.yml
    console.log(chalk.cyan('📂 Loading Mesh configuration from .meshrc.yml...'));
    
    // Load the mesh configuration file
    const meshConfigFile = path.join(__dirname, '.meshrc.yml');
    const configContent = await fs.readFile(meshConfigFile, 'utf8');
    
    // Process the configuration with the correct API function
    const meshConfig = await processConfig({
      config: configContent,
      dir: __dirname,
      // Provide runtime values to the mesh configuration
      additionalEnv: {
        API_ENDPOINT: ENV.API_ENDPOINT,
        CLIENT_VERSION: ENV.CLIENT_VERSION,
        CLIENT_FEATURES: ENV.CLIENT_FEATURES.split(','),
        CLIENT_PLATFORM: ENV.CLIENT_PLATFORM,
        PORT: ENV.PORT.toString()
      }
    });
    
    // Initialize the GraphQL Mesh instance with Live Query support
    console.log(chalk.cyan('⚙️ Initializing GraphQL Mesh with Live Query support...'));
    
    // Register Live Query plugin before initializing the mesh
    if (!meshConfig.plugins) {
      meshConfig.plugins = [];
    }
    
    // Add LiveQuery plugin if not already added in the config
    const hasLiveQueryPlugin = meshConfig.plugins.some(p => 
      typeof p === 'object' && p.liveQuery !== undefined
    );
    
    if (!hasLiveQueryPlugin) {
      console.log(chalk.cyan('📡 Adding Live Query plugin to Mesh configuration...'));
      meshConfig.plugins.push({
        liveQuery: {
          // Default invalidation configuration if not specified in .meshrc.yml
          invalidations: [
            {
              field: 'Mutation.createMood',
              invalidate: ['Query.userMoods', 'Query.publicMoods']
            },
            {
              field: 'Mutation.sendHug',
              invalidate: ['Query.sentHugs', 'Query.receivedHugs']
            }
          ]
        }
      });
    }
    
    const { schema, contextBuilder, cache } = await getMesh(meshConfig);
    
    // Create Apollo Server with the Mesh schema and enhanced configuration
    console.log(chalk.cyan('🚀 Creating Apollo Server with enhanced Mesh schema...'));
    
    // Add enhanced middleware
    const enhancedSchema = applyMiddleware(
      schema,
      // Global middleware to add timing and logging
      async (resolve, root, args, context, info) => {
        const startTime = Date.now();
        const result = await resolve(root, args, context, info);
        const duration = Date.now() - startTime;
        
        // Only log operations taking more than 50ms for performance monitoring
        if (duration > 50) {
          console.log(chalk.yellow(`⏱️ [${info.parentType.name}.${info.fieldName}] took ${duration}ms`));
        }
        return result;
      }
    );
    
    // Create Apollo Server with enhanced options
    const apolloServer = new ApolloServer({
      schema: enhancedSchema,
      context: async ({ req }) => {
        // Extract token from headers for auth
        const token = req?.headers?.authorization || '';
        
        // Build context using Mesh's contextBuilder
        const meshContext = await contextBuilder({
          req,
          headers: req?.headers || {}
        });
        
        // Add additional context data for resolvers
        return {
          ...meshContext,
          // Authentication context
          auth: {
            token,
            isAuthenticated: !!token
          },
          // Client information context
          clientInfo: {
            version: ENV.CLIENT_VERSION,
            platform: ENV.CLIENT_PLATFORM,
            features: ENV.CLIENT_FEATURES.split(',')
          },
          // Request-specific metadata
          request: {
            startTime: Date.now(),
            ip: req?.ip || req?.connection?.remoteAddress,
            userAgent: req?.headers?.['user-agent'],
            language: req?.headers?.['accept-language']
          }
        };
      },
      // Enhanced server configuration
      cors: {
        origin: '*',
        credentials: true
      },
      introspection: true,
      playground: {
        settings: {
          'request.credentials': 'include',
          'editor.theme': 'dark',
          'editor.reuseHeaders': true,
          'tracing.hideTracingResponse': false
        }
      },
      // Enable caching via Apollo Cache Control
      cacheControl: {
        defaultMaxAge: ENV.CACHE_TTL,
        calculateHttpHeaders: true,
        stripFormattedExtensions: false
      },
      // Development helper options
      debug: ENV.NODE_ENV === 'development',
      formatError: (error) => {
        // Log errors for debugging
        console.error(chalk.red('🔥 GraphQL Error:'), error.message);
        if (error.originalError) {
          console.error(chalk.red('🔥 Original Error:'), error.originalError.message);
        }
        
        // Better error response for clients
        return {
          message: error.message,
          path: error.path,
          // Add a category for client-side error handling
          category: error.originalError?.name || 'GraphQLError',
          // Remove internal details in production
          ...(ENV.NODE_ENV === 'development' ? { 
            locations: error.locations,
            stack: error.originalError?.stack 
          } : {})
        };
      }
    });
    
    // Start Apollo Server
    console.log(chalk.cyan(`🔄 Starting Apollo Server on port ${ENV.PORT}...`));
    const { url } = await apolloServer.listen({ 
      port: ENV.PORT,
      host: '0.0.0.0' 
    });
    
    console.log(chalk.green(`🚀 Enhanced GraphQL API Gateway running at ${url}`));
    console.log(chalk.green(`📝 Proxying API requests to ${ENV.API_ENDPOINT}`));
    console.log(chalk.green(`✨ Enhanced GraphQL schema with Mesh transformations`));
    console.log(chalk.green(`🔧 Cache TTL: ${ENV.DISABLE_CACHE ? 'Disabled' : `${ENV.CACHE_TTL}s`}`));
    console.log(chalk.blue(`📡 Live Query support enabled - use @live directive on queries`));
    
    // Listen for process termination signals
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        console.log(chalk.yellow(`\n🛑 Received ${signal}, shutting down...`));
        // Release resources
        cache.destroy();
        apolloServer.stop().then(() => {
          console.log(chalk.yellow('🛑 Server stopped gracefully'));
          process.exit(0);
        });
      });
    });
  } catch (error) {
    console.error(chalk.red('❌ Error starting GraphQL Mesh + Apollo server:'), error);
    console.error(chalk.red(error.stack || error.message || error));
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error(chalk.red('🔥 Fatal error:'), error);
  console.error(chalk.red(error.stack || error.message || error));
  process.exit(1);
});