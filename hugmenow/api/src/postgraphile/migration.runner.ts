import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PostGraphileService } from './postgraphile.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MigrationRunner implements OnModuleInit {
  private readonly logger = new Logger(MigrationRunner.name);

  constructor(private readonly postgraphileService: PostGraphileService) {}

  async onModuleInit() {
    await this.runMigrations();
  }

  async runMigrations() {
    this.logger.log('Running database migrations...');

    try {
      // First check if we have a migrations table
      const createMigrationsTableSQL = `
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      await this.postgraphileService.query(createMigrationsTableSQL);
      
      // Get list of applied migrations
      const { rows: appliedMigrations } = await this.postgraphileService.query(
        'SELECT name FROM migrations ORDER BY id'
      );
      
      const appliedMigrationNames = appliedMigrations.map(row => row.name);
      
      // Read migration files
      const migrationsDir = path.join(__dirname, 'migrations');
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort(); // Sort to ensure order
      
      // Apply each migration that hasn't been applied yet
      for (const migrationFile of migrationFiles) {
        if (appliedMigrationNames.includes(migrationFile)) {
          this.logger.log(`Migration ${migrationFile} already applied, skipping...`);
          continue;
        }
        
        this.logger.log(`Applying migration: ${migrationFile}`);
        
        const migrationContent = fs.readFileSync(
          path.join(migrationsDir, migrationFile),
          'utf8'
        );
        
        // Begin transaction
        const client = await this.postgraphileService.pool.connect();
        
        try {
          await client.query('BEGIN');
          
          // Execute the migration
          await client.query(migrationContent);
          
          // Record the migration
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [migrationFile]
          );
          
          await client.query('COMMIT');
          this.logger.log(`Successfully applied migration: ${migrationFile}`);
        } catch (error) {
          await client.query('ROLLBACK');
          this.logger.error(`Failed to apply migration ${migrationFile}: ${error.message}`);
          throw error;
        } finally {
          client.release();
        }
      }
      
      this.logger.log('All migrations applied successfully');
    } catch (error) {
      this.logger.error(`Error running migrations: ${error.message}`);
      throw error;
    }
  }
}