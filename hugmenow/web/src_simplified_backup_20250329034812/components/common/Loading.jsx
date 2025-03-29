import React from 'react';
import LoadingScreen from './LoadingScreen';
import LoadingSpinner from './LoadingSpinner';

/**
 * Loading component that works as a wrapper for either LoadingScreen or LoadingSpinner
 * @param {Object} props - Component props
 * @param {boolean} props.fullScreen - Whether to show a full screen loading state
 * @param {string} props.message - Optional message to display while loading
 * @param {string} props.size - Size of the spinner (small, medium, large)
 * @param {boolean} props.centered - Whether to center the spinner (non-fullscreen mode)
 */
const Loading = ({ fullScreen = false, message = 'Loading...', size = 'medium', centered = true }) => {
  // Use LoadingScreen for fullScreen mode with message
  if (fullScreen) {
    return <LoadingScreen text={message} />;
  }
  
  // Otherwise use the simpler LoadingSpinner component
  return (
    <LoadingSpinner 
      size={size}
      message={message}
      centered={centered}
    />
  );
};

export default Loading;