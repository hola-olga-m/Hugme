import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <MainLayout>
      <div className="home-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to HugMeNow</h1>
            <p className="hero-subtitle">
              Track your emotions and connect with supportive community through virtual hugs
            </p>
            
            {!isAuthenticated() && (
              <div className="hero-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
                <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
              </div>
            )}
            
            {isAuthenticated() && (
              <div className="hero-buttons">
                <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
              </div>
            )}
          </div>
          
          <div className="hero-image">
            <div className="hero-image-placeholder">
              <span role="img" aria-label="Hug emoji" className="hero-emoji">🤗</span>
            </div>
          </div>
        </div>
        
        <div className="features-section">
          <h2 className="section-title">Features</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Mood Tracking</h3>
              <p className="feature-description">
                Track your daily emotions and view patterns over time to better understand your mental health.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤗</div>
              <h3 className="feature-title">Virtual Hugs</h3>
              <p className="feature-description">
                Send and receive virtual hugs to share empathy and support with others in the community.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3 className="feature-title">Hug Requests</h3>
              <p className="feature-description">
                Request hugs when you need support or respond to others seeking comfort.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌈</div>
              <h3 className="feature-title">Mood Insights</h3>
              <p className="feature-description">
                Get personalized insights about your emotional patterns and progress over time.
              </p>
            </div>
          </div>
        </div>
        
        <div className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to track your emotions?</h2>
            <p className="cta-description">
              Join our community today and start your emotional wellness journey.
            </p>
            
            {!isAuthenticated() && (
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">Create Account</Link>
                <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
              </div>
            )}
            
            {isAuthenticated() && (
              <div className="cta-buttons">
                <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;