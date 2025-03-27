import { User } from '../../users/entities/user.entity';
import { ExternalRecipientType } from '../dto/external-recipient.input';
export declare enum HugType {
    QUICK = "QUICK",
    WARM = "WARM",
    SUPPORTIVE = "SUPPORTIVE",
    COMFORTING = "COMFORTING",
    ENCOURAGING = "ENCOURAGING",
    CELEBRATORY = "CELEBRATORY",
    StandardHug = "STANDARD",
    ComfortingHug = "COMFORTING",
    EnthusiasticHug = "ENCOURAGING",
    GroupHug = "GROUP",
    SupportiveHug = "SUPPORTIVE",
    VirtualHug = "VIRTUAL",
    RelaxingHug = "RELAXING",
    WelcomeHug = "WELCOME",
    FriendlyHug = "FRIENDLY",
    GentleHug = "GENTLE",
    FamilyHug = "FAMILY",
    SmilingHug = "SMILING"
}
export declare class ExternalRecipient {
    type: ExternalRecipientType;
    contact: string;
}
export declare class Hug {
    id: string;
    type: HugType;
    message?: string;
    sender: User;
    senderId: string;
    recipient?: User;
    recipientId?: string;
    externalRecipient?: ExternalRecipient;
    isRead: boolean;
    createdAt: Date;
}
