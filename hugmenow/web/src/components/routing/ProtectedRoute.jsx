
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../common/Loading';
import { logAuthStatus } from '../common/debug-auth';

const ProtectedRoute = ({ children, requireAuth = true }) => {
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
      timeoutReached,
      requireAuth,
      currentPath: location.pathname,
      user: user ? { id: user.id, name: user.name } : null
    });
  }, [isAuthenticated, loading, timeoutReached, user, location.pathname, requireAuth]);

  // Still loading and timeout not reached
  if (loading && !timeoutReached) {
    console.log("ProtectedRoute: Still loading, showing LoadingScreen");
    return <LoadingScreen text="Checking authentication..." />;
  }

  // Handle timeout case
  if (loading && timeoutReached) {
    console.error('Authentication timeout - forcing navigation to login');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Not authenticated but authentication required
  if (!isAuthenticated && requireAuth) {
    console.log("ProtectedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Authenticated and trying to access auth pages (login/register)
  if (isAuthenticated && !requireAuth && location.pathname.includes('/auth')) {
    console.log("ProtectedRoute: Already authenticated, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // All checks passed, render the children
  console.log("ProtectedRoute: Rendering children");
  return children;
};

export default ProtectedRoute;
