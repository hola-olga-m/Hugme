import { ExecuteMeshFn, GetMeshOptions, MeshPlugin } from '@graphql-mesh/types';
export default class CachePlugin implements MeshPlugin {
    private readonly logger;
    private cache;
    private ttl;
    constructor(options?: {
        ttl?: number;
    });
    onInit(options: GetMeshOptions): GetMeshOptions;
    onExecute(execute: ExecuteMeshFn): ExecuteMeshFn;
    private generateCacheKey;
    private hasDirective;
    clearCache(): void;
    getCacheStats(): {
        size: number;
        entries: string[];
    };
}
