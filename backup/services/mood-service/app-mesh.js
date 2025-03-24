/**
 * Mood Service with GraphQL Mesh
 * 
 * This service provides mood tracking, analytics, and insight generation
 * using modern GraphQL tools from The Guild
 */

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { addResolversToSchema } = require('@graphql-tools/schema');
const { applyMiddleware } = require('graphql-middleware');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const http = require('http');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

// Import resolvers
const resolvers = require('./schema/resolvers');

// Initialize Express
const app = express();
const PORT = process.env.MOOD_SERVICE_PORT || 4003;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const httpServer = http.createServer(app);

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to database at:', res.rows[0].now);
  }
});

// Initialize database tables
async function initDb() {
  try {
    // Create Mood table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Moods" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "value" VARCHAR(100) NOT NULL,
        "score" INTEGER,
        "note" TEXT,
        "isPublic" BOOLEAN DEFAULT false,
        "location" JSONB,
        "activities" TEXT[],
        "correlationData" JSONB,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create MoodStreak table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "MoodStreaks" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) UNIQUE NOT NULL,
        "currentStreak" INTEGER DEFAULT 0,
        "longestStreak" INTEGER DEFAULT 0,
        "lastRecordedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create UserActivity table (for correlations)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "UserActivities" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "activityType" VARCHAR(100) NOT NULL,
        "duration" INTEGER,
        "metadata" JSONB,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create MoodInsight table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "MoodInsights" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "type" VARCHAR(100) NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "data" JSONB,
        "priority" VARCHAR(50) DEFAULT 'medium',
        "isRead" BOOLEAN DEFAULT false,
        "expiresAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create MoodReminder table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "MoodReminders" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "time" TIME NOT NULL,
        "days" INTEGER[] DEFAULT ARRAY[0, 1, 2, 3, 4, 5, 6],
        "isEnabled" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create WellnessActivities table (for streaks)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "WellnessActivities" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "activityType" VARCHAR(100) NOT NULL,
        "relatedEntityId" VARCHAR(255),
        "metadata" JSONB,
        "streakPoints" INTEGER DEFAULT 1,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}

// Authentication middleware
const authMiddleware = async (resolve, root, args, context, info) => {
  const token = context.headers.authorization?.split(' ')[1] || '';
  let user = null;
  
  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production'
      );
      context.user = decoded;
    } catch (err) {
      console.error('Token verification error:', err.message);
    }
  }
  
  return resolve(root, args, context, info);
};

// Start the server
async function startApolloServer() {
  // Initialize database
  await initDb();
  
  // Load schema from file
  const typeDefs = loadSchemaSync(path.join(__dirname, './schema/typeDefs.graphql'), {
    loaders: [new GraphQLFileLoader()]
  });

  // Create executable schema
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers
  });
  
  // Apply global middleware
  schema = applyMiddleware(schema, authMiddleware);

  // Create Apollo Server
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        headers: req.headers,
        pool
      };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground()
    ],
    introspection: true,
  });

  // Start server
  await server.start();
  
  // Apply middleware
  server.applyMiddleware({ app, path: '/graphql' });
  
  // Start HTTP server
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  
  console.log(`🚀 Mood Service ready at http://0.0.0.0:${PORT}${server.graphqlPath}`);
  
  return { server, app };
}

// Express routes
app.get('/', (req, res) => {
  res.send('HugMood Mood Service');
});

// Health check endpoint
app.get('/health', (req, res) => {
  pool.query('SELECT NOW()', (err) => {
    if (err) {
      res.status(500).json({ 
        status: 'error', 
        message: 'Database connection error',
        error: err.message
      });
    } else {
      res.status(200).json({ 
        status: 'ok',
        service: 'Mood Service',
        timestamp: new Date().toISOString()
      });
    }
  });
});

// Start server
startApolloServer()
  .catch(err => {
    console.error('Failed to start server:', err);
  });

module.exports = { app, startApolloServer };