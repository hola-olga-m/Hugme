import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to HugMeNow</h1>
            <p className="hero-subtitle">
              Track your mood, send virtual hugs, and connect with a supportive community
            </p>
            
            {!isAuthenticated() && (
              <div className="hero-cta">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Log In
                </Link>
              </div>
            )}
            
            {isAuthenticated() && (
              <div className="hero-cta">
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Features</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌡️</div>
              <h3>Mood Tracking</h3>
              <p>Track your daily mood and see patterns over time</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤗</div>
              <h3>Virtual Hugs</h3>
              <p>Send and receive virtual hugs for emotional support</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Community Support</h3>
              <p>Connect with others and build a support network</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Mood Insights</h3>
              <p>Get personalized insights based on your mood patterns</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to start your wellness journey?</h2>
            <p>Join thousands of users who have improved their emotional wellbeing with HugMeNow</p>
            
            {!isAuthenticated() && (
              <Link to="/register" className="btn btn-primary btn-lg">
                Sign Up Now
              </Link>
            )}
            
            {isAuthenticated() && (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;