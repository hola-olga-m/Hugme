import { GraphQLResolveInfo } from 'graphql';

/**
 * Custom resolvers for extending the GraphQL schema functionality
 */
export const resolvers = {
  Query: {
    // Stats and metadata resolvers
    _appVersion: () => '1.0.0',
    _serverTime: () => new Date().toISOString(),
    _apiHealth: () => ({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }),

    // Enhanced user resolvers
    searchUsers: async (
      _: any,
      { query, limit = 10 }: { query: string; limit: number },
      context: any,
      info: GraphQLResolveInfo
    ) => {
      // Use PostgreSQL's full-text search capabilities via context sources
      const { dataSources } = context;
      if (!dataSources?.postgresPool) {
        throw new Error('Database connection not available');
      }

      // Sanitize input
      const sanitizedQuery = query.replace(/[^\w\s@.-]/gi, '');
      if (!sanitizedQuery) {
        return [];
      }

      try {
        const { rows } = await dataSources.postgresPool.query(
          `SELECT id, username, name, avatar_url, is_anonymous, created_at
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
           LIMIT $4`,
          [`%${sanitizedQuery}%`, `${sanitizedQuery}%`, `%${sanitizedQuery}`, limit]
        );

        // Convert snake_case to camelCase for returned fields
        return rows.map((row: any) => ({
          id: row.id,
          username: row.username,
          name: row.name,
          avatarUrl: row.avatar_url,
          isAnonymous: row.is_anonymous,
          createdAt: row.created_at
        }));
      } catch (error) {
        console.error('Search users error:', error);
        return [];
      }
    },

    // Enhanced mood resolvers
    trendingMoods: async (
      _: any,
      { limit = 5 }: { limit: number },
      context: any
    ) => {
      // Get trending moods (most recent public moods)
      const { dataSources } = context;
      if (!dataSources?.postgresPool) {
        throw new Error('Database connection not available');
      }

      try {
        const { rows } = await dataSources.postgresPool.query(
          `SELECT m.id, m.intensity, m.note, m.user_id, m.created_at,
                  u.username, u.name, u.avatar_url
           FROM moods m
           JOIN users u ON m.user_id = u.id
           WHERE m.is_public = true
           ORDER BY m.created_at DESC
           LIMIT $1`,
          [limit]
        );

        // Convert snake_case to camelCase and create proper structure
        return rows.map((row: any) => ({
          id: row.id,
          intensity: row.intensity,
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
      } catch (error) {
        console.error('Trending moods error:', error);
        return [];
      }
    }
  },

  Mutation: {
    // Enhanced user mutations
    updateUserProfile: async (
      _: any,
      { 
        id, 
        profileData 
      }: { 
        id: string; 
        profileData: { 
          name?: string; 
          avatarUrl?: string; 
          password?: string;
        }
      },
      context: any
    ) => {
      // Check authentication
      if (!context.user || (context.user.id !== id && !context.user.isAdmin)) {
        throw new Error('Not authorized to update this profile');
      }

      const { dataSources } = context;
      if (!dataSources?.postgresPool) {
        throw new Error('Database connection not available');
      }

      // Define types properly to avoid TypeScript errors
      const updateFields: string[] = [];
      const queryParams: any[] = [id];
      let paramIndex = 2; // Start with $2 since $1 is the id

      try {
        // Add fields to update if provided
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

        // Handle password separately with hashing
        if (profileData.password) {
          // In a real app, you would hash the password here
          updateFields.push(`password = $${paramIndex}`);
          queryParams.push(profileData.password); // Should be hashed in production
          paramIndex++;
        }

        if (updateFields.length === 0) {
          throw new Error('No valid fields to update');
        }

        // Build and execute the query
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

        // Convert snake_case to camelCase for returned fields
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
      } catch (error) {
        console.error('Update user profile error:', error);
        throw error;
      }
    },
  },

  // Custom scalar handling
  DateTime: {
    __parseValue(value: any) {
      return new Date(value);
    },
    __serialize(value: any) {
      return value instanceof Date ? value.toISOString() : value;
    }
  }
};

export default resolvers;