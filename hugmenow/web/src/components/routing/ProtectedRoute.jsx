import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../common/LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const location = useLocation();

  // Add some debugging
  console.log('ProtectedRoute Component - Auth State:', {
    isAuthenticated,
    loading,
    hasUser: !!currentUser,
    userId: currentUser?.id,
    username: currentUser?.username
  });
  
  // Show loading state if auth is still being determined
  if (loading) {
    return <LoadingScreen text="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  // Fix: isAuthenticated is a boolean value, not a function
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  console.log('ProtectedRoute: User is authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;