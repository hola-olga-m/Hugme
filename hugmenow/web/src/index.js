import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

const container = document.getElementById('root');
const root = createRoot(container);

// Handle errors at the application level
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Add global error handler
    const handleError = (event) => {
      console.error('Global error caught:', event.error);
      setError(event.error);
      setHasError(true);
      // Prevent the error from propagating
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    // You could render a more sophisticated error UI here
    return (
      <div className="error-container">
        <h1>Something went wrong</h1>
        <p>We're sorry, but the application encountered an unexpected error.</p>
        <p>{error?.message || 'Unknown error'}</p>
        <button onClick={() => window.location.reload()}>Refresh the page</button>
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