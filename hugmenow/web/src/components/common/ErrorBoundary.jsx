import React, { Component } from 'react';
import { detectErrorType, getErrorMessage, logError } from '../../utils/errorHandling';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    // Capture error details for logging
    const errorType = detectErrorType(error, { 
      component: 'ErrorBoundary',
      location: window.location.pathname
    });
    
    this.setState({
      errorInfo,
      errorType
    });
    
    // Log the error
    logError(error, {
      errorInfo,
      errorType,
      component: 'ErrorBoundary'
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: null
    });
  };

  render() {
    const { hasError, errorType } = this.state;
    
    if (hasError) {
      const { title, description } = getErrorMessage(errorType);
      
      return (
        <div className="error-boundary">
          <div className="error-container">
            <h2>{title}</h2>
            <p>{description}</p>
            <button 
              className="btn btn-primary"
              onClick={this.handleReset}
            >
              Try Again
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => window.location.href = '/'}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;