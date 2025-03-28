/**
 * GraphQL Mesh + Apollo Server Integration
 * This file configures Apollo Server to work with GraphQL Mesh
 * Using a simplified approach that avoids WebSocket issues
 */

import { getMesh } from '@graphql-mesh/runtime';
import { parseConfig } from '@graphql-mesh/config';
import { ApolloServer } from 'apollo-server';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Getting current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Port configuration - use environment variable or default
const PORT = process.env.PORT || 5000;

// Authentication token setting
const AUTH_TOKEN = process.env.GRAPHQL_AUTH_TOKEN || '';

// Set environment variables for Mesh configuration
process.env.GRAPHQL_AUTH_TOKEN = AUTH_TOKEN;
process.env.CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

/**
 * Main server initialization function
 */
async function main() {
  console.log('🌐 Starting GraphQL Mesh with Apollo integration...');
  
  try {
    // Load and parse Mesh configuration from .meshrc.yml
    console.log('📂 Loading Mesh configuration...');
    const meshConfigPath = path.resolve(__dirname, '.meshrc.yml');
    const configYml = fs.readFileSync(meshConfigPath, 'utf8');
    
    // Parse Mesh configuration 
    const meshConfig = await parseConfig({
      cwd: __dirname,
      sources: [{ name: 'mesh', config: configYml }]
    });
    
    // Initialize the GraphQL Mesh instance
    console.log('⚙️ Initializing GraphQL Mesh...');
    const { schema, contextBuilder } = await getMesh(meshConfig);
    
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
          }
        };
      },
      // Server configuration
      cors: {
        origin: '*',
        credentials: true
      },
      introspection: true,
      playground: true
    });
    
    // Start Apollo Server
    console.log(`🔄 Starting Apollo Server on port ${PORT}...`);
    const { url } = await apolloServer.listen({ 
      port: PORT,
      host: '0.0.0.0' 
    });
    
    console.log(`🚀 GraphQL API Gateway running at ${url}`);
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