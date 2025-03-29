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
 * LoginForm Component
 * Handles user login functionality
 */
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Login attempt with:', { email });
      
      // Use the login function from AuthContext
      const result = await login({ email, password });
      
      if (result && result.success) {
        console.log('Login successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      {error && <FormError>{error}</FormError>}
      
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
      
      <SubmitButton type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </SubmitButton>
      
      <FormLinks>
        <p>
          <FormLink to="/auth/forgot-password">Forgot password?</FormLink>
        </p>
        <p>
          Don't have an account?{' '}
          <FormLink to="/auth/register">Sign up</FormLink>
        </p>
      </FormLinks>
    </FormContainer>
  );
};

export default LoginForm;