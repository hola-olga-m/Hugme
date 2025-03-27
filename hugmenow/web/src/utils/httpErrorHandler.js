/**
 * HTTP Error Handler Utility
 * 
 * This utility provides functions to handle and diagnose common HTTP errors,
 * particularly focusing on cross-origin and network-related issues that may
 * occur in the Replit environment.
 */

/**
 * Error types for categorization
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  CORS: 'CORS_ERROR',
  AUTH: 'AUTHENTICATION_ERROR',
  SERVER: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Analyze an error and categorize it by type
 * @param {Error} error - The error to analyze
 * @returns {string} The error type
 */
export function categorizeError(error) {
  const errorMessage = error.message?.toLowerCase() || '';
  const errorStack = error.stack?.toLowerCase() || '';
  
  // Network errors
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('networkerror')
  ) {
    return ErrorTypes.NETWORK;
  }
  
  // CORS errors
  if (
    errorMessage.includes('cors') ||
    errorMessage.includes('cross-origin') ||
    errorMessage.includes('access-control-allow-origin') ||
    errorMessage.includes('origin')
  ) {
    return ErrorTypes.CORS;
  }
  
  // Authentication errors
  if (
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('authentication') ||
    errorMessage.includes('auth') ||
    errorMessage.includes('token') ||
    errorMessage.includes('credentials') ||
    errorMessage.includes('401') ||
    errorMessage.includes('403')
  ) {
    return ErrorTypes.AUTH;
  }
  
  // Server errors
  if (
    errorMessage.includes('500') ||
    errorMessage.includes('502') ||
    errorMessage.includes('503') ||
    errorMessage.includes('504') ||
    errorMessage.includes('server') ||
    errorMessage.includes('internal')
  ) {
    return ErrorTypes.SERVER;
  }
  
  // Timeout errors
  if (
    errorMessage.includes('timeout') ||
    errorMessage.includes('timed out') ||
    errorMessage.includes('time out')
  ) {
    return ErrorTypes.TIMEOUT;
  }
  
  return ErrorTypes.UNKNOWN;
}

/**
 * Get a user-friendly error message based on the error type
 * @param {Error} error - The original error
 * @param {string} operation - What operation was being performed (e.g., "login", "fetching data")
 * @returns {string} A user-friendly error message
 */
export function getUserFriendlyErrorMessage(error, operation = 'performing that action') {
  const errorType = categorizeError(error);
  const originalMessage = error.message || 'An unknown error occurred';
  
  switch (errorType) {
    case ErrorTypes.NETWORK:
      return `We couldn't connect to the server. Please check your internet connection and try again. (${originalMessage})`;
      
    case ErrorTypes.CORS:
      return `The app encountered a cross-origin error. This might be a temporary issue with the server. Please try again in a moment. (${originalMessage})`;
      
    case ErrorTypes.AUTH:
      return `Authentication failed. Please try logging in again. (${originalMessage})`;
      
    case ErrorTypes.SERVER:
      return `The server encountered an error while ${operation}. Please try again later. (${originalMessage})`;
      
    case ErrorTypes.TIMEOUT:
      return `The request timed out. The server might be busy, please try again. (${originalMessage})`;
      
    default:
      return `An error occurred while ${operation}. Please try again or contact support if the problem persists. (${originalMessage})`;
  }
}

/**
 * Log detailed error information to the console for debugging
 * @param {Error} error - The error to log
 * @param {string} context - Additional context for the error
 */
export function logDetailedError(error, context = '') {
  const errorType = categorizeError(error);
  
  console.group(`Error Details (${errorType})`);
  console.error(`Context: ${context}`);
  console.error(`Message: ${error.message}`);
  console.error(`Stack: ${error.stack}`);
  
  // Log additional fields that might be present in network or GraphQL errors
  if (error.networkError) {
    console.error('Network Error:', error.networkError);
    if (error.networkError.result) {
      console.error('Network Error Result:', error.networkError.result);
    }
  }
  
  if (error.graphQLErrors) {
    console.error('GraphQL Errors:', error.graphQLErrors);
  }
  
  if (error.response) {
    console.error('Response:', error.response);
  }
  
  if (error.request) {
    console.error('Request:', error.request);
  }
  
  console.groupEnd();
}

/**
 * Check if the server is available by making a simple request
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} True if the server is available
 */
export async function checkServerAvailability(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      method: 'HEAD',
      cache: 'no-cache',
      credentials: 'omit',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Server availability check failed:', error);
    return false;
  }
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay in milliseconds
 * @returns {Promise<any>} The result of the function
 */
export async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 300) {
  let retries = 0;
  let delay = initialDelay;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw error;
      }
      
      console.warn(`Retry ${retries}/${maxRetries} after ${delay}ms due to error:`, error.message);
      
      // Wait for the backoff period
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff: double the delay for next retry
      delay *= 2;
    }
  }
}