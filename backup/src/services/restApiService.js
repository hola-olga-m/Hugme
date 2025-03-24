/**
 * REST API Service
 * 
 * Provides a modern REST API client for communicating with the backend services
 * through GraphQL Mesh instead of WebSockets.
 */

import { getToken, isAuthenticated } from './authService';

// Base URL for API requests
const BASE_URL = process.env.REACT_APP_API_URL || '/api';
const MESH_URL = process.env.REACT_APP_MESH_URL || '/graphql';

// Default request options
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  credentials: 'include'
};

/**
 * Makes an API request with proper error handling and authentication
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    // Merge default options with provided options
    const requestOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    // Add authorization header if user is authenticated
    if (isAuthenticated()) {
      requestOptions.headers.Authorization = `Bearer ${getToken()}`;
    }

    // Make the request
    const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Check for error responses
      if (!response.ok) {
        const error = new Error(data.message || 'API request failed');
        error.status = response.status;
        error.data = data;
        throw error;
      }
      
      return data;
    } else {
      if (!response.ok) {
        const error = new Error('API request failed');
        error.status = response.status;
        throw error;
      }
      
      return await response.text();
    }
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Execute a GraphQL query through the Mesh endpoint
 * @param {string} query - The GraphQL query
 * @param {Object} variables - Variables for the query
 * @param {string} operationName - Optional operation name
 * @returns {Promise<Object>} Query response data
 */
export const graphqlRequest = async (query, variables = {}, operationName = null) => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables,
        operationName
      })
    };

    // Add authorization if available
    if (isAuthenticated()) {
      requestOptions.headers.Authorization = `Bearer ${getToken()}`;
    }

    const response = await fetch(MESH_URL, requestOptions);
    const data = await response.json();

    if (data.errors) {
      const error = new Error(data.errors[0].message);
      error.graphQLErrors = data.errors;
      throw error;
    }

    return data.data;
  } catch (error) {
    console.error('GraphQL request error:', error);
    throw error;
  }
};

/**
 * Update a user's mood
 * @param {Object} moodData - The mood data
 * @returns {Promise<Object>} The created mood
 */
export const updateMood = async (moodData) => {
  const query = `
    mutation CreateMood($input: CreateMoodInput!) {
      createMood(input: $input) {
        id
        value
        score
        note
        isPublic
        createdAt
      }
    }
  `;

  const variables = {
    input: {
      value: moodData.value,
      score: moodData.score || null,
      note: moodData.note || null,
      isPublic: moodData.isPublic || false,
      location: moodData.location || null,
      activities: moodData.activities || []
    }
  };

  return graphqlRequest(query, variables)
    .then(data => data.createMood);
};

/**
 * Get mood history for a user
 * @param {string} userId - The user ID
 * @param {string} period - Time period (7days, 30days, 90days, 1year)
 * @returns {Promise<Object>} Mood history data
 */
export const getMoodHistory = async (userId, period = '30days') => {
  const query = `
    query GetMoodHistory($userId: ID!, $period: String) {
      moodHistory(userId: $userId, period: $period) {
        days {
          date
          value
          score
          note
        }
        summary {
          averageScore
          moodFrequency {
            mood
            count
            percentage
          }
          startDate
          endDate
        }
      }
    }
  `;

  const variables = {
    userId,
    period
  };

  return graphqlRequest(query, variables)
    .then(data => data.moodHistory);
};

/**
 * Get advanced mood analytics
 * @param {string} userId - The user ID
 * @param {number} timeRange - Time range in days
 * @param {boolean} includeCorrelations - Whether to include correlations
 * @returns {Promise<Object>} Mood analytics data
 */
export const getMoodAnalytics = async (userId, timeRange = 30, includeCorrelations = true) => {
  const query = `
    query GetMoodAnalytics($userId: ID!, $timeRange: Int, $includeCorrelations: Boolean) {
      moodAnalytics(userId: $userId, timeRange: $timeRange, includeCorrelations: $includeCorrelations) {
        statistics {
          totalEntries
          uniqueMoods
          currentStreak
          longestStreak
          averageScore
          moodVariability
          dominantMood
          improvementTrend
        }
        metrics {
          moodFrequency
          moodByDayOfWeek {
            day
            average
            count
          }
          moodByTimeOfDay {
            period
            average
            count
          }
        }
        correlations @include(if: $includeCorrelations) {
          activities
          sleep
          weather
          screenTime
        }
        insights {
          id
          type
          title
          description
          priority
        }
        recommendations {
          type
          title
          description
          priority
        }
      }
    }
  `;

  const variables = {
    userId,
    timeRange,
    includeCorrelations
  };

  return graphqlRequest(query, variables)
    .then(data => data.moodAnalytics);
};

/**
 * Send a hug to another user
 * @param {Object} hugData - The hug data
 * @returns {Promise<Object>} The sent hug
 */
export const sendHug = async (hugData) => {
  const query = `
    mutation SendHug($input: SendHugInput!) {
      sendHug(input: $input) {
        id
        type
        message
        senderId
        recipientId
        createdAt
      }
    }
  `;

  const variables = {
    input: {
      recipientId: hugData.recipientId,
      type: hugData.type,
      message: hugData.message || null
    }
  };

  return graphqlRequest(query, variables)
    .then(data => data.sendHug);
};

/**
 * Request a hug from the community
 * @param {Object} requestData - The request data
 * @returns {Promise<Object>} The hug request
 */
