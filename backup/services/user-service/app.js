const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const http = require('http');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.USER_SERVICE_PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const httpServer = http.createServer(app);

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to database at:', res.rows[0].now);
  }
});

// Initialize database tables
async function initDb() {
  try {
    // Create UserProfile table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "UserProfile" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) UNIQUE NOT NULL,
        "displayName" VARCHAR(255),
        "bio" TEXT,
        "location" VARCHAR(255),
        "website" VARCHAR(255),
        "pronouns" VARCHAR(100),
        "profileVisibility" VARCHAR(50) DEFAULT 'public',
        "moodVisibility" VARCHAR(50) DEFAULT 'public',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create UserSettings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "UserSettings" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) UNIQUE NOT NULL,
        "themePreference" VARCHAR(50) DEFAULT 'system',
        "enableMoodReminders" BOOLEAN DEFAULT true,
        "moodReminderTime" TIME,
        "enableHapticFeedback" BOOLEAN DEFAULT true,
        "receiveHugNotifications" BOOLEAN DEFAULT true,
        "receiveMoodNotifications" BOOLEAN DEFAULT true,
        "enableSounds" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create UserContacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "UserContacts" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "contactId" VARCHAR(255) NOT NULL,
        "relationship" VARCHAR(50),
        "notes" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        UNIQUE("userId", "contactId")
      )
    `);
    
    // Create FollowRelationship table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "FollowRelationship" (
        "id" VARCHAR(255) PRIMARY KEY,
        "followerId" VARCHAR(255) NOT NULL,
        "followingId" VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        UNIQUE("followerId", "followingId")
      )
    `);
    
    // Create FriendRequest table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "FriendRequest" (
        "id" VARCHAR(255) PRIMARY KEY,
        "senderId" VARCHAR(255) NOT NULL,
        "receiverId" VARCHAR(255) NOT NULL,
        "status" VARCHAR(50) DEFAULT 'pending',
        "message" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        UNIQUE("senderId", "receiverId")
      )
    `);
    
    // Create UserNotificationPreferences table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "UserNotificationPreferences" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) UNIQUE NOT NULL,
        "email" BOOLEAN DEFAULT true,
        "push" BOOLEAN DEFAULT true,
        "inApp" BOOLEAN DEFAULT true,
        "hugs" BOOLEAN DEFAULT true,
        "friendRequests" BOOLEAN DEFAULT true,
        "moodUpdates" BOOLEAN DEFAULT true,
        "streakReminders" BOOLEAN DEFAULT true,
        "groupActivities" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}

// Type definitions
const typeDefs = gql`
  type Query {
    userProfile(userId: ID!): UserProfile
    userProfiles(userIds: [ID!]!): [UserProfile]
    userSettings: UserSettings
    following(userId: ID!, limit: Int, offset: Int): FollowConnection
    followers(userId: ID!, limit: Int, offset: Int): FollowConnection
    friendRequests(status: String): [FriendRequest]
    searchUsers(query: String!, limit: Int): [UserProfile]
    suggestedFriends(limit: Int): [UserSuggestion]
  }

  type Mutation {
    updateUserProfile(input: UpdateProfileInput!): UserProfile
    updateUserSettings(input: UpdateSettingsInput!): UserSettings
    followUser(userId: ID!): FollowResult
    unfollowUser(userId: ID!): FollowResult
    sendFriendRequest(userId: ID!, message: String): FriendRequest
    respondToFriendRequest(requestId: ID!, accept: Boolean!): FriendRequestResponse
    updateNotificationPreferences(preferences: NotificationPreferencesInput!): UserNotificationPreferences
    inviteFriend(email: String!, message: String): InviteResult
  }

  type UserProfile {
    id: ID!
    userId: ID!
    displayName: String
    bio: String
    location: String
    website: String
    pronouns: String
    profileVisibility: String
    moodVisibility: String
    isFollowing: Boolean
    isFollowedBy: Boolean
    isFriend: Boolean
    stats: UserStats
    createdAt: String
    updatedAt: String
  }

  type UserStats {
    followingCount: Int
    followersCount: Int
    hugsGiven: Int
    hugsReceived: Int
    moodEntries: Int
    currentStreak: Int
  }

  type UserSettings {
    id: ID!
    userId: ID!
    themePreference: String
    enableMoodReminders: Boolean
    moodReminderTime: String
    enableHapticFeedback: Boolean
    receiveHugNotifications: Boolean
    receiveMoodNotifications: Boolean
    enableSounds: Boolean
    createdAt: String
    updatedAt: String
  }

  type FollowConnection {
    users: [UserProfile]
    totalCount: Int
    hasMore: Boolean
  }

  type FollowResult {
    success: Boolean!
    user: UserProfile
    error: String
  }

  type FriendRequest {
    id: ID!
    sender: UserProfile
    receiver: UserProfile
    status: String!
    message: String
    createdAt: String
    updatedAt: String
  }

  type FriendRequestResponse {
    success: Boolean!
    request: FriendRequest
    error: String
  }

  type UserNotificationPreferences {
    id: ID!
    userId: ID!
    email: Boolean
    push: Boolean
    inApp: Boolean
    hugs: Boolean
    friendRequests: Boolean
    moodUpdates: Boolean
    streakReminders: Boolean
    groupActivities: Boolean
    createdAt: String
    updatedAt: String
  }

  type UserSuggestion {
    user: UserProfile
    mutualFriends: Int
    reason: String
  }

  type InviteResult {
    success: Boolean!
    message: String
  }

  input UpdateProfileInput {
    displayName: String
    bio: String
    location: String
    website: String
    pronouns: String
    profileVisibility: String
    moodVisibility: String
  }

  input UpdateSettingsInput {
    themePreference: String
    enableMoodReminders: Boolean
    moodReminderTime: String
    enableHapticFeedback: Boolean
    receiveHugNotifications: Boolean
    receiveMoodNotifications: Boolean
    enableSounds: Boolean
  }

  input NotificationPreferencesInput {
    email: Boolean
    push: Boolean
    inApp: Boolean
    hugs: Boolean
    friendRequests: Boolean
    moodUpdates: Boolean
    streakReminders: Boolean
    groupActivities: Boolean
  }
