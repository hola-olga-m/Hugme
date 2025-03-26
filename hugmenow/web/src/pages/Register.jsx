import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { t } = useTranslation();
  const { register, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});

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
    
    // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        setPasswordsMatch(value === formData.confirmPassword);
      } else {
        setPasswordsMatch(formData.password === value);
      }
    }
    
    // Clear validation errors when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Always clear API error when form changes
    if (error) {
      clearError();
    }
  };

  // Basic form validation
  const validateForm = () => {
    const errors = {};
    
    if (formData.username.length < 3) {
      errors.username = t('validation.usernameTooShort');
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('validation.invalidEmail');
    }
    
    if (formData.name.length < 2) {
      errors.name = t('validation.nameTooShort');
    }
    
    if (formData.password.length < 6) {
      errors.password = t('validation.passwordTooShort');
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('validation.passwordsDontMatch');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Omit confirmPassword from the data sent to API
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      // Error is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
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
        
        <h3>{t('auth.register')}</h3>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{t('auth.username')}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={validationErrors.username ? 'error' : ''}
            />
            {validationErrors.username && (
              <div className="field-error">{validationErrors.username}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={validationErrors.email ? 'error' : ''}
            />
            {validationErrors.email && (
              <div className="field-error">{validationErrors.email}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="name">{t('auth.fullName')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={validationErrors.name ? 'error' : ''}
            />
            {validationErrors.name && (
              <div className="field-error">{validationErrors.name}</div>
            )}
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
              className={validationErrors.password ? 'error' : ''}
            />
            {validationErrors.password && (
              <div className="field-error">{validationErrors.password}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={validationErrors.confirmPassword ? 'error' : ''}
            />
            {validationErrors.confirmPassword && (
              <div className="field-error">{validationErrors.confirmPassword}</div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={isLoading || !passwordsMatch}
          >
            {isLoading ? t('common.loading') : t('auth.createAccount')}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            {t('auth.alreadyHaveAccount')} <Link to="/login">{t('auth.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;