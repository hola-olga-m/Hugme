import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { register, error, clearError, loading } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError();
    setFormError('');
    
    // Simple validation
    if (!username || !email || !name || !password || !confirmPassword) {
      setFormError(t('validation.required'));
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setFormError(t('validation.passwordMatch'));
      return;
    }
    
    // Check password length
    if (password.length < 8) {
      setFormError(t('auth.passwordRequirements'));
      return;
    }
    
    // Check username format
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setFormError(t('validation.usernameFormat'));
      return;
    }
    
    try {
      // Call register method from AuthContext
      await register({
        username,
        email,
        name,
        password
      });
      
      // Redirect to dashboard on success
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      // Error already set in auth context
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <div className="auth-language-switcher">
          <LanguageSwitcher />
        </div>
        
        <h2 className="auth-title">{t('app.name')}</h2>
        <p className="auth-subtitle">{t('app.tagline')}</p>
        
        <h3>{t('auth.register')}</h3>
        
        {/* Display any error messages */}
        {(error || formError) && (
          <div className="error-message">
            {formError || error || t('errors.register')}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username">{t('auth.username')}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">{t('auth.name')}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength={8}
            />
            <small>{t('auth.passwordRequirements')}</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? t('app.loading') : t('auth.createAccount')}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            {t('auth.hasAccount')}{' '}
            <Link to="/login">{t('auth.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;