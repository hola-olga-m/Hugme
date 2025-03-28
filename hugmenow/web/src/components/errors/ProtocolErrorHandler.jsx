import React from 'react';
import { Link } from 'react-router-dom';

const ProtocolErrorHandler = ({ error }) => {
  // Extract error information
  const errorMessage = error?.message || 'Unknown protocol error';
  const isGraphQLError = errorMessage.includes('GraphQL');

  // Apply automatic fixes based on known GraphQL errors
  const applyAutoFix = () => {
    // Run the fix-graphql.js script
    fetch('/api/run-fix-script', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Fixes applied successfully. Reloading the page...');
          window.location.reload();
        } else {
          alert('Error applying fixes: ' + data.error);
        }
      })
      .catch(err => {
        console.error('Error applying fixes:', err);
        alert('Failed to apply fixes. Please try reloading the page manually.');
      });
  };

  // Handle common GraphQL schema mismatch errors
  const getErrorGuidance = () => {
    if (errorMessage.includes('Cannot query field')) {
      const match = errorMessage.match(/Cannot query field "([^"]+)" on type "([^"]+)"/);
      if (match) {
        const [_, field, type] = match;
        return (
          <div>
            <p>The field <code>{field}</code> doesn't exist on type <code>{type}</code>.</p>
            <p>This might be due to a schema update. The app will attempt to fix this automatically.</p>
          </div>
        );
      }
    } else if (errorMessage.includes('must have a selection of subfields')) {
      return (
        <div>
          <p>This type requires you to select specific fields rather than requesting the whole object.</p>
          <p>The app will attempt to fix this automatically.</p>
        </div>
      );
    }

    return (
      <div>
        <p>This error indicates a mismatch between client queries and server schema.</p>
        <p>The app will attempt to fix this automatically.</p>
      </div>
    );
  };

  return (
    <div className="protocol-error-container">
      <h2>Protocol Error Detected</h2>
      <div className="error-details">
        <p><strong>Error Type:</strong> {isGraphQLError ? 'GraphQL Error' : 'Network Protocol Error'}</p>
        <p><strong>Error Message:</strong> {errorMessage}</p>

        {isGraphQLError && (
          <div className="graphql-guidance">
            <h3>GraphQL Error Guidance</h3>
            {getErrorGuidance()}
            <div className="auto-fix-section">
              <button 
                onClick={applyAutoFix}
                className="auto-fix-button"
              >
                Apply Automatic Fix
              </button>
              <p className="auto-fix-note">
                This will run the fix-graphql.js script to update queries to match the current schema.
              </p>
            </div>
          </div>
        )}

        <div className="error-actions">
          <button onClick={() => window.location.reload()}>Reload Page</button>
          <Link to="/">Return to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ProtocolErrorHandler;