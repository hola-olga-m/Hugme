"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
exports.resolvers = {
    Query: {
        _appVersion: () => '1.0.0',
        _serverTime: () => new Date().toISOString(),
        _apiHealth: () => ({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }),
        searchUsers: async (_, { query, limit = 10 }, context, info) => {
            const { dataSources } = context;
            if (!dataSources?.postgresPool) {
                throw new Error('Database connection not available');
            }
            const sanitizedQuery = query.replace(/[^\w\s@.-]/gi, '');
            if (!sanitizedQuery) {
                return [];
            }
            try {
                const { rows } = await dataSources.postgresPool.query(`SELECT id, username, name, avatar_url, is_anonymous, created_at
           FROM users
           WHERE username ILIKE $1 OR name ILIKE $1 OR email ILIKE $1
           ORDER BY 
             CASE WHEN username ILIKE $2 THEN 0
                  WHEN username ILIKE $3 THEN 1
                  WHEN name ILIKE $2 THEN 2
                  WHEN name ILIKE $3 THEN 3
                  WHEN email ILIKE $2 THEN 4
                  WHEN email ILIKE $3 THEN 5
                  ELSE 6
             END
           LIMIT $4`, [`%${sanitizedQuery}%`, `${sanitizedQuery}%`, `%${sanitizedQuery}`, limit]);
                return rows.map((row) => ({
                    id: row.id,
                    username: row.username,
                    name: row.name,
                    avatarUrl: row.avatar_url,
                    isAnonymous: row.is_anonymous,
                    createdAt: row.created_at
                }));
            }
            catch (error) {
                console.error('Search users error:', error);
                return [];
            }
        },
        trendingMoods: async (_, { limit = 5 }, context) => {
            const { dataSources } = context;
            if (!dataSources?.postgresPool) {
                throw new Error('Database connection not available');
            }
            try {
                const { rows } = await dataSources.postgresPool.query(`SELECT m.id, m.score, m.note, m.user_id, m.created_at,
                  u.username, u.name, u.avatar_url
           FROM moods m
           JOIN users u ON m.user_id = u.id
           WHERE m.is_public = true
           ORDER BY m.created_at DESC
           LIMIT $1`, [limit]);
                return rows.map((row) => ({
                    id: row.id,
                    score: row.score,
                    note: row.note,
                    isPublic: true,
                    createdAt: row.created_at,
                    userId: row.user_id,
                    user: {
                        id: row.user_id,
                        username: row.username,
                        name: row.name,
                        avatarUrl: row.avatar_url
                    }
                }));
            }
            catch (error) {
                console.error('Trending moods error:', error);
                return [];
            }
        }
    },
    Mutation: {
        updateUserProfile: async (_, { id, profileData }, context) => {
            if (!context.user || (context.user.id !== id && !context.user.isAdmin)) {
                throw new Error('Not authorized to update this profile');
            }
            const { dataSources } = context;
            if (!dataSources?.postgresPool) {
                throw new Error('Database connection not available');
            }
            try {
                let updateFields = [];
                let queryParams = [id];
                let paramIndex = 2;
                if (profileData.name !== undefined) {
                    updateFields.push(`name = $${paramIndex}`);
                    queryParams.push(profileData.name);
                    paramIndex++;
                }
                if (profileData.avatarUrl !== undefined) {
                    updateFields.push(`avatar_url = $${paramIndex}`);
                    queryParams.push(profileData.avatarUrl);
                    paramIndex++;
                }
                if (profileData.password) {
                    updateFields.push(`password = $${paramIndex}`);
                    queryParams.push(profileData.password);
                    paramIndex++;
                }
                if (updateFields.length === 0) {
                    throw new Error('No valid fields to update');
                }
                const query = `
          UPDATE users
          SET ${updateFields.join(', ')}, updated_at = NOW()
          WHERE id = $1
          RETURNING id, username, email, name, avatar_url, is_anonymous, created_at, updated_at
        `;
                const { rows } = await dataSources.postgresPool.query(query, queryParams);
                if (rows.length === 0) {
                    throw new Error('User not found');
                }
                const updatedUser = rows[0];
                return {
                    id: updatedUser.id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    avatarUrl: updatedUser.avatar_url,
                    isAnonymous: updatedUser.is_anonymous,
                    createdAt: updatedUser.created_at,
                    updatedAt: updatedUser.updated_at
                };
            }
            catch (error) {
                console.error('Update user profile error:', error);
                throw error;
            }
        },
    },
    DateTime: {
        __parseValue(value) {
            return new Date(value);
        },
        __serialize(value) {
            return value instanceof Date ? value.toISOString() : value;
        }
    }
};
exports.default = exports.resolvers;
//# sourceMappingURL=customResolvers.js.map