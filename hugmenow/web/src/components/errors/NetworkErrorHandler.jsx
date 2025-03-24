import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import AnimatedErrorState from './AnimatedErrorState';

const StatusCodeDisplay = styled(motion.div)`
  font-family: monospace;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  max-width: 400px;
  text-align: left;
  overflow: auto;
`;

const ErrorCodeLine = styled(motion.div)`
  color: #e53935;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ErrorDetailLine = styled(motion.div)`
  margin-bottom: 0.25rem;
  color: #616161;
`;

/**
 * Component for handling network-specific errors like 426 Upgrade Required
 * @param {Object} props - The component props
 * @param {number} props.statusCode - HTTP status code
 * @param {string} props.errorMessage - Error message
 * @param {Function} props.retryFn - Function to retry the request
 */
const NetworkErrorHandler = ({ 
  statusCode = 426, 
  errorMessage = "Upgrade Required", 
  retryFn = () => window.location.reload() 
}) => {
  
  // Specific messages based on status code
  const getErrorDetails = (code) => {
    switch (code) {
      case 426:
        return {
          title: "Protocol Upgrade Required",
          description: "The server requires an upgrade to a different protocol. This could be related to HTTP version incompatibility.",
          actionText: "Reload Page",
          details: [
            "This error often occurs when the server expects a newer HTTP protocol version.",
            "Your browser might need to use HTTP/2 or HTTP/1.1 for this request.",
            "Reloading the page might resolve the issue automatically."
          ]
        };
      case 429:
        return {
          title: "Too Many Requests",
          description: "You've sent too many requests in a short period. Please wait and try again later.",
          actionText: "Try Again Later",
          details: [
            "This error occurs when rate limiting is in effect.",
            "The server is protecting itself from being overwhelmed.",
            "Please wait a few moments before making another request."
          ]
        };
      case 502:
        return {
          title: "Bad Gateway",
          description: "The server received an invalid response from an upstream server.",
          actionText: "Retry",
          details: [
            "This error typically occurs when the server is restarting or being updated.",
            "It's usually a temporary condition that will resolve itself.",
            "Try refreshing in a few moments."
          ]
        };
      case 503:
        return {
          title: "Service Unavailable",
          description: "The server is temporarily unable to handle this request due to maintenance or overloading.",
          actionText: "Retry Later",
          details: [
            "The server might be undergoing maintenance.",
            "Or it could be experiencing high traffic volume.",
            "Please try again in a few minutes."
          ]
        };
      case 504:
        return {
          title: "Gateway Timeout",
          description: "The server didn't receive a timely response from an upstream server.",
          actionText: "Retry",
          details: [
            "This error occurs when a service the server is trying to reach is slow to respond.",
            "It could be a temporary network issue.",
            "Try again, and if the problem persists, please contact support."
          ]
        };
      default:
        return {
          title: `Network Error (${code})`,
          description: "We encountered a problem connecting to our servers.",
          actionText: "Retry",
          details: [
            `Status Code: ${code || 'Unknown'}`,
            `Error: ${errorMessage || 'Unknown error'}`,
            "Please check your internet connection and try again."
          ]
        };
    }
  };

  const errorDetails = getErrorDetails(statusCode);
  
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
    <AnimatedErrorState
      title={errorDetails.title}
      description={errorDetails.description}
      errorType="network"
      actionText={errorDetails.actionText}
      actionLink="#"
      secondaryAction={{
        text: "Back to Home",
        onClick: () => window.location.href = '/'
      }}
    >
      <StatusCodeDisplay 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <ErrorCodeLine variants={itemVariants}>
          HTTP Status: {statusCode} {errorMessage}
        </ErrorCodeLine>
        
        {errorDetails.details.map((detail, index) => (
          <ErrorDetailLine key={index} variants={itemVariants}>
            {detail}
          </ErrorDetailLine>
        ))}
      </StatusCodeDisplay>
    </AnimatedErrorState>
  );
};

export default NetworkErrorHandler;