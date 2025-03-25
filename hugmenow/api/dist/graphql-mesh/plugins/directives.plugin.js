"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
class DirectivesPlugin {
    onInit(options) {
        if (!options.transforms) {
            options.transforms = [];
        }
        options.transforms.push({
            transformSchema: (schema) => {
                return (0, utils_1.mapSchema)(schema, {
                    [utils_1.MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                        const upperCase = this.getDirective(schema, fieldConfig, 'upperCase');
                        if (upperCase) {
                            const { resolve = graphql_1.defaultFieldResolver } = fieldConfig;
                            fieldConfig.resolve = async (source, args, context, info) => {
                                const result = await resolve(source, args, context, info);
                                if (typeof result === 'string') {
                                    return result.toUpperCase();
                                }
                                return result;
                            };
                            return fieldConfig;
                        }
                        const deprecated = this.getDirective(schema, fieldConfig, 'deprecated');
                        if (deprecated) {
                            fieldConfig.deprecationReason = deprecated['reason'];
                            return fieldConfig;
                        }
                        const auth = this.getDirective(schema, fieldConfig, 'auth');
                        if (auth) {
                            const { resolve = graphql_1.defaultFieldResolver } = fieldConfig;
                            fieldConfig.resolve = async (source, args, context, info) => {
                                if (!context.user) {
                                    throw new Error('Authentication required');
                                }
                                if (auth.roles && auth.roles.length > 0) {
                                    const userRoles = context.user.roles || [];
                                    const hasRequiredRole = auth.roles.some(role => userRoles.includes(role));
                                    if (!hasRequiredRole) {
                                        throw new Error(`Requires one of the following roles: ${auth.roles.join(', ')}`);
                                    }
                                }
                                return resolve(source, args, context, info);
                            };
                            return fieldConfig;
                        }
                        const formatDate = this.getDirective(schema, fieldConfig, 'formatDate');
                        if (formatDate) {
                            const { resolve = graphql_1.defaultFieldResolver } = fieldConfig;
                            fieldConfig.resolve = async (source, args, context, info) => {
                                const result = await resolve(source, args, context, info);
                                if (result instanceof Date || typeof result === 'string') {
                                    const date = new Date(result);
                                    const format = formatDate.format || 'ISO';
                                    switch (format) {
                                        case 'ISO':
                                            return date.toISOString();
                                        case 'UTC':
                                            return date.toUTCString();
                                        case 'short':
                                            return date.toLocaleDateString();
                                        case 'long':
                                            return date.toLocaleString();
                                        default:
                                            return date.toISOString();
                                    }
                                }
                                return result;
                            };
                            return fieldConfig;
                        }
                        return fieldConfig;
                    },
                });
            },
        });
        return options;
    }
    onExecute(execute) {
        return execute;
    }
    getDirective(schema, object, directiveName) {
        const directives = object.astNode?.directives || [];
        const directive = directives.find((directive) => directive.name.value === directiveName);
        if (!directive) {
            return null;
        }
        const args = {};
        directive.arguments?.forEach((arg) => {
            const argName = arg.name.value;
            const value = arg.value;
            if (value.kind === 'StringValue') {
                args[argName] = value.value;
            }
            else if (value.kind === 'IntValue') {
                args[argName] = parseInt(value.value, 10);
            }
            else if (value.kind === 'BooleanValue') {
                args[argName] = value.value;
            }
            else if (value.kind === 'ListValue') {
                args[argName] = value.values.map((v) => v.value);
            }
        });
        return args;
    }
}
exports.default = DirectivesPlugin;
//# sourceMappingURL=directives.plugin.js.map