import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.$size === 'small' ? '10px' : '20px'};
`;

const Spinner = styled.div`
  border: ${props => props.$size === 'small' ? '2px' : '4px'} solid #f3f3f3;
  border-top: ${props => props.$size === 'small' ? '2px' : '4px'} solid #3498db;
  border-radius: 50%;
  width: ${props => {
    switch (props.$size) {
      case 'small': return '20px';
      case 'large': return '50px';
      default: return '30px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'small': return '20px';
      case 'large': return '50px';
      default: return '30px';
    }
  }};
  animation: ${spin} 1s linear infinite;
  margin-bottom: ${props => props.$size === 'small' ? '5px' : '10px'};
`;

const SpinnerText = styled.p`
  margin: 0;
  color: #666;
  font-size: ${props => props.$size === 'small' ? '12px' : '14px'};
`;

/**
 * Reusable loading spinner component
 * @param {Object} props - Component props
 * @param {string} [props.size='medium'] - Size of spinner ('small', 'medium', 'large')
 * @param {string} [props.message='Loading...'] - Text to display below spinner
 */
const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  return (
    <SpinnerContainer $size={size}>
      <Spinner $size={size} />
      {message && <SpinnerText $size={size}>{message}</SpinnerText>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;