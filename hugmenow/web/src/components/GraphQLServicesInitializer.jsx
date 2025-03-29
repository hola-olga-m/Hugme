import React from 'react';
import useHugService from '../hooks/useHugService';
import useHugMoodAPI from '../hooks/useHugMoodAPI';

/**
 * Component that initializes GraphQL services
 * This ensures that all services have access to the Apollo client
 */
const GraphQLServicesInitializer = ({ children }) => {
  // Initialize the hug service with Apollo client
  const hugServiceStatus = useHugService();
  
  // Initialize the HugMood API service with Apollo client
  const hugMoodAPIStatus = useHugMoodAPI();
  
  // Log initialization status
  React.useEffect(() => {
    console.log('GraphQL Services Initialization:', {
      hugService: hugServiceStatus.initialized,
      hugMoodAPI: hugMoodAPIStatus.initialized
    });
  }, [hugServiceStatus.initialized, hugMoodAPIStatus.initialized]);
  
  return <>{children}</>;
};

export default GraphQLServicesInitializer;