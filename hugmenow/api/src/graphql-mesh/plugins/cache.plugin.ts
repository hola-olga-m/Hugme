import { Logger } from '@nestjs/common';
import { Plugin } from '@envelop/core';
import { print } from 'graphql';
import * as crypto from 'crypto';

interface CacheEntry {
  data: any;
  timestamp: number;
}

export default class CachePlugin {
  private readonly logger = new Logger('GraphQLCache');
  private cache: Map<string, CacheEntry> = new Map();
  private ttl: number;
  
  constructor(options: { ttl?: number } = {}) {
    this.ttl = options.ttl || 60 * 1000; // Default: 1 minute TTL
    this.logger.log(`Cache plugin initialized with TTL of ${this.ttl}ms`);
  }
  
  onInit(options: any): any {
    return options;
  }

  onExecute(execute: any): any {
    return async (options) => {
      const { operation, variables, context } = options;
      
      // Skip caching for mutations or if explicitly disabled for this operation
      if (
        operation.operation === 'mutation' || 
        context.skipCache || 
        this.hasDirective(operation, 'cacheControl', 'skipCache')
      ) {
        return execute(options);
      }
      
      // Generate a cache key based on the operation and variables
      const cacheKey = this.generateCacheKey(operation, variables);
      
      // Check if we have a valid cache entry
      const cachedEntry = this.cache.get(cacheKey);
      if (cachedEntry && Date.now() - cachedEntry.timestamp < this.ttl) {
        this.logger.debug(`Cache hit for key: ${cacheKey}`);
        return { data: cachedEntry.data };
      }
      
      // Execute the operation and cache the result
      const result = await execute(options);
      
      // Only cache successful results
      if (result && !result.errors) {
        this.cache.set(cacheKey, {
          data: result.data,
          timestamp: Date.now(),
        });
        this.logger.debug(`Cached result for key: ${cacheKey}`);
      }
      
      return result;
    };
  }
  
  private generateCacheKey(operation: any, variables: any = {}): string {
    const operationString = print(operation);
    const variablesString = JSON.stringify(variables || {});
    const hash = crypto
      .createHash('md5')
      .update(`${operationString}:${variablesString}`)
      .digest('hex');
    
    return hash;
  }
  
  private hasDirective(operation: any, directiveName: string, argumentName?: string): boolean {
    // Simple implementation to check for directives
    // In a real-world scenario, you would do a more thorough traversal
    const directives = operation.definitions?.[0]?.directives || [];
    
    return directives.some((directive: any) => {
      if (directive.name.value !== directiveName) return false;
      
      if (!argumentName) return true;
      
      return directive.arguments?.some((arg: any) => 
        arg.name.value === argumentName && arg.value.value === true
      );
    });
  }
  
  // Public method to clear the cache
  clearCache(): void {
    this.cache.clear();
    this.logger.log('Cache cleared');
  }
  
  // Public method to get cache stats
  getCacheStats(): { size: number, entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}