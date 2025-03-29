import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchWithErrorHandling } from '../utils/apiErrorHandler';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchWithErrorHandling('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const userData = await response.json();

      if (userData.token) {
        localStorage.setItem('authToken', userData.token);
        setCurrentUser(userData.user);
        setIsAuthenticated(true);
        return userData;
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
      console.error('[Auth] Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Verify token with backend
      const response = await fetchWithErrorHandling('/api/verify-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.valid) {
        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('[Auth] Token verification error:', err);
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('[Auth Debug] Token exists:', !!localStorage.getItem('authToken'));
      await checkAuthStatus();
    };

    initializeAuth();
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;