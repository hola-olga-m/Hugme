import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, anonymousLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);
    
    const { email, password } = formData;
    
    if (!email || !password) {
      setFormError('Email and password are required');
      setIsLoading(false);
      return;
    }
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setFormError(result.error || 'Failed to login. Please check your credentials.');
    }
    
    setIsLoading(false);
  };

  const handleAnonymousLogin = async () => {
    setFormError('');
    setIsLoading(true);
    
    // Generate a random nickname based on current time
    const randomNickname = `Guest_${Math.floor(Math.random() * 10000)}`;
    
    const result = await anonymousLogin(randomNickname);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setFormError(result.error || 'Failed to create anonymous session');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2 className="auth-title">Log In</h2>
        
        {formError && (
          <div className="alert alert-error">
            <div className="alert-content">
              <p>{formError}</p>
            </div>
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-loader"></span>
                Logging in...
              </>
            ) : 'Log In'}
          </button>
        </form>
        
        <div className="auth-separator">
          <span>Or</span>
        </div>
        
        <button 
          className="btn btn-outline btn-block mb-3"
          onClick={handleAnonymousLogin}
          disabled={isLoading}
        >
          Continue as Guest
        </button>
        
        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;