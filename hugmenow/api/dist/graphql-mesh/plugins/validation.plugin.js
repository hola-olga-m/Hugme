"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const common_1 = require("@nestjs/common");
class ValidationPlugin {
    logger = new common_1.Logger('GraphQLValidation');
    onInit(options) {
        if (!options.validationRules) {
            options.validationRules = [];
        }
        options.validationRules.push(this.createMaxDepthValidationRule(10), this.createMaxAliasesValidationRule(20), this.createDisableIntrospectionRule(false));
        return options;
    }
    onExecute(execute) {
        return async (options) => {
            try {
                const result = await execute(options);
                if (result.errors) {
                    result.errors = result.errors.map(error => this.formatError(error));
                }
                return result;
            }
            catch (error) {
                const formattedError = this.formatError(error);
                return { errors: [formattedError] };
            }
        };
    }
    createMaxDepthValidationRule(maxDepth) {
        return function maxDepthValidationRule(context) {
            return {
                Field(node) {
                    const depth = this.getDepth(node, context);
                    if (depth > maxDepth) {
                        context.reportError(new graphql_1.GraphQLError(`Query exceeds maximum depth of ${maxDepth}`, [node]));
                    }
                },
                getDepth(node, context) {
                    let depth = 0;
                    let currentNode = node;
                    while (currentNode.kind !== 'Document') {
                        if (currentNode.kind === 'Field' || currentNode.kind === 'InlineFragment') {
                            depth++;
                        }
                        const parentType = context.getParentType();
                        if (!parentType)
                            break;
                        const parentNode = context.getParentNode();
                        if (!parentNode)
                            break;
                        currentNode = parentNode;
                    }
                    return depth;
                }
            };
        };
    }
    createMaxAliasesValidationRule(maxAliases) {
        return function maxAliasesValidationRule(context) {
            let aliasCount = 0;
            return {
                Alias() {
                    aliasCount++;
                    if (aliasCount > maxAliases) {
                        context.reportError(new graphql_1.GraphQLError(`Query exceeds maximum number of aliases (${maxAliases})`));
                    }
                }
            };
        };
    }
    createDisableIntrospectionRule(disableIntrospection) {
        return function disableIntrospectionRule(context) {
            if (!disableIntrospection)
                return {};
            return {
                Field(node) {
                    const fieldName = node.name.value;
                    if (fieldName === '__schema' || fieldName === '__type') {
                        context.reportError(new graphql_1.GraphQLError('GraphQL introspection is disabled in production environment', [node]));
                    }
                }
            };
        };
    }
    formatError(error) {
        this.logger.error(`GraphQL error: ${error.message}`, error.stack);
        const isProduction = process.env.NODE_ENV === 'production';
        if (isProduction) {
            const errorCode = this.getErrorCode(error);
            return new graphql_1.GraphQLError(this.getUserFriendlyMessage(error, errorCode), error.nodes, error.source, error.positions, error.path, error.originalError, {
                code: errorCode,
            });
        }
        else {
            return new graphql_1.GraphQLError(error.message, error.nodes, error.source, error.positions, error.path, error.originalError, {
                code: this.getErrorCode(error),
                stacktrace: error.stack,
                details: error.originalError?.details,
            });
        }
    }
    getErrorCode(error) {
        if (error.extensions?.code) {
            return error.extensions.code;
        }
        if (error.originalError?.name) {
            return error.originalError.name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
        }
        if (error.message.includes('not found')) {
            return 'NOT_FOUND';
        }
        if (error.message.includes('permission') || error.message.includes('unauthorized')) {
            return 'FORBIDDEN';
        }
        if (error.message.includes('authentication') || error.message.includes('unauthenticated')) {
            return 'UNAUTHENTICATED';
        }
        if (error.message.includes('validation')) {
            return 'VALIDATION_ERROR';
        }
        return 'INTERNAL_SERVER_ERROR';
    }
    getUserFriendlyMessage(error, code) {
        switch (code) {
            case 'NOT_FOUND':
                return 'The requested resource could not be found';
            case 'FORBIDDEN':
                return 'You do not have permission to perform this action';
            case 'UNAUTHENTICATED':
                return 'Authentication is required to access this resource';
            case 'VALIDATION_ERROR':
                return 'The provided data is invalid';
            case 'INTERNAL_SERVER_ERROR':
            default:
                return 'An unexpected error occurred';
        }
    }
}
exports.default = ValidationPlugin;
//# sourceMappingURL=validation.plugin.js.map