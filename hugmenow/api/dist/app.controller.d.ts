import { Request, Response } from 'express';
import { AppService, AppInfo } from './app.service';
import { AuthService } from './auth/auth.service';
import { LoginInput } from './auth/dto/login.input';
import { RegisterInput } from './auth/dto/register.input';
import { AnonymousLoginInput } from './auth/dto/anonymous-login.input';
export declare class AppController {
    private readonly appService;
    private readonly authService;
    private frontendBaseUrl;
    constructor(appService: AppService, authService: AuthService);
    getHello(): string;
    getAppInfo(): AppInfo;
    private getFrontendUrl;
    private handleRedirect;
    getLoginPage(req: Request): {
        url: string;
    };
    getRegisterPage(req: Request): {
        url: string;
    };
    getDashboardPage(req: Request): {
        url: string;
    };
    getMoodTrackerPage(req: Request): {
        url: string;
    };
    getHugCenterPage(req: Request): {
        url: string;
    };
    getProfilePage(req: Request): {
        url: string;
    };
    login(loginInput: LoginInput, res: Response): Promise<Response<any, Record<string, any>>>;
    register(registerInput: RegisterInput, res: Response): Promise<Response<any, Record<string, any>>>;
    anonymousLogin(anonymousLoginInput: AnonymousLoginInput, res: Response): Promise<Response<any, Record<string, any>>>;
}
