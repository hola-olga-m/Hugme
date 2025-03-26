import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
export declare class PostGraphileService implements OnModuleInit, OnModuleDestroy {
    readonly pool: Pool;
    constructor(pool: Pool);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    query(text: string, params?: any[]): Promise<import("pg").QueryResult<any>>;
    private snakeToCamel;
    private camelToSnake;
    findById(table: string, id: string): Promise<Record<string, any> | null>;
    findAll(table: string): Promise<Record<string, any>[]>;
    findWhere(table: string, conditions: Record<string, any>): Promise<Record<string, any>[]>;
    insert(table: string, data: Record<string, any>): Promise<Record<string, any>>;
    update(table: string, id: string, data: Record<string, any>): Promise<Record<string, any> | null>;
    delete(table: string, id: string): Promise<boolean>;
}
