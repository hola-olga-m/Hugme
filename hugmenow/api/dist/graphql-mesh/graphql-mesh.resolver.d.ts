import { GraphQLMeshService } from './graphql-mesh.service';
export declare class GraphQLMeshResolver {
    private graphqlMeshService;
    constructor(graphqlMeshService: GraphQLMeshService);
    getMeshInfo(): Promise<{
        version: string;
        sources: string[];
        timestamp: string;
    }>;
    healthCheck(): Promise<{
        status: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        error: any;
        timestamp: string;
    }>;
}
