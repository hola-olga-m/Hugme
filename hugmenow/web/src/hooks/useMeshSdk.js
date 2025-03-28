import { useState, useEffect, useCallback } from 'react';
import { getSdk } from '../mesh-sdk/index.js';
import { API_BASE_URL, GRAPHQL_URL } from '../apollo/client.js';

/**
 * Custom hook for using the GraphQL Mesh SDK in React components
 * This provides a more React-friendly way to access Mesh SDK functions
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.shouldRefetchOnMount - Whether to refetch data when component mounts
 * @param {boolean} options.shouldRefetchOnFocus - Whether to refetch data when window gains focus
 * @returns {Object} The SDK instance and helper functions
 */
export const useMeshSdk = (options = {}) => {
  const { shouldRefetchOnMount = true, shouldRefetchOnFocus = false } = options;
  
  // State for tracking loading, error, and last executed operation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastOperation, setLastOperation] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  // Create the SDK instance
  const getSDKInstance = useCallback(() => {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');
    
    // Create and return the SDK instance
    return getSdk({
      baseUrl: `${API_BASE_URL}${GRAPHQL_URL}`,
      token,
      onError: (operation, error) => {
        console.error(`[Mesh SDK] Error in ${operation}:`, error);
        setError(error);
      }
    });
  }, []);

  // SDK instance
  const sdk = getSDKInstance();

  // Helper function to wrap SDK calls with loading state
  const executeOperation = useCallback(async (operationName, operationFn, ...args) => {
    setLoading(true);
    setError(null);
    setLastOperation(operationName);
    
    try {
      const result = await operationFn(...args);
      setLastResult(result);
      setLoading(false);
      return result;
    } catch (err) {
      console.error(`[Mesh SDK] Error executing ${operationName}:`, err);
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  // Create enhanced SDK with loading state tracking
  const enhancedSdk = {};
  
  // Add all SDK methods with loading state tracking
  Object.keys(sdk).forEach(method => {
    enhancedSdk[method] = (...args) => 
      executeOperation(method, sdk[method], ...args);
  });

  // Window focus event handler for refetching
  useEffect(() => {
    if (!shouldRefetchOnFocus || !lastOperation) return;

    const handleFocus = () => {
      if (lastOperation && enhancedSdk[lastOperation]) {
        console.log(`[Mesh SDK] Refetching ${lastOperation} on window focus`);
        enhancedSdk[lastOperation]();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [shouldRefetchOnFocus, lastOperation, enhancedSdk]);

  return {
    sdk: enhancedSdk,
    loading,
    error,
    lastOperation,
    lastResult,
    refetch: lastOperation ? enhancedSdk[lastOperation] : null,
    clearError: () => setError(null)
  };
};

/**
 * Custom hook for executing a specific Mesh SDK query
 * This provides a more Apollo-like experience for components that need a single query
 * 
 * @param {string} queryName - The name of the SDK query function to execute
 * @param {Object} queryArgs - Arguments to pass to the query function
 * @param {Object} options - Additional options similar to Apollo useQuery
 * @returns {Object} Result object with data, loading, error, and refetch
 */
export const useMeshQuery = (queryName, queryArgs = {}, options = {}) => {
  const { 
    skip = false, 
    pollInterval = 0,
    shouldRefetchOnMount = true,
    shouldRefetchOnFocus = false
  } = options;
  
  const { sdk, loading, error, lastResult } = useMeshSdk({
    shouldRefetchOnMount,
    shouldRefetchOnFocus
  });

  const [data, setData] = useState(null);
  const [queryLoading, setQueryLoading] = useState(true);
  const [queryError, setQueryError] = useState(null);

  // Execute the query
  const executeQuery = useCallback(async () => {
    if (skip || !sdk[queryName]) return;
    
    setQueryLoading(true);
    try {
      const result = await sdk[queryName](queryArgs);
      setData(result);
      setQueryLoading(false);
      return result;
    } catch (err) {
      setQueryError(err);
      setQueryLoading(false);
    }
  }, [skip, sdk, queryName, queryArgs]);

  // Initial query execution
  useEffect(() => {
    if (shouldRefetchOnMount) {
      executeQuery();
    }
  }, [executeQuery, shouldRefetchOnMount]);

  // Polling
  useEffect(() => {
    if (pollInterval <= 0 || skip) return undefined;
    
    const intervalId = setInterval(() => {
      executeQuery();
    }, pollInterval);
    
    return () => clearInterval(intervalId);
  }, [pollInterval, executeQuery, skip]);

  return {
    data,
    loading: queryLoading,
    error: queryError,
    refetch: executeQuery
  };
};

export default useMeshSdk;