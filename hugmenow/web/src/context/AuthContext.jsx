import React, { createContext, useState, useEffect, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN, REGISTER, ANONYMOUS_LOGIN } from '../graphql/mutations';
import { authApi } from '../services/api';

// Create an authentication context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GraphQL mutations
  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [anonymousLoginMutation] = useMutation(ANONYMOUS_LOGIN);

  // Initialize auth state from local storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setAuthToken(storedToken);
          setCurrentUser(JSON.parse(storedUser));
          
          // Validate token by making a request to get current user
          try {
            const currentUserData = await authApi.getCurrentUser();
            setCurrentUser(currentUserData);
          } catch (validationError) {
            console.error('Token validation failed:', validationError);
            // Token is invalid, clear auth data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setAuthToken(null);
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        // Clear potentially corrupted auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Login function (using GraphQL mutation)
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try GraphQL mutation first
      try {
        const { data } = await loginMutation({
          variables: {
            loginInput: { email, password }
          }
        });
        
        const authData = data.login;
        
        // Store auth data
        localStorage.setItem('authToken', authData.accessToken);
        localStorage.setItem('user', JSON.stringify(authData.user));
        
        // Update state
        setAuthToken(authData.accessToken);
        setCurrentUser(authData.user);
        
        return authData;
      } catch (graphqlError) {
        console.error('GraphQL login failed, trying REST API:', graphqlError);
        
        // Fallback to REST API
        const authData = await authApi.login({ email, password });
        
        // Store auth data
        localStorage.setItem('authToken', authData.accessToken || authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
        
        // Update state
        setAuthToken(authData.accessToken || authData.token);
        setCurrentUser(authData.user);
        
        return authData;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function (using GraphQL mutation)
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try GraphQL mutation first
      try {
        const { data } = await registerMutation({
          variables: {
            registerInput: userData
          }
        });
        
        const authData = data.register;
        
        // Store auth data
        localStorage.setItem('authToken', authData.accessToken);
        localStorage.setItem('user', JSON.stringify(authData.user));
        
        // Update state
        setAuthToken(authData.accessToken);
        setCurrentUser(authData.user);
        
        return authData;
      } catch (graphqlError) {
        console.error('GraphQL register failed, trying REST API:', graphqlError);
        
        // Fallback to REST API
        const authData = await authApi.register(userData);
        
        // Store auth data
        localStorage.setItem('authToken', authData.accessToken || authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
        
        // Update state
        setAuthToken(authData.accessToken || authData.token);
        setCurrentUser(authData.user);
        
        return authData;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Anonymous login function (using GraphQL mutation)
  const anonymousLogin = async (nickname, avatarUrl) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try GraphQL mutation first
      try {
        const { data } = await anonymousLoginMutation({
          variables: {
            anonymousLoginInput: { nickname, avatarUrl }
          }
        });
        
        const authData = data.anonymousLogin;
        
        // Store auth data
        localStorage.setItem('authToken', authData.accessToken);
        localStorage.setItem('user', JSON.stringify(authData.user));
        
        // Update state
        setAuthToken(authData.accessToken);
        setCurrentUser(authData.user);
        
        return authData;
      } catch (graphqlError) {
        console.error('GraphQL anonymous login failed, trying REST API:', graphqlError);
        
        // Fallback to REST API
        const authData = await authApi.anonymousLogin({ nickname, avatarUrl });
        
        // Store auth data
        localStorage.setItem('authToken', authData.accessToken || authData.token);
        localStorage.setItem('user', JSON.stringify(authData.user));
        
        // Update state
        setAuthToken(authData.accessToken || authData.token);
        setCurrentUser(authData.user);
        
        return authData;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      // Call logout API
      if (authToken) {
        await authApi.logout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage and state regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setAuthToken(null);
      setCurrentUser(null);
      setLoading(false);
    }
  };

  // Update user profile function
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!authToken || !currentUser) {
        throw new Error('Not authenticated');
      }
      
      // Use the updateProfile method from authApi
      const updatedUser = await authApi.updateProfile(currentUser.id, userData);
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!authToken && !!currentUser;

  // Auth context value
  const value = {
    currentUser,
    authToken,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    anonymousLogin,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;