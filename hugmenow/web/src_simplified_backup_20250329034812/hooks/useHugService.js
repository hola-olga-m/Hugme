import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { initApolloClient } from '../services/hugService';

/**
 * Hook to initialize the Apollo client in the hug service
 * This ensures the hug service has access to the Apollo client for GraphQL operations
 */
export const useHugService = () => {
  const client = useApolloClient();
  
  useEffect(() => {
    if (client) {
      initApolloClient(client);
    }
  }, [client]);
  
  return { initialized: !!client };
};

export default useHugService;