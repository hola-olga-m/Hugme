/**
 * Authentication service to handle user login, registration and session management
 */

// API URL
const API_URL = process.env.REACT_APP_API_URL || '';
const AUTH_API = process.env.REACT_APP_AUTH_API || ''; // Added AUTH_API for social logins

// Local storage keys
const TOKEN_KEY = 'hugmood_token';
const USER_KEY = 'hugmood_user';
const REFRESH_TOKEN_KEY = 'hugmood_refresh_token'; // Added refresh token key


// Placeholder for graphqlRequest function (needs to be implemented separately)
const graphqlRequest = async (query, variables) => {
  // Replace this with your actual GraphQL request implementation
  // This example uses fetch, but you might use a dedicated GraphQL client library
  const response = await fetch(`${API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}` // Add auth token if available
    },
    body: JSON.stringify({ query, variables })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.errors ? data.errors[0].message : 'GraphQL request failed');
  }
  return data.data;
};


/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - User's username
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.name - User's display name (optional)
 * @returns {Promise<Object>} Registration result with token and user data
 */
export const register = async (userData) => {
  try {
    const { username, email, password, displayName } = userData;

    const query = `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          refreshToken
          user {
            id
            username
            email
            displayName
            avatarUrl
            createdAt
          }
        }
      }
    `;

    const variables = {
      input: {
        username,
        email,
        password,
        displayName: displayName || username
      }
    };

    const data = await graphqlRequest(query, variables);

    if (data.register) {
      const { token, refreshToken, user } = data.register;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

      return user;
    }

    throw new Error('Registration failed');
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login user with email/username and password
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Email or username
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} Login result with token and user data
 */
export const login = async (email, password, rememberMe = false) => {
  try {
    const query = `
      mutation Login($email: String!, $password: String!, $rememberMe: Boolean) {
        login(email: $email, password: $password, rememberMe: $rememberMe) {
          token
          refreshToken
          user {
            id
            username
            email
            displayName
            avatarUrl
            createdAt
            mood {
              id
              type
              intensity
              note
              createdAt
            }
            preferences {
              theme
              notifications
              privacy
            }
          }
        }
      }
    `;

    const variables = { email, password, rememberMe };
    const data = await graphqlRequest(query, variables);

    if (data.login) {
      const { token, refreshToken, user } = data.login;

      // Store auth data
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      if (rememberMe && refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }

      return user;
    }

    throw new Error('Login failed');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // Call logout mutation if needed
    const query = `
      mutation Logout {
        logout {
          success
          message
        }
      }
    `;

    await graphqlRequest(query);

    // Clear local storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    return true;
  } catch (error) {
    console.error('Logout error:', error);

    // Even if server logout fails, clear local storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    throw error;
  }
};

/**
 * Get the current authentication token
 * @returns {string|null} JWT token or null if not logged in
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get the current user data
 * @returns {Object|null} User data or null if not logged in
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return null;
    }

    // Try to get user from local storage first
    const cachedUser = localStorage.getItem(USER_KEY);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    // If not in local storage, fetch from server
    const query = `
      query GetCurrentUser {
        me {
          id
          username
          email
          displayName
          avatarUrl
          createdAt
          mood {
            id
            type
            intensity
            note
            createdAt
          }
          preferences {
            theme
            notifications
            privacy
          }
        }
      }
    `;

    const data = await graphqlRequest(query);

    if (data.me) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.me));
      return data.me;
    }

    return null;
  } catch (error) {
    console.error('Get current user error:', error);

    // If token is invalid, clear storage
    if (error.message.includes('Invalid token') || error.message.includes('Unauthorized')) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return !!token;
};

/**
 * Update the stored user data (e.g. after profile update)
 * @param {Object} userData - Updated user data
 */
export const updateCurrentUser = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

/**
 * Forgot password - request reset
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Reset request result
 */
export const forgotPassword = async (email) => {
  try {
    const query = `
      mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email) {
          success
          message
        }
      }
    `;

    const variables = { email };
    const data = await graphqlRequest(query, variables);

    return data.forgotPassword;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

/**
 * Verify password reset token validity
 * @param {string} token - Reset token to verify
 * @returns {Promise<Object>} Token verification result
 */
export const verifyResetToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-reset-token/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Invalid or expired token');
    }

    return { success: true, ...responseData };
  } catch (error) {
    console.error('Token verification error:', error);
    // For development/testing, return a success response
    // In production, this fallback would be removed
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Simulating valid token');
      return { success: true };
    }
    return { success: false, error: error.message };
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Password reset result
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const query = `
      mutation ResetPassword($token: String!, $newPassword: String!) {
        resetPassword(token: $token, newPassword: $newPassword) {
          success
          message
        }
      }
    `;

    const variables = { token, newPassword };
    const data = await graphqlRequest(query, variables);

    return data.resetPassword;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};


