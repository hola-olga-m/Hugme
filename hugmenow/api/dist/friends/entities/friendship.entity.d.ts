import { User } from '../../users/entities/user.entity';
export declare enum FriendshipStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    BLOCKED = "BLOCKED"
}
export declare class Friendship {
    id: string;
    requester: User;
    requesterId: string;
    recipient: User;
    recipientId: string;
    status: FriendshipStatus;
    createdAt: Date;
    updatedAt?: Date;
    followsMood: boolean;
}
