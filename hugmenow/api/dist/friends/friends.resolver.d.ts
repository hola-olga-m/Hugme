import { FriendsService } from './friends.service';
import { Friendship } from './entities/friendship.entity';
import { CreateFriendshipInput } from './dto/create-friendship.input';
import { UpdateFriendshipInput } from './dto/update-friendship.input';
export declare class FriendsResolver {
    private readonly friendsService;
    constructor(friendsService: FriendsService);
    sendFriendRequest(createFriendshipInput: CreateFriendshipInput, context: any): Promise<Friendship>;
    respondToFriendRequest(updateFriendshipInput: UpdateFriendshipInput, context: any): Promise<Friendship>;
    updateMoodFollowing(updateFriendshipInput: UpdateFriendshipInput, context: any): Promise<Friendship>;
    myFriends(context: any): Promise<Friendship[]>;
    pendingFriendRequests(context: any): Promise<Friendship[]>;
    sentFriendRequests(context: any): Promise<Friendship[]>;
    checkFriendship(userId: string, context: any): Promise<boolean>;
    moodFollowing(context: any): Promise<Friendship[]>;
}
