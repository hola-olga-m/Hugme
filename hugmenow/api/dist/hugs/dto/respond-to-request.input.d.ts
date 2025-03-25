import { HugRequestStatus } from '../entities/hug-request.entity';
export declare class RespondToRequestInput {
    requestId: string;
    status: HugRequestStatus;
    message?: string;
}
