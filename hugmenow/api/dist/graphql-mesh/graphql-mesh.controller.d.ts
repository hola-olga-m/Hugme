import { Request, Response } from 'express';
import { GraphQLMeshService } from './graphql-mesh.service';
import { ShieldMiddleware } from '../permissions/shield.middleware';
import { GraphQLSdkService } from './sdk.service';
export declare class GraphQLMeshController {
    private graphqlMeshService;
    private shieldMiddleware;
    private graphqlSdkService;
    private readonly logger;
    constructor(graphqlMeshService: GraphQLMeshService, shieldMiddleware: ShieldMiddleware, graphqlSdkService: GraphQLSdkService);
    processGraphQLRequest(body: any, headers: any, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getSchema(): string;
    getMeshInfo(): {
        version: string;
        features: string[];
        endpoints: {
            graphql: string;
            schema: string;
            info: string;
        };
    };
    sdkExample(res: Response): Promise<Response<any, Record<string, any>>>;
}
