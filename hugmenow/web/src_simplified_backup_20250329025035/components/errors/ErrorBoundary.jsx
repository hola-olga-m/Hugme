import React, { Component } from 'react';
import { withRouter } from '../routing/withRouter';
import AnimatedErrorState from './AnimatedErrorState';
import { detectErrorType, getErrorMessage, logError, getErrorRedirect } from '../../utils/errorHandling';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: 'route', // default to route error
      errorDetails: {
        title: "Something went wrong",
        description: "We encountered an unexpected error. Please try again."
      }
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    const context = {
      component: this.props.componentName || 'ErrorBoundary',
      location: this.props.location,
      path: this.props.location?.pathname
    };
    
    logError(error, context);
    
    // Determine error type based on error message and context
    const errorType = detectErrorType(error, context);
    const errorDetails = getErrorMessage(errorType);
    
    this.setState({ 
      errorInfo, 
      errorType,
      errorDetails
    });
  }

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  }

  componentDidUpdate(prevProps) {
    // Check if route changed
    if (this.props.location !== prevProps.location) {
      if (this.state.hasError) {
        // Reset error state when navigation occurs
        this.resetError();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const { errorType, errorDetails } = this.state;
      const { title, description } = errorDetails;

      // Get current location
      const { pathname } = this.props.location;
      const isOnErrorPage = pathname === '/error' || pathname === '/not-found';
      
      // Determine appropriate action based on error type
      const primaryAction = errorType === 'auth' ? {
        text: "Log In",
        link: "/login"
      } : {
        text: "Go Home",
        link: "/"
      };
      
      return (
        <AnimatedErrorState
          title={title}
          description={description}
          errorType={errorType}
          actionText={primaryAction.text}
          actionLink={primaryAction.link}
          secondaryAction={
            !isOnErrorPage ? 
            {
              text: "Try Again",
              onClick: this.resetError
            } : null
          }
        />
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);