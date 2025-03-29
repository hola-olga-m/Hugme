import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>HugMeNow</h3>
            <p>A wellness app for emotional support and mood tracking.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
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
            <h3>Support</h3>
            <ul className="footer-links">
              <li>
                <Link to="/help">Help Center</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} HugMeNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;