import { AppService, AppInfo } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getAppInfo(): AppInfo;
}
