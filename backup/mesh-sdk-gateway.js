/**
 * HugMood GraphQL Mesh SDK Gateway
 * 
 * This script uses the GraphQL Mesh SDK to programmatically create and configure
 * a mesh gateway with advanced features.
 */

const express = require('express');
const { createServer } = require('http');
const path = require('path');
const fs = require('fs');
const { getMesh } = require('@graphql-mesh/runtime');
const { findAndParseConfig } = require('@graphql-mesh/config');
const { createYoga } = require('graphql-yoga');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// JWT secret for authentication
const JWT_SECRET = process.env.JWT_SECRET || 'hugmood-secret-key';

async function startMeshGateway() {
  console.log('Starting GraphQL Mesh Gateway...');
  
  // Create Express app
  const app = express();
  
  // Apply middleware
  app.use(cors({
    origin: '*',
    credentials: true
  }));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, 'public')));
  
  try {
    // Get Mesh configuration
    const meshConfig = await findAndParseConfig({
      dir: __dirname,
      configName: '.meshrc'
    });
    
    // Create Mesh instance
    const { execute, schema, contextBuilder } = await getMesh(meshConfig);
    
    // Create authentication function
    const getContextFromRequest = async (req) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      let user = null;
      
      if (token) {
        try {
          // Verify JWT token
          const decoded = jwt.verify(token, JWT_SECRET);
          
          // Get user data from any available source
          if (decoded.userId) {
            // In a real implementation, you would fetch user from database
            // Here we're just returning the decoded data for simplicity
            user = {
              id: decoded.userId,
              username: decoded.username,
              isAuthenticated: true
            };
          }
        } catch (error) {
          console.error('Token verification error:', error);
        }
      }
      
      // Build context from mesh and add user data
      const meshContext = await contextBuilder.build();
      
      return {
        ...meshContext,
        user,
        token
      };
    };
    
    // Create Yoga instance
    const yoga = createYoga({
      schema,
      context: async ({ req }) => getContextFromRequest(req),
      graphiql: {
        defaultQuery: /* GraphQL */ `
          query Health {
            healthCheck
          }
        `
      },
      landingPage: false,
      cors: {
        origin: '*',
        credentials: true,
      },
      multipart: true
    });
    
    // Apply Yoga middleware to Express
    app.use('/graphql', yoga);
    
    // Add health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    // Serve React app for all other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    
    // Create HTTP server
    const httpServer = createServer(app);
    
    // Start server
    const PORT = process.env.PORT || 5000;
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
    
    console.log(`🚀 GraphQL Mesh Gateway running at http://localhost:${PORT}/graphql`);
    
    return { app, httpServer };
  } catch (error) {
    console.error('Error starting GraphQL Mesh Gateway:', error);
    throw error;
  }
}

// If this script is run directly, start the server
if (require.main === module) {
  startMeshGateway().catch(error => {
    console.error('Failed to start mesh gateway:', error);
    process.exit(1);
  });
}

module.exports = { startMeshGateway };