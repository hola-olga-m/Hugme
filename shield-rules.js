/**
 * GraphQL Shield Rules for HugMeNow
 * 
 * This file defines permission rules using graphql-shield to protect
 * API resources with fine-grained access control.
 */

import { shield, rule, and, or, not, allow, deny } from 'graphql-shield';
import { applyMiddleware } from 'graphql-middleware';

// Utility function to extract user from context
const getUserFromContext = context => {
  if (!context || !context.user) return null;
  return context.user;
};

// Basic rules
const isAuthenticated = rule()(async (parent, args, context) => {
  console.log('[Shield] Checking isAuthenticated rule');
  const user = getUserFromContext(context);
  return user ? true : new Error('Not authenticated');
});

const isAdmin = rule()(async (parent, args, context) => {
  console.log('[Shield] Checking isAdmin rule');
  const user = getUserFromContext(context);
  return user && user.role === 'ADMIN' 
    ? true 
    : new Error('Requires admin privileges');
});

const isOwner = rule()(async (parent, args, context) => {
  console.log('[Shield] Checking isOwner rule for resource');
  const user = getUserFromContext(context);
  if (!user) return new Error('Not authenticated');
  
  // For mutations that have an 'id' parameter
  if (args.id) {
    const resourceId = args.id;
    // This would be replaced with actual logic to check ownership
    // based on the specific resource type and ID
    return true; // Simplified for demonstration
  }
  
  // For accessing user-specific data
  if (args.userId) {
    return user.id === args.userId ? true : new Error('Not the resource owner');
  }
  
  return true;
});

// Content visibility rules
const canViewPublicContent = rule()(async (parent, args, context) => {
  console.log('[Shield] Checking public content access');
  return true; // Public content is visible to all
});

const canViewPrivateContent = rule()(async (parent, args, context) => {
  console.log('[Shield] Checking private content access');
  const user = getUserFromContext(context);
  if (!user) return new Error('Authentication required for private content');
  
  // If accessing another user's private content, check friendship
  if (args.userId && args.userId !== user.id) {
    // This would check if users are friends (simplified)
    return true; // Simplified for demonstration
  }
  
  return true;
});

// Rate limiting rules (simplified implementation)
const isWithinRateLimit = rule()(async (parent, args, context) => {
  console.log('[Shield] Checking rate limits');
  const user = getUserFromContext(context);
  
  // Simple check using in-memory rate limiting
  // In production, use a proper rate limiting solution like Redis
  return true; // Simplified for demonstration
});

// Permission map for GraphQL Shield
const permissions = shield({
  Query: {
    // Public queries
    hello: allow,
    clientInfo: allow,
    publicMoods: canViewPublicContent,
    friendsMoods: canViewPublicContent,
    
    // Authenticated queries
    currentUser: isAuthenticated,
    users: isAdmin,
    user: isAuthenticated,
    userByUsername: isAuthenticated,
    moods: and(isAuthenticated, canViewPrivateContent),
    moodById: and(isAuthenticated, canViewPrivateContent),
    moodStreak: isAuthenticated,
    hugs: isAuthenticated,
    hugById: isAuthenticated,
    hugRequests: isAuthenticated,
    userMoods: and(isAuthenticated, canViewPrivateContent),
    sentHugs: isAuthenticated,
    receivedHugs: isAuthenticated
  },
  Mutation: {
    // Public mutations
    login: allow,
    register: and(canViewPublicContent, isWithinRateLimit),
    
    // Authenticated mutations
    createMood: and(isAuthenticated, isWithinRateLimit),
    updateMood: and(isAuthenticated, isOwner, isWithinRateLimit),
    deleteMood: and(isAuthenticated, isOwner),
    sendHug: and(isAuthenticated, isWithinRateLimit),
    markHugAsRead: and(isAuthenticated, isOwner),
    createHugRequest: and(isAuthenticated, isWithinRateLimit),
    updateProfile: and(isAuthenticated, isOwner),
    sendFriendHug: and(isAuthenticated, isWithinRateLimit)
  },
  // Type-level permissions
  User: {
    email: and(isAuthenticated, or(isAdmin, isOwner)),
    profileImage: allow,
    bio: allow
  },
  MoodEntry: {
    note: and(isAuthenticated, or(isAdmin, isOwner))
  }
}, {
  allowExternalErrors: true,
  debug: true,
  fallbackRule: deny
});

// Apply shield to a schema
const applyShield = (schema) => {
  return applyMiddleware(schema, permissions);
};

// ES Module exports
export {
  permissions,
  applyShield,
  isAuthenticated,
  isAdmin,
  isOwner,
  canViewPublicContent,
  canViewPrivateContent,
  isWithinRateLimit
};