import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const { login, anonymousLogin, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Handle regular login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t('login.errorEmptyFields'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || t('login.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle anonymous login
  const handleAnonymousLogin = async (e) => {
    e.preventDefault();
    
    if (!nickname) {
      setError(t('login.errorNoNickname'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await anonymousLogin(nickname);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || t('login.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2 className="auth-title">{t('login.title')}</h2>
        
        {(error || authError) && (
          <div className="error-message">
            {error || authError}
          </div>
        )}
        
        <div className="auth-tabs">
          <div className="auth-tab-content">
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">{t('login.email')}</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.emailPlaceholder')}
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">{t('login.password')}</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  disabled={isLoading}
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? t('login.loggingIn') : t('login.submit')}
              </button>
            </form>
            
            <div className="auth-separator">
              <span>{t('login.or')}</span>
            </div>
            
            <form className="auth-form" onSubmit={handleAnonymousLogin}>
              <div className="form-group">
                <label htmlFor="nickname">{t('login.nickname')}</label>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={t('login.nicknamePlaceholder')}
                  disabled={isLoading}
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-outline btn-block"
                disabled={isLoading}
              >
                {isLoading ? t('login.loggingIn') : t('login.continueAsGuest')}
              </button>
            </form>
          </div>
        </div>
        
        <div className="auth-links">
          <p>
            {t('login.noAccount')}{' '}
            <Link to="/register">{t('login.register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;