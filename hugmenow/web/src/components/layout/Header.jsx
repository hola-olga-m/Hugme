import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content flex justify-between align-center">
          <div className="logo">
            <Link to="/">
              <h1>HugMeNow</h1>
            </Link>
          </div>
          
          <nav className="main-nav">
            <ul className="flex align-center">
              <li>
                <Link to="/">Home</Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/mood-tracker">Mood Tracker</Link>
                  </li>
                  <li>
                    <Link to="/hug-center">Hug Center</Link>
                  </li>
                  <li>
                    <div className="user-menu">
                      <Link to="/profile" className="user-menu-trigger flex align-center">
                        {currentUser?.avatarUrl ? (
                          <img
                            src={currentUser.avatarUrl}
                            alt={currentUser.name}
                            className="avatar avatar-small"
                          />
                        ) : (
                          <div className="avatar-placeholder avatar-small">
                            {currentUser?.name?.charAt(0) || '?'}
                          </div>
                        )}
                        <span>{currentUser?.name || 'Profile'}</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register" className="btn btn-primary">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;