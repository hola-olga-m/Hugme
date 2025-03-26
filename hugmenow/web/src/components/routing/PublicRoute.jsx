import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../common/LoadingScreen';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const location = useLocation();

  // Show loading screen while auth is being determined
  console.log('PublicRoute - Loading:', loading);
  if (loading) {
    return <LoadingScreen text="Loading..." />;
  }

  // Add debugging info
  console.log('PublicRoute - Auth state:', {
    isAuthenticated,
    hasCurrentUser: !!currentUser,
    currentUser
  });

  // If user is authenticated and tries to access a public route (like login),
  // redirect to dashboard or the page they were trying to reach before
  if (isAuthenticated) {
    console.log('PublicRoute - User is authenticated, redirecting to dashboard');
    const redirectTo = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  // Render children for public routes when user is not authenticated
  console.log('PublicRoute - Not authenticated, rendering children');
  return children;
};

export default PublicRoute;