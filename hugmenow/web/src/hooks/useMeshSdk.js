/**
 * React hook for using the GraphQL Mesh SDK
 */
import { useCallback, useMemo } from 'react';
import { meshSdk } from '../apollo/client';

/**
 * Hook to access the Mesh SDK from React components
 * @param {Object} options - SDK options
 * @returns {Object} SDK client and utility methods
 */
export function useMeshSdk(options = {}) {
  // Create the client with current auth token
  const client = useMemo(() => meshSdk(), []);
  
  // User operations
  const getUserProfile = useCallback(async () => {
    try {
      const result = await client.GetMe();
      return result.me;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, [client]);
  
  const getUsers = useCallback(async () => {
    try {
      const result = await client.GetUsers();
      return result.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }, [client]);
  
  // Mood operations
  const getUserMoods = useCallback(async () => {
    try {
      const result = await client.GetUserMoods();
      return result.moods;
    } catch (error) {
      console.error('Error fetching user moods:', error);
      return [];
    }
  }, [client]);
  
  const getPublicMoods = useCallback(async () => {
    try {
      const result = await client.PublicMoods();
      return result.publicMoods;
    } catch (error) {
      console.error('Error fetching public moods:', error);
      return [];
    }
  }, [client]);
  
  const getFriendsMoods = useCallback(async () => {
    try {
      // Since there's no specific friendsMoods field in the schema,
      // we use publicMoods as a proxy for friends' moods
      const result = await client.FriendsMoods();
      
      // The data is returned as publicMoods, but the component expects an array
      if (result && result.publicMoods) {
        return result.publicMoods;
      }
      return [];
    } catch (error) {
      console.error('Error fetching friends moods:', error);
      return [];
    }
  }, [client]);
  
  const createMoodEntry = useCallback(async (moodInput) => {
    try {
      // Format the input according to the schema requirements - ensure mood is uppercase
      const formattedInput = {
        moodInput: {
          mood: moodInput.mood.toUpperCase(),
          intensity: parseInt(moodInput.intensity, 10),
          note: moodInput.note || "",
          isPublic: moodInput.isPublic || false
        }
      };
      
      const result = await client.CreateMoodEntry(formattedInput);
      return result.createMoodEntry || {};
    } catch (error) {
      console.error('Error creating mood entry:', error);
      throw error;
    }
  }, [client]);
  
  const getMoodStreak = useCallback(async () => {
    try {
      const result = await client.GetMoodStreak();
      return result.moodStreak;
    } catch (error) {
      console.error('Error fetching mood streak:', error);
      return null;
    }
  }, [client]);
  
  // Hug operations
  const getReceivedHugs = useCallback(async () => {
    try {
      const result = await client.GetReceivedHugs();
      return result.hugs;
    } catch (error) {
      console.error('Error fetching received hugs:', error);
      return [];
    }
  }, [client]);
  
  const getSentHugs = useCallback(async () => {
    try {
      const result = await client.GetSentHugs();
      return result.hugs;
    } catch (error) {
      console.error('Error fetching sent hugs:', error);
      return [];
    }
  }, [client]);
  
  const sendHug = useCallback(async (hugData) => {
    try {
      // Format the input according to the schema requirements
      const formattedInput = {
        hugInput: {
          recipientId: hugData.recipientId,
          type: hugData.type,
          message: hugData.message || ""
        }
      };
      
      const result = await client.SendHug(formattedInput);
      return result.sendHug;
    } catch (error) {
      console.error('Error sending hug:', error);
      throw error;
    }
  }, [client]);
  
  const markHugAsRead = useCallback(async (hugId) => {
    try {
      const result = await client.MarkHugAsRead(hugId);
      return result.markHugAsRead;
    } catch (error) {
      console.error('Error marking hug as read:', error);
      throw error;
    }
  }, [client]);
  
  // Hug request operations
  const getMyHugRequests = useCallback(async () => {
    try {
      const result = await client.GetMyHugRequests();
      return result.myHugRequests;
    } catch (error) {
      console.error('Error fetching my hug requests:', error);
      return [];
    }
  }, [client]);
  
  const getPendingHugRequests = useCallback(async () => {
    try {
      const result = await client.GetPendingHugRequests();
      return result.pendingHugRequests;
    } catch (error) {
      console.error('Error fetching pending hug requests:', error);
      return [];
    }
  }, [client]);
  
  const getCommunityHugRequests = useCallback(async () => {
    try {
      const result = await client.GetCommunityHugRequests();
      return result.communityHugRequests;
    } catch (error) {
      console.error('Error fetching community hug requests:', error);
      return [];
    }
  }, [client]);
  
  const createHugRequest = useCallback(async (requestData) => {
    try {
      // Format the input according to the schema requirements
      const formattedInput = {
        hugRequestInput: {
          recipientId: requestData.recipientId,
          message: requestData.message || "",
          isCommunityRequest: requestData.isCommunityRequest || false
        }
      };
      
      const result = await client.CreateHugRequest(formattedInput);
      return result.createHugRequest;
    } catch (error) {
      console.error('Error creating hug request:', error);
      throw error;
    }
  }, [client]);
  
  const respondToHugRequest = useCallback(async (requestData) => {
    try {
      // The parameters should be requestId and accept according to the schema
      const params = {
        requestId: requestData.requestId,
        accept: requestData.accept
      };
      
      const result = await client.RespondToHugRequest(params);
      return result.respondToHugRequest;
    } catch (error) {
      console.error('Error responding to hug request:', error);
      throw error;
    }
  }, [client]);
  
  // Note: Friendship operations (sendFriendRequest and respondToFriendRequest)
  // are removed as they are not in the current schema
  // These will need to be added back when the schema supports friendship operations
  
  // Return all methods
  return {
    // Raw client access
    client,
    
    // User operations
    getUserProfile,
    getUsers,
    
    // Mood operations
    getUserMoods,
    getPublicMoods,
    getFriendsMoods,
    createMoodEntry,
    getMoodStreak,
    
    // Hug operations
    getReceivedHugs,
    getSentHugs,
    sendHug,
    markHugAsRead,
    
    // Hug request operations
    getMyHugRequests,
    getPendingHugRequests,
    getCommunityHugRequests,
    createHugRequest,
    respondToHugRequest
    // Friendship operations are currently not supported in the schema
  };
}