import { UsersService } from './users.service';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Response } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<User[]>;
    findMe(req: any): Promise<User>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserInput: UpdateUserInput, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
