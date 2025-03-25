"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthPlugin {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
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
                        user = this.jwtService.verify(token);
                    }
                    catch (error) {
                        console.error('Invalid JWT token', error.message);
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
    requiresAuth(operation) {
        const operationName = operation.name?.value;
        const nonAuthOperations = ['login', 'register', 'anonymousLogin', 'publicQuery'];
        return !nonAuthOperations.includes(operationName);
    }
}
exports.default = AuthPlugin;
//# sourceMappingURL=auth.plugin.js.map