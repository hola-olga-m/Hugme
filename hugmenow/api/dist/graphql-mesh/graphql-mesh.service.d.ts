import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShieldMiddleware } from '../permissions/shield.middleware';
import { PermissionsService } from '../permissions/permissions.service';
export declare class GraphQLMeshService implements OnModuleInit {
    private configService;
    private shieldMiddleware;
    private permissionsService;
    private readonly logger;
    private mesh;
    private sdl;
    private schema;
    private enhancedSchema;
    private dbPool;
    constructor(configService: ConfigService, shieldMiddleware: ShieldMiddleware, permissionsService: PermissionsService);
    onModuleInit(): Promise<void>;
    private createBaseSchema;
    private enhanceSchema;
    private parseObject;
    private parseAst;
    private setupEnvelop;
    private generateSDL;
    getSchema(): any;
    getSDL(): string;
    execute({ query, variables, context }: {
        query: string;
        variables?: Record<string, any>;
        context?: Record<string, any>;
    }): Promise<any>;
}
