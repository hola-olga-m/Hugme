const { Logger } = require('@nestjs/common');

class LoggerPlugin {
  constructor() {
    this.logger = new Logger('GraphQL');
    this.metrics = {
      totalRequests: 0,
      operationTypes: {
        query: 0,
        mutation: 0,
        subscription: 0
      },
      errors: 0,
      responseTimeTotal: 0
    };
  }

  onInit() {
    return [{
      name: 'GraphQLLoggerPlugin',
      onParse: ({ params }) => {
        this.logger.verbose(`Parsing GraphQL document: ${params.source.slice(0, 100)}${params.source.length > 100 ? '...' : ''}`);
      },
      
      onValidate: ({ params }) => {
        this.logger.verbose(`Validating GraphQL document: ${params.documentAST.definitions.length} definitions`);
      },
      
      onExecute: ({ args }) => {
        // Determine operation type and name
        const operationType = this.getOperationType(args.document);
        const operationName = this.getOperationName(args.document) || 'anonymous';
        
        // Track metrics
        this.metrics.totalRequests++;
        if (this.metrics.operationTypes[operationType] !== undefined) {
          this.metrics.operationTypes[operationType]++;
        }
        
        // Extract variables safely for logging (hide sensitive data)
        const safeVariables = this.getSafeVariables(args.variableValues || {});
        
        // Log operation start
        this.logger.log(
          `Executing GraphQL ${operationType} "${operationName}" | Variables: ${JSON.stringify(safeVariables)}`
        );
        
        // Store start time for performance tracking
        args.contextValue._executionStartTime = Date.now();
      },
      
      onExecuteDone: ({ args, result }) => {
        // Calculate execution time
        const startTime = args.contextValue._executionStartTime || Date.now();
        const executionTime = Date.now() - startTime;
        this.metrics.responseTimeTotal += executionTime;
        
        // Determine operation type and name
        const operationType = this.getOperationType(args.document);
        const operationName = this.getOperationName(args.document) || 'anonymous';
        
        // Handle errors
        if (result.errors && result.errors.length > 0) {
          this.metrics.errors += result.errors.length;
          
          result.errors.forEach(error => {
            this.logger.error(
              `GraphQL error in ${operationType} "${operationName}": ${error.message}`,
              error.stack || 'No stack trace'
            );
          });
        }
        
        // Log success with execution time
        this.logger.log(
          `Completed GraphQL ${operationType} "${operationName}" in ${executionTime}ms | ` +
          `Data fields: ${result.data ? Object.keys(result.data).join(', ') : 'none'}`
        );
      }
    }];
  }

  getOperationType(document) {
    if (!document || !document.definitions || document.definitions.length === 0) {
      return 'query'; // Default
    }
    
    const operationDef = document.definitions.find(
      def => def.kind === 'OperationDefinition'
    );
    
    return operationDef ? operationDef.operation : 'query';
  }
  
  getOperationName(document) {
    if (!document || !document.definitions) return null;
    
    const operationDef = document.definitions.find(
      def => def.kind === 'OperationDefinition' && def.name
    );
    
    return operationDef && operationDef.name ? operationDef.name.value : null;
  }
  
  getSafeVariables(variables) {
    // Create a copy to avoid modifying the original
    const safeVars = { ...variables };
    
    // Replace sensitive fields with placeholder
    const sensitiveFields = ['password', 'token', 'secret', 'auth', 'key', 'credential'];
    for (const key in safeVars) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        safeVars[key] = '[REDACTED]';
      }
    }
    
    return safeVars;
  }
  
  getMetrics() {
    const avgResponseTime = this.metrics.totalRequests > 0 
      ? this.metrics.responseTimeTotal / this.metrics.totalRequests 
      : 0;
    
    const errorRate = this.metrics.totalRequests > 0 
      ? this.metrics.errors / this.metrics.totalRequests 
      : 0;
    
    return {
      totalRequests: this.metrics.totalRequests,
      operationTypes: this.metrics.operationTypes,
      errors: this.metrics.errors,
      avgResponseTime: avgResponseTime.toFixed(2),
      errorRate: errorRate.toFixed(4)
    };
  }
  
  resetMetrics() {
    this.metrics = {
      totalRequests: 0,
      operationTypes: {
        query: 0,
        mutation: 0,
        subscription: 0
      },
      errors: 0,
      responseTimeTotal: 0
    };
    this.logger.log('Logger metrics reset');
  }
}

module.exports = LoggerPlugin;