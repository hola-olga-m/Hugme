import { GraphQLResolveInfo } from 'graphql';
export declare const resolvers: {
    Query: {
        _appVersion: () => string;
        _serverTime: () => string;
        _apiHealth: () => {
            status: string;
            timestamp: string;
            uptime: number;
        };
        searchUsers: (_: any, { query, limit }: {
            query: string;
            limit: number;
        }, context: any, info: GraphQLResolveInfo) => Promise<any>;
        trendingMoods: (_: any, { limit }: {
            limit: number;
        }, context: any) => Promise<any>;
    };
    Mutation: {
        updateUserProfile: (_: any, { id, profileData }: {
            id: string;
            profileData: {
                name?: string;
                avatarUrl?: string;
                password?: string;
            };
        }, context: any) => Promise<{
            id: any;
            username: any;
            email: any;
            name: any;
            avatarUrl: any;
            isAnonymous: any;
            createdAt: any;
            updatedAt: any;
        }>;
    };
    DateTime: {
        __parseValue(value: any): Date;
        __serialize(value: any): any;
    };
};
export default resolvers;
