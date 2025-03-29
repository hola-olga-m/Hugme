import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Import components
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`;

const AuthHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const AuthTitle = styled.h1`
  font-size: 1.75rem;
  color: var(--text-color, #1f2937);
  margin-bottom: 0.5rem;
`;

const AuthDescription = styled.p`
  color: var(--text-secondary-color, #6b7280);
`;

/**
 * AuthPage Component
 * Handles all authentication-related views (login, register, forgot password, reset password)
 */
const AuthPage = () => {
  const location = useLocation();
  
  // Determine which form to show based on the route
  const getTitle = () => {
    if (location.pathname.includes('/register')) {
      return 'Create an Account';
    } else if (location.pathname.includes('/forgot-password')) {
      return 'Forgot Password';
    } else if (location.pathname.includes('/reset-password')) {
      return 'Reset Password';
    } else {
      return 'Welcome Back';
    }
  };

  // Get description based on the route
  const getDescription = () => {
    if (location.pathname.includes('/register')) {
      return 'Join HugMeNow to start tracking your moods and connecting with others.';
    } else if (location.pathname.includes('/forgot-password')) {
      return 'Enter your email to receive a password reset link.';
    } else if (location.pathname.includes('/reset-password')) {
      return 'Create a new password for your account.';
    } else {
      return 'Sign in to access your HugMeNow account.';
    }
  };

  // Import components already done at the top of the file

  return (
    <AuthContainer>
      <AuthHeader>
        <AuthTitle>{getTitle()}</AuthTitle>
        <AuthDescription>{getDescription()}</AuthDescription>
      </AuthHeader>

      <Routes>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="forgot-password" element={<ForgotPasswordForm />} />
        <Route path="reset-password" element={<ResetPasswordForm />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </AuthContainer>
  );
};

export default AuthPage;