
/**
 * HugService - Handles all hug-related functionality
 */

// Mock data for initial development
const mockHugs = [
  {
    id: 'hug1',
    senderId: 'user1',
    recipientId: 'user2',
    type: 'virtual',
    message: 'Hope you feel better soon!',
    createdAt: new Date().toISOString()
  },
  {
    id: 'hug2',
    senderId: 'user3',
    recipientId: 'user1',
    type: 'support',
    message: 'You got this!',
    createdAt: new Date().toISOString()
  }
];

// Initialize the service
export const initialize = () => {
  console.log('HugService initialized');
  return Promise.resolve();
};

// Get hugs for a specific user
export const getUserHugs = (userId) => {
  return Promise.resolve(
    mockHugs.filter(hug => 
      hug.senderId === userId || hug.recipientId === userId
    )
  );
};

// Send a hug to another user
export const sendHug = (senderId, recipientId, type, message) => {
  const newHug = {
    id: `hug${mockHugs.length + 1}`,
    senderId,
    recipientId,
    type,
    message,
    createdAt: new Date().toISOString()
  };
  
  // In a real app, this would make an API call
  mockHugs.push(newHug);
  return Promise.resolve(newHug);
};

// Request a hug
export const requestHug = (userId, message) => {
  // Implementation would connect to API
  return Promise.resolve({
    id: `req${Date.now()}`,
    userId,
    message,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
};

// Get hug statistics
export const getHugStats = (userId) => {
  const sent = mockHugs.filter(hug => hug.senderId === userId).length;
  const received = mockHugs.filter(hug => hug.recipientId === userId).length;
  
  return Promise.resolve({
    sent,
    received,
    total: sent + received
  });
};

export default {
  initialize,
  getUserHugs,
  sendHug,
  requestHug,
  getHugStats
};
