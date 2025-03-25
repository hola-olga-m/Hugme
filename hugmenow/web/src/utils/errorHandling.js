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
  const message = error?.message?.toLowerCase() || '';
  
  // Authentication errors
  if (
    message.includes('unauthorized') ||
    message.includes('unauthenticated') ||
    message.includes('auth') ||
    message.includes('login') ||
    message.includes('token') ||
    error?.status === 401 ||
    error?.statusCode === 401
  ) {
    return 'auth';
  }
  
  // Network errors
  if (
    message.includes('network') ||
    message.includes('connection') ||
    message.includes('offline') ||
    message.includes('failed to fetch') ||
    error.name === 'NetworkError' ||
    context.isNetworkError
  ) {
    return 'network';
  }
  
  // Routing errors
  if (
    message.includes('not found') ||
    message.includes('404') ||
    message.includes('route') ||
    error?.status === 404 ||
    error?.statusCode === 404 ||
    context.isRouteError
  ) {
    return 'route';
  }
  
  // Data errors (validation, database, etc.)
  if (
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('data') ||
    message.includes('database') ||
    message.includes('constraint') ||
    context.isDataError
  ) {
    return 'data';
  }
  
  // Default to general error
  return 'general';
};

/**
 * Get user-friendly error message based on error type
 * @param {string} errorType - The type of error
 * @returns {Object} Object with title and description
 */
export const getErrorMessage = (errorType) => {
  switch (errorType) {
    case 'auth':
      return {
        title: 'Authentication Error',
        description: 'Your session may have expired. Please log in again.'
      };
    case 'network':
      return {
        title: 'Network Error',
        description: 'Unable to connect to the server. Please check your internet connection.'
      };
    case 'route':
      return {
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist or has been moved.'
      };
    case 'data':
      return {
        title: 'Data Error',
        description: 'There was a problem with the data. Please try again with valid information.'
      };
    default:
      return {
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again later.'
      };
  }
};

/**
 * Log error details for debugging
 * @param {Error} error - The error object
 * @param {Object} context - Additional context
 */
export const logError = (error, context = {}) => {
  const errorType = detectErrorType(error, context);
  const { title } = getErrorMessage(errorType);
  
  console.group(`Error: ${title}`);
  console.error('Error object:', error);
  console.error('Error type:', errorType);
  console.error('Error context:', context);
  console.groupEnd();
  
  // Could add additional logging here, e.g. to an error tracking service
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
    case 'route':
      return '/';
    case 'network':
    case 'data':
    default:
      // Stay on the current page for these errors
      return null;
  }
};