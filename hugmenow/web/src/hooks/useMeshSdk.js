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
      const result = await client.FriendsMoods();
      return result.publicMoods; // Currently using publicMoods as a stand-in
    } catch (error) {
      console.error('Error fetching friends moods:', error);
      return [];
    }
  }, [client]);
  
  const createMoodEntry = useCallback(async (moodInput) => {
    try {
      // Format the input according to the schema requirements - ensure mood is uppercase
      const input = {
        input: {
          mood: moodInput.mood.toUpperCase(),
          intensity: parseInt(moodInput.intensity, 10),
          note: moodInput.note || "",
          isPublic: moodInput.isPublic || false
        }
      };
      
      const result = await client.CreateMoodEntry(input);
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
  
  const sendHug = useCallback(async (sendHugInput) => {
    try {
      const result = await client.SendHug(sendHugInput);
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
  
  const createHugRequest = useCallback(async (createHugRequestInput) => {
    try {
      const result = await client.CreateHugRequest(createHugRequestInput);
      return result.createHugRequest;
    } catch (error) {
      console.error('Error creating hug request:', error);
      throw error;
    }
  }, [client]);
  
  const respondToHugRequest = useCallback(async (respondToRequestInput) => {
    try {
      const result = await client.RespondToHugRequest(respondToRequestInput);
      return result.respondToHugRequest;
    } catch (error) {
      console.error('Error responding to hug request:', error);
      throw error;
    }
  }, [client]);
  
  // Friendship operations
  const sendFriendRequest = useCallback(async (createFriendshipInput) => {
    try {
      const result = await client.SendFriendRequest(createFriendshipInput);
      return result.sendFriendRequest;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  }, [client]);
  
  const respondToFriendRequest = useCallback(async (updateFriendshipInput) => {
    try {
      const result = await client.RespondToFriendRequest(updateFriendshipInput);
      return result.respondToFriendRequest;
    } catch (error) {
      console.error('Error responding to friend request:', error);
      throw error;
    }
  }, [client]);
  
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
    respondToHugRequest,
    
    // Friendship operations
    sendFriendRequest,
    respondToFriendRequest
  };
}