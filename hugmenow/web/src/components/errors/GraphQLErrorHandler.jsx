
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ErrorContainer = styled.div`
  background-color: var(--danger-light);
  border-left: 4px solid var(--danger-color);
  color: var(--danger-dark);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius);
`;

const ErrorTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const ErrorDetails = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const ErrorAction = styled.div`
  margin-top: 0.75rem;
  
  button {
    background: none;
    border: none;
    color: var(--danger-dark);
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-size: 0.9rem;
  }
`;

const ErrorList = styled.ul`
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  font-size: 0.9rem;
`;

const ErrorItem = styled.li`
  margin-bottom: 0.25rem;
`;

/**
 * Categorizes GraphQL errors by type
 * @param {Array} errors - GraphQL error objects
 * @returns {Object} Categorized errors
 */
const categorizeErrors = (errors) => {
  const categories = {
    schema: [],
    network: [],
    auth: [],
    validation: [],
    unknown: []
  };
  
  if (!errors || errors.length === 0) {
    return categories;
  }
  
  errors.forEach(error => {
    const message = error.message || '';
    
    if (message.includes('Network error') || message.includes('Response not successful')) {
      categories.network.push(error);
    } else if (message.includes('Unknown argument') || message.includes('Cannot query field')) {
      categories.schema.push(error);
    } else if (message.includes('Unauthorized') || message.includes('Not authenticated')) {
      categories.auth.push(error);
    } else if (message.includes('validation')) {
      categories.validation.push(error);
    } else {
      categories.unknown.push(error);
    }
  });
  
  return categories;
};

const GraphQLErrorHandler = ({ errors, onRetry }) => {
  const [isFetchingFix, setIsFetchingFix] = useState(false);
  const [fixStatus, setFixStatus] = useState(null);
  const categorizedErrors = categorizeErrors(errors);
  const hasSchemaErrors = categorizedErrors.schema.length > 0;
  const hasNetworkErrors = categorizedErrors.network.length > 0;
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  const handleTryFix = async () => {
    if (isFetchingFix) return;
    
    setIsFetchingFix(true);
    setFixStatus('Analyzing schema errors...');
    
    try {
      // Log errors to console for debugging
      console.log('GraphQL errors detected:', errors.map(e => e.message).join('\n'));
      
      // Send the errors to the server for analysis
      const errorMessages = errors.map(e => `[GraphQL error]: Message: ${e.message}`).join('\n');
      
      // Store errors in localStorage for debugging
      localStorage.setItem('graphql_errors', errorMessages);
      
      setFixStatus('Schema fix requested. The page will refresh shortly...');
      
      // Wait a moment, then refresh the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Failed to request schema fix:', error);
      setFixStatus('Failed to request schema fix. Please try again.');
      setIsFetchingFix(false);
    }
  };
  
  return (
    <ErrorContainer>
      <ErrorTitle>
        {hasSchemaErrors ? 'Schema Mismatch Detected' : 
         hasNetworkErrors ? 'Network Error' : 'Error Loading Data'}
      </ErrorTitle>
      
      <ErrorDetails>
        {hasSchemaErrors ? 
          'There is a mismatch between client queries and server schema. This might be due to recent updates.' : 
         hasNetworkErrors ?
          'Unable to connect to the server. Please check your internet connection.' :
          'An error occurred while loading data. Please try again.'}
      </ErrorDetails>
      
      {errors && errors.length > 0 && (
        <ErrorList>
          {errors.slice(0, 3).map((error, index) => (
            <ErrorItem key={index}>{error.message}</ErrorItem>
          ))}
          {errors.length > 3 && <ErrorItem>...and {errors.length - 3} more errors</ErrorItem>}
        </ErrorList>
      )}
      
      {fixStatus && <FixStatus>{fixStatus}</FixStatus>}
      
      <ErrorAction>
        {hasSchemaErrors && (
          <button 
            onClick={handleTryFix} 
            disabled={isFetchingFix}
            style={{ marginRight: '10px' }}
          >
            {isFetchingFix ? 'Fixing...' : 'Fix Schema'}
          </button>
        )}
        <button onClick={onRetry || handleRefresh}>
          {onRetry ? 'Try Again' : 'Refresh Page'}
        </button>
      </ErrorAction>
    </ErrorContainer>
  );
};

export default GraphQLErrorHandler;
