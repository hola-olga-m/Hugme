/**
 * GraphQL Mesh SDK - Simplified Manual Implementation
 * 
 * This file provides a manually implemented SDK for GraphQL Mesh
 * that works with the HugMeNow API.
 */

// Import document snippets from gql-fragments
import { 
  USER_FRAGMENT,
  MOOD_FRAGMENT,
  HUG_FRAGMENT,
  HUG_REQUEST_FRAGMENT,
  FRIENDSHIP_FRAGMENT,
  MOOD_STREAK_FRAGMENT
} from './gql-fragments.js';

/**
 * Create an SDK instance for interacting with the GraphQL API
 * @param {Object} options - Configuration options
 * @param {string} options.baseUrl - The GraphQL API endpoint URL
 * @param {string} options.token - Authentication token (optional)
 * @param {Function} options.fetchFn - Custom fetch function (optional)
 * @returns {Object} SDK with query and mutation methods
 */
function getSdk(options = {}) {
  const { 
    baseUrl = '/graphql', 
    token = null,
    fetchFn = typeof fetch !== 'undefined' ? fetch : null
  } = options;

  // Use the provided fetch or try to find a global one
  const fetchImpl = fetchFn || global.fetch;
  if (!fetchImpl) {
    throw new Error('No fetch implementation found. Please provide a fetchFn option.');
  }

  /**
   * Execute a GraphQL query or mutation
   * @param {string} query - The GraphQL query/mutation string
   * @param {Object} variables - Variables for the query (optional)
   * @returns {Promise<Object>} The query results
   */
  async function executeQuery(query, variables = {}) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token is provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetchImpl(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
        credentials: 'include',
      });

      const result = await response.json();

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(result.errors[0].message);
      }

      return result.data;
    } catch (error) {
      console.error('Error executing GraphQL query:', error);
      throw error;
    }
  }

  // Return the SDK object with query and mutation methods
  return {
    // Auth operations
    async Login(loginInput) {
      return executeQuery(`
        mutation Login($loginInput: LoginInput!) {
          login(loginInput: $loginInput) {
            accessToken
            user {
              ${USER_FRAGMENT}
            }
          }
        }
      `, { loginInput });
    },

    async Register(registerInput) {
      return executeQuery(`
        mutation Register($registerInput: RegisterInput!) {
          register(registerInput: $registerInput) {
            accessToken
            user {
              ${USER_FRAGMENT}
            }
          }
        }
      `, { registerInput });
    },

    async AnonymousLogin(anonymousLoginInput) {
      return executeQuery(`
        mutation AnonymousLogin($anonymousLoginInput: AnonymousLoginInput!) {
          anonymousLogin(anonymousLoginInput: $anonymousLoginInput) {
            accessToken
            user {
              ${USER_FRAGMENT}
            }
          }
        }
      `, { anonymousLoginInput });
    },

    // User operations
    async GetMe() {
      return executeQuery(`
        query GetMe {
          me {
            ${USER_FRAGMENT}
          }
        }
      `);
    },

    async GetUsers() {
      return executeQuery(`
        query GetUsers {
          users {
            ${USER_FRAGMENT}
          }
        }
      `);
    },

    // Mood operations
    async GetUserMoods() {
      return executeQuery(`
        query GetUserMoods {
          moods {
            ${MOOD_FRAGMENT}
          }
        }
      `);
    },

    async PublicMoods() {
      return executeQuery(`
        query PublicMoods {
          publicMoods {
            ${MOOD_FRAGMENT}
            user {
              ${USER_FRAGMENT}
            }
          }
        }
      `);
    },

    async FriendsMoods() {
      return executeQuery(`
        query FriendsMoods {
          publicMoods {
            ${MOOD_FRAGMENT}
            user {
              ${USER_FRAGMENT}
            }
          }
        }
      `);
    },

    async CreateMoodEntry(moodInput) {
      return executeQuery(`
        mutation CreateMoodEntry($moodInput: MoodEntryInput!) {
          createMoodEntry(moodInput: $moodInput) {
            ${MOOD_FRAGMENT}
          }
        }
      `, { moodInput });
    },

    async GetMoodStreak() {
      return executeQuery(`
        query GetMoodStreak {
          moodStreak {
            ${MOOD_STREAK_FRAGMENT}
          }
        }
      `);
    },

    // Hug operations
    async GetReceivedHugs() {
      return executeQuery(`
        query GetReceivedHugs {
          hugs(recipientId: "current") {
            ${HUG_FRAGMENT}
            sender {
              ${USER_FRAGMENT}
            }
          }
        }
      `);
    },

    async GetSentHugs() {
      return executeQuery(`
        query GetSentHugs {
          hugs(senderId: "current") {
            ${HUG_FRAGMENT}
            recipient {
              ${USER_FRAGMENT}
            }
          }
        }
      `);
    },

    async SendHug(sendHugInput) {
      return executeQuery(`
        mutation SendHug($sendHugInput: SendHugInput!) {
          sendHug(sendHugInput: $sendHugInput) {
            ${HUG_FRAGMENT}
            sender {
              ${USER_FRAGMENT}
            }
            recipient {
              ${USER_FRAGMENT}
            }
          }
        }
      `, { sendHugInput });
    },

    async MarkHugAsRead(hugId) {
      return executeQuery(`
        mutation MarkHugAsRead($hugId: ID!) {
          markHugAsRead(hugId: $hugId) {
            id
            isRead
          }
        }
      `, { hugId });
    },

    // Hug request operations
    async GetMyHugRequests() {
      return executeQuery(`
        query GetMyHugRequests {
          myHugRequests {
            ${HUG_REQUEST_FRAGMENT}
          }
        }
      `);
    },

    async GetPendingHugRequests() {
      return executeQuery(`
        query GetPendingHugRequests {
          pendingHugRequests {
            ${HUG_REQUEST_FRAGMENT}
            requester {
              ${USER_FRAGMENT}
            }
          }
        }
      `);
    },

    async GetCommunityHugRequests() {
      return executeQuery(`
        query GetCommunityHugRequests {
          communityHugRequests {
            ${HUG_REQUEST_FRAGMENT}
            requester {
              ${USER_FRAGMENT}
            }
          }
        }
      `);
    },

    async CreateHugRequest(createHugRequestInput) {
      return executeQuery(`
        mutation CreateHugRequest($createHugRequestInput: CreateHugRequestInput!) {
          createHugRequest(createHugRequestInput: $createHugRequestInput) {
            ${HUG_REQUEST_FRAGMENT}
          }
        }
      `, { createHugRequestInput });
    },

    async RespondToHugRequest(respondToRequestInput) {
      return executeQuery(`
        mutation RespondToHugRequest($respondToRequestInput: RespondToRequestInput!) {
          respondToHugRequest(respondToRequestInput: $respondToRequestInput) {
            id
            status
            respondedAt
          }
        }
      `, { respondToRequestInput });
    },

    // Friendship operations
    async SendFriendRequest(createFriendshipInput) {
      return executeQuery(`
        mutation SendFriendRequest($createFriendshipInput: CreateFriendshipInput!) {
          sendFriendRequest(createFriendshipInput: $createFriendshipInput) {
            ${FRIENDSHIP_FRAGMENT}
            requester {
              ${USER_FRAGMENT}
            }
            recipient {
              ${USER_FRAGMENT}
            }
          }
        }
      `, { createFriendshipInput });
    },

    async RespondToFriendRequest(updateFriendshipInput) {
      return executeQuery(`
        mutation RespondToFriendRequest($updateFriendshipInput: UpdateFriendshipInput!) {
          respondToFriendRequest(updateFriendshipInput: $updateFriendshipInput) {
            id
            status
            followsMood
            updatedAt
          }
        }
      `, { updateFriendshipInput });
    },

    // Utility operations
    async HealthCheck() {
      return executeQuery(`
        query HealthCheck {
          _health
        }
      `);
    }
  };
}

export { getSdk };