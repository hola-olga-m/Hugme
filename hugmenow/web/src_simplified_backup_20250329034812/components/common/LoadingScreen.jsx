import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Enhanced animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const breathe = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.3; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Enhanced styled components with modern design
const LoadingScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--primary-lightest) 0%, 
    var(--background-color) 100%
  );
  position: relative;
  overflow: hidden;
  
  &::before, &::after {
    content: "";
    position: absolute;
    width: 40vw;
    height: 40vw;
    border-radius: 50%;
    z-index: 0;
    opacity: 0.05;
  }
  
  &::before {
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    top: -10%;
    right: -10%;
    animation: ${pulse} 15s infinite alternate;
  }
  
  &::after {
    background: linear-gradient(to right, var(--tertiary-color), var(--primary-color));
    bottom: -10%;
    left: -10%;
    animation: ${pulse} 15s infinite alternate-reverse;
  }
`;

const LoadingCard = styled.div`
  background: var(--glassmorph-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  -webkit-backdrop-filter: blur(var(--backdrop-blur));
  border-radius: var(--radius-xl);
  border: 1px solid var(--glassmorph-border);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  animation: ${fadeIn} 0.8s ease-out;
  min-width: 280px;
`;

const Spinner = styled.div`
  width: 70px;
  height: 70px;
  border: 4px solid var(--primary-alpha-20);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: ${spin} 1.2s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
  box-shadow: 0 0 15px var(--primary-alpha-20);
  margin-bottom: var(--spacing-lg);
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    border-radius: 50%;
    background-color: var(--primary-alpha-10);
    animation: ${breathe} 2s infinite;
  }
`;

const LoadingText = styled.div`
  margin-top: var(--spacing-sm);
  color: var(--text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  text-align: center;
  max-width: 80%;
`;

const LoadingSubtext = styled.div`
  margin-top: var(--spacing-xs);
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 0.5s;
  opacity: 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: var(--gray-200);
  border-radius: var(--radius-pill);
  margin-top: var(--spacing-lg);
  overflow: hidden;
  position: relative;
`;

const ProgressIndicator = styled.div`
  height: 100%;
  background: linear-gradient(90deg, 
    var(--primary-color) 0%, 
    var(--secondary-color) 50%,
    var(--tertiary-color) 100%
  );
  border-radius: var(--radius-pill);
  width: ${props => props.progress || 0}%;
  transition: width 0.5s ease;
  background-size: 200% 100%;
  animation: gradientShift 2s linear infinite;
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
`;

// Loading tips to display randomly
const loadingTips = [
  "Track your mood daily for best results",
  "Virtual hugs boost mental wellbeing",
  "Remember to breathe deeply when stressed",
  "Connecting with others improves mood",
  "Small moments of joy add up to happiness"
];

const LoadingScreen = ({ text = 'Loading...' }) => {
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState('');
  
  useEffect(() => {
    // Select a random tip
    const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    setTip(randomTip);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + Math.random() * 10;
        return newProgress > 95 ? 95 : newProgress; // Cap at 95% for realistic loading feel
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <LoadingScreenContainer>
      <LoadingCard>
        <Spinner />
        {text && <LoadingText>{text}</LoadingText>}
        <LoadingSubtext>Tip: {tip}</LoadingSubtext>
        <ProgressBar>
          <ProgressIndicator progress={progress} />
        </ProgressBar>
      </LoadingCard>
    </LoadingScreenContainer>
  );
};

export default LoadingScreen;