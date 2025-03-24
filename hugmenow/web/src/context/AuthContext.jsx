import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import { LOGIN, REGISTER, ANONYMOUS_LOGIN } from '../graphql/mutations';
import { GET_ME } from '../graphql/queries';

// Create the context
const AuthContext = createContext(null);

// Hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const client = useApolloClient();
  
  // Apollo mutations
  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [anonymousLoginMutation] = useMutation(ANONYMOUS_LOGIN);
  
  // Get current user query
  const { refetch } = useQuery(GET_ME, {
    skip: !localStorage.getItem('authToken'),
    onCompleted: (data) => {
      if (data?.me) {
        setCurrentUser(data.me);
      }
      setLoading(false);
    },
    onError: (error) => {
      console.error('Error fetching current user:', error);
      setError(error.message);
      setLoading(false);
    }
  });
  
  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Refetch user data
          const { data } = await refetch();
          if (data?.me) {
            setCurrentUser(data.me);
          } else {
            // If no user data is returned, clear the token
            localStorage.removeItem('authToken');
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [refetch]);
  
  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const { data } = await loginMutation({
        variables: {
          loginInput: {
            email,
            password
          }
        }
      });
      
      if (data?.login) {
        localStorage.setItem('authToken', data.login.accessToken);
        setCurrentUser(data.login.user);
        
        // Redirect to dashboard
        navigate('/dashboard');
        return data.login.user;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Register function
  const register = async (username, email, name, password, avatarUrl) => {
    setError(null);
    try {
      const { data } = await registerMutation({
        variables: {
          registerInput: {
            username,
            email,
            name,
            password,
            avatarUrl: avatarUrl || undefined
          }
        }
      });
      
      if (data?.register) {
        localStorage.setItem('authToken', data.register.accessToken);
        setCurrentUser(data.register.user);
        
        // Redirect to dashboard
        navigate('/dashboard');
        return data.register.user;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Anonymous login function
  const anonymousLogin = async (nickname, avatarUrl) => {
    setError(null);
    try {
      const { data } = await anonymousLoginMutation({
        variables: {
          anonymousLoginInput: {
            nickname,
            avatarUrl: avatarUrl || undefined
          }
        }
      });
      
      if (data?.anonymousLogin) {
        localStorage.setItem('authToken', data.anonymousLogin.accessToken);
        setCurrentUser(data.anonymousLogin.user);
        
        // Redirect to dashboard
        navigate('/dashboard');
        return data.anonymousLogin.user;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    
    // Clear Apollo cache
    client.clearStore();
    
    // Redirect to home page
    navigate('/');
  };
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };
  
  // Value object for context provider
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    anonymousLogin,
    logout,
    isAuthenticated,
    refetchUser: refetch,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;