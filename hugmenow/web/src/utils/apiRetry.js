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

export async function fetchWithRetry(url, options, retries = 3, initialDelay = 1000) {
  let lastError;
  let attemptCount = 0;

  // Set a reasonable timeout if not provided
  if (!options.signal) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    options.signal = controller.signal;

    // Clean up timeout on success
    const originalSignal = options.signal;
    options.cleanup = () => clearTimeout(timeoutId);
  }

  while (attemptCount <= retries) {
    try {
      console.log(`API request attempt ${attemptCount + 1}/${retries + 1} to ${url}`);
      const response = await fetch(url, options);

      // Clean up timeout if we defined one
      if (options.cleanup) {
        options.cleanup();
      }

      // Successfully received a response
      if (response.ok) {
        if (attemptCount > 0) {
          console.log(`Request succeeded after ${attemptCount + 1} attempts`);
        }
        return response;
      }

      const isServerError = response.status >= 500;
      // Don't retry client errors (4xx) except for 429 (too many requests)
      const shouldRetry = isServerError || response.status === 429;

      if (!shouldRetry || attemptCount >= retries) {
        return response;
      }

      console.warn(`Received status ${response.status}, retrying...`);
      lastError = new Error(`Server responded with status ${response.status}`);
    } catch (error) {
      // Clean up timeout if we defined one
      if (options.cleanup) {
        options.cleanup();
      }

      console.error(`Request attempt ${attemptCount + 1} failed:`, error.message);

      if (error.name === 'AbortError') {
        lastError = new Error(`Request timeout after 15 seconds`);
      } else {
        lastError = error;
      }

      if (attemptCount >= retries) {
        throw lastError;
      }
    }

    // Calculate delay with exponential backoff and jitter
    const delay = initialDelay * Math.pow(2, attemptCount) * (0.5 + Math.random() * 0.5);
    console.log(`Waiting ${Math.round(delay)}ms before retry...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    attemptCount++;
  }

  throw lastError;
}