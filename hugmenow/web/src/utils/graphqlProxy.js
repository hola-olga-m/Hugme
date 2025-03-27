/**
 * GraphQL Proxy Utility
 * 
 * This utility provides a simplified proxy for GraphQL requests that can bypass
 * some of the cross-origin restrictions in development and Replit environments.
 */

/**
 * Direct GraphQL fetch function that uses the Fetch API
 * This allows more control over the request configuration than Apollo's default
 * @param {string} query - GraphQL query or mutation string
 * @param {Object} variables - Variables for the query 
 * @param {string} operationName - Optional operation name
 * @returns {Promise<Object>} GraphQL response
 */
export async function directGraphQLRequest(query, variables = {}, operationName = null) {
  // Use a single endpoint for simplicity - the proxy will handle routing
  const endpoint = '/graphql';
  
  try {
    console.log(`Attempting GraphQL request to: ${endpoint}`);
    
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Get the token from localStorage if available
          'Authorization': localStorage.getItem('authToken') 
            ? `Bearer ${localStorage.getItem('authToken')}` 
            : '',
          // Add CORS headers
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          // Add Apollo operation name and CSRF prevention headers
          'x-apollo-operation-name': operationName || 'anonymous',
          'apollo-require-preflight': 'true'
        },
        body: JSON.stringify({
          query,
          variables,
          operationName
        }),
        mode: 'cors',               // Ensure CORS mode
        credentials: 'include',     // Include cookies
        cache: 'no-cache'           // Don't cache requests
      });
      
      // Handle non-200 responses
      if (!response.ok) {
        console.error(`GraphQL request failed with status: ${response.status}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`GraphQL request failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Check for GraphQL errors in the response
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(
          result.errors.map(e => e.message).join('; ')
        );
      }
      
      console.log('GraphQL request successful!', result);
      return result;
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    const lastError = error;
    throw lastError;
  }
}

/**
 * Login with username/email and password via direct GraphQL
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} Login result with token and user
 */
export async function login(credentials) {
  const query = `
    mutation Login($loginInput: LoginInput!) {
      login(loginInput: $loginInput) {
        accessToken
        user {
          id
          username
          email
          name
          avatarUrl
          isAnonymous
          createdAt
          updatedAt
        }
      }
    }
  `;
  
  const result = await directGraphQLRequest(query, {
    loginInput: credentials
  }, 'Login');
  
  return result.data.login;
}

/**
 * Register a new user via direct GraphQL
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration result with token and user
 */
export async function register(userData) {
  const query = `
    mutation Register($registerInput: RegisterInput!) {
      register(registerInput: $registerInput) {
        accessToken
        user {
          id
          username
          email
          name
          avatarUrl
          isAnonymous
          createdAt
          updatedAt
        }
      }
    }
  `;
  
  const result = await directGraphQLRequest(query, {
    registerInput: userData
  }, 'Register');
  
  return result.data.register;
}

/**
 * Anonymous login via direct GraphQL
 * @param {Object} anonData - Anonymous login data
 * @returns {Promise<Object>} Login result with token and user
 */
export async function anonymousLogin(anonData) {
  const query = `
    mutation AnonymousLogin($anonymousLoginInput: AnonymousLoginInput!) {
      anonymousLogin(anonymousLoginInput: $anonymousLoginInput) {
        accessToken
        user {
          id
          username
          email
          name
          avatarUrl
          isAnonymous
          createdAt
          updatedAt
        }
      }
    }
  `;
  
  const result = await directGraphQLRequest(query, {
    anonymousLoginInput: anonData
  }, 'AnonymousLogin');
  
  return result.data.anonymousLogin;
}