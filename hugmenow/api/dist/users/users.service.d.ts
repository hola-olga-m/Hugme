import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    findByEmail(email: string | undefined): Promise<User | null>;
    findByUsername(username: string | undefined): Promise<User | null>;
    create(createUserData: Partial<User>): Promise<User>;
    update(id: string, updateUserData: Partial<User>): Promise<User>;
    remove(id: string): Promise<boolean>;
    createAnonymousUser(nickname: string, avatarUrl?: string): Promise<User>;
}
