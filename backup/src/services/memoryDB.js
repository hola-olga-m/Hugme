/**
 * In-memory database for the HugMood application
 * For demonstration purposes only. In a production app,
 * this would be replaced with a real database.
 */

// Create storage objects for different data types
const db = {
  users: new Map(),
  hugs: new Map(),
  hugRequests: new Map(),
  groupHugs: new Map(),
  moods: new Map(),
  follows: new Map(),
  badges: new Map(),
  userBadges: new Map(),
  mediaHugs: new Map(),
  activeConnections: new Map()
};

/**
 * Generate a unique ID for stored items
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} A unique ID
 */
const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Store an item in the database
 * @param {string} collection - The collection to store the item in
 * @param {Object} item - The item to store
 * @returns {Object} The stored item
 */
export const storeItem = (collection, item) => {
  if (!db[collection]) {
    throw new Error(`Collection "${collection}" does not exist`);
  }
  
  // Ensure the item has an ID
  if (!item.id) {
    item.id = generateId(collection.slice(0, 3) + '_');
  }
  
  // Store the item
  db[collection].set(item.id, item);
  
  return item;
};

/**
 * Get an item from the database by ID
 * @param {string} collection - The collection to retrieve from
 * @param {string} id - The ID of the item to retrieve
 * @returns {Object|null} The retrieved item or null if not found
 */
export const getItem = (collection, id) => {
  if (!db[collection]) {
    throw new Error(`Collection "${collection}" does not exist`);
  }
  
  return db[collection].get(id) || null;
};

/**
 * Get all items from a collection
 * @param {string} collection - The collection to retrieve from
 * @returns {Array} Array of all items in the collection
 */
export const getAllItems = (collection) => {
  if (!db[collection]) {
    throw new Error(`Collection "${collection}" does not exist`);
  }
  
  return Array.from(db[collection].values());
};

/**
 * Update an item in the database
 * @param {string} collection - The collection containing the item
 * @param {string} id - The ID of the item to update
 * @param {Object} updates - The updates to apply
 * @returns {Object|null} The updated item or null if not found
 */
export const updateItem = (collection, id, updates) => {
  if (!db[collection]) {
    throw new Error(`Collection "${collection}" does not exist`);
  }
  
  const item = db[collection].get(id);
  
  if (!item) {
    return null;
  }
  
  // Apply updates
  const updatedItem = { ...item, ...updates };
  
  // Store updated item
  db[collection].set(id, updatedItem);
  
  return updatedItem;
};

/**
 * Delete an item from the database
 * @param {string} collection - The collection containing the item
 * @param {string} id - The ID of the item to delete
 * @returns {boolean} True if the item was deleted, false otherwise
 */
export const deleteItem = (collection, id) => {
  if (!db[collection]) {
    throw new Error(`Collection "${collection}" does not exist`);
  }
  
  return db[collection].delete(id);
};

/**
 * Query items in a collection
 * @param {string} collection - The collection to query
 * @param {Function} predicate - Function to filter items
 * @returns {Array} Array of items matching the predicate
 */
export const queryItems = (collection, predicate) => {
  if (!db[collection]) {
    throw new Error(`Collection "${collection}" does not exist`);
  }
  
  return Array.from(db[collection].values()).filter(predicate);
};

/**
 * Store a WebSocket connection for a user
 * @param {string} userId - The user ID
 * @param {WebSocket} ws - The WebSocket connection
 */
export const storeConnection = (userId, ws) => {
  db.activeConnections.set(userId, ws);
};

/**
 * Get a user's WebSocket connection
 * @param {string} userId - The user ID
 * @returns {WebSocket|null} The WebSocket connection or null if not found
 */
export const getConnection = (userId) => {
  return db.activeConnections.get(userId) || null;
};

/**
 * Remove a user's WebSocket connection
 * @param {string} userId - The user ID
 * @returns {boolean} True if the connection was removed, false otherwise
 */
