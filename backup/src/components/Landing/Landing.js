import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

/**
 * Landing page component - serves as the main entry point for new users
 */
const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('mood');
  const { isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  
  // Handle scroll events to add styling to the header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Redirect authenticated users to home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="landing-page">
      {/* Header */}
      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="landing-container">
          <div className="logo">
            <span className="logo-icon">🤗</span>
            <h1>HugMood</h1>
          </div>
          
          <nav className="landing-nav">
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#download">Download</a></li>
              <li><Link to="/user-guide">User Guide</Link></li>
            </ul>
          </nav>
          
          <div className="landing-cta">
            <Link to="/login" className="btn btn-outline">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="landing-container">
          <div className="hero-content">
            <h1>Share Emotional Support Through Virtual Hugs</h1>
            <p>Connect with loved ones, track your mood, and send personalized virtual hugs to brighten someone's day.</p>
            
            <div className="hero-buttons">
              <Link to="/get-started" className="btn btn-primary btn-lg">Get Started</Link>
              <Link to="/register" className="btn btn-success btn-lg">Create Account</Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
              <Link to="/anonymous" className="btn btn-outline btn-lg">Try Anonymously</Link>
            </div>
            
            <div className="feature-highlights">
              <div className="feature-highlight-item">
                <span className="highlight-icon">📊</span>
                <span className="highlight-text">Mood Tracking</span>
              </div>
              <div className="feature-highlight-item">
                <span className="highlight-icon">🤗</span>
                <span className="highlight-text">Virtual Hugs</span>
              </div>
              <div className="feature-highlight-item">
                <span className="highlight-icon">📈</span>
                <span className="highlight-text">Mood Analytics</span>
              </div>
              <div className="feature-highlight-item">
                <span className="highlight-icon">🧠</span>
                <span className="highlight-text">Therapy Support</span>
              </div>
            </div>
            
            <div className="app-stores">
              <a href="#download" className="store-badge">
                <img src="/img/app-store-badge.svg" alt="Download on App Store" />
              </a>
              <a href="#download" className="store-badge">
                <img src="/img/google-play-badge.svg" alt="Get it on Google Play" />
              </a>
            </div>
          </div>
          
          <div className="hero-image">
            <img src="/img/hero-mockup.png" alt="HugMood App" />
          </div>
        </div>
        
        <div className="hero-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="landing-container">
          <div className="section-header">
            <h2>Key Features</h2>
            <p>Discover how HugMood can enhance your emotional wellbeing.</p>
          </div>
          
          <div className="features-tabs">
            <div className="tabs-header">
              <button 
                className={`tab-button ${activeTab === 'mood' ? 'active' : ''}`}
                onClick={() => setActiveTab('mood')}
              >
                <span className="tab-icon">📊</span>
                Mood Tracking
              </button>
              
              <button 
                className={`tab-button ${activeTab === 'hugs' ? 'active' : ''}`}
                onClick={() => setActiveTab('hugs')}
              >
                <span className="tab-icon">🤗</span>
                Virtual Hugs
              </button>
              
              <button 
                className={`tab-button ${activeTab === 'social' ? 'active' : ''}`}
                onClick={() => setActiveTab('social')}
              >
                <span className="tab-icon">👥</span>
                Social Connection
              </button>
              
              <button 
                className={`tab-button ${activeTab === 'therapy' ? 'active' : ''}`}
                onClick={() => setActiveTab('therapy')}
              >
                <span className="tab-icon">🧠</span>
                Therapy Mode
              </button>
            </div>
            
            <div className="tabs-content">
              {activeTab === 'mood' && (
                <div className="tab-content-item">
                  <div className="content-text">
                    <h3>Track Your Emotional Journey</h3>
                    <p>Log your mood daily and gain insights through beautiful visualizations. Identify patterns and understand your emotional triggers.</p>
                    <ul className="feature-list">
                      <li>Daily mood logging with notes</li>
                      <li>Visual mood history charts</li>
                      <li>Pattern recognition and insights</li>
                      <li>Mood streak tracking and reminders</li>
                    </ul>
                  </div>
                  <div className="content-image">
                    <img src="/img/feature-mood.png" alt="Mood Tracking Feature" />
                  </div>
                </div>
              )}
              
              {activeTab === 'hugs' && (
                <div className="tab-content-item">
                  <div className="content-text">
                    <h3>Send Personalized Virtual Hugs</h3>
                    <p>Choose from a variety of hug types to match the emotional context. Express support in a unique and meaningful way.</p>
                    <ul className="feature-list">
                      <li>Various hug types for different emotions</li>
                      <li>Media hugs featuring movie characters</li>
                      <li>Immersive AR hug experiences</li>
                      <li>Custom message attachments</li>
                    </ul>
                  </div>
                  <div className="content-image">
                    <img src="/img/feature-hugs.png" alt="Virtual Hugs Feature" />
                  </div>
                </div>
              )}
              
              {activeTab === 'social' && (
                <div className="tab-content-item">
                  <div className="content-text">
                    <h3>Connect With Your Support Network</h3>
                    <p>Build a community of friends and family who understand and support your emotional wellbeing journey.</p>
                    <ul className="feature-list">
                      <li>Follow friends' mood updates</li>
                      <li>Create and join group hugs</li>
                      <li>Share achievements on social media</li>
                      <li>Discover like-minded community members</li>
                    </ul>
                  </div>
                  <div className="content-image">
                    <img src="/img/feature-social.png" alt="Social Connection Feature" />
                  </div>
                </div>
              )}
              
              {activeTab === 'therapy' && (
                <div className="tab-content-item">
                  <div className="content-text">
                    <h3>Support During Difficult Times</h3>
                    <p>Access therapeutic tools and resources designed to help you navigate challenging emotional periods.</p>
                    <ul className="feature-list">
                      <li>Guided breathing exercises</li>
                      <li>Positive affirmations library</li>
                      <li>Resource connections for professional help</li>
                      <li>Crisis support information</li>
                    </ul>
                  </div>
                  <div className="content-image">
                    <img src="/img/feature-therapy.png" alt="Therapy Mode Feature" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="landing-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Get started with HugMood in just a few simple steps.</p>
          </div>
          
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-icon">📱</div>
              <h3>Create Your Account</h3>
              <p>Sign up with email or social login and set up your profile.</p>
            </div>
            
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-icon">📊</div>
              <h3>Log Your Mood</h3>
              <p>Track how you're feeling daily and add context notes.</p>
            </div>
            
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-icon">👥</div>
              <h3>Connect With Friends</h3>
              <p>Find and follow friends to build your support network.</p>
            </div>
            
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-icon">🤗</div>
              <h3>Send Virtual Hugs</h3>
              <p>Share emotional support through personalized virtual hugs.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="landing-container">
          <div className="section-header">
            <h2>User Stories</h2>
            <p>See how HugMood is making a difference in people's lives.</p>
          </div>
          
          <div className="testimonials-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"HugMood has helped me stay connected with my daughter who's studying abroad. When I see her mood dipping, I send her a virtual hug and it brightens her day!"</p>
              </div>
              <div className="testimonial-author">
                <img src="/img/testimonial-1.jpg" alt="Sarah K." />
                <div>
                  <h4>Sarah K.</h4>
                  <p>HugMood User</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As someone dealing with anxiety, tracking my mood patterns has been incredibly valuable. The therapy mode resources have helped me through some tough days."</p>
              </div>
              <div className="testimonial-author">
                <img src="/img/testimonial-2.jpg" alt="Michael T." />
                <div>
                  <h4>Michael T.</h4>
                  <p>HugMood User</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"My friends and I use the group hug feature to celebrate our wins and support each other through challenges. It's become our virtual group therapy!"</p>
              </div>
              <div className="testimonial-author">
                <img src="/img/testimonial-3.jpg" alt="Priya R." />
                <div>
                  <h4>Priya R.</h4>
                  <p>HugMood User</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Download Section */}
      <section id="download" className="download-section">
        <div className="landing-container">
          <div className="download-content">
            <h2>Get HugMood Today</h2>
            <p>Available on iOS and Android devices. Start your emotional wellbeing journey now.</p>
            
            <div className="download-buttons">
              <a href="#" className="store-badge">
                <img src="/img/app-store-badge.svg" alt="Download on App Store" />
              </a>
              <a href="#" className="store-badge">
                <img src="/img/google-play-badge.svg" alt="Get it on Google Play" />
              </a>
            </div>
            
            <div className="web-version">
              <p>Or use the web version:</p>
              <div className="web-buttons">
                <Link to="/register" className="btn btn-primary">Create Account</Link>
                <Link to="/login" className="btn btn-secondary">Sign In</Link>
                <Link to="/anonymous" className="btn btn-outline">Track a Mood Now</Link>
              </div>
            </div>
          </div>
          
          <div className="download-image">
            <img src="/img/devices-mockup.png" alt="HugMood on multiple devices" />
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-icon">🤗</span>
              <h3>HugMood</h3>
              <p>Emotional wellbeing through virtual connection</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#how-it-works">How It Works</a></li>
                  <li><a href="#download">Download</a></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/press">Press</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Resources</h4>
                <ul>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/help">Help Center</Link></li>
                  <li><Link to="/community">Community</Link></li>
                  <li><Link to="/developers">Developers</Link></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Legal</h4>
                <ul>
                  <li><Link to="/terms-of-service">Terms of Service</Link></li>
                  <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link to="/cookies">Cookie Policy</Link></li>
                  <li><Link to="/accessibility">Accessibility</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
            
            <div className="copyright">
              <p>&copy; {new Date().getFullYear()} HugMood. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;