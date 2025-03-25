const { Logger } = require('@nestjs/common');
const crypto = require('crypto');

/**
 * Cache entry with data and timestamp
 */
class CacheEntry {
  constructor(data, ttl = 60000) {
    this.data = data;
    this.timestamp = Date.now();
    this.ttl = ttl;
  }

  isExpired() {
    return Date.now() - this.timestamp > this.ttl;
  }
}

/**
 * GraphQL Mesh plugin for response caching
 */
class CachePlugin {
  constructor(options = {}) {
    this.logger = new Logger('GraphQLCache');
    this.cache = new Map();
    this.ttl = options.ttl || 60000; // Default TTL: 1 minute
    this.maxSize = options.maxSize || 1000; // Maximum cache size
    this.hits = 0;
    this.misses = 0;
  }

  onInit() {
    return [{
      name: 'GraphQLCachePlugin',
      onExecute: async ({ args, result }) => {
        // Check for cache directive
        if (this.hasDirective(args.document, 'cacheControl')) {
          const cacheKey = this.generateCacheKey(args.document, args.variableValues);
          
          // Store result in cache
          this.cache.set(cacheKey, new CacheEntry(result, this.ttl));
          
          // Trim cache if it exceeds max size
          if (this.cache.size > this.maxSize) {
            this.trimCache();
          }
        }
        
        return result;
      }
    }];
  }

  onExecute(execute) {
    return async (options) => {
      const { document, variableValues } = options;
      
      // Skip caching for mutations
      if (document.definitions.some(def => 
        def.kind === 'OperationDefinition' && def.operation === 'mutation')) {
        return execute(options);
      }
      
      // Check for no-cache directive
      if (this.hasDirective(document, 'noCache')) {
        return execute(options);
      }
      
      // Check for cacheControl directive
      if (this.hasDirective(document, 'cacheControl')) {
        const cacheKey = this.generateCacheKey(document, variableValues);
        const cached = this.cache.get(cacheKey);
        
        // Return cached result if valid
        if (cached && !cached.isExpired()) {
          this.hits++;
          return cached.data;
        }
        
        this.misses++;
        
        // Execute and cache result
        const result = await execute(options);
        this.cache.set(cacheKey, new CacheEntry(result, this.ttl));
        
        return result;
      }
      
      // Default execution without caching
      return execute(options);
    };
  }

  /**
   * Generate a unique cache key for a GraphQL operation
   */
  generateCacheKey(document, variables = {}) {
    const documentString = document.loc ? document.loc.source.body : '';
    const variablesString = JSON.stringify(variables || {});
    const hash = crypto
      .createHash('md5')
      .update(documentString + variablesString)
      .digest('hex');
      
    return hash;
  }

  /**
   * Check if document has a specific directive
   */
  hasDirective(document, directiveName) {
    if (!document || !document.definitions) {
      return false;
    }
    
    return document.definitions.some(definition => {
      // Check operation directives
      if (definition.directives && definition.directives.some(d => d.name.value === directiveName)) {
        return true;
      }
      
      // Check fields with directives
      if (definition.selectionSet && definition.selectionSet.selections) {
        return definition.selectionSet.selections.some(selection => {
          return selection.directives && selection.directives.some(d => d.name.value === directiveName);
        });
      }
      
      return false;
    });
  }

  /**
   * Remove oldest entries from cache to maintain max size
   */
  trimCache() {
    // Convert to array to sort by timestamp
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
    // Remove oldest 20% of entries
    const removeCount = Math.floor(this.cache.size * 0.2);
    entries.slice(0, removeCount).forEach(([key]) => {
      this.cache.delete(key);
    });
    
    this.logger.debug(`Trimmed cache, removed ${removeCount} entries`);
  }

  /**
   * Clear the entire cache
   */
  clearCache() {
    const size = this.cache.size;
    this.cache.clear();
    this.logger.log(`Cache cleared, removed ${size} entries`);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    const hitRate = this.hits + this.misses > 0 
      ? this.hits / (this.hits + this.misses) 
      : 0;
      
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: hitRate.toFixed(2),
      entries: Array.from(this.cache.keys())
    };
  }
}

module.exports = CachePlugin;