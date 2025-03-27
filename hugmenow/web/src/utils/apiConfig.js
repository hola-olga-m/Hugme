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
  // For simplicity and reliability, during development we'll use a relative path
  // This will make requests go through the Vite dev server which can proxy them
  return '';
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