export default class AuthPlugin {
    private readonly logger;
    private jwtSecret;
    constructor(options?: {
        jwtSecret?: string;
    });
    onInit(options: any): any;
    onExecute(execute: any): any;
    private verifyToken;
    private requiresAuth;
}
