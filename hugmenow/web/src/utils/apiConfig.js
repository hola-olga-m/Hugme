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
  // In development, using Vite's proxy through a relative path
  // This ensures requests go through the Vite dev server which correctly proxies them
  return '';
  
  // If direct access is needed (uncomment):
  // return 'http://localhost:3000';
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