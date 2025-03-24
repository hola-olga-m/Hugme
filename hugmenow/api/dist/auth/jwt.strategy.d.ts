import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersRepository;
    constructor(configService: ConfigService, usersRepository: Repository<User>);
    validate(payload: any): Promise<{
        id: string;
        username: string;
        email: string;
        name: string;
        avatarUrl?: string;
        isAnonymous: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
