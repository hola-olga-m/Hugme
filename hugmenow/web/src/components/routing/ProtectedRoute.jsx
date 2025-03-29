
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../common/LoadingScreen';
import { logAuthStatus, checkAuthToken } from '../common/debug-auth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const [timeoutReached, setTimeoutReached] = useState(false);
  
  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        console.warn('Authentication check timeout reached after 5 seconds');
        setTimeoutReached(true);
      }, 5000); // 5 second timeout
      
      return () => clearTimeout(timeoutId);
    }
  }, [loading]);
  
  // Enhanced debugging
  useEffect(() => {
    logAuthStatus('ProtectedRoute Component - Auth State', {
      isAuthenticated,
      loading,
      hasUser: !!user,
      userId: user?.id,
      username: user?.name,
      hasToken: checkAuthToken(),
      currentPath: location.pathname
    });
  }, [isAuthenticated, loading, user, location]);

  // Show timeout error if loading takes too long
  if (loading && !timeoutReached) {
    return <LoadingScreen text="Checking authentication..." />;
  }
  
  // Handle timeout case
  if (loading && timeoutReached) {
    console.error('Authentication timeout - forcing navigation to login');
    return <Navigate to="/auth/login" state={{ from: location, timeout: true }} replace />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  console.log('ProtectedRoute: User is authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;
