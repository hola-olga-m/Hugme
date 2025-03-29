
/**
 * Utility for retrying API calls that might timeout
 */

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {number} options.initialDelay - Initial delay in ms
 * @param {Function} options.shouldRetry - Function that returns true if retry should happen
 * @returns {Promise} - The result of the function call
 */
export const retry = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    shouldRetry = (error) => {
      // By default, retry on timeout and 5xx errors
      return (
        error.code === 'ECONNABORTED' || 
        (error.response && error.response.status >= 500 && error.response.status < 600)
      );
    }
  } = options;

  let lastError;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry
      if (attempt + 1 >= maxRetries || !shouldRetry(error)) {
        break;
      }
      
      // Calculate exponential backoff delay
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`API call failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`, error);
      
      // Wait before next retry
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }

  throw lastError;
};
