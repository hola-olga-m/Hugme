import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../apollo/client';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [appInfo, setAppInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch app info from the API
  useEffect(() => {
    const fetchAppInfo = async () => {
      try {
        setLoading(true);
        // Use the centralized API base URL
        const response = await fetch(`${API_BASE_URL}/info`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched app info:', data);
        setAppInfo(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching app info:', err);
        setError('Failed to load application information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppInfo();
  }, []);
  
  // Feature icons mapping
  const featureIcons = {
    'User authentication with JWT': '🔐',
    'Mood tracking and history': '📊',
    'Virtual hugs exchange': '🤗',
    'Hug requests': '🔔',
    'Public and private mood sharing': '🌈',
  };
  
  return (
    <MainLayout>
      <div className="home-page">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to {appInfo?.name || 'HugMeNow'}</h1>
            <p className="hero-subtitle">
              {appInfo?.description || 'Track your emotions and connect with supportive community through virtual hugs'}
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
            {loading && <div className="loading">Loading features...</div>}
            
            {error && <div className="error-message">{error}</div>}
            
            {appInfo?.features ? (
              appInfo.features.map((feature, index) => (
                <div className="feature-card" key={index}>
                  <div className="feature-icon">{featureIcons[feature] || '✨'}</div>
                  <h3 className="feature-title">{feature}</h3>
                  <p className="feature-description">
                    {getFeatureDescription(feature)}
                  </p>
                </div>
              ))
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
        
        <div className="api-info-section">
          {appInfo && (
            <div className="api-info-content">
              <h2 className="section-title">API Information</h2>
              <div className="api-details card">
                <p><strong>Version:</strong> {appInfo.version}</p>
                <p><strong>Status:</strong> <span className="status-badge">{appInfo.status}</span></p>
                <p><strong>Endpoints:</strong></p>
                <ul className="endpoints-list">
                  {Object.entries(appInfo.endpoints).map(([name, path]) => (
                    <li key={name}><strong>{name}:</strong> {path}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
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

// Helper function to get feature descriptions
function getFeatureDescription(feature) {
  const descriptions = {
    'User authentication with JWT': 'Secure login and registration with JSON Web Tokens for protected user data.',
    'Mood tracking and history': 'Track your daily emotions and view patterns over time to better understand your mental health.',
    'Virtual hugs exchange': 'Send and receive virtual hugs to share empathy and support with others in the community.',
    'Hug requests': 'Request hugs when you need support or respond to others seeking comfort.',
    'Public and private mood sharing': 'Control which moods you share publicly and which remain private for your eyes only.'
  };
  
  return descriptions[feature] || 'A feature of the HugMeNow platform';
}

export default HomePage;