import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !email || !name || !password) {
      setError(t('register.errorEmptyFields'));
      return;
    }
    
    if (password !== confirmPassword) {
      setError(t('register.errorPasswordMismatch'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await register(username, email, name, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || t('register.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2 className="auth-title">{t('register.title')}</h2>
        
        {(error || authError) && (
          <div className="error-message">
            {error || authError}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="username">{t('register.username')}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('register.usernamePlaceholder')}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">{t('register.email')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('register.emailPlaceholder')}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">{t('register.name')}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('register.namePlaceholder')}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('register.password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('register.passwordPlaceholder')}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('register.confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('register.confirmPasswordPlaceholder')}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? t('register.registering') : t('register.submit')}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            {t('register.alreadyAccount')}{' '}
            <Link to="/login">{t('register.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;