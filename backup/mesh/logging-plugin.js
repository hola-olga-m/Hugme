/**
 * GraphQL Mesh Logging Plugin
 * 
 * Provides detailed logging and monitoring for GraphQL operations
 * across all services in the HugMood application.
 */

// Generate a unique request ID
function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

module.exports = {
  // Called when a request is received
  async onRequest(request, context) {
    // Generate a unique ID for this request
    const requestId = generateRequestId();
    context.requestId = requestId;
    
    // Log basic request info
    const { headers, method, query } = request;
    const clientIp = headers['x-forwarded-for'] || 'unknown';
    const userAgent = headers['user-agent'] || 'unknown';
    
    console.log(
      `[${requestId}] Request received | ${method} | IP: ${clientIp} | UA: ${userAgent.substring(0, 50)}...`
    );
    
    // Record request start time
    context.requestStartTime = Date.now();
    
    return request;
  },

  // Called before executing an operation
  async onOperation(executionArgs, context) {
    const { operationName, operation, document } = executionArgs;
    
    console.log(
      `[${context.requestId}] ${operation.operation.toUpperCase()} operation: ${operationName || 'anonymous'}`
    );
    
    return executionArgs;
  },

  // Called after receiving a result
  async onResult(result, executionArgs, context) {
    const { operationName, operation } = executionArgs;
    const duration = Date.now() - context.requestStartTime;
    
    // Log result summary
    if (result.errors) {
      console.error(
        `[${context.requestId}] ${operation.operation.toUpperCase()} operation: ${operationName || 'anonymous'} | Status: ERROR | Duration: ${duration}ms`
      );
      
      // Log detailed errors
      result.errors.forEach((error, index) => {
        console.error(`[${context.requestId}] Error ${index + 1}: ${error.message}`);
        if (error.path) {
          console.error(`[${context.requestId}] Path: ${error.path.join('.')}`);
        }
      });
    } else {
      console.log(
        `[${context.requestId}] ${operation.operation.toUpperCase()} operation: ${operationName || 'anonymous'} | Status: SUCCESS | Duration: ${duration}ms`
      );
    }
    
    // Calculate response size
    const responseSize = JSON.stringify(result).length;
    console.log(`[${context.requestId}] Response size: ${responseSize} bytes`);
    
    // Track performance metrics
    // In a real app, send these to a monitoring system
    const metrics = {
      timestamp: new Date().toISOString(),
      requestId: context.requestId,
      operation: operation.operation,
      operationName: operationName || 'anonymous',
      duration,
      responseSize,
      success: !result.errors,
      errorCount: result.errors ? result.errors.length : 0
    };
    
    // Add metrics to result extensions
    return {
      ...result,
      extensions: {
        ...(result.extensions || {}),
        metrics: {
          requestId: context.requestId,
          duration,
          timestamp: metrics.timestamp
        }
      }
    };
  },

  // Called when an error occurs
  async onError(error, executionArgs, context) {
    console.error(`[${context.requestId}] Unhandled error: ${error.message}`);
    
    if (error.stack) {
      console.error(`[${context.requestId}] Stack trace: ${error.stack}`);
    }
    
    // Return enhanced error
    return {
      ...error,
      extensions: {
        ...(error.extensions || {}),
        requestId: context.requestId,
        timestamp: new Date().toISOString()
      }
    };
  },
  
  // Called at the end of a request
  async onRequestDone(request, context) {
    const duration = Date.now() - context.requestStartTime;
    
    console.log(
      `[${context.requestId}] Request completed | Total duration: ${duration}ms`
    );
    
    // Add a separator for easier log reading
    console.log('-'.repeat(80));
  }
};