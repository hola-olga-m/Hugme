import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GraphQLErrorHandler = ({ error, children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Handle authentication errors
  React.useEffect(() => {
    if (!error) return;

    console.error('GraphQL Error:', error);

    // Check for authentication errors
    const isAuthError = 
      error.graphQLErrors?.some(e => 
        e.extensions?.code === 'UNAUTHENTICATED' || 
        e.message?.includes('not authenticated') ||
        e.message?.includes('jwt')
      ) ||
      error.networkError?.result?.errors?.some(e =>
        e.extensions?.code === 'UNAUTHENTICATED' ||
        e.message?.includes('not authenticated') ||
        e.message?.includes('jwt')
      );

    if (isAuthError) {
      console.log('Authentication error detected, logging out');
      logout();
      navigate('/login', { 
        state: { message: 'Your session has expired. Please log in again.' } 
      });
    }
  }, [error, logout, navigate]);

  return children;
};

export default GraphQLErrorHandler;