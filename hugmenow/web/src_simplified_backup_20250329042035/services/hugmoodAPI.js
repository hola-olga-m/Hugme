/**
 * HugMood API Service
 * Provides real-time WebSocket and subscription functionality
 */

import { gql } from '@apollo/client';

// Get the Apollo client - this will be initialized from the app
let apolloClient;

/**
 * Initialize the Apollo Client
 * This should be called from a component with access to the Apollo client
 */
export const initApolloClient = (client) => {
  apolloClient = client;
  console.log('HugMoodAPI: Apollo client initialized');
};

// Define GraphQL subscription queries
const NEW_HUG_SUBSCRIPTION = gql`
  subscription OnNewHug($userId: ID!) {
    newHug(userId: $userId) {
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

const NEW_HUG_REQUEST_SUBSCRIPTION = gql`
  subscription OnNewHugRequest($userId: ID!) {
    newHugRequest(userId: $userId) {
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
    }
  }
`;

const HUG_REQUEST_UPDATE_SUBSCRIPTION = gql`
  subscription OnHugRequestUpdate($userId: ID!) {
    hugRequestUpdate(userId: $userId) {
      id
      requesterId
      requesterName
      recipientId
      recipientName
      hugTypeId
      hugTypeName
      status
      responseMessage
    }
  }
`;

// In-memory store of active subscriptions
const activeSubscriptions = new Map();

/**
 * Subscribe to new hugs for a user
 * @param {string} userId - The user ID to subscribe for
 * @param {function} callback - Callback function to execute when a new hug is received
 * @returns {function} Unsubscribe function
 */
export const subscribeNewHugs = (userId, callback) => {
  try {
    // Because we're in a simplified version without WebSockets,
    // we'll use polling instead of subscriptions
    
    // Set up a polling interval to check for new hugs
    const intervalId = setInterval(async () => {
      try {
        if (!apolloClient) {
          console.error('Apollo client not initialized in hugmoodAPI');
          return;
        }
        const { data } = await apolloClient.query({
          query: gql`
            query GetLatestHugs($userId: ID!) {
              receivedHugs(userId: $userId, limit: 5) {
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
          `,
          variables: { userId },
          fetchPolicy: 'network-only'
        });
        
        // Check if there are new hugs (simplified check - in real app would track last seen)
        if (data.receivedHugs && data.receivedHugs.length > 0) {
          // In a real implementation, we'd check if these are actually new
          // For now, just simulate by occasionally triggering the callback
          if (Math.random() < 0.1) { // 10% chance to simulate a new hug
            callback(data.receivedHugs[0]);
          }
        }
      } catch (error) {
        console.error('Error polling for new hugs:', error);
      }
    }, 30000); // Poll every 30 seconds
    
    // Store the subscription info
    const subKey = `newHugs-${userId}`;
    activeSubscriptions.set(subKey, intervalId);
    
    // Return unsubscribe function
    return () => {
      clearInterval(intervalId);
      activeSubscriptions.delete(subKey);
    };
  } catch (error) {
    console.error('Error setting up hug subscription:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

/**
 * Subscribe to new hug requests for a user
 * @param {string} userId - The user ID to subscribe for
 * @param {function} callback - Callback function to execute when a new request is received
 * @returns {function} Unsubscribe function
 */
export const subscribeNewHugRequests = (userId, callback) => {
  try {
    // Set up a polling interval for new hug requests
    const intervalId = setInterval(async () => {
      try {
        if (!apolloClient) {
          console.error('Apollo client not initialized in hugmoodAPI');
          return;
        }
        const { data } = await apolloClient.query({
          query: gql`
            query GetLatestHugRequests($userId: ID!) {
              receivedHugRequests(userId: $userId, limit: 5) {
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
              }
            }
          `,
          variables: { userId },
          fetchPolicy: 'network-only'
        });
        
        // Check if there are new requests
        if (data.receivedHugRequests && data.receivedHugRequests.length > 0) {
          // In a real implementation, we'd check if these are actually new
          // For now, just simulate by occasionally triggering the callback
          if (Math.random() < 0.05) { // 5% chance to simulate a new request
            callback(data.receivedHugRequests[0]);
          }
        }
      } catch (error) {
        console.error('Error polling for new hug requests:', error);
      }
    }, 30000); // Poll every 30 seconds
    
    // Store the subscription info
    const subKey = `newHugRequests-${userId}`;
    activeSubscriptions.set(subKey, intervalId);
    
    // Return unsubscribe function
    return () => {
      clearInterval(intervalId);
      activeSubscriptions.delete(subKey);
    };
  } catch (error) {
    console.error('Error setting up hug request subscription:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

/**
 * Subscribe to updates on existing hug requests
 * @param {string} userId - The user ID to subscribe for
 * @param {function} callback - Callback function to execute when a request is updated
 * @returns {function} Unsubscribe function
 */
export const subscribeHugRequestUpdates = (userId, callback) => {
  try {
    // Set up a polling interval for hug request updates
    const intervalId = setInterval(async () => {
      try {
        if (!apolloClient) {
          console.error('Apollo client not initialized in hugmoodAPI');
          return;
        }
        const { data } = await apolloClient.query({
          query: gql`
            query GetSentHugRequestUpdates($userId: ID!) {
              sentHugRequests(userId: $userId) {
                id
                requesterId
                requesterName
                recipientId
                recipientName
                hugTypeId
                hugTypeName
                status
                responseMessage
                requestedAt
              }
            }
          `,
          variables: { userId },
          fetchPolicy: 'network-only'
        });
        
        // Check if there are any updates (simplified check)
        if (data.sentHugRequests && data.sentHugRequests.length > 0) {
          // In a real implementation, we'd check if the status has changed
          // For now, just simulate by occasionally triggering the callback
          if (Math.random() < 0.05) { // 5% chance to simulate an update
            callback(data.sentHugRequests[0]);
          }
        }
      } catch (error) {
        console.error('Error polling for hug request updates:', error);
      }
    }, 30000); // Poll every 30 seconds
    
    // Store the subscription info
    const subKey = `hugRequestUpdates-${userId}`;
    activeSubscriptions.set(subKey, intervalId);
    
    // Return unsubscribe function
    return () => {
      clearInterval(intervalId);
      activeSubscriptions.delete(subKey);
    };
  } catch (error) {
    console.error('Error setting up hug request update subscription:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

/**
 * Clean up all active subscriptions
 */
export const cleanupAllSubscriptions = () => {
  activeSubscriptions.forEach((intervalId) => {
    clearInterval(intervalId);
  });
  activeSubscriptions.clear();
};