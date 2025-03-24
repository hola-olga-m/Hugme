/**
 * GraphQL Mesh Cache Plugin
 * 
 * Implements caching for GraphQL queries to improve performance
 * while ensuring data consistency across services.
 */

// Simple in-memory cache - for production, use Redis or another distributed cache
const cache = new Map();

// Cache TTL settings (in milliseconds)
const TTL = {
  SHORT: 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
};

// Query types and their cache TTLs
const QUERY_CACHE_CONFIG = {
  // User queries
  'user': TTL.SHORT,
  'users': TTL.SHORT,
  
  // Mood queries
  'mood': TTL.SHORT,
  'moods': TTL.SHORT,
  'moodHistory': TTL.MEDIUM,
  'moodStreak': TTL.SHORT,
  'moodAnalytics': TTL.MEDIUM,
  'communityMoods': TTL.SHORT,
  
  // Hug queries
  'hug': TTL.SHORT,
  'sentHugs': TTL.SHORT,
  'receivedHugs': TTL.SHORT,
  'communityHugs': TTL.SHORT,
  
  // Aggregated queries
  'userProfile': TTL.SHORT,
  'communityFeed': TTL.SHORT,
  
  // Service metadata
  '_service': TTL.LONG,
};

// Queries that should never be cached
const UNCACHEABLE_QUERIES = [
  'currentUser', 
  'wellnessDashboard', 
  'notifications'
];

module.exports = {
  // Before executing the operation
  async onOperation(executionArgs, context) {
    const { operationName, operation, document } = executionArgs;
    
    // Only cache queries, not mutations or subscriptions
    if (operation.operation !== 'query') {
      return executionArgs;
    }
    
    // Skip caching for uncacheable queries
    if (UNCACHEABLE_QUERIES.includes(operationName)) {
      return executionArgs;
    }
    
    // Determine if this query is cacheable and for how long
    const ttl = QUERY_CACHE_CONFIG[operationName];
    if (!ttl) {
      // Default to not caching if not in config
      return executionArgs;
    }
    
    // Create a cache key from the operation and variables
    const cacheKey = getCacheKey(operationName, executionArgs.args);
    
    // Check if in cache and not expired
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && cachedItem.expiresAt > Date.now()) {
      // Return cached result
      context.cachedResult = cachedItem.data;
    }
    
    // Store the cache key and TTL in context for post-processing
    context.cacheKey = cacheKey;
    context.cacheTTL = ttl;
    
    return executionArgs;
  },
  
  // After getting the operation result
  async onResult(result, executionArgs, context) {
    // If result is from cache, return it directly
    if (context.cachedResult) {
      return context.cachedResult;
    }
    
    // If result should be cached
    if (context.cacheKey && context.cacheTTL && result.data) {
      // Store result in cache
      cache.set(context.cacheKey, {
        data: result,
        expiresAt: Date.now() + context.cacheTTL
      });
    }
    
    return result;
  },
  
  // Handle cache invalidation
  async onMutation(executionArgs, context) {
    const { operationName } = executionArgs;
    
    // Invalidate cache for specific operations
    const invalidations = {
      // User mutations
      'updateUser': ['user'],
      'createUserProfile': ['user'],
      'updateUserProfile': ['user'],
      
      // Mood mutations
      'createMood': ['moods', 'moodHistory', 'moodStreak', 'moodAnalytics', 'communityMoods', 'userProfile', 'communityFeed'],
      'updateMood': ['mood', 'moods', 'moodHistory', 'moodAnalytics', 'communityMoods', 'userProfile', 'communityFeed'],
      'deleteMood': ['moods', 'moodHistory', 'moodStreak', 'moodAnalytics', 'communityMoods', 'userProfile', 'communityFeed'],
      
      // Hug mutations
      'sendHug': ['sentHugs', 'receivedHugs', 'communityHugs', 'userProfile', 'communityFeed'],
      'createGroupHug': ['communityHugs', 'communityFeed'],
    };
    
    // Get patterns to invalidate
    const patterns = invalidations[operationName] || [];
    
    // Invalidate matching cache entries
    if (patterns.length > 0) {
      invalidateCache(patterns);
    }
    
    return executionArgs;
  }
};

/**
 * Generate a cache key from operation name and variables
 * @param {string} operationName - GraphQL operation name
 * @param {Object} variables - Operation variables
 * @returns {string} Cache key
 */
function getCacheKey(operationName, variables) {
  // Special handling for user-specific queries
  if (variables && variables.userId) {
    return `${operationName}:user:${variables.userId}:${JSON.stringify(variables)}`;
  }
  
  // Generic key for other queries
  return `${operationName}:${JSON.stringify(variables || {})}`;
}

/**
 * Invalidate cache entries matching patterns
 * @param {Array<string>} patterns - Patterns to match for invalidation
 */
function invalidateCache(patterns) {
  // Find keys that match patterns
  const keysToInvalidate = [];
  
  for (const key of cache.keys()) {
    for (const pattern of patterns) {
      if (key.startsWith(pattern + ':')) {
        keysToInvalidate.push(key);
        break;
      }
    }
  }
  
  // Delete matching keys
  for (const key of keysToInvalidate) {
    cache.delete(key);
  }
  
  console.log(`Cache invalidation: removed ${keysToInvalidate.length} entries`);
}