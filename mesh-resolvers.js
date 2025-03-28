/**
 * Custom resolvers for GraphQL Mesh with Apollo integration
 * 
 * This file provides resolvers for:
 * 1. Client-specific fields that don't exist in the server schema
 * 2. Virtual fields that map client field names to server field names
 * 3. Custom resolver logic for transforming data between formats
 */

// Helper functions for logging and error handling
const logResolver = (path, args = {}) => {
  console.log(`[Mesh] Resolving ${path}`, Object.keys(args).length ? args : '');
};

const handleError = (path, error) => {
  console.error(`[Mesh] Error in ${path}:`, error.message);
  // Capture error details but return a clean object for the client
  return null;
};

// Export resolvers
module.exports = {
  Query: {
    // Client information - client-only field providing version info
    clientInfo: () => {
      logResolver('Query.clientInfo');
      return {
        version: process.env.CLIENT_VERSION || '1.0.0',
        buildDate: new Date().toISOString(),
        platform: 'web',
        deviceInfo: 'HugMeNow Web Client',
        features: ['mood-tracking', 'friend-moods', 'theme-support', 'streak-tracking']
      };
    },
    
    // Virtual field: friendsMoods -> maps to publicMoods
    // This allows clients to use a more semantically meaningful field name
    friendsMoods: async (root, args, context, info) => {
      logResolver('Query.friendsMoods', args);
      try {
        // Pass all arguments through to publicMoods resolver with defaults
        const result = await context.PostGraphileAPI.Query.publicMoods({
          limit: args.limit || 10,
          offset: args.offset || 0
        });
        
        if (Array.isArray(result)) {
          console.log(`[Mesh] Found ${result.length} friend moods`);
        }
        return result || [];
      } catch (error) {
        console.error('[Mesh] Error in friendsMoods:', error);
        return handleError('Query.friendsMoods', error) || [];
      }
    },
    
    // Virtual field: userMoods -> maps to moods with parameters
    // This allows clients to use consistent naming pattern for mood queries
    userMoods: async (root, args, context, info) => {
      logResolver('Query.userMoods', args);
      try {
        // Prepare args with defaults
        const moodsArgs = {
          userId: args.userId,
          limit: args.limit || 10,
          offset: args.offset || 0
        };
        
        // Call the underlying API with prepared arguments
        const result = await context.PostGraphileAPI.Query.moods(moodsArgs);
        
        if (Array.isArray(result)) {
          console.log(`[Mesh] Found ${result.length} user moods`);
        }
        return result || [];
      } catch (error) {
        console.error('[Mesh] Error in userMoods:', error);
        return handleError('Query.userMoods', error) || [];
      }
    },
    
    // Virtual field: sentHugs -> maps to hugs with sender filter
    // This provides a cleaner API for getting hugs sent by a user
    sentHugs: async (root, args, context, info) => {
      logResolver('Query.sentHugs', args);
      try {
        // Add the 'sent' type to query parameters
        const hugsArgs = {
          userId: args.userId,
          limit: args.limit || 10,
          offset: args.offset || 0,
          type: 'sent'
        };
        
        // Call the underlying API with prepared arguments
        const result = await context.PostGraphileAPI.Query.hugs(hugsArgs);
        
        if (Array.isArray(result)) {
          console.log(`[Mesh] Found ${result.length} sent hugs`);
        }
        return result || [];
      } catch (error) {
        console.error('[Mesh] Error in sentHugs:', error);
        return handleError('Query.sentHugs', error) || [];
      }
    },
    
    // Virtual field: receivedHugs -> maps to hugs with recipient filter
    // This provides a cleaner API for getting hugs received by a user
    receivedHugs: async (root, args, context, info) => {
      logResolver('Query.receivedHugs', args);
      try {
        // Add the 'received' type to query parameters
        const hugsArgs = {
          userId: args.userId,
          limit: args.limit || 10,
          offset: args.offset || 0,
          type: 'received'
        };
        
        // Call the underlying API with prepared arguments
        const result = await context.PostGraphileAPI.Query.hugs(hugsArgs);
        
        if (Array.isArray(result)) {
          console.log(`[Mesh] Found ${result.length} received hugs`);
        }
        return result || [];
      } catch (error) {
        console.error('[Mesh] Error in receivedHugs:', error);
        return handleError('Query.receivedHugs', error) || [];
      }
    }
  },
  
  // Add virtual fields to the Hug type
  Hug: {
    // Virtual field: fromUser -> maps to sender
    // This adds a more semantically clear field name
    fromUser: (parent, args, context, info) => {
      logResolver('Hug.fromUser');
      // Simply return the sender field from the parent
      return parent.sender;
    },
    
    // Virtual field: toUser -> maps to recipient
    // This adds a more semantically clear field name
    toUser: (parent, args, context, info) => {
      logResolver('Hug.toUser');
      // Simply return the recipient field from the parent
      return parent.recipient;
    },
    
    // Virtual field: read -> maps to isRead
    // This provides a simpler field name
    read: (parent, args, context, info) => {
      logResolver('Hug.read');
      // Simply return the isRead field from the parent
      return parent.isRead;
    }
  },
  
  // Add virtual fields to the PublicMood type
  PublicMood: {
    // Virtual field: score -> maps to intensity
    // This provides a more generalized field name for rating
    score: (parent, args, context, info) => {
      logResolver('PublicMood.score');
      // Simply return the intensity field from the parent
      return parent.intensity;
    }
  },
  
  // Add custom mutations if needed
  Mutation: {
    // Example of a custom mutation that might be added in the future
    /*
    sendFriendHug: async (root, args, context, info) => {
      logResolver('Mutation.sendFriendHug', args);
      try {
        const input = {
          toUserId: args.toUserId,
          moodId: args.moodId,
          message: args.message || ''
        };
        
        const result = await context.PostGraphileAPI.Mutation.sendHug({ input });
        return result;
      } catch (error) {
        return handleError('Mutation.sendFriendHug', error);
      }
    }
    */
  }
};