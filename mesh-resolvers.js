/**
 * Enhanced Custom Resolvers for GraphQL Mesh with Apollo Integration
 * 
 * This file provides resolvers for:
 * 1. Client-specific fields that don't exist in the server schema
 * 2. Virtual fields that map client field names to server field names
 * 3. Custom resolver logic for transforming data between formats
 * 4. Enhanced data transformation and processing
 */

// Enhanced helper functions for logging, error handling, and performance tracking
const logResolver = (path, args = {}) => {
  const argStr = Object.keys(args).length ? JSON.stringify(args) : '';
  console.log(`[Mesh] Resolving ${path}${argStr ? ` with args: ${argStr}` : ''}`);
};

// Error handler with improved error categorization
const handleError = (path, error) => {
  // Determine error type for better client messages
  const isNetworkError = error.message.includes('ECONNREFUSED') || 
                         error.message.includes('ETIMEDOUT') ||
                         error.message.includes('fetch failed');
  
  const isAuthError = error.message.includes('unauthorized') || 
                      error.message.includes('forbidden') ||
                      error.message.includes('not authenticated');
  
  const errorCategory = isNetworkError ? 'NETWORK_ERROR' : 
                       isAuthError ? 'AUTHENTICATION_ERROR' : 'EXECUTION_ERROR';
  
  console.error(`[Mesh] Error in ${path} (${errorCategory}):`, error.message);
  
  // Return appropriate error for the client
  return null;
};

// Data transformation helper functions
const transformMoodNode = (node) => {
  if (!node) return null;
  
  // Transform returned mood data to match client expectations
  return {
    ...node,
    // Add virtual fields if needed
    user: node.user ? {
      ...node.user,
      // Transform profile image URL if needed
      profileImage: node.user.profileImageUrl || node.user.profileImage || null
    } : null
  };
};

const transformHugNode = (node) => {
  if (!node) return null;
  
  // Transform returned hug data to match client expectations
  return {
    ...node,
    // Add calculated or virtual fields
    sender: node.sender ? {
      ...node.sender,
      profileImage: node.sender.profileImageUrl || node.sender.profileImage || null
    } : null,
    recipient: node.recipient ? {
      ...node.recipient,
      profileImage: node.recipient.profileImageUrl || node.recipient.profileImage || null
    } : null
  };
};

// Export resolvers as CommonJS module
module.exports = {
  Query: {
    // Client information - client-only field providing version info
    clientInfo: () => {
      logResolver('Query.clientInfo');
      // Using environment variables for configuration
      return {
        version: process.env.CLIENT_VERSION || '1.0.0',
        buildDate: new Date().toISOString(),
        platform: process.env.CLIENT_PLATFORM || 'web',
        deviceInfo: 'HugMeNow Enhanced Mesh Gateway',
        features: (process.env.CLIENT_FEATURES || 'mood-tracking,friend-moods,theme-customization').split(',')
      };
    },
    
    // The friendsMoods field has been replaced with publicMoods
    // This resolver is kept for backward compatibility but marked as deprecated
    publicMoods: async (root, args, context, info) => {
      logResolver('Query.publicMoods', args);
      try {
        // Use PostGraphile-compatible pagination parameters
        const result = await context.PostGraphileAPI.Query.allMoods({
          first: args.limit || 10,
          offset: args.offset || 0,
          // Filter to only include public moods
          filter: {
            isPrivate: { equalTo: false }
          }
        });
        
        // Extract nodes from the connection
        const nodes = result?.nodes || [];
        console.log(`[Mesh] Found ${nodes.length} public moods`);
        
        // Transform data to match client expectations
        return nodes.map(transformMoodNode);
      } catch (error) {
        return handleError('Query.publicMoods', error) || [];
      }
    },
    
    // Virtual field: userMoods -> maps to allMoods with user filter
    userMoods: async (root, args, context, info) => {
      logResolver('Query.userMoods', args);
      try {
        // Use PostGraphile-compatible pagination and filtering
        const result = await context.PostGraphileAPI.Query.allMoods({
          first: args.limit || 10,
          offset: args.offset || 0,
          // Filter by user ID if provided
          filter: args.userId ? {
            userId: { equalTo: args.userId }
          } : {}
        });
        
        // Extract nodes from the connection
        const nodes = result?.nodes || [];
        console.log(`[Mesh] Found ${nodes.length} user moods`);
        
        // Transform data to match client expectations
        return nodes.map(transformMoodNode);
      } catch (error) {
        return handleError('Query.userMoods', error) || [];
      }
    },
    
    // Virtual field: sentHugs -> maps to allHugs with sender filter
    sentHugs: async (root, args, context, info) => {
      logResolver('Query.sentHugs', args);
      try {
        // Use PostGraphile-compatible pagination and filtering
        const result = await context.PostGraphileAPI.Query.allHugs({
          first: args.limit || 10,
          offset: args.offset || 0,
          // Filter to hugs sent by the specified user
          filter: {
            senderId: { equalTo: args.userId }
          }
        });
        
        // Extract nodes from the connection
        const nodes = result?.nodes || [];
        console.log(`[Mesh] Found ${nodes.length} sent hugs`);
        
        // Transform data to match client expectations
        return nodes.map(transformHugNode);
      } catch (error) {
        return handleError('Query.sentHugs', error) || [];
      }
    },
    
    // Virtual field: receivedHugs -> maps to allHugs with recipient filter
    receivedHugs: async (root, args, context, info) => {
      logResolver('Query.receivedHugs', args);
      try {
        // Use PostGraphile-compatible pagination and filtering
        const result = await context.PostGraphileAPI.Query.allHugs({
          first: args.limit || 10,
          offset: args.offset || 0,
          // Filter to hugs received by the specified user
          filter: {
            recipientId: { equalTo: args.userId }
          }
        });
        
        // Extract nodes from the connection
        const nodes = result?.nodes || [];
        console.log(`[Mesh] Found ${nodes.length} received hugs`);
        
        // Transform data to match client expectations
        return nodes.map(transformHugNode);
      } catch (error) {
        return handleError('Query.receivedHugs', error) || [];
      }
    }
  },
  
  // Add virtual fields to the Hug type
  Hug: {
    // Virtual field: fromUser -> maps to sender
    fromUser: (parent, args, context, info) => {
      logResolver('Hug.fromUser');
      return parent.sender;
    },
    
    // Virtual field: toUser -> maps to recipient
    toUser: (parent, args, context, info) => {
      logResolver('Hug.toUser');
      return parent.recipient;
    },
    
    // Virtual field: read -> maps to isRead
    read: (parent, args, context, info) => {
      logResolver('Hug.read');
      return parent.isRead;
    }
  },
  
  // Add virtual fields to the Mood type
  Mood: {
    // Virtual field: score -> maps to intensity
    score: (parent, args, context, info) => {
      logResolver('Mood.score');
      return parent.intensity;
    }
  },
  
  // Add custom mutations
  Mutation: {
    // Custom mutation that maps to createHug with appropriate input transformation
    sendFriendHug: async (root, args, context, info) => {
      logResolver('Mutation.sendFriendHug', args);
      try {
        // Transform input to match the expected PostGraphile structure
        const createHugResult = await context.PostGraphileAPI.Mutation.createHug({
          input: {
            hug: {
              recipientId: args.toUserId,
              moodId: args.moodId,
              message: args.message || ''
            }
          }
        });
        
        // Extract and transform the created hug
        const createdHug = createHugResult?.hug;
        if (!createdHug) return null;
        
        return transformHugNode(createdHug);
      } catch (error) {
        return handleError('Mutation.sendFriendHug', error);
      }
    }
  }
};