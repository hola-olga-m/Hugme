import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to HugMeNow</h1>
          <p className="hero-subtitle">
            Track your emotions and connect with others through virtual hugs
          </p>
          <div className="hero-cta">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
                <Link to="/mood-tracker" className="btn btn-outline btn-large">
                  Track Your Mood
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-large">
                  Get Started
                </Link>
                <Link to="/register" className="btn btn-outline btn-large">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Mood Tracking</h3>
              <p>
                Track your emotional state daily and gain insights into patterns
                and triggers.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤗</div>
              <h3>Virtual Hugs</h3>
              <p>
                Send and receive virtual hugs to support friends and loved ones
                when they need it most.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Wellness Insights</h3>
              <p>
                Receive personalized insights about your emotional patterns and
                well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to start your emotional wellness journey?</h2>
            <p>
              Join thousands of users who are improving their emotional health
              with HugMeNow.
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-large">
                Join Now - It's Free
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;