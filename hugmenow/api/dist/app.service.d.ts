export interface AppInfo {
    name: string;
    version: string;
    description: string;
    endpoints: {
        graphql: string;
        api: string;
    };
    paths: {
        login: string;
        register: string;
        dashboard: string;
        moodTracker: string;
        hugCenter: string;
        profile: string;
        info: string;
    };
    features: string[];
    status: string;
}
export declare class AppService {
    getAppInfo(): AppInfo;
}
