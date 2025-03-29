import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { applyProtocolWorkarounds } from '../utils/httpErrorHandler';
// Import the custom Mesh SDK
import { getSdk } from '../mesh-sdk/index.js';

// Base URLs
export const API_BASE_URL = '';  // Empty for relative path, will use Vite proxy
export const GRAPHQL_URL = '/graphql';

/**
 * Create a Mesh SDK instance for direct API calls
 * @returns {Object} Mesh SDK instance
 */
export const meshSdk = () => {
  // Get the token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Create and return the SDK instance
  return getSdk({
    baseUrl: `${API_BASE_URL}${GRAPHQL_URL}`,
    token,
    // Add retry and timeout options
    fetchOptions: {
      timeout: 30000, // 30 second timeout
      retry: {
        retries: 3,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 5000
      }
    }
  });
};

/**
 * Enhanced error handling with categorization and retry logic
 */
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // Track if we need to retry
  let shouldRetry = false;
  
  // Handle GraphQL errors
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      // Log the error with additional context
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );
      
      // If there's an extension code, handle specific error types
      if (extensions?.code) {
        switch (extensions.code) {
          case 'UNAUTHENTICATED':
            console.error('Authentication error - token may be invalid or expired');
            // Could trigger a token refresh here
            break;
          case 'INTERNAL_SERVER_ERROR':
            console.error('Server error - may be temporary');
            shouldRetry = true;
            break;
          case 'PERSISTED_QUERY_NOT_FOUND':
            console.error('Persisted query not found - will retry with full query');
            shouldRetry = true;
            break;
        }
      }
    });
  }
  
  // Handle network errors
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Determine if we should retry based on the type of network error
    if (
      networkError.message.includes('Failed to fetch') || 
      networkError.message.includes('Network request failed') ||
      networkError.message.includes('timeout') || 
      networkError.statusCode >= 500
    ) {
      console.log('Network error seems temporary - will retry');
      shouldRetry = true;
    }
  }
  
  // If we determined we should retry, and we haven't hit max retries
  if (shouldRetry) {
    const retryCount = operation.getContext().retryCount || 0;
    if (retryCount < 3) {
      // Exponential backoff delay
      const delay = Math.min(1000 * (2 ** retryCount), 5000);
      
      console.log(`Retrying operation ${operation.operationName} after ${delay}ms (attempt ${retryCount + 1}/3)`);
      
      return new Promise(resolve => {
        setTimeout(() => {
          // Set the retry count in context
          operation.setContext({
            ...operation.getContext(),
            retryCount: retryCount + 1
          });
          resolve(forward(operation));
        }, delay);
      });
    }
  }
});

// Create a retry link for automatic retries
const retryLink = new RetryLink({
  delay: {
    initial: 1000,   // First retry after 1s
    max: 10000,      // Maximum delay of 10s
    jitter: true     // Add randomness to the delay
  },
  attempts: {
    max: 3,          // Max 3 retry attempts
    retryIf: (error, operation) => {
      // Only retry on network errors or server errors (5xx)
      return !!error && (
        !error.result || 
        error.statusCode >= 500 || 
        error.message.includes('Failed to fetch') || 
        error.message.includes('Network request failed')
      );
    }
  }
});

// Create an HTTP link for the GraphQL endpoint with better timeout and error handling
const httpLink = new HttpLink({
  uri: `${API_BASE_URL}${GRAPHQL_URL}`,
  credentials: 'include',  // Include cookies for auth
  // Properly handle non-2xx responses
  fetchOptions: {
    mode: 'cors',
    timeout: 30000
  }
});

// Create an auth link to add the token to each request
const authLink = setContext((_, { headers }) => {
  // Get the token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Return the headers with the token if it exists
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      // Add cache control headers to avoid stale responses
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  };
});

/**
 * Create the Apollo client with enhanced resilience features
 * @returns {ApolloClient} Configured Apollo client
 */
export const createApolloClient = () => {
  // Debug link to log all GraphQL operations
  const debugLink = new ApolloLink((operation, forward) => {
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`GraphQL Operation: ${operation.operationName}`);
      console.log(`GraphQL Query:`, operation.query.loc?.source?.body);
      console.log(`GraphQL Variables:`, operation.variables);
      
      return forward(operation).map((result) => {
        console.log(`GraphQL Result:`, result);
        return result;
      });
    }
    return forward(operation);
  });

  const baseConfig = {
    // Add retry link to the chain for automatic retry on network errors
    link: from([debugLink, errorLink, retryLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            moods: {
              merge(existing = [], incoming) {
                return [...incoming];
              }
            },
            publicMoods: {
              merge(existing = [], incoming) {
                return [...incoming];
              }
            },
            friendsMoods: {
              merge(existing = [], incoming) {
                return [...incoming];
              }
            },
            hugs: {
              merge(existing = [], incoming) {
                return [...incoming];
              }
            },
            users: {
              merge(existing = [], incoming) {
                return [...incoming];
              }
            }
          }
        }
      }
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        // Add retry and timeout settings
        notifyOnNetworkStatusChange: true
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
        // Add retry settings
        notifyOnNetworkStatusChange: true
      },
      mutate: {
        errorPolicy: 'all'
      }
    },
    // Better connectivity checking
    assumeImmutableResults: true,
    connectToDevTools: process.env.NODE_ENV !== 'production'
  };
  
  // Apply any necessary protocol workarounds for browser compatibility
  const finalConfig = applyProtocolWorkarounds(baseConfig);
  
  return new ApolloClient(finalConfig);
};

// Export the client instance
export const client = createApolloClient();