import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLSchema } from 'graphql';
export declare class GraphQLMeshService implements OnModuleInit {
    private configService;
    private readonly logger;
    private mesh;
    private sdl;
    private schema;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    getSchema(): GraphQLSchema;
    getSDL(): string;
    execute({ query, variables, context }: {
        query: string;
        variables?: Record<string, any>;
        context?: Record<string, any>;
    }): Promise<any>;
}
