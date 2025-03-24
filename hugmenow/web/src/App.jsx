
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { AuthProvider, useAuth } from './context/AuthContext';

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

// Import styles
import './styles/main.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mood-tracker" 
        element={
          <ProtectedRoute>
            <MoodTrackerPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/hug-center" 
        element={
          <ProtectedRoute>
            <HugCenterPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mood-history" 
        element={
          <ProtectedRoute>
            <MoodHistoryPage />
          </ProtectedRoute>
        } 
      />

      {/* Not found route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <AuthProvider>
          <div className="app-container">
            <AppRoutes />
          </div>
        </AuthProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;
