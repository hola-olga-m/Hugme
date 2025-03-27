/**
 * Utility functions for HTTP protocol error handling
 */

/**
 * Protocol error codes that need special handling
 */
export const PROTOCOL_ERRORS = {
  UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION',
  UPGRADE_REQUIRED: 'UPGRADE_REQUIRED',
  PROTOCOL_ERROR: 'PROTOCOL_ERROR',
  OPTIONS_REQUIRED: 'OPTIONS_REQUIRED'
};

/**
 * Checks if a response indicates a protocol upgrade is required
 * @param {Response} response - The fetch Response object
 * @returns {boolean} True if protocol upgrade is required
 */
export const isProtocolUpgradeRequired = (response) => {
  // Check for HTTP status codes that indicate protocol issues
  return (
    response.status === 426 || // Upgrade Required
    response.status === 505 || // HTTP Version Not Supported
    (response.headers && response.headers.get('upgrade')) // Has upgrade header
  );
};

/**
 * Handles protocol-related errors by attempting to fix them
 * @param {Response} response - The fetch Response object 
 * @param {Object} options - Additional options
 * @param {string} options.url - The URL to retry with fixed options
 * @param {Object} options.fetchOptions - Original fetch options
 * @returns {Promise<Response>} A new response with the fixed protocol
 */
export const handleProtocolError = async (response, { url, fetchOptions = {} } = {}) => {
  console.warn('Handling potential protocol error:', response.status);
  
  // Apply protocol-specific fixes if needed
  const newOptions = { ...fetchOptions };
  
  // Try with explicit HTTP version 1.1
  newOptions.headers = newOptions.headers || {};
  newOptions.headers['X-HTTP-Version'] = '1.1';
  
  // Retry the request with fixed options
  return fetch(url, newOptions);
};

/**
 * Creates an enhanced fetch function that handles protocol errors
 * @returns {Function} Enhanced fetch function
 */
export const createProtocolAwareFetch = () => {
  return async (url, options = {}) => {
    try {
      // Make the initial request
      const response = await fetch(url, options);
      
      // Check if response indicates protocol issues
      if (isProtocolUpgradeRequired(response)) {
        // Try to fix protocol issues
        return handleProtocolError(response, { url, fetchOptions: options });
      }
      
      return response;
    } catch (error) {
      // Rethrow error
      throw error;
    }
  };
};

/**
 * Determines if the current browser supports advanced HTTP features
 * @returns {Object} Object with browser capability flags
 */
export const detectBrowserHttpCapabilities = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  return {
    http2Support: !userAgent.includes('safari') || userAgent.includes('chrome'),
    webSocketSupport: 'WebSocket' in window,
    fetchCredentialsSupport: true, // Modern browsers support this
    isOlderBrowser: /msie|trident/.test(userAgent)
  };
};

/**
 * Utility to work around known browser protocol compatibility issues
 * @param {Object} apolloConfig - Apollo Client config object
 * @returns {Object} Updated Apollo config with protocol workarounds
 */
export const applyProtocolWorkarounds = (apolloConfig) => {
  // Check browser capabilities
  const capabilities = detectBrowserHttpCapabilities();
  const config = { ...apolloConfig };
  
  // Apply workarounds for older browsers
  if (capabilities.isOlderBrowser) {
    // Use polling instead of websockets for subscriptions
    if (config.defaultOptions) {
      config.defaultOptions.watchQuery = {
        ...config.defaultOptions.watchQuery,
        fetchPolicy: 'network-only'
      };
    }
  }
  
  return config;
};