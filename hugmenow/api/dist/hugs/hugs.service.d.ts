import { Hug } from './entities/hug.entity';
import { HugRequest } from './entities/hug-request.entity';
import { UsersService } from '../users/users.service';
import { SendHugInput } from './dto/send-hug.input';
import { CreateHugRequestInput } from './dto/create-hug-request.input';
import { RespondToRequestInput } from './dto/respond-to-request.input';
import { PostGraphileService } from '../postgraphile/postgraphile.service';
export declare class HugsService {
    private postgraphileService;
    private usersService;
    private readonly hugsTable;
    private readonly hugRequestsTable;
    constructor(postgraphileService: PostGraphileService, usersService: UsersService);
    sendHug(sendHugInput: SendHugInput, senderId: string): Promise<Hug>;
    findAllHugs(): Promise<Hug[]>;
    findHugById(id: string): Promise<Hug>;
    findHugsBySender(senderId: string): Promise<Hug[]>;
    findHugsByRecipient(recipientId: string): Promise<Hug[]>;
    markHugAsRead(hugId: string, userId: string): Promise<Hug>;
    createHugRequest(createHugRequestInput: CreateHugRequestInput, requesterId: string): Promise<HugRequest>;
    findAllHugRequests(): Promise<HugRequest[]>;
    findHugRequestById(id: string): Promise<HugRequest>;
    findHugRequestsByUser(userId: string): Promise<HugRequest[]>;
    findPendingRequestsForUser(userId: string): Promise<HugRequest[]>;
    findCommunityRequests(): Promise<HugRequest[]>;
    respondToHugRequest(respondToRequestInput: RespondToRequestInput, userId: string): Promise<HugRequest>;
    cancelHugRequest(requestId: string, userId: string): Promise<HugRequest>;
}
