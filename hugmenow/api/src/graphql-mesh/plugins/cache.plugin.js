const { Logger } = require('@nestjs/common');

// Cache entry with timestamp for TTL validation
class CacheEntry {
  constructor(data) {
    this.data = data;
    this.timestamp = Date.now();
  }
}

class CachePlugin {
  constructor(options = {}) {
    this.logger = new Logger('GraphQLCache');
    this.cache = new Map();
    this.ttl = options.ttl || 300000; // Default: 5 minutes (300,000 ms)
    this.maxSize = options.maxSize || 1000; // Default: max 1000 entries
    this.statistics = {
      hits: 0,
      misses: 0,
      operations: 0
    };
  }

  onInit() {
    return [{
      name: 'GraphQLCachePlugin',
      onExecute: async ({ args, setResult }) => {
        // Skip cache for mutations and subscriptions
        if (args.contextValue.operationType !== 'query') {
          return;
        }

        // Skip if cache directive explicitly says not to cache
        if (this.hasDirective(args.document, 'cacheControl', 'skip')) {
          this.logger.debug('Cache skipped due to directive');
          return;
        }

        this.statistics.operations++;
        
        // Generate cache key from operation and variables
        const cacheKey = this.generateCacheKey(args.document, args.variableValues);
        
        // Check if we have a valid cached response
        const cachedEntry = this.cache.get(cacheKey);
        if (cachedEntry && (Date.now() - cachedEntry.timestamp < this.ttl)) {
          this.statistics.hits++;
          this.logger.debug(`Cache hit for key: ${cacheKey}`);
          setResult(cachedEntry.data);
          return;
        }
        
        this.statistics.misses++;
        // No cache hit, will continue with normal execution
        // and cache the result in onExecuteDone hook
      },
      
      onExecuteDone: ({ args, result }) => {
        // Don't cache errors or non-query operations
        if (
          result.errors || 
          args.contextValue.operationType !== 'query'
        ) {
          return;
        }
        
        // Don't cache if directive says not to
        if (this.hasDirective(args.document, 'cacheControl', 'skip')) {
          return;
        }
        
        // Generate cache key from operation and variables
        const cacheKey = this.generateCacheKey(args.document, args.variableValues);
        
        // Store result in cache
        this.cache.set(cacheKey, new CacheEntry(result));
        this.logger.debug(`Cached result for key: ${cacheKey}`);
        
        // Prune cache if it's too large
        this.pruneCache();
      }
    }];
  }

  // Generate a cache key based on the operation and variables
  generateCacheKey(document, variables = {}) {
    // Extract operation name or use document hash
    let operationName = 'anonymous';
    if (document && document.definitions) {
      const operationDef = document.definitions.find(
        def => def.kind === 'OperationDefinition'
      );
      if (operationDef && operationDef.name) {
        operationName = operationDef.name.value;
      }
    }
    
    // Create key from operation name and stringified variables
    return `${operationName}:${JSON.stringify(variables)}`;
  }

  // Check if a document has a specific directive
  hasDirective(document, directiveName, argumentName) {
    if (!document || !document.definitions) return false;
    
    return document.definitions.some(definition => {
      if (definition.kind !== 'OperationDefinition') return false;
      
      if (definition.directives) {
        return definition.directives.some(directive => {
          if (directive.name.value !== directiveName) return false;
          
          if (!argumentName) return true;
          
          return directive.arguments && directive.arguments.some(arg => {
            return arg.name.value === argumentName && 
                  arg.value.kind === 'BooleanValue' && 
                  arg.value.value === true;
          });
        });
      }
      return false;
    });
  }

  // Remove old entries if cache exceeds maximum size
  pruneCache() {
    if (this.cache.size <= this.maxSize) return;
    
    this.logger.debug(`Pruning cache (size: ${this.cache.size}, max: ${this.maxSize})`);
    
    // Sort entries by timestamp (oldest first)
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest 20% of entries
    const removeCount = Math.ceil(this.maxSize * 0.2);
    for (let i = 0; i < removeCount && i < entries.length; i++) {
      this.cache.delete(entries[i][0]);
    }
    
    this.logger.debug(`Cache pruned to ${this.cache.size} entries`);
  }

  // Clear the entire cache
  clearCache() {
    this.cache.clear();
    this.logger.log('Cache cleared');
  }

  // Get cache statistics
  getCacheStats() {
    const hitRate = this.statistics.operations > 0 
      ? this.statistics.hits / this.statistics.operations 
      : 0;
    
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
      hitRate: hitRate.toFixed(2),
      hits: this.statistics.hits,
      misses: this.statistics.misses,
      operations: this.statistics.operations
    };
  }
}

module.exports = CachePlugin;