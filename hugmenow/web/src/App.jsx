import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import i18n
import './i18n';

// Import pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Import components
import LanguageSwitcher from './components/LanguageSwitcher';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

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
            
            {/* Protected routes - will be added later */}
            
            {/* Default redirect */}
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