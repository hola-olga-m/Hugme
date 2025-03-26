import { User } from '../../users/entities/user.entity';
export declare class Mood {
    id: string;
    score: number;
    note?: string;
    isPublic: boolean;
    user: User;
    userId: string;
    createdAt: Date;
}