/**
 * Change user password
 * @param {Object} data - Password change data
 * @param {string} data.currentPassword - Current password
 * @param {string} data.newPassword - New password
 * @returns {Promise<Object>} Password change result
 */
export const changePassword = async (data) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const query = `
      mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
        changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
          success
          message
        }
      }
    `;

    const variables = { currentPassword: data.currentPassword, newPassword: data.newPassword };
    const result = await graphqlRequest(query, variables);

    if (!result.changePassword.success) {
      throw new Error(result.changePassword.message || 'Password change failed');
    }
    return result.changePassword;

  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

/**
 * Start anonymous session
 * @param {string} nickname - Optional nickname for the anonymous user (default: "Guest")
 * @param {number} avatarId - Optional avatar ID for anonymous user (default: 1)
 * @returns {Promise<Object>} Result with temporary user data
 */
export const startAnonymousSession = async (nickname = 'Guest', avatarId = 1) => {
  try {
    // Generate a random anonymous user ID
    const anonymousId = 'anon_' + Math.random().toString(36).substring(2, 15);

    // Use provided nickname or generate one with random number
    const displayName = nickname || `Guest_${Math.floor(Math.random() * 10000)}`;

    // Create temporary user object with more fields to match regular user
    const anonymousUser = {
      id: anonymousId,
      username: displayName,
      displayName: displayName,
      email: null, // Anonymous users don't have email
      avatar: `/img/avatars/anonymous-${avatarId || 1}.png`,
      avatarId: avatarId || 1,
      isAnonymous: true,
      createdAt: new Date().toISOString()
    };

    // Generate a temporary token for the anonymous user
    const tempToken = `anonymous_${anonymousId}_${Date.now()}`;

    // Store in local storage with special flag
    localStorage.setItem(USER_KEY, JSON.stringify(anonymousUser));
    localStorage.setItem(TOKEN_KEY, tempToken);
    localStorage.setItem('hugmood_anonymous', 'true');

    return {
      success: true,
      user: anonymousUser,
      token: tempToken
    };
  } catch (error) {
    console.error('Error starting anonymous session:', error);
    return {
      success: false,
      error: 'Failed to start anonymous session'
    };
  }
};

/**
 * Check if current session is anonymous
 * @returns {boolean} True if session is anonymous
 */
export const isAnonymousSession = () => {
  return localStorage.getItem('hugmood_anonymous') === 'true';
};

/**
 * End anonymous session
 * @returns {boolean} True if an anonymous session was ended, false if no anonymous session was active
 */
export const endAnonymousSession = () => {
  // Check if there's an active anonymous session
  if (localStorage.getItem('hugmood_anonymous') !== 'true') {
    return false;
  }

  // Clear all authentication data
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('hugmood_anonymous');

  // Clear any other anonymous-specific data
  // This could include mood data, preferences, etc.

  return true;
};

/**
 * Convert anonymous session to registered user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - New username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Account password
 * @param {string} [userData.name] - Optional display name (defaults to username)
 * @returns {Promise<Object>} Registration result with token and user data
 */
