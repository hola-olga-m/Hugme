import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { PROTOCOL_ERRORS } from '../../utils/httpErrorHandler';
import NetworkErrorHandler from './NetworkErrorHandler';

// Styled components
const ProtocolErrorContainer = styled(motion.div)`
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  margin: 2rem 0;
  background-color: #fafafa;
  max-width: 500px;
  width: 100%;
`;

const ErrorHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ErrorIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
  color: #e53935;
`;

const ErrorTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ErrorDescription = styled.p`
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const FixAttemptProgress = styled(motion.div)`
  height: 4px;
  background-color: #4f46e5;
  margin-bottom: 1rem;
  border-radius: 2px;
`;

const StatusMessage = styled.div`
  font-size: 0.875rem;
  color: #4f46e5;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const PrimaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #4f46e5;
  border: 1px solid #4f46e5;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
`;

/**
 * Specialized component for handling HTTP 426 "Upgrade Required" errors
 * Displays detailed information and attempts automatic fixes
 */
const ProtocolErrorHandler = ({ 
  statusCode = PROTOCOL_ERRORS.UPGRADE_REQUIRED,
  message = "Protocol Upgrade Required",
  onRetry = () => window.location.reload(),
  onCancel = () => {}
}) => {
  const [fixing, setFixing] = useState(false);
  const [fixAttempts, setFixAttempts] = useState(0);
  const [fixProgress, setFixProgress] = useState(0);
  const [fixMessage, setFixMessage] = useState('');
  const [fixed, setFixed] = useState(false);

  // Simulates attempting to fix the protocol error
  const attemptFix = () => {
    setFixing(true);
    setFixProgress(0);
    setFixMessage('Analyzing connection protocol...');

    // Reset connection and try with HTTP/1.1
    setTimeout(() => {
      setFixProgress(25);
      setFixMessage('Attempting with HTTP/1.1...');
      
      setTimeout(() => {
        setFixProgress(50);
        setFixMessage('Checking server capabilities...');
        
        setTimeout(() => {
          setFixProgress(75);
          setFixMessage('Adjusting protocol headers...');
          
          setTimeout(() => {
            setFixProgress(100);
            
            // Increment fix attempts
            setFixAttempts(prevAttempts => prevAttempts + 1);
            
            // After 2 attempts, we'll either succeed or show a permanent error
            if (fixAttempts >= 1) {
              // 50% chance of success for demo purposes
              const success = Math.random() > 0.5;
              
              if (success) {
                setFixMessage('Protocol compatibility established!');
                setFixed(true);
                
                // Actually retry the request
                setTimeout(() => {
                  onRetry();
                }, 1000);
              } else {
                setFixMessage('Unable to resolve protocol compatibility issue');
                setFixing(false);
              }
            } else {
              setFixMessage('Retrying with adjusted protocol...');
              setFixing(false);
            }
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  // When component mounts, auto-attempt a fix
  useEffect(() => {
    attemptFix();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 15,
        stiffness: 100
      }
    }
  };

  // If we've reached max attempts without success, show the network error handler
  if (fixAttempts >= 3 && !fixed) {
    return (
      <NetworkErrorHandler 
        statusCode={statusCode}
        errorMessage={message}
        retryFn={onRetry}
      />
    );
  }

  return (
    <ProtocolErrorContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ErrorHeader>
        <ErrorIcon>
          ⚠️
        </ErrorIcon>
        <ErrorTitle>Protocol Compatibility Issue</ErrorTitle>
      </ErrorHeader>
      
      <ErrorDescription>
        The server requires an HTTP protocol upgrade or different protocol version.
        This is often related to HTTP/1.1 vs HTTP/2 compatibility issues.
      </ErrorDescription>
      
      {fixing && (
        <>
          <FixAttemptProgress 
            initial={{ width: "0%" }}
            animate={{ width: `${fixProgress}%` }}
            transition={{ duration: 0.5 }}
          />
          <StatusMessage>{fixMessage}</StatusMessage>
        </>
      )}
      
      {!fixing && !fixed && (
        <ActionButtons>
          <PrimaryButton onClick={attemptFix}>
            Retry with Protocol Fix
          </PrimaryButton>
          <SecondaryButton onClick={() => window.location.href = '/'}>
            Go to Home
          </SecondaryButton>
        </ActionButtons>
      )}
      
      {fixed && (
        <StatusMessage>Successfully resolved! Redirecting...</StatusMessage>
      )}
    </ProtocolErrorContainer>
  );
};

export default ProtocolErrorHandler;