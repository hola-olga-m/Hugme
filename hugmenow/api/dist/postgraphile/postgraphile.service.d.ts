import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
export declare class PostGraphileService implements OnModuleInit, OnModuleDestroy {
    readonly pool: Pool;
    constructor(pool: Pool);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    query(text: string, params?: any[]): Promise<import("pg").QueryResult<any>>;
    findById(table: string, id: string): Promise<any>;
    findAll(table: string): Promise<any[]>;
    findWhere(table: string, conditions: Record<string, any>): Promise<any[]>;
    insert(table: string, data: Record<string, any>): Promise<any>;
    update(table: string, id: string, data: Record<string, any>): Promise<any>;
    delete(table: string, id: string): Promise<boolean>;
}
