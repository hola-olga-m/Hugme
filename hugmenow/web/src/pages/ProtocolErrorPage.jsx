import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ProtocolErrorHandler from '../components/errors/ProtocolErrorHandler';
import NetworkErrorHandler from '../components/errors/NetworkErrorHandler';
import { PROTOCOL_ERRORS } from '../utils/httpErrorHandler';

// Styled components
const ErrorPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const ErrorHeader = styled(motion.h1)`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ErrorContent = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TechnicalDetails = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 2rem;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  overflow-x: auto;
`;

/**
 * Dedicated page for handling HTTP protocol-related errors
 */
const ProtocolErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorDetails, setErrorDetails] = useState({
    statusCode: 426,
    message: 'Upgrade Required',
    description: 'The server requires an HTTP protocol upgrade'
  });
  const [showTechnical, setShowTechnical] = useState(false);

  // Get error details from location state or query params
  useEffect(() => {
    // Check if we have detailed error info in location state
    if (location.state?.error) {
      const { statusCode, message, description } = location.state.error;
      setErrorDetails({
        statusCode: statusCode || 426,
        message: message || 'Upgrade Required',
        description: description || 'The server requires an HTTP protocol upgrade'
      });
    } else {
      // Check for error info in query params
      const params = new URLSearchParams(location.search);
      const statusCode = parseInt(params.get('code') || '426');
      const message = params.get('message') || 'Upgrade Required';
      
      setErrorDetails({
        statusCode,
        message,
        description: 'The server requires an HTTP protocol upgrade'
      });
    }
  }, [location]);

  // Function to handle retry action
  const handleRetry = () => {
    // Navigate to the previous page or home
    const returnPath = location.state?.from || '/';
    navigate(returnPath, { replace: true });
  };

  // Determine if this is specifically a 426 error or another protocol error
  const is426Error = errorDetails.statusCode === PROTOCOL_ERRORS.UPGRADE_REQUIRED;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <ErrorPageContainer>
      <ErrorContent
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ErrorHeader variants={itemVariants}>
          Protocol Compatibility Issue
        </ErrorHeader>
        
        {is426Error ? (
          <ProtocolErrorHandler 
            statusCode={errorDetails.statusCode}
            message={errorDetails.message}
            onRetry={handleRetry}
            onCancel={() => navigate('/')}
          />
        ) : (
          <NetworkErrorHandler 
            statusCode={errorDetails.statusCode}
            errorMessage={errorDetails.message}
            retryFn={handleRetry}
          />
        )}
        
        <motion.div 
          variants={itemVariants}
          style={{ marginTop: '2rem', textAlign: 'center' }}
        >
          <button 
            onClick={() => setShowTechnical(!showTechnical)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4f46e5',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.875rem'
            }}
          >
            {showTechnical ? 'Hide' : 'Show'} technical details
          </button>
        </motion.div>
        
        {showTechnical && (
          <TechnicalDetails variants={itemVariants}>
            <div>Status Code: {errorDetails.statusCode}</div>
            <div>Message: {errorDetails.message}</div>
            <div>Description: {errorDetails.description}</div>
            <div>Browser: {navigator.userAgent}</div>
            <div>Protocol: {window.location.protocol}</div>
            <div>Secure Context: {window.isSecureContext ? 'Yes' : 'No'}</div>
          </TechnicalDetails>
        )}
      </ErrorContent>
    </ErrorPageContainer>
  );
};

export default ProtocolErrorPage;