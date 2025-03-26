import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define animations
const pulse = keyframes`
  0% {
    opacity: 0.6;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.6;
    transform: scale(0.98);
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: ${props => props.transparent ? 'transparent' : '#f8f9fa'};
  position: ${props => props.fixed ? 'fixed' : 'absolute'};
  top: 0;
  left: 0;
  z-index: ${props => props.zIndex || 1000};
`;

const LoadingSpinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #0066ff;
  animation: ${spin} 1s ease-in-out infinite;
  margin-bottom: 20px;
`;

const LoadingText = styled.div`
  font-size: 18px;
  color: #333;
  animation: ${pulse} 1.5s ease-in-out infinite;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

/**
 * Loading screen component to show during async operations
 * 
 * @param {Object} props - Component props
 * @param {string} props.text - Text to display under the spinner
 * @param {string} props.size - Size of the spinner (e.g., '40px')
 * @param {boolean} props.transparent - Whether background should be transparent
 * @param {boolean} props.fixed - Whether position should be fixed or absolute
 * @param {number} props.zIndex - Z-index value for the container
 */
const LoadingScreen = ({ 
  text = 'Loading...', 
  size = '40px',
  transparent = false,
  fixed = true,
  zIndex = 1000
}) => {
  return (
    <LoadingContainer transparent={transparent} fixed={fixed} zIndex={zIndex}>
      <LoadingSpinner size={size} />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingScreen;