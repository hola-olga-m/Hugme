import { Friendship } from './entities/friendship.entity';
import { UsersService } from '../users/users.service';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { UpdateFriendshipInput } from './dto/update-friendship.input';
import { PostGraphileService } from '../postgraphile/postgraphile.service';
export declare class FriendsService {
    private postgraphileService;
    private usersService;
    private readonly friendshipsTable;
    constructor(postgraphileService: PostGraphileService, usersService: UsersService);
    createFriendRequest(createFriendshipInput: CreateFriendshipInput, requesterId: string): Promise<Friendship>;
    updateFriendship(updateFriendshipInput: UpdateFriendshipInput, userId: string): Promise<Friendship>;
    findFriendshipById(id: string): Promise<Friendship>;
    findFriendshipBetweenUsers(userId1: string, userId2: string): Promise<Friendship[]>;
    findFriendships(userId: string): Promise<Friendship[]>;
    findFriends(userId: string): Promise<Friendship[]>;
    findPendingFriendRequests(userId: string): Promise<Friendship[]>;
    findSentFriendRequests(userId: string): Promise<Friendship[]>;
    areFriends(userId1: string, userId2: string): Promise<boolean>;
    findMoodFollowing(userId: string): Promise<Friendship[]>;
}
