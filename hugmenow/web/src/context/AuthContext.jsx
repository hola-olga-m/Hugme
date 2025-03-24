import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { LOGIN, REGISTER, ANONYMOUS_LOGIN } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');
  
  const client = useApolloClient();
  
  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [anonymousLoginMutation] = useMutation(ANONYMOUS_LOGIN);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Try to get current user with token
          const { data } = await client.query({
            query: GET_ME,
            fetchPolicy: 'network-only'
          });
          
          if (data && data.me) {
            setCurrentUser(data.me);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Auth check error:', err);
          localStorage.removeItem('token');
        }
      }
      
      setAuthLoading(false);
    };
    
    checkAuth();
  }, [client]);

  const login = async (email, password) => {
    setError('');
    try {
      const { data } = await loginMutation({
        variables: {
          loginInput: {
            email,
            password
          }
        }
      });
      
      const { accessToken, user } = data.login;
      localStorage.setItem('token', accessToken);
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      return { 
        success: false, 
        error: err.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const register = async (username, email, name, password) => {
    setError('');
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
      localStorage.setItem('token', accessToken);
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      return { 
        success: false, 
        error: err.message || 'Registration failed. Please try again.'
      };
    }
  };

  const anonymousLogin = async (nickname, avatarUrl) => {
    setError('');
    try {
      const { data } = await anonymousLoginMutation({
        variables: {
          anonymousLoginInput: {
            nickname,
            avatarUrl
          }
        }
      });
      
      const { accessToken, user } = data.anonymousLogin;
      localStorage.setItem('token', accessToken);
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (err) {
      console.error('Anonymous login error:', err);
      setError(err.message);
      return { 
        success: false, 
        error: err.message || 'Anonymous login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
    client.resetStore();
  };

  const updateUserContext = (userData) => {
    setCurrentUser(userData);
  };

  const value = {
    currentUser,
    isAuthenticated,
    authLoading,
    error,
    login,
    register,
    anonymousLogin,
    logout,
    updateUserContext
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;