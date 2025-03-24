/**
 * Utility functions for HTTP protocol error handling
 */

/**
 * Protocol error codes that need special handling
 */
export const PROTOCOL_ERRORS = {
  UPGRADE_REQUIRED: 426,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};

/**
 * Checks if a response indicates a protocol upgrade is required
 * @param {Response} response - The fetch Response object
 * @returns {boolean} True if protocol upgrade is required
 */
export const isProtocolUpgradeRequired = (response) => {
  return response?.status === PROTOCOL_ERRORS.UPGRADE_REQUIRED;
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
  if (!response) return null;
  
  // For 426 Upgrade Required errors
  if (response.status === PROTOCOL_ERRORS.UPGRADE_REQUIRED) {
    console.warn('Protocol upgrade required. Retrying with HTTP/1.1...');
    
    // Create new headers with 'Connection: Upgrade' and protocol version hint
    const headers = new Headers(fetchOptions.headers || {});
    headers.set('Connection', 'Upgrade');
    headers.set('Upgrade', 'HTTP/2.0, HTTP/1.1');
    
    // Retry the request with modified headers
    try {
      const newResponse = await fetch(url, {
        ...fetchOptions,
        headers,
      });
      
      return newResponse;
    } catch (error) {
      console.error('Failed to retry with protocol upgrade:', error);
      return response; // Return original response if retry fails
    }
  }
  
  // For 505 HTTP Version Not Supported
  if (response.status === PROTOCOL_ERRORS.HTTP_VERSION_NOT_SUPPORTED) {
    console.warn('HTTP version not supported. Downgrading to HTTP/1.1...');
    
    // Create new headers with HTTP/1.1 hint
    const headers = new Headers(fetchOptions.headers || {});
    headers.set('Accept-Protocol', 'HTTP/1.1');
    
    // Retry with modified headers
    try {
      const newResponse = await fetch(url, {
        ...fetchOptions,
        headers,
      });
      
      return newResponse;
    } catch (error) {
      console.error('Failed to retry with HTTP/1.1:', error);
      return response;
    }
  }
  
  return response;
};

/**
 * Creates an enhanced fetch function that handles protocol errors
 * @returns {Function} Enhanced fetch function
 */
export const createProtocolAwareFetch = () => {
  return async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      
      if (
        response.status === PROTOCOL_ERRORS.UPGRADE_REQUIRED ||
        response.status === PROTOCOL_ERRORS.HTTP_VERSION_NOT_SUPPORTED
      ) {
        return handleProtocolError(response, { url, fetchOptions: options });
      }
      
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
};

/**
 * Determines if the current browser supports advanced HTTP features
 * @returns {Object} Object with browser capability flags
 */
export const detectBrowserHttpCapabilities = () => {
  const capabilities = {
    http2Supported: false,
    secureContextOnly: false,
    fetchWithCredentialsSupported: true,
    modernFetchApi: true
  };
  
  // Check if running in a secure context (needed for HTTP/2)
  capabilities.secureContextOnly = window.isSecureContext;
  
  // Check for HTTP/2 support based on user agent and known limitations
  const ua = navigator.userAgent.toLowerCase();
  
  if (ua.includes('chrome') && parseInt(ua.split('chrome/')[1]) >= 51) {
    capabilities.http2Supported = true;
  } else if (ua.includes('firefox') && parseInt(ua.split('firefox/')[1]) >= 52) {
    capabilities.http2Supported = true;
  } else if (ua.includes('safari') && !ua.includes('chrome') && parseInt(ua.split('version/')[1]) >= 9) {
    capabilities.http2Supported = true;
  }
  
  // Older Edge had limitations with credentials
  if (ua.includes('edge/') && !ua.includes('edg/')) {
    capabilities.fetchWithCredentialsSupported = false;
  }
  
  // Very old browsers might not have all fetch features
  if (
    ua.includes('msie') || 
    (ua.includes('safari') && parseInt(ua.split('version/')[1]) < 10)
  ) {
    capabilities.modernFetchApi = false;
  }
  
  return capabilities;
};

/**
 * Utility to work around known browser protocol compatibility issues
 * @param {Object} apolloConfig - Apollo Client config object
 * @returns {Object} Updated Apollo config with protocol workarounds
 */
export const applyProtocolWorkarounds = (apolloConfig) => {
  const capabilities = detectBrowserHttpCapabilities();
  const updatedConfig = { ...apolloConfig };
  
  if (!capabilities.http2Supported || !capabilities.secureContextOnly) {
    // Add workarounds for HTTP/2 limitations
    if (!updatedConfig.headers) {
      updatedConfig.headers = {};
    }
    
    // Hint preferred HTTP version
    updatedConfig.headers['Accept-Protocol'] = 'HTTP/1.1';
    
    // Disable HTTP/2-specific features in Apollo/fetch
    if (!updatedConfig.fetchOptions) {
      updatedConfig.fetchOptions = {};
    }
    updatedConfig.fetchOptions.cache = 'no-store';
    
    console.info('Applied HTTP protocol compatibility workarounds based on browser capabilities');
  }
  
  return updatedConfig;
};