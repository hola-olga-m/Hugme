"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class LoggerPlugin {
    logger = new common_1.Logger('GraphQL');
    onInit(options) {
        this.logger.log('Initializing GraphQL with Logger Plugin');
        return options;
    }
    onExecute(execute) {
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
                    this.logger.error(`Errors in operation ${operationType} ${operationName}:`, result.errors);
                }
                return result;
            }
            catch (error) {
                const duration = Date.now() - startTime;
                this.logger.error(`Operation ${operationType} ${operationName} failed after ${duration}ms:`, error.stack || error.message);
                throw error;
            }
        };
    }
    onSubscribe(execute) {
        return async (options) => {
            const { operation } = options;
            const operationName = operation.name?.value || 'anonymous';
            this.logger.log(`Subscription ${operationName} initiated`);
            return execute(options);
        };
    }
}
exports.default = LoggerPlugin;
//# sourceMappingURL=logger.plugin.js.map