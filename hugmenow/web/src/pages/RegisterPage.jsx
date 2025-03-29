import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { isValidUsername, isValidEmail, validatePassword, isValidName, getValidationErrorMessage } from '../validation/userValidation';

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
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    isValid: false
  });
  
  // Clear errors when inputs change after a submission attempt
  useEffect(() => {
    if (formSubmitted) {
      clearError();
      setFormError('');
    }
  }, [username, email, name, password, confirmPassword, formSubmitted, clearError]);
  
  // Effect to validate password as user types
  useEffect(() => {
    if (password) {
      const validations = {
        length: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
      };
      
      const isValid = Object.values(validations).every(v => v);
      
      setPasswordValidation({
        ...validations,
        isValid
      });
    } else {
      // Reset validation when password is empty
      setPasswordValidation({
        length: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        isValid: false
      });
    }
  }, [password]);
  
  // Effect to sync with auth context errors
  useEffect(() => {
    if (error && formSubmitted) {
      console.log('Auth context reported error:', error);
      setFormError(error);
    }
  }, [error, formSubmitted]);
  
  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearError();
    setFormError('');
    setFormSubmitted(true);
    
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
    
    // Use our imported validation functions
    const passwordValidationResult = validatePassword(password);
    if (!passwordValidationResult.isValid) {
      setFormError(t('auth.passwordRequirements'));
      return;
    }
    
    // Check that username is not an email address
    if (!isValidUsername(username)) {
      if (username.includes('@')) {
        setFormError('Username cannot be an email address. Please use a simple name without the @ symbol.');
      } else {
        setFormError(t('validation.usernameFormat'));
      }
      return;
    }
    
    // Check email format
    if (!isValidEmail(email)) {
      setFormError(t('validation.emailFormat'));
      return;
    }
    
    // Check name is valid
    if (!isValidName(name)) {
      setFormError(t('validation.nameTooShort'));
      return;
    }
    
    try {
      console.log('RegisterPage: Submitting registration data', {
        username,
        email,
        name,
        // Password omitted for security
      });
      
      // Call register method from AuthContext
      const user = await register({
        username,
        email,
        name,
        password
      });
      
      console.log('RegisterPage: Registration successful, user:', user?.username);
      
      // Redirect to dashboard on success
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('RegisterPage: Registration error:', err);
      
      // Provide more specific error messages based on the error
      if (err.message) {
        if (err.message.includes('already exists') || 
            err.message.includes('duplicate') || 
            err.message.includes('unique constraint')) {
          setFormError(t('validation.alreadyExists'));
        } else if (err.message.includes('password')) {
          setFormError(t('auth.passwordRequirements'));
        } else if (err.message.includes('username')) {
          setFormError(t('validation.usernameFormat'));
        } else if (err.message.includes('email')) {
          setFormError(t('validation.emailFormat'));
        } else if (err.message.includes('Network Error') || 
                  err.message.includes('Failed to fetch') ||
                  err.message.includes('timeout')) {
          setFormError(t('errors.network'));
        } else {
          // Use the specific error message
          setFormError(err.message);
        }
      } else {
        // Use the error from auth context if available, or a generic message
        setFormError(error || t('errors.register'));
      }
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
            <div className="password-requirements">
              <small>{t('auth.passwordRequirements')}</small>
              {password.length > 0 && (
                <ul className="password-validation-list">
                  <li className={passwordValidation.length ? 'valid' : 'invalid'}>
                    {passwordValidation.length ? '✓' : '✗'} {t('auth.passwordLength')}
                  </li>
                  <li className={passwordValidation.hasUppercase ? 'valid' : 'invalid'}>
                    {passwordValidation.hasUppercase ? '✓' : '✗'} {t('auth.passwordUppercase')}
                  </li>
                  <li className={passwordValidation.hasLowercase ? 'valid' : 'invalid'}>
                    {passwordValidation.hasLowercase ? '✓' : '✗'} {t('auth.passwordLowercase')}
                  </li>
                  <li className={passwordValidation.hasNumber ? 'valid' : 'invalid'}>
                    {passwordValidation.hasNumber ? '✓' : '✗'} {t('auth.passwordNumber')}
                  </li>
                </ul>
              )}
            </div>
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
          
          {error && (
            <div className="error-message mt-3 p-2 bg-danger text-white rounded">
              <p><strong>Error:</strong> {error}</p>
              <small>If this issue persists, please try a different email or password.</small>
            </div>
          )}
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