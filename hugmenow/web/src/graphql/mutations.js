import { gql } from '@apollo/client';

// Authentication mutations
export const LOGIN = gql`
  mutation login($loginInput: LoginInput!) {
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
  mutation register($registerInput: RegisterInput!) {
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
  mutation anonymousLogin($anonymousLoginInput: AnonymousLoginInput!) {
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

// User mutations
export const UPDATE_USER = gql`
  mutation updateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      username
      email
      name
      avatarUrl
      updatedAt
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeUser {
    removeUser
  }
`;

// Mood mutations
export const CREATE_MOOD = gql`
  mutation createMood($createMoodInput: CreateMoodInput!) {
    createMood(createMoodInput: $createMoodInput) {
      id
      score
      note
      isPublic
      createdAt
      userId
    }
  }
`;

export const UPDATE_MOOD = gql`
  mutation updateMood($updateMoodInput: UpdateMoodInput!) {
    updateMood(updateMoodInput: $updateMoodInput) {
      id
      score
      note
      isPublic
      createdAt
      userId
    }
  }
`;

export const REMOVE_MOOD = gql`
  mutation removeMood($id: ID!) {
    removeMood(id: $id)
  }
`;

// Hug mutations
export const SEND_HUG = gql`
  mutation sendHug($sendHugInput: SendHugInput!) {
    sendHug(sendHugInput: $sendHugInput) {
      id
      type
      message
      isRead
      createdAt
      senderId
      recipientId
    }
  }
`;

export const MARK_HUG_AS_READ = gql`
  mutation markHugAsRead($hugId: ID!) {
    markHugAsRead(hugId: $hugId) {
      id
      isRead
    }
  }
`;

// Hug Request mutations
export const CREATE_HUG_REQUEST = gql`
  mutation createHugRequest($createHugRequestInput: CreateHugRequestInput!) {
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
  mutation respondToHugRequest($respondToRequestInput: RespondToRequestInput!) {
    respondToHugRequest(respondToRequestInput: $respondToRequestInput) {
      id
      status
      respondedAt
    }
  }
`;

export const CANCEL_HUG_REQUEST = gql`
  mutation cancelHugRequest($requestId: ID!) {
    cancelHugRequest(requestId: $requestId) {
      id
      status
    }
  }
`;