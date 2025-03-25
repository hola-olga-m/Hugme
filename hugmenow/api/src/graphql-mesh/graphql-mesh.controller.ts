import { Controller, Post, Body, Headers, Req, Res, Get, Logger, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLMeshService } from './graphql-mesh.service';
import { ShieldMiddleware } from '../permissions/shield.middleware';
import { GraphQLSdkService } from './sdk.service';

@Controller('graphql-mesh')
export class GraphQLMeshController {
  private readonly logger = new Logger(GraphQLMeshController.name);
  
  constructor(
    private graphqlMeshService: GraphQLMeshService,
    private shieldMiddleware: ShieldMiddleware,
    private graphqlSdkService: GraphQLSdkService
  ) {}

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
        isAuthenticated: !!token,
        // Add data sources that might be needed for Shield rules
        dataSources: {
          usersService: req.app.get('usersService'),
          moodsService: req.app.get('moodsService'),
          hugsService: req.app.get('hugsService'),
        }
      };
      
      // Execute the query with Mesh
      const result = await this.graphqlMeshService.execute({
        query,
        variables,
        context,
      });
      
      return res.json(result);
    } catch (error) {
      this.logger.error(`GraphQL Mesh execution error: ${error.message}`, error.stack);
      return res.status(500).json({
        errors: [{
          message: process.env.NODE_ENV === 'production' 
            ? 'An unexpected error occurred' 
            : error.message,
          locations: error.locations,
          path: error.path,
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
          }
        }],
      });
    }
  }

  @Get('schema')
  getSchema() {
    return this.graphqlMeshService.getSDL();
  }
  
  @Get('info')
  getMeshInfo() {
    return {
      version: '1.0.0',
      features: [
        'Schema stitching',
        'GraphQL Shield permissions',
        'Envelop plugins',
        'Field-level security',
        'Integrated SDK'
      ],
      endpoints: {
        graphql: '/graphql-mesh',
        schema: '/graphql-mesh/schema',
        info: '/graphql-mesh/info'
      }
    };
  }
  
  @Get('sdk-example')
  async sdkExample(@Res() res: Response) {
    try {
      // Example of using the SDK
      const sdk = this.graphqlSdkService.getSdk();
      
      // Call an operation through the SDK
      const healthResult = await sdk.HealthCheck();
      
      return res.json({
        sdkWorking: true,
        healthCheck: healthResult?._health || false,
        message: 'SDK successfully executed a health check query'
      });
    } catch (error) {
      this.logger.error(`SDK example error: ${error.message}`, error.stack);
      return res.status(500).json({
        sdkWorking: false,
        error: error.message
      });
    }
  }
}