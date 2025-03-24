import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MainLayout({ children }) {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container header-content">
          <div className="logo">
            <Link to="/">
              <h1>Hug Me Now</h1>
            </Link>
          </div>

          <nav className="main-nav">
            <ul>
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
                      <span className="mr-2">{currentUser.name || currentUser.username}</span>
                      <span>▼</span>
                    </div>
                    {menuOpen && (
                      <div className="dropdown-menu show">
                        <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                          Profile
                        </Link>
                        <Link to="/mood-history" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                          Mood History
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
                    <Link to="/register" className="btn btn-primary btn-sm">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="container">{children}</div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Hug Me Now</h3>
              <p>
                A mobile-first emotional wellness application leveraging cutting-edge technology to provide personalized, 
                interactive mental health support through innovative tracking and engagement mechanisms.
              </p>
            </div>

            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
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
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/register">Sign Up</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="footer-section">
              <h3>Connect</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Hug Me Now. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;