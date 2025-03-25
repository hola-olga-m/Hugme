import { Controller, All, Req, Res, Next, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { POSTGRAPHILE_POOL } from './postgraphile.provider';
import { Pool } from 'pg';

// This controller will be responsible for handling Postgraphile HTTP requests
@Controller('graphql-pg')
export class PostGraphileController {
  private postgraphileMiddleware: any;

  constructor(
    @Inject(POSTGRAPHILE_POOL) private readonly pool: Pool,
    private readonly configService: ConfigService,
  ) {
    this.initPostgraphile();
  }

  private async initPostgraphile() {
    try {
      // We're dynamically importing postgraphile to avoid dependency issues
      const { postgraphile } = await import('postgraphile');
      
      const schema = 'public'; // Default PostgreSQL schema
      
      this.postgraphileMiddleware = postgraphile(
        this.pool,
        schema,
        {
          watchPg: process.env.NODE_ENV !== 'production',
          graphiql: process.env.NODE_ENV !== 'production',
          enhanceGraphiql: true,
          enableCors: true,
          ignoreRBAC: false,
          dynamicJson: true,
          setofFunctionsContainNulls: false,
          // This makes Postgraphile use more standard GraphQL naming conventions
          classicIds: true,
          // Return errors from PostgreSQL or other parts to the client
          extendedErrors: ['hint', 'detail', 'errcode'],
          // Let's include some additional plugins
          appendPlugins: [
            // You can add plugins here when they're properly installed
          ],
          // Customize the GraphQL schema
          graphileBuildOptions: {
            // Options here
          },
          // pgSettings for row-level security and other PostgreSQL features
          pgSettings: async (req) => ({
            // Use JWT from req to set PostgreSQL role for row-level security
            role: 'app_user', // Default role
          }),
        }
      );
    } catch (error) {
      console.error('Failed to initialize Postgraphile:', error);
    }
  }

  @All('*')
  async handleRequest(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    if (!this.postgraphileMiddleware) {
      return res.status(500).json({ error: 'Postgraphile middleware not initialized' });
    }
    
    return this.postgraphileMiddleware(req, res, next);
  }
}