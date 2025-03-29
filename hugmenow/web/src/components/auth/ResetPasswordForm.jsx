import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const FormContainer = styled.form`
  width: 100%;
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color, #6366f1);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-dark-color, #4f46e5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FormError = styled.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const FormSuccess = styled.div`
  color: var(--success-color, #22c55e);
  background-color: var(--success-bg-color, #dcfce7);
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
`;

const FormLinks = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`;

const FormLink = styled(Link)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

/**
 * ResetPasswordForm Component
 * Handles password reset form after clicking on reset link
 */
const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get('token');
    
    if (resetToken) {
      setToken(resetToken);
    } else {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsLoading(true);

    try {
      // In a real implementation, this would call a password reset confirmation API
      console.log('Password reset attempted with token:', token);
      
      // Simulate a successful reset for now
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setError('Password reset failed. Please try again or request a new reset link.');
      console.error('Password reset error:', err);
    }
  };

  if (success) {
    return (
      <FormSuccess>
        <p>Your password has been successfully reset. You will be redirected to the login page shortly.</p>
        <FormLinks>
          <p>
            <FormLink to="/auth/login">Back to login</FormLink>
          </p>
        </FormLinks>
      </FormSuccess>
    );
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && <FormError>{error}</FormError>}
      
      <FormField>
        <FormLabel htmlFor="password">New Password</FormLabel>
        <FormInput
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={!token}
          placeholder="••••••••"
        />
      </FormField>
      
      <FormField>
        <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
        <FormInput
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={!token}
          placeholder="••••••••"
        />
      </FormField>
      
      <SubmitButton type="submit" disabled={isLoading || !token}>
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </SubmitButton>
      
      <FormLinks>
        <p>
          <FormLink to="/auth/login">Back to login</FormLink>
        </p>
      </FormLinks>
    </FormContainer>
  );
};

export default ResetPasswordForm;