export const removeConnection = (userId) => {
  return db.activeConnections.delete(userId);
};

/**
 * Get all active connections
 * @returns {Map} Map of user IDs to WebSocket connections
 */
export const getAllConnections = () => {
  return db.activeConnections;
};

/**
 * Clear all data (for testing purposes)
 */
export const clearAll = () => {
  for (const collection in db) {
    db[collection].clear();
  }
};

/**
 * Get user by email (for authentication)
 * @param {string} email - The email address
 * @returns {Object|null} The user or null if not found
 */
export const getUserByEmail = (email) => {
  return Array.from(db.users.values()).find(user => user.email === email) || null;
};

/**
 * Get user by username (for authentication)
 * @param {string} username - The username
 * @returns {Object|null} The user or null if not found
 */
export const getUserByUsername = (username) => {
  return Array.from(db.users.values()).find(user => user.username === username) || null;
};

/**
 * Get hugs sent to a user
 * @param {string} userId - The user ID
 * @returns {Array} Array of hugs sent to the user
 */
export const getHugsByRecipient = (userId) => {
  return Array.from(db.hugs.values()).filter(hug => hug.recipientId === userId);
};

/**
 * Get hugs sent by a user
 * @param {string} userId - The user ID
 * @returns {Array} Array of hugs sent by the user
 */
export const getHugsBySender = (userId) => {
  return Array.from(db.hugs.values()).filter(hug => hug.senderId === userId);
};

/**
 * Get hug requests for a user
 * @param {string} userId - The user ID
 * @returns {Array} Array of hug requests for the user
 */
export const getHugRequestsByRecipient = (userId) => {
  return Array.from(db.hugRequests.values()).filter(req => req.recipientId === userId);
};

/**
 * Get mood history for a user
 * @param {string} userId - The user ID
 * @returns {Array} Array of mood entries for the user
 */
export const getMoodHistoryByUser = (userId) => {
  return Array.from(db.moods.values())
    .filter(mood => mood.userId === userId)
    .sort((a, b) => b.timestamp - a.timestamp);
};

/**
 * Get group hugs for a user
 * @param {string} userId - The user ID
 * @returns {Array} Array of group hugs the user is part of
 */
export const getGroupHugsByUser = (userId) => {
  return Array.from(db.groupHugs.values())
    .filter(group => group.participantIds.includes(userId));
};

/**
 * Get users a user is following
 * @param {string} userId - The user ID
 * @returns {Array} Array of user IDs the user is following
 */
export const getFollowing = (userId) => {
  return Array.from(db.follows.values())
    .filter(follow => follow.followerId === userId)
    .map(follow => follow.followingId);
};

/**
 * Get users who are following a user
 * @param {string} userId - The user ID
 * @returns {Array} Array of user IDs following the user
 */
export const getFollowers = (userId) => {
  return Array.from(db.follows.values())
    .filter(follow => follow.followingId === userId)
    .map(follow => follow.followerId);
};

/**
 * Check if a user is following another user
 * @param {string} followerId - The follower user ID
 * @param {string} followingId - The following user ID
 * @returns {boolean} True if following, false otherwise
 */
export const isFollowing = (followerId, followingId) => {
  return Array.from(db.follows.values()).some(
    follow => follow.followerId === followerId && follow.followingId === followingId
  );
};

/**
 * Get badges for a user
 * @param {string} userId - The user ID
 * @returns {Array} Array of badges for the user
 */
export const getBadgesByUser = (userId) => {
  const userBadgeIds = Array.from(db.userBadges.values())
    .filter(ub => ub.userId === userId)
    .map(ub => ub.badgeId);
  
  return Array.from(db.badges.values())
    .filter(badge => userBadgeIds.includes(badge.id));
};

/**
 * Initialize database with sample data
 */
export const initializeDb = () => {
  // This would be replaced with loading from a real database in production
  
  // Add initial data if needed
};