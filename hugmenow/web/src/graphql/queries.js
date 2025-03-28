/**
 * Legacy GraphQL queries
 * 
 * This file is kept for backward compatibility but should be considered deprecated.
 * All new components should use the Mesh SDK directly via the useMeshSdk hook.
 * 
 * @deprecated Use the Mesh SDK instead: import { useMeshSdk } from '../hooks/useMeshSdk'
 */

import { gql } from '@apollo/client';

// Replace all direct GraphQL query usage with the Mesh SDK
// This file only exists to prevent breaking changes during the transition

export const GET_PUBLIC_MOODS = gql`
  query GetPublicMoods {
    publicMoods {
      id
      intensity
      note
      createdAt
      user {
        id
        name
        username
        avatarUrl
      }
    }
  }
`;

export const GET_MOOD_STREAK = gql`
  query GetMoodStreak {
    moodStreak
  }
`;

export const GET_USER_MOODS = gql`
  query GetUserMoods {
    userMoods {
      id
      intensity
      note
      createdAt
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      name
      username
      email
      avatarUrl
      createdAt
    }
  }
`;