import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { POSTGRAPHILE_POOL } from './postgraphile.provider';

@Injectable()
export class PostGraphileService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(POSTGRAPHILE_POOL) readonly pool: Pool, // Changed from private to public
  ) {}

  async onModuleInit() {
    // Test the connection when the module initializes
    try {
      const client = await this.pool.connect();
      client.release();
      console.log('Successfully connected to PostgreSQL database');
    } catch (error) {
      console.error('Failed to connect to PostgreSQL database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    // Close the pool when the application is shutting down
    await this.pool.end();
  }

  async query(text: string, params: any[] = []) {
    const client = await this.pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  }

  // Helper methods for database operations
  // Helper function to convert object keys from snake_case to camelCase
  private snakeToCamel(obj: Record<string, any>): Record<string, any> {
    const result = {};
    Object.keys(obj).forEach(key => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = obj[key];
    });
    return result;
  }

  // Helper function to convert object keys from camelCase to snake_case
  private camelToSnake(obj: Record<string, any>): Record<string, any> {
    const result = {};
    Object.keys(obj).forEach(key => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = obj[key];
    });
    return result;
  }

  async findById(table: string, id: string) {
    const { rows } = await this.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    if (!rows[0]) return null;
    return this.snakeToCamel(rows[0]);
  }

  async findAll(table: string) {
    const { rows } = await this.query(`SELECT * FROM ${table}`);
    return rows.map(row => this.snakeToCamel(row));
  }

  async findWhere(table: string, conditions: Record<string, any>) {
    // Convert conditions from camelCase to snake_case
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

  async insert(table: string, data: Record<string, any>) {
    // Convert camelCase to snake_case for column names
    const snakeCaseData = this.camelToSnake(data);
    
    const keys = Object.keys(snakeCaseData);
    const values = Object.values(snakeCaseData);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const columns = keys.join(', ');
    
    const { rows } = await this.query(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values,
    );
    
    // Convert back from snake_case to camelCase for the returned data
    return this.snakeToCamel(rows[0]);
  }

  async update(table: string, id: string, data: Record<string, any>) {
    // Convert camelCase to snake_case for column names
    const snakeCaseData = this.camelToSnake(data);
    
    const keys = Object.keys(snakeCaseData);
    const values = Object.values(snakeCaseData);
    
    if (keys.length === 0) {
      return this.findById(table, id);
    }
    
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const { rows } = await this.query(
      `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id],
    );
    
    // Convert back from snake_case to camelCase for the returned data
    return this.snakeToCamel(rows[0]);
  }

  async delete(table: string, id: string) {
    const result = await this.query(
      `DELETE FROM ${table} WHERE id = $1`,
      [id],
    );
    
    return (result.rowCount ?? 0) > 0;
  }
}