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
const fs = require("fs");
const path = require("path");
let MigrationRunner = MigrationRunner_1 = class MigrationRunner {
    postgraphileService;
    logger = new common_1.Logger(MigrationRunner_1.name);
    constructor(postgraphileService) {
        this.postgraphileService = postgraphileService;
    }
    async onModuleInit() {
        await this.runMigrations();
    }
    async runMigrations() {
        this.logger.log('Running database migrations...');
        try {
            const createMigrationsTableSQL = `
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
            await this.postgraphileService.query(createMigrationsTableSQL);
            const { rows: appliedMigrations } = await this.postgraphileService.query('SELECT name FROM migrations ORDER BY id');
            const appliedMigrationNames = appliedMigrations.map(row => row.name);
            const migrationsDir = path.join(__dirname, 'migrations');
            const migrationFiles = fs.readdirSync(migrationsDir)
                .filter(file => file.endsWith('.sql'))
                .sort();
            for (const migrationFile of migrationFiles) {
                if (appliedMigrationNames.includes(migrationFile)) {
                    this.logger.log(`Migration ${migrationFile} already applied, skipping...`);
                    continue;
                }
                this.logger.log(`Applying migration: ${migrationFile}`);
                const migrationContent = fs.readFileSync(path.join(migrationsDir, migrationFile), 'utf8');
                const client = await this.postgraphileService.pool.connect();
                try {
                    await client.query('BEGIN');
                    await client.query(migrationContent);
                    await client.query('INSERT INTO migrations (name) VALUES ($1)', [migrationFile]);
                    await client.query('COMMIT');
                    this.logger.log(`Successfully applied migration: ${migrationFile}`);
                }
                catch (error) {
                    await client.query('ROLLBACK');
                    this.logger.error(`Failed to apply migration ${migrationFile}: ${error.message}`);
                    throw error;
                }
                finally {
                    client.release();
                }
            }
            this.logger.log('All migrations applied successfully');
        }
        catch (error) {
            this.logger.error(`Error running migrations: ${error.message}`);
            throw error;
        }
    }
};
exports.MigrationRunner = MigrationRunner;
exports.MigrationRunner = MigrationRunner = MigrationRunner_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgraphile_service_1.PostGraphileService])
], MigrationRunner);
//# sourceMappingURL=migration.runner.js.map