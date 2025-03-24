import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Navigation from './Navigation';

/**
 * Main layout wrapper for authenticated pages
 * Includes standard layout components (header, sidebar, footer, navigation)
 * and handles session checks for protected routes
 */
const MainLayout = () => {
  const { user, isAuthenticated, isAnonymous, isLoading } = useContext(UserContext);
  const { currentTheme } = useContext(ThemeContext) || { currentTheme: 'default' };
  const navigate = useNavigate();

  // Apply theme class
  const themeClass = `theme-${currentTheme}`;
  
  // Check if user is authenticated
  if (isLoading) {
    // Show loading indicator while checking authentication
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <h2>Loading HugMood...</h2>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // We'll use the React Router navigate in a useEffect for this
    // to avoid React state update during render warnings
    React.useEffect(() => {
      navigate('/login', { 
        state: { from: window.location.pathname }
      });
    }, [navigate]);
    
    return null;
  }
  
  return (
    <div className={`app-container ${themeClass} ${isAnonymous ? 'anonymous-mode' : ''}`}>
      <Header />
      
      <div className="main-content">
        <Sidebar />
        
        <div className="app-content">
          <div className="container">
            {/* The Outlet component renders the active route */}
            <Outlet />
          </div>
        </div>
      </div>
      
      <Navigation />
      
      {/* Show anonymous banner if in anonymous mode */}
      {isAnonymous && (
        <div className="anonymous-banner">
          <div className="anonymous-banner-content">
            <span className="anonymous-icon">👤</span>
            <p>You're browsing anonymously. <a href="/register">Create an account</a> to save your data.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;