import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

/**
 * Sidebar component with main navigation links
 */
const Sidebar = () => {
  const { user, isAuthenticated, isAnonymous } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);
  
  // Responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  // Check if a path is active
  const isActive = (path) => {
    if (path === '/app' && (location.pathname === '/app' || location.pathname === '/app/dashboard')) {
      return true;
    }
    return location.pathname === path || 
           (path !== '/' && path !== '/app' && location.pathname.startsWith(path));
  };
  
  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? 'visible' : ''}`} onClick={toggleSidebar}></div>
      <aside className={`app-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Link to={isAuthenticated ? "/app" : "/"}>
              <h2>HugMood</h2>
            </Link>
          </div>
          <button className="sidebar-close" onClick={toggleSidebar}>×</button>
        </div>
        
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/app/mood" className="action-button">
              <span className="action-icon">📊</span>
              <span className="action-label">Track Mood</span>
            </Link>
            <Link to="/app/hugs/send" className="action-button">
              <span className="action-icon">🤗</span>
              <span className="action-label">Send Hug</span>
            </Link>
            <Link to="/app/hugs/request" className="action-button">
              <span className="action-icon">👋</span>
              <span className="action-label">Request Hug</span>
            </Link>
            <Link to="/app/mood/insights" className="action-button">
              <span className="action-icon">📈</span>
              <span className="action-label">Insights</span>
            </Link>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={isActive('/app') ? 'active' : ''}>
              <Link to="/app">
                <span className="icon">🏠</span>
                <span className="label">Dashboard</span>
              </Link>
            </li>
            
            <li className={isActive('/app/mood') && !isActive('/app/mood/history') && !isActive('/app/mood/insights') ? 'active' : ''}>
              <Link to="/app/mood">
                <span className="icon">📊</span>
                <span className="label">Track Mood</span>
              </Link>
            </li>
            
            <li className={isActive('/app/mood/history') ? 'active' : ''}>
              <Link to="/app/mood/history">
                <span className="icon">📅</span>
                <span className="label">Mood History</span>
              </Link>
            </li>
            
            <li className={isActive('/app/mood/insights') ? 'active' : ''}>
              <Link to="/app/mood/insights">
                <span className="icon">📈</span>
                <span className="label">Mood Insights</span>
              </Link>
            </li>
            
            <li className={isActive('/app/mood/following') ? 'active' : ''}>
              <Link to="/app/mood/following">
                <span className="icon">👥</span>
                <span className="label">Friends' Moods</span>
              </Link>
            </li>
            
            <li className="divider"></li>
            
            <li className={isActive('/app/hugs/send') ? 'active' : ''}>
              <Link to="/app/hugs/send">
                <span className="icon">🤗</span>
                <span className="label">Send a Hug</span>
              </Link>
            </li>
            
            <li className={isActive('/app/hugs/request') ? 'active' : ''}>
              <Link to="/app/hugs/request">
                <span className="icon">👋</span>
                <span className="label">Request a Hug</span>
              </Link>
            </li>
            
            <li className={isActive('/app/hugs/requests') ? 'active' : ''}>
              <Link to="/app/hugs/requests">
                <span className="icon">📩</span>
                <span className="label">Hug Requests</span>
              </Link>
            </li>
            
            <li className={isActive('/app/hugs/group') ? 'active' : ''}>
              <Link to="/app/hugs/group">
                <span className="icon">👨‍👩‍👧‍👦</span>
                <span className="label">Group Hug</span>
              </Link>
            </li>
            
            <li className={isActive('/app/hugs/types') ? 'active' : ''}>
              <Link to="/app/hugs/types">
                <span className="icon">🎬</span>
                <span className="label">Media Hugs</span>
              </Link>
            </li>
            
            <li className="divider"></li>
            
            <li className={isActive('/app/community') ? 'active' : ''}>
              <Link to="/app/community">
                <span className="icon">👥</span>
                <span className="label">Community</span>
              </Link>
            </li>
            
            <li className={isActive('/app/profile') ? 'active' : ''}>
              <Link to="/app/profile">
                <span className="icon">👤</span>
                <span className="label">My Profile</span>
              </Link>
            </li>
            
            <li className={isActive('/app/achievements') ? 'active' : ''}>
              <Link to="/app/achievements">
                <span className="icon">🏆</span>
                <span className="label">Achievements</span>
              </Link>
            </li>
            
            {user?.isPremium ? (
              <li className={isActive('/app/therapy') ? 'active' : ''}>
                <Link to="/app/therapy">
                  <span className="icon">🧠</span>
                  <span className="label">Therapy Mode</span>
                </Link>
              </li>
            ) : (
              <li className={isActive('/app/premium') ? 'active' : ''}>
                <Link to="/app/premium">
                  <span className="icon">✨</span>
                  <span className="label">Premium</span>
                  <span className="badge">PRO</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          {isAnonymous ? (
            <div className="anonymous-notice">
              <p>You're in anonymous mode</p>
              <Link to="/register" className="create-account-btn">Create Account</Link>
            </div>
          ) : (
            user && (
              <div className="user-info">
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {user.username?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <span className="username">{user.username}</span>
                  {user.isPremium && <span className="premium-badge">Premium</span>}
                </div>
              </div>
            )
          )}
        </div>
      </aside>
      
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </>
  );
};

export default Sidebar;