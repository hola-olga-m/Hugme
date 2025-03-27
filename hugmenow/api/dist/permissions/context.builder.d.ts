import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MoodsService } from '../moods/moods.service';
import { HugsService } from '../hugs/hugs.service';
export declare class ContextBuilder {
    private jwtService;
    private usersService;
    private moodsService;
    private hugsService;
    private readonly logger;
    constructor(jwtService: JwtService, usersService: UsersService, moodsService: MoodsService, hugsService: HugsService);
    build({ req, connection }: {
        req: any;
        connection: any;
    }): Promise<any>;
}
