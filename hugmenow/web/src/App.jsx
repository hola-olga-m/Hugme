import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { AuthProvider } from './contexts/AuthContext';

// Import i18n
import './i18n';

// Import styles
import './styles/auth.css';

// Import pages
import LoginPage from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

// Import components
import LanguageSwitcher from './components/LanguageSwitcher';
import ProtectedRoute from './components/ProtectedRoute';

// Main App component
const AppContent = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>HugMeNow</h1>
          <LanguageSwitcher />
        </header>
        
        <main className="app-content">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>&copy; 2025 HugMeNow. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

// Wrap the app with required providers
const App = () => {
  return (
    <ApolloProvider client={client}>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Suspense>
    </ApolloProvider>
  );
};

export default App;