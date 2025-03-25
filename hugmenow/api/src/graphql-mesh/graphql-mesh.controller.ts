import { Controller, Post, Body, Headers, Req, Res, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLMeshService } from './graphql-mesh.service';

@Controller('graphql-mesh')
export class GraphQLMeshController {
  constructor(private graphqlMeshService: GraphQLMeshService) {}

  @Post()
  async processGraphQLRequest(
    @Body() body: any,
    @Headers() headers: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { query, variables, operationName } = body;
    
    try {
      // Extract authentication info from headers
      const token = headers.authorization?.replace('Bearer ', '');
      
      // Create context with request info
      const context = {
        req,
        headers,
        token,
        // Add any other context needed for resolvers
      };
      
      // Execute the query with Mesh
      const result = await this.graphqlMeshService.execute({
        query,
        variables,
        context,
      });
      
      return res.json(result);
    } catch (error) {
      console.error('GraphQL Mesh execution error', error);
      return res.status(500).json({
        errors: [{
          message: error.message,
          locations: error.locations,
          path: error.path,
        }],
      });
    }
  }

  @Get('schema')
  getSchema() {
    return this.graphqlMeshService.getSDL();
  }
}