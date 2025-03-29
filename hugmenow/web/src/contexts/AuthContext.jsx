import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchWithErrorHandling } from '../utils/apiErrorHandler';

// Auth debugging function
const logAuthStatus = (title, data) => {
  console.log(`[Auth Debug] ${title}:`, data);
  return data;
};

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check if token exists in localStorage
  const hasToken = () => {
    const token = localStorage.getItem('authToken');
    logAuthStatus('Token exists', !!token);
    return !!token;
  };

  // Get user from localStorage
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (err) {
      console.error('[Auth Debug] Error parsing user from storage:', err);
      return null;
    }
  };

  // Initialize authentication state from localStorage or API
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        logAuthStatus('Checking authentication status', {
          hasToken: hasToken(),
          hasUser: !!getUserFromStorage(),
          userDetails: getUserFromStorage()
        });

        // Try to get user from localStorage first
        const storedUser = getUserFromStorage();
        const storedToken = localStorage.getItem('authToken');

        if (storedUser && storedToken) {
          // Validate the token with the backend if in production
          // In development, we'll trust the localStorage
          if (import.meta.env.PROD) {
            try {
              const response = await fetchWithErrorHandling('/api/validate-token', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${storedToken}`
                }
              });

              if (response.valid) {
                logAuthStatus('Token is valid, setting currentUser', storedUser);
                setCurrentUser(storedUser);
              } else {
                logAuthStatus('Token is invalid, clearing auth data', null);
                clearAuthData();
              }
            } catch (validationErr) {
              // If validation fails, still use local data to avoid login issues
              logAuthStatus('Token validation failed, using stored user', storedUser);
              setCurrentUser(storedUser);
            }
          } else {
            // In development, trust the localStorage
            logAuthStatus('Development mode, using stored user without validation', storedUser);
            setCurrentUser(storedUser);
          }
        } else {
          logAuthStatus('No stored auth data found', null);
        }
      } catch (err) {
        console.error('[Auth Debug] Error checking auth status:', err);
        setAuthError('Unable to verify authentication status');
        clearAuthData();
      } finally {
        // Always set loading to false when done
        logAuthStatus('Auth check complete, setting loading to false', null);
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);

    try {
      logAuthStatus('Attempting login', { email });

      const response = await fetchWithErrorHandling('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginInput: {
            email,
            password
          }
        }),
      });

      const { token, user } = response;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      logAuthStatus('Login successful', user);
      setCurrentUser(user);

      return user;
    } catch (err) {
      logAuthStatus('Login failed', err.message);
      setAuthError(err.message || 'Failed to login');
      throw err;
    }
  };

  const register = async (userData) => {
    setAuthError(null);

    try {
      logAuthStatus('Attempting registration', userData);

      const response = await fetchWithErrorHandling('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registerInput: userData
        }),
      });

      const { token, user } = response;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      logAuthStatus('Registration successful', user);
      setCurrentUser(user);

      return user;
    } catch (err) {
      logAuthStatus('Registration failed', err.message);
      setAuthError(err.message || 'Failed to register');
      throw err;
    }
  };

  const logout = () => {
    logAuthStatus('Logging out user', currentUser?.id);
    clearAuthData();
    setAuthError(null);
  };

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
    logAuthStatus('Auth data cleared', null);
  };

  const updateProfile = async (userData) => {
    setAuthError(null);

    try {
      const token = localStorage.getItem('authToken');
      logAuthStatus('Updating profile', userData);

      const response = await fetchWithErrorHandling('/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          updateProfileInput: userData
        }),
      });

      const updatedUser = response.user;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      logAuthStatus('Profile updated successfully', updatedUser);
      return updatedUser;
    } catch (err) {
      logAuthStatus('Profile update failed', err.message);
      setAuthError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    setAuthError(null);

    try {
      logAuthStatus('Requesting password reset', { email });

      await fetchWithErrorHandling('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      logAuthStatus('Password reset email sent', { email });
      return true;
    } catch (err) {
      logAuthStatus('Password reset request failed', err.message);
      setAuthError(err.message || 'Failed to send password reset email');
      throw err;
    }
  };

  const resetPassword = async (token, newPassword) => {
    setAuthError(null);

    try {
      logAuthStatus('Resetting password', { token: token?.substring(0, 10) + '...' });

      await fetchWithErrorHandling('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword
        }),
      });

      logAuthStatus('Password reset successful', null);
      return true;
    } catch (err) {
      logAuthStatus('Password reset failed', err.message);
      setAuthError(err.message || 'Failed to reset password');
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    authError,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!currentUser,
    hasToken: hasToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};