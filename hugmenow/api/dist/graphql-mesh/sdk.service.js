"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GraphQLSdkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLSdkService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_mesh_service_1 = require("./graphql-mesh.service");
const graphql_request_1 = require("graphql-request");
let GraphQLSdkService = GraphQLSdkService_1 = class GraphQLSdkService {
    graphqlMeshService;
    configService;
    logger = new common_1.Logger(GraphQLSdkService_1.name);
    client;
    sdk;
    constructor(graphqlMeshService, configService) {
        this.graphqlMeshService = graphqlMeshService;
        this.configService = configService;
    }
    async onModuleInit() {
        try {
            const endpoint = this.configService.get('GRAPHQL_ENDPOINT') || '/graphql';
            this.client = new graphql_request_1.GraphQLClient(endpoint);
            this.logger.log('Initializing GraphQL SDK');
            try {
                this.logger.log('GraphQL SDK successfully initialized');
            }
            catch (error) {
                this.logger.error(`Failed to load SDK: ${error.message}`);
                this.createProxySdk();
            }
        }
        catch (error) {
            this.logger.error(`Error initializing GraphQL SDK: ${error.message}`, error.stack);
            throw error;
        }
    }
    createProxySdk() {
        this.logger.log('Creating proxy GraphQL SDK');
        const operations = {
            getUsers: async () => this.execute('query { users { id username name avatarUrl isAnonymous createdAt } }'),
            getUser: async (id) => this.execute(`query { user(id: "${id}") { id username name avatarUrl isAnonymous createdAt } }`),
            getMe: async () => this.execute('query { me { id username email name avatarUrl isAnonymous createdAt } }'),
            getPublicMoods: async () => this.execute('query { publicMoods { id score note isPublic createdAt user { id username name avatarUrl } } }'),
            getUserMoods: async () => this.execute('query { userMoods { id score note isPublic createdAt } }'),
            getMood: async (id) => this.execute(`query { mood(id: "${id}") { id score note isPublic createdAt user { id username name avatarUrl } } }`),
            getMoodStreak: async () => this.execute('query { moodStreak }'),
            getSentHugs: async () => this.execute('query { sentHugs { id type message isRead createdAt recipient { id username name avatarUrl } } }'),
            getReceivedHugs: async () => this.execute('query { receivedHugs { id type message isRead createdAt sender { id username name avatarUrl } } }'),
            getHug: async (id) => this.execute(`query { hug(id: "${id}") { id type message isRead createdAt sender { id username name } recipient { id username name } } }`),
            getMyHugRequests: async () => this.execute('query { myHugRequests { id message isCommunityRequest status createdAt respondedAt recipient { id username name avatarUrl } } }'),
            getPendingHugRequests: async () => this.execute('query { pendingHugRequests { id message isCommunityRequest status createdAt requester { id username name avatarUrl } } }'),
            getCommunityHugRequests: async () => this.execute('query { communityHugRequests { id message isCommunityRequest status createdAt requester { id username name avatarUrl } } }'),
            getHugRequest: async (id) => this.execute(`query { hugRequest(id: "${id}") { id message isCommunityRequest status createdAt respondedAt requester { id username name } recipient { id username name } } }`),
            HealthCheck: async () => this.execute('query { _health }'),
            GetMeshInfo: async () => this.execute('query { _meshInfo { version sources transforms plugins } }'),
            GetSDL: async () => this.execute('query { _sdl }')
        };
        this.sdk = operations;
    }
    async execute(query, variables = {}, context = {}) {
        try {
            const result = await this.graphqlMeshService.execute({
                query,
                variables,
                context
            });
            return result.data;
        }
        catch (error) {
            this.logger.error(`GraphQL execution error: ${error.message}`, error.stack);
            throw error;
        }
    }
    getSdk() {
        if (!this.sdk) {
            throw new Error('GraphQL SDK not initialized');
        }
        return this.sdk;
    }
};
exports.GraphQLSdkService = GraphQLSdkService;
exports.GraphQLSdkService = GraphQLSdkService = GraphQLSdkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [graphql_mesh_service_1.GraphQLMeshService,
        config_1.ConfigService])
], GraphQLSdkService);
//# sourceMappingURL=sdk.service.js.map