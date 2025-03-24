import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Link to="/">
                <h1>HugMeNow</h1>
              </Link>
            </div>

            <nav className="main-nav">
              <ul>
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
                    <li className="user-menu">
                      <div className="user-menu-trigger" onClick={toggleMenu}>
                        <span>{currentUser?.name || 'User'}</span>
                      </div>
                      {menuOpen && (
                        <div className="dropdown-menu show">
                          <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                            Profile
                          </Link>
                          <div className="dropdown-divider"></div>
                          <button className="dropdown-item" onClick={handleLogout}>
                            Logout
                          </button>
                        </div>
                      )}
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/register">Register</Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>About HugMeNow</h3>
              <p>
                An emotional wellness application helping you track your moods and
                connect with others through virtual hugs.
              </p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/mood-tracker">Mood Tracker</Link>
                </li>
                <li>
                  <Link to="/hug-center">Hug Center</Link>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Help</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">Support</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} HugMeNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;