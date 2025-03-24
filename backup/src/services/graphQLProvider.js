/**
 * GraphQL Provider
 * 
 * This service encapsulates the GraphQL Mesh client functionality
 * and provides a simple interface for making GraphQL queries and mutations.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as graphqlClient from './graphqlClient';
import { getToken } from './authService';

// Create context
const GraphQLContext = createContext(null);

// Hook for using the GraphQL context
export const useGraphQL = () => useContext(GraphQLContext);

// GraphQL Provider component
export const GraphQLProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialize the GraphQL client on component mount
  useEffect(() => {
    const initializeGraphQL = async () => {
      try {
        // Get the current authentication token
        const token = getToken();

        // Initialize the GraphQL client
        await graphqlClient.initialize({
          token,
          enableSubscriptions: true
        });

        setIsInitialized(true);
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize GraphQL client:', err);
        setError(err);
        // Still mark as initialized, but not ready
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeGraphQL();
    }

    // Cleanup on unmount
    return () => {
      if (isInitialized) {
        graphqlClient.close();
      }
    };
  }, [isInitialized]);

  // Define context value
  const contextValue = {
    isReady,
    error,
    
    // Query function
    query: async (query, variables = {}, options = {}) => {
      if (!isReady) {
        throw new Error('GraphQL client not initialized');
      }
      
      try {
        return await graphqlClient.query(query, variables, options);
      } catch (err) {
        console.error('GraphQL query error:', err);
        throw err;
      }
    },
    
    // Mutation function
    mutate: async (mutation, variables = {}, options = {}) => {
      if (!isReady) {
        throw new Error('GraphQL client not initialized');
      }
      
      try {
        return await graphqlClient.mutate(mutation, variables, options);
      } catch (err) {
        console.error('GraphQL mutation error:', err);
        throw err;
      }
    },
    
    // Subscription function
    subscribe: (subscription, variables = {}, onData, onError) => {
      if (!isReady) {
        throw new Error('GraphQL client not initialized');
      }
      
      try {
        return graphqlClient.subscribe(subscription, variables, onData, onError);
      } catch (err) {
        console.error('GraphQL subscription error:', err);
        throw err;
      }
    },
    
    // Update auth token
    setAuthToken: (token) => {
      graphqlClient.setAuthToken(token);
    },
    
    // Clear auth token
    clearAuthToken: () => {
      graphqlClient.clearAuthToken();
    },
    
    // Reinitialize
    reinitialize: () => {
      setIsInitialized(false);
    }
  };

  return (
    <GraphQLContext.Provider value={contextValue}>
      {children}
    </GraphQLContext.Provider>
  );
};

// Example GraphQL operations for common tasks
export const operations = {
  // Auth operations
  LOGIN: `
    mutation Login($email: String!, $password: String!) {
      login(input: { email: $email, password: $password }) {
        token
        user {
          id
          username
          displayName
          email
        }
      }
    }
  `,
  
  REGISTER: `
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        token
        user {
          id
          username
          displayName
          email
        }
      }
    }
  `,
  
  VERIFY_TOKEN: `
    query VerifyToken {
      me {
        id
        username
        displayName
        email
      }
    }
  `,
  
  // Mood operations
  UPDATE_MOOD: `
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
  `,
  
  GET_MOOD_HISTORY: `
    query GetMoodHistory($userId: ID!, $limit: Int) {
      user(id: $userId) {
        moods(limit: $limit) {
          id
          value
          score
          note
          createdAt
        }
        moodStreak {
          currentStreak
          longestStreak
        }
      }
    }
  `,
  
  GET_MOOD_ANALYTICS: `
    query GetMoodAnalytics($userId: ID!, $timeRange: Int) {
      moodAnalytics(userId: $userId, timeRange: $timeRange) {
        statistics {
          totalEntries
          averageScore
          dominantMood
          improvementTrend
        }
        insights {
          id
          type
          title
          description
        }
      }
    }
  `,
  
  // Hug operations
  SEND_HUG: `
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
  `,
  
  REQUEST_HUG: `
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
  `,
  
  // Combined operations
  TRACK_MOOD_WITH_ACTIVITY: `
    mutation TrackMoodWithActivity($input: TrackMoodWithActivityInput!) {
      trackMoodWithActivity(input: $input) {
        mood {
          id
          value
          score
          note
          createdAt
        }
        activity {
          id
          type
          notes
        }
      }
    }
  `,
  
  USER_PROFILE: `
    query GetUserProfile($userId: ID!) {
      userProfile(userId: $userId) {
        user {
          id
          username
          displayName
          email
        }
        moods {
          id
          value
          score
          note
          createdAt
        }
        moodStreak {
          currentStreak
          longestStreak
        }
      }
    }
  `,
  
  COMMUNITY_FEED: `
    query GetCommunityFeed($limit: Int, $offset: Int) {
      communityFeed(limit: $limit, offset: $offset) {
        items {
          ... on MoodFeedItem {
            type
            mood {
              id
              value
              score
              user {
                id
                username
                displayName
              }
              createdAt
            }
          }
          ... on HugFeedItem {
            type
            hug {
              id
              type
              message
              sender {
                id
                username
                displayName
              }
              recipient {
                id
                username
                displayName
              }
              createdAt
            }
          }
        }
        hasMore
      }
    }
  `,
  
  WELLNESS_DASHBOARD: `
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
        }
        analytics {
          statistics {
            totalEntries
            averageScore
            dominantMood
          }
        }
      }
    }
  `
};

export default {
  GraphQLProvider,
  useGraphQL,
  operations
};