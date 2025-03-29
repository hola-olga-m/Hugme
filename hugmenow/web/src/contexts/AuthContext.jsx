
import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchWithErrorHandling } from '../utils/apiErrorHandler';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state from localStorage or API
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        console.log('[Auth Debug] Token exists:', !!token);
        
        if (token && storedUser) {
          // If we have both token and user data in storage, use them
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
          
          // Optionally verify token validity with the server
          try {
            const response = await fetchWithErrorHandling('/api/auth/verify', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.valid) {
              console.log('AuthContext: Token validated successfully');
              // Refresh user data if needed
              setCurrentUser(response.user || userData);
            } else {
              console.log('AuthContext: Token invalid, clearing auth data');
              clearAuthData();
            }
          } catch (verifyError) {
            console.warn('Auth verification error:', verifyError);
            // Continue with stored data, as the server might be unavailable
          }
          
          setLoading(false);
        } else {
          console.log('AuthContext: No token found, setting loading to false');
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        console.log('AuthContext: Clearing auth data due to error');
        clearAuthData();
        setLoading(false);
        
        if (err.message.includes('timeout')) {
          setError('Connection timed out. Please check your network.');
        } else {
          setError('Session expired. Please log in again.');
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetchWithErrorHandling('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const { token, user } = response;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      setError(null);
      
      return user;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetchWithErrorHandling('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const { token, user } = response;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      setError(null);
      
      return user;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    }
  };

  const logout = () => {
    clearAuthData();
    setError(null);
  };

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetchWithErrorHandling('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const updatedUser = response.user;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await fetchWithErrorHandling('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to send password reset email');
      throw err;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await fetchWithErrorHandling('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
