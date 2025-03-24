const chalk = require('chalk');

function formatTimestamp() {
  const now = new Date();
  return now.toISOString();
}

module.exports = {
  name: 'LoggerPlugin',
  
  onPreBuild: async () => {
    console.log(chalk.cyan(`[${formatTimestamp()}] GraphQL Mesh: Building schema...`));
  },
  
  onPostBuild: async ({ schema }) => {
    const typeCount = Object.keys(schema.getTypeMap()).length;
    console.log(chalk.green(`[${formatTimestamp()}] GraphQL Mesh: Schema built successfully with ${typeCount} types`));
  },
  
  onRequest: async ({ request, context }) => {
    // Get the operation name from the request if available
    let operationName = 'Unknown operation';
    try {
      if (request.body && typeof request.body === 'string') {
        const parsedBody = JSON.parse(request.body);
        operationName = parsedBody.operationName || 'Anonymous operation';
      } else if (request.body && request.body.operationName) {
        operationName = request.body.operationName;
      }
    } catch (error) {
      // Silently fail if there's an issue parsing the body
    }
    
    // Store the start time for calculating operation duration
    context.requestStartTime = Date.now();
    context.operationName = operationName;
    
    // Add the request ID to the context for tracking
    const requestId = context.requestId || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    context.requestId = requestId;
    
    console.log(chalk.blue(`[${formatTimestamp()}] GraphQL Mesh Request [${requestId}]: ${operationName}`));
    
    return { request, context };
  },
  
  onResponse: async ({ response, context }) => {
    // Calculate duration of the operation
    const duration = Date.now() - (context.requestStartTime || Date.now());
    const requestId = context.requestId || 'unknown';
    const operationName = context.operationName || 'Unknown operation';
    
    if (response.errors) {
      // Log errors
      console.error(chalk.red(`[${formatTimestamp()}] GraphQL Mesh Error [${requestId}]: ${operationName} (${duration}ms)`));
      response.errors.forEach(error => {
        console.error(chalk.red(`  - ${error.message}`));
        if (error.locations) {
          error.locations.forEach(location => {
            console.error(chalk.red(`    at line ${location.line}, column ${location.column}`));
          });
        }
        if (error.path) {
          console.error(chalk.red(`    in path: ${error.path.join('.')}`));
        }
      });
    } else {
      // Log successful response
      console.log(chalk.green(`[${formatTimestamp()}] GraphQL Mesh Response [${requestId}]: ${operationName} (${duration}ms)`));
    }
    
    return { response, context };
  }
};