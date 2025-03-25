import { GraphQLSchema } from 'graphql';
import { PermissionsService } from './permissions.service';
export declare class ShieldMiddleware {
    private permissionsService;
    private readonly logger;
    constructor(permissionsService: PermissionsService);
    applyShield(schema: GraphQLSchema): GraphQLSchema;
}
