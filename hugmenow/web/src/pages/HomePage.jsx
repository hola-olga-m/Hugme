import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      <div className="home-page">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Share Emotions. Send Hugs. Feel Connected.</h1>
            <p className="hero-subtitle">
              Track your moods, send virtual hugs, and connect with a supportive community.
            </p>
            <div className="hero-cta">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Sign Up Free
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-large">
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <h2 className="section-title">Why Choose Hug Me Now?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Mood Tracking</h3>
                <p>
                  Track your daily emotions and see patterns over time with intuitive visualizations
                  and insights.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🤗</div>
                <h3>Virtual Hugs</h3>
                <p>
                  Send encouraging virtual hugs to friends and loved ones when they need emotional
                  support.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Supportive Community</h3>
                <p>
                  Connect with like-minded individuals in a safe, anonymous space to share
                  experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to start your emotional wellness journey?</h2>
            <p>
              Join thousands of users who have improved their emotional awareness and well-being
              with Hug Me Now.
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-large">
                Get Started Now
              </Link>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default HomePage;