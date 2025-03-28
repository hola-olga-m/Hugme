import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const AuthLayout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`auth-layout ${theme}`}>
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <i className="fas fa-heart-circle logo-icon"></i>
            <span className="logo-text">HugMood</span>
          </Link>
        </div>
        
        <div className="auth-content">
          <div className="auth-card">
            {children}
          </div>
        </div>
        
        <div className="auth-footer">
          <div className="auth-help-links">
            <a href="#" className="auth-help-link">Help</a>
            <span className="separator">•</span>
            <a href="#" className="auth-help-link">Privacy</a>
            <span className="separator">•</span>
            <a href="#" className="auth-help-link">Terms</a>
          </div>
          
          <div className="auth-copyright">
            © {new Date().getFullYear()} HugMood. All rights reserved.
          </div>
        </div>
      </div>
      
      <div className="auth-background">
        <div className="auth-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;