"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostGraphileService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const postgraphile_provider_1 = require("./postgraphile.provider");
let PostGraphileService = class PostGraphileService {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async onModuleInit() {
        try {
            const client = await this.pool.connect();
            client.release();
            console.log('Successfully connected to PostgreSQL database');
        }
        catch (error) {
            console.error('Failed to connect to PostgreSQL database:', error);
            throw error;
        }
    }
    async onModuleDestroy() {
        await this.pool.end();
    }
    async query(text, params = []) {
        const client = await this.pool.connect();
        try {
            return await client.query(text, params);
        }
        finally {
            client.release();
        }
    }
    snakeToCamel(obj) {
        const result = {};
        Object.keys(obj).forEach(key => {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            result[camelKey] = obj[key];
        });
        return result;
    }
    camelToSnake(obj) {
        const result = {};
        Object.keys(obj).forEach(key => {
            const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            result[snakeKey] = obj[key];
        });
        return result;
    }
    async findById(table, id) {
        const { rows } = await this.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        if (!rows[0])
            return null;
        return this.snakeToCamel(rows[0]);
    }
    async findAll(table) {
        const { rows } = await this.query(`SELECT * FROM ${table}`);
        return rows.map(row => this.snakeToCamel(row));
    }
    async findWhere(table, conditions) {
        const snakeConditions = this.camelToSnake(conditions);
        const keys = Object.keys(snakeConditions);
        const values = Object.values(snakeConditions);
        if (keys.length === 0) {
            return this.findAll(table);
        }
        const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
        const { rows } = await this.query(`SELECT * FROM ${table} WHERE ${whereClause}`, values);
        return rows.map(row => this.snakeToCamel(row));
    }
    async insert(table, data) {
        const snakeCaseData = this.camelToSnake(data);
        const keys = Object.keys(snakeCaseData);
        const values = Object.values(snakeCaseData);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const columns = keys.join(', ');
        const { rows } = await this.query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`, values);
        return this.snakeToCamel(rows[0]);
    }
    async update(table, id, data) {
        const snakeCaseData = this.camelToSnake(data);
        const keys = Object.keys(snakeCaseData);
        const values = Object.values(snakeCaseData);
        if (keys.length === 0) {
            return this.findById(table, id);
        }
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        const { rows } = await this.query(`UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`, [...values, id]);
        return this.snakeToCamel(rows[0]);
    }
    async delete(table, id) {
        const result = await this.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        return (result.rowCount ?? 0) > 0;
    }
};
exports.PostGraphileService = PostGraphileService;
exports.PostGraphileService = PostGraphileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(postgraphile_provider_1.POSTGRAPHILE_POOL)),
    __metadata("design:paramtypes", [pg_1.Pool])
], PostGraphileService);
//# sourceMappingURL=postgraphile.service.js.map