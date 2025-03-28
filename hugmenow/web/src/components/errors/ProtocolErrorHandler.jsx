
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// GraphQL error mappings for automatic fixes
const GRAPHQL_ERROR_MAPPINGS = {
  'Cannot query field "userMoods" on type "Query"': {
    message: 'The "userMoods" field has been renamed to "moods" in the current API version.',
    replacement: {
      from: 'userMoods',
      to: 'moods'
    }
  },
  'Cannot query field "sentHugs" on type "Query"': {
    message: 'The "sentHugs" field has been renamed to "hugs" in the current API version.',
    replacement: {
      from: 'sentHugs',
      to: 'hugs'
    }
  },
  'Cannot query field "receivedHugs" on type "Query"': {
    message: 'The "receivedHugs" field has been consolidated to "hugs" in the current API version.',
    replacement: {
      from: 'receivedHugs',
      to: 'hugs'
    }
  },
  // friendsMoods has been completely removed from the schema
  // and this error mapping is no longer needed
  'Cannot query field "score" on type "PublicMood"': {
    message: 'The "score" field has been renamed to "intensity" in the current API version.',
    replacement: {
      from: 'score',
      to: 'intensity'
    }
  },
  'Field "moodStreak" of type "MoodStreak" must have a selection of subfields': {
    message: 'The "moodStreak" field requires subfield selection.',
    replacement: {
      from: /moodStreak\s*{?[^{]*?}/g,
      to: 'moodStreak { count currentStreak longestStreak }'
    }
  }
};

// Helper function to find matching error pattern
function findMatchingErrorMapping(errorMessage) {
  for (const pattern in GRAPHQL_ERROR_MAPPINGS) {
    if (errorMessage.includes(pattern)) {
      return GRAPHQL_ERROR_MAPPINGS[pattern];
    }
  }
  return null;
}

// Cache for original and fixed queries to prevent duplicate fixes
const fixedQueriesCache = {};

const ProtocolErrorHandler = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const [fixedQueries, setFixedQueries] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Monitor for any GraphQL errors in the console
  useEffect(() => {
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      originalConsoleError(...args);
      
      // Check if this is a GraphQL error
      if (args[0] && typeof args[0] === 'string' && args[0].includes('[GraphQL error]')) {
        const errorMessage = args[0];
        const mapping = findMatchingErrorMapping(errorMessage);
        
        if (mapping) {
          setErrors(prev => [...prev, { message: errorMessage, mapping }]);
          
          // Apply automatic fix for Apollo operations (monkey patch)
          try {
            if (window.__APOLLO_CLIENT__) {
              const client = window.__APOLLO_CLIENT__;
              
              // Override the query method to apply transformations
              const originalQuery = client.query;
              if (!client._queryPatched) {
                client.query = function(options) {
                  const queryKey = options.query.loc?.source?.body || JSON.stringify(options);
                  
                  // Skip if we've already fixed this query
                  if (fixedQueriesCache[queryKey]) {
                    return originalQuery.apply(this, [fixedQueriesCache[queryKey]]);
                  }
                  
                  // Apply fixes to the query
                  let fixedOptions = { ...options };
                  let queryString = options.query.loc?.source?.body || '';
                  let modified = false;
                  
                  if (queryString) {
                    for (const pattern in GRAPHQL_ERROR_MAPPINGS) {
                      const mapping = GRAPHQL_ERROR_MAPPINGS[pattern];
                      
                      if (mapping.replacement) {
                        // Handle regex or string replacement
                        if (mapping.replacement.from instanceof RegExp) {
                          if (mapping.replacement.from.test(queryString)) {
                            queryString = queryString.replace(mapping.replacement.from, mapping.replacement.to);
                            modified = true;
                          }
                        } else if (queryString.includes(mapping.replacement.from)) {
                          queryString = queryString.replace(
                            new RegExp(mapping.replacement.from, 'g'), 
                            mapping.replacement.to
                          );
                          modified = true;
                        }
                      }
                    }
                    
                    if (modified) {
                      // We need to recreate the query document
                      // This is a simplification - in a real app we'd use the gql tag
                      try {
                        const gql = window.__APOLLO_CACHE__?.documentTransform?.cache?.documentTransform?.cache?.documentTransform?.cache?.makeVar?.prototype?.constructor?.prototype?.constructor?.definitions?.gql || window.gql;
                        
                        if (gql) {
                          fixedOptions.query = gql(queryString);
                          fixedQueriesCache[queryKey] = fixedOptions;
                          setFixedQueries(prev => prev + 1);
                        }
                      } catch (e) {
                        console.warn('Could not patch query:', e);
                      }
                    }
                  }
                  
                  return originalQuery.apply(this, [fixedOptions]);
                };
                client._queryPatched = true;
              }
            }
          } catch (e) {
            console.warn('Error patching Apollo client:', e);
          }
        }
      }
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  // Only show the error UI if we have errors that we've recognized
  if (errors.length === 0) {
    return children;
  }

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffe9e9',
        border: '1px solid #ffcaca',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#d32f2f', marginTop: 0 }}>API Schema Compatibility Issue</h2>
        <p>
          The application is encountering GraphQL schema compatibility issues. 
          The error handler has detected and is attempting to fix {errors.length} schema 
          mismatches. {fixedQueries > 0 ? `${fixedQueries} queries have been automatically fixed.` : ''}
        </p>

        <div style={{ marginTop: '10px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#d32f2f',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Refresh Page
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#757575',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go Home
          </button>
        </div>
      </div>

      <div>
        <h3>Details</h3>
        <ul style={{ 
          listStyleType: 'none',
          padding: 0,
          margin: 0
        }}>
          {errors.map((error, index) => (
            <li key={index} style={{
              backgroundColor: '#f5f5f5',
              padding: '12px',
              marginBottom: '8px',
              borderRadius: '4px',
              borderLeft: '4px solid #d32f2f'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {error.mapping.message}
              </div>
              <div style={{ 
                fontSize: '14px',
                fontFamily: 'monospace',
                backgroundColor: '#e0e0e0',
                padding: '8px',
                borderRadius: '4px',
                overflowX: 'auto'
              }}>
                {error.message}
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Resolution Progress</h3>
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '12px',
          borderRadius: '4px'
        }}>
          <p>
            The application is attempting to fix GraphQL queries in real-time.
            {fixedQueries > 0 ? (
              <span> {fixedQueries} queries have been patched. Some components may start working correctly.</span>
            ) : (
              <span> No queries have been fixed yet. Please check the browser console for more details.</span>
            )}
          </p>
        </div>
      </div>
      
      {children}
    </div>
  );
};

export default ProtocolErrorHandler;
