import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute component
 * This component is used to wrap routes that require authentication
 * It will redirect to the login page if the user is not authenticated
 * It will show a loading state while checking authentication
 */
const ProtectedRoute = ({ children }) => {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <p>{t('app.loading')}</p>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Return the children or the Outlet (for nested routes)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;