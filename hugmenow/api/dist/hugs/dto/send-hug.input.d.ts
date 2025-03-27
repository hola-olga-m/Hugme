import { HugType } from '../entities/hug.entity';
import { ExternalRecipientInput } from './external-recipient.input';
export declare class SendHugInput {
    recipientId?: string;
    externalRecipient?: ExternalRecipientInput;
    type: HugType;
    message?: string;
}
