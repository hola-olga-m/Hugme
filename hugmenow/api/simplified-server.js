/**
 * Simplified NestJS API Server
 * 
 * This is a standalone Express server that provides a basic REST API
 * and GraphQL endpoint using Apollo Server Express.
 */

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

// Constants
const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL;

// Create Express app
const app = express();

// Configure CORS
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization, Accept-Protocol, Connection, X-Protocol-Hint, X-Client-Version, apollo-require-preflight, x-apollo-operation-name',
  exposedHeaders: 'Authorization, Accept-Protocol, X-Protocol-Used',
}));

// Body parser middleware
app.use(bodyParser.json());

// Basic request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Create PostgreSQL Pool
const pgPool = new Pool({
  connectionString: DATABASE_URL,
});

// Basic schema definition
const typeDefs = gql`
  type Query {
    hello: String
    dbTest: String
    users: [User]
  }
  
  type User {
    id: ID
    email: String
    username: String
    created_at: String
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from HugMeNow GraphQL API!',
    dbTest: async () => {
      try {
        const result = await pgPool.query('SELECT NOW() as time');
        return `Database is working: ${result.rows[0].time}`;
      } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database connection failed');
      }
    },
    users: async () => {
      try {
        const result = await pgPool.query('SELECT * FROM users LIMIT 10');
        return result.rows;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
      }
    }
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint to check database connection
app.get('/db-status', async (req, res) => {
  try {
    const result = await pgPool.query('SELECT NOW() as time');
    res.json({
      status: 'connected',
      timestamp: result.rows[0].time,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to connect to database',
      error: error.message,
    });
  }
});

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    // Extract auth token from request if needed
    const token = req.headers.authorization || '';
    return { token };
  }
});

// Start Apollo Server and apply middleware
async function startServer() {
  await server.start();
  
  // Apply Apollo middleware
  server.applyMiddleware({ app, path: '/graphql' });
  
  // Basic REST API endpoints
  app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from HugMeNow API!' });
  });
  
  // User endpoints
  app.get('/api/users', async (req, res) => {
    try {
      const result = await pgPool.query('SELECT * FROM users LIMIT 10');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  
  // Anonymous login endpoint
  app.post('/anonymous-login', (req, res) => {
    const clientId = Math.random().toString(36).substring(2, 15);
    res.json({
      success: true,
      token: `anonymous-token-${clientId}`,
      userId: `anon-${clientId}`,
      isAnonymous: true
    });
  });
  
  // Catch-all route for any other requests
  app.use('*', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Resource not found',
    });
  });
  
  // Start Express server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Simplified API server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`GraphQL playground: http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Start the server
startServer().catch(err => {
  console.error('Failed to start server:', err);
});