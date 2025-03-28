import React from 'react';
import { Link } from 'react-router-dom';

/**
 * SimpleLayout component
 * A simplified layout for public pages that don't require authentication
 * or theme context dependencies
 */
const SimpleLayout = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            color: '#4a90e2',
            margin: 0
          }}>HugMeNow</h1>
          <nav>
            <Link 
              to="/login" 
              style={{
                marginLeft: '16px',
                color: '#4a90e2',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{
                marginLeft: '16px',
                color: '#4a90e2',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Register
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '20px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto'
      }}>
        {children}
      </main>
      
      {/* Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        padding: '16px',
        textAlign: 'center',
        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          color: '#666'
        }}>© {new Date().getFullYear()} HugMeNow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SimpleLayout;