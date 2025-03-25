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
var MigrationRunner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationRunner = void 0;
const common_1 = require("@nestjs/common");
const postgraphile_service_1 = require("./postgraphile.service");
const fs_1 = require("fs");
const path_1 = require("path");
let MigrationRunner = MigrationRunner_1 = class MigrationRunner {
    postgraphileService;
    logger = new common_1.Logger(MigrationRunner_1.name);
    migrationsPath = (0, path_1.join)(__dirname, 'migrations');
    constructor(postgraphileService) {
        this.postgraphileService = postgraphileService;
    }
    async onModuleInit() {
        try {
            await this.runMigrations();
        }
        catch (error) {
            this.logger.error(`Failed to run migrations: ${error.message}`, error.stack);
            throw error;
        }
    }
    async runMigrations() {
        if (!(0, fs_1.existsSync)(this.migrationsPath)) {
            this.logger.warn(`Migrations directory not found at ${this.migrationsPath}`);
            return;
        }
        const migrationFiles = (0, fs_1.readdirSync)(this.migrationsPath)
            .filter(file => file.endsWith('.sql'))
            .sort();
        if (migrationFiles.length === 0) {
            this.logger.log('No migration files found');
            return;
        }
        this.logger.log(`Found ${migrationFiles.length} migration files. Running in order...`);
        await this.postgraphileService.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT NOW()
      );
    `);
        const { rows: appliedMigrations } = await this.postgraphileService.query('SELECT name FROM migrations');
        const appliedMigrationNames = appliedMigrations.map(m => m.name);
        for (const file of migrationFiles) {
            if (appliedMigrationNames.includes(file)) {
                this.logger.log(`Migration ${file} already applied, skipping`);
                continue;
            }
            this.logger.log(`Applying migration: ${file}`);
            try {
                const migrationContent = (0, fs_1.readFileSync)((0, path_1.join)(this.migrationsPath, file), 'utf8');
                await this.postgraphileService.query('BEGIN');
                await this.postgraphileService.query(migrationContent);
                await this.postgraphileService.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
                await this.postgraphileService.query('COMMIT');
                this.logger.log(`Successfully applied migration: ${file}`);
            }
            catch (error) {
                await this.postgraphileService.query('ROLLBACK');
                this.logger.error(`Failed to apply migration ${file}: ${error.message}`, error.stack);
                throw error;
            }
        }
        this.logger.log('All migrations applied successfully');
    }
};
exports.MigrationRunner = MigrationRunner;
exports.MigrationRunner = MigrationRunner = MigrationRunner_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgraphile_service_1.PostGraphileService])
], MigrationRunner);
//# sourceMappingURL=migration.runner.js.map