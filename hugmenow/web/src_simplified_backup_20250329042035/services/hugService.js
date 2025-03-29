/**
 * Hug Service
 * Handles all functionality related to sending, receiving and managing hugs
 */

import { gql, useApolloClient } from '@apollo/client';

// Get the Apollo client
let apolloClient;

/**
 * Initialize the Apollo Client
 * This should be called from a component with access to the Apollo client
 */
export const initApolloClient = (client) => {
  apolloClient = client;
  console.log('HugService: Apollo client initialized');
};

// GraphQL queries and mutations
const GET_HUG_TYPES = gql`
  query GetHugTypes {
    hugTypes {
      id
      name
      description
      icon
      color
      intensity
    }
  }
`;

const SEND_HUG = gql`
  mutation SendHug($recipientId: ID!, $hugTypeId: ID!, $message: String) {
    sendHug(recipientId: $recipientId, hugTypeId: $hugTypeId, message: $message) {
      id
      senderId
      recipientId
      hugTypeId
      message
      sentAt
      status
      senderName
      recipientName
      hugTypeName
    }
  }
`;

const REQUEST_HUG = gql`
  mutation RequestHug($recipientId: ID!, $hugTypeId: ID!, $message: String) {
    requestHug(recipientId: $recipientId, hugTypeId: $hugTypeId, message: $message) {
      id
      requesterId
      recipientId
      hugTypeId
      message
      requestedAt
      status
      requesterName
      recipientName
    }
  }
`;

const RESPOND_TO_REQUEST = gql`
  mutation RespondToHugRequest($requestId: ID!, $response: String!, $message: String) {
    respondToHugRequest(requestId: $requestId, response: $response, message: $message) {
      success
      message
      hug {
        id
        senderId
        recipientId
        hugTypeId
        message
        sentAt
        status
      }
    }
  }
`;

const GET_RECEIVED_HUGS = gql`
  query GetReceivedHugs($userId: ID!) {
    receivedHugs(userId: $userId) {
      id
      senderId
      senderName
      senderAvatar
      recipientId
      hugTypeId
      hugTypeName
      message
      sentAt
      status
    }
  }
`;

const GET_SENT_HUGS = gql`
  query GetSentHugs($userId: ID!) {
    sentHugs(userId: $userId) {
      id
      senderId
      recipientId
      recipientName
      recipientAvatar
      hugTypeId
      hugTypeName
      message
      sentAt
      status
    }
  }
`;

const GET_RECEIVED_REQUESTS = gql`
  query GetReceivedHugRequests($userId: ID!) {
    receivedHugRequests(userId: $userId) {
      id
      requesterId
      requesterName
      requesterAvatar
      recipientId
      hugTypeId
      hugTypeName
      message
      requestedAt
      status
      responseMessage
    }
  }
`;

const GET_SENT_REQUESTS = gql`
  query GetSentHugRequests($userId: ID!) {
    sentHugRequests(userId: $userId) {
      id
      requesterId
      recipientId
      recipientName
      recipientAvatar
      hugTypeId
      hugTypeName
      message
      requestedAt
      status
      responseMessage
    }
  }
`;

const CREATE_GROUP_HUG = gql`
  mutation CreateGroupHug($name: String!, $description: String, $hugTypeId: ID!, $duration: Int!) {
    createGroupHug(name: $name, description: $description, hugTypeId: $hugTypeId, duration: $duration) {
      id
      name
      description
      creatorId
      creatorName
      hugTypeId
      hugTypeName
      startedAt
      endsAt
      status
      participants {
        userId
        name
        avatar
        joinedAt
      }
    }
  }
`;

const JOIN_GROUP_HUG = gql`
  mutation JoinGroupHug($groupId: ID!) {
    joinGroupHug(groupId: $groupId) {
      success
      message
    }
  }
`;

const GET_ACTIVE_GROUP_HUGS = gql`
  query GetActiveGroupHugs($userId: ID!) {
    activeGroupHugs(userId: $userId) {
      id
      name
      description
      creatorId
      creatorName
      hugTypeId
      hugTypeName
      startedAt
      endsAt
      status
      participants {
        userId
        name
        avatar
        joinedAt
      }
    }
  }
`;

/**
 * Get all available hug types
 */
export const getHugTypes = async () => {
  try {
    if (!apolloClient) {
      console.error('Apollo client not initialized in hugService');
      return [];
    }
    
    const { data } = await apolloClient.query({
      query: GET_HUG_TYPES,
      fetchPolicy: 'network-only'
    });
    return data.hugTypes || [];
  } catch (error) {
    console.error('Error fetching hug types:', error);
    return [];
  }
};

/**
 * Send a hug to a user
 */
export const sendHug = async (recipientId, hugTypeId, message = null) => {
  try {
    if (!apolloClient) {
      console.error('Apollo client not initialized in hugService');
      throw new Error('Connection error. Please try again later.');
    }
    
    const { data } = await apolloClient.mutate({
      mutation: SEND_HUG,
      variables: {
        recipientId,
        hugTypeId,
        message
      }
    });
    return data.sendHug;
  } catch (error) {
    console.error('Error sending hug:', error);
    throw new Error(error.message || 'Failed to send hug. Please try again.');
  }
};

