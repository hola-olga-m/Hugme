
import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: var(--danger-color, #ff5252);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md, 0.375rem);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const ErrorDisplay = ({ children }) => {
  return <ErrorContainer>{children}</ErrorContainer>;
};

export default ErrorDisplay;
