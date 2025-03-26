import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Login = () => {
  const { t } = useTranslation();
  const { login, anonymousLogin, error, clearError, loading } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showAnonymous, setShowAnonymous] = useState(false);
  
  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    
    try {
      // Call login method from AuthContext - passing email and password separately
      await login(email, password);
      
      // Redirect to dashboard on success
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      // Error already set in auth context
    }
  };
  
  // Handle anonymous login
  const handleAnonymousLogin = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!nickname.trim()) {
      // Simple validation
      return;
    }
    
    try {
      // Call anonymousLogin method from AuthContext - passing nickname directly
      await anonymousLogin(nickname);
      
      // Redirect to dashboard on success
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Anonymous login error:', err);
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
        
        {!showAnonymous ? (
          <>
            <h3>{t('auth.login')}</h3>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form className="auth-form" onSubmit={handleLogin}>
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
                <label htmlFor="password">{t('auth.password')}</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? t('app.loading') : t('auth.login')}
              </button>
            </form>
            
            <div className="auth-divider">
              <span>{t('auth.orContinueWith')}</span>
            </div>
            
            <button
              onClick={() => setShowAnonymous(true)}
              className="btn btn-outline btn-block"
              disabled={loading}
            >
              {t('auth.anonymousLogin')}
            </button>
            
            <div className="auth-links">
              <p>
                {t('auth.noAccount')}{' '}
                <Link to="/register">{t('auth.register')}</Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <h3>{t('auth.anonymousLogin')}</h3>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form className="auth-form" onSubmit={handleAnonymousLogin}>
              <div className="form-group">
                <label htmlFor="nickname">{t('auth.nickname')}</label>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  disabled={loading}
                  required
                  minLength={3}
                  maxLength={30}
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? t('app.loading') : t('auth.anonymousLogin')}
              </button>
            </form>
            
            <button
              onClick={() => setShowAnonymous(false)}
              className="btn btn-outline btn-block"
              disabled={loading}
            >
              {t('app.goBack')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;