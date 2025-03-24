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
const PORT = process.env.HUG_SERVICE_PORT || 4004;

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
    // Create Hug table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Hugs" (
        "id" VARCHAR(255) PRIMARY KEY,
        "senderId" VARCHAR(255) NOT NULL,
        "recipientId" VARCHAR(255) NOT NULL,
        "hugType" VARCHAR(100) NOT NULL,
        "message" TEXT,
        "isRead" BOOLEAN DEFAULT false,
        "mediaUrl" TEXT,
        "metadata" JSONB,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create HugRequest table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "HugRequests" (
        "id" VARCHAR(255) PRIMARY KEY,
        "requesterId" VARCHAR(255) NOT NULL,
        "recipientId" VARCHAR(255),
        "message" TEXT,
        "isPublic" BOOLEAN DEFAULT false,
        "status" VARCHAR(50) DEFAULT 'pending',
        "expiresAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create GroupHug table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "GroupHugs" (
        "id" VARCHAR(255) PRIMARY KEY,
        "creatorId" VARCHAR(255) NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "message" TEXT,
        "hugType" VARCHAR(100) NOT NULL,
        "maxParticipants" INTEGER DEFAULT 0,
        "isPublic" BOOLEAN DEFAULT false,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create GroupHugParticipant table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "GroupHugParticipants" (
        "id" VARCHAR(255) PRIMARY KEY,
        "groupHugId" VARCHAR(255) NOT NULL,
        "userId" VARCHAR(255) NOT NULL,
        "status" VARCHAR(50) DEFAULT 'active',
        "joinedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        UNIQUE("groupHugId", "userId")
      )
    `);
    
    // Create GroupHugMessage table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "GroupHugMessages" (
        "id" VARCHAR(255) PRIMARY KEY,
        "groupHugId" VARCHAR(255) NOT NULL,
        "senderId" VARCHAR(255) NOT NULL,
        "message" TEXT NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create MediaHug table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "MediaHugs" (
        "id" VARCHAR(255) PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "creatorId" VARCHAR(255) NOT NULL,
        "mediaType" VARCHAR(50) NOT NULL,
        "mediaUrl" TEXT NOT NULL,
        "thumbnailUrl" TEXT,
        "duration" INTEGER,
        "category" VARCHAR(100),
        "tags" TEXT[],
        "moodTags" TEXT[],
        "isPublic" BOOLEAN DEFAULT true,
        "isVerified" BOOLEAN DEFAULT false,
        "viewCount" INTEGER DEFAULT 0,
        "likeCount" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create UserMediaHug table (for user-saved media)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "UserMediaHugs" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "mediaHugId" VARCHAR(255) NOT NULL,
        "isFavorite" BOOLEAN DEFAULT false,
        "lastViewedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        UNIQUE("userId", "mediaHugId")
      )
    `);
    
    // Create WellnessActivities table (for streaks)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "WellnessActivities" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "activityType" VARCHAR(100) NOT NULL,
        "relatedEntityId" VARCHAR(255),
        "metadata" JSONB,
        "streakPoints" INTEGER DEFAULT 1,
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
    hug(id: ID!): Hug
    hugs(userId: ID!, type: String, limit: Int, offset: Int): HugConnection
    hugRequests(userId: ID!, status: String, isPublic: Boolean, limit: Int, offset: Int): HugRequestConnection
    groupHug(id: ID!): GroupHug
    groupHugs(userId: ID!, status: String, limit: Int, offset: Int): GroupHugConnection
    mediaHug(id: ID!): MediaHug
    mediaHugs(category: String, mood: String, limit: Int, offset: Int): MediaHugConnection
    featuredMediaHugs(limit: Int): [MediaHug]
    popularMediaHugs(limit: Int): [MediaHug]
    userMediaHugs(userId: ID!, onlyFavorites: Boolean, limit: Int, offset: Int): UserMediaHugConnection
  }

  type Mutation {
    sendHug(input: SendHugInput!): Hug
    readHug(id: ID!): Hug
    deleteHug(id: ID!): Boolean
    requestHug(input: RequestHugInput!): HugRequest
    respondToHugRequest(id: ID!, accept: Boolean!): HugRequest
    cancelHugRequest(id: ID!): Boolean
    createGroupHug(input: CreateGroupHugInput!): GroupHug
    joinGroupHug(id: ID!): GroupHugParticipant
    leaveGroupHug(id: ID!): Boolean
    sendGroupHugMessage(input: GroupHugMessageInput!): GroupHugMessage
    createMediaHug(input: CreateMediaHugInput!): MediaHug
    updateMediaHug(id: ID!, input: UpdateMediaHugInput!): MediaHug
    deleteMediaHug(id: ID!): Boolean
    favoriteMediaHug(id: ID!, isFavorite: Boolean!): UserMediaHug
    viewMediaHug(id: ID!): MediaHug
    likeMediaHug(id: ID!, isLiked: Boolean!): MediaHug
  }

  type Hug {
    id: ID!
    sender: User
    recipient: User
    hugType: String!
    message: String
    isRead: Boolean
    mediaUrl: String
    metadata: JSON
    createdAt: String!
    updatedAt: String!
  }

  type HugConnection {
    hugs: [Hug]
    totalCount: Int
    hasMore: Boolean
  }

  type HugRequest {
    id: ID!
    requester: User
    recipient: User
    message: String
    isPublic: Boolean
    status: String!
    expiresAt: String
    createdAt: String!
    updatedAt: String!
  }

  type HugRequestConnection {
    requests: [HugRequest]
    totalCount: Int
    hasMore: Boolean
  }

  type GroupHug {
    id: ID!
    creator: User
    title: String!
    message: String
    hugType: String!
    participants: [GroupHugParticipant]
    maxParticipants: Int
    isPublic: Boolean
    expiresAt: String!
    messages: [GroupHugMessage]
    createdAt: String!
    updatedAt: String!
    participantCount: Int
    hasJoined: Boolean
  }

  type GroupHugConnection {
    groups: [GroupHug]
    totalCount: Int
    hasMore: Boolean
  }

  type GroupHugParticipant {
    id: ID!
    user: User
    status: String!
    joinedAt: String!
    createdAt: String!
    updatedAt: String!
  }

  type GroupHugMessage {
    id: ID!
    sender: User
    message: String!
    createdAt: String!
    updatedAt: String!
  }

  type MediaHug {
    id: ID!
    title: String!
    description: String
    creator: User
    mediaType: String!
    mediaUrl: String!
    thumbnailUrl: String
    duration: Int
    category: String
    tags: [String]
    moodTags: [String]
    isPublic: Boolean
    isVerified: Boolean
    viewCount: Int
    likeCount: Int
    createdAt: String!
    updatedAt: String!
    isFavorite: Boolean
    isLiked: Boolean
  }

  type MediaHugConnection {
    mediaHugs: [MediaHug]
    totalCount: Int
    hasMore: Boolean
  }

  type UserMediaHug {
    id: ID!
    user: User
    mediaHug: MediaHug
    isFavorite: Boolean
    lastViewedAt: String
    createdAt: String!
    updatedAt: String!
  }

  type UserMediaHugConnection {
    userMediaHugs: [UserMediaHug]
    totalCount: Int
    hasMore: Boolean
  }

  type User {
    id: ID!
    username: String!
    name: String
    avatar: String
    isOnline: Boolean
  }

  input SendHugInput {
    recipientId: ID!
    hugType: String!
    message: String
    mediaUrl: String
    metadata: JSON
  }

  input RequestHugInput {
    recipientId: ID
    message: String
    isPublic: Boolean
  }

  input CreateGroupHugInput {
    title: String!
    message: String
    hugType: String!
    maxParticipants: Int
    isPublic: Boolean
    duration: Int!
    invitedUsers: [ID]
  }

  input GroupHugMessageInput {
    groupHugId: ID!
    message: String!
  }

  input CreateMediaHugInput {
    title: String!
    description: String
    mediaType: String!
    mediaUrl: String!
    thumbnailUrl: String
    duration: Int
    category: String
    tags: [String]
    moodTags: [String]
    isPublic: Boolean
  }

  input UpdateMediaHugInput {
    title: String
    description: String
    thumbnailUrl: String
    duration: Int
    category: String
    tags: [String]
    moodTags: [String]
    isPublic: Boolean
  }

  scalar JSON
