import { JwtService } from '@nestjs/jwt';
export default class AuthPlugin {
    private jwtService;
    constructor(jwtService: JwtService);
    onInit(options: any): any;
    onExecute(execute: any): any;
    private requiresAuth;
}
