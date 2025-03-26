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
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
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
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    
    return handleResponse(response);
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