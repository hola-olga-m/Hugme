// GraphQL Configuration - centralized configuration for GraphQL clients
console.log('GraphQL configuration loaded');

// Define global GraphQL configuration
window.GRAPHQL_CONFIG = {
  // Main GraphQL endpoint URL
  URL: '/graphql',
  
  // Secondary GraphQL endpoint (from the GraphQL mesh gateway)
  MESH_URL: '/api/graphql',
  
  // Authentication token key in localStorage
  TOKEN_KEY: 'auth_token',
  
  // Enable debug mode for detailed logging
  DEBUG: true,
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // WebSocket endpoint for subscriptions
  WS_URL: null,  // Setting to null to disable WebSocket connections
  
  // Polling interval for simulating real-time with HTTP
  POLLING_INTERVAL: 5000,
  
  // Maximum retry attempts for failed requests
  MAX_RETRIES: 3,
  
  // Retry backoff factor (in milliseconds)
  RETRY_BACKOFF: 1000
};