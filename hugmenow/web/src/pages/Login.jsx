import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { t } = useTranslation();
  const { login, anonymousLogin, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [anonymousData, setAnonymousData] = useState({
    nickname: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAnonymousForm, setShowAnonymousForm] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle anonymous form input changes
  const handleAnonymousChange = (e) => {
    const { name, value } = e.target;
    setAnonymousData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle regular login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      // Error is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  // Handle anonymous login
  const handleAnonymousLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await anonymousLogin(anonymousData.nickname);
      navigate('/');
    } catch (err) {
      console.error('Anonymous login error:', err);
      // Error is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between regular and anonymous login forms
  const toggleAnonymousForm = () => {
    setShowAnonymousForm(prev => !prev);
    clearError();
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2 className="auth-title">{t('app.name')}</h2>
        <p className="auth-subtitle">{t('app.tagline')}</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {showAnonymousForm ? (
          <>
            <h3>{t('auth.anonymousLogin')}</h3>
            <form className="auth-form" onSubmit={handleAnonymousLogin}>
              <div className="form-group">
                <label htmlFor="nickname">{t('auth.nickname')}</label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={anonymousData.nickname}
                  onChange={handleAnonymousChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={isLoading}
              >
                {isLoading ? t('common.loading') : t('auth.continueAnonymously')}
              </button>
            </form>
            
            <div className="auth-divider">
              <span>{t('common.or')}</span>
            </div>
            
            <button 
              className="btn btn-outline btn-block"
              onClick={toggleAnonymousForm}
            >
              {t('auth.useCredentials')}
            </button>
          </>
        ) : (
          <>
            <h3>{t('auth.login')}</h3>
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">{t('auth.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">{t('auth.password')}</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={isLoading}
              >
                {isLoading ? t('common.loading') : t('auth.login')}
              </button>
            </form>
            
            <div className="auth-divider">
              <span>{t('common.or')}</span>
            </div>
            
            <button 
              className="btn btn-outline btn-block"
              onClick={toggleAnonymousForm}
            >
              {t('auth.anonymousLogin')}
            </button>
          </>
        )}
        
        <div className="auth-links">
          <p>
            {t('auth.noAccount')} <Link to="/register">{t('auth.register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;