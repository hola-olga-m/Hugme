export interface AppInfo {
    name: string;
    version: string;
    description: string;
    endpoints: {
        graphql: string;
        api: string;
    };
    features: string[];
    status: string;
}
export declare class AppService {
    getHello(): string;
    getAppInfo(): AppInfo;
}
