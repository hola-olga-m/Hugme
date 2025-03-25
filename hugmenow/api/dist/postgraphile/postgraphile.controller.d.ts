import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
export declare class PostGraphileController {
    private readonly pool;
    private readonly configService;
    private postgraphileMiddleware;
    constructor(pool: Pool, configService: ConfigService);
    private initPostgraphile;
    handleRequest(req: Request, res: Response, next: NextFunction): Promise<any>;
}
