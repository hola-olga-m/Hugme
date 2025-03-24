import React, { createContext, useState, useEffect } from 'react';
import { showNotification } from '../utils/notifications';
import { v4 as uuidv4 } from 'uuid';
import * as authService from '../services/authService';

// API calls helper
const API_URL = '/api';

// Helper to make API requests
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const url = `${API_URL}${endpoint}`;
  const token = authService.getToken();
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    // Try to get error message from response
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // If JSON parsing fails, use status text
      errorMessage = response.statusText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
  
  // For 204 No Content responses
  if (response.status === 204) {
    return null;
  }
  
  return await response.json();
};

// Create the UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [socialConnections, setSocialConnections] = useState([]);
  const [lastVisited, setLastVisited] = useState(null);
  const [preferences, setPreferences] = useState({
    notificationsEnabled: true,
    hapticFeedbackEnabled: true,
    darkMode: false,
    language: 'en',
    privacySettings: {
      shareMoodWithFriends: true,
      allowFriendRequests: true,
      showOnlineStatus: true,
      allowAnonymousHugs: true,
      dataSharing: 'friends-only'
    },
    accessibility: {
      reduceMotion: false,
      highContrast: false,
      fontSize: 'medium',
      useSystemSettings: true
    }
  });
  
  // Check for stored authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Track last visit time
        const currentTime = new Date().toISOString();
        const previousVisit = localStorage.getItem('lastVisited');
        if (previousVisit) {
          setLastVisited(previousVisit);
        }
        localStorage.setItem('lastVisited', currentTime);
        
        // Check if this is an anonymous session
        if (authService.isAnonymousSession()) {
          // User is in anonymous mode
          console.log('Restoring anonymous session');
          
          // Get user from storage
          const anonymousUser = authService.getCurrentUser();
          
          if (anonymousUser) {
            setUser(anonymousUser);
            setIsAuthenticated(true);
            setIsAnonymous(true);
            
            // Load anonymous user preferences
            const storedAnonymousPreferences = JSON.parse(localStorage.getItem('anonymousUserPreferences'));
            if (storedAnonymousPreferences) {
              setPreferences(storedAnonymousPreferences);
            }
          } else {
            // Anonymous flag exists but no data - something went wrong
            authService.endAnonymousSession();
            setIsAnonymous(false);
            setIsAuthenticated(false);
          }
          
        } else if (authService.isAuthenticated()) {
          // User is authenticated with regular account
          console.log('Validating authentication token with server');
          
          try {
            // Get current user data
            const userData = authService.getCurrentUser();
            
            if (userData) {
              // Use user data from authService
              setUser(userData);
              setIsAuthenticated(true);
              setIsAnonymous(false);
              
              // Load social connections
              const storedConnections = JSON.parse(localStorage.getItem('socialConnections'));
              if (storedConnections) {
                setSocialConnections(storedConnections);
              }
              
              // Load user preferences
              const storedPreferences = JSON.parse(localStorage.getItem('userPreferences'));
              if (storedPreferences) {
                setPreferences(storedPreferences);
              }
            } else {
              // This shouldn't happen but just in case
              handleLogout();
            }
          } catch (error) {
            console.error('Error validating token:', error);
            // Token is invalid - clear authentication data
            handleLogout();
          }
        } else {
          // No authenticated user found
          setUser(null);
          setIsAuthenticated(false);
          setIsAnonymous(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Handle any errors, e.g., invalid stored data
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Login function
  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Use authService for login
      const response = await authService.login({
        email,
        password
      });
      
      // Update state with user data from authService
      setUser(response.user);
      setIsAuthenticated(true);
      setIsAnonymous(false);
      
      // Show success notification
      showNotification('Login Successful', `Welcome, ${response.user.username}!`);
      
      return { success: true, user: response.user };
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Show error notification
      showNotification('Login Failed', error.message || 'Invalid email or password');
      
      return { 
        success: false, 
        error: error.message || 'Invalid email or password'
      };
    }
  };
  
  // Register function
  const register = async (email, password, username) => {
    try {
      if (!email || !password || !username) {
        throw new Error('Email, password, and username are required');
      }
      
      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Check if password is strong enough
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // Use authService for registration
      const response = await authService.register({
        username,
        email,
        password,
        name: username // Optional name field
      });
      
      // Update state with user data from authService
      setUser(response.user);
      setIsAuthenticated(true);
      setIsAnonymous(false);
      
      // Show success notification
      showNotification('Registration Successful', `Welcome to HugMood, ${username}!`);
      
      return { success: true, user: response.user };
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show error notification
      showNotification('Registration Failed', error.message || 'Unable to create account');
      
      return { 
        success: false, 
        error: error.message || 'Unable to create account'
      };
    }
  };
  
  // Handle logout (shared by both regular and anonymous logout)
  const handleLogout = async () => {
    try {
      // Use authService for logout
      await authService.logout();
      
      // Clear all additional authentication data from local storage
      localStorage.removeItem('userPreferences');
      localStorage.removeItem('socialConnections');
      localStorage.removeItem('anonymousToken');
      localStorage.removeItem('anonymousUserData');
      localStorage.removeItem('anonymousUserPreferences');
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
      setIsAnonymous(false);
      setSocialConnections([]);
      
      // Show notification
      showNotification('Logged Out', 'You have been successfully logged out');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API call fails, clean up local state
      setUser(null);
      setIsAuthenticated(false);
      setIsAnonymous(false);
      
      showNotification('Logged Out', 'You have been logged out');
    }
  };
  
  // Start anonymous session
  const startAnonymousSession = async (nickname = null) => {
    try {
      // Use authService to start anonymous session
      const result = await authService.startAnonymousSession(nickname || 'Guest');
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to start anonymous session');
      }
      
      const anonymousUser = result.user;
      
      // Set anonymous-specific preferences
      const anonymousPreferences = {
        ...preferences,
        privacySettings: {
          ...preferences.privacySettings,
          shareMoodWithFriends: false,
          showOnlineStatus: false,
          dataSharing: 'none'
        }
      };
      
      localStorage.setItem('anonymousUserPreferences', JSON.stringify(anonymousPreferences));
      
      // Update state
      setUser(anonymousUser);
      setIsAuthenticated(true);
      setIsAnonymous(true);
      setPreferences(anonymousPreferences);
      
      showNotification('Anonymous Mode', `Welcome! You're browsing anonymously.`);
      
      return { success: true, user: anonymousUser };
    } catch (error) {
      console.error('Error starting anonymous session:', error);
      showNotification('Error', 'Could not start anonymous session');
      
      return { 
        success: false, 
        error: error.message || 'Failed to start anonymous session' 
      };
    }
  };
  
  // Convert anonymous account to regular
  const convertAnonymousToRegular = async (email, password, username = null) => {
    try {
      if (!isAnonymous || !isAuthenticated) {
        throw new Error('You must be in anonymous mode to convert to a regular account');
      }
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Check if password is strong enough
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // Keep some data from anonymous account for continuity
      const regularUsername = username || user.username;
      
      // Use authService to convert anonymous user to registered user
      const response = await authService.convertAnonymousUser({
        username: regularUsername,
        email,
        password,
        name: regularUsername
      });
      
      // Save preferences
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Update state
      setUser(response.user);
      setIsAuthenticated(true);
      setIsAnonymous(false);
      
      // Show success notification
      showNotification(
        'Account Created', 
        `Welcome to HugMood, ${regularUsername}! Your anonymous data has been saved.`
      );
      
      return { success: true, user: response.user };
      
    } catch (error) {
      console.error('Error converting account:', error);
      
      // Show error notification
      showNotification('Conversion Failed', error.message || 'Unable to create account');
      
      return { 
        success: false, 
        error: error.message || 'Unable to create account'
      };
    }
  };
  
  // End anonymous session
  const endAnonymousSession = () => {
    if (isAnonymous) {
      // Use authService to end anonymous session
      authService.endAnonymousSession();
      
      // Clear additional anonymous data
      localStorage.removeItem('anonymousUserPreferences');
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
      setIsAnonymous(false);
      
      // Reset preferences
      setPreferences({
        notificationsEnabled: true,
        hapticFeedbackEnabled: true,
        darkMode: false,
        language: 'en',
        privacySettings: {
          shareMoodWithFriends: true,
          allowFriendRequests: true,
          showOnlineStatus: true,
          allowAnonymousHugs: true,
          dataSharing: 'friends-only'
        },
        accessibility: {
          reduceMotion: false,
          highContrast: false,
          fontSize: 'medium',
          useSystemSettings: true
        }
      });
      
      // Show notification
      showNotification('Anonymous Session Ended', 'Your anonymous session has been ended');
    }
  };
  
  // Update user state after authentication
  const updateUserState = (userData, token, isAnonymousUser = false) => {
    if (!userData) {
      console.error('Cannot update user state: No user data provided');
      return;
    }
    
    // Update context state
    setUser(userData);
    setIsAuthenticated(true);
    setIsAnonymous(isAnonymousUser);
    
    // If transitioning from anonymous to regular account, update preferences
    if (isAnonymous && !isAnonymousUser) {
      // Transfer preferences from anonymous to regular
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
    
    // Show welcome notification
    const welcomeMessage = isAnonymousUser 
      ? 'You\'re browsing anonymously.'
      : `Welcome${userData.fullName ? `, ${userData.fullName}` : ''}!`;
      
    showNotification(
      isAnonymousUser ? 'Anonymous Mode' : 'Login Successful', 
      welcomeMessage
    );
  };
  
  // Handle social authentication
  const socialAuth = async (provider, userData) => {
    try {
      // Use authService for social authentication
      const response = await authService.socialLogin(provider, userData);
      
      // Update state with user data from authService
      setUser(response.user);
      setIsAuthenticated(true);
      setIsAnonymous(false);
      
      // Show success notification
      showNotification('Login Successful', `Welcome, ${response.user.username}!`);
      
      return { success: true, user: response.user };
      
    } catch (error) {
      console.error(`${provider} login error:`, error);
      
      // Show error notification
      showNotification('Login Failed', error.message || `${provider} authentication failed`);
      
      return { 
        success: false, 
        error: error.message || `${provider} authentication failed`
      };
    }
  };
  
  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      // Validate inputs
      if (!profileData) {
        throw new Error('No profile data provided');
      }
      
      // Make API request through apiRequest helper
      const updatedUser = await apiRequest('/user/profile', 'PUT', profileData);
      
      // Update user in context
      setUser(prev => ({ ...prev, ...updatedUser }));
      
      // Show success notification
      showNotification('Profile Updated', 'Your profile has been successfully updated');
      
      return { success: true, user: updatedUser };
      
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Show error notification
      showNotification('Update Failed', error.message || 'Unable to update profile');
      
      return { 
        success: false, 
        error: error.message || 'Unable to update profile'
      };
    }
  };
  
  // Update user preferences
  const updatePreferences = (newPreferences) => {
    try {
      // Merge with existing preferences to avoid losing properties
      const updatedPreferences = {
        ...preferences,
        ...newPreferences
      };
      
      // Update state
      setPreferences(updatedPreferences);
      
      // Save to storage based on account type
      if (isAnonymous) {
        localStorage.setItem('anonymousUserPreferences', JSON.stringify(updatedPreferences));
      } else {
        localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Preferences update error:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Connect social account
  const connectSocialAccount = async (provider, token) => {
    try {
      // This would connect a social account to an existing account
      if (!isAuthenticated) {
        throw new Error('You must be logged in to connect a social account');
      }
      
      // Make API request
      const result = await apiRequest('/user/social-connect', 'POST', {
        provider,
        token
      });
      
      // Update social connections
      const newConnections = [...socialConnections, { provider, connected: true, date: new Date().toISOString() }];
      setSocialConnections(newConnections);
      localStorage.setItem('socialConnections', JSON.stringify(newConnections));
      
      // Show success notification
      showNotification('Account Connected', `Your ${provider} account has been connected`);
      
      return { success: true };
      
    } catch (error) {
      console.error('Social connect error:', error);
      
      // Show error notification
      showNotification('Connection Failed', error.message || `Unable to connect ${provider} account`);
      
      return { 
        success: false, 
        error: error.message || `Unable to connect ${provider} account`
      };
    }
  };
  
  // Provide all context values
  const contextValue = {
    user,
    isAuthenticated,
    isAnonymous,
    isLoading,
    preferences,
    socialConnections,
    lastVisited,
    login,
    register,
    logout: handleLogout,
    startAnonymousSession,
    endAnonymousSession,
    convertAnonymousToRegular,
    updateUserState,
    socialAuth,
    updateProfile,
    updatePreferences,
    connectSocialAccount
  };
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};