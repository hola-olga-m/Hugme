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
    console.log('Beginning registration process with userData:', {
      username: userData.username,
      email: userData.email,
      hasPassword: !!userData.password
    });

    try {
      // Create an AbortController with a longer timeout for registration
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn('Registration request timeout after 20 seconds');
        controller.abort();
      }, 20000); // 20 second timeout for registration

      const response = await fetchWithRetry(`${API_BASE_URL}/register`, { //Corrected API_URL to API_BASE_URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registerInput: userData }),
        signal: controller.signal
      }, 3, 2000); // 3 retries with 2 second initial delay

      // Clear the timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = 'Server error during registration';

        try {
          const errorData = await response.json();
          console.error('Registration error response:', errorData);

          // Check for specific error messages about unique constraints
          if (errorData.message && (
            errorData.message.includes('already exists') || 
            errorData.message.includes('unique constraint')
          )) {
            errorMessage = 'This username or email is already registered. Please try a different one.';
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } catch (parseError) {
          // If we can't parse the JSON, use status code for better error message
          console.error('Could not parse error response:', parseError);

          if (response.status === 504) {
            errorMessage = 'Server timeout during registration. The server took too long to respond.';
          } else if (response.status >= 500) {
            errorMessage = `Server error (${response.status}) during registration. The server encountered an issue.`;
          } else if (response.status === 429) {
            errorMessage = 'Too many registration attempts. Please try again later.';
          } else {
            errorMessage = `Registration failed with status code: ${response.status}`;
          }
        }

        throw new Error(errorMessage);
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
        throw new Error('Registration request timed out. The server took too long to respond. Please try again later.');
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
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include'
      });

      // If the server returns a 404 (no logout endpoint) or other error,
      // we still want to consider the client-side logout successful
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('Logout endpoint not found, continuing with client-side logout');
          return { success: true, message: 'Logged out on client' };
        }
        console.warn(`Logout API returned status ${response.status}, continuing with client-side logout`);
        return { success: true, message: 'Logged out on client despite server error' };
      }

      return handleResponse(response);
    } catch (error) {
      console.warn('Error during logout API call, continuing with client-side logout:', error);
      // Return a successful result despite the API error
      return { success: true, message: 'Logged out on client only' };
    }
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

//Assuming fetchWithRetry function exists elsewhere and handles retries.  This needs to be added to the file for the code to work.
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying fetch after error: ${error.message}, ${retries} retries remaining`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2); //Exponential backoff
    }
    throw error;
  }
}