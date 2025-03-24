// GraphQL Bridge - provides client-side GraphQL functionality
console.log('GraphQL Bridge loaded');

// Create a global event to signal GraphQL is initialized
window.graphqlBridgeReadyEvent = new Event('graphqlBridgeReady');

// Initialize GraphQL bridge
function initializeGraphQLBridge() {
  console.log('Initializing GraphQL Bridge');
  
  // Get configuration from global object if available
  const config = window.GRAPHQL_CONFIG || {
    URL: '/api/graphql',
    TOKEN_KEY: 'auth_token',
    DEBUG: false
  };
  
  // Create a simplified GraphQL client for the window object
  window.graphqlBridge = {
    initialized: true,
    config: config,
    
    initialize: function(options = {}) {
      console.log('GraphQL client being initialized via bridge (HTTP-only mode)');
      
      // Store auth token if provided
      if (options.token) {
        this.setAuthToken(options.token);
      }
      // Load token from localStorage if available
      else if (window.localStorage) {
        const storedToken = localStorage.getItem(config.TOKEN_KEY) || localStorage.getItem('token');
        if (storedToken) {
          this.setAuthToken(storedToken);
        }
      }
      
      return this;
    },
    
    setAuthToken: function(token) {
      this.authToken = token;
      
      // Store token in localStorage
      if (window.localStorage) {
        localStorage.setItem(config.TOKEN_KEY, token);
        localStorage.setItem('token', token); // For compatibility
      }
    },
    
    clearAuthToken: function() {
      this.authToken = null;
      
      if (window.localStorage) {
        localStorage.removeItem(config.TOKEN_KEY);
        localStorage.removeItem('token');
      }
    },
    
    getAuthToken: function() {
      return this.authToken;
    },
    
    isAuthenticated: function() {
      return !!this.authToken;
    },
    
    executeQuery: function(query, variables = {}) {
      return this.executeOperation('query', query, variables);
    },
    
    executeMutation: function(mutation, variables = {}) {
      return this.executeOperation('mutation', mutation, variables);
    },
    
    executeOperation: function(operationType, operation, variables = {}) {
      return new Promise((resolve, reject) => {
        // Log operation if debug is enabled
        if (config.DEBUG) {
          console.log(`GraphQL ${operationType}:`, { query: operation, variables });
        }
        
        // Prepare fetch options
        const fetchOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            query: operation,
            variables: variables
          })
        };
        
        // Add auth token if available
        if (this.authToken) {
          fetchOptions.headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        
        // Use the configured GraphQL endpoint
        const graphqlUrl = config.URL;
        
        // Setup timeout if configured
        const timeout = config.TIMEOUT || 30000;
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('GraphQL request timeout')), timeout);
        });
        
        // Execute the fetch request with timeout
        Promise.race([
          fetch(graphqlUrl, fetchOptions)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(result => {
              if (result.errors) {
                const errorMessage = result.errors[0].message;
                if (config.DEBUG) {
                  console.error('GraphQL errors:', result.errors);
                }
                reject(new Error(errorMessage));
              } else {
                resolve(result.data);
              }
            }),
          timeoutPromise
        ]).catch(error => {
          console.error('GraphQL operation error:', error);
          reject(error);
        });
      });
    },
    
    // Test connection to the GraphQL server
    testConnection: function() {
      const testQuery = `
        query TestConnection {
          __schema {
            queryType {
              name
            }
          }
        }
      `;
      
      return this.executeQuery(testQuery)
        .then(() => {
          console.log('GraphQL connection test successful');
          return true;
        })
        .catch(error => {
          console.error('GraphQL connection test failed:', error);
          return false;
        });
    }
  };
  
  // Initialize the GraphQL bridge
  window.graphqlBridge.initialize();
  
  // Test connection
  if (config.DEBUG) {
    window.graphqlBridge.testConnection();
  }
  
  console.log('GraphQL Bridge setup complete');
  
  // Dispatch event to signal GraphQL bridge is ready
  window.dispatchEvent(window.graphqlBridgeReadyEvent);
}

// Initialize GraphQL bridge when the script loads
initializeGraphQLBridge();