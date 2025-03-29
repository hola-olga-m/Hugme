/**
 * GraphQL Service
 * 
 * Provides a unified API for all GraphQL operations,
 * leveraging the graphqlBridge for communication.
 */

// Initialize the GraphQL service
let initialized = false;
let authToken = null;

/**
 * Initialize the GraphQL service
 * @param {Object} options - Initialization options
 */
export const initialize = (options = {}) => {
  // Prevent multiple initializations
  if (initialized) {
    console.log('GraphQL service already initialized');
    return;
  }
  
  console.log('Initializing GraphQL client (HTTP only)');
  
  // Use the global graphqlBridge if available
  if (window.graphqlService && window.graphqlService.initialized) {
    console.log('GraphQL service initializing via bridge');
    
    // Set auth token if provided
    if (options.token) {
      setAuthToken(options.token);
    }
    
    initialized = true;
  } else {
    console.error('GraphQL bridge or service not available');
  }
};

/**
 * Set the authentication token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  authToken = token;
  
  // Pass to the global graphqlService
  if (window.graphqlService && window.graphqlService.setAuthToken) {
    window.graphqlService.setAuthToken(token);
  }
};

/**
 * Clear the authentication token
 */
export const clearAuthToken = () => {
  authToken = null;
  
  // Pass to the global graphqlService
  if (window.graphqlService && window.graphqlService.clearAuthToken) {
    window.graphqlService.clearAuthToken();
  }
};

/**
 * Get the current authentication token
 * @returns {string|null} The JWT token
 */
export const getAuthToken = () => authToken;

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => !!authToken;

/**
 * Execute a GraphQL query
 * @param {string} query - The GraphQL query string
 * @param {Object} variables - Variables for the query
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Object>} Query results
 */
export const executeQuery = async (query, variables = {}, options = {}) => {
  return executeOperation('query', query, variables, options);
};

/**
 * Execute a GraphQL mutation
 * @param {string} mutation - The GraphQL mutation string
 * @param {Object} variables - Variables for the mutation
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Object>} Mutation results
 */
export const executeMutation = async (mutation, variables = {}, options = {}) => {
  return executeOperation('mutation', mutation, variables, options);
};

/**
 * Execute a GraphQL operation (internal)
 * @param {string} operationType - Type of operation (query, mutation, subscription)
 * @param {string} operationString - The GraphQL operation string
 * @param {Object} variables - Variables for the operation
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Object>} Operation results
 */
async function executeOperation(operationType, operationString, variables = {}, options = {}) {
  if (!initialized) {
    initialize();
  }
  
  if (!window.graphqlService) {
    throw new Error('GraphQL service not available');
  }
  
  try {
    if (operationType === 'query') {
      return await window.graphqlService.executeQuery(operationString, variables);
    } else if (operationType === 'mutation') {
      return await window.graphqlService.executeMutation(operationString, variables);
    } else {
      throw new Error(`Unsupported operation type: ${operationType}`);
    }
  } catch (error) {
    console.error(`GraphQL ${operationType} error:`, error);
    throw error;
  }
}

// Predefined GraphQL queries
export const queries = {
  /**
   * Verify an authentication token
   * @param {string} token - JWT token to verify
   * @returns {Promise<Object>} Verification result
   */
  verifyToken: (token) => {
    const query = `
      query VerifyToken($token: String!) {
        verifyToken(token: $token) {
          valid
          userId
          username
        }
      }
    `;
    
    return executeQuery(query, { token });
  },
  
  /**
   * Verify a password reset token
   * @param {string} token - Reset token to verify
   * @returns {Promise<Object>} Verification result
   */
  verifyResetToken: (token) => {
    const query = `
      query VerifyResetToken($token: String!) {
        verifyResetToken(token: $token) {
          isValid
          email
          expiresAt
        }
      }
    `;
    
    return executeQuery(query, { token });
  },
  
  /**
   * Get social authentication URL
   * @param {string} provider - Social provider (google, facebook, apple)
   * @param {string} redirectUri - Redirect URI after authentication
   * @returns {Promise<Object>} Auth URL information
   */
  getSocialAuthUrl: (provider, redirectUri) => {
    const query = `
      query GetSocialAuthUrl($provider: String!, $redirectUri: String!) {
        getSocialAuthUrl(provider: $provider, redirectUri: $redirectUri)
      }
    `;
    
    return executeQuery(query, { provider, redirectUri });
  },
  
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  getCurrentUser: () => {
    const query = `
      query GetCurrentUser {
        currentUser {
          id
          username
          email
          name
          isOnline
          lastActive
          createdAt
        }
      }
    `;
    
    return executeQuery(query);
  },
  
  /**
   * Get detailed user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile with mood history and stats
   */
  getUserProfile: (userId) => {
    const query = `
      query GetUserProfile($userId: ID!) {
        user(id: $userId) {
          id
          username
          name
          isOnline
          lastActive
          bio
          avatarUrl
          currentMood {
            mood
            note
            createdAt
          }
          stats {
            moodCount
            hugsSent
            hugsReceived
            currentStreak
            longestStreak
          }
        }
      }
    `;
    
    return executeQuery(query, { userId });
  },
  
  /**
   * Get mood history
   * @param {string} userId - User ID
   * @param {number} limit - Max number of entries
   * @param {number} offset - Pagination offset
   * @returns {Promise<Object>} Mood history
   */
  getMoodHistory: (userId, limit = 10, offset = 0) => {
    const query = `
      query GetMoodHistory($userId: ID!, $limit: Int, $offset: Int) {
        moodHistory(userId: $userId, limit: $limit, offset: $offset) {
          items {
            id
            mood
            note
            isPublic
            createdAt
          }
          totalCount
          hasMore
        }
      }
    `;
    
    return executeQuery(query, { userId, limit, offset });
  },
  
  /**
   * Get mood analytics
   * @param {string} userId - User ID
   * @param {number} timeRange - Time range in days
   * @returns {Promise<Object>} Mood analytics data
   */
  getMoodAnalytics: (userId, timeRange = 30) => {
    const query = `
      query GetMoodAnalytics($userId: ID!, $timeRange: Int) {
        moodAnalytics(userId: $userId, timeRange: $timeRange) {
          frequency {
            mood
            count
            percentage
          }
          byDayOfWeek {
            day
            averageScore
            mostFrequentMood
          }
          byTimeOfDay {
            timeSlot
            averageScore
            mostFrequentMood
          }
          trends {
            overall
            weekOverWeek
            monthOverMonth
          }
          insights {
            type
            message
            score
          }
          recommendations {
            type
            message
            priority
          }
        }
      }
    `;
    
    return executeQuery(query, { userId, timeRange });
  },
  
  /**
   * Get community feed
   * @param {number} limit - Max number of items
   * @param {number} offset - Pagination offset
   * @returns {Promise<Object>} Community feed
   */
  getCommunityFeed: (limit = 10, offset = 0) => {
    const query = `
      query GetCommunityFeed($limit: Int, $offset: Int) {
        communityFeed(limit: $limit, offset: $offset) {
          items {
            id
            type
            userId
            username
            content
            mood
            createdAt
          }
          totalCount
          hasMore
        }
      }
    `;
    
    return executeQuery(query, { limit, offset });
  }
};

