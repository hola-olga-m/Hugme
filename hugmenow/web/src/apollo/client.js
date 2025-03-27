import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { applyProtocolWorkarounds } from '../utils/httpErrorHandler';

// Base URLs
export const API_BASE_URL = '';  // Empty for relative path, will use Vite proxy
export const GRAPHQL_URL = '/graphql';

// Create an error link for handling GraphQL errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create an HTTP link for the GraphQL endpoint
const httpLink = createHttpLink({
  uri: `${API_BASE_URL}${GRAPHQL_URL}`,
  credentials: 'include'  // Include cookies for auth
});

// Create an auth link to add the token to each request
const authLink = setContext((_, { headers }) => {
  // Get the token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Return the headers with the token if it exists
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

// Create the Apollo client
export const createApolloClient = () => {
  const baseConfig = {
    link: from([errorLink, authLink, httpLink]),
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
        fetchPolicy: 'cache-and-network'
      }
    }
  };
  
  // Apply any necessary protocol workarounds for browser compatibility
  const finalConfig = applyProtocolWorkarounds(baseConfig);
  
  return new ApolloClient(finalConfig);
};

// Export the client instance
export const client = createApolloClient();