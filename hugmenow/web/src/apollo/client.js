import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { API_BASE_URL, GRAPHQL_URL } from '../utils/apiConfig';
import { logDetailedError } from '../utils/httpErrorHandler';

// Create an error link for handling GraphQL errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      
      // Log detailed error information for easier debugging
      logDetailedError(
        new Error(`GraphQL Error: ${message}`), 
        `Operation: ${operation.operationName || 'unnamed'}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Log detailed network error information
    logDetailedError(
      networkError, 
      `Operation: ${operation.operationName || 'unnamed'}, Endpoint: ${operation.getContext().uri}`
    );
  }
});

// Create an HTTP link for the GraphQL endpoint with better fallback options
const httpLink = createHttpLink({
  uri: `${API_BASE_URL}${GRAPHQL_URL}`,
  credentials: 'include',  // Include cookies for auth
  fetchOptions: {
    mode: 'cors',  // Ensure CORS mode is explicitly set
    cache: 'no-store',
    credentials: 'include'
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    // Add Apollo specific headers to prevent CSRF issues
    'apollo-require-preflight': 'true',
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
      // Add additional headers to help identify retry attempts
      'X-Client-Version': '1.0.0',
      'X-Protocol-Hint': 'HTTP/1.1'
    }
  };
});

// Create a retry link to automatically retry failed requests
const retryLink = new RetryLink({
  delay: {
    initial: 300, // 300ms
    max: 5000,    // 5 seconds
    jitter: true  // Add randomness to the delay
  },
  attempts: {
    max: 3,
    retryIf: (error, operation) => {
      // Only retry on network errors or specific server errors
      if (error.networkError) {
        console.log(`Retrying operation ${operation.operationName} due to network error`);
        return true;
      }
      
      // Retry on 429 (too many requests) or 5xx server errors
      const statusCode = error.statusCode || (error.networkError && error.networkError.statusCode);
      if (statusCode && (statusCode === 429 || (statusCode >= 500 && statusCode < 600))) {
        console.log(`Retrying operation ${operation.operationName} due to server error ${statusCode}`);
        return true;
      }
      
      return false;
    }
  }
});

// Create the Apollo client
export const createApolloClient = () => {
  const baseConfig = {
    // Add the retry link to our link chain
    link: from([errorLink, retryLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            userMoods: {
              merge(existing = [], incoming) {
                return [...incoming];
              }
            },
            publicMoods: {
              merge(existing = [], incoming) {
                return [...incoming];
              }
            },
            sentHugs: {
              merge(existing = [], incoming) {
                return [...incoming];
              }
            },
            receivedHugs: {
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
        errorPolicy: 'all'
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      },
      mutate: {
        errorPolicy: 'all'
      }
    }
  };
  
  return new ApolloClient(baseConfig);
};

// Export the client instance
export const client = createApolloClient();