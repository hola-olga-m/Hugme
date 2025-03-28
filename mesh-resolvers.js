/**
 * Enhanced Custom Resolvers for GraphQL Mesh with Apollo Integration
 * 
 * This file provides resolvers for:
 * 1. Client-specific fields that don't exist in the server schema
 * 2. Virtual fields that map client field names to server field names
 * 3. Custom resolver logic for transforming data between formats
 * 4. Enhanced data transformation and processing
 * 5. Live query support for real-time updates
 */
 
// Live query directives support
const LIVE_QUERY_FIELDS = {
  'Query.publicMoods': true,
  'Query.userMoods': true,
  'Query.receivedHugs': true,
  'Query.communityHugRequests': true,
  'Query.friendsMoods': true,
  'Query.pendingHugRequests': true
};

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
  // LiveQuery support - mark which fields should use live query
  $live: {
    liveQueries: LIVE_QUERY_FIELDS,
    // The cache won't be updated after this resolver is called
    invalidate: (typeName, fieldName) => {
      // Check if this is a mutation that should invalidate the cache
      if (typeName === 'Mutation') {
        // For createMoodEntry, invalidate publicMoods and userMoods
        if (fieldName === 'createMoodEntry') {
          return [
            'Query.publicMoods',
            'Query.userMoods',
            'Query.friendsMoods'
          ];
        }
        // For sendHug, invalidate receivedHugs and sentHugs
        if (fieldName === 'sendHug') {
          return [
            'Query.receivedHugs',
            'Query.sentHugs'
          ];
        }
        // For createHugRequest, invalidate communityHugRequests and pendingHugRequests
        if (fieldName === 'createHugRequest' || fieldName === 'respondToHugRequest') {
          return [
            'Query.communityHugRequests',
            'Query.pendingHugRequests'
          ];
        }
      }
      // By default, don't invalidate anything
      return [];
    }
  },
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
    // But we still provide a basic implementation for backward compatibility
    friendsMoods: async (root, args, context, info) => {
      logResolver('Query.friendsMoods', args);
      try {
        // Just delegate to the publicMoods resolver
        return context.PostGraphileAPI.Query.allMoods({
          first: args.limit || 10,
          offset: args.offset || 0,
          condition: {
            isPublic: true
          }
        }).then(result => {
          const nodes = result?.nodes || [];
          console.log(`[Mesh] Found ${nodes.length} public moods (via friendsMoods compat)`);
          
          // Map PostGraphile response structure to what frontend expects
          return nodes.map(node => ({
            id: node.id,
            intensity: node.score, // Map score to intensity
            note: node.note,
            createdAt: node.createdAt,
            user: node.userByUserId ? {
              id: node.userByUserId.id,
              name: node.userByUserId.name,
              username: node.userByUserId.username,
              avatarUrl: node.userByUserId.avatarUrl
            } : null
          }));
        });
      } catch (error) {
        return handleError('Query.friendsMoods', error) || [];
      }
    },
    // This resolver maps the publicMoods query name to allMoods with condition
    publicMoods: async (root, args, context, info) => {
      logResolver('Query.publicMoods', args);
      try {
        // Use PostGraphile-compatible pagination parameters
        const result = await context.PostGraphileAPI.Query.allMoods({
          first: args.limit || 10,
          offset: args.offset || 0,
          // Filter to only include public moods
          condition: {
            isPublic: true
          }
        });
        
        // Extract nodes from the connection
        const nodes = result?.nodes || [];
        console.log(`[Mesh] Found ${nodes.length} public moods`);
        
        // Map PostGraphile response structure to what frontend expects
        return nodes.map(node => ({
          id: node.id,
          intensity: node.score, // Map score to intensity
          note: node.note,
          createdAt: node.createdAt,
          user: node.userByUserId ? {
            id: node.userByUserId.id,
            name: node.userByUserId.name,
            username: node.userByUserId.username,
            avatarUrl: node.userByUserId.avatarUrl
          } : null
        }));
      } catch (error) {
        return handleError('Query.publicMoods', error) || [];
      }
    },
    
    // Virtual field: userMoods -> maps to allMoods with user condition
    userMoods: async (root, args, context, info) => {
      logResolver('Query.userMoods', args);
      try {
        // Use PostGraphile-compatible pagination and filtering
        const result = await context.PostGraphileAPI.Query.allMoods({
          first: args.limit || 10,
          offset: args.offset || 0,
          // Filter by user ID if provided
          condition: args.userId ? {
            userId: args.userId
          } : {}
        });
        
        // Extract nodes from the connection
        const nodes = result?.nodes || [];
        console.log(`[Mesh] Found ${nodes.length} user moods`);
        
        // Map PostGraphile response structure to what frontend expects
        return nodes.map(node => ({
          id: node.id,
          intensity: node.score, // Map score to intensity
          note: node.note,
          createdAt: node.createdAt,
          emoji: null, // Not provided in the schema, set to null
          private: !node.isPublic // inverse of isPublic
        }));
      } catch (error) {
        return handleError('Query.userMoods', error) || [];
      }
    },
    
    // Virtual field: moodStreak -> Custom resolver to calculate user mood streak
    moodStreak: async (root, args, context, info) => {
      logResolver('Query.moodStreak', args);
      try {
        // Get user and their moods
        const user = await context.PostGraphileAPI.Query.userById({
          id: args.userId
        });
        
        if (!user) {
          return { currentStreak: 0, longestStreak: 0, lastMoodDate: null };
        }
        
        // Get mood count (in a real implementation, we'd calculate actual streaks)
        const moodCount = user.moodsByUserId?.totalCount || 0;
        
        // Simple placeholder implementation - in production, we'd calculate real streaks
        return {
          currentStreak: moodCount > 0 ? Math.min(moodCount, 7) : 0,
          longestStreak: moodCount > 0 ? Math.min(moodCount, 14) : 0,
          lastMoodDate: new Date().toISOString()
        };
      } catch (error) {
        return handleError('Query.moodStreak', error) || {
          currentStreak: 0, 
          longestStreak: 0, 
          lastMoodDate: null
        };
      }
    },
    
    // Virtual field: communityHugRequests -> maps to allHugRequests
    communityHugRequests: async (root, args, context, info) => {
      logResolver('Query.communityHugRequests', args);
      try {
        // Use PostGraphile-compatible pagination parameters
        const result = await context.PostGraphileAPI.Query.allHugRequests({
          first: args.limit || 10,
          offset: args.offset || 0
        });
        
        // Extract nodes from the connection
        const nodes = result?.nodes || [];
        console.log(`[Mesh] Found ${nodes.length} community hug requests`);
        
        // Map PostGraphile response structure to what frontend expects
        return nodes.map(node => ({
          id: node.id,
          message: node.message,
          createdAt: node.createdAt,
          requester: node.userByRequesterId ? {
            id: node.userByRequesterId.id,
            name: node.userByRequesterId.name,
            username: node.userByRequesterId.username,
            avatarUrl: node.userByRequesterId.avatarUrl
          } : null
        }));
      } catch (error) {
        return handleError('Query.communityHugRequests', error) || [];
      }
    },
    
    // Virtual field: sentHugs -> maps to allHugs with sender condition
    sentHugs: async (root, args, context, info) => {
      logResolver('Query.sentHugs', args);
      try {
        // Use PostGraphile-compatible pagination and filtering
        const result = await context.PostGraphileAPI.Query.allHugs({
          first: args.limit || 10,
          offset: args.offset || 0,
          // Filter to hugs sent by the specified user
          condition: {
            senderId: args.userId
          }
        });
        
        // Extract nodes from the connection
        const nodes = result?.nodes || [];
        console.log(`[Mesh] Found ${nodes.length} sent hugs`);
        
        // Map PostGraphile response structure to what frontend expects
        return nodes.map(node => ({
          id: node.id,
          message: node.message,
          createdAt: node.createdAt,
          toUser: node.userByRecipientId ? {
            id: node.userByRecipientId.id,
            name: node.userByRecipientId.name,
            username: node.userByRecipientId.username,
            avatarUrl: node.userByRecipientId.avatarUrl
          } : null
        }));
      } catch (error) {
        return handleError('Query.sentHugs', error) || [];
      }
    },
    
    // Virtual field: receivedHugs -> maps to allHugs with recipient condition
    receivedHugs: async (root, args, context, info) => {
      logResolver('Query.receivedHugs', args);
      try {
        // Use PostGraphile-compatible pagination and filtering
        const result = await context.PostGraphileAPI.Query.allHugs({
          first: args.limit || 10,
          offset: args.offset || 0,
          // Filter to hugs received by the specified user
          condition: {
            recipientId: args.userId
          }
        });
        
        // Extract nodes from the connection
        const nodes = result?.nodes || [];
        console.log(`[Mesh] Found ${nodes.length} received hugs`);
        
        // Map PostGraphile response structure to what frontend expects
        return nodes.map(node => ({
          id: node.id,
          message: node.message,
          createdAt: node.createdAt,
          read: node.isRead,
          fromUser: node.userBySenderId ? {
            id: node.userBySenderId.id,
            name: node.userBySenderId.name,
            username: node.userBySenderId.username,
            avatarUrl: node.userBySenderId.avatarUrl
          } : null
        }));
      } catch (error) {
        return handleError('Query.receivedHugs', error) || [];
      }
    },
    
    // Virtual field: pendingHugRequests -> maps to filtered allHugRequests
    pendingHugRequests: async (root, args, context, info) => {
      logResolver('Query.pendingHugRequests', args);
      try {
        // Use PostGraphile-compatible pagination and filtering
        const result = await context.PostGraphileAPI.Query.allHugRequests({
          first: 20,
          // Filter to requests with PENDING status for the user
          condition: {
            requesterId: args.userId,
            status: "PENDING"
          }
        });
        
        // Extract nodes from the connection
        const nodes = result?.nodes || [];
        console.log(`[Mesh] Found ${nodes.length} pending hug requests`);
        
        // Map PostGraphile response structure to what frontend expects
        return nodes.map(node => ({
          id: node.id,
          message: node.message,
          createdAt: node.createdAt,
          requester: node.userByRequesterId ? {
            id: node.userByRequesterId.id,
            name: node.userByRequesterId.name,
            username: node.userByRequesterId.username
          } : null
        }));
      } catch (error) {
        return handleError('Query.pendingHugRequests', error) || [];
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
    sendHug: async (root, args, context, info) => {
      logResolver('Mutation.sendHug', args);
      try {
        // Transform input to match the expected PostGraphile structure
        const createHugResult = await context.PostGraphileAPI.Mutation.createHug({
          input: {
            hug: {
              senderId: args.input.senderId,
              recipientId: args.input.recipientId,
              message: args.input.message || ''
            }
          }
        });
        
        // Extract the created hug
        const createdHug = createHugResult?.hug;
        if (!createdHug) return null;
        
        // Map to expected client response format
        return {
          id: createdHug.id,
          message: createdHug.message,
          createdAt: createdHug.createdAt,
          fromUser: createdHug.userBySenderId ? {
            id: createdHug.userBySenderId.id,
            name: createdHug.userBySenderId.name
          } : null,
          toUser: createdHug.userByRecipientId ? {
            id: createdHug.userByRecipientId.id,
            name: createdHug.userByRecipientId.name
          } : null
        };
      } catch (error) {
        return handleError('Mutation.sendHug', error);
      }
    },
    
    // Custom mutation to create a mood entry
    createMoodEntry: async (root, args, context, info) => {
      logResolver('Mutation.createMoodEntry', args);
      try {
        // Transform to PostGraphile input format
        const createMoodResult = await context.PostGraphileAPI.Mutation.createMood({
          input: {
            mood: {
              userId: args.moodInput.userId,
              score: args.moodInput.intensity,
              note: args.moodInput.note || '',
              isPublic: !args.moodInput.private
            }
          }
        });
        
        // Extract the created mood
        const createdMood = createMoodResult?.mood;
        if (!createdMood) return null;
        
        // Map to expected client response format
        return {
          id: createdMood.id,
          intensity: createdMood.score,
          note: createdMood.note,
          createdAt: createdMood.createdAt,
          emoji: null, // Not in schema
          private: !createdMood.isPublic
        };
      } catch (error) {
        return handleError('Mutation.createMoodEntry', error);
      }
    },
    
    // Custom mutation to create a hug request
    createHugRequest: async (root, args, context, info) => {
      logResolver('Mutation.createHugRequest', args);
      try {
        // Get input from provided format
        const requestInput = args.hugRequestInput || {};
        
        // Transform to PostGraphile input format
        const createRequestResult = await context.PostGraphileAPI.Mutation.createHugRequest({
          input: {
            hugRequest: {
              requesterId: requestInput.requesterId,
              message: requestInput.message || '',
              status: 'PENDING'
            }
          }
        });
        
        // Extract the created request
        const createdRequest = createRequestResult?.hugRequest;
        if (!createdRequest) return null;
        
        // Map to expected client response format
        return {
          id: createdRequest.id,
          message: createdRequest.message,
          createdAt: createdRequest.createdAt,
          requester: createdRequest.userByRequesterId ? {
            id: createdRequest.userByRequesterId.id,
            name: createdRequest.userByRequesterId.name
          } : null
        };
      } catch (error) {
        return handleError('Mutation.createHugRequest', error);
      }
    },
    
    // Custom mutation to respond to a hug request
    respondToHugRequest: async (root, args, context, info) => {
      logResolver('Mutation.respondToHugRequest', args);
      try {
        // Find the request first
        const requestNode = await context.PostGraphileAPI.Query.hugRequest({
          id: args.requestId
        });
        
        if (!requestNode) {
          throw new Error(`Hug request with ID ${args.requestId} not found`);
        }
        
        // Update the request status
        const updateResult = await context.PostGraphileAPI.Mutation.updateHugRequest({
          input: {
            id: args.requestId,
            hugRequestPatch: {
              status: args.accept ? 'ACCEPTED' : 'REJECTED'
              // Note: createdAt is handled by the database, not using updatedAt which doesn't exist
            }
          }
        });
        
        // Extract the updated request
        const updatedRequest = updateResult?.hugRequest;
        if (!updatedRequest) return null;
        
        // Map to expected client response format
        return {
          id: updatedRequest.id,
          status: updatedRequest.status,
          // Use createdAt as a substitute for updatedAt since the field doesn't exist
          updatedAt: updatedRequest.createdAt
        };
      } catch (error) {
        return handleError('Mutation.respondToHugRequest', error);
      }
    }
  }
};