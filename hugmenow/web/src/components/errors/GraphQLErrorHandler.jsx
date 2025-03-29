import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: var(--danger-color, #e53935);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.p`
  margin: 0;
`;

const ErrorList = styled.ul`
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
`;

/**
 * Component to handle and display GraphQL errors in a user-friendly way
 */
const GraphQLErrorHandler = ({ error }) => {
  if (!error) return null;

  console.error('GraphQL Error:', error);

  // Extract the main message
  let mainMessage = 'An error occurred';
  let detailedErrors = [];

  if (error.message) {
    mainMessage = error.message;
  }

  // Check if it's a network error
  if (error.networkError) {
    mainMessage = 'Network error: Unable to connect to the server';
    if (error.networkError.result && error.networkError.result.errors) {
      detailedErrors = error.networkError.result.errors.map(e => e.message);
    }
  }

  // Check for GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    mainMessage = error.graphQLErrors[0].message;
    detailedErrors = error.graphQLErrors.slice(1).map(e => e.message);

    // Check for validation errors in extensions
    const firstError = error.graphQLErrors[0];
    if (firstError.extensions && firstError.extensions.validation) {
      const validationErrors = firstError.extensions.validation;
      detailedErrors = Object.keys(validationErrors).map(field => {
        return `${field}: ${validationErrors[field].join(', ')}`;
      });
    }
  }

  // Check if it's a specific error like username/email already exists
  if (mainMessage.includes('already exists')) {
    if (mainMessage.includes('Username')) {
      mainMessage = 'This username is already taken. Please choose another one.';
    } else if (mainMessage.includes('Email')) {
      mainMessage = 'This email is already registered. Please use another email or try logging in.';
    }
  }

  // Handle connection errors specifically for account creation
  if (mainMessage.includes('Failed to fetch') || 
      mainMessage.includes('Network error') || 
      error.toString().includes('Failed to fetch')) {
    mainMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  return (
    <ErrorContainer role="alert" aria-live="assertive">
      <ErrorMessage>{mainMessage}</ErrorMessage>
      {detailedErrors.length > 0 && (
        <ErrorList>
          {detailedErrors.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ErrorList>
      )}
    </ErrorContainer>
  );
};

GraphQLErrorHandler.propTypes = {
  error: PropTypes.object
};

export default GraphQLErrorHandler;