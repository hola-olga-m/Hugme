import { Mood } from './entities/mood.entity';
import { CreateMoodInput } from './dto/create-mood.input';
import { UpdateMoodInput } from './dto/update-mood.input';
import { UsersService } from '../users/users.service';
import { PostGraphileService } from '../postgraphile/postgraphile.service';
import { FriendsService } from '../friends/friends.service';
export declare class MoodsService {
    private postgraphileService;
    private usersService;
    private friendsService;
    private readonly moodsTable;
    constructor(postgraphileService: PostGraphileService, usersService: UsersService, friendsService: FriendsService);
    create(createMoodInput: CreateMoodInput, userId: string): Promise<Mood>;
    findAll(): Promise<Mood[]>;
    findPublic(): Promise<Mood[]>;
    findByUser(userId: string): Promise<Mood[]>;
    findOne(id: string): Promise<Mood>;
    update(id: string, updateMoodInput: UpdateMoodInput, userId: string): Promise<Mood>;
    remove(id: string, userId: string): Promise<boolean>;
    getUserMoodStreak(userId: string): Promise<number>;
    private convertToMoodEntity;
    findFriendsMoods(userId: string, limit?: number): Promise<Mood[]>;
}
