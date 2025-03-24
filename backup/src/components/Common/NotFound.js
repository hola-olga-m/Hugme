import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        <div className="not-found-actions">
          <Link to="/" className="primary-button">
            Go to Home
          </Link>
          <Link to="/help" className="secondary-button">
            Get Help
          </Link>
        </div>
        <div className="not-found-illustration">
          <img 
            src="/img/404-illustration.svg" 
            alt="404 illustration" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;