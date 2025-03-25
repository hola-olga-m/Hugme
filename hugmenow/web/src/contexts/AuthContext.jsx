import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { useMutation } from '@apollo/client';
import { LOGIN, REGISTER, ANONYMOUS_LOGIN } from '../graphql/mutations';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // GraphQL mutations
  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [anonymousLoginMutation] = useMutation(ANONYMOUS_LOGIN);
  
  // Clear error helper
  const clearError = () => setError(null);
  
  // Check if user is already logged in (token in localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Verify token and get current user
          const userData = await authApi.getCurrentUser();
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Token validation error:', err);
          // Clear invalid token
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Login with email and password
  const login = async (credentials) => {
    setLoading(true);
    clearError();
    try {
      // Try REST API first
      const response = await authApi.login(credentials);
      
      // Store token and user data
      localStorage.setItem('authToken', response.accessToken);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (restError) {
      console.error('REST login error:', restError);
      
      // Fallback to GraphQL
      try {
        const { data } = await loginMutation({
          variables: {
            loginInput: credentials
          }
        });
        
        const response = data.login;
        localStorage.setItem('authToken', response.accessToken);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return response.user;
      } catch (graphqlError) {
        console.error('GraphQL login error:', graphqlError);
        setError(graphqlError.message || 'Login failed');
        throw graphqlError;
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    clearError();
    try {
      // Try REST API first
      const response = await authApi.register(userData);
      
      // Store token and user data
      localStorage.setItem('authToken', response.accessToken);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (restError) {
      console.error('REST register error:', restError);
      
      // Fallback to GraphQL
      try {
        const { data } = await registerMutation({
          variables: {
            registerInput: userData
          }
        });
        
        const response = data.register;
        localStorage.setItem('authToken', response.accessToken);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return response.user;
      } catch (graphqlError) {
        console.error('GraphQL register error:', graphqlError);
        setError(graphqlError.message || 'Registration failed');
        throw graphqlError;
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Login anonymously
  const anonymousLogin = async (anonymousData) => {
    setLoading(true);
    clearError();
    try {
      // Try REST API first
      const response = await authApi.anonymousLogin(anonymousData);
      
      // Store token and user data
      localStorage.setItem('authToken', response.accessToken);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (restError) {
      console.error('REST anonymous login error:', restError);
      
      // Fallback to GraphQL
      try {
        const { data } = await anonymousLoginMutation({
          variables: {
            anonymousLoginInput: anonymousData
          }
        });
        
        const response = data.anonymousLogin;
        localStorage.setItem('authToken', response.accessToken);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return response.user;
      } catch (graphqlError) {
        console.error('GraphQL anonymous login error:', graphqlError);
        setError(graphqlError.message || 'Anonymous login failed');
        throw graphqlError;
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = async () => {
    setLoading(true);
    try {
      // Call logout API (optional, may not be needed if using JWT)
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
      // Continue with local logout even if API call fails
    } finally {
      // Clear token and user data regardless of API success
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (userId, userData) => {
    setLoading(true);
    clearError();
    try {
      const updatedUser = await authApi.updateProfile(userId, userData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Context value
  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    anonymousLogin,
    logout,
    updateProfile,
    clearError
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;