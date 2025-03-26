import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--gray-100);
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid var(--gray-200);
  border-top: 6px solid var(--primary-color);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  margin-top: 1.5rem;
  color: var(--gray-600);
  font-size: 1.1rem;
  font-weight: 500;
`;

const LoadingScreen = ({ text = 'Loading...' }) => {
  return (
    <LoadingScreenContainer>
      <Spinner />
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingScreenContainer>
  );
};

export default LoadingScreen;