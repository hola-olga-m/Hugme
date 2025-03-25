import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLMeshService } from './graphql-mesh.service';
export declare class GraphQLSdkService implements OnModuleInit {
    private graphqlMeshService;
    private configService;
    private readonly logger;
    private client;
    private sdk;
    constructor(graphqlMeshService: GraphQLMeshService, configService: ConfigService);
    onModuleInit(): Promise<void>;
    private createProxySdk;
    execute(query: string, variables?: Record<string, any>, context?: Record<string, any>): Promise<any>;
    getSdk(): any;
}
