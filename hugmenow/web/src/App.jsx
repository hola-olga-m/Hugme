import React, { useState, useEffect } from 'react';

const App = () => {
  const [appInfo, setAppInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppInfo = async () => {
      try {
        console.log('Fetching app info...');
        const response = await fetch('/api/info');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch app info: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('App info received:', data);
        setAppInfo(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching app info:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAppInfo();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="hero" style={{ textAlign: 'center', padding: '50px 0' }}>
          <h1>Loading HugMeNow...</h1>
          <p>Please wait while we set things up for you.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="hero" style={{ textAlign: 'center', padding: '50px 0', color: '#d9534f' }}>
          <h1>Something went wrong</h1>
          <p>{error}</p>
          <p>The API server may not be running. Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="header">
        <div className="container">
          <nav>
            <div className="logo">HugMeNow</div>
            <ul className="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/moods">Mood Tracker</a></li>
              <li><a href="/hugs">Hug Center</a></li>
              <li><a href="/login">Login</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>Welcome to HugMeNow</h1>
          <p>Your emotional wellness companion for better mental health.</p>
          <a href="/register" className="btn">Get Started</a>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Features</h2>
          <div className="feature-grid">
            {appInfo && appInfo.features && appInfo.features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-content">
                  <h3 className="feature-title">{feature}</h3>
                  <p>Experience the benefits of our carefully designed emotional wellness tools.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} HugMeNow. All rights reserved.</p>
          {appInfo && (
            <p>Version: {appInfo.version} | Status: {appInfo.status}</p>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;