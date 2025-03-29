
import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import ForgotPassword from '../components/Auth/ForgotPassword';
import ResetPassword from '../components/Auth/ResetPassword';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Redirect to dashboard if already authenticated, except for reset-password
  const pathname = location.pathname;
  if (isAuthenticated && 
      !pathname.includes('/auth/reset-password') && 
      !pathname.includes('/auth/social-callback')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="auth-container">
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="social-callback" element={<Login />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </div>
  );
};

export default AuthPage;
