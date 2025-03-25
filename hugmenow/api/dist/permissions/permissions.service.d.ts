import { JwtService } from '@nestjs/jwt';
import { GraphQLScalarType } from 'graphql';
export declare class PermissionsService {
    private jwtService;
    private readonly logger;
    readonly CustomScalars: {
        Email: GraphQLScalarType<string, string>;
        URL: GraphQLScalarType<string, string>;
        Password: GraphQLScalarType<string, string>;
        UUID: GraphQLScalarType<string, string>;
    };
    constructor(jwtService: JwtService);
    getCustomScalarTypeDefs(): string;
    private isValidEmail;
    private isValidURL;
    private isValidPassword;
    private isValidUUID;
    validateRegisterInput: import("graphql-shield/typings/rules").InputRule<unknown>;
    validateLoginInput: import("graphql-shield/typings/rules").InputRule<unknown>;
    validateMoodInput: import("graphql-shield/typings/rules").InputRule<unknown>;
    validateHugInput: import("graphql-shield/typings/rules").InputRule<unknown>;
    validateHugRequestInput: import("graphql-shield/typings/rules").InputRule<unknown>;
    isAuthenticated: import("graphql-shield/typings/rules").Rule;
    isAdmin: import("graphql-shield/typings/rules").Rule;
    isSelf: import("graphql-shield/typings/rules").Rule;
    isOwnMood: import("graphql-shield/typings/rules").Rule;
    isPublicMood: import("graphql-shield/typings/rules").Rule;
    isHugSenderOrRecipient: import("graphql-shield/typings/rules").Rule;
    isHugRequestRequesterOrRecipient: import("graphql-shield/typings/rules").Rule;
    isCommunityHugRequest: import("graphql-shield/typings/rules").Rule;
    createPermissions(): import("graphql-middleware").IMiddlewareGenerator<any, any, any>;
}
