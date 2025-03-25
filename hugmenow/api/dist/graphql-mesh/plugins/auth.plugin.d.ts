import { ExecuteMeshFn, GetMeshOptions, MeshPlugin } from '@graphql-mesh/types';
import { JwtService } from '@nestjs/jwt';
export default class AuthPlugin implements MeshPlugin {
    private jwtService;
    constructor(jwtService: JwtService);
    onInit(options: GetMeshOptions): GetMeshOptions;
    onExecute(execute: ExecuteMeshFn): ExecuteMeshFn;
    private requiresAuth;
}
