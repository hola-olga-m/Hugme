import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AnonymousLoginInput } from './dto/anonymous-login.input';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
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
