import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { sendHug, requestHug, respondToHugRequest, getHugTypes } from '../services/hugService';
import { playHapticFeedback } from '../utils/haptics';
import { showNotification } from '../utils/notifications';

// Create context
export const HugContext = createContext();

// Custom hook to use hug context
export const useHug = () => useContext(HugContext);

export const HugProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [hugTypes, setHugTypes] = useState([]);
  const [receivedHugs, setReceivedHugs] = useState([]);
  const [sentHugs, setSentHugs] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeGroupHugs, setActiveGroupHugs] = useState([]);
  const [hugLoading, setHugLoading] = useState(false);
  const [hugError, setHugError] = useState(null);

  // Initialize hug system
  const initializeHugSystem = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setHugLoading(true);
      setHugError(null);
      
      // Fetch hug types
      const types = await getHugTypes();
      setHugTypes(types);
      
      // Fetch initial hug data
      await fetchUserHugData();
      
      // Subscribe to hug notifications
      subscribeToHugNotifications();
      
    } catch (error) {
      console.error('Failed to initialize hug system:', error);
      setHugError('Failed to load hug data');
    } finally {
      setHugLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch all hug-related data for the user
  const fetchUserHugData = async () => {
    if (!isAuthenticated || !currentUser?.id) return;
    
    try {
      setHugLoading(true);
      
      // Get received hugs
      const received = await import('../services/hugService').then(module => 
        module.getReceivedHugs(currentUser.id)
      );
      setReceivedHugs(received);
      
      // Get sent hugs
      const sent = await import('../services/hugService').then(module => 
        module.getSentHugs(currentUser.id)
      );
      setSentHugs(sent);
      
      // Get received hug requests
      const receivedReqs = await import('../services/hugService').then(module => 
        module.getReceivedHugRequests(currentUser.id)
      );
      setReceivedRequests(receivedReqs);
      
      // Get sent hug requests
      const sentReqs = await import('../services/hugService').then(module => 
        module.getSentHugRequests(currentUser.id)
      );
      setSentRequests(sentReqs);
      
      // Get active group hugs
      const groupHugs = await import('../services/hugService').then(module => 
        module.getActiveGroupHugs(currentUser.id)
      );
      setActiveGroupHugs(groupHugs);
      
    } catch (error) {
      console.error('Failed to fetch user hug data:', error);
      setHugError('Failed to load your hug data');
    } finally {
      setHugLoading(false);
    }
  };

  // Subscribe to real-time hug notifications
  const subscribeToHugNotifications = () => {
    if (!isAuthenticated || !currentUser?.id) return;
    
    // Subscribe to new hugs
    import('../services/hugmoodAPI').then(module => {
      module.subscribeNewHugs(currentUser.id, handleNewHug);
    });
    
    // Other subscriptions can be added here
  };

  // Handle receiving a new hug
  const handleNewHug = (hugData) => {
    // Add to received hugs
    setReceivedHugs(prev => [hugData, ...prev]);
    
    // Show notification
    showNotification(
      'New Hug Received!',
      `${hugData.senderName} sent you a ${hugData.hugType} hug`
    );
    
    // Play haptic feedback
    playHapticFeedback('success');
  };

  // Send a hug to someone
  const sendHugToUser = async (recipientId, hugTypeId, message = null) => {
    if (!isAuthenticated) return;
    
    try {
      setHugLoading(true);
      setHugError(null);
      
      // Call API to send hug
      const hugResult = await sendHug(recipientId, hugTypeId, message);
      
      // Add to sent hugs
      setSentHugs(prev => [hugResult, ...prev]);
      
      // Play haptic feedback
      playHapticFeedback('success');
      
      return hugResult;
    } catch (error) {
      console.error('Failed to send hug:', error);
      setHugError(error.message || 'Failed to send hug');
      throw error;
    } finally {
      setHugLoading(false);
    }
  };

  // Send a hug request
  const sendHugRequest = async (requestData) => {
    if (!isAuthenticated) return;
    
    try {
      setHugLoading(true);
      setHugError(null);
      
      // Call API to request hug
      const requestResult = await requestHug(requestData);
      
      // Add to sent requests
      setSentRequests(prev => [requestResult, ...prev]);
      
      return requestResult;
    } catch (error) {
      console.error('Failed to send hug request:', error);
      setHugError(error.message || 'Failed to send hug request');
      throw error;
    } finally {
      setHugLoading(false);
    }
  };

  // Respond to a hug request
  const respondToRequest = async (requestId, response, message = null) => {
    if (!isAuthenticated) return;
    
    try {
      setHugLoading(true);
      setHugError(null);
      
      // Call API to respond to request
      const result = await respondToHugRequest(requestId, response, message);
      
      // Update received requests
      setReceivedRequests(prev => 
        prev.map(req => 
          req.id === requestId ? { ...req, status: response, responseMessage: message } : req
        )
      );
      
      // If accepted, add to sent hugs
      if (response === 'accept' && result.hug) {
        setSentHugs(prev => [result.hug, ...prev]);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to respond to hug request:', error);
      setHugError(error.message || 'Failed to respond to request');
      throw error;
    } finally {
      setHugLoading(false);
    }
  };

  // Create a group hug
  const createGroupHug = async (groupHugData) => {
    if (!isAuthenticated) return;
    
    try {
      setHugLoading(true);
      setHugError(null);
      
      // Call API to create group hug
      const result = await import('../services/hugService').then(module => 
        module.createGroupHug(groupHugData)
      );
      
      // Add to active group hugs
      setActiveGroupHugs(prev => [result, ...prev]);
      
      return result;
    } catch (error) {
      console.error('Failed to create group hug:', error);
      setHugError(error.message || 'Failed to create group hug');
      throw error;
    } finally {
      setHugLoading(false);
    }
  };

  // Join a group hug
  const joinGroupHug = async (groupId) => {
    if (!isAuthenticated) return;
    
    try {
      setHugLoading(true);
      setHugError(null);
      
      // Call API to join group hug
      const result = await import('../services/hugService').then(module => 
        module.joinGroupHug(groupId)
      );
      
      // Update active group hugs
      setActiveGroupHugs(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { 
                ...group, 
                participants: [...group.participants, { 
                  userId: currentUser.id, 
                  name: currentUser.name,
                  avatar: currentUser.avatar 
                }] 
              } 
            : group
        )
      );
      
      return result;
    } catch (error) {
      console.error('Failed to join group hug:', error);
      setHugError(error.message || 'Failed to join group hug');
      throw error;
    } finally {
      setHugLoading(false);
    }
  };

  // Context value
  const contextValue = {
    hugTypes,
    receivedHugs,
    sentHugs,
    receivedRequests,
    sentRequests,
    activeGroupHugs,
    hugLoading,
    hugError,
    initializeHugSystem,
    fetchUserHugData,
    sendHug: sendHugToUser,
    requestHug: sendHugRequest,
    respondToHugRequest: respondToRequest,
    createGroupHug,
    joinGroupHug
  };

  return (
    <HugContext.Provider value={contextValue}>
      {children}
    </HugContext.Provider>
  );
};

export default HugProvider;