import { User } from '../../users/entities/user.entity';
export declare enum HugRequestStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
export declare class HugRequest {
    id: string;
    message?: string;
    requester: User;
    requesterId: string;
    recipient?: User;
    recipientId?: string;
    isCommunityRequest: boolean;
    status: HugRequestStatus;
    createdAt: Date;
    respondedAt?: Date;
}
