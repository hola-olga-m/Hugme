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
                  <Link to="/about" className="nav-link">About</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main style={{ padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
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