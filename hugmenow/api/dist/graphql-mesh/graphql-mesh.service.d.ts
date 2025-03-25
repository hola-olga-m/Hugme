import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class GraphQLMeshService implements OnModuleInit {
    private configService;
    private readonly logger;
    private mesh;
    private sdl;
    private schema;
    private enhancedSchema;
    private dbPool;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private createBaseSchema;
    private enhanceSchema;
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
