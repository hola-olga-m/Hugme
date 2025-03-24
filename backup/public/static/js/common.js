/**
 * Common JS - Application initialization control
 * 
 * This script manages the initialization sequence for the application,
 * ensuring GraphQL services are ready before the main application starts.
 */
console.log('Common.js loaded - initializing application');

// Global application state
window.APP_STATE = {
  graphqlReady: false,
  initialized: false
};

// Check if GraphQL bridge is already available
if (window.graphqlBridge && window.graphqlBridge.initialized) {
  console.log('GraphQL Bridge already available, initializing service');
  initializeGraphQLService();
} else {
  // Wait for GraphQL bridge to be ready
  window.addEventListener('graphqlBridgeReady', () => {
    console.log('GraphQL Bridge ready event received, initializing service');
    initializeGraphQLService();
  });
}

// Initialize the GraphQL service
function initializeGraphQLService() {
  console.log('Initializing GraphQL service');
  
  // Ensure we don't initialize multiple times
  if (window.APP_STATE.graphqlReady) {
    console.log('GraphQL service already initialized');
    return;
  }
  
  // Get configuration from global object if available
  const config = window.GRAPHQL_CONFIG || {
    URL: '/graphql',
    DEBUG: true
  };
  
  // Use existing GraphQL Bridge if available
  if (window.graphqlBridge && window.graphqlBridge.initialized) {
    console.log('Using existing GraphQL Bridge');
    window.graphqlService = window.graphqlBridge;
    window.APP_STATE.graphqlReady = true;
    
    // Dispatch global event to signal GraphQL is ready
    window.dispatchEvent(new Event('graphqlReady'));
    
    console.log('GraphQL service setup complete via bridge');
  } else {
    console.error('GraphQL Bridge not available');
    
    // Fallback implementation if needed
    window.graphqlService = {
      initialized: false,
      
      initialize: function() {
        this.initialized = true;
        return this;
      },
      
      executeQuery: function(query, variables = {}) {
        return fetch(config.URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            query: query,
            variables: variables
          })
        })
        .then(response => response.json())
        .then(result => {
          if (result.errors) {
            throw new Error(result.errors[0].message);
          }
          return result.data;
        });
      }
    };
    
    // Initialize the fallback service
    window.graphqlService.initialize();
    
    // Signal GraphQL is ready
    window.APP_STATE.graphqlReady = true;
    window.dispatchEvent(new Event('graphqlReady'));
    
    console.log('GraphQL service setup complete via fallback');
  }
  
  // Test GraphQL connection
  if (config.DEBUG) {
    window.graphqlService.testConnection && window.graphqlService.testConnection();
  }
}

// Signal the application is ready to initialize
document.addEventListener('DOMContentLoaded', () => {
  if (!window.APP_STATE.initialized) {
    window.APP_STATE.initialized = true;
    
    // Ensure GraphQL is ready before proceeding
    if (window.APP_STATE.graphqlReady) {
      console.log('DOM and GraphQL ready, application can initialize');
      window.dispatchEvent(new Event('appReady'));
    } else {
      window.addEventListener('graphqlReady', () => {
        console.log('DOM was ready, GraphQL now ready, application can initialize');
        window.dispatchEvent(new Event('appReady'));
      });
    }
  }
});