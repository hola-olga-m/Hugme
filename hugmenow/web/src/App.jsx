import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingScreen from './components/common/LoadingScreen';
import DebugPanel from './components/common/DebugPanel';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MoodTracker = lazy(() => import('./pages/MoodTracker'));
const HugCenter = lazy(() => import('./pages/HugCenter'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen text="Checking authentication..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public route component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen text="Checking authentication..." />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main App component
const App = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
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
              
              {/* Not found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default App;