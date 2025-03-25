const { Logger } = require('@nestjs/common');

/**
 * GraphQL Mesh plugin for detailed request/response logging
 */
class LoggerPlugin {
  constructor() {
    this.logger = new Logger('GraphQL');
    this.queryCount = 0;
    this.mutationCount = 0;
    this.subscriptionCount = 0;
    this.errorCount = 0;
    this.startTime = Date.now();
  }

  onInit() {
    return [{
      name: 'GraphQLLoggerPlugin'
    }];
  }

  onExecute(execute) {
    return async (options) => {
      const { document, contextValue, variableValues } = options;
      
      try {
        // Extract operation details
        const operation = this.getOperationDetails(document);
        const requestContext = {
          user: contextValue?.user?.id || 'anonymous',
          ip: contextValue?.req?.ip || 'unknown',
          userAgent: contextValue?.req?.headers?.['user-agent'] || 'unknown'
        };
        
        // Start timing
        const startTime = process.hrtime();
        
        // Log request
        this.logRequest(operation, variableValues, requestContext);
        
        // Execute the request
        const result = await execute(options);
        
        // Calculate execution time
        const timeDiff = process.hrtime(startTime);
        const duration = (timeDiff[0] * 1000 + timeDiff[1] / 1000000).toFixed(2);
        
        // Log response
        this.logResponse(operation, result, duration);
        
        // Update stats
        this.updateStats(operation, result);
        
        return result;
      } catch (error) {
        this.errorCount++;
        this.logger.error(`GraphQL execution error: ${error.message}`, error.stack);
        throw error;
      }
    };
  }

  onSubscribe(subscribe) {
    return async (options) => {
      try {
        const { document, contextValue } = options;
        const operation = this.getOperationDetails(document);
        
        this.logger.log(`Subscription started: ${operation.name || 'unnamed'} [${contextValue?.user?.id || 'anonymous'}]`);
        this.subscriptionCount++;
        
        return subscribe(options);
      } catch (error) {
        this.errorCount++;
        this.logger.error(`Subscription error: ${error.message}`, error.stack);
        throw error;
      }
    };
  }

  /**
   * Extract operation details from GraphQL document
   */
  getOperationDetails(document) {
    if (!document || !document.definitions || document.definitions.length === 0) {
      return { type: 'unknown', name: 'unknown' };
    }
    
    const operationDefinition = document.definitions.find(
      def => def.kind === 'OperationDefinition'
    );
    
    if (!operationDefinition) {
      return { type: 'unknown', name: 'unknown' };
    }
    
    return {
      type: operationDefinition.operation || 'query',
      name: operationDefinition.name?.value || 'unnamed'
    };
  }

  /**
   * Log GraphQL request details
   */
  logRequest(operation, variables, context) {
    const sanitizedVariables = this.sanitizeVariables(variables || {});
    
    this.logger.log(
      `GraphQL ${operation.type} received: ${operation.name} | ` +
      `User: ${context.user} | IP: ${context.ip}`
    );
    
    if (Object.keys(sanitizedVariables).length > 0) {
      this.logger.debug(`Variables: ${JSON.stringify(sanitizedVariables)}`);
    }
  }

  /**
   * Log GraphQL response details
   */
  logResponse(operation, result, duration) {
    const errorCount = result?.errors?.length || 0;
    
    if (errorCount > 0) {
      this.logger.warn(
        `GraphQL ${operation.type} ${operation.name} completed with ${errorCount} errors in ${duration}ms`
      );
      
      result.errors.forEach((error, i) => {
        this.logger.warn(`Error ${i + 1}: ${error.message}`);
      });
    } else {
      this.logger.log(
        `GraphQL ${operation.type} ${operation.name} completed successfully in ${duration}ms`
      );
    }
  }

  /**
   * Update operation statistics
   */
  updateStats(operation, result) {
    switch (operation.type) {
      case 'query':
        this.queryCount++;
        break;
      case 'mutation':
        this.mutationCount++;
        break;
      case 'subscription':
        this.subscriptionCount++;
        break;
    }
    
    if (result?.errors && result.errors.length > 0) {
      this.errorCount++;
    }
  }

  /**
   * Remove sensitive data from variables
   */
  sanitizeVariables(variables) {
    const sanitized = { ...variables };
    const sensitiveFields = ['password', 'token', 'secret', 'credentials', 'apiKey'];
    
    // Mask sensitive fields
    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  /**
   * Get logger statistics
   */
  getStats() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const totalOperations = this.queryCount + this.mutationCount;
    const errorRate = totalOperations > 0 
      ? (this.errorCount / totalOperations).toFixed(2) 
      : 0;
    
    return {
      uptime,
      queries: this.queryCount,
      mutations: this.mutationCount,
      subscriptions: this.subscriptionCount,
      errors: this.errorCount,
      errorRate,
      operationsPerMinute: totalOperations > 0 
        ? (totalOperations / (uptime / 60)).toFixed(2) 
        : 0
    };
  }
}

module.exports = LoggerPlugin;