export const requestHug = async (requestData) => {
  const query = `
    mutation RequestHug($input: HugRequestInput!) {
      requestHug(input: $input) {
        id
        message
        mood
        isPublic
        userId
        createdAt
      }
    }
  `;

  const variables = {
    input: {
      message: requestData.message,
      mood: requestData.mood,
      isPublic: requestData.isPublic || true
    }
  };

  return graphqlRequest(query, variables)
    .then(data => data.requestHug);
};

/**
 * Create a group hug
 * @param {Object} groupData - The group hug data
 * @returns {Promise<Object>} The created group
 */
export const createGroupHug = async (groupData) => {
  const query = `
    mutation CreateGroupHug($input: GroupHugInput!) {
      createGroupHug(input: $input) {
        id
        name
        description
        creatorId
        participants {
          userId
          joinedAt
        }
        createdAt
      }
    }
  `;

  const variables = {
    input: {
      name: groupData.name,
      description: groupData.description,
      invitedUserIds: groupData.invitedUserIds || []
    }
  };

  return graphqlRequest(query, variables)
    .then(data => data.createGroupHug);
};

/**
 * Get user profile with combined data
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
  const query = `
    query GetUserProfile($userId: ID!) {
      userProfile(userId: $userId) {
        user {
          id
          username
          displayName
          avatarUrl
          createdAt
        }
        moods {
          id
          value
          score
          createdAt
        }
        moodStreak {
          currentStreak
          longestStreak
        }
        sentHugs {
          id
          type
          createdAt
        }
        receivedHugs {
          id
          type
          createdAt
        }
      }
    }
  `;

  const variables = {
    userId
  };

  return graphqlRequest(query, variables)
    .then(data => data.userProfile);
};

/**
 * Get community feed
 * @param {number} limit - Maximum number of items
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Object>} Community feed data
 */
export const getCommunityFeed = async (limit = 20, offset = 0) => {
  const query = `
    query GetCommunityFeed($limit: Int, $offset: Int) {
      communityFeed(limit: $limit, offset: $offset) {
        items {
          type
          createdAt
          ... on MoodFeedItem {
            mood {
              id
              value
              note
              userId
              createdAt
            }
          }
          ... on HugFeedItem {
            hug {
              id
              type
              senderId
              recipientId
              createdAt
            }
          }
        }
        hasMore
      }
    }
  `;

  const variables = {
    limit,
    offset
  };

  return graphqlRequest(query, variables)
    .then(data => data.communityFeed);
};

/**
 * Follow or unfollow a user
 * @param {string} userId - Target user ID
 * @param {boolean} follow - Whether to follow (true) or unfollow (false)
 * @returns {Promise<Object>} Result of the operation
 */
export const toggleFollowUser = async (userId, follow = true) => {
  const query = `
    mutation ToggleFollowUser($userId: ID!, $follow: Boolean!) {
      toggleFollowUser(userId: $userId, follow: $follow) {
        success
        message
      }
    }
  `;

  const variables = {
    userId,
    follow
  };

  return graphqlRequest(query, variables)
    .then(data => data.toggleFollowUser);
};

/**
 * Share content to social platforms
 * @param {string} platform - Social platform name
 * @param {string} contentType - Type of content
 * @param {string} contentId - ID of the content
 * @param {string} text - Optional custom text
 * @returns {Promise<Object>} Sharing result
 */
export const shareToSocial = async (platform, contentType, contentId, text = null) => {
  const query = `
    mutation ShareToSocial($input: SocialShareInput!) {
      shareToSocial(input: $input) {
        success
        message
        url
      }
    }
  `;

  const variables = {
    input: {
      platform,
      contentType,
      contentId,
      text
    }
  };

  return graphqlRequest(query, variables)
    .then(data => data.shareToSocial);
};

/**
 * Track mood with activity in one operation
 * @param {Object} moodData - Mood data
 * @param {Object} activityData - Activity data
 * @returns {Promise<Object>} Result with mood and activity
 */
export const trackMoodWithActivity = async (moodData, activityData = null) => {
  const query = `
    mutation TrackMoodWithActivity($input: TrackMoodWithActivityInput!) {
      trackMoodWithActivity(input: $input) {
        mood {
          id
          value
          score
          createdAt
        }
        activity @include(if: $hasActivity) {
          id
          activityType
          duration
          createdAt
        }
      }
    }
  `;

  const variables = {
    input: {
      mood: {
        value: moodData.value,
        score: moodData.score || null,
        note: moodData.note || null,
        isPublic: moodData.isPublic || false
      },
      activity: activityData
    },
    hasActivity: !!activityData
  };

  return graphqlRequest(query, variables)
    .then(data => data.trackMoodWithActivity);
};

/**
 * Get a wellness dashboard with comprehensive data
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Dashboard data
 */
export const getWellnessDashboard = async (userId) => {
  const query = `
    query GetWellnessDashboard($userId: ID!) {
      wellnessDashboard(userId: $userId) {
        user {
          id
          username
          displayName
        }
        streak {
          currentStreak
          longestStreak
        }
        insights {
          id
          type
          title
          description
          priority
          isRead
        }
        analytics {
          statistics {
            totalEntries
            averageScore
            dominantMood
            improvementTrend
          }
        }
        recentActivities {
          id
          activityType
          duration
          createdAt
        }
      }
    }
  `;

  const variables = {
    userId
  };

  return graphqlRequest(query, variables)
    .then(data => data.wellnessDashboard);
};