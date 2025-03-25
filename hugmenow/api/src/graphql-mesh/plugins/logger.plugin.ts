import { ExecuteMeshFn, GetMeshOptions, MeshPlugin } from '@graphql-mesh/types';
import { Logger } from '@nestjs/common';

export default class LoggerPlugin implements MeshPlugin {
  private readonly logger = new Logger('GraphQLMesh');
  
  onInit(options: GetMeshOptions): GetMeshOptions {
    this.logger.log('Initializing GraphQL Mesh with Logger Plugin');
    return options;
  }

  onExecute(execute: ExecuteMeshFn): ExecuteMeshFn {
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
  
  onSubscribe(execute: ExecuteMeshFn): ExecuteMeshFn {
    return async (options) => {
      const { operation } = options;
      const operationName = operation.name?.value || 'anonymous';
      
      this.logger.log(`Subscription ${operationName} initiated`);
      
      return execute(options);
    };
  }
}