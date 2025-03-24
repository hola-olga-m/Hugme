import { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { LOGIN, REGISTER, ANONYMOUS_LOGIN } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';

// Create auth context
const AuthContext = createContext();

// Provider component that wraps your app and makes auth object available to any
// child component that calls useAuth().
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const client = useApolloClient();

  // Setup mutations
  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [anonymousLoginMutation] = useMutation(ANONYMOUS_LOGIN);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const { data } = await client.query({
            query: GET_ME,
            fetchPolicy: 'network-only' // Don't use the cache for this query
          });
          
          if (data && data.me) {
            setCurrentUser(data.me);
          }
        } catch (err) {
          // Invalid token or other error
          console.error('Auth check error:', err);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [client]);

  // Register a new user
  const register = async (userData) => {
    setError(null);
    try {
      const { data } = await registerMutation({
        variables: { registerInput: userData }
      });
      
      if (data.register.accessToken) {
        localStorage.setItem('token', data.register.accessToken);
        setCurrentUser(data.register.user);
        return data.register;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  // Log in an existing user
  const login = async (email, password) => {
    setError(null);
    try {
      const { data } = await loginMutation({
        variables: { loginInput: { email, password } }
      });
      
      if (data.login.accessToken) {
        localStorage.setItem('token', data.login.accessToken);
        setCurrentUser(data.login.user);
        return data.login;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Log in anonymously
  const anonymousLogin = async (nickname, avatarUrl) => {
    setError(null);
    try {
      const { data } = await anonymousLoginMutation({
        variables: { 
          anonymousLoginInput: { 
            nickname, 
            avatarUrl 
          } 
        }
      });
      
      if (data.anonymousLogin.accessToken) {
        localStorage.setItem('token', data.anonymousLogin.accessToken);
        setCurrentUser(data.anonymousLogin.user);
        return data.anonymousLogin;
      }
    } catch (err) {
      setError(err.message || 'Anonymous login failed');
      throw err;
    }
  };

  // Log out
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    // Reset Apollo store to clear cached data
    client.resetStore();
  };

  // Update user in state after profile changes
  const updateUserState = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  // Value contains all the things we want to expose to components using this context
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    anonymousLogin,
    logout,
    updateUserState,
    isAuthenticated: !!currentUser,
    isAnonymous: currentUser?.isAnonymous || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;