import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
export declare class UsersResolver {
    private usersService;
    constructor(usersService: UsersService);
    users(): Promise<User[]>;
    user(id: string): Promise<User>;
    me(user: User): Promise<User>;
    updateUser(user: User, updateUserInput: UpdateUserInput): Promise<User>;
    removeUser(user: User): Promise<boolean>;
}
