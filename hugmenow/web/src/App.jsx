import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Simple placeholder components for demonstration
const Home = () => (
  <div className="container">
    <h1>HugMeNow</h1>
    <p>Welcome to the HugMeNow emotional wellness platform</p>
    <div className="card">
      <h2>Getting Started</h2>
      <p>This is a simplified version of the application to verify the build process.</p>
      <div style={{ marginTop: '20px' }}>
        <Link to="/about" className="btn">Learn More</Link>
      </div>
    </div>
  </div>
);

const About = () => (
  <div className="container">
    <h1>About HugMeNow</h1>
    <p>A mobile-first emotional wellness platform that provides intuitive mental health tracking.</p>
    <div className="card">
      <h2>Features</h2>
      <ul>
        <li>Mood tracking</li>
        <li>Virtual hugs</li>
        <li>Community support</li>
        <li>Personal wellness journal</li>
      </ul>
    </div>
    <div style={{ marginTop: '20px' }}>
      <Link to="/" className="btn">Back to Home</Link>
    </div>
  </div>
);

// Auth page placeholders
const Login = () => (
  <div className="auth-container">
    <h1 className="auth-title">Login</h1>
    <div className="form-group">
      <label className="form-label">Email</label>
      <input type="email" className="form-input" placeholder="Enter your email" />
    </div>
    <div className="form-group">
      <label className="form-label">Password</label>
      <input type="password" className="form-input" placeholder="Enter your password" />
    </div>
    <button className="btn" style={{ width: '100%', marginBottom: '1rem' }}>Login</button>
    <div className="auth-footer">
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  </div>
);

const Register = () => (
  <div className="auth-container">
    <h1 className="auth-title">Register</h1>
    <div className="form-group">
      <label className="form-label">Name</label>
      <input type="text" className="form-input" placeholder="Enter your name" />
    </div>
    <div className="form-group">
      <label className="form-label">Email</label>
      <input type="email" className="form-input" placeholder="Enter your email" />
    </div>
    <div className="form-group">
      <label className="form-label">Password</label>
      <input type="password" className="form-input" placeholder="Create a password" />
    </div>
    <button className="btn" style={{ width: '100%', marginBottom: '1rem' }}>Register</button>
    <div className="auth-footer">
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  </div>
);

// App content placeholders
const Dashboard = () => (
  <div className="container">
    <h1>Dashboard</h1>
    <div className="dashboard-cards">
      <div className="dashboard-card">
        <h3 className="dashboard-card-title">Mood Streak</h3>
        <div className="stats-number">7</div>
        <p>days in a row</p>
      </div>
      <div className="dashboard-card">
        <h3 className="dashboard-card-title">Hugs Received</h3>
        <div className="stats-number">12</div>
        <p>this week</p>
      </div>
      <div className="dashboard-card">
        <h3 className="dashboard-card-title">Hugs Sent</h3>
        <div className="stats-number">8</div>
        <p>this week</p>
      </div>
    </div>
  </div>
);

const MoodTracker = () => (
  <div className="container">
    <h1>Mood Tracker</h1>
    <div className="card">
      <h2>How are you feeling today?</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '2rem 0' }}>
        {[1, 2, 3, 4, 5].map(score => (
          <button key={score} className="btn" style={{ flex: 1, margin: '0 0.5rem' }}>
            {score}
          </button>
        ))}
      </div>
      <div className="form-group">
        <label className="form-label">Add a note (optional)</label>
        <textarea className="form-input" rows="3" placeholder="What made you feel this way?"></textarea>
      </div>
      <button className="btn">Save Mood</button>
    </div>
  </div>
);

const HugCenter = () => (
  <div className="container">
    <h1>Hug Center</h1>
    <div className="card">
      <h2>Send a Virtual Hug</h2>
      <div className="form-group">
        <label className="form-label">Recipient</label>
        <select className="form-input">
          <option value="">Select a friend</option>
          <option value="1">Friend 1</option>
          <option value="2">Friend 2</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Hug Type</label>
        <select className="form-input">
          <option value="QUICK">Quick Hug</option>
          <option value="WARM">Warm Hug</option>
          <option value="SUPPORTIVE">Supportive Hug</option>
          <option value="COMFORTING">Comforting Hug</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Message (optional)</label>
        <textarea className="form-input" rows="3" placeholder="Add a personal message"></textarea>
      </div>
      <button className="btn">Send Hug</button>
    </div>
  </div>
);

const Profile = () => (
  <div className="container">
    <div className="profile-header">
      <img src="https://via.placeholder.com/100" alt="Profile" className="profile-avatar" />
      <div className="profile-info">
        <h1 className="profile-name">User Name</h1>
        <p className="profile-username">@username</p>
      </div>
    </div>
    <div className="card">
      <h2>Profile Settings</h2>
      <div className="form-group">
        <label className="form-label">Name</label>
        <input type="text" className="form-input" value="User Name" />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input type="email" className="form-input" value="user@example.com" />
      </div>
      <div className="form-group">
        <label className="form-label">Avatar URL</label>
        <input type="text" className="form-input" value="https://via.placeholder.com/100" />
      </div>
      <button className="btn">Save Changes</button>
    </div>
  </div>
);

function App({ initialPath }) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate initialization
  useEffect(() => {
    console.log('App component mounted');
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('App initialization complete');
    }, 1000);
    
    // If there was an initial path from direct navigation, log it
    if (initialPath) {
      console.log(`Initializing app with path: ${initialPath}`);
    }
    
    // Clean up function
    return () => {
      clearTimeout(timer);
      console.log('App component unmounting');
    };
  }, [initialPath]);
  
  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loader"></div>
        <h2>HugMeNow</h2>
        <p>Loading application...</p>
      </div>
    );
  }
  
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <nav className="nav">
              <div className="nav-logo">HugMeNow</div>
              <ul className="nav-menu">
                <li className="nav-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/mood-tracker" className="nav-link">Mood Tracker</Link>
                </li>
                <li className="nav-item">
                  <Link to="/hug-center" className="nav-link">Hug Center</Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">About</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main style={{ padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mood-tracker" element={<MoodTracker />} />
            <Route path="/hug-center" element={<HugCenter />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer style={{ textAlign: 'center', padding: '1rem 0', borderTop: '1px solid #eee' }}>
          <div className="container">
            <p>&copy; {new Date().getFullYear()} HugMeNow. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;