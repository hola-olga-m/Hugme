import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  // Scroll to section when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Initial check for hash in URL
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="container header-container">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <i className="fas fa-heart-circle"></i>
            </div>
            <div className="logo-text">HugMood</div>
          </Link>
          
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#hug-types" className="nav-link">Hug Types</a>
            <a href="#mood-tracking" className="nav-link">Mood Tracking</a>
            <a href="#app-experience" className="nav-link">Experience</a>
          </nav>
          
          <div className="auth-buttons">
            <Link to="/auth/login" className="login-btn">Log In</Link>
            <Link to="/auth/register" className="signup-btn">Sign Up</Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Share Virtual Hugs & Track Your Emotional Wellness</h1>
          <p>
            Connect with loved ones through personalized virtual hugs and track your mood journey.
            Experience the power of emotional sharing and support in a beautifully designed app.
          </p>
          <div className="hero-buttons">
            <Link to="/auth/register" className="hero-btn hero-btn-primary">
              Get Started
            </Link>
            <a href="#features" className="hero-btn hero-btn-secondary">Learn More</a>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-title">
            <h2>Key Features</h2>
            <p>
              Discover how HugMood can help you stay connected with others and maintain 
              awareness of your emotional health through innovative features.
            </p>
          </div>
          
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-smile"></i>
              </div>
              <h3>Mood Tracking</h3>
              <p>
                Record your daily moods with easy-to-use emoji sliders and optional 
                journal entries. Watch your emotional patterns emerge over time.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Virtual Hugs</h3>
              <p>
                Send customized virtual hugs to friends and family with personalized 
                messages and different hug styles to match any feeling.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Wellness Insights</h3>
              <p>
                Gain valuable insights about your emotional patterns with advanced 
                analytics and personalized recommendations.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Group Hugs</h3>
              <p>
                Create and join group hugs to share collective support during celebrations, 
                difficult times, or just to stay connected.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-medal"></i>
              </div>
              <h3>Wellness Streaks</h3>
              <p>
                Build healthy habits with streak tracking for mood recording and 
                mindfulness activities, with rewards for consistency.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Always Available</h3>
              <p>
                Access HugMood anywhere with full offline functionality and 
                seamless syncing when you're back online.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hug Types Section */}
      <section id="hug-types" className="hug-types">
        <div className="container">
          <div className="section-title">
            <h2>Express Your Feelings with Different Hug Types</h2>
            <p>
              Choose from a variety of virtual hugs to perfectly convey your emotions 
              and support to the people you care about.
            </p>
          </div>
          
          <div className="hug-types-grid">
            <div className="hug-type-card">
              <div className="hug-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>Comfort Hug</h3>
              <p>The perfect virtual embrace when someone needs emotional support and reassurance.</p>
            </div>
            
            <div className="hug-type-card">
              <div className="hug-icon">
                <i className="fas fa-birthday-cake"></i>
              </div>
              <h3>Celebration Hug</h3>
              <p>Share joy and excitement for special occasions and achievements.</p>
            </div>
            
            <div className="hug-type-card">
              <div className="hug-icon">
                <i className="fas fa-sun"></i>
              </div>
              <h3>Energizing Hug</h3>
              <p>Boost someone's spirits and motivation with a refreshing virtual squeeze.</p>
            </div>
            
            <div className="hug-type-card">
              <div className="hug-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Loving Hug</h3>
              <p>Express deep affection and caring with a heart-centered virtual embrace.</p>
            </div>
            
            <div className="hug-type-card">
              <div className="hug-icon">
                <i className="fas fa-laugh"></i>
              </div>
              <h3>Playful Hug</h3>
              <p>Add a dash of fun and humor to brighten someone's day.</p>
            </div>
            
            <div className="hug-type-card">
              <div className="hug-icon">
                <i className="fas fa-moon"></i>
              </div>
              <h3>Calming Hug</h3>
              <p>Help someone find peace and relaxation during stressful times.</p>
            </div>
            
            <div className="hug-type-card">
              <div className="hug-icon">
                <i className="fas fa-user-friends"></i>
              </div>
              <h3>Friendship Hug</h3>
              <p>Celebrate your connection with a warm gesture of companionship.</p>
            </div>
            
            <div className="hug-type-card">
              <div className="hug-icon">
                <i className="fas fa-surprise"></i>
              </div>
              <h3>Surprise Hug</h3>
              <p>Delight someone with an unexpected moment of affection.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mood Tracking Section */}
      <section id="mood-tracking" className="mood-tracking">
        <div className="container">
          <div className="mood-content">
            <div className="mood-text">
              <h2>Track Your Emotional Journey</h2>
              <p>
                Our intuitive mood tracking system helps you develop emotional awareness and 
                identify patterns that affect your wellbeing. Take control of your emotional 
                health with powerful but simple tools.
              </p>
              
              <div className="mood-benefits">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="benefit-text">
                    Record daily moods with expressive emoji sliders
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="benefit-text">
                    Add context with optional journal entries
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="benefit-text">
                    Visualize patterns with beautiful, interactive charts
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="benefit-text">
                    Receive personalized insights and recommendations
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="benefit-text">
                    Build consistency with mood tracking streaks
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mood-image">
              <img src="/screenshots/mood.png" alt="Mood tracking interface" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Start Your Emotional Wellness Journey?</h2>
          <p>
            Join thousands of users who are enhancing their emotional awareness and 
            strengthening connections with loved ones through HugMood.
          </p>
          <Link to="/auth/register" className="cta-btn">
            Get Started for Free
          </Link>
        </div>
      </section>
      
      {/* App Experience Section */}
      <section id="app-experience" className="app-stores">
        <div className="container">
          <div className="section-title">
            <h2>Experience HugMood Everywhere</h2>
            <p>
              Take HugMood with you wherever you go. Available as a web app and 
              coming soon to mobile platforms.
            </p>
          </div>
          
          <div className="app-screenshots">
            <img src="/screenshots/home.png" alt="HugMood dashboard" className="screenshot" />
            <img src="/screenshots/hug.png" alt="Sending a virtual hug" className="screenshot" />
          </div>
          
          <div className="app-store-buttons">
            <a href="#" className="app-store-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" />
            </a>
            <a href="#" className="app-store-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-section">
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
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Features</h3>
            <ul className="footer-links">
              <li className="footer-link">
                <a href="#mood-tracking">Mood Tracking</a>
              </li>
              <li className="footer-link">
                <a href="#hug-types">Virtual Hugs</a>
              </li>
              <li className="footer-link">
                <a href="#features">Wellness Insights</a>
              </li>
              <li className="footer-link">
                <a href="#features">Group Hugs</a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-links">
              <li className="footer-link">
                <Link to="/about">About Us</Link>
              </li>
              <li className="footer-link">
                <Link to="/careers">Careers</Link>
              </li>
              <li className="footer-link">
                <Link to="/contact">Contact</Link>
              </li>
              <li className="footer-link">
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Support</h3>
            <ul className="footer-links">
              <li className="footer-link">
                <Link to="/help">Help Center</Link>
              </li>
              <li className="footer-link">
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li className="footer-link">
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li className="footer-link">
                <Link to="/faq">FAQ</Link>
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
    </div>
  );
};

export default LandingPage;