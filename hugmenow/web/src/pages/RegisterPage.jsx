import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { detectErrorType, getErrorMessage, logError } from '../utils/errorHandling';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordsMismatch'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(
        formData.username,
        formData.email,
        formData.name,
        formData.password
      );
      navigate('/dashboard');
    } catch (error) {
      const errorType = detectErrorType(error, { context: 'register' });
      const errorDetails = getErrorMessage(errorType);
      setError(t(errorDetails.title));
      logError(error, { 
        context: 'register', 
        email: formData.email,
        username: formData.username 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t('register.title')}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{t('register.username')}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">{t('register.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">{t('register.fullName')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('register.password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('register.confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? t('common.loading') : t('register.registerButton')}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/login" className="auth-link">
            {t('register.haveAccount')}
          </Link>
          <Link to="/anonymous" className="auth-link">
            {t('register.continueAnonymously')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;