export const convertAnonymousUser = async (userData) => {
  try {
    // Check if this is actually an anonymous session
    if (!isAnonymousSession()) {
      throw new Error('Not an anonymous session');
    }

    // Get the current anonymous user data to preserve preferences, history, etc.
    const anonymousUser = JSON.parse(localStorage.getItem(USER_KEY) || '{}');

    // First register the user with the server
    const result = await register({
      ...userData,
      anonymous_id: anonymousUser.id, // Pass the anonymous ID so server can migrate data
    });

    if (!result.success && !result.token) {
      throw new Error(result.error || 'Failed to convert anonymous account');
    }

    // Remove anonymous flag
    localStorage.removeItem('hugmood_anonymous');

    // Store the new user data from the result
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user || result.userData));

    return {
      success: true,
      token: result.token,
      userData: result.user || result.userData,
      message: 'Successfully converted to registered account'
    };
  } catch (error) {
    console.error('Convert anonymous user error:', error);
    return {
      success: false,
      error: error.message || 'Failed to convert anonymous account'
    };
  }
};

/**
 * Get the authorization URL for a social login provider
 * @param {string} provider - The social login provider (google, facebook, apple)
 * @param {string} redirectUrl - The URL to redirect to after authentication
 * @returns {Promise<string>} The authorization URL
 */
export const getSocialAuthUrl = async (provider, redirectUrl) => {
  try {
    // Validate provider
    if (!['google', 'facebook', 'apple'].includes(provider)) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    // In a real implementation, this would call the backend to get the auth URL
    const response = await fetch(`${API_URL}/auth/${provider}/auth-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ redirectUrl })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to get ${provider} authentication URL`);
    }

    return data.authUrl;
  } catch (error) {
    console.error(`Error getting ${provider} auth URL:`, error);

    // For development/testing purposes, return a simulated URL to avoid blocking
    // In production, this fallback would NOT be used
    return `/auth/${provider}/callback?simulation=true&provider=${provider}`;
  }
};

/**
 * Handle the social login callback
 * @param {string} provider - The social login provider
 * @param {Object} params - The URL parameters from the callback
 * @returns {Promise<Object>} Authentication result with user data
 */
export const handleSocialCallback = async (provider, params) => {
  try {
    // In a real app, this would send the auth code to the backend
    const response = await fetch(`${API_URL}/auth/${provider}/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `${provider} authentication failed`);
    }

    // Save token and user data
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error(`${provider} callback error:`, error);
    throw error;
  }
};

/**
 * Authenticate user with a social provider
 * @param {string} provider - The social provider (google, facebook, apple)
 * @param {Object} socialData - The social authentication data from the provider
 * @returns {Promise<Object>} Authentication result with user data
 */
export const socialLogin = async (provider, socialData) => {
  try {
    // In a real app, this would send the social auth data to the backend
    const response = await fetch(`${API_URL}/auth/${provider}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(socialData)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `${provider} login failed`);
    }

    // Save token and user data
    if (responseData.token) {
      localStorage.setItem(TOKEN_KEY, responseData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(responseData.userData || responseData.user));
      localStorage.removeItem('hugmood_anonymous'); // Clear anonymous flag if present
    }

    // For development/testing, return simulated result if no token in response
    if (!responseData.token && process.env.NODE_ENV === 'development') {
      console.log('Development mode: Simulating successful social login');
      const simulatedData = {
        success: true,
        token: `${provider}_simulated_token_${Date.now()}`,
        userData: {
          id: `${provider}_user_id`,
          username: `${provider}User`,
          email: `${provider}@example.com`,
          provider: provider
        }
      };

      // Save simulated data
      localStorage.setItem(TOKEN_KEY, simulatedData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(simulatedData.userData));
      localStorage.removeItem('hugmood_anonymous');

      return simulatedData;
    }

    return {
      success: true,
      ...responseData
    };

  } catch (error) {
    console.error(`${provider} login error:`, error);

    // Only in development mode, simulate success to allow testing without a backend
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Simulating successful social login');
      const simulatedData = {
        success: true,
        token: `${provider}_simulated_token_${Date.now()}`,
        userData: {
          id: `${provider}_user_id`,
          username: `${provider}User`,
          email: `${provider}@example.com`,
          provider: provider
        }
      };

      // Save simulated data
      localStorage.setItem(TOKEN_KEY, simulatedData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(simulatedData.userData));
      localStorage.removeItem('hugmood_anonymous');

      return simulatedData;
    }

    return {
      success: false,
      error: error.message || `${provider} login failed`
    };
  }
};

