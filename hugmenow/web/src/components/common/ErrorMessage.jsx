import React from 'react';
import styled from 'styled-components';
import { detectErrorType, getErrorMessage } from '../../utils/errorHandling';

const ErrorContainer = styled.div`
  background-color: var(--danger-light);
  border: 1px solid var(--danger-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 1rem 0;
  color: var(--danger-dark);
`;

const ErrorTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const ErrorDetails = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const RetryButton = styled.button`
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
  font-size: 0.85rem;
  
  &:hover {
    background-color: var(--danger-dark);
  }
`;

const ErrorMessage = ({ error, onRetry }) => {
  const errorType = detectErrorType(error);
  const { title, description } = getErrorMessage(errorType);
  
  return (
    <ErrorContainer>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorDetails>{description}</ErrorDetails>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          Try Again
        </RetryButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorMessage;