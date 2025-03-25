import { Injectable, Logger } from '@nestjs/common';
import { applyMiddleware } from 'graphql-middleware';
import { GraphQLSchema } from 'graphql';
import { PermissionsService } from './permissions.service';

@Injectable()
export class ShieldMiddleware {
  private readonly logger = new Logger(ShieldMiddleware.name);

  constructor(private permissionsService: PermissionsService) {}

  /**
   * Apply permissions middleware to a GraphQL schema
   * @param schema The GraphQL schema to protect
   * @returns A new schema with permissions applied
   */
  applyShield(schema: GraphQLSchema): GraphQLSchema {
    this.logger.log('Applying Shield permissions to GraphQL schema');
    
    try {
      const permissions = this.permissionsService.createPermissions();
      const schemaWithPermissions = applyMiddleware(schema, permissions);
      
      this.logger.log('Shield permissions successfully applied');
      return schemaWithPermissions;
    } catch (error) {
      this.logger.error(`Error applying Shield permissions: ${error.message}`, error.stack);
      return schema; // Return original schema if there's an error
    }
  }
}