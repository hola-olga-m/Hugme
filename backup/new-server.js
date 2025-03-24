/**
 * HugMood Main Server
 * 
 * A fully GraphQL-based implementation that completely replaces the WebSocket approach.
 * This server acts as the entry point for the application, starting all necessary services.
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const { createServer } = require('http');
const { createYoga } = require('graphql-yoga');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');
const { startMeshGateway } = require('./mesh-sdk-gateway');
require('dotenv').config();

// Create a PubSub instance for handling real-time events
const pubsub = new PubSub();

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'hugmood-secret-key';

// Create the Express app
const app = express();

// Configure CORS
const corsOptions = {
  origin: '*', // Or specify allowed origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

// Apply middleware
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(compression());
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false 
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database and services
async function initializeServices() {
  console.log('Initializing services...');
  
  try {
    // Initialize database connection
    const { testConnection, syncModels } = require('./src/config/database');
    await testConnection();
    console.log('Database connection has been established successfully.');
    
    // Sync models with database
    await syncModels();
    console.log('Models synchronized with database.');
    
    // Start GraphQL Mesh Gateway if ENABLE_MESH is true
    if (process.env.ENABLE_MESH === 'true') {
      try {
        await startMeshGateway();
        console.log('GraphQL Mesh Gateway started successfully.');
      } catch (error) {
        console.error('Failed to start GraphQL Mesh Gateway:', error);
        console.log('Continuing without Mesh Gateway...');
      }
    } else {
      console.log('GraphQL Mesh Gateway disabled by configuration.');
      
      // Start standalone GraphQL server using Yoga
      await startYogaServer();
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing services:', error);
    throw error;
  }
}

// Start GraphQL server using Yoga
async function startYogaServer() {
  try {
    // Get the GraphQL schema from file
    let typeDefs;
    try {
      typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');
    } catch (err) {
      console.error('Error reading schema.graphql:', err);
      throw new Error('Schema file not found');
    }
    
    // Import resolvers
    const resolvers = require('./src/graphql/resolvers');
    
    // Create executable schema
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    
    // Extract user from token for context
    const getUserFromToken = async (req) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return null;
      }
      
      try {
        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user from database
        const User = require('./src/models/User');
        return await User.findByPk(decoded.userId);
      } catch (error) {
        console.error('Token verification error:', error);
        return null;
      }
    };
    
    // Create Yoga instance
    const yoga = createYoga({
      schema,
      context: async ({ req }) => {
        const user = await getUserFromToken(req);
        return { user, pubsub };
      },
      graphiql: {
        defaultQuery: `
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
    
    console.log('GraphQL Yoga server started successfully.');
    return true;
  } catch (error) {
    console.error('Error starting GraphQL Yoga server:', error);
    throw error;
  }
}

// Start the server
async function startServer() {
  try {
    // Initialize services
    await initializeServices();
    
    // Create HTTP server
    const httpServer = createServer(app);
    
    // Start server
    const PORT = 4000; // Using 4000 for the GraphQL server to avoid conflict with WebSocket server
    const HOST = '0.0.0.0'; // Binding to all interfaces to ensure accessibility
    httpServer.listen(PORT, HOST, () => {
      console.log(`GraphQL server running on http://${HOST}:${PORT}`);
    });
    
    return httpServer;
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
}

// Start the server if this script is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };