import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchWithErrorHandling } from '../utils/apiErrorHandler';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state from localStorage or API
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        console.log('[Auth Debug] Token exists:', !!token);
        
        if (token && storedUser) {
          // If we have both token and user data in storage, use them
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
          
          // Optionally verify token validity with the server
          try {
            const response = await fetchWithErrorHandling('/api/auth/verify', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.valid) {
              console.log('AuthContext: Token validated successfully');
              // Refresh user data if needed
              setCurrentUser(response.user || userData);
            } else {
              console.log('AuthContext: Token invalid, clearing auth data');
              clearAuthData();
            }
          } catch (verifyError) {
            console.warn('Auth verification error:', verifyError);
            // Continue with stored data, as the server might be unavailable
          }
          
          setLoading(false);
        } else {
          console.log('AuthContext: No token found, setting loading to false');
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        console.log('AuthContext: Clearing auth data due to error');
        clearAuthData();
        setLoading(false);
        
        // Removed error handling as per edited code intention.  Error handling would need to be implemented outside the AuthContext if required.
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetchWithErrorHandling('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const { token, user } = response;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      
      return user;
    } catch (err) {
      // Removed error handling as per edited code intention
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetchWithErrorHandling('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const { token, user } = response;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setCurrentUser(user);
      
      return user;
    } catch (err) {
      // Removed error handling as per edited code intention
      throw err;
    }
  };

  const logout = () => {
    clearAuthData();
  };

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetchWithErrorHandling('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const updatedUser = response.user;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      // Removed error handling as per edited code intention
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await fetchWithErrorHandling('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      return true;
    } catch (err) {
      // Removed error handling as per edited code intention
      throw err;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await fetchWithErrorHandling('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      
      return true;
    } catch (err) {
      // Removed error handling as per edited code intention
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;