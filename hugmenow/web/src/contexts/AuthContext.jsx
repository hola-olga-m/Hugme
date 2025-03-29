import React, { createContext, useState, useEffect, useContext } from 'react';
import { gql, useApolloClient } from '@apollo/client';
import { setAuthToken } from '../services/graphqlService';
import { showNotification } from '../utils/notifications';

// Define the auth context
export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// GraphQL queries and mutations for authentication
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      user {
        id
        name
        email
        role
        avatarUrl
        createdAt
      }
      token
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(registerInput: { name: $name, email: $email, password: $password }) {
      user {
        id
        name
        email
        role
        avatarUrl
        createdAt
      }
      token
    }
  }
`;

const ANONYMOUS_LOGIN_MUTATION = gql`
  mutation AnonymousLogin($nickname: String!) {
    anonymousLogin(nickname: $nickname) {
      user {
        id
        name
        role
        avatarUrl
        createdAt
      }
      token
    }
  }
`;

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      name
      email
      role
      avatarUrl
      createdAt
    }
  }
`;

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const client = useApolloClient();

  // Initialize auth state with timeout protection
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('AuthContext: Initializing auth state');
      
      // Add a timeout protection to prevent getting stuck in loading state
      const authTimeout = setTimeout(() => {
        console.warn('AuthContext: Authentication check timed out after 10 seconds');
        if (loading) {
          console.log('AuthContext: Still loading after timeout, forcing state reset');
          clearAuthData();
          setLoading(false);
          setError('Authentication timed out. Please try again.');
        }
      }, 10000); // 10 second timeout
      
      try {
        const storedToken = localStorage.getItem('authToken');
        console.log('AuthContext: Found stored token?', !!storedToken);
        
        if (storedToken) {
          console.log('AuthContext: Setting token and preparing to fetch user');
          setToken(storedToken);
          setAuthToken(storedToken);
          
          // Use Promise.race to add timeout to fetchCurrentUser
          const userDataPromise = fetchCurrentUser();
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Fetch user timeout'));
            }, 8000); // 8 second timeout for fetching user
          });
          
          await Promise.race([userDataPromise, timeoutPromise]).catch(err => {
            console.error('Auth fetch user timeout or error:', err);
            throw new Error('Failed to fetch user data: timeout');
          });
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
      } finally {
        // Clear the timeout since we're done (success or error)
        clearTimeout(authTimeout);
      }
    };

    console.log('AuthContext: Starting authentication check...');
    initializeAuth();
    
    // Cleanup function to ensure we don't leave loading state if component unmounts
    return () => {
      if (loading) {
        console.log('AuthContext: Component unmounting while still loading, forcing loading false');
        setLoading(false);
      }
    };
  }, [loading]); // Add loading as dependency to properly track state

  // Fetch the current user data with timeout and retry
  const fetchCurrentUser = async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    
    // Track if this operation was aborted
    let aborted = false;
    
    // Create an AbortController for this request
    const controller = new AbortController();
    const signal = controller.signal;
    
    // Set a timeout to abort the request if it takes too long
    const timeoutId = setTimeout(() => {
      console.warn('AuthContext: Fetch current user timed out after 8 seconds');
      controller.abort();
      aborted = true;
    }, 8000);
    
    try {
      console.log('AuthContext: Attempting to fetch current user (attempt: ' + (retryCount + 1) + ')');
      
      // Use Promise.race to implement a timeout
      const { data } = await client.query({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only', // Don't use cache for this
        errorPolicy: 'all', // Return errors alongside any data
        context: {
          fetchOptions: {
            signal, // Pass the abort signal
            timeout: 8000 // 8 second timeout
          }
        }
      });
      
      // Clear timeout since the request completed
      clearTimeout(timeoutId);
      
      if (aborted) {
        console.log('AuthContext: Request was aborted, but completed anyway');
      }
      
      if (data?.currentUser) {
        console.log('AuthContext: Current user found', data.currentUser);
        setUser(data.currentUser);
      } else {
        console.log('AuthContext: No current user found in response, data:', data);
        clearAuthData();
      }
    } catch (err) {
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Check if this was an abort error
      if (err.name === 'AbortError' || aborted || err.message?.includes('aborted')) {
        console.error('AuthContext: Fetch current user aborted due to timeout');
        
        // Retry logic - only retry once for timeouts
        if (retryCount < 1) {
          console.log('AuthContext: Retrying fetch current user after timeout...');
          return fetchCurrentUser(retryCount + 1);
        } else {
          clearAuthData();
          setError('Connection timed out. Please check your network and try again.');
        }
      } else {
        console.error('Error fetching current user:', err);
        
        if (err.networkError) {
          console.error('Network error details:', err.networkError);
          
          // For network errors, we can retry once
          if (retryCount < 1 && !aborted) {
            console.log('AuthContext: Retrying after network error...');
            return fetchCurrentUser(retryCount + 1);
          }
        }
        
        if (err.graphQLErrors) {
          console.error('GraphQL errors:', err.graphQLErrors);
          
          // Check if any of the GraphQL errors indicate authentication issues
          const hasAuthError = err.graphQLErrors.some(
            error => error.extensions?.code === 'UNAUTHENTICATED' || 
                   error.message?.includes('auth') || 
                   error.message?.includes('token')
          );
          
          if (hasAuthError) {
            setError('Your session has expired. Please log in again.');
          } else {
            setError('Error loading user data. Please try again.');
          }
        } else {
          setError('Session expired. Please log in again.');
        }
        
        clearAuthData();
      }
    } finally {
      if (!aborted) {
        console.log('AuthContext: Finished fetchCurrentUser, setting loading to false');
        setLoading(false);
      }
    }
  };

  // Login function with timeout protection
  const login = async (credentials, retryCount = 0) => {
    console.log('AuthContext: Login called with credentials', { 
      email: credentials.email, 
      password: credentials.password ? '[REDACTED]' : undefined 
    });
    
    setLoading(true);
    setError(null);
    
    // Create timeout controller
    let timeoutId;
    let aborted = false;
    const controller = new AbortController();
    
    // Set a timeout to abort the request if it takes too long
    timeoutId = setTimeout(() => {
      console.warn('AuthContext: Login request timed out after 10 seconds');
      controller.abort();
      aborted = true;
    }, 10000);
    
    try {
      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { 
          email: credentials.email, 
          password: credentials.password 
        },
        context: {
          fetchOptions: {
            signal: controller.signal,
            timeout: 10000
          }
        }
      });
      
      // Clear timeout since the request completed
      clearTimeout(timeoutId);
      
      console.log('AuthContext: Login mutation response received', 
        data?.login ? { hasToken: !!data.login.token, hasUser: !!data.login.user } : 'No login data');
      
      if (data?.login?.token && data?.login?.user) {
        console.log('AuthContext: Login successful, setting auth data');
        // Save auth data
        setToken(data.login.token);
        setUser(data.login.user);
        localStorage.setItem('authToken', data.login.token);
        setAuthToken(data.login.token);
        
        // Show success notification
        showNotification('Login Successful', `Welcome back, ${data.login.user.name}!`, {
          type: 'success'
        });
        
        return { success: true, user: data.login.user };
      } else {
        console.log('AuthContext: Login response missing token or user data');
        throw new Error('Invalid login response from server');
      }
    } catch (err) {
      // Clear timeout to prevent memory leaks
      clearTimeout(timeoutId);
      
      // Check if this was a timeout or abort error
      if (err.name === 'AbortError' || aborted || err.message?.includes('aborted') || err.message?.includes('timeout')) {
        console.error('AuthContext: Login request aborted due to timeout');
        
        // Only retry once for timeout
        if (retryCount < 1) {
          console.log('AuthContext: Retrying login after timeout...');
          return login(credentials, retryCount + 1);
        } else {
          const timeoutMessage = 'Login timed out. Please check your network connection and try again.';
          setError(timeoutMessage);
          showNotification('Login Failed', timeoutMessage, { type: 'error' });
        }
      } else {
        console.error('Login error:', err);
        
        // Handle network errors with retry
        if (err.networkError && retryCount < 1) {
          console.log('AuthContext: Network error, retrying login...');
          return login(credentials, retryCount + 1);
        }
        
        // Get appropriate error message
        let errorMessage;
        if (err.graphQLErrors && err.graphQLErrors.length > 0) {
          errorMessage = err.graphQLErrors[0].message;
        } else if (err.networkError) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = 'Login failed. Please check your credentials.';
        }
        
        setError(errorMessage);
        
        // Show error notification
        showNotification('Login Failed', errorMessage, {
          type: 'error'
        });
      }
      
      throw err; // Rethrow to allow Login component to handle the error
    } finally {
      if (!aborted) {
        setLoading(false);
      }
    }
  };

  // Register function
  const register = async (registerData) => {
    console.log('AuthContext: Register called with data', { 
      name: registerData.name,
      email: registerData.email, 
      password: registerData.password ? '[REDACTED]' : undefined 
    });
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { 
          name: registerData.name,
          email: registerData.email, 
          password: registerData.password 
        }
      });
      
      console.log('AuthContext: Registration mutation response received', 
        data?.register ? { hasToken: !!data.register.token, hasUser: !!data.register.user } : 'No register data');
      
      if (data?.register?.token && data?.register?.user) {
        console.log('AuthContext: Registration successful, setting auth data');
        // Save auth data
        setToken(data.register.token);
        setUser(data.register.user);
        localStorage.setItem('authToken', data.register.token);
        setAuthToken(data.register.token);
        
        // Show success notification
        showNotification('Registration Successful', `Welcome to HugMeNow, ${data.register.user.name}!`, {
          type: 'success'
        });
        
        return { success: true, user: data.register.user };
      } else {
        console.log('AuthContext: Registration response missing token or user data');
        throw new Error('Invalid registration response from server');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.graphQLErrors?.[0]?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      
      // Show error notification
      showNotification('Registration Failed', errorMessage, {
        type: 'error'
      });
      
      throw err; // Rethrow to allow Register component to handle the error
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    
    // Show notification
    showNotification('Logged Out', 'You have been successfully logged out.', {
      type: 'info'
    });
  };

  // Clear auth data helper
  const clearAuthData = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  // Anonymous login function
  const anonymousLogin = async (anonData) => {
    console.log('AuthContext: Anonymous login called with nickname:', anonData.nickname);
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await client.mutate({
        mutation: ANONYMOUS_LOGIN_MUTATION,
        variables: { 
          nickname: anonData.nickname
        }
      });
      
      console.log('AuthContext: Anonymous login mutation response received', 
        data?.anonymousLogin ? { 
          hasToken: !!data.anonymousLogin.token, 
          hasUser: !!data.anonymousLogin.user 
        } : 'No anonymous login data');
      
      if (data?.anonymousLogin?.token && data?.anonymousLogin?.user) {
        console.log('AuthContext: Anonymous login successful, setting auth data');
        // Save auth data
        setToken(data.anonymousLogin.token);
        setUser(data.anonymousLogin.user);
        localStorage.setItem('authToken', data.anonymousLogin.token);
        setAuthToken(data.anonymousLogin.token);
        
        // Show success notification
        showNotification('Welcome!', `You're now logged in as ${data.anonymousLogin.user.name}`, {
          type: 'success'
        });
        
        return { success: true, user: data.anonymousLogin.user };
      } else {
        console.log('AuthContext: Anonymous login response missing token or user data');
        throw new Error('Invalid anonymous login response from server');
      }
    } catch (err) {
      console.error('Anonymous login error:', err);
      const errorMessage = err.graphQLErrors?.[0]?.message || 'Anonymous login failed. Please try again.';
      setError(errorMessage);
      
      // Show error notification
      showNotification('Login Failed', errorMessage, {
        type: 'error'
      });
      
      throw err; // Rethrow to allow Login component to handle the error
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const authContextValue = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    anonymousLogin,
    refreshUser: fetchCurrentUser
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchWithErrorHandling } from '../utils/apiErrorHandler';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    console.log('[Auth Debug] Token exists:', !!token);
    
    if (token) {
      // Fetch user data using the token
      const fetchUserData = async () => {
        try {
          const response = await fetchWithErrorHandling('/api/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.user) {
            setCurrentUser(response.user);
          } else {
            // Invalid token response
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await fetchWithErrorHandling('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginInput: credentials }),
      });
      
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        setCurrentUser(data.user);
        console.log('Login successful, user:', data.user);
        return { success: true, user: data.user };
      } else {
        throw new Error('Login failed: No access token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      console.log('Registering with data:', {
        username: userData.username,
        email: userData.email,
        name: userData.name,
        hasPassword: !!userData.password
      });
      
      const data = await fetchWithErrorHandling('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registerInput: userData }),
      });
      
      console.log('Registration response:', data);
      
      if (data.accessToken) {
        // Don't automatically log in after registration
        console.log('Registration successful');
        return { success: true, message: 'Registration successful' };
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Registration failed: Unknown error');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const data = await fetchWithErrorHandling('/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profileData }),
      });
      
      if (data.user) {
        setCurrentUser(data.user);
        return data.user;
      } else {
        throw new Error('Profile update failed');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
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
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
