import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

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

const FormError = styled.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
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
 * RegisterForm Component
 * Handles user registration functionality
 */
const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Registration attempt with:', { name, email });

      // Use the register function from AuthContext
      const result = await register({ name, email, password });

      if (result && result.success) {
        console.log('Registration successful, navigating to onboarding');
        navigate('/onboarding');
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      console.error('Registration error details:', err);

      // Handle different error types
      if (err.code === 'ECONNABORTED') {
        setError('Connection timed out. Server might be busy, please try again.');
      } else if (err.response) {
        // Server responded with an error
        const errorMessage = err.response.data?.error || `Error ${err.response.status}: ${err.response.statusText}`;
        setError(errorMessage);
      } else if (err.request) {
        // Request made but no response received (timeout)
        setError('Server is not responding. Please try again later.');
      } else {
        // Something else went wrong
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && <FormError>{error}</FormError>}

      <FormField>
        <FormLabel htmlFor="name">Full Name</FormLabel>
        <FormInput
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="John Doe"
        />
      </FormField>

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

      <FormField>
        <FormLabel htmlFor="password">Password</FormLabel>
        <FormInput
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </FormField>

      <FormField>
        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
        <FormInput
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </FormField>

      <SubmitButton type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create Account'}
      </SubmitButton>

      <FormLinks>
        <p>
          Already have an account?{' '}
          <FormLink to="/auth/login">Sign in</FormLink>
        </p>
      </FormLinks>
    </FormContainer>
  );
};

export default RegisterForm;