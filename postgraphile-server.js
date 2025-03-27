/**
 * PostGraphile Server for HugMeNow
 * 
 * This server provides a direct GraphQL API for the PostgreSQL database,
 * auto-generating queries and mutations based on the database schema.
 */

import express from 'express';
import { postgraphile } from 'postgraphile';

const app = express();

// Database connection string from environment variable
const DATABASE_URL = process.env.DATABASE_URL;

// Configure PostGraphile middleware
app.use(
  postgraphile(
    DATABASE_URL,
    'public', // PostgreSQL schema to expose
    {
      watchPg: true, // Auto-restart on schema changes
      graphiql: true, // Enable GraphiQL interface
      enhanceGraphiql: true, // Add features to GraphiQL
      subscriptions: true, // Enable GraphQL subscriptions
      dynamicJson: true, // Return JSON scalars as object
      setofFunctionsContainNulls: false, // Assume functions don't return nulls
      ignoreRBAC: false, // Respect PostgreSQL's row-level security
      showErrorStack: 'json', // Include error stack in error responses
      extendedErrors: ['hint', 'detail', 'errcode'], // Include more error details
      allowExplain: true, // Allow EXPLAIN in development
      legacyRelations: 'omit', // Don't include deprecated relations
      disableDefaultMutations: false, // Include default CRUD mutations
      appendPlugins: [], // Add custom plugins here if needed
      exportGqlSchemaPath: './postgraphile-schema.graphql', // Export the schema to a file
      graphqlRoute: '/postgraphile/graphql', // GraphQL endpoint
      graphiqlRoute: '/postgraphile/graphiql', // GraphiQL endpoint
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

// Start server
const PORT = process.env.POSTGRAPHILE_PORT || 3003;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`PostGraphile server running on http://0.0.0.0:${PORT}`);
  console.log(`GraphQL endpoint: http://0.0.0.0:${PORT}/postgraphile/graphql`);
  console.log(`GraphiQL interface: http://0.0.0.0:${PORT}/postgraphile/graphiql`);
});