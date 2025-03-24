/**
 * Utility functions for error handling and detection
 */

/**
 * Detects the type of error based on error message and context
 * @param {Error} error - The error object
 * @param {Object} context - Additional context about where the error occurred
 * @returns {string} Error type: 'route', 'network', 'auth', 'data'
 */
export const detectErrorType = (error, context = {}) => {
  const { location, component } = context;
  const errorMessage = error?.message || '';
  
  // Network errors
  if (
    errorMessage.includes('Failed to fetch') || 
    errorMessage.includes('NetworkError') || 
    errorMessage.includes('Network request failed') ||
    errorMessage.includes('Unable to connect')
  ) {
    return 'network';
  }
  
  // Authentication errors
  if (
    errorMessage.includes('Unauthorized') || 
    errorMessage.includes('Authentication failed') ||
    errorMessage.includes('not logged in') ||
    errorMessage.includes('JWT')
  ) {
    return 'auth';
  }
  
  // Data errors
  if (
    errorMessage.includes('Cannot read property') || 
    errorMessage.includes('undefined is not an object') ||
    errorMessage.includes('is not a function') ||
    errorMessage.includes('Cannot find')
  ) {
    return 'data';
  }
  
  // Check if it's a routing error based on context
  if (
    location?.pathname && 
    (component === 'Router' || errorMessage.includes('No route matched'))
  ) {
    return 'route';
  }
  
  // Default to route error
  return 'route';
};

/**
 * Get user-friendly error message based on error type
 * @param {string} errorType - The type of error
 * @returns {Object} Object with title and description
 */
export const getErrorMessage = (errorType) => {
  switch (errorType) {
    case 'network':
      return {
        title: "Network Error",
        description: "Unable to connect to our servers. Please check your internet connection and try again."
      };
    case 'auth':
      return {
        title: "Authentication Error",
        description: "You need to be logged in to view this page or your session may have expired."
      };
    case 'data':
      return {
        title: "Data Loading Error",
        description: "We couldn't load the data for this page. Please try again later."
      };
    case 'route':
    default:
      return {
        title: "Page Not Found",
        description: "The page you're looking for might be unavailable or doesn't exist."
      };
  }
};

/**
 * Log error details for debugging
 * @param {Error} error - The error object
 * @param {Object} context - Additional context
 */
export const logError = (error, context = {}) => {
  const { component, location, action } = context;
  
  console.error(`[ERROR][${component || 'App'}]`, {
    message: error?.message,
    stack: error?.stack,
    location: location?.pathname,
    action,
    timestamp: new Date().toISOString(),
  });
  
  // Could be extended to log to an external service or store errors in localStorage
};

/**
 * Determine the appropriate redirect for an error
 * @param {string} errorType - The type of error
 * @returns {string} The path to redirect to
 */
export const getErrorRedirect = (errorType) => {
  switch (errorType) {
    case 'auth':
      return '/login';
    case 'network':
    case 'data':
      return '/error';
    case 'route':
    default:
      return '/not-found';
  }
};