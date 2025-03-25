import { Request, Response } from 'express';
import { GraphQLMeshService } from './graphql-mesh.service';
export declare class GraphQLMeshController {
    private graphqlMeshService;
    constructor(graphqlMeshService: GraphQLMeshService);
    processGraphQLRequest(body: any, headers: any, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getSchema(): string;
}