/**
 * Request a hug from a user
 */
export const requestHug = async ({ recipientId, hugTypeId, message }) => {
  try {
    if (!apolloClient) {
      console.error('Apollo client not initialized in hugService');
      throw new Error('Connection error. Please try again later.');
    }
    
    const { data } = await apolloClient.mutate({
      mutation: REQUEST_HUG,
      variables: {
        recipientId,
        hugTypeId,
        message
      }
    });
    return data.requestHug;
  } catch (error) {
    console.error('Error requesting hug:', error);
    throw new Error(error.message || 'Failed to request hug. Please try again.');
  }
};

/**
 * Respond to a hug request
 */
export const respondToHugRequest = async (requestId, response, message = null) => {
  try {
    if (!apolloClient) {
      console.error('Apollo client not initialized in hugService');
      throw new Error('Connection error. Please try again later.');
    }
    
    const { data } = await apolloClient.mutate({
      mutation: RESPOND_TO_REQUEST,
      variables: {
        requestId,
        response, // 'accept' or 'decline'
        message
      }
    });
    return data.respondToHugRequest;
  } catch (error) {
    console.error('Error responding to hug request:', error);
    throw new Error(error.message || 'Failed to respond to hug request. Please try again.');
  }
};

/**
 * Get hugs received by a user
 */
export const getReceivedHugs = async (userId) => {
  try {
    if (!apolloClient) {
      console.error('Apollo client not initialized in hugService');
      return [];
    }
    
    const { data } = await apolloClient.query({
      query: GET_RECEIVED_HUGS,
      variables: { userId },
      fetchPolicy: 'network-only'
    });
    return data.receivedHugs || [];
  } catch (error) {
    console.error('Error fetching received hugs:', error);
    return [];
  }
};

/**
 * Get hugs sent by a user
 */
export const getSentHugs = async (userId) => {
  try {
    if (!apolloClient) {
      console.error('Apollo client not initialized in hugService');
      return [];
    }
    
    const { data } = await apolloClient.query({
      query: GET_SENT_HUGS,
      variables: { userId },
      fetchPolicy: 'network-only'
    });
    return data.sentHugs || [];
  } catch (error) {
    console.error('Error fetching sent hugs:', error);
    return [];
  }
};

/**
 * Get hug requests received by a user
 */
export const getReceivedHugRequests = async (userId) => {
  try {
    if (!apolloClient) {
      console.error('Apollo client not initialized in hugService');
      return [];
    }
    
    const { data } = await apolloClient.query({
      query: GET_RECEIVED_REQUESTS,
      variables: { userId },
      fetchPolicy: 'network-only'
    });
    return data.receivedHugRequests || [];
  } catch (error) {
    console.error('Error fetching received hug requests:', error);
    return [];
  }
};

/**
 * Get hug requests sent by a user
 */
export const getSentHugRequests = async (userId) => {
  try {
    if (!apolloClient) {
      console.error('Apollo client not initialized in hugService');
      return [];
    }
    
    const { data } = await apolloClient.query({
      query: GET_SENT_REQUESTS,
      variables: { userId },
      fetchPolicy: 'network-only'
    });
    return data.sentHugRequests || [];
  } catch (error) {
    console.error('Error fetching sent hug requests:', error);
    return [];
  }
};

/**
 * Create a new group hug
 */
export const createGroupHug = async ({ name, description, hugTypeId, duration }) => {
  try {
    if (!apolloClient) {
      console.error('Apollo client not initialized in hugService');
      throw new Error('Connection error. Please try again later.');
    }
    
    const { data } = await apolloClient.mutate({
      mutation: CREATE_GROUP_HUG,
      variables: {
        name,
        description,
        hugTypeId,
        duration
      }
    });
    return data.createGroupHug;
  } catch (error) {
    console.error('Error creating group hug:', error);
    throw new Error(error.message || 'Failed to create group hug. Please try again.');
  }
};

/**
 * Join an existing group hug
 */
export const joinGroupHug = async (groupId) => {
  try {
    if (!apolloClient) {
      console.error('Apollo client not initialized in hugService');
      throw new Error('Connection error. Please try again later.');
    }
    
    const { data } = await apolloClient.mutate({
      mutation: JOIN_GROUP_HUG,
      variables: { groupId }
    });
    return data.joinGroupHug;
  } catch (error) {
    console.error('Error joining group hug:', error);
    throw new Error(error.message || 'Failed to join group hug. Please try again.');
  }
};

/**
 * Get active group hugs for a user
 */
export const getActiveGroupHugs = async (userId) => {
  try {
    if (!apolloClient) {
      console.error('Apollo client not initialized in hugService');
      return [];
    }
    
    const { data } = await apolloClient.query({
      query: GET_ACTIVE_GROUP_HUGS,
      variables: { userId },
      fetchPolicy: 'network-only'
    });
    return data.activeGroupHugs || [];
  } catch (error) {
    console.error('Error fetching active group hugs:', error);
    return [];
  }
};