import { gql } from '@apollo/client';

// Query for public moods
export const GET_PUBLIC_MOODS = gql`
  query publicMoods($first: Int, $offset: Int) {
    allMoods(first: $first, offset: $offset, condition: { isPublic: true }) {
      nodes {
        id
        intensity
        note
        createdAt
        userByUserId {
          id
          name
          username
          avatarUrl
        }
      }
    }
  }
`;

// Query for a user's moods
export const GET_USER_MOODS = gql`
  query userMoods($userId: UUID, $first: Int, $offset: Int) {
    allMoods(
      first: $first, 
      offset: $offset, 
      condition: { userId: $userId }
    ) {
      nodes {
        id
        intensity
        note
        createdAt
        isPublic
      }
    }
  }
`;

// Query for mood streak for a user
export const GET_MOOD_STREAK = gql`
  query moodStreak($userId: UUID!) {
    userById(id: $userId) {
      id
      moodsByUserId {
        totalCount
      }
    }
  }
`;

// Query for community hug requests
export const GET_COMMUNITY_HUG_REQUESTS = gql`
  query communityHugRequests($first: Int, $offset: Int) {
    allHugRequests(first: $first, offset: $offset) {
      nodes {
        id
        message
        createdAt
        userByRequesterId {
          id
          name
          username
          avatarUrl
        }
      }
    }
  }
`;

// Query for a user's received hugs
export const GET_RECEIVED_HUGS = gql`
  query receivedHugs($userId: UUID!, $first: Int, $offset: Int) {
    allHugs(
      first: $first, 
      offset: $offset, 
      condition: { recipientId: $userId }
    ) {
      nodes {
        id
        message
        createdAt
        isRead
        userBySenderId {
          id
          name
          username
          avatarUrl
        }
      }
    }
  }
`;

// Query for a user's sent hugs
export const GET_SENT_HUGS = gql`
  query sentHugs($userId: UUID!, $first: Int, $offset: Int) {
    allHugs(
      first: $first, 
      offset: $offset, 
      condition: { senderId: $userId }
    ) {
      nodes {
        id
        message
        createdAt
        userByRecipientId {
          id
          name
          username
          avatarUrl
        }
      }
    }
  }
`;

// Query for a user's pending hug requests
export const GET_PENDING_HUG_REQUESTS = gql`
  query pendingHugRequests($userId: UUID!) {
    allHugRequests(
      condition: { 
        requesterId: $userId,
        status: "PENDING"
      }
    ) {
      nodes {
        id
        message
        createdAt
        userByRequesterId {
          id
          name
          username
        }
      }
    }
  }
`;