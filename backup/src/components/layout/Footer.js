import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container footer-container">
        <div className="footer-section brand-section">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <i className="fas fa-heart-circle"></i>
            </div>
            <div className="footer-logo-text">HugMood</div>
          </div>
          <p className="footer-description">
            Track your emotional wellness and connect with others through virtual hugs.
            Share kindness, track your mood journey, and embrace emotional health together.
          </p>
          <div className="social-icons">
            <a href="#" className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        
        <div className="footer-section links-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li className="footer-link">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="footer-link">
              <Link to="/mood/track">Track Mood</Link>
            </li>
            <li className="footer-link">
              <Link to="/hug/send">Send Hug</Link>
            </li>
            <li className="footer-link">
              <Link to="/community">Community</Link>
            </li>
          </ul>
        </div>
        
        <div className="footer-section links-section">
          <h3 className="footer-heading">Support</h3>
          <ul className="footer-links">
            <li className="footer-link">
              <Link to="/help">Help Center</Link>
            </li>
            <li className="footer-link">
              <Link to="/contact">Contact Us</Link>
            </li>
            <li className="footer-link">
              <Link to="/faq">FAQ</Link>
            </li>
            <li className="footer-link">
              <Link to="/feedback">Feedback</Link>
            </li>
          </ul>
        </div>
        
        <div className="footer-section links-section">
          <h3 className="footer-heading">Legal</h3>
          <ul className="footer-links">
            <li className="footer-link">
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li className="footer-link">
              <Link to="/terms">Terms of Service</Link>
            </li>
            <li className="footer-link">
              <Link to="/cookie-policy">Cookie Policy</Link>
            </li>
            <li className="footer-link">
              <Link to="/disclaimer">Disclaimer</Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="copyright">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} HugMood. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;