export default class CachePlugin {
    private readonly logger;
    private cache;
    private ttl;
    constructor(options?: {
        ttl?: number;
    });
    onInit(options: any): any;
    onExecute(execute: any): any;
    private generateCacheKey;
    private hasDirective;
    clearCache(): void;
    getCacheStats(): {
        size: number;
        entries: string[];
    };
}
