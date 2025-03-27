/**
 * REST API services for direct API calls to NestJS endpoints
 * This allows using both REST API and GraphQL endpoints based on needs
 */

/**
 * Base API URL - using relative path with Vite's proxy configuration
 * Matches the same base URL used in Apollo client
 */
export const API_BASE_URL = '';

/**
 * Helper function to create request headers with auth token
 * @returns {Object} Headers object
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Helper function to handle API response with error checking
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} Response data
 * @throws {Error} If response is not ok
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    // Try to parse error response
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If we can't parse the JSON, check if it's a network error
      if (response.status === 0 || response.status === 504 || response.status === 503) {
        // This is likely a network error or service unavailable
        throw new Error(`NetworkError: Server unavailable or connection failed - status ${response.status}`);
      }
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    // Special handling for authentication errors
    if (response.status === 401) {
      // Check if this is an expired token
      if (errorData.message && (
        errorData.message.includes('expired') || 
        errorData.message.includes('invalid') || 
        errorData.message.includes('token')
      )) {
        console.warn('Authentication token expired or invalid');
        // Custom error for token expiry
        throw new Error('AuthenticationExpired: Your session has expired, please login again');
      }
    }
    
    // Throw error with message from the server if available
    throw new Error(
      errorData.message || errorData.error || `HTTP error ${response.status}: ${response.statusText}`
    );
  }
  
  return response.json();
};

/**
 * Authentication API services
 */
export const authApi = {
  /**
   * Login with email and password using REST API
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Auth response with token and user
   */
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });
    
    return handleResponse(response);
  },
  
  /**
   * Register a new user using REST API
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Desired username
   * @param {string} userData.email - User email
   * @param {string} userData.name - User full name
   * @param {string} userData.password - User password
   * @param {string} [userData.avatarUrl] - Optional avatar URL
   * @returns {Promise<Object>} Auth response with token and user
   */
  register: async (userData) => {
    console.log('API Service: Register request to REST endpoint with data:', {
      username: userData.username,
      email: userData.email,
      name: userData.name,
      // Password omitted for security
      avatarUrl: userData.avatarUrl || '(not provided)'
    });
    
    // Ensure all required fields are present and properly formatted
    const registrationData = {
      username: userData.username,
      email: userData.email,
      name: userData.name,
      password: userData.password
    };
    
    // Include avatar URL if provided
    if (userData.avatarUrl) {
      registrationData.avatarUrl = userData.avatarUrl;
    }
    
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      console.log('Sending REST registration request to:', `${API_BASE_URL}/register`);
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Log response status before parsing
      console.log('Registration response status:', response.status, response.statusText);
      
      // Special handling for known server issues
      if (response.status === 500) {
        try {
          const errorData = await response.json();
          console.error('Server error during registration:', errorData);
          
          // Check if this is a duplicate key error (common for unique fields like username/email)
          if (errorData.message && (
            errorData.message.includes('duplicate') || 
            errorData.message.includes('already exists') ||
            errorData.message.includes('unique constraint')
          )) {
            throw new Error('This username or email is already registered. Please try a different one.');
          }
          
          throw new Error(errorData.message || 'Server error during registration');
        } catch (parseError) {
          // If we can't parse the JSON, throw a generic error
          console.error('Could not parse error response:', parseError);
          throw new Error('Server error during registration. Please try again later.');
        }
      }
      
      const result = await handleResponse(response);
      console.log('Registration successful, response:', {
        accessToken: result.accessToken ? '(token present)' : '(missing)',
        user: result.user ? { 
          id: result.user.id,
          username: result.user.username 
        } : '(missing user data)'
      });
      
      return result;
    } catch (error) {
      console.error('Error during registration:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Registration request timed out. Please check your connection and try again.');
      }
      
      // Enhance error messages with more details
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Could not connect to the server. Please check your internet connection.');
      }
      
      throw error;
    }
  },
  
  /**
   * Login anonymously using REST API
   * @param {Object} anonymousData - Anonymous user data
   * @param {string} anonymousData.nickname - Display name
   * @param {string} [anonymousData.avatarUrl] - Optional avatar URL
   * @returns {Promise<Object>} Auth response with token and user
   */
  anonymousLogin: async (anonymousData) => {
    const response = await fetch(`${API_BASE_URL}/anonymous-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nickname: anonymousData.nickname, 
        avatarUrl: anonymousData.avatarUrl 
      }),
      credentials: 'include'
    });
    
    return handleResponse(response);
  },
  
  /**
   * Logout current user
   * @returns {Promise<Object>} Logout response
   */
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include'
    });
    
    return handleResponse(response);
  },
  
  /**
   * Get current user info using auth token
   * @returns {Promise<Object>} Current user data
   */
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    });
    
    return handleResponse(response);
  },
  
  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    
    return handleResponse(response);
  },
  
  /**
   * Delete user account
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  deleteAccount: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include'
    });
    
    return handleResponse(response);
  }
};

/**
 * User API services
 */
export const userApi = {
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  getUserProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    });
    
    return handleResponse(response);
  },
  
  /**
   * Get all users
   * @returns {Promise<Array>} List of users
   */
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    });
    
    return handleResponse(response);
  }
};

/**
 * Mood API services
 */
export const moodApi = {
  /**
   * Create a new mood entry
   * @param {Object} moodData - Mood data
   * @returns {Promise<Object>} Created mood
   */
  createMood: async (moodData) => {
    const response = await fetch(`${API_BASE_URL}/moods`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(moodData),
      credentials: 'include'
    });
    
    return handleResponse(response);
  },
  
  /**
   * Get user mood streak
   * @returns {Promise<Object>} Mood streak data
   */
  getMoodStreak: async () => {
    const response = await fetch(`${API_BASE_URL}/moods/streak`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include'
    });
    
    return handleResponse(response);
  }
};

/**
 * API service factory
 * Allows retrieving API services by name
 */
export const apiService = {
  auth: authApi,
  user: userApi,
  mood: moodApi,
  
  // Method to get service by name
  get(serviceName) {
    switch(serviceName) {
      case 'auth': return this.auth;
      case 'user': return this.user;
      case 'mood': return this.mood;
      default: throw new Error(`Unknown API service: ${serviceName}`);
    }
  }
};