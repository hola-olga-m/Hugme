import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PostGraphileService } from './postgraphile.service';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MigrationRunner implements OnModuleInit {
  private readonly logger = new Logger(MigrationRunner.name);
  private readonly migrationsPath = join(__dirname, 'migrations');

  constructor(private readonly postgraphileService: PostGraphileService) {}

  async onModuleInit() {
    try {
      await this.runMigrations();
    } catch (error) {
      this.logger.error(`Failed to run migrations: ${error.message}`, error.stack);
      throw error;
    }
  }

  async runMigrations() {
    if (!existsSync(this.migrationsPath)) {
      this.logger.warn(`Migrations directory not found at ${this.migrationsPath}`);
      return;
    }

    // Get all SQL files in the migrations directory
    const migrationFiles = readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure they run in order by filename

    if (migrationFiles.length === 0) {
      this.logger.log('No migration files found');
      return;
    }

    this.logger.log(`Found ${migrationFiles.length} migration files. Running in order...`);

    // Create migrations table if it doesn't exist
    await this.postgraphileService.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Get list of applied migrations
    const { rows: appliedMigrations } = await this.postgraphileService.query(
      'SELECT name FROM migrations'
    );
    const appliedMigrationNames = appliedMigrations.map(m => m.name);

    // Run each migration that hasn't been applied yet
    for (const file of migrationFiles) {
      if (appliedMigrationNames.includes(file)) {
        this.logger.log(`Migration ${file} already applied, skipping`);
        continue;
      }

      this.logger.log(`Applying migration: ${file}`);
      try {
        const migrationContent = readFileSync(join(this.migrationsPath, file), 'utf8');
        
        // Run the migration in a transaction
        await this.postgraphileService.query('BEGIN');
        await this.postgraphileService.query(migrationContent);
        await this.postgraphileService.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
        await this.postgraphileService.query('COMMIT');
        
        this.logger.log(`Successfully applied migration: ${file}`);
      } catch (error) {
        // Rollback on error
        await this.postgraphileService.query('ROLLBACK');
        this.logger.error(`Failed to apply migration ${file}: ${error.message}`, error.stack);
        throw error;
      }
    }

    this.logger.log('All migrations applied successfully');
  }
}