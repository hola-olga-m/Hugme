/**
 * GraphQL Mesh Logger Plugin
 * 
 * This plugin provides enhanced logging capabilities for the GraphQL Mesh gateway,
 * including request timing, error logging, and more.
 */

const { v4: uuidv4 } = require('uuid');

// Simple color utility for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Log levels
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

module.exports = {
  onContext(context, options = {}) {
    // Create a request ID
    const requestId = uuidv4();
    
    // Measure request start time
    const startTime = Date.now();
    
    // Set log level (default to info)
    const logLevel = LOG_LEVELS[options.level || 'info'];
    
    // Add request ID and timing to context
    return {
      ...context,
      requestId,
      startTime,
      logLevel,
      
      // Add logger methods to context
      logger: {
        debug: createLogMethod('debug', requestId, logLevel),
        info: createLogMethod('info', requestId, logLevel),
        warn: createLogMethod('warn', requestId, logLevel),
        error: createLogMethod('error', requestId, logLevel)
      }
    };
  },
  
  onOperation(operationContext, options) {
    const { contextValue, operationName, operation } = operationContext;
    const { requestId, logLevel, logger } = contextValue;
    
    // Log operation start
    if (LOG_LEVELS.info >= logLevel) {
      console.log(
        `${colors.cyan}[${requestId}]${colors.reset} ${colors.green}Operation started:${colors.reset}`,
        `${operation.operation} ${operationName || 'anonymous'}`
      );
    }
    
    return operationContext;
  },
  
  onResult(result, operationContext, options) {
    const { contextValue, operationName, operation } = operationContext;
    const { requestId, startTime, logLevel } = contextValue;
    
    // Calculate execution time
    const duration = Date.now() - startTime;
    
    // Log operation result
    if (LOG_LEVELS.info >= logLevel) {
      console.log(
        `${colors.cyan}[${requestId}]${colors.reset} ${colors.green}Operation completed:${colors.reset}`,
        `${operation.operation} ${operationName || 'anonymous'}`,
        `in ${duration}ms`
      );
    }
    
    // Log errors if present
    if (result.errors && result.errors.length > 0) {
      console.error(
        `${colors.cyan}[${requestId}]${colors.reset} ${colors.red}Operation errors:${colors.reset}`,
        result.errors.map(err => err.message || err)
      );
    }
    
    // Add execution metadata to extensions
    return {
      ...result,
      extensions: {
        ...(result.extensions || {}),
        requestId,
        duration,
        timestamp: new Date().toISOString()
      }
    };
  }
};

// Helper to create log method based on level
function createLogMethod(level, requestId, minLevel) {
  return (message, ...args) => {
    if (LOG_LEVELS[level] >= minLevel) {
      const color = getColorForLevel(level);
      console.log(
        `${colors.cyan}[${requestId}]${colors.reset} ${color}[${level.toUpperCase()}]${colors.reset}`,
        message,
        ...args
      );
    }
  };
}

// Get color based on log level
function getColorForLevel(level) {
  switch (level) {
    case 'debug': return colors.magenta;
    case 'info': return colors.green;
    case 'warn': return colors.yellow;
    case 'error': return colors.red;
    default: return colors.white;
  }
}