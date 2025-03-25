import { User } from './entities/user.entity';
import { PostGraphileService } from '../postgraphile/postgraphile.service';
export declare class UsersService {
    private postgraphileService;
    private readonly usersTable;
    constructor(postgraphileService: PostGraphileService);
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
    create(createUserData: Partial<User>): Promise<User>;
    update(id: string, updateUserData: Partial<User>): Promise<User>;
    remove(id: string): Promise<boolean>;
    createAnonymousUser(nickname: string, avatarUrl?: string): Promise<User>;
}
