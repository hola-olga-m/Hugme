
import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { AuthProvider, useAuth } from './context/AuthContext';
// Import i18n configuration
import './i18n';
import { useTranslation } from 'react-i18next';

// Import error handling components
import ErrorBoundary from './components/errors/ErrorBoundary';
import AnimatedErrorState from './components/errors/AnimatedErrorState';
import RouteErrorPage from './components/errors/RouteErrorPage';

// Import page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MoodTrackerPage from './pages/MoodTrackerPage';
import HugCenterPage from './pages/HugCenterPage';
import ProfilePage from './pages/ProfilePage';
import MoodHistoryPage from './pages/MoodHistoryPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtocolErrorPage from './pages/ProtocolErrorPage';

// Import styles
import './styles/main.css';
import './styles/components/error-states.css';

// ScrollToTop component to handle scroll position on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">{t('common.loading')}</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Loading fallback component
const LoadingFallback = () => {
  const { t } = useTranslation();
  return (
    <div className="loading-fallback">
      <div className="spinner"></div>
      <p>{t('common.loading')}</p>
    </div>
  );
};

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Error routes */}
          <Route path="/error" element={<RouteErrorPage />} />
          <Route path="/protocol-error" element={<ProtocolErrorPage />} />

          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <DashboardPage />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mood-tracker" 
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <MoodTrackerPage />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hug-center" 
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <HugCenterPage />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <ProfilePage />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mood-history" 
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <MoodHistoryPage />
                </ErrorBoundary>
              </ProtectedRoute>
            } 
          />

          {/* Not found route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  // Check if we have an initial path from direct navigation
  useEffect(() => {
    if (window.__INITIAL_PATH__) {
      console.log('Initial path detected:', window.__INITIAL_PATH__);
      // The router will handle this automatically once mounted
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <div className="app-container">
            <AppRoutes />
          </div>
        </AuthProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;
