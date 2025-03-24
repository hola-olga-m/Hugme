import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();

  // If still checking authentication status, show loading
  if (isLoading) {
    return <Loading fullScreen text="Checking authentication..." />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If role is required, check if user has role
  if (requiredRole && (!currentUser?.roles || !currentUser.roles.includes(requiredRole))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authenticated and has required role
  return children;
};

export default ProtectedRoute;