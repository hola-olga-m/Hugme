import { User } from '../../users/entities/user.entity';
export declare enum HugType {
    QUICK = "QUICK",
    WARM = "WARM",
    SUPPORTIVE = "SUPPORTIVE",
    COMFORTING = "COMFORTING",
    ENCOURAGING = "ENCOURAGING",
    CELEBRATORY = "CELEBRATORY"
}
export declare class Hug {
    id: string;
    type: HugType;
    message?: string;
    sender: User;
    senderId: string;
    recipient: User;
    recipientId: string;
    isRead: boolean;
    createdAt: Date;
}
