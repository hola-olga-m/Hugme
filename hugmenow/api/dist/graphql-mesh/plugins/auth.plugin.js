"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
class AuthPlugin {
    logger = new common_1.Logger('GraphQLAuth');
    jwtSecret;
    constructor(options = {}) {
        this.jwtSecret = options.jwtSecret || process.env.JWT_SECRET || 'your-secret-key';
    }
    onInit(options) {
        return {
            ...options,
            context: async (initialContext) => {
                const { req } = initialContext;
                let user = null;
                const authHeader = req?.headers?.authorization;
                if (authHeader && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.substring(7);
                    try {
                        user = this.verifyToken(token);
                        this.logger.debug(`User authenticated: ${user.username || user.sub}`);
                    }
                    catch (error) {
                        this.logger.error(`Invalid JWT token: ${error.message}`);
                    }
                }
                return {
                    ...initialContext,
                    user,
                    isAuthenticated: !!user,
                };
            },
        };
    }
    onExecute(execute) {
        return async (options) => {
            const { operation, context } = options;
            const operationName = operation.name?.value;
            const isAuthRequired = this.requiresAuth(operation);
            if (isAuthRequired && !context.isAuthenticated) {
                throw new Error('Authentication required for this operation');
            }
            return execute(options);
        };
    }
    verifyToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
                throw new Error('Token expired');
            }
            return payload;
        }
        catch (error) {
            this.logger.error(`Error verifying token: ${error.message}`);
            throw new Error('Invalid token');
        }
    }
    requiresAuth(operation) {
        const operationName = operation.name?.value;
        const nonAuthOperations = ['login', 'register', 'anonymousLogin', 'publicQuery', '_health', '_sdl', '_meshInfo'];
        return !nonAuthOperations.includes(operationName);
    }
}
exports.default = AuthPlugin;
//# sourceMappingURL=auth.plugin.js.map