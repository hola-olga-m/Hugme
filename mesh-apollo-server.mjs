/**
 * GraphQL Mesh + Apollo Server Integration (ESM version)
 * This file configures Apollo Server to work with GraphQL Mesh
 */

import { getMesh } from '@graphql-mesh/runtime';
import { processConfig } from '@graphql-mesh/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Port configuration - use environment variable or default
const PORT = process.env.PORT || 5001;

// API Endpoint configuration
const API_ENDPOINT = process.env.GRAPHQL_API_ENDPOINT || 'http://localhost:3003/graphql';

// Authentication token setting
const AUTH_TOKEN = process.env.GRAPHQL_AUTH_TOKEN || '';

// Client information
const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';
const CLIENT_PLATFORM = process.env.CLIENT_PLATFORM || 'web';
const CLIENT_FEATURES = process.env.CLIENT_FEATURES || 'mood-tracking,friend-moods';

// Set environment variables for Mesh configuration
process.env.GRAPHQL_AUTH_TOKEN = AUTH_TOKEN;
process.env.CLIENT_VERSION = CLIENT_VERSION;
process.env.CLIENT_PLATFORM = CLIENT_PLATFORM;
process.env.CLIENT_FEATURES = CLIENT_FEATURES;
process.env.API_ENDPOINT = API_ENDPOINT;

/**
 * Main server initialization function
 */
async function main() {
  console.log('🌐 Starting GraphQL Mesh with Apollo integration...');
  console.log(`Using API endpoint: ${API_ENDPOINT}`);
  
  try {
    // Load and parse Mesh configuration from .meshrc.yml
    console.log('📂 Loading Mesh configuration from .meshrc.yml...');
    
    // Directly load the configuration from file
    const configFile = join(__dirname, '.meshrc.yml');
    const configContent = fs.readFileSync(configFile, 'utf8');
    const rawConfig = yaml.load(configContent);
    
    // Process the config
    const meshConfig = await processConfig({
      config: rawConfig,
      rootDir: __dirname,
      cwd: __dirname,
      additionalEnv: {
        API_ENDPOINT,
        CLIENT_VERSION,
        CLIENT_FEATURES: CLIENT_FEATURES.split(','),
        CLIENT_PLATFORM
      }
    });
    
    // Initialize the GraphQL Mesh instance
    console.log('⚙️ Initializing GraphQL Mesh...');
    const { schema, contextBuilder } = await getMesh(meshConfig);
    
    // Create Apollo Server with the Mesh schema
    console.log('🚀 Creating Apollo Server with Mesh schema...');
    const apolloServer = new ApolloServer({
      schema,
      introspection: true,
    });
    
    // Start Apollo Server
    await apolloServer.start();
    
    // Create express app
    const app = express();
    
    // Apply middleware
    app.use(
      '/graphql',
      cors({
        origin: '*',
        credentials: true
      }),
      bodyParser.json(),
      expressMiddleware(apolloServer, {
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
            clientInfo: {
              version: CLIENT_VERSION,
              platform: CLIENT_PLATFORM,
              features: CLIENT_FEATURES.split(',')
            }
          };
        }
      })
    );
    
    // Start express app
    console.log(`🔄 Starting Apollo Server on port ${PORT}...`);
    const server = app.listen({ port: PORT, host: '0.0.0.0' }, () => {
      console.log(`🚀 GraphQL API Gateway running at http://0.0.0.0:${PORT}/graphql`);
      console.log(`📝 Proxying API requests to ${API_ENDPOINT}`);
      console.log(`✨ Enhanced GraphQL schema with Mesh transformations`);
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