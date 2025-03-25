import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const POSTGRAPHILE_POOL = 'POSTGRAPHILE_POOL';

export const PostGraphileProvider: Provider = {
  provide: POSTGRAPHILE_POOL,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    
    // Create a new PostgreSQL pool for Postgraphile
    return new Pool({
      connectionString: databaseUrl,
    });
  },
};