import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import MainLayout from '../layouts/MainLayout';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login, anonymousLogin, error: authError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = t('errors.validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.validation.email');
    }
    
    if (!formData.password) {
      newErrors.password = t('errors.validation.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Call login function from AuthContext
      await login(formData.email, formData.password);
      
      // If successful, navigation is handled in the AuthContext
      
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle anonymous login
  const handleAnonymousLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Generate a random nickname for guest users
      const nickname = `Guest${Math.floor(Math.random() * 10000)}`;
      
      // Call anonymous login function from AuthContext
      await anonymousLogin(nickname);
      
      // If successful, navigation is handled in the AuthContext
      
    } catch (error) {
      setErrorMessage(error.message || 'Anonymous login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="auth-page">
        <div className="form-container">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>
          
          {(errorMessage || authError) && (
            <div className="auth-error">
              {errorMessage || authError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'has-error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="separator">
            <span>OR</span>
          </div>
          
          <button 
            className="btn btn-outline btn-block anonymous-login-btn"
            onClick={handleAnonymousLogin}
            disabled={isLoading}
          >
            Continue as Guest
          </button>
          
          <div className="form-footer">
            <p>Don't have an account? <Link to="/register" className="form-link">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;