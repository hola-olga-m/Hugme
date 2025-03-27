import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoadingScreen from './components/common/LoadingScreen';
import DebugPanel from './components/common/DebugPanel';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicRoute from './components/routing/PublicRoute';
import StaticRoute from './components/routing/StaticRoute';

// Import global CSS variables
import './styles/variables.css';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MoodTracker = lazy(() => import('./pages/MoodTracker'));
const HugCenter = lazy(() => import('./pages/HugCenter'));
const Profile = lazy(() => import('./pages/Profile'));
const ThemeSettings = lazy(() => import('./pages/ThemeSettings'));
const HugGalleryDemo = lazy(() => import('./pages/HugGalleryDemo'));
const PublicHugGallery = lazy(() => import('./pages/PublicHugGallery'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Theme error boundary component definition
const ThemeErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [errorDetails, setErrorDetails] = React.useState(null);
  
  React.useEffect(() => {
    const handleThemeError = (error) => {
      console.error('Theme Provider Error:', error);
      console.error('Error Stack:', error.stack);
      setErrorDetails(error);
      setHasError(true);
    };
    
    const handleGlobalError = (event) => {
      if (event.error && event.error.message && event.error.message.includes('is not iterable')) {
        console.error('Caught iterable error in global handler:', event.error);
        handleThemeError(event.error);
        event.preventDefault();
      }
    };
    
    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, []);
  
  if (hasError) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8d7da', 
        color: '#721c24',
        borderRadius: '5px',
        margin: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2>Theme Error</h2>
        <p>There was an error with the theme system: {errorDetails?.message}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#dc3545', 
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload App
        </button>
      </div>
    );
  }
  
  return children;
};

// Main App component
const App = () => {

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeErrorBoundary>
          <ThemeProvider>
            <Router>
              <Suspense fallback={<LoadingScreen text="Loading application..." />}>
                <DebugPanel />
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={
                    <PublicRoute>
                      <Navigate to="/login" replace />
                    </PublicRoute>
                  } />
                  <Route path="/login" element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } />
                <Route path="/register" element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/mood-tracker" element={
                  <ProtectedRoute>
                    <MoodTracker />
                  </ProtectedRoute>
                } />
                <Route path="/hug-center" element={
                  <ProtectedRoute>
                    <HugCenter />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/theme-settings" element={
                  <ProtectedRoute>
                    <ThemeSettings />
                  </ProtectedRoute>
                } />
                {/* Static demo route - always accessible */}
                <Route path="/hug-gallery" element={
                  <StaticRoute>
                    <PublicHugGallery />
                  </StaticRoute>
                } />
                
                {/* Not found route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </ThemeProvider>
        </ThemeErrorBoundary>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;