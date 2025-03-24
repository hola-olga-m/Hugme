import { HugType } from '../entities/hug.entity';
export declare class SendHugInput {
    recipientId: string;
    type: HugType;
    message?: string;
}
