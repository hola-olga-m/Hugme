"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const graphql_1 = require("graphql");
const crypto = require("crypto");
class CachePlugin {
    logger = new common_1.Logger('GraphQLMeshCache');
    cache = new Map();
    ttl;
    constructor(options = {}) {
        this.ttl = options.ttl || 60 * 1000;
        this.logger.log(`Cache plugin initialized with TTL of ${this.ttl}ms`);
    }
    onInit(options) {
        return options;
    }
    onExecute(execute) {
        return async (options) => {
            const { operation, variables, context } = options;
            if (operation.operation === 'mutation' ||
                context.skipCache ||
                this.hasDirective(operation, 'cacheControl', 'skipCache')) {
                return execute(options);
            }
            const cacheKey = this.generateCacheKey(operation, variables);
            const cachedEntry = this.cache.get(cacheKey);
            if (cachedEntry && Date.now() - cachedEntry.timestamp < this.ttl) {
                this.logger.debug(`Cache hit for key: ${cacheKey}`);
                return { data: cachedEntry.data };
            }
            const result = await execute(options);
            if (result && !result.errors) {
                this.cache.set(cacheKey, {
                    data: result.data,
                    timestamp: Date.now(),
                });
                this.logger.debug(`Cached result for key: ${cacheKey}`);
            }
            return result;
        };
    }
    generateCacheKey(operation, variables = {}) {
        const operationString = (0, graphql_1.print)(operation);
        const variablesString = JSON.stringify(variables || {});
        const hash = crypto
            .createHash('md5')
            .update(`${operationString}:${variablesString}`)
            .digest('hex');
        return hash;
    }
    hasDirective(operation, directiveName, argumentName) {
        const directives = operation.definitions?.[0]?.directives || [];
        return directives.some((directive) => {
            if (directive.name.value !== directiveName)
                return false;
            if (!argumentName)
                return true;
            return directive.arguments?.some((arg) => arg.name.value === argumentName && arg.value.value === true);
        });
    }
    clearCache() {
        this.cache.clear();
        this.logger.log('Cache cleared');
    }
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys()),
        };
    }
}
exports.default = CachePlugin;
//# sourceMappingURL=cache.plugin.js.map