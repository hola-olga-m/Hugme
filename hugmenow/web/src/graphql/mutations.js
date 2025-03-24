import { gql } from '@apollo/client';

// Auth mutations
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

// User mutations
export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
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
  mutation RemoveUser {
    removeUser
  }
`;

// Mood mutations
export const CREATE_MOOD = gql`
  mutation CreateMood($createMoodInput: CreateMoodInput!) {
    createMood(createMoodInput: $createMoodInput) {
      id
      score
      note
      isPublic
      createdAt
      user {
        id
        name
      }
    }
  }
`;

export const UPDATE_MOOD = gql`
  mutation UpdateMood($updateMoodInput: UpdateMoodInput!) {
    updateMood(updateMoodInput: $updateMoodInput) {
      id
      score
      note
      isPublic
      updatedAt
    }
  }
`;

export const REMOVE_MOOD = gql`
  mutation RemoveMood($id: ID!) {
    removeMood(id: $id)
  }
`;

// Hug mutations
export const SEND_HUG = gql`
  mutation SendHug($sendHugInput: SendHugInput!) {
    sendHug(sendHugInput: $sendHugInput) {
      id
      type
      message
      isRead
      createdAt
      recipient {
        id
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

// Hug Request mutations
export const CREATE_HUG_REQUEST = gql`
  mutation CreateHugRequest($createHugRequestInput: CreateHugRequestInput!) {
    createHugRequest(createHugRequestInput: $createHugRequestInput) {
      id
      message
      isCommunityRequest
      status
      createdAt
      recipient {
        id
        name
      }
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

export const CANCEL_HUG_REQUEST = gql`
  mutation CancelHugRequest($id: ID!) {
    cancelHugRequest(id: $id) {
      id
      status
    }
  }
`;