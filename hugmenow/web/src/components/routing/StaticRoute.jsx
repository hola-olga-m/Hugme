import React from 'react';
import SimpleLayout from '../../layouts/SimpleLayout';

/**
 * StaticRoute component
 * Used for routes that should always be accessible without authentication
 * or theme context dependencies
 */
const StaticRoute = ({ children }) => {
  return (
    <SimpleLayout>
      {children}
    </SimpleLayout>
  );
};

export default StaticRoute;