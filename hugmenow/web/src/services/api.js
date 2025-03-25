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
 * Helper function to handle API response with error checking
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} Response data
 * @throws {Error} If response is not ok
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  
  return data;
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(anonymousData)
    });
    
    return handleResponse(response);
  }
};

/**
 * User API services
 */
export const userApi = {
  /**
   * Get current user info using auth token
   * @returns {Promise<Object>} Current user data
   */
  getCurrentUser: async () => {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
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
  user: userApi
};

export default apiService;