/**
 * PostGraphile Server for HugMeNow
 * 
 * This server provides a direct GraphQL API for the PostgreSQL database,
 * auto-generating queries and mutations based on the database schema.
 * 
 * Enhanced with resilient connection handling and performance optimizations.
 */

import express from 'express';
import { postgraphile } from 'postgraphile';
import cors from 'cors';

const app = express();

// Enable CORS for cross-origin requests
app.use(cors());

// Add basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'postgraphile' });
});

// Parse JSON request bodies
app.use(express.json());

// Database connection string from environment variable
const DATABASE_URL = process.env.DATABASE_URL;

// Determine if we're in production mode
const isProd = process.env.NODE_ENV === 'production';

// Configure connection pool settings
const pgSettings = {
  // Maximum number of clients the pool should contain
  max: 10,
  
  // Connection timeout in milliseconds
  connectionTimeoutMillis: 10000,
  
  // How long a client is allowed to remain idle before being closed
  idleTimeoutMillis: 30000
};

// Configure PostGraphile middleware with optimized settings
app.use(
  postgraphile(
    {
      connectionString: DATABASE_URL,
      // Use a connection pool for better performance and reliability
      pgSettings,
      // Add retry logic for connection issues
      retryOnInitFail: true
    },
    'public', // PostgreSQL schema to expose
    {
      // Disable watchPg completely to avoid watch fixture errors
      // Restarting the service is more reliable for schema updates
      watchPg: false,
      
      // Enable in development, optional in production
      graphiql: true,
      enhanceGraphiql: true,
      
      // Performance optimizations
      dynamicJson: true,
      setofFunctionsContainNulls: false,
      ignoreRBAC: false,
      
      // Error handling
      showErrorStack: isProd ? false : 'json',
      extendedErrors: isProd ? ['errcode'] : ['hint', 'detail', 'errcode'],
      
      // Development features, disable in production
      allowExplain: !isProd,
      
      // Schema settings
      legacyRelations: 'omit',
      disableDefaultMutations: false,
      
      // Custom plugins
      appendPlugins: [],
      
      // Export schema to file for reference
      exportGqlSchemaPath: './postgraphile-schema.graphql',
      
      // Route configuration
      graphqlRoute: '/postgraphile/graphql',
      graphiqlRoute: '/postgraphile/graphiql',
      
      // Enable subscriptions for real-time updates
      subscriptions: true,
      
      // Add connection retry logic and timeout limits
      retryOnInitFail: true,
      connectionTimeoutMillis: 30000,
      
      // Set more resilient PG connection settings
      pgSettings: {
        // Statement timeout of 30 seconds
        statement_timeout: 30000,
        // Idle in transaction timeout of 60 seconds
        idle_in_transaction_session_timeout: 60000
      }
    }
  )
);

// Additional endpoint to check server status
app.get('/postgraphile/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'PostGraphile server is running'
  });
});

// Get service information
const PORT = process.env.POSTGRAPHILE_PORT || 3003;
const SERVICE_NAME = process.env.SERVICE_NAME || 'PostGraphile';

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ${SERVICE_NAME} server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 GraphQL endpoint: http://0.0.0.0:${PORT}/postgraphile/graphql`);
  console.log(`🔎 GraphiQL interface: http://0.0.0.0:${PORT}/postgraphile/graphiql`);
  console.log(`✅ Status endpoint: http://0.0.0.0:${PORT}/postgraphile/status`);
});