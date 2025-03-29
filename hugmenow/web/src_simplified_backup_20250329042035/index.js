import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css'; // Updated to use our enhanced design system

const container = document.getElementById('root');
const root = createRoot(container);

// Handle errors at the application level
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Add enhanced global error handler
    const handleError = (event) => {
      console.error('Global error caught:', event.error);
      
      // Enhanced debugging for iterable errors
      if (event.error && event.error.message && event.error.message.includes('is not iterable')) {
        console.error('Specific "is not iterable" error details:');
        console.error('Error message:', event.error.message);
        console.error('Error stack:', event.error.stack);
        console.error('Error occurred in file:', event.filename);
        console.error('Error occurred at line:', event.lineno);
        console.error('Error occurred at column:', event.colno);
        
        // Try to get current component info from the stack trace
        const stackLines = event.error.stack?.split('\n') || [];
        console.error('Stack trace analysis:');
        stackLines.forEach(line => console.error('  ', line));
      }
      
      setError(event.error);
      setHasError(true);
      // Prevent the error from propagating
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    // Enhanced error UI with modern design
    return (
      <div className="error-container glassmorphism">
        <div className="animate-fade-in duration-700">
          <h1 className="text-gradient">Something went wrong</h1>
          <div className="card mb-4">
            <div className="card-body">
              <p className="mb-2">We're sorry, but the application encountered an unexpected error.</p>
              <p className="mb-4 alert alert-danger">{error?.message || 'Unknown error'}</p>
              <div className="flex-row justify-center">
                <button 
                  className="btn btn-primary btn-hover-float"
                  onClick={() => window.location.reload()}
                >
                  Refresh the page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);