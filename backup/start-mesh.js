/**
 * GraphQL Mesh Gateway Startup Script
 * This script starts the GraphQL Mesh Gateway, which unifies all microservices
 * and provides a single GraphQL endpoint with advanced features.
 */

const express = require('express');
const { createServer } = require('http');
const path = require('path');
const cors = require('cors');
const { json } = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema, GraphQLSchema } = require('graphql');
const fetch = require('cross-fetch');
const fs = require('fs');
const { exec, spawn } = require('child_process');
require('dotenv').config();

// Configuration
const PORT = process.env.MESH_PORT || 4000;
const HOST = '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production';

// Initialize auth middleware
const authMiddleware = (req, res, next) => {
  // Extract token from authorization header
  const authHeader = req.headers.authorization;
  let user = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token
      user = jwt.verify(token, JWT_SECRET);
      req.user = user;
      req.token = token;
    } catch (error) {
      console.error('Token verification error:', error.message);
    }
  }
  
  next();
};

// Start the Gateway server
async function startServer() {
  try {
    console.log('🔄 Starting GraphQL Mesh Gateway...');
    
    // Create an Express app to host the gateway
    const app = express();
    const httpServer = createServer(app);

    // Apply middleware
    app.use(cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      optionsSuccessStatus: 204
    }));
    
    app.use(json({ limit: '5mb' }));
    app.use(authMiddleware);
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        service: 'GraphQL Mesh Gateway',
        timestamp: new Date().toISOString()
      });
    });
    
    // Static files and playground
    app.use('/playground', express.static(path.join(__dirname, 'public/playground')));
    
    // Start the Mesh CLI process
    const startMeshCLI = () => {
      return new Promise((resolve, reject) => {
        // Check if .meshrc.yaml exists
        if (!fs.existsSync(path.join(__dirname, '.meshrc.yaml'))) {
          return reject(new Error('.meshrc.yaml file not found'));
        }
        
        console.log('Starting GraphQL Mesh CLI process...');
        
        const meshProcess = spawn(
          'npx', 
          ['@graphql-mesh/cli', 'serve'], 
          {
            stdio: 'inherit',
            env: {
              ...process.env,
              MESH_LOG_LEVEL: 'info'
            }
          }
        );
        
        meshProcess.on('error', (error) => {
          console.error('Failed to start Mesh CLI process:', error.message);
          reject(error);
        });
        
        // Listen for process exit
        meshProcess.on('exit', (code) => {
          if (code !== 0) {
            console.error(`Mesh CLI process exited with code ${code}`);
            reject(new Error(`Mesh CLI process exited with code ${code}`));
          }
        });
        
        // Set a timeout to wait for the Mesh CLI to start up
        setTimeout(() => {
          console.log('Mesh CLI process is running.');
          resolve(meshProcess);
        }, 2000);
        
        // Handle process signals
        process.on('SIGINT', () => {
          console.log('SIGINT received, shutting down GraphQL Mesh CLI...');
          meshProcess.kill('SIGINT');
        });
        
        process.on('SIGTERM', () => {
          console.log('SIGTERM received, shutting down GraphQL Mesh CLI...');
          meshProcess.kill('SIGTERM');
        });
      });
    };
    
    // Forward GraphQL requests to Mesh CLI
    app.use('/graphql', async (req, res) => {
      try {
        // Forward the request to the Mesh CLI GraphQL endpoint
        const meshResponse = await fetch('http://localhost:4000/graphql', {
          method: req.method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...req.headers,
            host: 'localhost:4000'
          },
          body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
        });
        
        // Get the response data
        const contentType = meshResponse.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await meshResponse.json();
        } else {
          data = await meshResponse.text();
        }
        
        // Set headers from response
        meshResponse.headers.forEach((value, name) => {
          res.setHeader(name, value);
        });
        
        // Send the response
        res.status(meshResponse.status).send(data);
      } catch (error) {
        console.error('Error forwarding request to Mesh CLI:', error);
        res.status(500).json({
          errors: [{
            message: 'Internal Server Error',
            extensions: {
              code: 'INTERNAL_SERVER_ERROR'
            }
          }]
        });
      }
    });
    
    // Start the server
    httpServer.listen(PORT, HOST, async () => {
      console.log(`🚀 GraphQL Mesh Gateway server started at http://${HOST}:${PORT}`);
      console.log(`🔍 GraphQL Playground available at http://${HOST}:${PORT}/playground`);
      
      try {
        // Start Mesh CLI process
        const meshProcess = await startMeshCLI();
        console.log('🚀 GraphQL Mesh Gateway is fully initialized.');
      } catch (error) {
        console.error('Failed to start Mesh CLI:', error);
      }
    });
    
    return { httpServer, app };
  } catch (error) {
    console.error('Failed to start GraphQL Mesh Gateway server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer };