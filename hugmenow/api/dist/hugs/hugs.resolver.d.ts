import { HugsService } from './hugs.service';
import { Hug } from './entities/hug.entity';
import { HugRequest } from './entities/hug-request.entity';
import { SendHugInput } from './dto/send-hug.input';
import { CreateHugRequestInput } from './dto/create-hug-request.input';
import { RespondToRequestInput } from './dto/respond-to-request.input';
import { User } from '../users/entities/user.entity';
export declare class HugsResolver {
    private hugsService;
    constructor(hugsService: HugsService);
    sendHug(sendHugInput: SendHugInput, user: User): Promise<Hug>;
    sentHugs(user: User): Promise<Hug[]>;
    receivedHugs(user: User): Promise<Hug[]>;
    hug(id: string): Promise<Hug>;
    markHugAsRead(id: string, user: User): Promise<Hug>;
    createHugRequest(createHugRequestInput: CreateHugRequestInput, user: User): Promise<HugRequest>;
    myHugRequests(user: User): Promise<HugRequest[]>;
    pendingHugRequests(user: User): Promise<HugRequest[]>;
    communityHugRequests(): Promise<HugRequest[]>;
    hugRequest(id: string): Promise<HugRequest>;
    respondToHugRequest(respondToRequestInput: RespondToRequestInput, user: User): Promise<HugRequest>;
    cancelHugRequest(id: string, user: User): Promise<HugRequest>;
}
