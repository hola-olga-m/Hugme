import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * StaticRoute Component
 * A route that doesn't require authentication - always renders regardless of auth state
 * This is a simple pass-through component
 */
const StaticRoute = ({ children }) => {
  return children || <Outlet />;
};

export default StaticRoute;