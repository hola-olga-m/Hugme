import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: #fff8f8;
  border-left: 4px solid #e74c3c;
  border-radius: 4px;
  padding: 12px 15px;
  margin: 10px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ErrorTitle = styled.h4`
  color: #c0392b;
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
`;

const ErrorText = styled.p`
  color: #555;
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
`;

const ErrorDetails = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #ffe6e6;
  font-size: 12px;
  color: #777;
  font-family: monospace;
  white-space: pre-wrap;
  overflow-x: auto;
`;

/**
 * Error message component for displaying user-friendly error notifications
 * @param {Object} props - Component props
 * @param {string} props.message - Main error message to display
 * @param {string} [props.title='Error'] - Title of the error message
 * @param {string} [props.details] - Optional technical details (for developers)
 * @param {boolean} [props.showDetails=false] - Whether to show technical details
 */
const ErrorMessage = ({ 
  message, 
  title = 'Error',
  details = null,
  showDetails = false 
}) => {
  return (
    <ErrorContainer>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorText>{message}</ErrorText>
      {showDetails && details && (
        <ErrorDetails>{details}</ErrorDetails>
      )}
    </ErrorContainer>
  );
};

export default ErrorMessage;