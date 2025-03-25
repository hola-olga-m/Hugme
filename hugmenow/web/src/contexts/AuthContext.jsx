import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN, REGISTER, ANONYMOUS_LOGIN } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';
import { authApi } from '../services/api';

// Create context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GraphQL mutations
  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [anonymousLoginMutation] = useMutation(ANONYMOUS_LOGIN);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Try to get current user info
          const userData = await authApi.getCurrentUser();
          setCurrentUser(userData);
        } catch (error) {
          console.error('Auth check failed:', error);
          // If token is invalid, clear it
          localStorage.removeItem('authToken');
          setToken(null);
          setCurrentUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  // Handle login
  const login = async (email, password) => {
    setError(null);
    try {
      // First try GraphQL
      try {
        const { data } = await loginMutation({
          variables: { loginInput: { email, password } }
        });
        
        const { accessToken, user } = data.login;
        localStorage.setItem('authToken', accessToken);
        setToken(accessToken);
        setCurrentUser(user);
        return user;
      } catch (graphqlError) {
        // If GraphQL fails, fallback to REST API
        console.warn('GraphQL login failed, trying REST API', graphqlError);
        const { accessToken, user } = await authApi.login({ email, password });
        localStorage.setItem('authToken', accessToken);
        setToken(accessToken);
        setCurrentUser(user);
        return user;
      }
    } catch (error) {
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  // Handle registration
  const register = async (username, email, name, password) => {
    setError(null);
    try {
      // First try GraphQL
      try {
        const { data } = await registerMutation({
          variables: { 
            registerInput: { 
              username, 
              email, 
              name, 
              password 
            } 
          }
        });
        
        const { accessToken, user } = data.register;
        localStorage.setItem('authToken', accessToken);
        setToken(accessToken);
        setCurrentUser(user);
        return user;
      } catch (graphqlError) {
        // If GraphQL fails, fallback to REST API
        console.warn('GraphQL register failed, trying REST API', graphqlError);
        const { accessToken, user } = await authApi.register({ 
          username, 
          email, 
          name, 
          password 
        });
        localStorage.setItem('authToken', accessToken);
        setToken(accessToken);
        setCurrentUser(user);
        return user;
      }
    } catch (error) {
      setError(error.message || 'Registration failed');
      throw error;
    }
  };

  // Handle anonymous login
  const anonymousLogin = async (nickname) => {
    setError(null);
    try {
      // First try GraphQL
      try {
        const { data } = await anonymousLoginMutation({
          variables: { 
            anonymousLoginInput: { 
              nickname 
            } 
          }
        });
        
        const { accessToken, user } = data.anonymousLogin;
        localStorage.setItem('authToken', accessToken);
        setToken(accessToken);
        setCurrentUser(user);
        return user;
      } catch (graphqlError) {
        // If GraphQL fails, fallback to REST API
        console.warn('GraphQL anonymous login failed, trying REST API', graphqlError);
        const { accessToken, user } = await authApi.anonymousLogin({ nickname });
        localStorage.setItem('authToken', accessToken);
        setToken(accessToken);
        setCurrentUser(user);
        return user;
      }
    } catch (error) {
      setError(error.message || 'Anonymous login failed');
      throw error;
    }
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setCurrentUser(null);
  };

  const contextValue = {
    currentUser,
    isAuthenticated: !!currentUser,
    token,
    loading,
    error,
    login,
    register,
    anonymousLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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