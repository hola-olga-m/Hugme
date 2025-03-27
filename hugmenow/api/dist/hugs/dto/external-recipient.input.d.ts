export declare enum ExternalRecipientType {
    EMAIL = "email",
    TELEGRAM = "telegram"
}
export declare class ExternalRecipientInput {
    type: ExternalRecipientType;
    contact: string;
}
