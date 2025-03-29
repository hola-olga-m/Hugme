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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Show feedback that we're processing
      setError('Creating your account...');

      const userData = {
        name,
        email,
        password,
      };

      console.log('Submitting registration with:', { 
        name, email, 
        hasPassword: !!password, 
        hasName: !!name 
      });

      // Add a timeout to show a message if it's taking too long
      const timeoutId = setTimeout(() => {
        setError('Still working on creating your account. This might take a moment...');
      }, 5000);

      await register(userData);

      // Clear the timeout
      clearTimeout(timeoutId);

      // Registration successful, redirect handled by the context
    } catch (err) {
      console.error('Registration form error:', err);

      if (err.message.includes('timeout') || err.message.includes('too long')) {
        setError('The server is taking too long to respond. Please try again later or check your internet connection.');
      } else if (err.message.includes('NetworkError') || err.message.includes('connect')) {
        setError('Cannot connect to the server. Please check your internet connection and try again.');
      } else {
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
      
      {error && (
        <div className="auth-error">
          <p>Registration failed: {error}</p>
          <p>Please try again or contact support if the issue persists.</p>
        </div>
      )} Account'}
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