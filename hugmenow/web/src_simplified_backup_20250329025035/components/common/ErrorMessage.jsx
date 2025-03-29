import React from 'react';
import styled from 'styled-components';
import { detectErrorType, getErrorMessage } from '../../utils/errorHandling';

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

const ErrorMessage = ({ error, context = {} }) => {
  // Default error if none provided
  if (!error) {
    return (
      <ErrorContainer>
        <ErrorTitle>An unknown error occurred</ErrorTitle>
        <ErrorDetails>
          Please try again later or contact support if the problem persists.
        </ErrorDetails>
      </ErrorContainer>
    );
  }

  // Parse the error
  const errorType = detectErrorType(error, context);
  const errorMessage = getErrorMessage(errorType);
  
  // Get the error message (might be nested in different ways)
  const message = error.message || 
                 (error.graphQLErrors && error.graphQLErrors[0]?.message) || 
                 'An unknown error occurred';
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  return (
    <ErrorContainer>
      <ErrorTitle>{errorMessage.title}</ErrorTitle>
      <ErrorDetails>
        {errorMessage.description}
      </ErrorDetails>
      <ErrorDetails>
        <strong>Details:</strong> {message}
      </ErrorDetails>
      <ErrorAction>
        <button onClick={handleRefresh}>Refresh the page</button>
      </ErrorAction>
    </ErrorContainer>
  );
};

export default ErrorMessage;