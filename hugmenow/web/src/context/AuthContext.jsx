import React, { createContext, useState, useEffect, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN, REGISTER, ANONYMOUS_LOGIN } from '../graphql/mutations';
import { authApi } from '../services/api';

// Create an authentication context
export const AuthContext = createContext();

// Auth storage keys and constants
const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'user';
const AUTH_EXPIRY_KEY = 'authExpiry';
const REDIRECT_FLAG_KEY = 'redirectToDashboard';
// Token expiration time in milliseconds (defaults to 7 days if not set by the server)
const DEFAULT_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

// Helper functions for auth data management
const storeAuthData = (token, user, expiresIn = DEFAULT_TOKEN_EXPIRATION) => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    // Calculate expiry time based on current time + expiration period
    const expiry = Date.now() + expiresIn;
    localStorage.setItem(AUTH_EXPIRY_KEY, expiry.toString());
    
    return true;
  } catch (error) {
    console.error('Failed to store auth data in localStorage:', error);
    return false;
  }
};

const clearAuthData = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
    localStorage.removeItem(REDIRECT_FLAG_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear auth data from localStorage:', error);
    return false;
  }
};

const getStoredAuthData = () => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userStr = localStorage.getItem(USER_DATA_KEY);
    const expiryStr = localStorage.getItem(AUTH_EXPIRY_KEY);
    
    if (!token || !userStr) {
      return null;
    }
    
    // Parse stored data
    const user = JSON.parse(userStr);
    const expiry = expiryStr ? parseInt(expiryStr, 10) : null;
    
    // Check if token has expired locally
    if (expiry && Date.now() > expiry) {
      console.warn('Auth token expired based on client-side expiry time');
      clearAuthData();
      return null;
    }
    
    return { token, user };
  } catch (error) {
    console.error('Failed to retrieve auth data from localStorage:', error);
    clearAuthData(); // Clear potentially corrupted data
    return null;
  }
};

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
      setLoading(true);
      console.log('Initializing authentication state...');
      
      try {
        // Use our helper to get stored auth data
        const authData = getStoredAuthData();
        
        if (authData) {
          console.log('Found stored auth data, initializing state');
          // Set initial state from stored data
          setAuthToken(authData.token);
          setCurrentUser(authData.user);
          
          // Validate token by making a request to get current user
          try {
            console.log('Validating stored token with server...');
            const currentUserData = await authApi.getCurrentUser();
            
            // Update user data with fresh data from server
            setCurrentUser(currentUserData);
            console.log('Successfully validated token and fetched current user data');
            
            // Update the stored user data with the latest from server
            storeAuthData(authData.token, currentUserData);
          } catch (validationError) {
            console.error('Token validation failed:', validationError);
            
            // Check if this is a network error (server might be down or restarting)
            if (validationError.message && validationError.message.includes('NetworkError')) {
              console.log('Network error occurred during validation, keeping current user data');
              // Keep the current user data since this might just be a temporary network issue
            } else if (validationError.message && validationError.message.includes('AuthenticationExpired')) {
              console.log('Authentication expired, clearing auth data');
              clearAuthData();
              setAuthToken(null);
              setCurrentUser(null);
            } else {
              // Some other error occurred with the token validation
              console.log('Invalid token, clearing auth data');
              clearAuthData();
              setAuthToken(null);
              setCurrentUser(null);
            }
          }
        } else {
          console.log('No stored auth data found or token expired');
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        // Clear potentially corrupted auth data
        clearAuthData();
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
        console.log('Attempting GraphQL login mutation');
        const { data } = await loginMutation({
          variables: {
            loginInput: { email, password }
          }
        });
        
        const authData = data.login;
        const token = authData.accessToken;
        const user = authData.user;
        
        // Use our helper to store auth data with expiration
        storeAuthData(token, user);
        
        // Update state
        setAuthToken(token);
        setCurrentUser(user);
        
        // Set redirect flag
        localStorage.setItem(REDIRECT_FLAG_KEY, 'true');
        
        console.log('Successfully logged in via GraphQL');
        return authData;
      } catch (graphqlError) {
        console.error('GraphQL login failed, trying REST API:', graphqlError);
        
        // Fallback to REST API
        console.log('Attempting REST API login');
        const authData = await authApi.login({ email, password });
        
        const token = authData.accessToken || authData.token;
        const user = authData.user;
        
        // Use our helper to store auth data with expiration
        storeAuthData(token, user);
        
        // Update state
        setAuthToken(token);
        setCurrentUser(user);
        
        // Set redirect flag
        localStorage.setItem(REDIRECT_FLAG_KEY, 'true');
        
        console.log('Successfully logged in via REST API');
        return authData;
      }
    } catch (err) {
      console.error('Login failed completely:', err);
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
    
    // Add debugging
    console.log('Attempting to register user with data:', JSON.stringify({
      ...userData,
      password: '[REDACTED]' // Don't log actual password
    }));
    
    try {
      // Try GraphQL mutation first
      try {
        console.log('Attempting GraphQL registration mutation');
        const { data } = await registerMutation({
          variables: {
            registerInput: userData
          }
        });
        
        console.log('GraphQL registration successful. Response:', JSON.stringify(data));
        const authData = data.register;
        const token = authData.accessToken;
        const user = authData.user;
        
        // Use our helper to store auth data with expiration
        storeAuthData(token, user);
        
        // Set flag for dashboard to know we're coming from registration
        localStorage.setItem(REDIRECT_FLAG_KEY, 'true');
        
        // Update state
        setAuthToken(token);
        setCurrentUser(user);
        
        return authData;
      } catch (graphqlError) {
        console.error('GraphQL register failed, trying REST API:', graphqlError);
        
        // Log more details about the GraphQL error
        if (graphqlError.networkError) {
          console.error('Network error details:', graphqlError.networkError);
          if (graphqlError.networkError.result) {
            console.error('Server response:', graphqlError.networkError.result);
          }
        }
        
        if (graphqlError.graphQLErrors) {
          console.error('GraphQL error details:', graphqlError.graphQLErrors);
        }
        
        // Fallback to REST API
        console.log('Attempting REST API registration');
        const authData = await authApi.register(userData);
        
        console.log('REST API registration successful. Response:', JSON.stringify({
          ...authData,
          user: authData.user ? {
            ...authData.user,
            id: authData.user.id || '[ID]' // Include ID for debugging
          } : null
        }));
        
        const token = authData.accessToken || authData.token;
        const user = authData.user;
        
        // Use our helper to store auth data with expiration
        storeAuthData(token, user);
        
        // Set flag for dashboard to know we're coming from registration
        localStorage.setItem(REDIRECT_FLAG_KEY, 'true');
        
        // Update state
        setAuthToken(token);
        setCurrentUser(user);
        
        return authData;
      }
    } catch (err) {
      console.error('Registration failed completely:', err);
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
    
    // Add debugging
    console.log('Attempting anonymous login with nickname:', nickname);
    
    try {
      // Try GraphQL mutation first
      try {
        console.log('Attempting GraphQL anonymous login mutation');
        const { data } = await anonymousLoginMutation({
          variables: {
            anonymousLoginInput: { nickname, avatarUrl }
          }
        });
        
        console.log('GraphQL anonymous login successful. Response:', JSON.stringify(data));
        const authData = data.anonymousLogin;
        const token = authData.accessToken;
        const user = authData.user;
        
        // Use our helper to store auth data with expiration
        storeAuthData(token, user);
        
        // Set flag for dashboard to know we're coming from login
        localStorage.setItem(REDIRECT_FLAG_KEY, 'true');
        
        // Update state
        setAuthToken(token);
        setCurrentUser(user);
        
        console.log('Updated auth state after successful anonymous login, set redirect flag');
        
        return authData;
      } catch (graphqlError) {
        console.error('GraphQL anonymous login failed, trying REST API:', graphqlError);
        
        // Log more details about the GraphQL error
        if (graphqlError.networkError) {
          console.error('Network error details:', graphqlError.networkError);
          if (graphqlError.networkError.result) {
            console.error('Server response:', graphqlError.networkError.result);
          }
        }
        
        if (graphqlError.graphQLErrors) {
          console.error('GraphQL error details:', graphqlError.graphQLErrors);
        }
        
        // Fallback to REST API
        console.log('Attempting REST API anonymous login');
        const authData = await authApi.anonymousLogin({ nickname, avatarUrl });
        
        console.log('REST API anonymous login successful. Response:', JSON.stringify({
          ...authData,
          user: authData.user ? {
            ...authData.user,
            id: authData.user.id || '[ID]' // Include ID for debugging
          } : null
        }));
        
        const token = authData.accessToken || authData.token;
        const user = authData.user;
        
        // Use our helper to store auth data with expiration
        storeAuthData(token, user);
        
        // Set flag for dashboard to know we're coming from login
        localStorage.setItem(REDIRECT_FLAG_KEY, 'true');
        
        // Update state
        setAuthToken(token);
        setCurrentUser(user);
        
        console.log('Updated auth state after successful anonymous login via REST API, set redirect flag');
        
        return authData;
      }
    } catch (err) {
      console.error('Anonymous login failed completely:', err);
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
      // Clear auth data and state regardless of API call success
      clearAuthData();
      setAuthToken(null);
      setCurrentUser(null);
      setLoading(false);
      console.log('Successfully logged out');
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
      
      // Update stored user data but keep the same token and expiry
      const storedData = getStoredAuthData();
      if (storedData && storedData.token) {
        storeAuthData(storedData.token, updatedUser);
      } else {
        // Fallback if there is no stored data
        storeAuthData(authToken, updatedUser);
      }
      
      // Update state
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated - use a memoized value that doesn't change on re-renders
  // Add detailed logging to help debug authentication issues
  console.log('AuthContext - Checking authentication status:', { 
    hasToken: !!authToken, 
    hasUser: !!currentUser,
    userId: currentUser?.id,
    username: currentUser?.username,
    isAnonymous: currentUser?.isAnonymous 
  });
  
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