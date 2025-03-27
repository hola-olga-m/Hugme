import { FriendshipStatus } from '../entities/friendship.entity';
export declare class UpdateFriendshipInput {
    friendshipId: string;
    status?: FriendshipStatus;
    followMood?: boolean;
}
