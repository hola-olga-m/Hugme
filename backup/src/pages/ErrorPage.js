import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1>Oops!</h1>
        <h2>Something went wrong</h2>
        <p>We're sorry, but we couldn't process your request.</p>
        <div className="error-actions">
          <Link to="/" className="primary-button">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;