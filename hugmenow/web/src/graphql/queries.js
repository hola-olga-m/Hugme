import { gql } from '@apollo/client';

// User related queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      name
      avatarUrl
      isAnonymous
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      email
      name
      avatarUrl
      isAnonymous
      createdAt
      updatedAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      name
      avatarUrl
      isAnonymous
    }
  }
`;

// Mood related queries
export const GET_USER_MOODS = gql`
  query GetUserMoods {
    userMoods {
      id
      score
      note
      isPublic
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

export const GET_PUBLIC_MOODS = gql`
  query GetPublicMoods {
    publicMoods {
      id
      score
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

export const GET_MOOD = gql`
  query GetMood($id: ID!) {
    mood(id: $id) {
      id
      score
      note
      isPublic
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

// Hug related queries
export const GET_SENT_HUGS = gql`
  query GetSentHugs {
    sentHugs {
      id
      type
      message
      isRead
      createdAt
      recipient {
        id
        name
        username
        avatarUrl
      }
    }
  }
`;

export const GET_RECEIVED_HUGS = gql`
  query GetReceivedHugs {
    receivedHugs {
      id
      type
      message
      isRead
      createdAt
      sender {
        id
        name
        username
        avatarUrl
      }
    }
  }
`;

export const GET_HUG = gql`
  query GetHug($id: ID!) {
    hug(id: $id) {
      id
      type
      message
      isRead
      createdAt
      sender {
        id
        name
        username
        avatarUrl
      }
      recipient {
        id
        name
        username
        avatarUrl
      }
    }
  }
`;

// Hug Request related queries
export const GET_MY_HUG_REQUESTS = gql`
  query GetMyHugRequests {
    myHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      respondedAt
      recipient {
        id
        name
        username
        avatarUrl
      }
    }
  }
`;

export const GET_PENDING_HUG_REQUESTS = gql`
  query GetPendingHugRequests {
    pendingHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      requester {
        id
        name
        username
        avatarUrl
      }
    }
  }
`;

export const GET_COMMUNITY_HUG_REQUESTS = gql`
  query GetCommunityHugRequests {
    communityHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      requester {
        id
        name
        username
        avatarUrl
      }
    }
  }
`;

export const GET_HUG_REQUEST = gql`
  query GetHugRequest($id: ID!) {
    hugRequest(id: $id) {
      id
      message
      isCommunityRequest
      status
      createdAt
      respondedAt
      requester {
        id
        name
        username
        avatarUrl
      }
      recipient {
        id
        name
        username
        avatarUrl
      }
    }
  }
`;

// Dashboard stats
export const GET_USER_STATS = gql`
  query GetUserStats {
    moodStreak
    userMoods {
      id
      score
      createdAt
    }
    sentHugs {
      id
      createdAt
    }
    receivedHugs {
      id
      createdAt
    }
  }
`;