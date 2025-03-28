import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';

const MainLayout = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if page should show full-screen view (no footer or sidebar)
  const isFullScreenView = [
    '/hug/receive',
    '/mood/track',
    '/group-hug',
  ].some(path => location.pathname.startsWith(path));

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close sidebar on mobile when resizing
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`main-layout ${isFullScreenView ? 'fullscreen' : ''}`}>
      <Header 
        toggleSidebar={toggleSidebar} 
        isMobile={isMobile} 
        user={currentUser} 
      />
      
      <div className="layout-container">
        {!isFullScreenView && !isMobile && (
          <Sidebar isOpen={!isMobile || sidebarOpen} />
        )}
        
        <main className={`main-content ${(!isMobile || sidebarOpen) && !isFullScreenView ? 'with-sidebar' : ''}`}>
          {children}
        </main>
      </div>
      
      {!isFullScreenView && <Footer />}
      
      {isMobile && !isFullScreenView && (
        <Navigation currentPath={location.pathname} />
      )}
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <>
          <div className="sidebar-overlay" onClick={toggleSidebar}></div>
          <Sidebar isOpen={sidebarOpen} isMobile closeSidebar={() => setSidebarOpen(false)} />
        </>
      )}
    </div>
  );
};

export default MainLayout;