import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';
import LoadingScreen from '../components/common/LoadingScreen';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile, error, clearError } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatarUrl: user?.avatarUrl || '',
    password: '',
    confirmPassword: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when input changes
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    if (error) {
      clearError();
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form when canceling edit
      setFormData({
        name: user?.name || '',
        avatarUrl: user?.avatarUrl || '',
        password: '',
        confirmPassword: ''
      });
      setValidationErrors({});
    }
    
    setIsEditing(prev => !prev);
    setSuccessMessage('');
    clearError();
  };

  // Basic form validation
  const validateForm = () => {
    const errors = {};
    
    if (formData.name.length < 2) {
      errors.name = t('validation.nameTooShort');
    }
    
    if (formData.password && formData.password.length < 6) {
      errors.password = t('validation.passwordTooShort');
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('validation.passwordsDontMatch');
    }
    
    if (formData.avatarUrl && !/^https?:\/\/.+/.test(formData.avatarUrl)) {
      errors.avatarUrl = t('validation.invalidUrl');
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Only include non-empty fields in update data
      const updateData = {};
      if (formData.name !== user.name) updateData.name = formData.name;
      if (formData.avatarUrl !== user.avatarUrl) updateData.avatarUrl = formData.avatarUrl;
      if (formData.password) updateData.password = formData.password;
      
      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData);
        setSuccessMessage(t('profile.updateSuccess'));
        
        // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      // Error is handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen if no user data
  if (!user) {
    return (
      <AppLayout>
        <LoadingScreen message={t('profile.loading')} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="profile-container">
        <div className="profile-header">
          <h1>{t('profile.title')}</h1>
          {!isEditing && (
            <button 
              className="btn btn-primary edit-profile-btn"
              onClick={toggleEditMode}
            >
              {t('profile.edit')}
            </button>
          )}
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        <div className="profile-content">
          <div className="profile-avatar">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name || user.username} />
            ) : (
              <div className="avatar-placeholder">
                {(user.name || user.username || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {isEditing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">{t('profile.name')}</label>
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
                <label htmlFor="avatarUrl">{t('profile.avatarUrl')}</label>
                <input
                  type="text"
                  id="avatarUrl"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className={validationErrors.avatarUrl ? 'error' : ''}
                />
                {validationErrors.avatarUrl && (
                  <div className="field-error">{validationErrors.avatarUrl}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">{t('profile.newPassword')}</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('profile.leaveEmptyToKeep')}
                  className={validationErrors.password ? 'error' : ''}
                />
                {validationErrors.password && (
                  <div className="field-error">{validationErrors.password}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">{t('profile.confirmPassword')}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={!formData.password}
                  className={validationErrors.confirmPassword ? 'error' : ''}
                />
                {validationErrors.confirmPassword && (
                  <div className="field-error">{validationErrors.confirmPassword}</div>
                )}
              </div>
              
              <div className="profile-form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={isLoading}
                >
                  {isLoading ? t('common.loading') : t('profile.save')}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={toggleEditMode}
                  disabled={isLoading}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="profile-detail">
                <h3>{t('profile.username')}</h3>
                <p>{user.username}</p>
              </div>
              
              <div className="profile-detail">
                <h3>{t('profile.name')}</h3>
                <p>{user.name || t('profile.notProvided')}</p>
              </div>
              
              <div className="profile-detail">
                <h3>{t('profile.email')}</h3>
                <p>{user.email || t('profile.notProvided')}</p>
              </div>
              
              <div className="profile-detail">
                <h3>{t('profile.accountType')}</h3>
                <p>{user.isAnonymous ? t('profile.anonymous') : t('profile.registered')}</p>
              </div>
              
              <div className="profile-detail">
                <h3>{t('profile.memberSince')}</h3>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;