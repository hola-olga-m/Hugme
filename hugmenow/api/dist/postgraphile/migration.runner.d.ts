import { OnModuleInit } from '@nestjs/common';
import { PostGraphileService } from './postgraphile.service';
export declare class MigrationRunner implements OnModuleInit {
    private readonly postgraphileService;
    private readonly logger;
    constructor(postgraphileService: PostGraphileService);
    onModuleInit(): Promise<void>;
    runMigrations(): Promise<void>;
}
