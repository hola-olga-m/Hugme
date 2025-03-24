import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { applyProtocolWorkarounds, PROTOCOL_ERRORS, handleProtocolError } from '../utils/httpErrorHandler';

// API Base URL - using relative paths with Vite proxy
export const API_BASE_URL = '';  // Empty for relative path, will use Vite proxy
export const GRAPHQL_URL = '/graphql';

/**
 * Custom fetch function that handles protocol errors like 426 Upgrade Required
 * @param {string} uri - The URI to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} The fetch response
 */
const customFetch = async (uri, options) => {
  try {
    // Initial fetch attempt
    const response = await fetch(uri, options);
    
    // Handle protocol errors (426, 505, etc.)
    if (
      response.status === PROTOCOL_ERRORS.UPGRADE_REQUIRED || 
      response.status === PROTOCOL_ERRORS.HTTP_VERSION_NOT_SUPPORTED
    ) {
      console.warn(`Protocol error ${response.status} detected, attempting to recover...`);
      return handleProtocolError(response, { url: uri, fetchOptions: options });
    }
    
    return response;
  } catch (error) {
    console.error('Apollo fetch error:', error);
    throw error;
  }
};

// Create an http link for GraphQL API with protocol error handling
const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
  credentials: 'include',
  fetch: customFetch,
});

// Error handling link with recovery for protocol errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Check if it's a protocol-related error (based on message or status code)
    const errorMsg = networkError.message || '';
    const statusCode = networkError.statusCode || networkError.response?.status;
    
    // Store retry attempts for this operation
    if (!window.__protocolRetryAttempts) {
      window.__protocolRetryAttempts = new Map();
    }
    
    const operationId = operation.operationName || 'anonymous';
    const retryCount = window.__protocolRetryAttempts.get(operationId) || 0;
    
    if (
      statusCode === PROTOCOL_ERRORS.UPGRADE_REQUIRED ||
      errorMsg.includes('426') || 
      errorMsg.includes('Upgrade Required') ||
      errorMsg.includes('HTTP version')
    ) {
      console.warn(`Detected protocol compatibility issue (attempt ${retryCount + 1}), applying workarounds...`);
      
      // Only retry a limited number of times before redirecting to the error page
      if (retryCount < 2) {
        // Increment retry counter
        window.__protocolRetryAttempts.set(operationId, retryCount + 1);
        
        // Apply protocol compatibility headers
        operation.setContext(({ headers: oldHeaders = {} }) => ({
          headers: {
            ...oldHeaders,
            'Accept-Protocol': 'HTTP/1.1',
            'Connection': 'keep-alive',
            'X-Protocol-Hint': 'HTTP1.1',
            'X-Retry-Attempt': retryCount + 1
          }
        }));
        
        return forward(operation);
      } else {
        // After multiple failed attempts, redirect to protocol error page
        console.error('Maximum protocol compatibility retry attempts reached, redirecting to error page');
        
        // Clear retry count for future attempts
        window.__protocolRetryAttempts.delete(operationId);
        
        // Redirect to protocol error page with details
        setTimeout(() => {
          const currentPath = window.location.pathname;
          const redirectURL = `/protocol-error?code=${statusCode}&message=${encodeURIComponent(errorMsg)}&from=${encodeURIComponent(currentPath)}`;
          
          // Only redirect if we're not already on the error page
          if (!window.location.pathname.includes('/protocol-error')) {
            window.location.href = redirectURL;
          }
        }, 100);
      }
    } else if (statusCode === PROTOCOL_ERRORS.HTTP_VERSION_NOT_SUPPORTED) {
      // Handle HTTP version not supported (505) similarly
      console.warn('HTTP version not supported, redirecting to protocol error page');
      
      setTimeout(() => {
        const currentPath = window.location.pathname;
        const redirectURL = `/protocol-error?code=${statusCode}&message=${encodeURIComponent('HTTP Version Not Supported')}&from=${encodeURIComponent(currentPath)}`;
        
        if (!window.location.pathname.includes('/protocol-error')) {
          window.location.href = redirectURL;
        }
      }, 100);
    }
  }
});

// Protocol compatibility middleware link
const protocolCompatibilityLink = new ApolloLink((operation, forward) => {
  // Add protocol compatibility headers to avoid 426 errors
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'Accept-Protocol': 'HTTP/1.1',
      'X-Client-Version': '1.0.0'
    }
  }));
  
  return forward(operation);
});

// Auth link to set JWT token in headers
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Return headers to the context
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Default Apollo client options
const defaultOptions = {
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
};

// Create and configure Apollo Client with protocol workarounds
const createApolloClient = () => {
  // Apply protocol workarounds based on browser capabilities
  const configWithWorkarounds = applyProtocolWorkarounds({
    defaultOptions
  });
  
  return new ApolloClient({
    link: from([errorLink, protocolCompatibilityLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    ...configWithWorkarounds,
    connectToDevTools: process.env.NODE_ENV !== 'production'
  });
};

// Export configured Apollo Client instance
export const client = createApolloClient();