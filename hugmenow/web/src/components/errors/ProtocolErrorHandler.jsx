import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProtocolErrorHandler = ({ error }) => {
  const [errorDetails, setErrorDetails] = useState({
    message: 'An error occurred while communicating with the server',
    suggestion: 'Please try again later or contact support',
    canRetry: true,
    isCritical: false
  });

  useEffect(() => {
    if (!error) return;

    console.log('Protocol error handler received:', error);

    // Check if it's a GraphQL error
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const gqlError = error.graphQLErrors[0];
      const message = gqlError.message || '';

      // Detect common GraphQL schema errors
      if (message.includes('Cannot query field')) {
        setErrorDetails({
          message: 'Schema mismatch detected',
          suggestion: 'The application needs to be restarted to fix GraphQL schema issues',
          canRetry: true,
          fixButton: true,
          isCritical: false
        });
      } else if (message.includes('must have a selection of subfields')) {
        setErrorDetails({
          message: 'GraphQL query format error',
          suggestion: 'The application needs to be restarted to fix GraphQL query format',
          canRetry: true,
          fixButton: true,
          isCritical: false
        });
      } else {
        setErrorDetails({
          message: `GraphQL error: ${message}`,
          suggestion: 'Please try again later or contact support',
          canRetry: true,
          isCritical: false
        });
      }
    } 
    // Check if it's a network error
    else if (error.networkError) {
      setErrorDetails({
        message: 'Network error while connecting to the server',
        suggestion: 'Please check your connection and try again',
        canRetry: true,
        isCritical: false
      });
    }
  }, [error]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleFix = () => {
    fetch('/api/fix-graphql', { method: 'POST' })
      .then(() => {
        // Wait briefly then reload
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch(() => {
        // If API call fails, just reload
        window.location.reload();
      });
  };

  return (
    <div className="protocol-error-container">
      <div className="error-card">
        <h2>Communication Error</h2>
        <p className="error-message">{errorDetails.message}</p>
        <p className="error-suggestion">{errorDetails.suggestion}</p>

        <div className="error-actions">
          {errorDetails.canRetry && (
            <button onClick={handleRetry} className="retry-button">
              Retry
            </button>
          )}

          {errorDetails.fixButton && (
            <button onClick={handleFix} className="fix-button">
              Fix & Restart
            </button>
          )}

          <Link to="/" className="home-link">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProtocolErrorHandler;