/**
 * WebSocket Authentication Bridge Plugin for GraphQL Mesh
 * 
 * This plugin bridges the gap between the existing WebSocket-based authentication
 * and the new GraphQL Mesh authentication system.
 * 
 * It provides compatibility for anonymous users and existing tokens.
 */

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Store anonymous user sessions
const anonymousUsers = new Map();

module.exports = {
  // Before processing the request
  async onRequest(request, context) {
    // Extract token from Authorization header
    const token = request.headers.authorization?.split(' ')[1] || '';
    
    if (token) {
      try {
        // Try to verify the token - this will work for regular users
        const decoded = jwt.verify(
          token, 
          process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production'
        );
        
        // Attach user data to context for resolvers
        context.user = decoded;
      } catch (error) {
        // Token verification failed - check if it's an anonymous token
        try {
          const decodedWithoutVerify = jwt.decode(token);
          
          if (decodedWithoutVerify && decodedWithoutVerify.isAnonymous) {
            // Handle anonymous user tokens
            const userId = decodedWithoutVerify.userId;
            
            // Check if we have this anonymous user in our store
            if (anonymousUsers.has(userId)) {
              // Use the stored anonymous user data
              context.user = anonymousUsers.get(userId);
              console.log(`Anonymous user restored: ${userId}`);
            } else {
              // Create a new anonymous user session
              const anonymousUser = {
                userId,
                isAnonymous: true,
                nickname: decodedWithoutVerify.nickname || 'Guest',
                avatarId: decodedWithoutVerify.avatarId || 1,
                createdAt: new Date().toISOString()
              };
              
              // Store for future requests
              anonymousUsers.set(userId, anonymousUser);
              context.user = anonymousUser;
              console.log(`New anonymous user created: ${userId}`);
            }
          } else {
            console.error('Invalid token format');
          }
        } catch (decodeError) {
          console.error('Token decode error:', decodeError.message);
        }
      }
    } else {
      // No token provided - create a new anonymous session if needed
      const requestsAnonymousSession = request.headers['x-anonymous-session'] === 'true';
      
      if (requestsAnonymousSession) {
        const anonymousId = `anon-${uuidv4()}`;
        const anonymousUser = {
          userId: anonymousId,
          isAnonymous: true,
          nickname: 'Guest',
          avatarId: 1,
          createdAt: new Date().toISOString()
        };
        
        // Generate a JWT token for the anonymous user
        const token = jwt.sign(
          anonymousUser,
          process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production',
          { expiresIn: '24h' }
        );
        
        // Store for future requests
        anonymousUsers.set(anonymousId, anonymousUser);
        context.user = anonymousUser;
        context.anonymousToken = token;
        
        console.log(`New anonymous session created: ${anonymousId}`);
      }
    }
    
    return request;
  },
  
  // After getting the operation result
  async onResult(result, executionArgs, context) {
    // If we created a new anonymous session, add the token to the response
    if (context.anonymousToken) {
      return {
        ...result,
        extensions: {
          ...(result.extensions || {}),
          anonymousToken: context.anonymousToken
        }
      };
    }
    
    return result;
  },
  
  // Handle garbage collection for anonymous sessions
  async onSubscribe() {
    // Clean up expired anonymous sessions (older than 24 hours)
    const now = Date.now();
    const expiryTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    for (const [userId, userData] of anonymousUsers.entries()) {
      const createdAt = new Date(userData.createdAt).getTime();
      if (now - createdAt > expiryTime) {
        anonymousUsers.delete(userId);
        console.log(`Expired anonymous session removed: ${userId}`);
      }
    }
  }
};