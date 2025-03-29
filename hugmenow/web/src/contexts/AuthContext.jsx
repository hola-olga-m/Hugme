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

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('AuthContext: Initializing auth state');
      try {
        const storedToken = localStorage.getItem('authToken');
        console.log('AuthContext: Found stored token?', !!storedToken);
        
        if (storedToken) {
          console.log('AuthContext: Setting token and preparing to fetch user');
          setToken(storedToken);
          setAuthToken(storedToken);
          await fetchCurrentUser();
        } else {
          console.log('AuthContext: No token found, setting loading to false');
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        console.log('AuthContext: Clearing auth data due to error');
        clearAuthData();
        setLoading(false);
      }
    };

    console.log('AuthContext: Starting authentication check...');
    initializeAuth();
  }, []);

  // Fetch the current user data
  const fetchCurrentUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext: Attempting to fetch current user');
      const { data } = await client.query({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only', // Don't use cache for this
        errorPolicy: 'all' // Return errors alongside any data
      });
      
      if (data?.currentUser) {
        console.log('AuthContext: Current user found', data.currentUser);
        setUser(data.currentUser);
      } else {
        console.log('AuthContext: No current user found in response, data:', data);
        clearAuthData();
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      if (err.networkError) {
        console.error('Network error details:', err.networkError);
      }
      if (err.graphQLErrors) {
        console.error('GraphQL errors:', err.graphQLErrors);
      }
      clearAuthData();
      setError('Session expired. Please log in again.');
    } finally {
      console.log('AuthContext: Finished fetchCurrentUser, setting loading to false');
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: { email, password }
      });
      
      if (data?.login?.token && data?.login?.user) {
        // Save auth data
        setToken(data.login.token);
        setUser(data.login.user);
        localStorage.setItem('authToken', data.login.token);
        setAuthToken(data.login.token);
        
        // Show success notification
        showNotification('Login Successful', `Welcome back, ${data.login.user.name}!`, {
          type: 'success'
        });
        
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.graphQLErrors?.[0]?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      
      // Show error notification
      showNotification('Login Failed', errorMessage, {
        type: 'error'
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await client.mutate({
        mutation: REGISTER_MUTATION,
        variables: { name, email, password }
      });
      
      if (data?.register?.token && data?.register?.user) {
        // Save auth data
        setToken(data.register.token);
        setUser(data.register.user);
        localStorage.setItem('authToken', data.register.token);
        setAuthToken(data.register.token);
        
        // Show success notification
        showNotification('Registration Successful', `Welcome to HugMeNow, ${data.register.user.name}!`, {
          type: 'success'
        });
        
        return true;
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.graphQLErrors?.[0]?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      
      // Show error notification
      showNotification('Registration Failed', errorMessage, {
        type: 'error'
      });
      
      return false;
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
    refreshUser: fetchCurrentUser
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;