/**
 * API Configuration Utility
 * 
 * This module dynamically determines the correct API URL to use based on the environment.
 * In development, it uses a direct connection to the local NestJS server on port 3000.
 * In production on Replit, it tries multiple strategies to connect to the API server.
 */

/**
 * Get the base API URL
 * @returns {string} The base URL for API requests
 */
export const getApiBaseUrl = () => {
  // In a Replit environment
  if (window.location.hostname.includes('replit.dev') || 
      window.location.hostname.includes('replit.co') ||
      window.location.hostname.includes('repl.co')) {
    
    // In Replit, the API and frontend are on the same domain but different ports
    // Try to use relative URLs first which helps bypass CORS issues
    return '';
  }
  
  // Local development
  return 'http://localhost:3000';
};

/**
 * The base URL for API requests
 */
export const API_BASE_URL = getApiBaseUrl();

/**
 * The GraphQL endpoint path
 */
export const GRAPHQL_URL = '/graphql';

/**
 * The full GraphQL endpoint URL
 */
export const GRAPHQL_ENDPOINT = `${API_BASE_URL}${GRAPHQL_URL}`;

export default {
  API_BASE_URL,
  GRAPHQL_URL,
  GRAPHQL_ENDPOINT
};