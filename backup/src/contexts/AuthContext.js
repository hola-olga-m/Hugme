import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as graphqlService from '../services/graphqlService';
// Legacy functions - will gradually replace these
import { getToken, getCurrentUser } from '../services/authService';

// Create context
export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state using GraphQL
  const initializeAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get the token from localStorage
      const token = getToken();
      const isUserAuthenticated = !!token;

      if (isUserAuthenticated) {
        try {
          // Verify token with GraphQL API
          const result = await graphqlService.queries.verifyToken(token);

          if (result.data?.verifyToken?.isValid) {
            // Set user data from token verification
            const userData = result.data.verifyToken.user;
            setCurrentUser(userData);
            setIsAuthenticated(true);

            // Check if anonymous session
            setIsAnonymous(userData?.isAnonymous || false);

            // Update token in GraphQL service
            graphqlService.setAuthToken(token);
          } else {
            // Invalid token, clear auth state
            console.warn('Invalid authentication token');
            setIsAuthenticated(false);
            setCurrentUser(null);
            setIsAnonymous(false);
            localStorage.removeItem('hugmood_token');
            localStorage.removeItem('hugmood_user');
          }
        } catch (verifyError) {
          console.error('Token verification error:', verifyError);
          // Fall back to local storage data for offline support
          const userData = getCurrentUser();
          if (userData) {
            setCurrentUser(userData);
            setIsAuthenticated(true);
            setIsAnonymous(userData?.isAnonymous || false);
          } else {
            setIsAuthenticated(false);
          }
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthError('Failed to initialize authentication');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run initialization on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Login handler using GraphQL
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // Call GraphQL login mutation
      const result = await graphqlService.mutations.login(
        credentials.email,
        credentials.password
      );

      if (!result?.login?.token || !result?.login?.user) {
        throw new Error('Invalid login response');
      }

      const { token, user } = result.login;

      // Store token and user data
      localStorage.setItem('hugmood_token', token);
      localStorage.setItem('hugmood_user', JSON.stringify(user));

      // Update GraphQL client auth token
      graphqlService.setAuthToken(token);

      // Update state with user data
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsAnonymous(user.isAnonymous || false);

      return { success: true, token, user };
    } catch (error) {
      console.error('Login error:', error);

      // Format error message
      const errorMessage = error.message || 'Login failed';
      setAuthError(errorMessage);

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler using GraphQL
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // Call GraphQL register mutation
      const result = await graphqlService.mutations.register(userData);

      if (!result?.register?.token || !result?.register?.user) {
        throw new Error('Invalid registration response');
      }

      const { token, user } = result.register;

      // Store token and user data
      localStorage.setItem('hugmood_token', token);
      localStorage.setItem('hugmood_user', JSON.stringify(user));

      // Update GraphQL client auth token
      graphqlService.setAuthToken(token);

      // Update state with user data
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsAnonymous(false);

      return { success: true, token, user };
    } catch (error) {
      console.error('Registration error:', error);

      // Format error message
      const errorMessage = error.message || 'Registration failed';
      setAuthError(errorMessage);

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Start anonymous session using GraphQL
  const startAnonymousSession = async (nickname = 'Guest', avatarId = 1) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // Call GraphQL anonymousLogin mutation
      const result = await graphqlService.mutations.anonymousLogin({
        nickname,
        avatarId
      });

      if (!result.data?.anonymousLogin?.token || !result.data?.anonymousLogin?.user) {
        throw new Error('Invalid anonymous login response');
      }

      const { token, user } = result.data.anonymousLogin;

      // Store token and user data
      localStorage.setItem('hugmood_token', token);
      localStorage.setItem('hugmood_user', JSON.stringify(user));

      // Update GraphQL client auth token
      graphqlService.setAuthToken(token);

      // Update state
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsAnonymous(true);

      return { success: true, token, user };
    } catch (error) {
      console.error('Anonymous session error:', error);

      // Format error message
      const errorMessage = error.message || 'Failed to start anonymous session';
      setAuthError(errorMessage);

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert anonymous user to registered using GraphQL
  const convertAnonymousUser = async (userData) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // Check if currently in anonymous session
      if (!isAnonymous) {
        throw new Error('Not in an anonymous session');
      }

      // Call GraphQL convertAnonymousUser mutation
      const result = await graphqlService.mutations.convertAnonymousUser(userData);

      if (!result.data?.convertAnonymousUser?.token || !result.data?.convertAnonymousUser?.user) {
        throw new Error('Invalid conversion response');
      }

      const { token, user } = result.data.convertAnonymousUser;

      // Store token and user data
      localStorage.setItem('hugmood_token', token);
      localStorage.setItem('hugmood_user', JSON.stringify(user));

      // Update GraphQL client auth token
      graphqlService.setAuthToken(token);

      // Update state
      setCurrentUser(user);
      setIsAnonymous(false);

      return { success: true, token, user };
    } catch (error) {
      console.error('Convert anonymous user error:', error);

      // Format error message
      const errorMessage = error.message || 'Failed to convert anonymous account';
      setAuthError(errorMessage);

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler using GraphQL
  const logoutUser = async () => {
    try {
      setIsLoading(true);

      // Get current token
      const token = getToken();

      if (token) {
        try {
          // Call GraphQL logout mutation if online
          await graphqlService.mutations.logout();
        } catch (logoutError) {
          console.warn('Logout mutation error (offline?):', logoutError);
          // Continue with local logout even if server logout fails
        }
      }

      // Clear GraphQL client auth token
      graphqlService.clearAuthToken();

      // Clear local storage
      localStorage.removeItem('hugmood_token');
      localStorage.removeItem('hugmood_user');

      // Clear state
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsAnonymous(false);

      return true;
    } catch (error) {
      console.error('Logout error:', error);

      // Still clear local state even if there was an error
      localStorage.removeItem('hugmood_token');
      localStorage.removeItem('hugmood_user');
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsAnonymous(false);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile handler using GraphQL
  const updateProfile = async (profileData) => {
    try {
      setAuthError(null);

      // Call GraphQL updateUserProfile mutation
      const result = await graphqlService.mutations.updateUserProfile(profileData);

      if (!result.data?.updateUserProfile?.user) {
        throw new Error('Invalid profile update response');
      }

      const updatedUser = result.data.updateUserProfile.user;

      // Update user data in localStorage
      if (isAuthenticated) {
        const userData = JSON.parse(localStorage.getItem('hugmood_user') || '{}');
        localStorage.setItem('hugmood_user', JSON.stringify({
          ...userData,
          ...updatedUser
        }));
      }

      // Update state
      setCurrentUser(prev => ({ ...prev, ...updatedUser }));

      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);

      // Format error message
      const errorMessage = error.message || 'Failed to update profile';
      setAuthError(errorMessage);

      throw new Error(errorMessage);
    }
  };

  // Request password reset via GraphQL
  const requestPasswordReset = async (email) => {
    try {
      setAuthError(null);

      // Call GraphQL forgotPassword mutation
      const result = await graphqlService.mutations.forgotPassword({ email });

      if (!result?.forgotPassword?.success) {
        throw new Error('Failed to send password reset instructions');
      }

      return result.forgotPassword;
    } catch (error) {
      console.error('Password reset request error:', error);

      // Format error message
      const errorMessage = error.message || 'Failed to request password reset';
      setAuthError(errorMessage);

      throw new Error(errorMessage);
    }
  };

  // Verify reset token via GraphQL
  const verifyResetToken = async (token) => {
    try {
      setAuthError(null);

      // Call GraphQL verifyResetToken query
      const result = await graphqlService.queries.verifyResetToken(token);

      if (!result?.verifyResetToken?.isValid) {
        throw new Error('Invalid or expired reset token');
      }

      return result.verifyResetToken;
    } catch (error) {
      console.error('Reset token verification error:', error);

      // Format error message
      const errorMessage = error.message || 'Invalid or expired reset token';
      setAuthError(errorMessage);

      throw new Error(errorMessage);
    }
  };

  // Reset password with token via GraphQL
  const resetPassword = async (data) => {
    try {
      setAuthError(null);

      // Call GraphQL resetPassword mutation
      const result = await graphqlService.mutations.resetPassword(data);

      if (!result?.resetPassword?.success) {
        throw new Error('Failed to reset password');
      }

      return result.resetPassword;
    } catch (error) {
      console.error('Password reset error:', error);

      // Format error message
      const errorMessage = error.message || 'Failed to reset password';
      setAuthError(errorMessage);

      throw new Error(errorMessage);
    }
  };

  // Handle social login via GraphQL
  const socialLogin = async (provider, data = {}) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      // If getUrl is true, just get the auth URL without performing authentication
      if (data.getUrl) {
        const result = await graphqlService.queries.getSocialAuthUrl(provider, window.location.origin + '/auth/social-callback?provider=' + provider);
        return result;
      }

      // Regular social authentication with code/token from OAuth provider
      const result = await graphqlService.mutations.socialLogin({
        provider,
        code: data.code,
        token: data.token,
        redirectUri: window.location.origin + '/auth/social-callback'
      });

      if (!result?.socialLogin?.token || !result?.socialLogin?.user) {
        throw new Error(`Invalid ${provider} login response`);
      }

      const { token, user } = result.socialLogin;

      // Store token and user data
      localStorage.setItem('hugmood_token', token);
      localStorage.setItem('hugmood_user', JSON.stringify(user));

      // Update GraphQL client auth token
      graphqlService.setAuthToken(token);

      // Update state
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsAnonymous(user.isAnonymous || false);

      return { success: true, token, user };
    } catch (error) {
      console.error(`Social login (${provider}) error:`, error);

      // Format error message
      const errorMessage = error.message || `${provider} login failed`;
      setAuthError(errorMessage);

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Provide the context value
  const contextValue = {
    currentUser,
    isAuthenticated,
    isAnonymous,
    isLoading,
    authError,
    login,
    register,
    logout: logoutUser,
    startAnonymousSession,
    convertAnonymousUser,
    updateProfile,
    checkAuth: initializeAuth,
    authToken: graphqlService.getAuthToken() || getToken(),
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
    socialLogin,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;