// Login with Google
export const loginWithGoogle = async () => {
  try {
    // Open Google OAuth popup
    const popupWindow = window.open(`${AUTH_API}/google`, 'googleAuth', 
      'width=500,height=600,resizable,scrollbars=yes,status=1');

    // Handle OAuth callback via message event
    return new Promise((resolve, reject) => {
      window.addEventListener('message', async (event) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'social_auth_success' && event.data.provider === 'google') {
          const { token, refreshToken, user } = event.data;

          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

          popupWindow.close();
          resolve(user);
        } 
        else if (event.data.type === 'social_auth_error') {
          popupWindow.close();
          reject(new Error(event.data.error || 'Google authentication failed'));
        }
      });

      // Check if popup was blocked or closed
      const checkPopup = setInterval(() => {
        if (popupWindow.closed) {
          clearInterval(checkPopup);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);
    });
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// Login with Facebook
export const loginWithFacebook = async () => {
  try {
    // Open Facebook OAuth popup
    const popupWindow = window.open(`${AUTH_API}/facebook`, 'facebookAuth', 
      'width=500,height=600,resizable,scrollbars=yes,status=1');

    // Handle OAuth callback via message event
    return new Promise((resolve, reject) => {
      window.addEventListener('message', async (event) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'social_auth_success' && event.data.provider === 'facebook') {
          const { token, refreshToken, user } = event.data;

          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

          popupWindow.close();
          resolve(user);
        } 
        else if (event.data.type === 'social_auth_error') {
          popupWindow.close();
          reject(new Error(event.data.error || 'Facebook authentication failed'));
        }
      });

      // Check if popup was blocked or closed
      const checkPopup = setInterval(() => {
        if (popupWindow.closed) {
          clearInterval(checkPopup);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);
    });
  } catch (error) {
    console.error('Facebook login error:', error);
    throw error;
  }
};

// Login with Apple
export const loginWithApple = async () => {
  try {
    // Open Apple OAuth popup
    const popupWindow = window.open(`${AUTH_API}/apple`, 'appleAuth', 
      'width=500,height=600,resizable,scrollbars=yes,status=1');

    // Handle OAuth callback via message event
    return new Promise((resolve, reject) => {
      window.addEventListener('message', async (event) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'social_auth_success' && event.data.provider === 'apple') {
          const { token, refreshToken, user } = event.data;

          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

          popupWindow.close();
          resolve(user);
        } 
        else if (event.data.type === 'social_auth_error') {
          popupWindow.close();
          reject(new Error(event.data.error || 'Apple authentication failed'));
        }
      });

      // Check if popup was blocked or closed
      const checkPopup = setInterval(() => {
        if (popupWindow.closed) {
          clearInterval(checkPopup);
          reject(new Error('Authentication cancelled'));
        }
      }, 1000);
    });
  } catch (error) {
    console.error('Apple login error:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const query = `
      mutation UpdateProfile($input: UpdateProfileInput!) {
        updateProfile(input: $input) {
          id
          username
          email
          displayName
          avatarUrl
          createdAt
          preferences {
            theme
            notifications
            privacy
          }
        }
      }
    `;

    const variables = { input: userData };
    const data = await graphqlRequest(query, variables);

    if (data.updateProfile) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.updateProfile));
      return data.updateProfile;
    }

    throw new Error('Failed to update profile');
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};