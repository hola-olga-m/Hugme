import { gql } from '@apollo/client';

// User authentication queries
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
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
  mutation AnonymousLogin($nickname: String!) {
    anonymousLogin(nickname: $nickname) {
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
      bio
      isAnonymous
      createdAt
      updatedAt
      settings {
        theme
        language
        notifications
        privacy
      }
    }
  }
`;

// Dashboard stats
export const GET_USER_STATS = gql`
  query GetUserStats {
    userStats {
      moodStreak
      totalMoodEntries
      averageMoodScore
      highestMoodThisMonth
      lowestMoodThisMonth
      hugsSent
      hugsReceived
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
  query GetUserMoods($limit: Int, $offset: Int) {
    userMoods(limit: $limit, offset: $offset) {
      id
      score
      note
      tags
      createdAt
      updatedAt
    }
  }
`;

export const GET_PUBLIC_MOODS = gql`
  query GetPublicMoods($limit: Int, $offset: Int) {
    publicMoods(limit: $limit, offset: $offset) {
      id
      score
      note
      tags
      createdAt
      updatedAt
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
  query GetFriendsMoods($limit: Int) {
    friendsMoods(limit: $limit) {
      id
      score
      note
      isPublic
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
  mutation CreateMoodEntry($input: MoodInput!) {
    createMoodEntry(input: $input) {
      id
      score
      note
      tags
      createdAt
      updatedAt
    }
  }
`;

// Hug queries
export const GET_RECEIVED_HUGS = gql`
  query GetReceivedHugs($limit: Int, $offset: Int) {
    receivedHugs(limit: $limit, offset: $offset) {
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
  query GetSentHugs($limit: Int, $offset: Int) {
    sentHugs(limit: $limit, offset: $offset) {
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
  mutation SendHug($input: HugInput!) {
    sendHug(input: $input) {
      id
      type
      message
      isRead
      createdAt
      externalRecipient {
        type
        contact
      }
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
  mutation MarkHugAsRead($id: ID!) {
    markHugAsRead(id: $id) {
      id
      isRead
    }
  }
`;

// Community feed
export const GET_COMMUNITY_FEED = gql`
  query GetCommunityFeed($limit: Int, $offset: Int) {
    communityFeed(limit: $limit, offset: $offset) {
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
        tags
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

// User queries
export const GET_USERS = gql`
  query GetUsers($search: String, $limit: Int, $offset: Int) {
    users(search: $search, limit: $limit, offset: $offset) {
      id
      username
      name
      avatarUrl
      isAnonymous
      createdAt
    }
  }
`;

// Hug requests
export const GET_HUG_REQUESTS = gql`
  query GetHugRequests($status: String, $limit: Int, $offset: Int) {
    hugRequests(status: $status, limit: $limit, offset: $offset) {
      id
      message
      type
      status
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

export const GET_MY_HUG_REQUESTS = gql`
  query GetMyHugRequests($limit: Int, $offset: Int) {
    myHugRequests(limit: $limit, offset: $offset) {
      id
      message
      type
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_PENDING_HUG_REQUESTS = gql`
  query GetPendingHugRequests($limit: Int, $offset: Int) {
    pendingHugRequests(limit: $limit, offset: $offset) {
      id
      message
      type
      status
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

export const GET_COMMUNITY_HUG_REQUESTS = gql`
  query GetCommunityHugRequests($limit: Int, $offset: Int) {
    communityHugRequests(limit: $limit, offset: $offset) {
      id
      message
      type
      status
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

export const CREATE_HUG_REQUEST = gql`
  mutation CreateHugRequest($input: HugRequestInput!) {
    createHugRequest(input: $input) {
      id
      message
      type
      status
      createdAt
    }
  }
`;

export const RESPOND_TO_HUG_REQUEST = gql`
  mutation RespondToHugRequest($id: ID!, $accept: Boolean!) {
    respondToHugRequest(id: $id, accept: $accept) {
      id
      status
      updatedAt
    }
  }
`;