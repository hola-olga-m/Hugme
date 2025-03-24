import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const AnonymousMode = () => {
  const [formData, setFormData] = useState({
    nickname: '',
    avatarId: 1
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [anonError, setAnonError] = useState('');
  const { startAnonymousSession, isAuthenticated, isAnonymous } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already authenticated and not anonymous, redirect to dashboard
    if (isAuthenticated && !isAnonymous) {
      navigate('/dashboard', { replace: true });
    }
    // If already authenticated and anonymous, redirect to dashboard
    else if (isAuthenticated && isAnonymous) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAnonymous, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear general error when user changes any field
    if (anonError) {
      setAnonError('');
    }
  };
  
  const handleAvatarSelect = (id) => {
    setFormData({
      ...formData,
      avatarId: id
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = 'Nickname is required';
    } else if (formData.nickname.length < 3 || formData.nickname.length > 20) {
      newErrors.nickname = 'Nickname must be between 3 and 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setAnonError('');
    
    try {
      await startAnonymousSession(formData.nickname, formData.avatarId);
      // Will redirect via useEffect when auth state updates
    } catch (error) {
      console.error('Anonymous login failed:', error);
      setAnonError(
        error.message || 'Failed to start anonymous session. Please try again.'
      );
      setIsLoading(false);
    }
  };
  
  const handleSkip = async () => {
    setIsLoading(true);
    
    try {
      // Use default guest name and avatar
      await startAnonymousSession('Guest', 1);
      // Will redirect via useEffect when auth state updates
    } catch (error) {
      console.error('Anonymous login failed:', error);
      setAnonError(
        error.message || 'Failed to start anonymous session. Please try again.'
      );
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container anonymous-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <i className="fas fa-heart-circle"></i>
            <span>HugMood</span>
          </div>
          <h2 className="auth-title">Guest Mode</h2>
          <p className="auth-subtitle">Try HugMood without creating an account</p>
        </div>
        
        {anonError && (
          <div className="auth-error">
            <i className="fas fa-exclamation-circle"></i>
            <span>{anonError}</span>
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className={`form-group ${errors.nickname ? 'has-error' : ''}`}>
            <label htmlFor="nickname">Nickname (optional)</label>
            <div className="input-with-icon">
              <i className="fas fa-user-tag"></i>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="Enter a nickname"
                disabled={isLoading}
              />
            </div>
            {errors.nickname && <div className="error-message">{errors.nickname}</div>}
          </div>
          
          <div className="avatar-selection">
            <label>Choose an Avatar</label>
            <div className="avatar-grid">
              {/* Create 6 sample avatars with different colors */}
              {[1, 2, 3, 4, 5, 6].map((id) => (
                <div 
                  key={id}
                  className={`avatar-option ${formData.avatarId === id ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(id)}
                >
                  <div className={`avatar avatar-${id}`}>
                    <i className="fas fa-user"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button primary-button"
            disabled={isLoading}
          >
            {isLoading ? <Loading type="spinner" size="small" text="" /> : 'Continue as Guest'}
          </button>
          
          <button 
            type="button" 
            className="auth-button skip-button"
            onClick={handleSkip}
            disabled={isLoading}
          >
            Skip and Continue
          </button>
        </form>
        
        <div className="anonymous-info">
          <i className="fas fa-info-circle"></i>
          <p>
            Guest mode lets you explore HugMood without registration. Your data will be available
            only on this device and only for this session. You can create an account later to save your data.
          </p>
        </div>
        
        <div className="auth-footer">
          <p>
            Ready for a full experience? <Link to="/auth/register">Create an Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnonymousMode;