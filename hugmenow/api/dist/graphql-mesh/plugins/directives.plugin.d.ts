import { ExecuteMeshFn, GetMeshOptions, MeshPlugin } from '@graphql-mesh/types';
export default class DirectivesPlugin implements MeshPlugin {
    onInit(options: GetMeshOptions): GetMeshOptions;
    onExecute(execute: ExecuteMeshFn): ExecuteMeshFn;
    private getDirective;
}
