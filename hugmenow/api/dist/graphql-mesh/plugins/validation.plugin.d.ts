import { ExecuteMeshFn, GetMeshOptions, MeshPlugin } from '@graphql-mesh/types';
export default class ValidationPlugin implements MeshPlugin {
    private readonly logger;
    onInit(options: GetMeshOptions): GetMeshOptions;
    onExecute(execute: ExecuteMeshFn): ExecuteMeshFn;
    private createMaxDepthValidationRule;
    private createMaxAliasesValidationRule;
    private createDisableIntrospectionRule;
    private formatError;
    private getErrorCode;
    private getUserFriendlyMessage;
}
