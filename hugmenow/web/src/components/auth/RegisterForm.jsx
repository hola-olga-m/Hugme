import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import FormWrapper from './FormWrapper';
import ErrorDisplay from './ErrorDisplay';
import { fetchWithErrorHandling } from '../../utils/apiErrorHandler';

// Styled components

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      console.log('[Register] Attempting registration with:', formData);

      try {
        const response = await fetchWithErrorHandling('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registerInput: formData
          }),
        });

        console.log('[Register] Response:', response);

        navigate('/login');
      } catch (apiError) {
        console.error('[Register] API Error:', apiError);

        // Check for HTML response errors
        if (apiError.message && apiError.message.includes('HTML instead of JSON')) {
          setError('The server encountered an error. Please try again or contact support.');
        } else {
          setError(apiError.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('[Register] General Error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;