// Predefined GraphQL mutations
export const mutations = {
  /**
   * Log in user
   * @param {string} email - Email or username
   * @param {string} password - Password
   * @returns {Promise<Object>} Login result with token
   */
  login: (email, password) => {
    const mutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            username
            email
            name
          }
        }
      }
    `;
    
    return executeMutation(mutation, { email, password });
  },
  
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result with token
   */
  register: (userData) => {
    const mutation = `
      mutation Register($userData: UserInput!) {
        register(userData: $userData) {
          token
          user {
            id
            username
            email
            name
          }
        }
      }
    `;
    
    return executeMutation(mutation, { userData });
  },
  
  /**
   * Create a new mood entry
   * @param {Object} moodData - Mood data
   * @returns {Promise<Object>} Created mood entry
   */
  createMoodEntry: (moodData) => {
    const mutation = `
      mutation CreateMoodEntry($moodData: MoodInput!) {
        createMoodEntry(moodData: $moodData) {
          id
          mood
          note
          isPublic
          createdAt
          user {
            id
            username
          }
        }
      }
    `;
    
    return executeMutation(mutation, { moodData });
  },
  
  /**
   * Send a hug to another user
   * @param {Object} hugData - Hug data
   * @returns {Promise<Object>} Hug result
   */
  sendHug: (hugData) => {
    const mutation = `
      mutation SendHug($hugData: HugInput!) {
        sendHug(hugData: $hugData) {
          id
          type
          message
          createdAt
          sender {
            id
            username
          }
          recipient {
            id
            username
          }
        }
      }
    `;
    
    return executeMutation(mutation, { hugData });
  },
  
  /**
   * Request a hug
   * @param {Object} requestData - Request data
   * @returns {Promise<Object>} Request result
   */
  requestHug: (requestData) => {
    const mutation = `
      mutation RequestHug($requestData: HugRequestInput!) {
        requestHug(requestData: $requestData) {
          id
          message
          createdAt
          user {
            id
            username
          }
        }
      }
    `;
    
    return executeMutation(mutation, { requestData });
  },
  
  /**
   * Create a group hug
   * @param {Object} groupData - Group hug data
   * @returns {Promise<Object>} Group hug result
   */
  createGroupHug: (groupData) => {
    const mutation = `
      mutation CreateGroupHug($groupData: GroupHugInput!) {
        createGroupHug(groupData: $groupData) {
          id
          name
          message
          createdAt
          creator {
            id
            username
          }
          participants {
            id
            username
          }
        }
      }
    `;
    
    return executeMutation(mutation, { groupData });
  },
  
  /**
   * Follow a user
   * @param {string} userId - User ID to follow
   * @returns {Promise<Object>} Follow result
   */
  followUser: (userId) => {
    const mutation = `
      mutation FollowUser($userId: ID!) {
        followUser(userId: $userId) {
          success
          message
        }
      }
    `;
    
    return executeMutation(mutation, { userId });
  },
  
  /**
   * Unfollow a user
   * @param {string} userId - User ID to unfollow
   * @returns {Promise<Object>} Unfollow result
   */
  unfollowUser: (userId) => {
    const mutation = `
      mutation UnfollowUser($userId: ID!) {
        unfollowUser(userId: $userId) {
          success
          message
        }
      }
    `;
    
    return executeMutation(mutation, { userId });
  }
};

// Export default interface
export default {
  initialize,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  isAuthenticated,
  executeQuery,
  executeMutation,
  queries,
  mutations
};