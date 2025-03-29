/**
 * GraphQL Service
 * Provides configured GraphQL client for the application
 */

import { 
  ApolloClient, 
  InMemoryCache, 
  HttpLink, 
  from,
  ApolloLink,
  Observable
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// For handling authentication token management
let authToken = localStorage.getItem('authToken');

// Update the auth token when it changes
export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Auth Link: attaches the authorization header to requests
const authLink = new ApolloLink((operation, forward) => {
  if (authToken) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${authToken}`
      }
    });
  }
  return forward(operation);
});

// Error Link: handles GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      console.error('GraphQL Error:', err);
      
      // Handle authentication errors
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        console.log('Unauthenticated error detected. Clearing token...');
        setAuthToken(null);
        
        // You can trigger a redirect to login here if needed
        // window.location.href = '/auth/login';
      }
      
      // Log other types of errors
      switch (err.extensions?.code) {
        case 'FORBIDDEN':
          console.error('Access forbidden:', err.message);
          break;
        case 'BAD_USER_INPUT':
          console.error('Invalid input:', err.message);
          break;
        default:
          console.error('GraphQL error:', err.message);
      }
    }
  }

  if (networkError) {
    console.error('Network error:', networkError);
  }
  
  // Continue to the next link in the chain
  return forward(operation);
});

// HTTP Link: sends the GraphQL operations to the server
const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin' // includes cookies with requests
});

// Create the Apollo Client
export const gqlClient = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      // Configure type policies for proper caching
      Query: {
        fields: {
          // Example: merge arrays of items by ID
          users: {
            merge(existing = [], incoming) {
              return incoming;
            }
          },
          // Add other query fields as needed
        }
      },
      // Define other type policies as needed
    }
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Simplified export for direct query execution
export const executeQuery = async (query, variables = {}) => {
  try {
    const { data, errors } = await gqlClient.query({
      query,
      variables,
      fetchPolicy: 'network-only'
    });
    
    if (errors) {
      console.error('GraphQL Errors:', errors);
      throw new Error(errors[0].message);
    }
    
    return data;
  } catch (error) {
    console.error('Query Execution Error:', error);
    throw error;
  }
};

// Simplified export for direct mutation execution
export const executeMutation = async (mutation, variables = {}) => {
  try {
    const { data, errors } = await gqlClient.mutate({
      mutation,
      variables
    });
    
    if (errors) {
      console.error('GraphQL Errors:', errors);
      throw new Error(errors[0].message);
    }
    
    return data;
  } catch (error) {
    console.error('Mutation Execution Error:', error);
    throw error;
  }
};