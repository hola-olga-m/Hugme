import { gql } from '@apollo/client';

// User queries
export const GET_ME = gql`
  query me {
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
  query user($id: ID!) {
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
  query users {
    users {
      id
      username
      name
      avatarUrl
      isAnonymous
    }
  }
`;

// Mood queries
export const GET_USER_MOODS = gql`
  query userMoods {
    userMoods {
      id
      score
      note
      isPublic
      createdAt
      userId
    }
  }
`;

export const GET_PUBLIC_MOODS = gql`
  query publicMoods {
    publicMoods {
      id
      score
      note
      createdAt
      user {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

export const GET_MOOD = gql`
  query mood($id: ID!) {
    mood(id: $id) {
      id
      score
      note
      isPublic
      createdAt
      userId
    }
  }
`;

export const GET_MOOD_STREAK = gql`
  query moodStreak {
    moodStreak
  }
`;

// Hug queries
export const GET_SENT_HUGS = gql`
  query sentHugs {
    sentHugs {
      id
      type
      message
      isRead
      createdAt
      recipient {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

export const GET_RECEIVED_HUGS = gql`
  query receivedHugs {
    receivedHugs {
      id
      type
      message
      isRead
      createdAt
      sender {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

export const GET_HUG = gql`
  query hug($id: ID!) {
    hug(id: $id) {
      id
      type
      message
      isRead
      createdAt
      sender {
        id
        username
        name
      }
      recipient {
        id
        username
        name
      }
    }
  }
`;

// Hug Request queries
export const GET_MY_HUG_REQUESTS = gql`
  query myHugRequests {
    myHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      respondedAt
      recipient {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

export const GET_PENDING_HUG_REQUESTS = gql`
  query pendingHugRequests {
    pendingHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      requester {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

export const GET_COMMUNITY_HUG_REQUESTS = gql`
  query communityHugRequests {
    communityHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      requester {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

export const GET_HUG_REQUEST = gql`
  query hugRequest($id: ID!) {
    hugRequest(id: $id) {
      id
      message
      isCommunityRequest
      status
      createdAt
      respondedAt
      requester {
        id
        username
        name
        avatarUrl
      }
      recipient {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

// Stats queries
export const GET_USER_STATS = gql`
  query userStats {
    me {
      id
      receivedHugs {
        id
      }
      sentHugs {
        id
      }
    }
    moodStreak
  }
`;