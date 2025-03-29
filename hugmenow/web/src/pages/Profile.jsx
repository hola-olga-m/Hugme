import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

// Styled components
const ProfileContainer = styled.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`;

const ProfileHeader = styled.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: var(--primary-color);
  }
  
  &::before {
    content: '←';
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const ProfileContent = styled.main`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`;

const ProfileTitle = styled.h1`
  color: var(--gray-800);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-800);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  
  &:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 102, 255, 0.25);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`;

const DeleteButton = styled(Button)`
  background-color: white;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  
  &:hover:not(:disabled) {
    background-color: var(--danger-color);
    color: white;
  }
`;

const ErrorMessage = styled.div`
  background-color: var(--danger-color);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
`;

const SuccessMessage = styled.div`
  background-color: var(--success-color);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
`;

const DeleteAccountModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 90%;
  
  h2 {
    color: var(--danger-color);
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  
  &:hover {
    background-color: var(--gray-100);
  }
`;

const ConfirmDeleteButton = styled(Button)`
  background-color: var(--danger-color);
  color: white;
  border: none;
  
  &:hover {
    background-color: var(--danger-dark);
  }
`;

const Profile = () => {
  const { currentUser, updateProfile, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    password: '',
    confirmPassword: '',
    avatarUrl: currentUser?.avatarUrl || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password match if attempting to change password
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Only include password if it was provided
      const updateData = {
        name: formData.name,
        ...(formData.password ? { password: formData.password } : {}),
        ...(formData.avatarUrl ? { avatarUrl: formData.avatarUrl } : {}),
      };
      
      await updateProfile(updateData);
      setSuccessMessage('Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // For this example, we'll just log out since delete functionality
      // would need to be implemented in the backend
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Delete account error:', error);
      setErrorMessage(error.message || 'Failed to delete account');
      setShowDeleteModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  if (loading) {
    return <LoadingScreen text="Loading profile..." />;
  }
  
  // Redirect if user is not authenticated
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);
  
  if (!currentUser) {
    return null; // Avoid rendering the profile if no user exists
  }
  
  return (
    <ProfileContainer>
      <ProfileHeader>
        <Logo onClick={navigateToDashboard}>HugMeNow</Logo>
        <BackButton onClick={navigateToDashboard}>Back to Dashboard</BackButton>
      </ProfileHeader>
      
      <ProfileContent>
        <ProfileCard>
          <ProfileTitle>Your Profile</ProfileTitle>
          
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          
          <ProfileForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
              <Input
                type="text"
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="Enter URL for your avatar image"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">New Password (leave blank to keep current)</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </FormGroup>
            
            <ButtonGroup>
              <DeleteButton 
                type="button" 
                onClick={() => setShowDeleteModal(true)}
                disabled={isSubmitting}
              >
                Delete Account
              </DeleteButton>
              
              <SaveButton 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </SaveButton>
            </ButtonGroup>
          </ProfileForm>
        </ProfileCard>
      </ProfileContent>
      
      {showDeleteModal && (
        <DeleteAccountModal>
          <ModalContent>
            <h2>Delete Account</h2>
            <p>
              Are you sure you want to delete your account? This action cannot be undone
              and all your data will be permanently lost.
            </p>
            <ModalButtons>
              <CancelButton 
                type="button" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </CancelButton>
              <ConfirmDeleteButton 
                type="button" 
                onClick={handleDeleteAccount}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Delete Account'}
              </ConfirmDeleteButton>
            </ModalButtons>
          </ModalContent>
        </DeleteAccountModal>
      )}
    </ProfileContainer>
  );
};

export default Profile;