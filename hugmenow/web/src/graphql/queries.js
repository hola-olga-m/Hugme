import { gql } from '@apollo/client';

// User authentication queries
export const LOGIN = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
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
  }
`;

export const REGISTER = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      accessToken
      user {
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
  }
`;

export const ANONYMOUS_LOGIN = gql`
  mutation AnonymousLogin($anonymousLoginInput: AnonymousLoginInput!) {
    anonymousLogin(anonymousLoginInput: $anonymousLoginInput) {
      accessToken
      user {
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
  }
`;

// User information
export const GET_USER_PROFILE = gql`
  query GetUserProfile {
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

// Dashboard stats - simplified version using individual queries
export const GET_USER_STATS = gql`
  query GetUserStats {
    userMoods {
      id
      score
    }
  }
`;

export const GET_USER_MOODS_COUNT = gql`
  query GetUserMoodsCount {
    userMoods {
      id
    }
  }
`;

export const GET_SENT_HUGS_COUNT = gql`
  query GetSentHugsCount {
    sentHugs {
      id
    }
  }
`;

export const GET_RECEIVED_HUGS_COUNT = gql`
  query GetReceivedHugsCount {
    receivedHugs {
      id
    }
  }
`;

export const GET_MOOD_STREAK = gql`
  query GetMoodStreak {
    moodStreak
  }
`;

// Mood queries
export const GET_USER_MOODS = gql`
  query GetUserMoods {
    userMoods {
      id
      score
      note
      createdAt
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
        username
        name
        avatarUrl
      }
    }
  }
`;

export const GET_FRIENDS_MOODS = gql`
  query GetFriendsMoods($limit: Float) {
    friendsMoods(limit: $limit) {
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

export const CREATE_MOOD_ENTRY = gql`
  mutation CreateMoodEntry($createMoodInput: CreateMoodInput!) {
    createMood(createMoodInput: $createMoodInput) {
      id
      score
      note
      createdAt
    }
  }
`;

// Hug queries
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
        username
        name
        avatarUrl
      }
    }
  }
`;

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
        username
        name
        avatarUrl
      }
    }
  }
`;

export const SEND_HUG = gql`
  mutation SendHug($sendHugInput: SendHugInput!) {
    sendHug(sendHugInput: $sendHugInput) {
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

export const MARK_HUG_AS_READ = gql`
  mutation MarkHugAsRead($hugId: ID!) {
    markHugAsRead(hugId: $hugId) {
      id
      isRead
    }
  }
`;

// Community feed API not yet implemented on server
// This query is commented out until server-side implementation is complete
/*
export const GET_COMMUNITY_FEED = gql`
  query GetCommunityFeed {
    communityFeed {
      id
      type
      content
      createdAt
      user {
        id
        username
        name
        avatarUrl
      }
      ... on MoodPost {
        score
      }
      ... on HugPost {
        hugType
        recipient {
          id
          username
          name
          avatarUrl
        }
      }
      ... on AchievementPost {
        achievementType
        title
        description
      }
    }
  }
`;
*/

// User queries
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      name
      avatarUrl
      isAnonymous
      createdAt
    }
  }
`;

// Hug requests API not yet fully implemented on server
// Using specific queries for different request types instead
/* 
export const GET_HUG_REQUESTS = gql`
  query GetHugRequests($status: String) {
    hugRequests(status: $status) {
      id
      message
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
*/

export const GET_MY_HUG_REQUESTS = gql`
  query GetMyHugRequests {
    myHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
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
        username
        name
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
        username
        name
        avatarUrl
      }
    }
  }
`;

export const CREATE_HUG_REQUEST = gql`
  mutation CreateHugRequest($createHugRequestInput: CreateHugRequestInput!) {
    createHugRequest(createHugRequestInput: $createHugRequestInput) {
      id
      message
      isCommunityRequest
      status
      createdAt
      requesterId
      recipientId
    }
  }
`;

export const RESPOND_TO_HUG_REQUEST = gql`
  mutation RespondToHugRequest($respondToRequestInput: RespondToRequestInput!) {
    respondToHugRequest(respondToRequestInput: $respondToRequestInput) {
      id
      status
      respondedAt
    }
  }
`;

export const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($createFriendshipInput: CreateFriendshipInput!) {
    sendFriendRequest(createFriendshipInput: $createFriendshipInput) {
      id
      requesterId
      recipientId
      status
      followsMood
      createdAt
      requester {
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

export const RESPOND_TO_FRIEND_REQUEST = gql`
  mutation RespondToFriendRequest($updateFriendshipInput: UpdateFriendshipInput!) {
    respondToFriendRequest(updateFriendshipInput: $updateFriendshipInput) {
      id
      status
      followsMood
      updatedAt
    }
  }
`;