`;

// Resolvers
const resolvers = {
  Query: {
    hug: async (_, { id }, { user }) => {
      try {
        const hugResult = await pool.query(
          'SELECT * FROM "Hugs" WHERE id = $1',
          [id]
        );
        
        if (hugResult.rows.length === 0) {
          return null;
        }
        
        const hug = hugResult.rows[0];
        
        // Check permission
        if (hug.senderId !== user?.userId && hug.recipientId !== user?.userId) {
          throw new Error('You do not have permission to view this hug');
        }
        
        // Fetch sender and recipient info
        hug.sender = await getUserInfo(hug.senderId);
        hug.recipient = await getUserInfo(hug.recipientId);
        
        return hug;
      } catch (error) {
        console.error('Error fetching hug:', error);
        throw new Error('Failed to fetch hug');
      }
    },
    
    hugs: async (_, { userId, type = 'all', limit = 20, offset = 0 }, { user }) => {
      try {
        // Check permission
        if (userId !== user?.userId) {
          throw new Error('You do not have permission to view these hugs');
        }
        
        let query;
        const params = [userId, limit, offset];
        
        if (type === 'sent') {
          query = `
            SELECT * FROM "Hugs" 
            WHERE "senderId" = $1 
            ORDER BY "createdAt" DESC 
            LIMIT $2 OFFSET $3
          `;
        } else if (type === 'received') {
          query = `
            SELECT * FROM "Hugs" 
            WHERE "recipientId" = $1 
            ORDER BY "createdAt" DESC 
            LIMIT $2 OFFSET $3
          `;
        } else {
          // All hugs (sent and received)
          query = `
            SELECT * FROM "Hugs" 
            WHERE "senderId" = $1 OR "recipientId" = $1 
            ORDER BY "createdAt" DESC 
            LIMIT $2 OFFSET $3
          `;
        }
        
        const hugsResult = await pool.query(query, params);
        
        // Count total
        let countQuery;
        
        if (type === 'sent') {
          countQuery = 'SELECT COUNT(*) FROM "Hugs" WHERE "senderId" = $1';
        } else if (type === 'received') {
          countQuery = 'SELECT COUNT(*) FROM "Hugs" WHERE "recipientId" = $1';
        } else {
          countQuery = 'SELECT COUNT(*) FROM "Hugs" WHERE "senderId" = $1 OR "recipientId" = $1';
        }
        
        const countResult = await pool.query(countQuery, [userId]);
        const totalCount = parseInt(countResult.rows[0].count);
        
        // Fetch sender and recipient info for each hug
        const hugs = [];
        
        for (const hug of hugsResult.rows) {
          hug.sender = await getUserInfo(hug.senderId);
          hug.recipient = await getUserInfo(hug.recipientId);
          hugs.push(hug);
        }
        
        return {
          hugs,
          totalCount,
          hasMore: offset + hugs.length < totalCount
        };
      } catch (error) {
        console.error('Error fetching hugs:', error);
        throw new Error('Failed to fetch hugs');
      }
    },
    
    hugRequests: async (_, { userId, status = 'pending', isPublic, limit = 20, offset = 0 }, { user }) => {
      try {
        // Build query based on parameters
        let query = 'SELECT * FROM "HugRequests" WHERE ';
        const queryParams = [];
        let paramIndex = 1;
        
        if (isPublic !== undefined) {
          // Public requests
          query += `"isPublic" = $${paramIndex++} `;
          queryParams.push(isPublic);
          
          if (status) {
            query += `AND "status" = $${paramIndex++} `;
            queryParams.push(status);
          }
        } else if (userId) {
          // User's requests
          if (userId !== user?.userId) {
            throw new Error('You do not have permission to view these requests');
          }
          
          query += `("requesterId" = $${paramIndex} OR "recipientId" = $${paramIndex}) `;
          queryParams.push(userId);
          paramIndex++;
          
          if (status) {
            query += `AND "status" = $${paramIndex++} `;
            queryParams.push(status);
          }
        } else {
          // Require either isPublic or userId
          throw new Error('Invalid query parameters');
        }
        
        // Add ordering and pagination
        query += `ORDER BY "createdAt" DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        queryParams.push(limit, offset);
        
        const requestsResult = await pool.query(query, queryParams);
        
        // Count total
        let countQuery = query.split('ORDER BY')[0];
        const countResult = await pool.query(
          `SELECT COUNT(*) FROM (${countQuery}) AS count_query`,
          queryParams.slice(0, -2)
        );
        
        const totalCount = parseInt(countResult.rows[0].count);
        
        // Fetch requester and recipient info for each request
        const requests = [];
        
        for (const request of requestsResult.rows) {
          request.requester = await getUserInfo(request.requesterId);
          
          if (request.recipientId) {
            request.recipient = await getUserInfo(request.recipientId);
          }
          
          requests.push(request);
        }
        
        return {
          requests,
          totalCount,
          hasMore: offset + requests.length < totalCount
        };
      } catch (error) {
        console.error('Error fetching hug requests:', error);
        throw new Error('Failed to fetch hug requests');
      }
    },
    
    groupHug: async (_, { id }, { user }) => {
      try {
        const groupResult = await pool.query(
          'SELECT * FROM "GroupHugs" WHERE id = $1',
          [id]
        );
        
        if (groupResult.rows.length === 0) {
          return null;
        }
        
        const group = groupResult.rows[0];
        
        // Check if expired
        if (new Date(group.expiresAt) < new Date()) {
          group.expired = true;
        }
        
        // Fetch creator info
        group.creator = await getUserInfo(group.creatorId);
        
        // Fetch participants
        const participantsResult = await pool.query(
          `SELECT * FROM "GroupHugParticipants" 
           WHERE "groupHugId" = $1 AND status = 'active' 
           ORDER BY "joinedAt" ASC`,
          [id]
        );
        
        const participants = [];
        
        for (const participant of participantsResult.rows) {
          participant.user = await getUserInfo(participant.userId);
          participants.push(participant);
        }
        
        group.participants = participants;
        group.participantCount = participants.length;
        
        // Check if user has joined
        if (user) {
          const participantResult = await pool.query(
            `SELECT * FROM "GroupHugParticipants" 
             WHERE "groupHugId" = $1 AND "userId" = $2 AND status = 'active'`,
            [id, user.userId]
          );
          
          group.hasJoined = participantResult.rows.length > 0;
        } else {
          group.hasJoined = false;
        }
        
        // Fetch messages if the user has joined or is the creator
        if (group.hasJoined || (user && group.creatorId === user.userId)) {
          const messagesResult = await pool.query(
            `SELECT * FROM "GroupHugMessages" 
             WHERE "groupHugId" = $1 
             ORDER BY "createdAt" ASC`,
            [id]
          );
          
          const messages = [];
          
          for (const message of messagesResult.rows) {
            message.sender = await getUserInfo(message.senderId);
            messages.push(message);
          }
          
          group.messages = messages;
        } else {
          group.messages = [];
        }
        
        return group;
      } catch (error) {
        console.error('Error fetching group hug:', error);
        throw new Error('Failed to fetch group hug');
      }
    },
    
    groupHugs: async (_, { userId, status = 'active', limit = 20, offset = 0 }, { user }) => {
      try {
        const now = new Date();
        let query;
        const queryParams = [];
        
        if (userId) {
          // User's groups
          if (userId !== user?.userId) {
            throw new Error('You do not have permission to view these group hugs');
          }
          
          if (status === 'active') {
            // Active groups (not expired) the user has joined
            query = `
              SELECT g.* FROM "GroupHugs" g
              JOIN "GroupHugParticipants" p ON g.id = p."groupHugId"
              WHERE p."userId" = $1 AND p.status = 'active' AND g."expiresAt" > $2
              ORDER BY g."createdAt" DESC
              LIMIT $3 OFFSET $4
            `;
            queryParams.push(userId, now, limit, offset);
          } else if (status === 'expired') {
            // Expired groups the user has joined
            query = `
              SELECT g.* FROM "GroupHugs" g
              JOIN "GroupHugParticipants" p ON g.id = p."groupHugId"
              WHERE p."userId" = $1 AND p.status = 'active' AND g."expiresAt" <= $2
              ORDER BY g."createdAt" DESC
              LIMIT $3 OFFSET $4
            `;
            queryParams.push(userId, now, limit, offset);
          } else if (status === 'created') {
            // Groups created by the user
            query = `
              SELECT * FROM "GroupHugs"
              WHERE "creatorId" = $1
              ORDER BY "createdAt" DESC
              LIMIT $2 OFFSET $3
            `;
            queryParams.push(userId, limit, offset);
          } else {
            // All groups the user is part of
            query = `
              SELECT g.* FROM "GroupHugs" g
              JOIN "GroupHugParticipants" p ON g.id = p."groupHugId"
              WHERE p."userId" = $1 AND p.status = 'active'
              ORDER BY g."createdAt" DESC
              LIMIT $2 OFFSET $3
            `;
            queryParams.push(userId, limit, offset);
          }
        } else {
          // Public groups
          if (status === 'active') {
            // Active public groups
            query = `
              SELECT * FROM "GroupHugs"
              WHERE "isPublic" = true AND "expiresAt" > $1
              ORDER BY "createdAt" DESC
              LIMIT $2 OFFSET $3
            `;
            queryParams.push(now, limit, offset);
          } else if (status === 'expired') {
            // Expired public groups
            query = `
              SELECT * FROM "GroupHugs"
              WHERE "isPublic" = true AND "expiresAt" <= $1
              ORDER BY "createdAt" DESC
              LIMIT $2 OFFSET $3
            `;
            queryParams.push(now, limit, offset);
          } else {
            // All public groups
            query = `
              SELECT * FROM "GroupHugs"
              WHERE "isPublic" = true
              ORDER BY "createdAt" DESC
              LIMIT $1 OFFSET $2
            `;
            queryParams.push(limit, offset);
          }
        }
        
        const groupsResult = await pool.query(query, queryParams);
        
        // Count total
        let countQuery = query.split('ORDER BY')[0].split('LIMIT')[0];
        
        if (countQuery.includes('SELECT g.*')) {
          countQuery = countQuery.replace('SELECT g.*', 'SELECT COUNT(*)');
        } else {
          countQuery = countQuery.replace('SELECT *', 'SELECT COUNT(*)');
        }
        
        const countResult = await pool.query(countQuery, queryParams.slice(0, -2));
        const totalCount = parseInt(countResult.rows[0].count);
        
        // Process each group
        const groups = [];
        
        for (const group of groupsResult.rows) {
          // Check if expired
          if (new Date(group.expiresAt) < now) {
            group.expired = true;
          }
          
          // Fetch creator info
          group.creator = await getUserInfo(group.creatorId);
          
          // Count participants
          const participantCountResult = await pool.query(
            `SELECT COUNT(*) FROM "GroupHugParticipants" 
             WHERE "groupHugId" = $1 AND status = 'active'`,
            [group.id]
          );
          
          group.participantCount = parseInt(participantCountResult.rows[0].count);
          
          // Check if user has joined
          if (user) {
            const participantResult = await pool.query(
              `SELECT * FROM "GroupHugParticipants" 
               WHERE "groupHugId" = $1 AND "userId" = $2 AND status = 'active'`,
              [group.id, user.userId]
            );
            
            group.hasJoined = participantResult.rows.length > 0;
          } else {
            group.hasJoined = false;
          }
          
          groups.push(group);
        }
        
        return {
          groups,
          totalCount,
          hasMore: offset + groups.length < totalCount
        };
      } catch (error) {
        console.error('Error fetching group hugs:', error);
        throw new Error('Failed to fetch group hugs');
      }
    },
    
    mediaHug: async (_, { id }, { user }) => {
      try {
        const mediaResult = await pool.query(
          'SELECT * FROM "MediaHugs" WHERE id = $1',
          [id]
        );
        
        if (mediaResult.rows.length === 0) {
          return null;
        }
        
        const media = mediaResult.rows[0];
        
        // Fetch creator info
        media.creator = await getUserInfo(media.creatorId);
        
        // Check if the media is favorited by the user
        if (user) {
          const favoriteResult = await pool.query(
            `SELECT * FROM "UserMediaHugs" 
             WHERE "userId" = $1 AND "mediaHugId" = $2 AND "isFavorite" = true`,
            [user.userId, id]
          );
          
          media.isFavorite = favoriteResult.rows.length > 0;
          
          // For now, we don't track likes separately
          media.isLiked = media.isFavorite;
        } else {
          media.isFavorite = false;
          media.isLiked = false;
        }
        
        return media;
      } catch (error) {
        console.error('Error fetching media hug:', error);
        throw new Error('Failed to fetch media hug');
      }
    },
    
    mediaHugs: async (_, { category, mood, limit = 20, offset = 0 }, { user }) => {
      try {
        // Build query based on parameters
        let query = 'SELECT * FROM "MediaHugs" WHERE "isPublic" = true';
        const queryParams = [];
        let paramIndex = 1;
        
        if (category) {
          query += ` AND "category" = $${paramIndex++}`;
          queryParams.push(category);
        }
        
        if (mood) {
          query += ` AND $${paramIndex++} = ANY("moodTags")`;
          queryParams.push(mood);
        }
        
        query += ` ORDER BY "createdAt" DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        queryParams.push(limit, offset);
        
        const mediaResult = await pool.query(query, queryParams);
        
        // Count total
        const countQuery = query.split('ORDER BY')[0];
        const countResult = await pool.query(
          `SELECT COUNT(*) FROM (${countQuery}) AS count_query`,
          queryParams.slice(0, -2)
        );
        
        const totalCount = parseInt(countResult.rows[0].count);
        
        // Process each media
        const mediaHugs = [];
        
        for (const media of mediaResult.rows) {
          // Fetch creator info
          media.creator = await getUserInfo(media.creatorId);
          
          // Check if the media is favorited by the user
          if (user) {
            const favoriteResult = await pool.query(
              `SELECT * FROM "UserMediaHugs" 
               WHERE "userId" = $1 AND "mediaHugId" = $2 AND "isFavorite" = true`,
              [user.userId, media.id]
            );
            
            media.isFavorite = favoriteResult.rows.length > 0;
            
            // For now, we don't track likes separately
            media.isLiked = media.isFavorite;
          } else {
            media.isFavorite = false;
            media.isLiked = false;
          }
          
          mediaHugs.push(media);
        }
        
        return {
          mediaHugs,
          totalCount,
          hasMore: offset + mediaHugs.length < totalCount
        };
      } catch (error) {
        console.error('Error fetching media hugs:', error);
        throw new Error('Failed to fetch media hugs');
      }
    },
    
    featuredMediaHugs: async (_, { limit = 5 }, { user }) => {
      try {
        // For now, just return the most recent verified media
        const mediaResult = await pool.query(
          `SELECT * FROM "MediaHugs" 
           WHERE "isPublic" = true AND "isVerified" = true 
           ORDER BY "createdAt" DESC 
           LIMIT $1`,
          [limit]
        );
        
        // Process each media
        const featuredHugs = [];
        
        for (const media of mediaResult.rows) {
          // Fetch creator info
          media.creator = await getUserInfo(media.creatorId);
          
          // Check if the media is favorited by the user
          if (user) {
            const favoriteResult = await pool.query(
              `SELECT * FROM "UserMediaHugs" 
               WHERE "userId" = $1 AND "mediaHugId" = $2 AND "isFavorite" = true`,
              [user.userId, media.id]
            );
            
            media.isFavorite = favoriteResult.rows.length > 0;
            media.isLiked = media.isFavorite;
          } else {
            media.isFavorite = false;
            media.isLiked = false;
          }
          
          featuredHugs.push(media);
        }
        
        return featuredHugs;
      } catch (error) {
        console.error('Error fetching featured media hugs:', error);
        throw new Error('Failed to fetch featured media hugs');
      }
    },
    
    popularMediaHugs: async (_, { limit = 5 }, { user }) => {
      try {
        // Return media with highest view counts
        const mediaResult = await pool.query(
          `SELECT * FROM "MediaHugs" 
           WHERE "isPublic" = true 
           ORDER BY "viewCount" DESC, "likeCount" DESC 
           LIMIT $1`,
          [limit]
        );
        
        // Process each media
        const popularHugs = [];
        
        for (const media of mediaResult.rows) {
          // Fetch creator info
          media.creator = await getUserInfo(media.creatorId);
          
          // Check if the media is favorited by the user
          if (user) {
            const favoriteResult = await pool.query(
              `SELECT * FROM "UserMediaHugs" 
               WHERE "userId" = $1 AND "mediaHugId" = $2 AND "isFavorite" = true`,
              [user.userId, media.id]
            );
            
            media.isFavorite = favoriteResult.rows.length > 0;
            media.isLiked = media.isFavorite;
          } else {
            media.isFavorite = false;
            media.isLiked = false;
          }
          
          popularHugs.push(media);
        }
        
        return popularHugs;
      } catch (error) {
        console.error('Error fetching popular media hugs:', error);
        throw new Error('Failed to fetch popular media hugs');
      }
    },
    
    userMediaHugs: async (_, { userId, onlyFavorites = false, limit = 20, offset = 0 }, { user }) => {
      try {
        // Check permission
        if (userId !== user?.userId) {
          throw new Error('You do not have permission to view these media hugs');
        }
        
        // Build query
        let query;
        const queryParams = [userId, limit, offset];
        
        if (onlyFavorites) {
          query = `
            SELECT um.*, m.* FROM "UserMediaHugs" um
            JOIN "MediaHugs" m ON um."mediaHugId" = m.id
            WHERE um."userId" = $1 AND um."isFavorite" = true
            ORDER BY um."updatedAt" DESC
            LIMIT $2 OFFSET $3
          `;
        } else {
          query = `
            SELECT um.*, m.* FROM "UserMediaHugs" um
            JOIN "MediaHugs" m ON um."mediaHugId" = m.id
            WHERE um."userId" = $1
            ORDER BY um."updatedAt" DESC
            LIMIT $2 OFFSET $3
          `;
        }
        
        const result = await pool.query(query, queryParams);
        
        // Count total
        let countQuery;
        
        if (onlyFavorites) {
          countQuery = `
            SELECT COUNT(*) FROM "UserMediaHugs"
            WHERE "userId" = $1 AND "isFavorite" = true
          `;
        } else {
          countQuery = `
            SELECT COUNT(*) FROM "UserMediaHugs"
            WHERE "userId" = $1
          `;
        }
        
        const countResult = await pool.query(countQuery, [userId]);
        const totalCount = parseInt(countResult.rows[0].count);
        
        // Process results
        const userMediaHugs = [];
        
        for (const row of result.rows) {
          const userMediaHug = {
            id: row.id,
            userId: row.userId,
            mediaHugId: row.mediaHugId,
            isFavorite: row.isFavorite,
            lastViewedAt: row.lastViewedAt,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            user: await getUserInfo(row.userId),
            mediaHug: {
              id: row.mediaHugId,
              title: row.title,
              description: row.description,
              creator: await getUserInfo(row.creatorId),
              mediaType: row.mediaType,
              mediaUrl: row.mediaUrl,
              thumbnailUrl: row.thumbnailUrl,
              duration: row.duration,
              category: row.category,
              tags: row.tags,
              moodTags: row.moodTags,
              isPublic: row.isPublic,
              isVerified: row.isVerified,
              viewCount: row.viewCount,
              likeCount: row.likeCount,
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
              isFavorite: row.isFavorite,
              isLiked: row.isFavorite // For now, same as favorite
            }
          };
          
          userMediaHugs.push(userMediaHug);
        }
        
        return {
          userMediaHugs,
          totalCount,
          hasMore: offset + userMediaHugs.length < totalCount
        };
      } catch (error) {
        console.error('Error fetching user media hugs:', error);
        throw new Error('Failed to fetch user media hugs');
      }
    }
  },
  
  Mutation: {
    sendHug: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        const { recipientId, hugType, message, mediaUrl, metadata } = input;
        
        // Validate input
        if (!recipientId || !hugType) {
          throw new Error('Recipient ID and hug type are required');
        }
        
        // Create hug
        const now = new Date();
        const hugId = uuidv4();
        
        const hugResult = await pool.query(
          `INSERT INTO "Hugs" 
           (id, senderId, recipientId, hugType, message, isRead, mediaUrl, metadata, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
           RETURNING *`,
          [
            hugId,
            user.userId,
            recipientId,
            hugType,
            message || null,
            false,
            mediaUrl || null,
            metadata || {},
            now,
            now
          ]
        );
        
        const hug = hugResult.rows[0];
        
        // Fetch sender and recipient info
        hug.sender = await getUserInfo(hug.senderId);
        hug.recipient = await getUserInfo(hug.recipientId);
        
        // Record wellness activity
        const activityId = uuidv4();
        
        await pool.query(
          `INSERT INTO "WellnessActivities" 
           (id, userId, activityType, relatedEntityId, metadata, streakPoints, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            activityId,
            user.userId,
            'hug_sent',
            hugId,
            { recipientId },
            1,
            now,
            now
          ]
        );
        
        return hug;
      } catch (error) {
        console.error('Error sending hug:', error);
        throw new Error('Failed to send hug');
      }
    },
    
    readHug: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the hug
        const hugResult = await pool.query(
          'SELECT * FROM "Hugs" WHERE id = $1',
          [id]
        );
        
        if (hugResult.rows.length === 0) {
          throw new Error('Hug not found');
        }
        
        const hug = hugResult.rows[0];
        
        // Check if user is the recipient
        if (hug.recipientId !== user.userId) {
          throw new Error('You do not have permission to mark this hug as read');
        }
        
        // Update hug
        const now = new Date();
        
        const updatedHug = await pool.query(
          `UPDATE "Hugs" 
           SET "isRead" = true, "updatedAt" = $1 
           WHERE id = $2 
           RETURNING *`,
          [now, id]
        );
        
        const result = updatedHug.rows[0];
        
        // Fetch sender and recipient info
        result.sender = await getUserInfo(result.senderId);
        result.recipient = await getUserInfo(result.recipientId);
        
        return result;
      } catch (error) {
        console.error('Error marking hug as read:', error);
        throw new Error('Failed to mark hug as read');
      }
    },
    
    deleteHug: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the hug
        const hugResult = await pool.query(
          'SELECT * FROM "Hugs" WHERE id = $1',
          [id]
        );
        
        if (hugResult.rows.length === 0) {
          throw new Error('Hug not found');
        }
        
        const hug = hugResult.rows[0];
        
        // Check if user is the sender or recipient
        if (hug.senderId !== user.userId && hug.recipientId !== user.userId) {
          throw new Error('You do not have permission to delete this hug');
        }
        
        // Delete hug
        await pool.query(
          'DELETE FROM "Hugs" WHERE id = $1',
          [id]
        );
        
        // Delete related wellness activity
        await pool.query(
          'DELETE FROM "WellnessActivities" WHERE "relatedEntityId" = $1',
          [id]
        );
        
        return true;
      } catch (error) {
        console.error('Error deleting hug:', error);
        throw new Error('Failed to delete hug');
      }
    },
    
    requestHug: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        const { recipientId, message, isPublic } = input;
        
        // Validate input
        if (!recipientId && !isPublic) {
          throw new Error('Either recipientId or isPublic must be provided');
        }
        
        // Create request
        const now = new Date();
        const expiryDate = new Date(now);
        expiryDate.setDate(expiryDate.getDate() + 7); // Expires in 7 days
        
        const requestId = uuidv4();
        
        const requestResult = await pool.query(
          `INSERT INTO "HugRequests" 
           (id, requesterId, recipientId, message, isPublic, status, expiresAt, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
           RETURNING *`,
          [
            requestId,
            user.userId,
            recipientId || null,
            message || null,
            isPublic || false,
            'pending',
            expiryDate,
            now,
            now
          ]
        );
        
        const request = requestResult.rows[0];
        
        // Fetch requester and recipient info
        request.requester = await getUserInfo(request.requesterId);
        
        if (request.recipientId) {
          request.recipient = await getUserInfo(request.recipientId);
        }
        
        // Record wellness activity
        const activityId = uuidv4();
        
        await pool.query(
          `INSERT INTO "WellnessActivities" 
           (id, userId, activityType, relatedEntityId, metadata, streakPoints, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            activityId,
            user.userId,
            'hug_requested',
            requestId,
            { recipientId: request.recipientId, isPublic: request.isPublic },
            1,
            now,
            now
          ]
        );
        
        return request;
      } catch (error) {
        console.error('Error requesting hug:', error);
        throw new Error('Failed to request hug');
      }
    },
    
    respondToHugRequest: async (_, { id, accept }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the request
        const requestResult = await pool.query(
          'SELECT * FROM "HugRequests" WHERE id = $1',
          [id]
        );
        
        if (requestResult.rows.length === 0) {
          throw new Error('Hug request not found');
        }
        
        const request = requestResult.rows[0];
        
        // Check if user is the recipient or if it's a public request
        if (request.recipientId !== user.userId && !request.isPublic) {
          throw new Error('You do not have permission to respond to this request');
        }
        
        // Check if request is still pending
        if (request.status !== 'pending') {
          throw new Error('This request has already been processed');
        }
        
        // Check if request has expired
        if (new Date(request.expiresAt) < new Date()) {
          throw new Error('This request has expired');
        }
        
        // Update request status
        const now = new Date();
        const newStatus = accept ? 'accepted' : 'declined';
        
        const updatedRequest = await pool.query(
          `UPDATE "HugRequests" 
           SET status = $1, updatedAt = $2 
           WHERE id = $3 
           RETURNING *`,
          [newStatus, now, id]
        );
        
        const result = updatedRequest.rows[0];
        
        // Fetch requester and recipient info
        result.requester = await getUserInfo(result.requesterId);
        
        if (result.recipientId) {
          result.recipient = await getUserInfo(result.recipientId);
        }
        
        // If accepted, create a hug
        if (accept) {
          const hugId = uuidv4();
          
          await pool.query(
            `INSERT INTO "Hugs" 
             (id, senderId, recipientId, hugType, message, isRead, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              hugId,
              user.userId,
              result.requesterId,
              'support', // Default hug type for responses
              `Responding to your hug request${result.message ? `: ${result.message}` : ''}`,
              false,
              now,
              now
            ]
          );
          
          // Record wellness activity
          const activityId = uuidv4();
          
          await pool.query(
            `INSERT INTO "WellnessActivities" 
             (id, userId, activityType, relatedEntityId, metadata, streakPoints, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              activityId,
              user.userId,
              'hug_sent',
              hugId,
              { recipientId: result.requesterId, requestId: id },
              1,
              now,
              now
            ]
          );
        }
        
        return result;
      } catch (error) {
        console.error('Error responding to hug request:', error);
        throw new Error('Failed to respond to hug request');
      }
    },
    
    cancelHugRequest: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the request
        const requestResult = await pool.query(
          'SELECT * FROM "HugRequests" WHERE id = $1',
          [id]
        );
        
        if (requestResult.rows.length === 0) {
          throw new Error('Hug request not found');
        }
        
        const request = requestResult.rows[0];
        
        // Check if user is the requester
        if (request.requesterId !== user.userId) {
          throw new Error('You do not have permission to cancel this request');
        }
        
        // Check if request is still pending
        if (request.status !== 'pending') {
          throw new Error('This request has already been processed');
        }
        
        // Update request status
        const now = new Date();
        
        await pool.query(
          `UPDATE "HugRequests" 
           SET status = $1, updatedAt = $2 
           WHERE id = $3`,
          ['cancelled', now, id]
        );
        
        return true;
      } catch (error) {
        console.error('Error cancelling hug request:', error);
        throw new Error('Failed to cancel hug request');
      }
    },
    
    createGroupHug: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        const { title, message, hugType, maxParticipants, isPublic, duration, invitedUsers } = input;
        
        // Validate input
        if (!title || !hugType || !duration) {
          throw new Error('Title, hug type, and duration are required');
        }
        
        // Create group hug
        const now = new Date();
        const expiryDate = new Date(now);
        expiryDate.setHours(expiryDate.getHours() + duration);
        
        const groupId = uuidv4();
        
        const groupResult = await pool.query(
          `INSERT INTO "GroupHugs" 
           (id, creatorId, title, message, hugType, maxParticipants, isPublic, expiresAt, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
           RETURNING *`,
          [
            groupId,
            user.userId,
            title,
            message || null,
            hugType,
            maxParticipants || 0,
            isPublic !== undefined ? isPublic : false,
            expiryDate,
            now,
            now
          ]
        );
        
        const group = groupResult.rows[0];
        
        // Add creator as first participant
        const participantId = uuidv4();
        
        await pool.query(
          `INSERT INTO "GroupHugParticipants" 
           (id, groupHugId, userId, status, joinedAt, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            participantId,
            groupId,
            user.userId,
            'active',
            now,
            now,
            now
          ]
        );
        
        // Invite users if specified
        if (invitedUsers && invitedUsers.length > 0) {
          for (const userId of invitedUsers) {
            const inviteId = uuidv4();
            
            await pool.query(
              `INSERT INTO "GroupHugParticipants" 
               (id, groupHugId, userId, status, joinedAt, createdAt, updatedAt) 
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [
                inviteId,
                groupId,
                userId,
                'invited',
                now,
                now,
                now
              ]
            );
          }
        }
        
        // Fetch creator info
        group.creator = await getUserInfo(group.creatorId);
        
        // Initialize participants array
        group.participants = [{
          id: participantId,
          groupHugId: groupId,
          userId: user.userId,
          status: 'active',
          joinedAt: now.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          user: group.creator
        }];
        
        group.participantCount = 1;
        group.hasJoined = true;
        group.messages = [];
        
        // Record wellness activity
        const activityId = uuidv4();
        
        await pool.query(
          `INSERT INTO "WellnessActivities" 
           (id, userId, activityType, relatedEntityId, metadata, streakPoints, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            activityId,
            user.userId,
            'group_hug_created',
            groupId,
            { title, hugType },
            2,
            now,
            now
          ]
        );
        
        return group;
      } catch (error) {
        console.error('Error creating group hug:', error);
        throw new Error('Failed to create group hug');
      }
    },
    
    joinGroupHug: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the group
        const groupResult = await pool.query(
          'SELECT * FROM "GroupHugs" WHERE id = $1',
          [id]
        );
        
        if (groupResult.rows.length === 0) {
          throw new Error('Group hug not found');
        }
        
        const group = groupResult.rows[0];
        
        // Check if group is expired
        if (new Date(group.expiresAt) < new Date()) {
          throw new Error('This group hug has expired');
        }
        
        // Check if group is public or user was invited
        if (!group.isPublic) {
          const inviteResult = await pool.query(
            `SELECT * FROM "GroupHugParticipants" 
             WHERE "groupHugId" = $1 AND "userId" = $2 AND status = 'invited'`,
            [id, user.userId]
          );
          
          if (inviteResult.rows.length === 0) {
            throw new Error('This group hug is private and you have not been invited');
          }
        }
        
        // Check if user is already a participant
        const participantResult = await pool.query(
          `SELECT * FROM "GroupHugParticipants" 
           WHERE "groupHugId" = $1 AND "userId" = $2 AND status = 'active'`,
          [id, user.userId]
        );
        
        if (participantResult.rows.length > 0) {
          return participantResult.rows[0];
        }
        
        // Check if group is full
        if (group.maxParticipants > 0) {
          const countResult = await pool.query(
            `SELECT COUNT(*) FROM "GroupHugParticipants" 
             WHERE "groupHugId" = $1 AND status = 'active'`,
            [id]
          );
          
          const currentCount = parseInt(countResult.rows[0].count);
          
          if (currentCount >= group.maxParticipants) {
            throw new Error('This group hug is already full');
          }
        }
        
        // Join group
        const now = new Date();
        const participantId = uuidv4();
        
        let participant;
        
        // Check if user was invited
        const inviteResult = await pool.query(
          `SELECT * FROM "GroupHugParticipants" 
           WHERE "groupHugId" = $1 AND "userId" = $2 AND status = 'invited'`,
          [id, user.userId]
        );
        
        if (inviteResult.rows.length > 0) {
          // Update invite to active
          const updateResult = await pool.query(
            `UPDATE "GroupHugParticipants" 
             SET status = 'active', joinedAt = $1, updatedAt = $2 
             WHERE id = $3 
             RETURNING *`,
            [now, now, inviteResult.rows[0].id]
          );
          
          participant = updateResult.rows[0];
        } else {
          // Create new participant
          const newParticipant = await pool.query(
            `INSERT INTO "GroupHugParticipants" 
             (id, groupHugId, userId, status, joinedAt, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [
              participantId,
              id,
              user.userId,
              'active',
              now,
              now,
              now
            ]
          );
          
          participant = newParticipant.rows[0];
        }
        
        // Add user info
        participant.user = await getUserInfo(participant.userId);
        
        // Record wellness activity
        const activityId = uuidv4();
        
        await pool.query(
          `INSERT INTO "WellnessActivities" 
           (id, userId, activityType, relatedEntityId, metadata, streakPoints, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            activityId,
            user.userId,
            'group_hug_joined',
            id,
            { groupHugId: id },
            1,
            now,
            now
          ]
        );
        
        return participant;
      } catch (error) {
        console.error('Error joining group hug:', error);
        throw new Error('Failed to join group hug');
      }
    },
    
    leaveGroupHug: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Check if user is a participant
        const participantResult = await pool.query(
          `SELECT * FROM "GroupHugParticipants" 
           WHERE "groupHugId" = $1 AND "userId" = $2 AND status = 'active'`,
          [id, user.userId]
        );
        
        if (participantResult.rows.length === 0) {
          throw new Error('You are not a participant in this group hug');
        }
        
        // Check if user is the creator
        const groupResult = await pool.query(
          'SELECT * FROM "GroupHugs" WHERE id = $1',
          [id]
        );
        
        if (groupResult.rows.length === 0) {
          throw new Error('Group hug not found');
        }
        
        const group = groupResult.rows[0];
        
        if (group.creatorId === user.userId) {
          throw new Error('The creator cannot leave the group hug');
        }
        
        // Update participant status
        const now = new Date();
        
        await pool.query(
          `UPDATE "GroupHugParticipants" 
           SET status = 'left', updatedAt = $1 
           WHERE "groupHugId" = $2 AND "userId" = $3`,
          [now, id, user.userId]
        );
        
        return true;
      } catch (error) {
        console.error('Error leaving group hug:', error);
        throw new Error('Failed to leave group hug');
      }
    },
    
    sendGroupHugMessage: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        const { groupHugId, message } = input;
        
        if (!groupHugId || !message) {
          throw new Error('Group ID and message are required');
        }
        
        // Check if group exists
        const groupResult = await pool.query(
          'SELECT * FROM "GroupHugs" WHERE id = $1',
          [groupHugId]
        );
        
        if (groupResult.rows.length === 0) {
          throw new Error('Group hug not found');
        }
        
        const group = groupResult.rows[0];
        
        // Check if group is expired
        if (new Date(group.expiresAt) < new Date()) {
          throw new Error('This group hug has expired');
        }
        
        // Check if user is a participant
        const participantResult = await pool.query(
          `SELECT * FROM "GroupHugParticipants" 
           WHERE "groupHugId" = $1 AND "userId" = $2 AND status = 'active'`,
          [groupHugId, user.userId]
        );
        
        if (participantResult.rows.length === 0) {
          throw new Error('You are not a participant in this group hug');
        }
        
        // Create message
        const now = new Date();
        const messageId = uuidv4();
        
        const messageResult = await pool.query(
          `INSERT INTO "GroupHugMessages" 
           (id, groupHugId, senderId, message, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6) 
           RETURNING *`,
          [
            messageId,
            groupHugId,
            user.userId,
            message,
            now,
            now
          ]
        );
        
        const messageObj = messageResult.rows[0];
        
        // Add sender info
        messageObj.sender = await getUserInfo(messageObj.senderId);
        
        return messageObj;
      } catch (error) {
        console.error('Error sending group hug message:', error);
        throw new Error('Failed to send message');
      }
    },
    
    createMediaHug: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        const { 
          title, description, mediaType, mediaUrl, thumbnailUrl, 
          duration, category, tags, moodTags, isPublic 
        } = input;
        
        // Validate input
        if (!title || !mediaType || !mediaUrl) {
          throw new Error('Title, media type, and media URL are required');
        }
        
        // Create media hug
        const now = new Date();
        const mediaId = uuidv4();
        
        const mediaResult = await pool.query(
          `INSERT INTO "MediaHugs" 
           (id, title, description, creatorId, mediaType, mediaUrl, thumbnailUrl, 
            duration, category, tags, moodTags, isPublic, isVerified, viewCount, likeCount, 
            createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
           RETURNING *`,
          [
            mediaId,
            title,
            description || null,
            user.userId,
            mediaType,
            mediaUrl,
            thumbnailUrl || null,
            duration || null,
            category || null,
            tags || [],
            moodTags || [],
            isPublic !== undefined ? isPublic : true,
            false, // Not verified by default
            0,
            0,
            now,
            now
          ]
        );
        
        const media = mediaResult.rows[0];
        
        // Add creator info
        media.creator = await getUserInfo(media.creatorId);
        
        // Add the media to the user's collection
        const userMediaId = uuidv4();
        
        await pool.query(
          `INSERT INTO "UserMediaHugs" 
           (id, userId, mediaHugId, isFavorite, lastViewedAt, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            userMediaId,
            user.userId,
            mediaId,
            true, // Auto-favorite your own media
            now,
            now,
            now
          ]
        );
        
        media.isFavorite = true;
        media.isLiked = true;
        
        // Record wellness activity
        const activityId = uuidv4();
        
        await pool.query(
          `INSERT INTO "WellnessActivities" 
           (id, userId, activityType, relatedEntityId, metadata, streakPoints, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            activityId,
            user.userId,
            'media_created',
            mediaId,
            { mediaType, category },
            3,
            now,
            now
          ]
        );
        
        return media;
      } catch (error) {
        console.error('Error creating media hug:', error);
        throw new Error('Failed to create media hug');
      }
    },
    
    updateMediaHug: async (_, { id, input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the media
        const mediaResult = await pool.query(
          'SELECT * FROM "MediaHugs" WHERE id = $1',
          [id]
        );
        
        if (mediaResult.rows.length === 0) {
          throw new Error('Media hug not found');
        }
        
        const media = mediaResult.rows[0];
        
        // Check if user is the creator
        if (media.creatorId !== user.userId) {
          throw new Error('You do not have permission to update this media hug');
        }
        
        // Prepare update query
        const updates = [];
        const values = [];
        let valueIndex = 1;
        
        if (input.title !== undefined) {
          updates.push(`"title" = $${valueIndex++}`);
          values.push(input.title);
        }
        
        if (input.description !== undefined) {
          updates.push(`"description" = $${valueIndex++}`);
          values.push(input.description);
        }
        
        if (input.thumbnailUrl !== undefined) {
          updates.push(`"thumbnailUrl" = $${valueIndex++}`);
          values.push(input.thumbnailUrl);
        }
        
        if (input.duration !== undefined) {
          updates.push(`"duration" = $${valueIndex++}`);
          values.push(input.duration);
        }
        
        if (input.category !== undefined) {
          updates.push(`"category" = $${valueIndex++}`);
          values.push(input.category);
        }
        
        if (input.tags !== undefined) {
          updates.push(`"tags" = $${valueIndex++}`);
          values.push(input.tags);
        }
        
        if (input.moodTags !== undefined) {
          updates.push(`"moodTags" = $${valueIndex++}`);
          values.push(input.moodTags);
        }
        
        if (input.isPublic !== undefined) {
          updates.push(`"isPublic" = $${valueIndex++}`);
          values.push(input.isPublic);
        }
        
        // Add updatedAt
        updates.push(`"updatedAt" = $${valueIndex++}`);
        values.push(new Date());
        
        // Add ID to values
        values.push(id);
        
        // Update media
        const updateResult = await pool.query(
          `UPDATE "MediaHugs" SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
          values
        );
        
        const updatedMedia = updateResult.rows[0];
        
        // Add creator info
        updatedMedia.creator = await getUserInfo(updatedMedia.creatorId);
        
        // Check if favorited
        const favoriteResult = await pool.query(
          `SELECT * FROM "UserMediaHugs" 
           WHERE "userId" = $1 AND "mediaHugId" = $2 AND "isFavorite" = true`,
          [user.userId, id]
        );
        
        updatedMedia.isFavorite = favoriteResult.rows.length > 0;
        updatedMedia.isLiked = updatedMedia.isFavorite;
        
        return updatedMedia;
      } catch (error) {
        console.error('Error updating media hug:', error);
        throw new Error('Failed to update media hug');
      }
    },
    
    deleteMediaHug: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the media
        const mediaResult = await pool.query(
          'SELECT * FROM "MediaHugs" WHERE id = $1',
          [id]
        );
        
        if (mediaResult.rows.length === 0) {
          throw new Error('Media hug not found');
        }
        
        const media = mediaResult.rows[0];
        
        // Check if user is the creator
        if (media.creatorId !== user.userId) {
          throw new Error('You do not have permission to delete this media hug');
        }
        
        // Delete media
        await pool.query(
          'DELETE FROM "MediaHugs" WHERE id = $1',
          [id]
        );
        
        // Delete user media references
        await pool.query(
          'DELETE FROM "UserMediaHugs" WHERE "mediaHugId" = $1',
          [id]
        );
        
        // Delete related wellness activity
        await pool.query(
          'DELETE FROM "WellnessActivities" WHERE "relatedEntityId" = $1',
          [id]
        );
        
        return true;
      } catch (error) {
        console.error('Error deleting media hug:', error);
        throw new Error('Failed to delete media hug');
      }
    },
    
    favoriteMediaHug: async (_, { id, isFavorite }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Check if media exists
        const mediaResult = await pool.query(
          'SELECT * FROM "MediaHugs" WHERE id = $1',
          [id]
        );
        
        if (mediaResult.rows.length === 0) {
          throw new Error('Media hug not found');
        }
        
        const now = new Date();
        
        // Check if user already has this media in their collection
        const existingResult = await pool.query(
          'SELECT * FROM "UserMediaHugs" WHERE "userId" = $1 AND "mediaHugId" = $2',
          [user.userId, id]
        );
        
        if (existingResult.rows.length > 0) {
          // Update existing entry
          const updateResult = await pool.query(
            `UPDATE "UserMediaHugs" 
             SET "isFavorite" = $1, "updatedAt" = $2 
             WHERE "userId" = $3 AND "mediaHugId" = $4 
             RETURNING *`,
            [isFavorite, now, user.userId, id]
          );
          
          const userMedia = updateResult.rows[0];
          
          // Update like count (in a real app, this would be a separate counter)
          if (isFavorite) {
            await pool.query(
              'UPDATE "MediaHugs" SET "likeCount" = "likeCount" + 1 WHERE id = $1',
              [id]
            );
          } else {
            await pool.query(
              'UPDATE "MediaHugs" SET "likeCount" = GREATEST("likeCount" - 1, 0) WHERE id = $1',
              [id]
            );
          }
          
          // Fetch media and user info
          userMedia.mediaHug = mediaResult.rows[0];
          userMedia.mediaHug.isFavorite = isFavorite;
          userMedia.mediaHug.isLiked = isFavorite;
          userMedia.mediaHug.creator = await getUserInfo(userMedia.mediaHug.creatorId);
          userMedia.user = await getUserInfo(user.userId);
          
          return userMedia;
        } else {
          // Create new entry
          const userMediaId = uuidv4();
          
          const newUserMedia = await pool.query(
            `INSERT INTO "UserMediaHugs" 
             (id, userId, mediaHugId, isFavorite, lastViewedAt, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             RETURNING *`,
            [
              userMediaId,
              user.userId,
              id,
              isFavorite,
              now,
              now,
              now
            ]
          );
          
          const userMedia = newUserMedia.rows[0];
          
          // Update like count if favorited
          if (isFavorite) {
            await pool.query(
              'UPDATE "MediaHugs" SET "likeCount" = "likeCount" + 1 WHERE id = $1',
              [id]
            );
          }
          
          // Fetch media and user info
          userMedia.mediaHug = mediaResult.rows[0];
          userMedia.mediaHug.isFavorite = isFavorite;
          userMedia.mediaHug.isLiked = isFavorite;
          userMedia.mediaHug.creator = await getUserInfo(userMedia.mediaHug.creatorId);
          userMedia.user = await getUserInfo(user.userId);
          
          return userMedia;
        }
      } catch (error) {
        console.error('Error favoriting media hug:', error);
        throw new Error('Failed to favorite media hug');
      }
    },
    
    viewMediaHug: async (_, { id }, { user }) => {
      try {
        // Check if media exists
        const mediaResult = await pool.query(
          'SELECT * FROM "MediaHugs" WHERE id = $1',
          [id]
        );
        
        if (mediaResult.rows.length === 0) {
          throw new Error('Media hug not found');
        }
        
        const media = mediaResult.rows[0];
        
        // Increment view count
        await pool.query(
          'UPDATE "MediaHugs" SET "viewCount" = "viewCount" + 1 WHERE id = $1',
          [id]
        );
        
        // If user is authenticated, record the view
        if (user) {
          const now = new Date();
          
          // Check if user already has this media in their collection
          const existingResult = await pool.query(
            'SELECT * FROM "UserMediaHugs" WHERE "userId" = $1 AND "mediaHugId" = $2',
            [user.userId, id]
          );
          
          if (existingResult.rows.length > 0) {
            // Update last viewed
            await pool.query(
              `UPDATE "UserMediaHugs" 
               SET "lastViewedAt" = $1, "updatedAt" = $2 
               WHERE "userId" = $3 AND "mediaHugId" = $4`,
              [now, now, user.userId, id]
            );
          } else {
            // Create new entry
            await pool.query(
              `INSERT INTO "UserMediaHugs" 
               (id, userId, mediaHugId, isFavorite, lastViewedAt, createdAt, updatedAt) 
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [
                uuidv4(),
                user.userId,
                id,
                false,
                now,
                now,
                now
              ]
            );
          }
          
          // Check if favorited
          const favoriteResult = await pool.query(
            `SELECT * FROM "UserMediaHugs" 
             WHERE "userId" = $1 AND "mediaHugId" = $2 AND "isFavorite" = true`,
            [user.userId, id]
          );
          
          media.isFavorite = favoriteResult.rows.length > 0;
          media.isLiked = media.isFavorite;
        } else {
          media.isFavorite = false;
          media.isLiked = false;
        }
        
        // Fetch creator info
        media.creator = await getUserInfo(media.creatorId);
        
        // Increment the view count for the return value
        media.viewCount += 1;
        
        return media;
      } catch (error) {
        console.error('Error viewing media hug:', error);
        throw new Error('Failed to view media hug');
      }
    },
    
    likeMediaHug: async (_, { id, isLiked }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      // For simplicity, liking is the same as favoriting
      return resolvers.Mutation.favoriteMediaHug(_, { id, isFavorite: isLiked }, { user });
    }
  },
  
  JSON: {
    serialize(value) {
      return JSON.stringify(value);
    },
    parseValue(value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return null;
      }
    },
    parseLiteral(ast) {
      if (ast.kind === 'StringValue') {
        try {
          return JSON.parse(ast.value);
        } catch (error) {
          return null;
        }
      }
      return null;
    }
  }
};

// Helper functions

/**
 * Get user information by ID
 * This is a simplified implementation that would typically
 * make a request to the User service
 */
async function getUserInfo(userId) {
  try {
    // For now, we'll return mock user data
    // In a real microservice architecture, this would call the User service
    return {
      id: userId,
      username: `user_${userId.slice(0, 8)}`,
      name: `User ${userId.slice(0, 5)}`,
      avatar: `https://i.pravatar.cc/150?u=${userId}`,
      isOnline: Math.random() > 0.5
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return {
      id: userId,
      username: 'unknown',
      name: 'Unknown User',
      avatar: null,
      isOnline: false
    };
  }
}

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
  
  console.log(`🚀 Hug Service ready at http://0.0.0.0:${PORT}${server.graphqlPath}`);
  
  return { server, app, httpServer };
}

// Express routes
app.get('/', (req, res) => {
  res.send('HugMood Hug Service');
});

// Start server
startApolloServer()
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

module.exports = { app, startApolloServer };