`;

// Resolvers
const resolvers = {
  Query: {
    userProfile: async (_, { userId }, { user }) => {
      try {
        // Check if profile exists
        const profileResult = await pool.query(
          'SELECT * FROM "UserProfile" WHERE "userId" = $1',
          [userId]
        );
        
        if (profileResult.rows.length === 0) {
          // Create default profile if it doesn't exist
          const now = new Date();
          const profileId = uuidv4();
          
          const newProfile = await pool.query(
            `INSERT INTO "UserProfile" 
             (id, userId, profileVisibility, moodVisibility, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [profileId, userId, 'public', 'public', now, now]
          );
          
          return newProfile.rows[0];
        }
        
        const profile = profileResult.rows[0];
        
        // Add isFollowing field if authenticated
        if (user?.userId && user.userId !== userId) {
          const followResult = await pool.query(
            'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
            [user.userId, userId]
          );
          
          profile.isFollowing = followResult.rows.length > 0;
          
          // Check if followed by
          const followerResult = await pool.query(
            'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
            [userId, user.userId]
          );
          
          profile.isFollowedBy = followerResult.rows.length > 0;
          
          // Check if friends (mutual follow)
          profile.isFriend = profile.isFollowing && profile.isFollowedBy;
        }
        
        return profile;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile');
      }
    },
    
    userProfiles: async (_, { userIds }, { user }) => {
      try {
        const profiles = [];
        
        // Fetch profiles for each ID
        for (const userId of userIds) {
          const profileResult = await pool.query(
            'SELECT * FROM "UserProfile" WHERE "userId" = $1',
            [userId]
          );
          
          if (profileResult.rows.length > 0) {
            const profile = profileResult.rows[0];
            
            // Add isFollowing field if authenticated
            if (user?.userId && user.userId !== userId) {
              const followResult = await pool.query(
                'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
                [user.userId, userId]
              );
              
              profile.isFollowing = followResult.rows.length > 0;
              
              // Check if followed by
              const followerResult = await pool.query(
                'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
                [userId, user.userId]
              );
              
              profile.isFollowedBy = followerResult.rows.length > 0;
              
              // Check if friends (mutual follow)
              profile.isFriend = profile.isFollowing && profile.isFollowedBy;
            }
            
            profiles.push(profile);
          }
        }
        
        return profiles;
      } catch (error) {
        console.error('Error fetching user profiles:', error);
        throw new Error('Failed to fetch user profiles');
      }
    },
    
    userSettings: async (_, __, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Check if settings exist
        const settingsResult = await pool.query(
          'SELECT * FROM "UserSettings" WHERE "userId" = $1',
          [user.userId]
        );
        
        if (settingsResult.rows.length === 0) {
          // Create default settings if they don't exist
          const now = new Date();
          const settingsId = uuidv4();
          
          const newSettings = await pool.query(
            `INSERT INTO "UserSettings" 
             (id, userId, themePreference, enableMoodReminders, enableHapticFeedback, 
              receiveHugNotifications, receiveMoodNotifications, enableSounds, 
              createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
             RETURNING *`,
            [
              settingsId, 
              user.userId, 
              'system', 
              true, 
              true, 
              true, 
              true, 
              true, 
              now, 
              now
            ]
          );
          
          return newSettings.rows[0];
        }
        
        return settingsResult.rows[0];
      } catch (error) {
        console.error('Error fetching user settings:', error);
        throw new Error('Failed to fetch user settings');
      }
    },
    
    following: async (_, { userId, limit = 20, offset = 0 }, { user }) => {
      try {
        // Get total count
        const countResult = await pool.query(
          'SELECT COUNT(*) FROM "FollowRelationship" WHERE "followerId" = $1',
          [userId]
        );
        
        const totalCount = parseInt(countResult.rows[0].count);
        
        // Get following relationships
        const relationshipsResult = await pool.query(
          `SELECT "followingId" FROM "FollowRelationship" 
           WHERE "followerId" = $1 
           ORDER BY "createdAt" DESC 
           LIMIT $2 OFFSET $3`,
          [userId, limit, offset]
        );
        
        const followingIds = relationshipsResult.rows.map(row => row.followingId);
        
        // Get profiles for each following ID
        const profiles = [];
        
        for (const followingId of followingIds) {
          const profileResult = await pool.query(
            'SELECT * FROM "UserProfile" WHERE "userId" = $1',
            [followingId]
          );
          
          if (profileResult.rows.length > 0) {
            const profile = profileResult.rows[0];
            
            // Add isFollowing field
            profile.isFollowing = true;
            
            // Check if authenticated user is following this user
            if (user?.userId && user.userId !== userId) {
              const authUserFollowResult = await pool.query(
                'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
                [user.userId, followingId]
              );
              
              profile.isFollowingByAuthUser = authUserFollowResult.rows.length > 0;
            }
            
            profiles.push(profile);
          }
        }
        
        return {
          users: profiles,
          totalCount,
          hasMore: offset + profiles.length < totalCount
        };
      } catch (error) {
        console.error('Error fetching following:', error);
        throw new Error('Failed to fetch following users');
      }
    },
    
    followers: async (_, { userId, limit = 20, offset = 0 }, { user }) => {
      try {
        // Get total count
        const countResult = await pool.query(
          'SELECT COUNT(*) FROM "FollowRelationship" WHERE "followingId" = $1',
          [userId]
        );
        
        const totalCount = parseInt(countResult.rows[0].count);
        
        // Get follower relationships
        const relationshipsResult = await pool.query(
          `SELECT "followerId" FROM "FollowRelationship" 
           WHERE "followingId" = $1 
           ORDER BY "createdAt" DESC 
           LIMIT $2 OFFSET $3`,
          [userId, limit, offset]
        );
        
        const followerIds = relationshipsResult.rows.map(row => row.followerId);
        
        // Get profiles for each follower ID
        const profiles = [];
        
        for (const followerId of followerIds) {
          const profileResult = await pool.query(
            'SELECT * FROM "UserProfile" WHERE "userId" = $1',
            [followerId]
          );
          
          if (profileResult.rows.length > 0) {
            const profile = profileResult.rows[0];
            
            // Add isFollowedBy field
            profile.isFollowedBy = true;
            
            // Check if this user is followed by authenticated user
            if (user?.userId) {
              const followResult = await pool.query(
                'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
                [user.userId, followerId]
              );
              
              profile.isFollowing = followResult.rows.length > 0;
              
              // Check if friends (mutual follow)
              profile.isFriend = profile.isFollowing && profile.isFollowedBy;
            }
            
            profiles.push(profile);
          }
        }
        
        return {
          users: profiles,
          totalCount,
          hasMore: offset + profiles.length < totalCount
        };
      } catch (error) {
        console.error('Error fetching followers:', error);
        throw new Error('Failed to fetch followers');
      }
    },
    
    friendRequests: async (_, { status = 'pending' }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get sent requests
        const sentResult = await pool.query(
          `SELECT * FROM "FriendRequest" 
           WHERE "senderId" = $1 AND "status" = $2 
           ORDER BY "createdAt" DESC`,
          [user.userId, status]
        );
        
        // Get received requests
        const receivedResult = await pool.query(
          `SELECT * FROM "FriendRequest" 
           WHERE "receiverId" = $1 AND "status" = $2 
           ORDER BY "createdAt" DESC`,
          [user.userId, status]
        );
        
        const requests = [...sentResult.rows, ...receivedResult.rows];
        
        // Get profiles for senders and receivers
        for (const request of requests) {
          // Get sender profile
          const senderResult = await pool.query(
            'SELECT * FROM "UserProfile" WHERE "userId" = $1',
            [request.senderId]
          );
          
          if (senderResult.rows.length > 0) {
            request.sender = senderResult.rows[0];
          }
          
          // Get receiver profile
          const receiverResult = await pool.query(
            'SELECT * FROM "UserProfile" WHERE "userId" = $1',
            [request.receiverId]
          );
          
          if (receiverResult.rows.length > 0) {
            request.receiver = receiverResult.rows[0];
          }
        }
        
        return requests;
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        throw new Error('Failed to fetch friend requests');
      }
    },
    
    searchUsers: async (_, { query, limit = 10 }, { user }) => {
      try {
        // Search users by display name or user ID
        // This is a simplified implementation - in a real app, you would:
        // 1. Use more sophisticated search (like full-text search)
        // 2. Apply proper privacy filtering
        // 3. Integrate with the Users table from the Auth service
        
        const searchResult = await pool.query(
          `SELECT * FROM "UserProfile" 
           WHERE "displayName" ILIKE $1 OR "userId" ILIKE $1 
           LIMIT $2`,
          [`%${query}%`, limit]
        );
        
        const profiles = searchResult.rows;
        
        // Add relationship information if authenticated
        if (user?.userId) {
          for (const profile of profiles) {
            // Skip if it's the authenticated user
            if (profile.userId === user.userId) {
              continue;
            }
            
            // Check if following
            const followResult = await pool.query(
              'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
              [user.userId, profile.userId]
            );
            
            profile.isFollowing = followResult.rows.length > 0;
            
            // Check if followed by
            const followerResult = await pool.query(
              'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
              [profile.userId, user.userId]
            );
            
            profile.isFollowedBy = followerResult.rows.length > 0;
            
            // Check if friends (mutual follow)
            profile.isFriend = profile.isFollowing && profile.isFollowedBy;
          }
        }
        
        return profiles;
      } catch (error) {
        console.error('Error searching users:', error);
        throw new Error('Failed to search users');
      }
    },
    
    suggestedFriends: async (_, { limit = 5 }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // This is a simplified implementation - in a real app, you would:
        // 1. Use more sophisticated recommendation algorithms
        // 2. Consider various factors like mutual friends, interests, etc.
        
        // Find users who are followed by people the user follows (mutual connections)
        const suggestionsResult = await pool.query(
          `SELECT f2."followingId" as "userId", COUNT(*) as "mutualCount"
           FROM "FollowRelationship" f1
           JOIN "FollowRelationship" f2 ON f1."followingId" = f2."followerId"
           WHERE f1."followerId" = $1
           AND f2."followingId" != $1
           AND NOT EXISTS (
             SELECT 1 FROM "FollowRelationship"
             WHERE "followerId" = $1 AND "followingId" = f2."followingId"
           )
           GROUP BY f2."followingId"
           ORDER BY "mutualCount" DESC
           LIMIT $2`,
          [user.userId, limit]
        );
        
        const suggestions = [];
        
        for (const row of suggestionsResult.rows) {
          // Get user profile
          const profileResult = await pool.query(
            'SELECT * FROM "UserProfile" WHERE "userId" = $1',
            [row.userId]
          );
          
          if (profileResult.rows.length > 0) {
            const profile = profileResult.rows[0];
            
            suggestions.push({
              user: profile,
              mutualFriends: parseInt(row.mutualCount),
              reason: `${row.mutualCount} mutual connections`
            });
          }
        }
        
        // If we don't have enough suggestions, add some random users
        if (suggestions.length < limit) {
          const randomResult = await pool.query(
            `SELECT * FROM "UserProfile"
             WHERE "userId" != $1
             AND NOT EXISTS (
               SELECT 1 FROM "FollowRelationship"
               WHERE "followerId" = $1 AND "followingId" = "UserProfile"."userId"
             )
             AND "userId" NOT IN (${suggestions.map(s => `'${s.user.userId}'`).join(',') || "''"})
             ORDER BY RANDOM()
             LIMIT $2`,
            [user.userId, limit - suggestions.length]
          );
          
          for (const profile of randomResult.rows) {
            suggestions.push({
              user: profile,
              mutualFriends: 0,
              reason: 'Suggested for you'
            });
          }
        }
        
        return suggestions;
      } catch (error) {
        console.error('Error getting suggested friends:', error);
        throw new Error('Failed to get suggested friends');
      }
    }
  },
  
  Mutation: {
    updateUserProfile: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Check if profile exists
        const profileResult = await pool.query(
          'SELECT * FROM "UserProfile" WHERE "userId" = $1',
          [user.userId]
        );
        
        const now = new Date();
        
        if (profileResult.rows.length === 0) {
          // Create profile if it doesn't exist
          const profileId = uuidv4();
          
          const newProfile = await pool.query(
            `INSERT INTO "UserProfile" 
             (id, userId, displayName, bio, location, website, pronouns, 
              profileVisibility, moodVisibility, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
             RETURNING *`,
            [
              profileId,
              user.userId,
              input.displayName || null,
              input.bio || null,
              input.location || null,
              input.website || null,
              input.pronouns || null,
              input.profileVisibility || 'public',
              input.moodVisibility || 'public',
              now,
              now
            ]
          );
          
          return newProfile.rows[0];
        }
        
        // Update existing profile
        const fieldsToUpdate = [];
        const values = [];
        let valueIndex = 1;
        
        // Build dynamic SET clause
        if (input.displayName !== undefined) {
          fieldsToUpdate.push(`"displayName" = $${valueIndex++}`);
          values.push(input.displayName);
        }
        
        if (input.bio !== undefined) {
          fieldsToUpdate.push(`"bio" = $${valueIndex++}`);
          values.push(input.bio);
        }
        
        if (input.location !== undefined) {
          fieldsToUpdate.push(`"location" = $${valueIndex++}`);
          values.push(input.location);
        }
        
        if (input.website !== undefined) {
          fieldsToUpdate.push(`"website" = $${valueIndex++}`);
          values.push(input.website);
        }
        
        if (input.pronouns !== undefined) {
          fieldsToUpdate.push(`"pronouns" = $${valueIndex++}`);
          values.push(input.pronouns);
        }
        
        if (input.profileVisibility !== undefined) {
          fieldsToUpdate.push(`"profileVisibility" = $${valueIndex++}`);
          values.push(input.profileVisibility);
        }
        
        if (input.moodVisibility !== undefined) {
          fieldsToUpdate.push(`"moodVisibility" = $${valueIndex++}`);
          values.push(input.moodVisibility);
        }
        
        // Add updatedAt
        fieldsToUpdate.push(`"updatedAt" = $${valueIndex++}`);
        values.push(now);
        
        // Add userId to values
        values.push(user.userId);
        
        // Update profile
        const updateQuery = `
          UPDATE "UserProfile" 
          SET ${fieldsToUpdate.join(', ')} 
          WHERE "userId" = $${valueIndex} 
          RETURNING *
        `;
        
        const updatedProfile = await pool.query(updateQuery, values);
        
        return updatedProfile.rows[0];
      } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update user profile');
      }
    },
    
    updateUserSettings: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Check if settings exist
        const settingsResult = await pool.query(
          'SELECT * FROM "UserSettings" WHERE "userId" = $1',
          [user.userId]
        );
        
        const now = new Date();
        
        if (settingsResult.rows.length === 0) {
          // Create settings if they don't exist
          const settingsId = uuidv4();
          
          const newSettings = await pool.query(
            `INSERT INTO "UserSettings" 
             (id, userId, themePreference, enableMoodReminders, moodReminderTime,
              enableHapticFeedback, receiveHugNotifications, receiveMoodNotifications,
              enableSounds, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
             RETURNING *`,
            [
              settingsId,
              user.userId,
              input.themePreference || 'system',
              input.enableMoodReminders !== undefined ? input.enableMoodReminders : true,
              input.moodReminderTime || null,
              input.enableHapticFeedback !== undefined ? input.enableHapticFeedback : true,
              input.receiveHugNotifications !== undefined ? input.receiveHugNotifications : true,
              input.receiveMoodNotifications !== undefined ? input.receiveMoodNotifications : true,
              input.enableSounds !== undefined ? input.enableSounds : true,
              now,
              now
            ]
          );
          
          return newSettings.rows[0];
        }
        
        // Update existing settings
        const fieldsToUpdate = [];
        const values = [];
        let valueIndex = 1;
        
        // Build dynamic SET clause
        if (input.themePreference !== undefined) {
          fieldsToUpdate.push(`"themePreference" = $${valueIndex++}`);
          values.push(input.themePreference);
        }
        
        if (input.enableMoodReminders !== undefined) {
          fieldsToUpdate.push(`"enableMoodReminders" = $${valueIndex++}`);
          values.push(input.enableMoodReminders);
        }
        
        if (input.moodReminderTime !== undefined) {
          fieldsToUpdate.push(`"moodReminderTime" = $${valueIndex++}`);
          values.push(input.moodReminderTime);
        }
        
        if (input.enableHapticFeedback !== undefined) {
          fieldsToUpdate.push(`"enableHapticFeedback" = $${valueIndex++}`);
          values.push(input.enableHapticFeedback);
        }
        
        if (input.receiveHugNotifications !== undefined) {
          fieldsToUpdate.push(`"receiveHugNotifications" = $${valueIndex++}`);
          values.push(input.receiveHugNotifications);
        }
        
        if (input.receiveMoodNotifications !== undefined) {
          fieldsToUpdate.push(`"receiveMoodNotifications" = $${valueIndex++}`);
          values.push(input.receiveMoodNotifications);
        }
        
        if (input.enableSounds !== undefined) {
          fieldsToUpdate.push(`"enableSounds" = $${valueIndex++}`);
          values.push(input.enableSounds);
        }
        
        // Add updatedAt
        fieldsToUpdate.push(`"updatedAt" = $${valueIndex++}`);
        values.push(now);
        
        // Add userId to values
        values.push(user.userId);
        
        // Update settings
        const updateQuery = `
          UPDATE "UserSettings" 
          SET ${fieldsToUpdate.join(', ')} 
          WHERE "userId" = $${valueIndex} 
          RETURNING *
        `;
        
        const updatedSettings = await pool.query(updateQuery, values);
        
        return updatedSettings.rows[0];
      } catch (error) {
        console.error('Error updating user settings:', error);
        throw new Error('Failed to update user settings');
      }
    },
    
    followUser: async (_, { userId }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      if (user.userId === userId) {
        return {
          success: false,
          error: 'You cannot follow yourself'
        };
      }
      
      try {
        // Check if already following
        const followResult = await pool.query(
          'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
          [user.userId, userId]
        );
        
        if (followResult.rows.length > 0) {
          return {
            success: false,
            error: 'Already following this user'
          };
        }
        
        // Create follow relationship
        const now = new Date();
        const followId = uuidv4();
        
        await pool.query(
          `INSERT INTO "FollowRelationship" 
           (id, followerId, followingId, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5)`,
          [followId, user.userId, userId, now, now]
        );
        
        // Get user profile
        const profileResult = await pool.query(
          'SELECT * FROM "UserProfile" WHERE "userId" = $1',
          [userId]
        );
        
        let profile;
        
        if (profileResult.rows.length > 0) {
          profile = profileResult.rows[0];
        } else {
          // Create a default profile if it doesn't exist
          const profileId = uuidv4();
          
          const newProfile = await pool.query(
            `INSERT INTO "UserProfile" 
             (id, userId, profileVisibility, moodVisibility, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [profileId, userId, 'public', 'public', now, now]
          );
          
          profile = newProfile.rows[0];
        }
        
        profile.isFollowing = true;
        
        return {
          success: true,
          user: profile
        };
      } catch (error) {
        console.error('Error following user:', error);
        return {
          success: false,
          error: 'Failed to follow user'
        };
      }
    },
    
    unfollowUser: async (_, { userId }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      if (user.userId === userId) {
        return {
          success: false,
          error: 'Invalid operation'
        };
      }
      
      try {
        // Delete follow relationship
        await pool.query(
          'DELETE FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
          [user.userId, userId]
        );
        
        // Get user profile
        const profileResult = await pool.query(
          'SELECT * FROM "UserProfile" WHERE "userId" = $1',
          [userId]
        );
        
        if (profileResult.rows.length === 0) {
          return {
            success: true,
            user: null
          };
        }
        
        const profile = profileResult.rows[0];
        profile.isFollowing = false;
        
        return {
          success: true,
          user: profile
        };
      } catch (error) {
        console.error('Error unfollowing user:', error);
        return {
          success: false,
          error: 'Failed to unfollow user'
        };
      }
    },
    
    sendFriendRequest: async (_, { userId, message }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      if (user.userId === userId) {
        throw new Error('You cannot send a friend request to yourself');
      }
      
      try {
        // Check if already friends (following each other)
        const followResult = await pool.query(
          'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
          [user.userId, userId]
        );
        
        const followedByResult = await pool.query(
          'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
          [userId, user.userId]
        );
        
        if (followResult.rows.length > 0 && followedByResult.rows.length > 0) {
          throw new Error('You are already friends with this user');
        }
        
        // Check if a request already exists
        const existingRequest = await pool.query(
          `SELECT * FROM "FriendRequest" 
           WHERE ("senderId" = $1 AND "receiverId" = $2) OR 
                 ("senderId" = $2 AND "receiverId" = $1) AND 
                 "status" = 'pending'`,
          [user.userId, userId]
        );
        
        if (existingRequest.rows.length > 0) {
          throw new Error('A friend request already exists');
        }
        
        // Create friend request
        const now = new Date();
        const requestId = uuidv4();
        
        const requestResult = await pool.query(
          `INSERT INTO "FriendRequest" 
           (id, senderId, receiverId, status, message, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) 
           RETURNING *`,
          [requestId, user.userId, userId, 'pending', message || null, now, now]
        );
        
        const request = requestResult.rows[0];
        
        // Get sender profile
        const senderResult = await pool.query(
          'SELECT * FROM "UserProfile" WHERE "userId" = $1',
          [user.userId]
        );
        
        if (senderResult.rows.length > 0) {
          request.sender = senderResult.rows[0];
        } else {
          // Create default profile
          const profileId = uuidv4();
          
          const newProfile = await pool.query(
            `INSERT INTO "UserProfile" 
             (id, userId, profileVisibility, moodVisibility, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [profileId, user.userId, 'public', 'public', now, now]
          );
          
          request.sender = newProfile.rows[0];
        }
        
        // Get receiver profile
        const receiverResult = await pool.query(
          'SELECT * FROM "UserProfile" WHERE "userId" = $1',
          [userId]
        );
        
        if (receiverResult.rows.length > 0) {
          request.receiver = receiverResult.rows[0];
        } else {
          // Create default profile
          const profileId = uuidv4();
          
          const newProfile = await pool.query(
            `INSERT INTO "UserProfile" 
             (id, userId, profileVisibility, moodVisibility, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [profileId, userId, 'public', 'public', now, now]
          );
          
          request.receiver = newProfile.rows[0];
        }
        
        return request;
      } catch (error) {
        console.error('Error sending friend request:', error);
        throw new Error(error.message || 'Failed to send friend request');
      }
    },
    
    respondToFriendRequest: async (_, { requestId, accept }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the request
        const requestResult = await pool.query(
          'SELECT * FROM "FriendRequest" WHERE id = $1',
          [requestId]
        );
        
        if (requestResult.rows.length === 0) {
          return {
            success: false,
            error: 'Friend request not found'
          };
        }
        
        const request = requestResult.rows[0];
        
        // Verify the user is the receiver
        if (request.receiverId !== user.userId) {
          return {
            success: false,
            error: 'You are not authorized to respond to this request'
          };
        }
        
        // Check if request is already handled
        if (request.status !== 'pending') {
          return {
            success: false,
            error: 'This request has already been handled'
          };
        }
        
        // Update request status
        const now = new Date();
        const newStatus = accept ? 'accepted' : 'declined';
        
        const updatedRequest = await pool.query(
          `UPDATE "FriendRequest" 
           SET status = $1, updatedAt = $2 
           WHERE id = $3 
           RETURNING *`,
          [newStatus, now, requestId]
        );
        
        const result = updatedRequest.rows[0];
        
        // If accepted, create mutual follow relationships
        if (accept) {
          // Check if already following each other
          const followResult = await pool.query(
            'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
            [user.userId, request.senderId]
          );
          
          const followedByResult = await pool.query(
            'SELECT * FROM "FollowRelationship" WHERE "followerId" = $1 AND "followingId" = $2',
            [request.senderId, user.userId]
          );
          
          // Create relationships if they don't exist
          if (followResult.rows.length === 0) {
            await pool.query(
              `INSERT INTO "FollowRelationship" 
               (id, followerId, followingId, createdAt, updatedAt) 
               VALUES ($1, $2, $3, $4, $5)`,
              [uuidv4(), user.userId, request.senderId, now, now]
            );
          }
          
          if (followedByResult.rows.length === 0) {
            await pool.query(
              `INSERT INTO "FollowRelationship" 
               (id, followerId, followingId, createdAt, updatedAt) 
               VALUES ($1, $2, $3, $4, $5)`,
              [uuidv4(), request.senderId, user.userId, now, now]
            );
          }
        }
        
        // Get profiles for sender and receiver
        const senderResult = await pool.query(
          'SELECT * FROM "UserProfile" WHERE "userId" = $1',
          [request.senderId]
        );
        
        if (senderResult.rows.length > 0) {
          result.sender = senderResult.rows[0];
        }
        
        const receiverResult = await pool.query(
          'SELECT * FROM "UserProfile" WHERE "userId" = $1',
          [request.receiverId]
        );
        
        if (receiverResult.rows.length > 0) {
          result.receiver = receiverResult.rows[0];
        }
        
        return {
          success: true,
          request: result
        };
      } catch (error) {
        console.error('Error responding to friend request:', error);
        return {
          success: false,
          error: 'Failed to respond to friend request'
        };
      }
    },
    
    updateNotificationPreferences: async (_, { preferences }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Check if preferences exist
        const prefsResult = await pool.query(
          'SELECT * FROM "UserNotificationPreferences" WHERE "userId" = $1',
          [user.userId]
        );
        
        const now = new Date();
        
        if (prefsResult.rows.length === 0) {
          // Create preferences if they don't exist
          const prefsId = uuidv4();
          
          const newPrefs = await pool.query(
            `INSERT INTO "UserNotificationPreferences" 
             (id, userId, email, push, inApp, hugs, friendRequests, 
              moodUpdates, streakReminders, groupActivities, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
             RETURNING *`,
            [
              prefsId,
              user.userId,
              preferences.email !== undefined ? preferences.email : true,
              preferences.push !== undefined ? preferences.push : true,
              preferences.inApp !== undefined ? preferences.inApp : true,
              preferences.hugs !== undefined ? preferences.hugs : true,
              preferences.friendRequests !== undefined ? preferences.friendRequests : true,
              preferences.moodUpdates !== undefined ? preferences.moodUpdates : true,
              preferences.streakReminders !== undefined ? preferences.streakReminders : true,
              preferences.groupActivities !== undefined ? preferences.groupActivities : true,
              now,
              now
            ]
          );
          
          return newPrefs.rows[0];
        }
        
        // Update existing preferences
        const fieldsToUpdate = [];
        const values = [];
        let valueIndex = 1;
        
        // Build dynamic SET clause
        if (preferences.email !== undefined) {
          fieldsToUpdate.push(`"email" = $${valueIndex++}`);
          values.push(preferences.email);
        }
        
        if (preferences.push !== undefined) {
          fieldsToUpdate.push(`"push" = $${valueIndex++}`);
          values.push(preferences.push);
        }
        
        if (preferences.inApp !== undefined) {
          fieldsToUpdate.push(`"inApp" = $${valueIndex++}`);
          values.push(preferences.inApp);
        }
        
        if (preferences.hugs !== undefined) {
          fieldsToUpdate.push(`"hugs" = $${valueIndex++}`);
          values.push(preferences.hugs);
        }
        
        if (preferences.friendRequests !== undefined) {
          fieldsToUpdate.push(`"friendRequests" = $${valueIndex++}`);
          values.push(preferences.friendRequests);
        }
        
        if (preferences.moodUpdates !== undefined) {
          fieldsToUpdate.push(`"moodUpdates" = $${valueIndex++}`);
          values.push(preferences.moodUpdates);
        }
        
        if (preferences.streakReminders !== undefined) {
          fieldsToUpdate.push(`"streakReminders" = $${valueIndex++}`);
          values.push(preferences.streakReminders);
        }
        
        if (preferences.groupActivities !== undefined) {
          fieldsToUpdate.push(`"groupActivities" = $${valueIndex++}`);
          values.push(preferences.groupActivities);
        }
        
        // Add updatedAt
        fieldsToUpdate.push(`"updatedAt" = $${valueIndex++}`);
        values.push(now);
        
        // Add userId to values
        values.push(user.userId);
        
        // Update preferences
        const updateQuery = `
          UPDATE "UserNotificationPreferences" 
          SET ${fieldsToUpdate.join(', ')} 
          WHERE "userId" = $${valueIndex} 
          RETURNING *
        `;
        
        const updatedPrefs = await pool.query(updateQuery, values);
        
        return updatedPrefs.rows[0];
      } catch (error) {
        console.error('Error updating notification preferences:', error);
        throw new Error('Failed to update notification preferences');
      }
    },
    
    inviteFriend: async (_, { email, message }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // In a real app, you would:
        // 1. Validate the email
        // 2. Generate an invite token
        // 3. Send an email with the invite link
        // 4. Store the invitation in the database
        
        // For now, we'll just simulate success
        console.log(`Invitation email would be sent to ${email} with message: ${message || 'Join me on HugMood!'}`);
        
        return {
          success: true,
          message: 'Invitation sent successfully'
        };
      } catch (error) {
        console.error('Error sending invitation:', error);
        return {
          success: false,
          message: 'Failed to send invitation'
        };
      }
    }
  },
  
  UserProfile: {
    stats: async (parent, _, { user }) => {
      try {
        // Get following count
        const followingResult = await pool.query(
          'SELECT COUNT(*) FROM "FollowRelationship" WHERE "followerId" = $1',
          [parent.userId]
        );
        
        // Get followers count
        const followersResult = await pool.query(
          'SELECT COUNT(*) FROM "FollowRelationship" WHERE "followingId" = $1',
          [parent.userId]
        );
        
        // In a real app, you would fetch these from the respective services
        // For now, we'll return mock data
        return {
          followingCount: parseInt(followingResult.rows[0].count),
          followersCount: parseInt(followersResult.rows[0].count),
          hugsGiven: Math.floor(Math.random() * 100),
          hugsReceived: Math.floor(Math.random() * 100),
          moodEntries: Math.floor(Math.random() * 200),
          currentStreak: Math.floor(Math.random() * 30)
        };
      } catch (error) {
        console.error('Error fetching user stats:', error);
        return {
          followingCount: 0,
          followersCount: 0,
          hugsGiven: 0,
          hugsReceived: 0,
          moodEntries: 0,
          currentStreak: 0
        };
      }
    }
  }
};

// Middleware to handle authentication
const authMiddleware = (req) => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  let user = null;
  
  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production'
      );
      user = decoded;
    } catch (err) {
      console.error('Token verification error:', err.message);
    }
  }
  
  return { user, token };
};

async function startApolloServer() {
  // Initialize database
  await initDb();
  
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return authMiddleware(req);
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return error;
    }
  });
  
  // Start Apollo Server
  await server.start();
  
  // Apply middleware
  server.applyMiddleware({ app, path: '/graphql' });
  
  // Start HTTP server
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  
  console.log(`🚀 User Service ready at http://0.0.0.0:${PORT}${server.graphqlPath}`);
  
  return { server, app, httpServer };
}

// Express routes
app.get('/', (req, res) => {
  res.send('HugMood User Service');
});

// Start server
startApolloServer()
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

module.exports = { app, startApolloServer };