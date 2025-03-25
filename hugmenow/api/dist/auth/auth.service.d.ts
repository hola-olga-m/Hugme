import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AnonymousLoginInput } from './dto/anonymous-login.input';
import { UsersService } from '../users/users.service';
import { PostGraphileService } from '../postgraphile/postgraphile.service';
export declare class AuthService {
    private usersService;
    private postgraphileService;
    private jwtService;
    private readonly usersTable;
    constructor(usersService: UsersService, postgraphileService: PostGraphileService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
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
    private generateToken;
}
