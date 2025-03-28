import { gql } from '@apollo/client';

// Mutation to create a mood entry
export const CREATE_MOOD = gql`
  mutation createMood($input: CreateMoodInput!) {
    createMood(input: $input) {
      mood {
        id
        intensity
        note
        createdAt
        isPublic
      }
    }
  }
`;

// Mutation to update a mood entry
export const UPDATE_MOOD = gql`
  mutation updateMood($updateMoodInput: UpdateMoodInput!) {
    updateMood(input: $updateMoodInput) {
      mood {
        id
        intensity
        note
        createdAt
        isPublic
      }
    }
  }
`;

// Mutation to remove a mood entry
export const REMOVE_MOOD = gql`
  mutation removeMood($id: ID!) {
    deleteMood(input: { id: $id }) {
      mood {
        id
      }
    }
  }
`;

// Mutation to send a hug to a user
export const SEND_HUG = gql`
  mutation sendHug($input: CreateHugInput!) {
    createHug(input: $input) {
      hug {
        id
        message
        createdAt
        userBySenderId {
          id
          name
        }
        userByRecipientId {
          id
          name
        }
      }
    }
  }
`;

// Mutation to create a community hug request
export const CREATE_HUG_REQUEST = gql`
  mutation createHugRequest($input: CreateHugRequestInput!) {
    createHugRequest(input: $input) {
      hugRequest {
        id
        message
        createdAt
        userByRequesterId {
          id
          name
        }
      }
    }
  }
`;

// Mutation to respond to a hug request
export const UPDATE_HUG_REQUEST = gql`
  mutation updateHugRequest($input: UpdateHugRequestInput!) {
    updateHugRequest(input: $input) {
      hugRequest {
        id
        status
        createdAt
      }
    }
  }
`;

// Mutation to respond to a hug request (alias for UPDATE_HUG_REQUEST)
export const RESPOND_TO_HUG_REQUEST = gql`
  mutation respondToHugRequest($input: UpdateHugRequestInput!) {
    updateHugRequest(input: $input) {
      hugRequest {
        id
        status
        createdAt
      }
    }
  }
`;

// Mutation to update a user's profile
export const UPDATE_USER = gql`
  mutation updateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        name
        username
        email
        avatarUrl
      }
    }
  }
`;

// Mutation to create a friendship (friend request)
export const CREATE_FRIENDSHIP = gql`
  mutation createFriendship($input: CreateFriendshipInput!) {
    createFriendship(input: $input) {
      friendship {
        id
        requesterId
        recipientId
        status
        createdAt
      }
    }
  }
`;

// Mutation to update a friendship status (accept/decline friend request)
export const UPDATE_FRIENDSHIP = gql`
  mutation updateFriendship($input: UpdateFriendshipInput!) {
    updateFriendship(input: $input) {
      friendship {
        id
        requesterId
        recipientId
        status
        updatedAt
      }
    }
  }
`;

// Mutation to mark a hug as read
export const MARK_HUG_AS_READ = gql`
  mutation updateHug($input: UpdateHugInput!) {
    updateHug(input: $input) {
      hug {
        id
        isRead
      }
    }
  }
`;

// Mutation to cancel a hug request
export const CANCEL_HUG_REQUEST = gql`
  mutation cancelHugRequest($id: ID!) {
    deleteHugRequest(input: { id: $id }) {
      hugRequest {
        id
      }
    }
  }
`;