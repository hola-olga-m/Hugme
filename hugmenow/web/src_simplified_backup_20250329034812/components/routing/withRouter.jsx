import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// This is a Higher Order Component that wraps a component with router props
// It's used to provide router functionality to class components
export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    
    return (
      <Component
        navigate={navigate}
        params={params}
        location={location}
        {...props}
      />
    );
  };
  
  // Set display name for debugging
  const displayName = Component.displayName || Component.name || 'Component';
  Wrapper.displayName = `withRouter(${displayName})`;
  
  return Wrapper;
};