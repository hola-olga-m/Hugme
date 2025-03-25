import { ExecuteMeshFn, GetMeshOptions, MeshPlugin } from '@graphql-mesh/types';
export default class LoggerPlugin implements MeshPlugin {
    private readonly logger;
    onInit(options: GetMeshOptions): GetMeshOptions;
    onExecute(execute: ExecuteMeshFn): ExecuteMeshFn;
    onSubscribe(execute: ExecuteMeshFn): ExecuteMeshFn;
}
