
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
  color: var(--gray-700);
  font-size: 0.9rem;
  text-align: center;
  max-width: 300px;
  background-color: var(--gray-200);
  padding: 0.75rem;
  border-radius: var(--border-radius-md);
`;

/**
 * Enhanced loading screen component with timeout handling
 * @param {Object} props Component props
 * @param {string} props.text Text to display while loading
 * @param {number} props.timeout Timeout in milliseconds (default: 5000)
 * @param {string} props.timeoutMessage Message to display after timeout
 * @param {Function} props.onTimeout Callback function to execute on timeout
 */
const EnhancedLoadingScreen = ({ 
  text = "Loading...", 
  timeout = 5000,
  timeoutMessage = "This is taking longer than expected. Please check your connection.",
  onTimeout = null
}) => {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
      if (onTimeout) onTimeout();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onTimeout]);

  return (
    <LoadingContainer>
      <LoadingSpinner />
      <LoadingText>{text}</LoadingText>
      {timedOut && <TimeoutMessage>{timeoutMessage}</TimeoutMessage>}
    </LoadingContainer>
  );
};

export default EnhancedLoadingScreen;
