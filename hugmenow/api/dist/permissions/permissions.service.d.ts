import { JwtService } from '@nestjs/jwt';
export declare class PermissionsService {
    private jwtService;
    private readonly logger;
    constructor(jwtService: JwtService);
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
