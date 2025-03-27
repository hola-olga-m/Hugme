import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UPDATE_USER, REMOVE_USER } from '../graphql/mutations';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    avatarUrl: currentUser?.avatarUrl || '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setSuccess('Profile updated successfully!');
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  });
  
  const [removeUser, { loading: removing }] = useMutation(REMOVE_USER, {
    onCompleted: () => {
      logout();
      navigate('/', { 
        state: { notification: 'Your account has been deleted successfully.' } 
      });
    },
    onError: (error) => {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again.');
      setShowDeleteConfirm(false);
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // If password fields are filled, validate they match
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Create update payload (only include non-empty fields)
    const updatePayload = {};
    if (formData.name) updatePayload.name = formData.name;
    if (formData.avatarUrl) updatePayload.avatarUrl = formData.avatarUrl;
    if (formData.password) updatePayload.password = formData.password;
    
    try {
      await updateUser({
        variables: {
          updateUserInput: updatePayload
        }
      });
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await removeUser();
    } catch (err) {
      // Error is handled in onError callback
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Your Profile</h1>
        
        {error && (
          <div className="alert alert-error">
            <div className="alert-content">
              <p>{error}</p>
              <button onClick={() => setError('')} className="alert-close">&times;</button>
            </div>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <div className="alert-content">
              <p>{success}</p>
              <button onClick={() => setSuccess('')} className="alert-close">&times;</button>
            </div>
          </div>
        )}
        
        <div className="profile-section">
          <div className="profile-info">
            <div className="profile-avatar">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} />
              ) : (
                <div className="avatar-placeholder">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-details">
              <h2>{currentUser.name}</h2>
              <p className="profile-username">@{currentUser.username}</p>
              <p className="profile-email">{currentUser.email}</p>
              <p className="profile-member-since">
                Member since {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h3>Edit Profile</h3>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Your name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="avatarUrl" className="form-label">Avatar URL</label>
              <input
                type="url"
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                className="form-input"
                placeholder="URL to your avatar image"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="New password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm new password"
                disabled={!formData.password}
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={updating}
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="profile-section danger-zone">
          <h3>Danger Zone</h3>
          <p className="danger-info">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          {!showDeleteConfirm ? (
            <button 
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </button>
          ) : (
            <div className="delete-confirmation">
              <p>Are you sure you want to delete your account?</p>
              <div className="confirmation-actions">
                <button 
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={removing}
                >
                  {removing ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={removing}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;