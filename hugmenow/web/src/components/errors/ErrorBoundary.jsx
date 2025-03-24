import React, { Component } from 'react';
import { withRouter } from '../routing/withRouter';
import AnimatedErrorState from './AnimatedErrorState';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: 'route' // default to route error
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Determine error type based on error message or other criteria
    this.determineErrorType(error);
  }

  determineErrorType(error) {
    const errorMessage = error.message || '';
    
    if (errorMessage.includes('Failed to fetch') || 
        errorMessage.includes('NetworkError') || 
        errorMessage.includes('Network request failed')) {
      this.setState({ errorType: 'network' });
    } else if (errorMessage.includes('Unauthorized') || 
               errorMessage.includes('Authentication failed') ||
               errorMessage.includes('not logged in')) {
      this.setState({ errorType: 'auth' });
    } else if (errorMessage.includes('Cannot read property') || 
               errorMessage.includes('undefined is not an object') ||
               errorMessage.includes('is not a function')) {
      this.setState({ errorType: 'data' });
    } else {
      // Default to route error
      this.setState({ errorType: 'route' });
    }
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
      const { errorType } = this.state;
      let title, description;
      
      switch (errorType) {
        case 'network':
          title = "Network Error";
          description = "Unable to connect to our servers. Please check your internet connection and try again.";
          break;
        case 'auth':
          title = "Authentication Error";
          description = "You need to be logged in to view this page or your session may have expired.";
          break;
        case 'data':
          title = "Data Loading Error";
          description = "We couldn't load the data for this page. Please try again later.";
          break;
        default:
          title = "Page Not Found";
          description = "The page you're looking for might be unavailable or doesn't exist.";
      }

      // Get current location
      const { pathname } = this.props.location;
      const isOnErrorPage = pathname === '/error' || pathname === '/not-found';
      
      return (
        <AnimatedErrorState
          title={title}
          description={description}
          errorType={errorType}
          actionText={errorType === 'auth' ? "Log In" : "Go Home"}
          actionLink={errorType === 'auth' ? "/login" : "/"}
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