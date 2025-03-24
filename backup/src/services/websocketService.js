/**
 * GraphQL service for real-time and request-based communication
 * This replaces the previous WebSocket-based approach with HTTP-based GraphQL
 */

// Message handlers for different message types
const messageHandlers = {};

// Polling interval IDs
const pollingIntervals = {};

// GraphQL endpoint
const GRAPHQL_ENDPOINT = '/graphql';

/**
 * Execute a GraphQL operation (query or mutation)
 * @param {string} query - The GraphQL query or mutation string
 * @param {Object} variables - Variables for the operation
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Object>} The operation result
 */
export const executeGraphQLOperation = async (query, variables = {}, token = null) => {
  try {
    // Prepare request headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Add authentication token if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Execute the GraphQL operation
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    // Parse the response
    const result = await response.json();
    
    // Check for GraphQL errors
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0].message);
    }
    
    console.log('GraphQL operation successful:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error executing GraphQL operation:', error);
    throw error;
  }
};

/**
 * Set up polling for real-time updates (simulating WebSocket subscriptions)
 * @param {string} messageType - The type of updates to poll for
 * @param {Object} options - Polling options
 * @param {number} options.interval - Polling interval in milliseconds
 * @param {function} options.queryBuilder - Function that returns the query string
 * @param {Object} options.variables - Variables for the GraphQL query
 * @param {string} options.resultKey - The key in the result containing the data
 * @param {function} options.onData - Function to call with new data
 * @param {string} options.token - Authentication token (optional)
 * @returns {string} The polling ID
 */
export const setupPolling = (messageType, options) => {
  const {
    interval = 10000,
    queryBuilder,
    variables = {},
    resultKey,
    onData,
    token = null
  } = options;
  
  // Generate a unique ID for this polling interval
  const pollingId = `${messageType}_${Date.now()}`;
  
  // Store the last result to avoid sending duplicates
  let lastResult = null;
  
  // Set up the polling interval
  pollingIntervals[pollingId] = setInterval(async () => {
    try {
      // Build the query
      const query = queryBuilder();
      
      // Execute the query
      const result = await executeGraphQLOperation(query, variables, token);
      
      // Extract the data
      const data = resultKey ? result[resultKey] : result;
      
      // If the data has changed, call the handler
      if (JSON.stringify(data) !== JSON.stringify(lastResult)) {
        lastResult = data;
        
        // Create a message in the same format as the old WebSocket system
        const message = {
          type: messageType,
          data
        };
        
        // Call the handler
        if (onData) {
          onData(message);
        }
        
        // Call any registered handlers
        if (messageHandlers[messageType]) {
          messageHandlers[messageType](message);
        }
      }
    } catch (error) {
      console.error(`Error polling for ${messageType}:`, error);
    }
  }, interval);
  
  console.log(`Set up polling for ${messageType} with ID ${pollingId}`);
  
  return pollingId;
};

/**
 * Stop polling for a specific ID
 * @param {string} pollingId - The polling ID to stop
 */
export const stopPolling = (pollingId) => {
  if (pollingIntervals[pollingId]) {
    clearInterval(pollingIntervals[pollingId]);
    delete pollingIntervals[pollingId];
    console.log(`Stopped polling for ID ${pollingId}`);
  }
};

/**
 * Stop all polling intervals
 */
export const stopAllPolling = () => {
  Object.keys(pollingIntervals).forEach(stopPolling);
  console.log('Stopped all polling intervals');
};

/**
 * Register a handler for messages of a specific type
 * @param {string} messageType - The type of message to handle
 * @param {function} handler - The handler function
 */
export const registerMessageHandler = (messageType, handler) => {
  messageHandlers[messageType] = handler;
  console.log(`Registered handler for message type: ${messageType}`);
};

/**
 * Send a message using GraphQL mutation
 * @param {Object} message - The message to send
 * @param {string} token - Authentication token (optional)
 * @returns {Promise<Object>} The operation result
 */
export const sendMessage = async (message, token = null) => {
  try {
    // Different mutations based on message type
    const operations = {
      'ping': {
        query: `mutation Ping { ping }`,
        variables: {},
        resultKey: 'ping'
      },
      'authenticate': {
        query: `
          mutation Authenticate($token: String, $method: String, $credentials: AuthCredentialsInput, $userData: UserRegistrationInput) {
            authenticate(token: $token, method: $method, credentials: $credentials, userData: $userData) {
              success
              token
              user {
                id
                username
                email
              }
            }
          }
        `,
        variables: {
          token: message.token,
          method: message.method,
          credentials: message.credentials,
          userData: message.userData
        },
        resultKey: 'authenticate'
      },
      'mood_update': {
        query: `
          mutation UpdateMood($input: MoodInput!) {
            updateMood(input: $input) {
              id
              mood
              intensity
              note
              createdAt
            }
          }
        `,
        variables: {
          input: {
            mood: message.mood,
            intensity: message.intensity,
            note: message.note,
            isPublic: message.isPublic
          }
        },
        resultKey: 'updateMood'
      },
      'send_hug': {
        query: `
          mutation SendHug($input: HugInput!) {
            sendHug(input: $input) {
              id
              type
              message
              sender {
                id
                username
              }
              recipient {
                id
                username
              }
              createdAt
            }
          }
        `,
        variables: {
          input: {
            recipientId: message.recipientId,
            type: message.hugType,
            message: message.message
          }
        },
        resultKey: 'sendHug'
      },
      'request_hug': {
        query: `
          mutation RequestHug($input: HugRequestInput!) {
            requestHug(input: $input) {
              id
              urgency
              message
              requester {
                id
                username
              }
              recipient {
                id
                username
              }
              createdAt
            }
          }
        `,
        variables: {
          input: {
            recipientId: message.recipientId,
            urgency: message.urgency,
            message: message.message
          }
        },
        resultKey: 'requestHug'
      },
      'fetch_data': {
        query: `
          query FetchData($dataType: String!, $filter: String, $limit: Int, $offset: Int) {
            fetchData(dataType: $dataType, filter: $filter, limit: $limit, offset: $offset) {
              ... on CommunityFeedResult {
                posts {
                  id
                  type
                  userId
                  username
                  userAvatar
                  timestamp
                  isAnonymous
                  likeCount
                  commentCount
                  data
                }
              }
              ... on MoodHistoryResult {
                entries {
                  id
                  mood
                  intensity
                  note
                  createdAt
                }
              }
              ... on UserProfileResult {
                user {
                  id
                  username
                  email
                  createdAt
                }
              }
            }
          }
        `,
        variables: {
          dataType: message.dataType,
          filter: message.filter,
          limit: message.limit,
          offset: message.offset
        },
        resultKey: 'fetchData'
      }
    };
    
    // Get the operation for this message type
    const operation = operations[message.type];
    
    if (!operation) {
      console.error(`No GraphQL operation defined for message type: ${message.type}`);
      return null;
    }
    
    // Execute the operation
    const result = await executeGraphQLOperation(operation.query, operation.variables, token);
    console.log(`GraphQL message sent (${message.type}):`, result);
    
    // Format the response like a WebSocket message for compatibility
    return {
      type: `${message.type}_response`,
      data: result[operation.resultKey]
    };
  } catch (error) {
    console.error('Error sending GraphQL message:', error);
    throw error;
  }
};