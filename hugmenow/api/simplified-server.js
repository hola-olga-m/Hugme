/**
 * Simplified NestJS API Server
 * 
 * This is a standalone Express server that proxies requests to the PostGraphile
 * GraphQL API without all the overhead of the NestJS application.
 */

const express = require('express');
const { postgraphile } = require('postgraphile');
const { Pool } = require('pg');
const cors = require('cors');

// Constants
const PORT = process.env.PORT || 3000;
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

// Basic request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Create PostgreSQL Pool
const pgPool = new Pool({
  connectionString: DATABASE_URL,
});

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

// Set up PostGraphile middleware
app.use(
  '/graphql',
  postgraphile(pgPool, 'public', {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    allowExplain: true,
    enableCors: true,
    extendedErrors: ['hint', 'detail', 'errcode'],
    appendPlugins: [],
    skipPlugins: [],
    exportGqlSchemaPath: './schema.graphql',
    bodySizeLimit: '5MB',
    enableQueryBatching: true,
    disableQueryLog: false,
    legacyRelations: 'omit',
    setofFunctionsContainNulls: false,
    ignoreRBAC: false,
    showErrorStack: 'json',
    ignoreIndexes: false,
  })
);

// Catch-all route for any other requests
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simplified API server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`GraphiQL interface: http://localhost:${PORT}/graphql/graphiql`);
});