import React, { createContext, useContext, useState, useEffect } from 'react';
import { meshSdk } from '../apollo/client';

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
  
  // Create a client instance for Mesh SDK
  const client = meshSdk();
  
  // Clear error helper
  const clearError = () => setError(null);
  
  // Check if user is already logged in (token in localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Use Mesh SDK GetMe
          console.log('Attempting Mesh SDK GetMe operation...');
          const result = await client.GetMe();
          
          if (result && result.me) {
            console.log('Mesh SDK GetMe successful, user:', result.me.username);
            setCurrentUser(result.me);
            setIsAuthenticated(true);
          } else {
            console.error('Invalid Mesh SDK GetMe response structure:', result);
            throw new Error('Invalid GetMe response');
          }
        } catch (err) {
          console.error('Token validation error:', err);
          // Clear invalid token
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [client]);
  
  // Login with email and password
  const login = async (credentials) => {
    setLoading(true);
    clearError();
    try {
      console.log('Attempting Mesh SDK login with input:', JSON.stringify({
        email: credentials.email,
        // Password omitted for security
      }));
      
      const loginInput = {
        email: credentials.email,
        password: credentials.password
      };
      
      const result = await client.Login(loginInput);
      
      if (result && result.login) {
        const response = result.login;
        console.log('Mesh SDK login successful, user:', response.user?.username);
        localStorage.setItem('authToken', response.accessToken);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return response.user;
      } else {
        console.error('Invalid Mesh SDK login response structure:', result);
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Mesh SDK login error:', error);
      setError(error.message || 'Login failed');
      throw error;
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
    
    try {
      console.log('Attempting Mesh SDK registration with input:', JSON.stringify({
        username: userData.username,
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatarUrl || null // include avatarUrl if it exists
      }));
      
      // Ensure the input data format matches exactly what the GraphQL API expects
      const registerInput = {
        username: userData.username,
        email: userData.email,
        name: userData.name,
        password: userData.password
      };
      
      // Only add avatarUrl if it exists
      if (userData.avatarUrl) {
        registerInput.avatarUrl = userData.avatarUrl;
      }
      
      const result = await client.Register(registerInput);
      
      console.log('Mesh SDK register response:', result);
      
      if (result && result.register) {
        const response = result.register;
        console.log('Registration successful, user:', response.user?.username);
        localStorage.setItem('authToken', response.accessToken);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return response.user;
      } else {
        console.error('Invalid Mesh SDK response structure:', result);
        throw new Error('Invalid registration response');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      
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
      console.log('Attempting Mesh SDK anonymous login with input:', JSON.stringify({
        deviceId: anonymousData.deviceId,
        deviceName: anonymousData.deviceName
      }));
      
      const anonymousLoginInput = {
        deviceId: anonymousData.deviceId,
        deviceName: anonymousData.deviceName
      };
      
      const result = await client.AnonymousLogin(anonymousLoginInput);
      
      if (result && result.anonymousLogin) {
        const response = result.anonymousLogin;
        console.log('Mesh SDK anonymous login successful, user:', response.user?.username);
        localStorage.setItem('authToken', response.accessToken);
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        return response.user;
      } else {
        console.error('Invalid Mesh SDK anonymous login response structure:', result);
        throw new Error('Invalid anonymous login response');
      }
    } catch (error) {
      console.error('Mesh SDK anonymous login error:', error);
      setError(error.message || 'Anonymous login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = async () => {
    setLoading(true);
    try {
      // Since we're using JWT tokens, we don't need an explicit logout API call
      // We just need to remove the token and clear the user state
      console.log('Logging out user');
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    clearError();
    try {
      console.log('Attempting to update user profile:', {
        name: userData.name,
        username: userData.username,
        avatarUrl: userData.avatarUrl
      });
      
      // Prepare input for SDK call
      const updateUserInput = { ...userData };
      
      const result = await client.UpdateUser(updateUserInput);
      
      if (result && result.updateUser) {
        const updatedUser = result.updateUser;
        console.log('Profile update successful:', updatedUser.username);
        setCurrentUser(updatedUser);
        return updatedUser;
      } else {
        console.error('Invalid UpdateUser response structure:', result);
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message || 'Failed to update profile');
      throw error;
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

// No default export - use named export { AuthProvider } instead