import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AnonymousLoginInput } from './dto/anonymous-login.input';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    login(loginInput: LoginInput): Promise<{
        accessToken: string;
        user: any;
    }>;
    register(registerInput: RegisterInput): Promise<{
        accessToken: string;
        user: {
            id: string;
            username: string;
            email: string;
            name: string;
            avatarUrl?: string;
            isAnonymous: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    anonymousLogin(anonymousLoginInput: AnonymousLoginInput): Promise<{
        accessToken: string;
        user: {
            id: string;
            username: string;
            email: string;
            name: string;
            avatarUrl?: string;
            isAnonymous: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
