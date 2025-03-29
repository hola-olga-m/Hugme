
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../common/Loading';
import { logAuthStatus } from '../common/debug-auth';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading, currentUser, hasToken } = useAuth();
  const location = useLocation();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        console.warn('[Auth Debug] Authentication check timeout reached after 5 seconds');
        setTimeoutReached(true);
      }, 5000); // 5 second timeout

      return () => clearTimeout(timeoutId);
    }
  }, [loading]);

  // Log authentication state for debugging
  useEffect(() => {
    console.log('[Auth Debug] ProtectedRoute Component - Auth State:', {
      isAuthenticated,
      loading,
      timeoutReached,
      requireAuth,
      hasToken: hasToken ? hasToken() : false,
      currentPath: location.pathname,
      currentUser: currentUser ? { id: currentUser.id, name: currentUser.name } : null
    });
  }, [isAuthenticated, loading, timeoutReached, currentUser, location.pathname, requireAuth, hasToken]);

  // Still loading and timeout not reached
  if (loading && !timeoutReached) {
    console.log("[Auth Debug] ProtectedRoute: Still loading, showing LoadingScreen");
    return <LoadingScreen 
      text="Checking authentication..." 
      showTimeoutAfter={3000}
      timeoutMessage="Still verifying your authentication. Please wait a moment." 
    />;
  }

  // Handle timeout case - Try to continue with whatever auth state we have
  if (loading && timeoutReached) {
    console.warn('[Auth Debug] Authentication timeout - using best effort auth state');
    
    // If we have a token, assume authenticated for better UX
    if (hasToken && hasToken()) {
      console.log('[Auth Debug] Token exists despite timeout, attempting to proceed');
      // Continue with the protected route
      return children;
    } else {
      console.error('[Auth Debug] No token found after timeout, redirecting to login');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
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
