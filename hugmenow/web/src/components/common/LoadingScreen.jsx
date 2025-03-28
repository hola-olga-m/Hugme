import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--gray-100);
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--primary-color);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  color: var(--gray-600);
  font-size: 0.9rem;
`;

const TimeoutMessage = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--gray-200);
  border-radius: var(--border-radius-md);
  color: var(--gray-700);
  max-width: 300px;
  text-align: center;
`;

/**
 * Simple loading screen component
 * For a more feature-rich version, see EnhancedLoadingScreen
 */
const LoadingScreen = ({ 
  text = "Loading...", 
  showTimeoutAfter = 5000,
  timeoutMessage = "This is taking longer than expected."
}) => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    if (showTimeoutAfter > 0) {
      const timer = setTimeout(() => {
        setShowTimeout(true);
      }, showTimeoutAfter);

      return () => clearTimeout(timer);
    }
  }, [showTimeoutAfter]);

  return (
    <LoadingContainer>
      <LoadingSpinner />
      <LoadingText>{text}</LoadingText>
      {showTimeout && <TimeoutMessage>{timeoutMessage}</TimeoutMessage>}
    </LoadingContainer>
  );
};

export default LoadingScreen;