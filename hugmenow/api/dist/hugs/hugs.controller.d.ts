import { HugsService } from './hugs.service';
import { SendHugInput } from './dto/send-hug.input';
import { CreateHugRequestInput } from './dto/create-hug-request.input';
import { RespondToRequestInput } from './dto/respond-to-request.input';
import { Hug } from './entities/hug.entity';
import { HugRequest } from './entities/hug-request.entity';
import { Response } from 'express';
export declare class HugsController {
    private readonly hugsService;
    constructor(hugsService: HugsService);
    sendHug(sendHugInput: SendHugInput, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    markHugAsRead(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getSentHugs(req: any): Promise<Hug[]>;
    getReceivedHugs(req: any): Promise<Hug[]>;
    getHug(id: string, req: any): Promise<Hug>;
    createHugRequest(createHugRequestInput: CreateHugRequestInput, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    respondToHugRequest(id: string, respondToRequestInput: RespondToRequestInput, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    cancelHugRequest(id: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getMyHugRequests(req: any): Promise<HugRequest[]>;
    getPendingHugRequests(req: any): Promise<HugRequest[]>;
    getCommunityHugRequests(): Promise<HugRequest[]>;
    getHugRequest(id: string, req: any): Promise<HugRequest>;
}
