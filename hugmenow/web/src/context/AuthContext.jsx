import React, { createContext, useState, useContext, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN, REGISTER, ANONYMOUS_LOGIN } from '../graphql/mutations';
import { authApi } from '../services/api';

// Create context
const AuthContext = createContext(null);

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize login mutation
  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [anonymousLoginMutation] = useMutation(ANONYMOUS_LOGIN);

  // Check if user is authenticated on first render
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (err) {
          console.error('Error fetching user data:', err);
          // Clear invalid token
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Login with email and password
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Try GraphQL mutation first
      try {
        const { data } = await loginMutation({ 
          variables: { input: { email, password } }
        });
        const { token, user } = data.login;
        handleAuthSuccess(token, user);
        return user;
      } catch (graphqlError) {
        // Fallback to REST API
        console.log('Falling back to REST API for login');
        const authData = await authApi.login({ email, password });
        handleAuthSuccess(authData.token, authData.user);
        return authData.user;
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Try GraphQL mutation first
      try {
        const { data } = await registerMutation({ 
          variables: { input: userData }
        });
        const { token, user } = data.register;
        handleAuthSuccess(token, user);
        return user;
      } catch (graphqlError) {
        // Fallback to REST API
        console.log('Falling back to REST API for registration');
        const authData = await authApi.register(userData);
        handleAuthSuccess(authData.token, authData.user);
        return authData.user;
      }
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Anonymous login
  const anonymousLogin = async (nickname, avatarUrl) => {
    setLoading(true);
    setError(null);
    try {
      // Try GraphQL mutation first
      try {
        const { data } = await anonymousLoginMutation({ 
          variables: { input: { nickname, avatarUrl } }
        });
        const { token, user } = data.anonymousLogin;
        handleAuthSuccess(token, user);
        return user;
      } catch (graphqlError) {
        // Fallback to REST API
        console.log('Falling back to REST API for anonymous login');
        const authData = await authApi.anonymousLogin({ nickname, avatarUrl });
        handleAuthSuccess(authData.token, authData.user);
        return authData.user;
      }
    } catch (err) {
      setError(err.message || 'Failed to login anonymously. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      if (!user || !user.id) {
        throw new Error('Not authenticated');
      }
      const updatedUser = await authApi.updateUser(user.id, userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      if (token) {
        // Optionally call logout API
        await authApi.logout();
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      // Always clear local state, even if API call fails
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    }
  };

  // Clear any authentication errors
  const clearError = () => {
    setError(null);
  };

  // Helper to handle successful authentication
  const handleAuthSuccess = (authToken, userData) => {
    localStorage.setItem('authToken', authToken);
    setToken(authToken);
    setUser(userData);
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    anonymousLogin,
    updateProfile,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;