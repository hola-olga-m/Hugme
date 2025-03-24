import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component with links and copyright
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-links">
        <div className="footer-section">
          <h4>HugMood</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/user-guide">User Guide</Link></li>
            <li><Link to="/contact-support">Contact Support</Link></li>
            <li><Link to="/feedback">Feedback</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Connect</h4>
          <ul>
            <li><a href="https://facebook.com/hugmood" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com/hugmood" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://instagram.com/hugmood" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="app-download">
          <a href="#" className="app-store-link">
            <img src="/img/app-store-badge.svg" alt="Download on the App Store" />
          </a>
          <a href="#" className="play-store-link">
            <img src="/img/google-play-badge.svg" alt="Get it on Google Play" />
          </a>
        </div>
        
        <div className="copyright">
          &copy; {currentYear} HugMood. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;