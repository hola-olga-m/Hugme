import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, anonymousLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { success, error } = await login(formData.email, formData.password);
      
      if (success) {
        // Redirect to the original requested page or dashboard
        navigate(from, { replace: true });
      } else {
        setFormErrors({ submit: error || 'Login failed. Please try again.' });
      }
    } catch (error) {
      setFormErrors({ submit: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setIsSubmitting(true);
    
    try {
      // Generate a random nickname for the anonymous user
      const nickname = `Guest${Math.floor(Math.random() * 10000)}`;
      
      const { success, error } = await anonymousLogin(nickname);
      
      if (success) {
        navigate('/dashboard', { replace: true });
      } else {
        setFormErrors({ submit: error || 'Anonymous login failed. Please try again.' });
      }
    } catch (error) {
      setFormErrors({ submit: error.message || 'Anonymous login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-form-container">
          <h1 className="auth-title">Log in to HugMeNow</h1>
          
          {formErrors.submit && (
            <div className="error-message">{formErrors.submit}</div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
              {formErrors.email && <div className="field-error">{formErrors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              {formErrors.password && <div className="field-error">{formErrors.password}</div>}
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>
          
          <div className="auth-separator">
            <span>OR</span>
          </div>
          
          <button
            onClick={handleAnonymousLogin}
            className="btn btn-outline btn-block"
            disabled={isSubmitting}
          >
            Continue as Guest
          </button>
          
          <div className="auth-links">
            <p>
              Don't have an account?{' '}
              <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;