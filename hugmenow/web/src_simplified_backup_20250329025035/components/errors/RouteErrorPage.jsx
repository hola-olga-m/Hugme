import React from 'react';
import { useLocation } from 'react-router-dom';
import AnimatedErrorState from './AnimatedErrorState';

const RouteErrorPage = () => {
  const location = useLocation();
  
  // Get the path that wasn't found
  const { pathname } = location;
  
  return (
    <AnimatedErrorState
      title="Page Not Found"
      description={`The page "${pathname}" you're looking for doesn't exist or has been moved.`}
      errorType="route"
      actionText="Go to Home"
      actionLink="/"
      secondaryAction={{
        text: "Go Back",
        onClick: () => window.history.back()
      }}
    />
  );
};

export default RouteErrorPage;