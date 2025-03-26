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
    
    console.log('Attempting to register user:', {
      username: userData.username,
      email: userData.email,
      name: userData.name,
      // Password omitted for security
    });
    
    // Define a function to handle both REST and GraphQL responses
    const handleAuthResponse = (response) => {
      console.log('Registration successful, user:', response.user?.username);
      localStorage.setItem('authToken', response.accessToken);
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    };
    
    try {
      // Try GraphQL first this time
      try {
        console.log('Attempting GraphQL registration with input:', JSON.stringify({
          username: userData.username,
          email: userData.email,
          name: userData.name,
          avatarUrl: userData.avatarUrl || null // include avatarUrl if it exists
        }));
        
        // Ensure the input data format matches exactly what the GraphQL API expects
        const graphQLInput = {
          username: userData.username,
          email: userData.email,
          name: userData.name,
          password: userData.password
        };
        
        // Only add avatarUrl if it exists
        if (userData.avatarUrl) {
          graphQLInput.avatarUrl = userData.avatarUrl;
        }
        
        const { data } = await registerMutation({
          variables: {
            registerInput: graphQLInput
          }
        });
        
        console.log('GraphQL register response:', data);
        
        if (data && data.register) {
          return handleAuthResponse(data.register);
        } else {
          console.error('Invalid GraphQL response structure:', data);
          throw new Error('Invalid GraphQL response');
        }
      } catch (graphqlError) {
        console.error('GraphQL register error details:', graphqlError);
        if (graphqlError.networkError) {
          console.error('Network error details:', graphqlError.networkError);
        }
        if (graphqlError.graphQLErrors) {
          console.error('GraphQL error details:', graphqlError.graphQLErrors);
        }
        
        // Fallback to REST API
        console.log('Falling back to REST API registration...');
        try {
          const response = await authApi.register(userData);
          console.log('REST API register response:', response);
          return handleAuthResponse(response);
        } catch (restError) {
          console.error('REST API register error:', restError);
          throw restError;
        }
      }
    } catch (error) {
      console.error('Registration failed completely:', error);
      
      // Provide more specific error message based on the error
      let errorMessage = 'Registration failed';
      
      if (error.message) {
        if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Could not connect to the server';
        } else if (error.message.includes('username')) {
          errorMessage = 'Username error: ' + error.message;
        } else if (error.message.includes('email')) {
          errorMessage = 'Email error: ' + error.message;
        } else if (error.message.includes('password')) {
          errorMessage = 'Password error: ' + error.message;
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      throw error;
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