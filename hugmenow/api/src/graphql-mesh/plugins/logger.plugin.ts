import { Logger } from '@nestjs/common';
import { Plugin } from '@envelop/core';

export default class LoggerPlugin {
  private readonly logger = new Logger('GraphQL');
  
  onInit(options: any): any {
    this.logger.log('Initializing GraphQL with Logger Plugin');
    return options;
  }

  onExecute(execute: any): any {
    return async (options) => {
      const { operation, rootValue, args, context, info } = options;
      
      const operationType = operation.operation;
      const operationName = operation.name?.value || 'anonymous';
      
      const startTime = Date.now();
      this.logger.log(`Operation ${operationType} ${operationName} started`);
      
      try {
        const result = await execute(options);
        
        const duration = Date.now() - startTime;
        this.logger.log(`Operation ${operationType} ${operationName} completed in ${duration}ms`);
        
        if (result.errors) {
          this.logger.error(
            `Errors in operation ${operationType} ${operationName}:`,
            result.errors
          );
        }
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        this.logger.error(
          `Operation ${operationType} ${operationName} failed after ${duration}ms:`,
          error.stack || error.message
        );
        throw error;
      }
    };
  }
  
  onSubscribe(execute: any): any {
    return async (options) => {
      const { operation } = options;
      const operationName = operation.name?.value || 'anonymous';
      
      this.logger.log(`Subscription ${operationName} initiated`);
      
      return execute(options);
    };
  }
}