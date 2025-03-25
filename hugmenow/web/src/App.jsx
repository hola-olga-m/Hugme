import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import { AuthProvider } from './contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import './i18n';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import HugCenter from './pages/HugCenter';
import Profile from './pages/Profile';

// CSS (will be imported later)
// import './styles/main.css';

function App() {
  const { i18n } = useTranslation();
  
  // Initialize i18n language from localStorage or browser language
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (['en', 'ru'].includes(browserLang)) {
        i18n.changeLanguage(browserLang);
      }
    }
  }, [i18n]);
  
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mood-tracker" element={<MoodTracker />} />
              <Route path="/hug-center" element={<HugCenter />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            {/* Redirect root to dashboard if logged in, otherwise to login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Fallback route - 404 can be added later */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;