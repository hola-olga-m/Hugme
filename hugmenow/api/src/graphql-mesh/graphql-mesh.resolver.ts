import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { GraphQLMeshService } from './graphql-mesh.service';

@Resolver()
export class GraphQLMeshResolver {
  constructor(private graphqlMeshService: GraphQLMeshService) {}

  // You can add custom resolvers here that will be merged with the generated schema
  @Query('_meshInfo')
  async getMeshInfo() {
    return {
      version: '1.0.0',
      sources: ['PostgreSQL'],
      timestamp: new Date().toISOString(),
    };
  }

  // Example of a custom resolver that uses the Mesh service to execute a query
  @Query('_meshHealthCheck')
  async healthCheck() {
    try {
      const result = await this.graphqlMeshService.execute({
        query: '{ __schema { types { name } } }',
      });
      return { status: 'healthy', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
    }
  }
}