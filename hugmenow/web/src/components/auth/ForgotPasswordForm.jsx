import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
 * ForgotPasswordForm Component
 * Handles password reset requests
 */
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // In a real implementation, this would call a password reset API
      console.log('Password reset requested for:', email);
      
      // Simulate a successful request for now
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setError('Could not process your request. Please try again.');
      console.error('Password reset error:', err);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && <FormError>{error}</FormError>}
      
      {success ? (
        <FormSuccess>
          <p>We've sent a password reset link to your email address. Please check your inbox.</p>
        </FormSuccess>
      ) : (
        <>
          <FormField>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </FormField>
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </SubmitButton>
        </>
      )}
      
      <FormLinks>
        <p>
          <FormLink to="/auth/login">Back to login</FormLink>
        </p>
      </FormLinks>
    </FormContainer>
  );
};

export default ForgotPasswordForm;