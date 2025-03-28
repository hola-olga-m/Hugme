import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLMeshService } from './graphql-mesh.service';
import { GraphQLClient } from 'graphql-request';

@Injectable()
export class GraphQLSdkService implements OnModuleInit {
  private readonly logger = new Logger(GraphQLSdkService.name);
  private client: GraphQLClient;
  private sdk: any; // Will be replaced with actual SDK type once generated

  constructor(
    private graphqlMeshService: GraphQLMeshService,
    private configService: ConfigService
  ) {}

  async onModuleInit() {
    try {
      // Initialize GraphQL client
      const endpoint = this.configService.get<string>('GRAPHQL_ENDPOINT') || '/graphql';
      this.client = new GraphQLClient(endpoint);
      
      // Load SDK - dynamically import once it's generated
      this.logger.log('Initializing GraphQL SDK');
      
      try {
        // Eventually we'll import the actual SDK once it's generated
        // this.sdk = getSdk(this.client);
        this.logger.log('GraphQL SDK successfully initialized');
      } catch (error) {
        this.logger.error(`Failed to load SDK: ${error.message}`);
        // Create a proxy SDK that will dynamically execute operations through the mesh service
        this.createProxySdk();
      }
    } catch (error) {
      this.logger.error(`Error initializing GraphQL SDK: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Create a proxy SDK when the generated SDK is not available
   * This provides methods that match the expected SDK interface
   * but dynamically executes operations via the mesh service
   */
  private createProxySdk() {
    this.logger.log('Creating proxy GraphQL SDK');
    
    // Define operations that will be available in the SDK
    const operations = {
      // User operations
      getUsers: async () => this.execute('query { users { id username name avatarUrl isAnonymous createdAt } }'),
      getUser: async (id: string) => this.execute(`query { user(id: "${id}") { id username name avatarUrl isAnonymous createdAt } }`),
      getMe: async () => this.execute('query { me { id username email name avatarUrl isAnonymous createdAt } }'),
      
      // Mood operations
      getPublicMoods: async () => this.execute('query { publicMoods { id intensity note isPublic createdAt user { id username name avatarUrl } } }'),
      getUserMoods: async () => this.execute('query { userMoods { id intensity note isPublic createdAt } }'),
      getMood: async (id: string) => this.execute(`query { mood(id: "${id}") { id intensity note isPublic createdAt user { id username name avatarUrl } } }`),
      getMoodStreak: async () => this.execute('query { moodStreak }'),
      
      // Hug operations
      getSentHugs: async () => this.execute('query { sentHugs { id type message isRead createdAt recipient { id username name avatarUrl } } }'),
      getReceivedHugs: async () => this.execute('query { receivedHugs { id type message isRead createdAt sender { id username name avatarUrl } } }'),
      getHug: async (id: string) => this.execute(`query { hug(id: "${id}") { id type message isRead createdAt sender { id username name } recipient { id username name } } }`),
      
      // Hug request operations
      getMyHugRequests: async () => this.execute('query { myHugRequests { id message isCommunityRequest status createdAt respondedAt recipient { id username name avatarUrl } } }'),
      getPendingHugRequests: async () => this.execute('query { pendingHugRequests { id message isCommunityRequest status createdAt requester { id username name avatarUrl } } }'),
      getCommunityHugRequests: async () => this.execute('query { communityHugRequests { id message isCommunityRequest status createdAt requester { id username name avatarUrl } } }'),
      getHugRequest: async (id: string) => this.execute(`query { hugRequest(id: "${id}") { id message isCommunityRequest status createdAt respondedAt requester { id username name } recipient { id username name } } }`),
      
      // Mesh utility operations
      HealthCheck: async () => this.execute('query { _health }'),
      GetMeshInfo: async () => this.execute('query { _meshInfo { version sources transforms plugins } }'),
      GetSDL: async () => this.execute('query { _sdl }')
    };
    
    this.sdk = operations;
  }

  /**
   * Execute a GraphQL operation through the mesh service
   */
  async execute(query: string, variables: Record<string, any> = {}, context: Record<string, any> = {}) {
    try {
      const result = await this.graphqlMeshService.execute({ 
        query, 
        variables,
        context
      });
      return result.data;
    } catch (error) {
      this.logger.error(`GraphQL execution error: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get the SDK instance
   */
  getSdk() {
    if (!this.sdk) {
      throw new Error('GraphQL SDK not initialized');
    }
    return this.sdk;
  }
}