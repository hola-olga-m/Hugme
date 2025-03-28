/**
 * GraphQL Mesh Custom Resolvers
 * 
 * This file provides resolvers for virtual fields and special query types
 * that are added to the schema by the Mesh configuration.
 */

// Client information resolver
export const resolvers = {
  // Root Query resolvers
  Query: {
    // Client information resolver - used for version checking and feature flags
    clientInfo: (_, args, context) => {
      // Get client information from context or environment variables
      const version = process.env.CLIENT_VERSION || '2.0.0';
      const buildDate = new Date().toISOString();
      const platform = process.env.CLIENT_PLATFORM || 'web';
      const features = (process.env.CLIENT_FEATURES || 'live-queries,mood-tracking').split(',');
      
      return {
        version,
        buildDate,
        platform,
        deviceInfo: 'GraphQL Mesh Gateway',
        features
      };
    },
    
    // Virtual field resolvers that map to real API fields with filters
    
    // Friends' moods - maps to allMoods with public visibility filter
    friendsMoods: async (root, args, context, info) => {
      // Forward to allMoods with specific filters for public visibility
      try {
        const result = await context.PostGraphileAPI.Query.allMoods({
          root,
          args: {
            ...args,
            filter: { isPublic: { equalTo: true } }
          },
          context,
          info
        });
        
        return result;
      } catch (error) {
        console.error('Error in friendsMoods resolver:', error);
        return [];
      }
    },
    
    // User moods - maps to allMoods filtered by userId
    userMoods: async (root, args, context, info) => {
      const { userId, ...restArgs } = args;
      
      try {
        // Forward to allMoods with user filter
        const result = await context.PostGraphileAPI.Query.allMoods({
          root,
          args: {
            ...restArgs,
            filter: { userId: { equalTo: userId } }
          },
          context,
          info
        });
        
        return result;
      } catch (error) {
        console.error('Error in userMoods resolver:', error);
        return [];
      }
    },
    
    // Sent hugs - maps to allHugs filtered by sender
    sentHugs: async (root, args, context, info) => {
      const { userId, ...restArgs } = args;
      
      try {
        // Forward to allHugs with sender filter
        const result = await context.PostGraphileAPI.Query.allHugs({
          root,
          args: {
            ...restArgs,
            filter: { senderId: { equalTo: userId } }
          },
          context,
          info
        });
        
        return result;
      } catch (error) {
        console.error('Error in sentHugs resolver:', error);
        return [];
      }
    },
    
    // Received hugs - maps to allHugs filtered by recipient
    receivedHugs: async (root, args, context, info) => {
      const { userId, ...restArgs } = args;
      
      try {
        // Forward to allHugs with recipient filter
        const result = await context.PostGraphileAPI.Query.allHugs({
          root,
          args: {
            ...restArgs,
            filter: { recipientId: { equalTo: userId } }
          },
          context,
          info
        });
        
        return result;
      } catch (error) {
        console.error('Error in receivedHugs resolver:', error);
        return [];
      }
    }
  },
  
  // Mutation resolvers for virtual fields
  Mutation: {
    // Create a new mood - with mock authentication support
    createMood: async (root, args, context, info) => {
      try {
        console.log('Creating mood with args:', JSON.stringify(args));
        console.log('Context headers:', context.headers);
        console.log('Context auth:', context.mockAuth);
        console.log('Context user:', context.user);
        
        // Check for mock authentication
        if (context.mockAuth && context.user) {
          console.log('Using mock authentication for createMood');
          
          // Create a simulated response for testing
          const mockResponse = {
            mood: {
              id: `mock-mood-${Date.now()}`,
              ...args.input.mood,
              createdAt: new Date().toISOString()
            }
          };
          
          console.log('Returning mock response:', JSON.stringify(mockResponse));
          return mockResponse;
        }
        
        // Forward to the real PostGraphile API
        return context.PostGraphileAPI.Mutation.createMood({
          root,
          args,
          context,
          info
        });
      } catch (error) {
        console.error('Error in createMood resolver:', error);
        throw error;
      }
    },
    
    // Send hug to friend - maps to createHug mutation with formatted parameters
    sendFriendHug: async (root, args, context, info) => {
      const { toUserId, moodId, message } = args;
      
      try {
        // Initialize senderId variable
        let senderId = null;
        
        // Check for mock authentication
        if (context.mockAuth && context.user) {
          // Use mock user ID for testing
          senderId = context.user.id;
          
          // Create a simulated response for testing
          return {
            id: `mock-hug-${Date.now()}`,
            senderId,
            recipientId: toUserId,
            moodId,
            message: message || '',
            isRead: false,
            createdAt: new Date().toISOString()
          };
        } else {
          // Regular authentication flow
          const authHeader = context.headers?.authorization || '';
          const token = authHeader.replace('Bearer ', '');
          
          // Try to decode the JWT token to get the user ID
          if (token) {
            try {
              // Simple JWT decoding (without verification)
              const payload = JSON.parse(
                Buffer.from(token.split('.')[1], 'base64').toString()
              );
              senderId = payload.userId || payload.sub;
            } catch (e) {
              console.error('Error decoding token:', e);
            }
          }
          
          if (!senderId) {
            throw new Error('Authentication required to send hugs');
          }
        }
        
        // Forward to createHug with transformed parameters
        const result = await context.PostGraphileAPI.Mutation.createHug({
          root,
          args: {
            input: {
              hug: {
                senderId,
                recipientId: toUserId,
                moodId,
                message: message || '',
                isRead: false
              }
            }
          },
          context,
          info
        });
        
        return result?.hug;
      } catch (error) {
        console.error('Error in sendFriendHug resolver:', error);
        throw error;
      }
    }
  },
  
  // Virtual field resolvers for Mood type
  Mood: {
    // Map score to intensity
    score: (parent) => parent.intensity
  },
  
  // Virtual field resolvers for Hug type
  Hug: {
    // Map fromUser to sender
    fromUser: (parent) => parent.sender,
    
    // Map toUser to recipient
    toUser: (parent) => parent.recipient,
    
    // Map read to isRead
    read: (parent) => parent.isRead
  }
};

export default { resolvers };