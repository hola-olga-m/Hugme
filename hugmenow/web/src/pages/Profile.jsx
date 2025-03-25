import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useAuth } from '../context/AuthContext';

// GraphQL operations
const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      name
      avatarUrl
      isAnonymous
      createdAt
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      username
      email
      name
      avatarUrl
    }
  }
`;

const Profile = () => {
  const { user, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  
  const { loading, error, data } = useQuery(GET_ME);
  const [updateUser] = useMutation(UPDATE_USER);
  
  const [formData, setFormData] = useState({
    name: '',
    avatarUrl: '',
    password: '',
    confirmPassword: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Update form data when user data is loaded
  React.useEffect(() => {
    if (data?.me) {
      setFormData(prevState => ({
        ...prevState,
        name: data.me.name || '',
        avatarUrl: data.me.avatarUrl || '',
      }));
    }
  }, [data]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
    
    // Clear success message on form change
    if (successMessage) {
      setSuccessMessage('');
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare update input (only include non-empty fields)
      const updateUserInput = {};
      
      if (formData.name) updateUserInput.name = formData.name;
      if (formData.avatarUrl) updateUserInput.avatarUrl = formData.avatarUrl;
      if (formData.password) updateUserInput.password = formData.password;
      
      const { data } = await updateUser({
        variables: { updateUserInput }
      });
      
      if (data.updateUser) {
        // Update user in context
        updateUserInfo(data.updateUser);
        
        // Show success message
        setSuccessMessage('Profile updated successfully!');
        
        // Clear password fields
        setFormData({
          ...formData,
          password: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      setFormErrors({ submit: error.message || 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) return <div className="loading">Loading profile...</div>;
  
  if (error) return <div className="error">Error loading profile: {error.message}</div>;
  
  const userProfile = data?.me;
  
  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">Your Profile</h1>
        
        {userProfile?.isAnonymous && (
          <div className="anonymous-warning">
            <p>
              <strong>Note:</strong> You're using a guest account. To save your data permanently,
              please register for a full account.
            </p>
          </div>
        )}
        
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        
        {formErrors.submit && (
          <div className="error-message">{formErrors.submit}</div>
        )}
        
        <div className="profile-grid">
          <div className="profile-card profile-info">
            <h2>Account Information</h2>
            
            <div className="profile-details">
              <div className="profile-avatar">
                {userProfile?.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="avatar avatar-large"
                  />
                ) : (
                  <div className="avatar-placeholder avatar-large">
                    {userProfile?.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              
              <div className="profile-info-list">
                <div className="profile-info-item">
                  <span className="info-label">Username:</span>
                  <span className="info-value">{userProfile?.username}</span>
                </div>
                
                <div className="profile-info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{userProfile?.email || 'Not available'}</span>
                </div>
                
                <div className="profile-info-item">
                  <span className="info-label">Account Type:</span>
                  <span className="info-value">
                    {userProfile?.isAnonymous ? 'Guest Account' : 'Registered Account'}
                  </span>
                </div>
                
                <div className="profile-info-item">
                  <span className="info-label">Joined:</span>
                  <span className="info-value">
                    {userProfile?.createdAt
                      ? new Date(userProfile.createdAt).toLocaleDateString()
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="profile-card profile-edit">
            <h2>Edit Profile</h2>
            
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Display Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  disabled={isSubmitting}
                />
                {formErrors.name && <div className="field-error">{formErrors.name}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="avatarUrl">Avatar URL</label>
                <input
                  type="text"
                  id="avatarUrl"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="URL to your avatar image"
                  disabled={isSubmitting}
                />
                {formErrors.avatarUrl && <div className="field-error">{formErrors.avatarUrl}</div>}
                <div className="field-help">Enter a URL to an image for your profile picture</div>
              </div>
              
              <h3 className="section-title">Change Password</h3>
              
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password (leave blank to keep current)"
                  disabled={isSubmitting}
                />
                {formErrors.password && <div className="field-error">{formErrors.password}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  disabled={isSubmitting || !formData.password}
                />
                {formErrors.confirmPassword && (
                  <div className="field-error">{formErrors.confirmPassword}</div>
                )}
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;