import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { initApolloClient } from '../services/hugmoodAPI';

/**
 * Hook to initialize the Apollo client in the HugMood API service
 * This ensures the service has access to the Apollo client for GraphQL operations
 */
export const useHugMoodAPI = () => {
  const client = useApolloClient();
  
  useEffect(() => {
    if (client) {
      initApolloClient(client);
    }
  }, [client]);
  
  return { initialized: !!client };
};

export default useHugMoodAPI;