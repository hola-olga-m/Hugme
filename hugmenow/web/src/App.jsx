
import React, { useState } from 'react';
import './styles/main.css';

// Mock data for demonstration
const moodOptions = ['Happy', 'Calm', 'Sad', 'Anxious', 'Excited', 'Tired'];
const friendsList = [
  { id: 1, name: 'Alex Johnson', status: 'online', lastMood: 'Happy' },
  { id: 2, name: 'Taylor Smith', status: 'offline', lastMood: 'Calm' },
  { id: 3, name: 'Jordan Lee', status: 'online', lastMood: 'Excited' },
];

function App() {
  const [currentMood, setCurrentMood] = useState('');
  
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container flex justify-between items-center" style={{ padding: '1rem 0' }}>
          <div className="logo">
            <h1 className="text-xl text-primary font-bold">HugMeNow</h1>
          </div>
          <nav className="main-nav">
            <ul className="flex gap-md">
              <li><a href="#" className="text-primary">Home</a></li>
              <li><a href="#" className="text-light">Dashboard</a></li>
              <li><a href="#" className="text-light">Friends</a></li>
              <li><a href="#" className="text-light">Profile</a></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="app-main">
        <section className="hero-section" style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--primary-dark))', padding: '3rem 0', color: 'white' }}>
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-md">Share Your Mood, Send a Hug</h1>
            <p className="mb-lg">Connect emotionally with friends and loved ones through virtual hugs</p>
            <button className="btn btn-secondary">Send a Hug Now</button>
          </div>
        </section>
        
        <section className="mood-tracker-section" style={{ padding: '3rem 0' }}>
          <div className="container">
            <div className="card">
              <h2 className="text-xl mb-md">How are you feeling today?</h2>
              <div className="mood-options flex gap-md" style={{ flexWrap: 'wrap' }}>
                {moodOptions.map((mood) => (
                  <button 
                    key={mood} 
                    className={`btn ${currentMood === mood ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setCurrentMood(mood)}
                  >
                    {mood}
                  </button>
                ))}
              </div>
              {currentMood && (
                <div className="mt-lg">
                  <p>You're feeling <strong>{currentMood}</strong> today.</p>
                  <button className="btn btn-primary mt-md">Save Mood</button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        <section className="friends-section" style={{ padding: '3rem 0', backgroundColor: 'var(--background-white)' }}>
          <div className="container">
            <h2 className="text-xl mb-lg">Friends</h2>
            <div className="friends-list">
              {friendsList.map((friend) => (
                <div key={friend.id} className="card flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{friend.name}</h3>
                    <p className="text-light">Current mood: {friend.lastMood}</p>
                  </div>
                  <div className="flex gap-sm">
                    <span className={`status-indicator ${friend.status}`} style={{ 
                      display: 'inline-block', 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      backgroundColor: friend.status === 'online' ? '#4CAF50' : '#9E9E9E' 
                    }}></span>
                    <button className="btn btn-primary">Send Hug</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="app-footer" style={{ backgroundColor: 'var(--primary-dark)', color: 'white', padding: '2rem 0' }}>
        <div className="container">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold mb-sm">HugMeNow</h2>
              <p>Connecting hearts across distances</p>
            </div>
            <div>
              <ul className="flex gap-md">
                <li><a href="#" style={{ color: 'white' }}>About</a></li>
                <li><a href="#" style={{ color: 'white' }}>Privacy</a></li>
                <li><a href="#" style={{ color: 'white' }}>Terms</a></li>
                <li><a href="#" style={{ color: 'white' }}>Help</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-lg">
            <p>&copy; {new Date().getFullYear()} HugMeNow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
