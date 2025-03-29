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

/**
 * GraphQL Error Handler Component
 * @param {Object} props - Component props
 * @param {Array} props.errors - GraphQL errors
 * @param {Function} props.onRetry - Retry function
 */
const GraphQLErrorHandler = ({ errors, onRetry }) => {
  const categories = categorizeErrors(errors);
  const hasErrors = Object.values(categories).some(category => category.length > 0);

  if (!hasErrors) return null;

  return (
    <ErrorContainer>
      {categories.network.length > 0 && (
        <>
          <ErrorTitle>Connection Error</ErrorTitle>
          <ErrorDetails>
            Unable to connect to the server. Please check your internet connection.
          </ErrorDetails>
          {onRetry && (
            <ErrorAction>
              <button onClick={onRetry}>Try again</button>
            </ErrorAction>
          )}
        </>
      )}

      {categories.auth.length > 0 && (
        <>
          <ErrorTitle>Authentication Error</ErrorTitle>
          <ErrorDetails>
            You are not authorized to perform this action. Please log in and try again.
          </ErrorDetails>
        </>
      )}

      {categories.schema.length > 0 && (
        <>
          <ErrorTitle>Request Error</ErrorTitle>
          <ErrorDetails>
            There was an error with the request format.
          </ErrorDetails>
          <ErrorList>
            {categories.schema.map((error, index) => (
              <ErrorItem key={index}>{error.message}</ErrorItem>
            ))}
          </ErrorList>
        </>
      )}

      {categories.validation.length > 0 && (
        <>
          <ErrorTitle>Validation Error</ErrorTitle>
          <ErrorList>
            {categories.validation.map((error, index) => (
              <ErrorItem key={index}>{error.message}</ErrorItem>
            ))}
          </ErrorList>
        </>
      )}

      {categories.unknown.length > 0 && (
        <>
          <ErrorTitle>Unexpected Error</ErrorTitle>
          <ErrorDetails>
            An unexpected error occurred. Please try again later.
          </ErrorDetails>
          {onRetry && (
            <ErrorAction>
              <button onClick={onRetry}>Try again</button>
            </ErrorAction>
          )}
        </>
      )}
    </ErrorContainer>
  );
};

export default GraphQLErrorHandler;
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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

const ErrorContainer = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  background-color: #fff8f8;
  border: 1px solid #ffcdd2;
`;

const ErrorTitle = styled.h4`
  color: #d32f2f;
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: #424242;
  margin: 0.5rem 0;
`;

const ErrorDetail = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.85rem;
  color: #616161;
  white-space: pre-wrap;
  overflow-x: auto;
`;

const RetryButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #bdbdbd;
  }
`;

/**
 * GraphQLErrorHandler Component
 * Displays GraphQL errors in a user-friendly way and provides retry functionality
 */
const GraphQLErrorHandler = ({ errors, onRetry }) => {
  const [categorizedErrors, setCategorizedErrors] = useState({});
  
  useEffect(() => {
    setCategorizedErrors(categorizeErrors(errors));
  }, [errors]);
  
  if (!errors || errors.length === 0) {
    return null;
  }
  
  const { network, auth, validation, schema, unknown } = categorizedErrors;
  
  return (
    <ErrorContainer data-testid="graphql-error-handler">
      {network.length > 0 && (
        <>
          <ErrorTitle>Connection Error</ErrorTitle>
          <ErrorMessage>
            We're having trouble connecting to the server. Please check your internet connection and try again.
          </ErrorMessage>
          {network.map((error, index) => (
            <ErrorDetail key={`network-${index}`}>
              {error.message}
            </ErrorDetail>
          ))}
        </>
      )}
      
      {auth.length > 0 && (
        <>
          <ErrorTitle>Authentication Error</ErrorTitle>
          <ErrorMessage>
            You need to be logged in to perform this action. Please sign in and try again.
          </ErrorMessage>
          {auth.map((error, index) => (
            <ErrorDetail key={`auth-${index}`}>
              {error.message}
            </ErrorDetail>
          ))}
        </>
      )}
      
      {validation.length > 0 && (
        <>
          <ErrorTitle>Validation Error</ErrorTitle>
          <ErrorMessage>
            There was an issue with the data provided. Please check your input and try again.
          </ErrorMessage>
          {validation.map((error, index) => (
            <ErrorDetail key={`validation-${index}`}>
              {error.message}
            </ErrorDetail>
          ))}
        </>
      )}
      
      {schema.length > 0 && (
        <>
          <ErrorTitle>Schema Error</ErrorTitle>
          <ErrorMessage>
            There's a technical problem with the request. Our team has been notified.
          </ErrorMessage>
          {schema.map((error, index) => (
            <ErrorDetail key={`schema-${index}`}>
              {error.message}
            </ErrorDetail>
          ))}
        </>
      )}
      
      {unknown.length > 0 && (
        <>
          <ErrorTitle>Unexpected Error</ErrorTitle>
          <ErrorMessage>
            Something went wrong. Please try again later or contact support if the problem persists.
          </ErrorMessage>
          {unknown.map((error, index) => (
            <ErrorDetail key={`unknown-${index}`}>
              {error.message}
            </ErrorDetail>
          ))}
        </>
      )}
      
      {onRetry && (
        <RetryButton onClick={onRetry} data-testid="retry-button">
          Try Again
        </RetryButton>
      )}
    </ErrorContainer>
  );
};

export default GraphQLErrorHandler;
