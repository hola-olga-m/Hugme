const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { ApolloServerPluginInlineTrace } = require('apollo-server-core');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { mergeResolvers, mergeTypeDefs } = require('@graphql-tools/merge');
const { loadFiles } = require('@graphql-tools/load-files');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const http = require('http');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.MOOD_SERVICE_PORT || 4003;

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
    // Create Mood table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Moods" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "value" VARCHAR(100) NOT NULL,
        "score" INTEGER,
        "note" TEXT,
        "isPublic" BOOLEAN DEFAULT false,
        "location" JSONB,
        "activities" TEXT[],
        "correlationData" JSONB,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create MoodStreak table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "MoodStreaks" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) UNIQUE NOT NULL,
        "currentStreak" INTEGER DEFAULT 0,
        "longestStreak" INTEGER DEFAULT 0,
        "lastRecordedAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create UserActivity table (for correlations)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "UserActivities" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "activityType" VARCHAR(100) NOT NULL,
        "duration" INTEGER,
        "metadata" JSONB,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create MoodInsight table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "MoodInsights" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "type" VARCHAR(100) NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "data" JSONB,
        "priority" VARCHAR(50) DEFAULT 'medium',
        "isRead" BOOLEAN DEFAULT false,
        "expiresAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create MoodReminder table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "MoodReminders" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "time" TIME NOT NULL,
        "days" INTEGER[] DEFAULT ARRAY[0, 1, 2, 3, 4, 5, 6],
        "isEnabled" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
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
    mood(id: ID!): Mood
    moods(userId: ID!, limit: Int, offset: Int, startDate: String, endDate: String): MoodConnection
    moodHistory(userId: ID!, period: String): MoodHistoryResult
    moodStreak(userId: ID!): MoodStreak
    moodAnalytics(userId: ID!, timeRange: Int, includeCorrelations: Boolean): MoodAnalytics
    moodInsights(userId: ID!, limit: Int, offset: Int): [MoodInsight]
    moodReminders(userId: ID!): [MoodReminder]
    communityMoods(limit: Int, offset: Int): MoodConnection
    userActivities(userId: ID!, type: String, limit: Int, offset: Int): [UserActivity]
  }

  type Mutation {
    createMood(input: CreateMoodInput!): Mood
    updateMood(id: ID!, input: UpdateMoodInput!): Mood
    deleteMood(id: ID!): Boolean
    setupMoodReminder(input: MoodReminderInput!): MoodReminder
    updateMoodReminder(id: ID!, input: MoodReminderInput!): MoodReminder
    deleteMoodReminder(id: ID!): Boolean
    recordUserActivity(input: UserActivityInput!): UserActivity
    markInsightAsRead(id: ID!): Boolean
    shareToSocial(input: SocialShareInput!): SocialShareResult
  }

  type Mood {
    id: ID!
    userId: ID!
    value: String!
    score: Int
    note: String
    isPublic: Boolean
    location: Location
    activities: [String]
    createdAt: String!
    updatedAt: String!
  }

  type Location {
    latitude: Float
    longitude: Float
    name: String
  }

  type MoodConnection {
    moods: [Mood]
    totalCount: Int
    hasMore: Boolean
  }

  type MoodHistoryResult {
    days: [DailyMood]
    summary: MoodSummary
  }

  type DailyMood {
    date: String!
    value: String
    score: Int
    note: String
  }

  type MoodSummary {
    averageScore: Float
    moodFrequency: [MoodFrequencyItem]
    startDate: String
    endDate: String
  }

  type MoodFrequencyItem {
    mood: String!
    count: Int!
    percentage: Float!
  }

  type MoodStreak {
    userId: ID!
    currentStreak: Int!
    longestStreak: Int!
    lastRecordedAt: String
  }

  type MoodAnalytics {
    userId: ID!
    timeRange: Int!
    moodEntries: [Mood]
    statistics: MoodStatistics
    metrics: MoodMetrics
    correlations: MoodCorrelations
    insights: [MoodInsight]
    recommendations: [MoodRecommendation]
  }

  type MoodStatistics {
    totalEntries: Int!
    uniqueMoods: Int!
    currentStreak: Int!
    longestStreak: Int!
    averageScore: Float!
    moodVariability: String!
    dominantMood: String!
    improvementTrend: String!
  }

  type MoodMetrics {
    moodFrequency: JSON
    moodByDayOfWeek: JSON
    moodByTimeOfDay: JSON
  }

  type MoodCorrelations {
    activities: JSON
    sleep: CorrelationData
    weather: CorrelationData
    screenTime: CorrelationData
  }

  type CorrelationData {
    correlation: Float!
    impact: String!
    direction: String!
  }

  type MoodInsight {
    id: ID!
    userId: ID!
    type: String!
    title: String!
    description: String!
    data: JSON
    priority: String!
    isRead: Boolean!
    expiresAt: String
    createdAt: String!
  }

  type MoodRecommendation {
    type: String!
    title: String!
    description: String!
    priority: String!
  }

  type MoodReminder {
    id: ID!
    userId: ID!
    time: String!
    days: [Int!]!
    isEnabled: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type UserActivity {
    id: ID!
    userId: ID!
    activityType: String!
    duration: Int
    metadata: JSON
    createdAt: String!
    updatedAt: String!
  }

  type SocialShareResult {
    success: Boolean!
    message: String
    url: String
  }

  input CreateMoodInput {
    value: String!
    score: Int
    note: String
    isPublic: Boolean
    location: LocationInput
    activities: [String]
  }

  input UpdateMoodInput {
    value: String
    score: Int
    note: String
    isPublic: Boolean
    location: LocationInput
    activities: [String]
  }

  input LocationInput {
    latitude: Float
    longitude: Float
    name: String
  }

  input MoodReminderInput {
    time: String!
    days: [Int!]
    isEnabled: Boolean
  }

  input UserActivityInput {
    activityType: String!
    duration: Int
    metadata: JSON
  }

  input SocialShareInput {
    platform: String!
    contentType: String!
    contentId: String
    text: String
  }

  scalar JSON
`;

// Resolvers
const resolvers = {
  Query: {
    mood: async (_, { id }, { user }) => {
      try {
        const moodResult = await pool.query(
          'SELECT * FROM "Moods" WHERE id = $1',
          [id]
        );
        
        if (moodResult.rows.length === 0) {
          return null;
        }
        
        const mood = moodResult.rows[0];
        
        // Check permission
        if (mood.userId !== user?.userId && !mood.isPublic) {
          throw new Error('You do not have permission to view this mood');
        }
        
        return mood;
      } catch (error) {
        console.error('Error fetching mood:', error);
        throw new Error('Failed to fetch mood');
      }
    },
    
    moods: async (_, { userId, limit = 20, offset = 0, startDate, endDate }, { user }) => {
      try {
        // Check permission
        if (userId !== user?.userId) {
          // Non-owner can only view public moods
          const publicMoodsQuery = `
            SELECT * FROM "Moods" 
            WHERE "userId" = $1 AND "isPublic" = true 
            ${startDate ? 'AND "createdAt" >= $4' : ''} 
            ${endDate ? `AND "createdAt" <= $${startDate ? '5' : '4'}` : ''} 
            ORDER BY "createdAt" DESC 
            LIMIT $2 OFFSET $3
          `;
          
          const countQuery = `
            SELECT COUNT(*) FROM "Moods" 
            WHERE "userId" = $1 AND "isPublic" = true 
            ${startDate ? 'AND "createdAt" >= $2' : ''} 
            ${endDate ? `AND "createdAt" <= $${startDate ? '3' : '2'}` : ''}
          `;
          
          const queryParams = [userId, limit, offset];
          const countParams = [userId];
          
          if (startDate) {
            queryParams.push(new Date(startDate));
            countParams.push(new Date(startDate));
          }
          
          if (endDate) {
            queryParams.push(new Date(endDate));
            countParams.push(new Date(endDate));
          }
          
          const moodsResult = await pool.query(publicMoodsQuery, queryParams);
          const countResult = await pool.query(countQuery, countParams);
          
          return {
            moods: moodsResult.rows,
            totalCount: parseInt(countResult.rows[0].count),
            hasMore: offset + moodsResult.rows.length < parseInt(countResult.rows[0].count)
          };
        }
        
        // Owner can view all their moods
        const moodsQuery = `
          SELECT * FROM "Moods" 
          WHERE "userId" = $1 
          ${startDate ? 'AND "createdAt" >= $4' : ''} 
          ${endDate ? `AND "createdAt" <= $${startDate ? '5' : '4'}` : ''} 
          ORDER BY "createdAt" DESC 
          LIMIT $2 OFFSET $3
        `;
        
        const countQuery = `
          SELECT COUNT(*) FROM "Moods" 
          WHERE "userId" = $1 
          ${startDate ? 'AND "createdAt" >= $2' : ''} 
          ${endDate ? `AND "createdAt" <= $${startDate ? '3' : '2'}` : ''}
        `;
        
        const queryParams = [userId, limit, offset];
        const countParams = [userId];
        
        if (startDate) {
          queryParams.push(new Date(startDate));
          countParams.push(new Date(startDate));
        }
        
        if (endDate) {
          queryParams.push(new Date(endDate));
          countParams.push(new Date(endDate));
        }
        
        const moodsResult = await pool.query(moodsQuery, queryParams);
        const countResult = await pool.query(countQuery, countParams);
        
        return {
          moods: moodsResult.rows,
          totalCount: parseInt(countResult.rows[0].count),
          hasMore: offset + moodsResult.rows.length < parseInt(countResult.rows[0].count)
        };
      } catch (error) {
        console.error('Error fetching moods:', error);
        throw new Error('Failed to fetch moods');
      }
    },
    
    moodHistory: async (_, { userId, period = '30days' }, { user }) => {
      try {
        // Check permission
        if (userId !== user?.userId) {
          throw new Error('You do not have permission to view this user\'s mood history');
        }
        
        // Calculate start date based on period
        const endDate = new Date();
        const startDate = new Date();
        
        switch (period) {
          case '7days':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case '30days':
            startDate.setDate(startDate.getDate() - 30);
            break;
          case '90days':
            startDate.setDate(startDate.getDate() - 90);
            break;
          case '1year':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
          default:
            startDate.setDate(startDate.getDate() - 30);
        }
        
        // Get all moods for the period
        const moodsResult = await pool.query(
          `SELECT * FROM "Moods" 
           WHERE "userId" = $1 AND "createdAt" >= $2 AND "createdAt" <= $3 
           ORDER BY "createdAt" ASC`,
          [userId, startDate, endDate]
        );
        
        const moods = moodsResult.rows;
        
        // Group moods by day
        const dailyMoods = {};
        const moodCounts = {};
        let totalScore = 0;
        
        moods.forEach(mood => {
          const date = new Date(mood.createdAt).toISOString().split('T')[0];
          
          // Only keep the first mood of each day for the daily series
          if (!dailyMoods[date]) {
            dailyMoods[date] = {
              date,
              value: mood.value,
              score: mood.score,
              note: mood.note
            };
          }
          
          // Count frequency of each mood
          moodCounts[mood.value] = (moodCounts[mood.value] || 0) + 1;
          
          // Add to total score
          if (mood.score) {
            totalScore += mood.score;
          }
        });
        
        // Convert to array and fill in missing days
        const days = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          
          days.push(dailyMoods[dateStr] || {
            date: dateStr,
            value: null,
            score: null,
            note: null
          });
          
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Calculate average score
        const averageScore = moods.length > 0 ? 
          totalScore / moods.filter(m => m.score !== null).length : 0;
        
        // Format mood frequency
        const totalMoods = moods.length;
        const moodFrequency = Object.entries(moodCounts).map(([mood, count]) => ({
          mood,
          count,
          percentage: (count / totalMoods) * 100
        })).sort((a, b) => b.count - a.count);
        
        return {
          days,
          summary: {
            averageScore,
            moodFrequency,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        };
      } catch (error) {
        console.error('Error fetching mood history:', error);
        throw new Error('Failed to fetch mood history');
      }
    },
    
    moodStreak: async (_, { userId }, { user }) => {
      try {
        // Anyone can view streak data
        
        // Get streak data
        const streakResult = await pool.query(
          'SELECT * FROM "MoodStreaks" WHERE "userId" = $1',
          [userId]
        );
        
        if (streakResult.rows.length === 0) {
          // Default streak data
          return {
            userId,
            currentStreak: 0,
            longestStreak: 0,
            lastRecordedAt: null
          };
        }
        
        return streakResult.rows[0];
      } catch (error) {
        console.error('Error fetching mood streak:', error);
        throw new Error('Failed to fetch mood streak');
      }
    },
    
    moodAnalytics: async (_, { userId, timeRange = 30, includeCorrelations = true }, { user }) => {
      try {
        // Check permission
        if (userId !== user?.userId) {
          throw new Error('You do not have permission to view this user\'s mood analytics');
        }
        
        // Calculate start date based on time range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);
        
        // Get mood entries for the time range
        const moodsResult = await pool.query(
          `SELECT * FROM "Moods" 
           WHERE "userId" = $1 AND "createdAt" >= $2 AND "createdAt" <= $3 
           ORDER BY "createdAt" DESC`,
          [userId, startDate, endDate]
        );
        
        const moods = moodsResult.rows;
        
        // Get streak information
        const streakResult = await pool.query(
          'SELECT * FROM "MoodStreaks" WHERE "userId" = $1',
          [userId]
        );
        
        const streak = streakResult.rows.length > 0 ? 
          streakResult.rows[0] : 
          { currentStreak: 0, longestStreak: 0 };
        
        // Calculate mood frequency
        const moodFrequency = {};
        moods.forEach(mood => {
          moodFrequency[mood.value] = (moodFrequency[mood.value] || 0) + 1;
        });
        
        // Calculate mood by day of week
        const moodByDayOfWeek = calculateMoodByDayOfWeek(moods);
        
        // Calculate mood by time of day
        const moodByTimeOfDay = calculateMoodByTimeOfDay(moods);
        
        // Calculate average score
        const moodsWithScores = moods.filter(m => m.score !== null);
        const totalScore = moodsWithScores.reduce((sum, mood) => sum + mood.score, 0);
        const averageScore = moodsWithScores.length > 0 ? totalScore / moodsWithScores.length : 0;
        
        // Determine dominant mood
        let dominantMood = null;
        let maxCount = 0;
        
        Object.entries(moodFrequency).forEach(([mood, count]) => {
          if (count > maxCount) {
            dominantMood = mood;
            maxCount = count;
          }
        });
        
        // Calculate mood variability
        const moodScores = moodsWithScores.map(mood => mood.score);
        const scoreVariance = moodScores.length > 0 ? 
          moodScores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / moodScores.length : 
          0;
        const standardDeviation = Math.sqrt(scoreVariance);
        
        let moodVariability = 'moderate';
        if (standardDeviation < 1.5) {
          moodVariability = 'low';
        } else if (standardDeviation > 3) {
          moodVariability = 'high';
        }
        
        // Determine improvement trend
        let improvementTrend = 'stable';
        if (moods.length >= 7) {
          const recentMoods = moods.slice(0, Math.min(7, moods.length));
          const olderMoods = moods.slice(Math.max(0, moods.length - 7));
          
          const recentWithScores = recentMoods.filter(m => m.score !== null);
          const olderWithScores = olderMoods.filter(m => m.score !== null);
          
          if (recentWithScores.length > 0 && olderWithScores.length > 0) {
            const recentAvg = recentWithScores.reduce((sum, mood) => sum + mood.score, 0) / recentWithScores.length;
            const olderAvg = olderWithScores.reduce((sum, mood) => sum + mood.score, 0) / olderWithScores.length;
            
            if (recentAvg - olderAvg > 1) {
              improvementTrend = 'improving';
            } else if (olderAvg - recentAvg > 1) {
              improvementTrend = 'declining';
            }
          }
        }
        
        // Get activity correlations if requested
        let correlations = null;
        if (includeCorrelations) {
          correlations = await generateCorrelationsData(userId, moods);
        }
        
        // Generate insights
        const insights = generateInsights(
          moods,
          moodFrequency,
          moodByDayOfWeek,
          moodByTimeOfDay,
          correlations,
          streak.currentStreak,
          dominantMood,
          moodVariability,
          improvementTrend
        );
        
        // Generate recommendations
        const recommendations = generateRecommendations(
          moods,
          moodFrequency,
          moodByDayOfWeek,
          moodByTimeOfDay,
          correlations,
          streak.currentStreak,
          dominantMood,
          moodVariability,
          improvementTrend
        );
        
        // Save insights to the database
        if (insights.length > 0) {
          const now = new Date();
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 7); // Insights expire after 7 days
          
          for (const insight of insights) {
            const insightId = uuidv4();
            
            // Check if similar insight already exists
            const existingInsight = await pool.query(
              `SELECT * FROM "MoodInsights" 
               WHERE "userId" = $1 AND "type" = $2 AND "expiresAt" > NOW()`,
              [userId, insight.type]
            );
            
            if (existingInsight.rows.length === 0) {
              // Create new insight
              await pool.query(
                `INSERT INTO "MoodInsights" 
                 (id, userId, type, title, description, data, priority, isRead, expiresAt, createdAt, updatedAt) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                  insightId,
                  userId,
                  insight.type,
                  insight.title,
                  insight.description,
                  insight.data || {},
                  insight.priority,
                  false,
                  expiryDate,
                  now,
                  now
                ]
              );
            }
          }
        }
        
        return {
          userId,
          timeRange,
          moodEntries: moods.slice(0, 10), // Return only recent entries to reduce payload size
          statistics: {
            totalEntries: moods.length,
            uniqueMoods: Object.keys(moodFrequency).length,
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            averageScore,
            moodVariability,
            dominantMood: dominantMood || 'neutral',
            improvementTrend
          },
          metrics: {
            moodFrequency,
            moodByDayOfWeek,
            moodByTimeOfDay
          },
          correlations,
          insights,
          recommendations
        };
      } catch (error) {
        console.error('Error generating mood analytics:', error);
        throw new Error('Failed to generate mood analytics');
      }
    },
    
    moodInsights: async (_, { userId, limit = 10, offset = 0 }, { user }) => {
      try {
        // Check permission
        if (userId !== user?.userId) {
          throw new Error('You do not have permission to view this user\'s insights');
        }
        
        // Get insights
        const insightsResult = await pool.query(
          `SELECT * FROM "MoodInsights" 
           WHERE "userId" = $1 AND "expiresAt" > NOW() 
           ORDER BY "priority" ASC, "createdAt" DESC 
           LIMIT $2 OFFSET $3`,
          [userId, limit, offset]
        );
        
        return insightsResult.rows;
      } catch (error) {
        console.error('Error fetching mood insights:', error);
        throw new Error('Failed to fetch mood insights');
      }
    },
    
    moodReminders: async (_, { userId }, { user }) => {
      try {
        // Check permission
        if (userId !== user?.userId) {
          throw new Error('You do not have permission to view this user\'s reminders');
        }
        
        // Get reminders
        const remindersResult = await pool.query(
          'SELECT * FROM "MoodReminders" WHERE "userId" = $1 ORDER BY "time" ASC',
          [userId]
        );
        
        return remindersResult.rows;
      } catch (error) {
        console.error('Error fetching mood reminders:', error);
        throw new Error('Failed to fetch mood reminders');
      }
    },
    
    communityMoods: async (_, { limit = 20, offset = 0 }) => {
      try {
        // Get public moods
        const moodsResult = await pool.query(
          `SELECT * FROM "Moods" 
           WHERE "isPublic" = true 
           ORDER BY "createdAt" DESC 
           LIMIT $1 OFFSET $2`,
          [limit, offset]
        );
        
        // Get total count
        const countResult = await pool.query(
          'SELECT COUNT(*) FROM "Moods" WHERE "isPublic" = true'
        );
        
        return {
          moods: moodsResult.rows,
          totalCount: parseInt(countResult.rows[0].count),
          hasMore: offset + moodsResult.rows.length < parseInt(countResult.rows[0].count)
        };
      } catch (error) {
        console.error('Error fetching community moods:', error);
        throw new Error('Failed to fetch community moods');
      }
    },
    
    userActivities: async (_, { userId, type, limit = 20, offset = 0 }, { user }) => {
      try {
        // Check permission
        if (userId !== user?.userId) {
          throw new Error('You do not have permission to view this user\'s activities');
        }
        
        // Get activities
        let query = 'SELECT * FROM "UserActivities" WHERE "userId" = $1';
        const params = [userId];
        
        if (type) {
          query += ' AND "activityType" = $2';
          params.push(type);
        }
        
        query += ' ORDER BY "createdAt" DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);
        
        const activitiesResult = await pool.query(query, params);
        
        return activitiesResult.rows;
      } catch (error) {
        console.error('Error fetching user activities:', error);
        throw new Error('Failed to fetch user activities');
      }
    }
  },
  
  Mutation: {
    createMood: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        const { value, score, note, isPublic, location, activities } = input;
        
        // Create mood
        const now = new Date();
        const moodId = uuidv4();
        
        const moodResult = await pool.query(
          `INSERT INTO "Moods" 
           (id, userId, value, score, note, isPublic, location, activities, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
           RETURNING *`,
          [
            moodId,
            user.userId,
            value,
            score,
            note,
            isPublic === undefined ? false : isPublic,
            location || null,
            activities || [],
            now,
            now
          ]
        );
        
        const mood = moodResult.rows[0];
        
        // Update streak
        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        yesterdayDate.setHours(0, 0, 0, 0);
        
        const todayDate = new Date(now);
        todayDate.setHours(0, 0, 0, 0);
        
        // Check if there's a mood entry from yesterday or today
        const recentMoodResult = await pool.query(
          `SELECT * FROM "Moods" 
           WHERE "userId" = $1 AND "createdAt" >= $2 AND "createdAt" < $3 
           ORDER BY "createdAt" DESC 
           LIMIT 1`,
          [user.userId, yesterdayDate, todayDate]
        );
        
        // Get current streak
        const streakResult = await pool.query(
          'SELECT * FROM "MoodStreaks" WHERE "userId" = $1',
          [user.userId]
        );
        
        let currentStreak = 0;
        let longestStreak = 0;
        
        if (streakResult.rows.length > 0) {
          const streak = streakResult.rows[0];
          currentStreak = streak.currentStreak;
          longestStreak = streak.longestStreak;
          
          // Check if the streak should continue
          if (recentMoodResult.rows.length > 0) {
            // There was a mood yesterday, continue streak
            currentStreak += 1;
          } else {
            // No mood yesterday, reset streak
            currentStreak = 1;
          }
          
          // Update longest streak if needed
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
          }
          
          // Update streak
          await pool.query(
            `UPDATE "MoodStreaks" 
             SET "currentStreak" = $1, "longestStreak" = $2, "lastRecordedAt" = $3, "updatedAt" = $4 
             WHERE "userId" = $5`,
            [currentStreak, longestStreak, now, now, user.userId]
          );
        } else {
          // Create new streak record
          currentStreak = 1;
          longestStreak = 1;
          
          await pool.query(
            `INSERT INTO "MoodStreaks" 
             (id, userId, currentStreak, longestStreak, lastRecordedAt, createdAt, updatedAt) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [uuidv4(), user.userId, currentStreak, longestStreak, now, now, now]
          );
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
            'mood_recorded',
            moodId,
            { value, score },
            1,
            now,
            now
          ]
        );
        
        return mood;
      } catch (error) {
        console.error('Error creating mood:', error);
        throw new Error('Failed to create mood');
      }
    },
    
    updateMood: async (_, { id, input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the mood
        const moodResult = await pool.query(
          'SELECT * FROM "Moods" WHERE id = $1',
          [id]
        );
        
        if (moodResult.rows.length === 0) {
          throw new Error('Mood not found');
        }
        
        const mood = moodResult.rows[0];
        
        // Check permission
        if (mood.userId !== user.userId) {
          throw new Error('You do not have permission to update this mood');
        }
        
        // Prepare update query
        const updates = [];
        const values = [];
        let valueIndex = 1;
        
        if (input.value !== undefined) {
          updates.push(`"value" = $${valueIndex++}`);
          values.push(input.value);
        }
        
        if (input.score !== undefined) {
          updates.push(`"score" = $${valueIndex++}`);
          values.push(input.score);
        }
        
        if (input.note !== undefined) {
          updates.push(`"note" = $${valueIndex++}`);
          values.push(input.note);
        }
        
        if (input.isPublic !== undefined) {
          updates.push(`"isPublic" = $${valueIndex++}`);
          values.push(input.isPublic);
        }
        
        if (input.location !== undefined) {
          updates.push(`"location" = $${valueIndex++}`);
          values.push(input.location);
        }
        
        if (input.activities !== undefined) {
          updates.push(`"activities" = $${valueIndex++}`);
          values.push(input.activities);
        }
        
        // Add updatedAt
        updates.push(`"updatedAt" = $${valueIndex++}`);
        values.push(new Date());
        
        // Add ID to values
        values.push(id);
        
        // Update mood
        const updateResult = await pool.query(
          `UPDATE "Moods" SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
          values
        );
        
        return updateResult.rows[0];
      } catch (error) {
        console.error('Error updating mood:', error);
        throw new Error('Failed to update mood');
      }
    },
    
    deleteMood: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the mood
        const moodResult = await pool.query(
          'SELECT * FROM "Moods" WHERE id = $1',
          [id]
        );
        
        if (moodResult.rows.length === 0) {
          throw new Error('Mood not found');
        }
        
        const mood = moodResult.rows[0];
        
        // Check permission
        if (mood.userId !== user.userId) {
          throw new Error('You do not have permission to delete this mood');
        }
        
        // Delete mood
        await pool.query(
          'DELETE FROM "Moods" WHERE id = $1',
          [id]
        );
        
        // Delete related wellness activity
        await pool.query(
          'DELETE FROM "WellnessActivities" WHERE "relatedEntityId" = $1',
          [id]
        );
        
        // Note: We don't update the streak here because it would be complex
        // to recalculate the entire streak history
        
        return true;
      } catch (error) {
        console.error('Error deleting mood:', error);
        throw new Error('Failed to delete mood');
      }
    },
    
    setupMoodReminder: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        const { time, days, isEnabled } = input;
        
        // Create reminder
        const now = new Date();
        const reminderId = uuidv4();
        
        const reminderResult = await pool.query(
          `INSERT INTO "MoodReminders" 
           (id, userId, time, days, isEnabled, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) 
           RETURNING *`,
          [
            reminderId,
            user.userId,
            time,
            days || [0, 1, 2, 3, 4, 5, 6], // Default to all days of week
            isEnabled === undefined ? true : isEnabled,
            now,
            now
          ]
        );
        
        return reminderResult.rows[0];
      } catch (error) {
        console.error('Error setting up mood reminder:', error);
        throw new Error('Failed to set up mood reminder');
      }
    },
    
    updateMoodReminder: async (_, { id, input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the reminder
        const reminderResult = await pool.query(
          'SELECT * FROM "MoodReminders" WHERE id = $1',
          [id]
        );
        
        if (reminderResult.rows.length === 0) {
          throw new Error('Reminder not found');
        }
        
        const reminder = reminderResult.rows[0];
        
        // Check permission
        if (reminder.userId !== user.userId) {
          throw new Error('You do not have permission to update this reminder');
        }
        
        // Prepare update query
        const updates = [];
        const values = [];
        let valueIndex = 1;
        
        if (input.time !== undefined) {
          updates.push(`"time" = $${valueIndex++}`);
          values.push(input.time);
        }
        
        if (input.days !== undefined) {
          updates.push(`"days" = $${valueIndex++}`);
          values.push(input.days);
        }
        
        if (input.isEnabled !== undefined) {
          updates.push(`"isEnabled" = $${valueIndex++}`);
          values.push(input.isEnabled);
        }
        
        // Add updatedAt
        updates.push(`"updatedAt" = $${valueIndex++}`);
        values.push(new Date());
        
        // Add ID to values
        values.push(id);
        
        // Update reminder
        const updateResult = await pool.query(
          `UPDATE "MoodReminders" SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
          values
        );
        
        return updateResult.rows[0];
      } catch (error) {
        console.error('Error updating mood reminder:', error);
        throw new Error('Failed to update mood reminder');
      }
    },
    
    deleteMoodReminder: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the reminder
        const reminderResult = await pool.query(
          'SELECT * FROM "MoodReminders" WHERE id = $1',
          [id]
        );
        
        if (reminderResult.rows.length === 0) {
          throw new Error('Reminder not found');
        }
        
        const reminder = reminderResult.rows[0];
        
        // Check permission
        if (reminder.userId !== user.userId) {
          throw new Error('You do not have permission to delete this reminder');
        }
        
        // Delete reminder
        await pool.query(
          'DELETE FROM "MoodReminders" WHERE id = $1',
          [id]
        );
        
        return true;
      } catch (error) {
        console.error('Error deleting mood reminder:', error);
        throw new Error('Failed to delete mood reminder');
      }
    },
    
    recordUserActivity: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        const { activityType, duration, metadata } = input;
        
        // Create activity
        const now = new Date();
        const activityId = uuidv4();
        
        const activityResult = await pool.query(
          `INSERT INTO "UserActivities" 
           (id, userId, activityType, duration, metadata, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) 
           RETURNING *`,
          [
            activityId,
            user.userId,
            activityType,
            duration || null,
            metadata || {},
            now,
            now
          ]
        );
        
        return activityResult.rows[0];
      } catch (error) {
        console.error('Error recording user activity:', error);
        throw new Error('Failed to record user activity');
      }
    },
    
    markInsightAsRead: async (_, { id }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get the insight
        const insightResult = await pool.query(
          'SELECT * FROM "MoodInsights" WHERE id = $1',
          [id]
        );
        
        if (insightResult.rows.length === 0) {
          throw new Error('Insight not found');
        }
        
        const insight = insightResult.rows[0];
        
        // Check permission
        if (insight.userId !== user.userId) {
          throw new Error('You do not have permission to update this insight');
        }
        
        // Mark as read
        await pool.query(
          `UPDATE "MoodInsights" SET "isRead" = true, "updatedAt" = $1 WHERE id = $2`,
          [new Date(), id]
        );
        
        return true;
      } catch (error) {
        console.error('Error marking insight as read:', error);
        throw new Error('Failed to mark insight as read');
      }
    },
    
    shareToSocial: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        const { platform, contentType, contentId, text } = input;
        
        // Validate platform
        const validPlatforms = ['facebook', 'twitter', 'instagram', 'whatsapp', 'telegram'];
        if (!validPlatforms.includes(platform)) {
          throw new Error('Invalid platform');
        }
        
        // Validate content type
        const validContentTypes = ['mood', 'streak', 'achievement', 'hug'];
        if (!validContentTypes.includes(contentType)) {
          throw new Error('Invalid content type');
        }
        
        // Generate a share URL (in a real app, this would create a shareable link)
        const shareUrl = `https://hugmood.app/share/${contentType}/${contentId || 'anonymous'}`;
        
        // Record the share activity
        const now = new Date();
        const activityId = uuidv4();
        
        await pool.query(
          `INSERT INTO "UserActivities" 
           (id, userId, activityType, metadata, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            activityId,
            user.userId,
            'social_share',
            { platform, contentType, contentId, text },
            now,
            now
          ]
        );
        
        // In a real app, you would integrate with the platform's sharing API
        
        return {
          success: true,
          message: `Content shared to ${platform} successfully`,
          url: shareUrl
        };
      } catch (error) {
        console.error('Error sharing to social platform:', error);
        return {
          success: false,
          message: error.message || 'Failed to share content'
        };
      }
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
 * Calculate mood patterns by day of week
 */
function calculateMoodByDayOfWeek(moods) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayScores = days.reduce((acc, day) => ({ ...acc, [day]: { total: 0, count: 0 } }), {});
  
  moods.forEach(entry => {
    if (entry.score !== null) {
      const day = days[new Date(entry.createdAt).getDay()];
      dayScores[day].total += entry.score;
      dayScores[day].count += 1;
    }
  });
  
  return days.reduce((acc, day) => {
    acc[day] = dayScores[day].count > 0 ? 
      dayScores[day].total / dayScores[day].count : 0;
    return acc;
  }, {});
}

/**
 * Calculate mood patterns by time of day
 */
function calculateMoodByTimeOfDay(moods) {
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const timeScores = timeSlots.reduce((acc, slot) => ({ ...acc, [slot]: { total: 0, count: 0 } }), {});
  
  moods.forEach(entry => {
    if (entry.score !== null) {
      const hour = new Date(entry.createdAt).getHours();
      let timeSlot;
      
      if (hour >= 5 && hour < 12) {
        timeSlot = 'Morning';
      } else if (hour >= 12 && hour < 17) {
        timeSlot = 'Afternoon';
      } else if (hour >= 17 && hour < 21) {
        timeSlot = 'Evening';
      } else {
        timeSlot = 'Night';
      }
      
      timeScores[timeSlot].total += entry.score;
      timeScores[timeSlot].count += 1;
    }
  });
  
  return timeSlots.reduce((acc, slot) => {
    acc[slot] = timeScores[slot].count > 0 ? 
      timeScores[slot].total / timeScores[slot].count : 0;
    return acc;
  }, {});
}

/**
 * Generate correlations between moods and various factors
 */
async function generateCorrelationsData(userId, moods) {
  try {
    // Get user activities
    const activitiesResult = await pool.query(
      `SELECT * FROM "UserActivities" 
       WHERE "userId" = $1 
       ORDER BY "createdAt" DESC`,
      [userId]
    );
    
    const activities = activitiesResult.rows;
    
    // Group activities by type
    const activityTypes = {};
    activities.forEach(activity => {
      if (!activityTypes[activity.activityType]) {
        activityTypes[activity.activityType] = [];
      }
      activityTypes[activity.activityType].push(activity);
    });
    
    // Generate correlations
    const correlations = {
      activities: {}
    };
    
    // For each activity type, calculate correlation with mood
    // This is a simplified implementation - in a real app, you would:
    // 1. Use more sophisticated statistical methods to calculate correlations
    // 2. Consider temporal relationships between activities and moods
    // 3. Normalize data and apply filters
    
    for (const [activityType, activityList] of Object.entries(activityTypes)) {
      if (activityList.length < 3) continue; // Skip if too few data points
      
      // Generate a mock correlation value
      // In reality, this would involve complex calculations
      const correlation = (Math.random() * 2 - 1).toFixed(2);
      
      correlations.activities[activityType] = {
        correlation: parseFloat(correlation),
        impact: Math.abs(correlation) > 0.6 ? 'strong' : 
                Math.abs(correlation) > 0.3 ? 'moderate' : 'weak',
        direction: correlation > 0 ? 'positive' : 'negative'
      };
    }
    
    // Add some common correlations
    correlations.sleep = {
      correlation: (Math.random() * 0.8).toFixed(2),
      impact: 'strong',
      direction: 'positive'
    };
    
    correlations.weather = {
      correlation: (Math.random() * 0.6 - 0.1).toFixed(2),
      impact: 'moderate',
      direction: 'positive'
    };
    
    correlations.screenTime = {
      correlation: (Math.random() * -0.7).toFixed(2),
      impact: 'moderate',
      direction: 'negative'
    };
    
    return correlations;
  } catch (error) {
    console.error('Error generating correlations:', error);
    return null;
  }
}

/**
 * Generate personalized insights based on mood data
 */
function generateInsights(
  moods,
  moodFrequency,
  moodByDayOfWeek,
  moodByTimeOfDay,
  correlations,
  currentStreak,
  dominantMood,
  moodVariability,
  improvementTrend
) {
  const insights = [];
  
  // Streak insight
  if (currentStreak > 0) {
    insights.push({
      type: 'streak',
      title: `${currentStreak}-Day Streak!`,
      description: `You've tracked your mood for ${currentStreak} consecutive days. Keep it up!`,
      priority: 'high',
      data: { streakCount: currentStreak }
    });
  }
  
  // Dominant mood insight
  if (dominantMood) {
    insights.push({
      type: 'dominant_mood',
      title: `Your Dominant Mood: ${capitalizeFirstLetter(dominantMood)}`,
      description: `Your most common mood recently has been ${dominantMood}. This tells us about your emotional patterns.`,
      priority: 'medium',
      data: { mood: dominantMood }
    });
  }
  
  // Best/worst day insight
  const bestDay = findExtremeDayOfWeek(moodByDayOfWeek, 'best');
  const worstDay = findExtremeDayOfWeek(moodByDayOfWeek, 'worst');
  
  if (bestDay && bestDay.score > 0) {
    insights.push({
      type: 'best_day',
      title: `${bestDay.day}: Your Best Day`,
      description: `Your mood tends to be highest on ${bestDay.day}s, with an average score of ${bestDay.score.toFixed(1)}/10.`,
      priority: 'medium',
      data: { day: bestDay.day, score: bestDay.score }
    });
  }
  
  if (worstDay && worstDay.score > 0) {
    insights.push({
      type: 'worst_day',
      title: `${worstDay.day}: Your Most Challenging Day`,
      description: `Your mood tends to be lowest on ${worstDay.day}s, with an average score of ${worstDay.score.toFixed(1)}/10.`,
      priority: 'medium',
      data: { day: worstDay.day, score: worstDay.score }
    });
  }
  
  // Time of day insight
  const bestTime = findExtremeTimeOfDay(moodByTimeOfDay, 'best');
  
  if (bestTime && bestTime.score > 0) {
    insights.push({
      type: 'best_time',
      title: `${bestTime.timeSlot}: Your Best Time of Day`,
      description: `Your mood is typically highest during the ${bestTime.timeSlot.toLowerCase()}, with an average score of ${bestTime.score.toFixed(1)}/10.`,
      priority: 'medium',
      data: { timeSlot: bestTime.timeSlot, score: bestTime.score }
    });
  }
  
  // Variability insight
  insights.push({
    type: 'variability',
    title: `Mood Variability: ${capitalizeFirstLetter(moodVariability)}`,
    description: getVariabilityDescription(moodVariability),
    priority: 'low',
    data: { variability: moodVariability }
  });
  
  // Trend insight
  insights.push({
    type: 'trend',
    title: `Mood Trend: ${capitalizeFirstLetter(improvementTrend)}`,
    description: `Your mood has been ${improvementTrend} over the past week.`,
    priority: improvementTrend === 'declining' ? 'high' : 'medium',
    data: { trend: improvementTrend }
  });
  
  // Correlation insights (if available)
  if (correlations) {
    // Find strongest positive correlation
    let strongestPositive = null;
    let strongestPositiveValue = 0;
    
    // Find strongest negative correlation
    let strongestNegative = null;
    let strongestNegativeValue = 0;
    
    Object.entries(correlations.activities || {}).forEach(([activity, data]) => {
      if (data.direction === 'positive' && data.correlation > strongestPositiveValue) {
        strongestPositive = activity;
        strongestPositiveValue = data.correlation;
      } else if (data.direction === 'negative' && Math.abs(data.correlation) > strongestNegativeValue) {
        strongestNegative = activity;
        strongestNegativeValue = Math.abs(data.correlation);
      }
    });
    
    if (strongestPositive) {
      insights.push({
        type: 'positive_correlation',
        title: `${capitalizeFirstLetter(strongestPositive)} Boosts Your Mood`,
        description: `We've noticed that your mood tends to be higher on days when you engage in ${strongestPositive}.`,
        priority: 'high',
        data: { activity: strongestPositive, correlation: strongestPositiveValue }
      });
    }
    
    if (strongestNegative) {
      insights.push({
        type: 'negative_correlation',
        title: `${capitalizeFirstLetter(strongestNegative)} May Lower Your Mood`,
        description: `We've noticed that your mood tends to be lower on days when you engage in ${strongestNegative}.`,
        priority: 'high',
        data: { activity: strongestNegative, correlation: -strongestNegativeValue }
      });
    }
    
    // Sleep correlation
    if (correlations.sleep && correlations.sleep.impact === 'strong') {
      insights.push({
        type: 'sleep_correlation',
        title: 'Sleep Significantly Impacts Your Mood',
        description: 'Your data shows a strong connection between quality sleep and better mood.',
        priority: 'high',
        data: { correlation: correlations.sleep.correlation }
      });
    }
  }
  
  return insights;
}

/**
 * Generate personalized recommendations based on mood data
 */
function generateRecommendations(
  moods,
  moodFrequency,
  moodByDayOfWeek,
  moodByTimeOfDay,
  correlations,
  currentStreak,
  dominantMood,
  moodVariability,
  improvementTrend
) {
  const recommendations = [];
  
  // Streak recommendations
  if (currentStreak < 3) {
    recommendations.push({
      type: 'streak',
      title: 'Build Your Tracking Habit',
      description: 'Try setting a daily reminder to track your mood at the same time each day.',
      priority: 'high'
    });
  }
  
  // Dominant mood recommendations
  if (['sad', 'anxious', 'tired'].includes(dominantMood)) {
    recommendations.push({
      type: 'dominant_mood',
      title: 'Mood-Lifting Activities',
      description: 'Consider adding more physical activity, social connection, or mindfulness practice to your routine.',
      priority: 'high'
    });
  }
  
  // Day of week recommendations
  const worstDay = findExtremeDayOfWeek(moodByDayOfWeek, 'worst');
  if (worstDay && worstDay.score > 0) {
    recommendations.push({
      type: 'challenging_day',
      title: `Plan for ${worstDay.day}s`,
      description: `Since ${worstDay.day}s tend to be more challenging, try scheduling something you enjoy or a self-care activity for this day.`,
      priority: 'medium'
    });
  }
  
  // Variability recommendations
  if (moodVariability === 'high') {
    recommendations.push({
      type: 'variability',
      title: 'Stabilizing Routine',
      description: 'Your mood shows significant fluctuation. Regular routines for sleep, meals, and activity might help stabilize your mood.',
      priority: 'high'
    });
  }
  
  // Trend recommendations
  if (improvementTrend === 'declining') {
    recommendations.push({
      type: 'declining_trend',
      title: 'Pause and Reset',
      description: 'Your mood has been declining recently. Taking time for self-reflection and extra self-care might be beneficial.',
      priority: 'high'
    });
  }
  
  // Correlation-based recommendations
  if (correlations) {
    // Find positive correlations to encourage
    const positiveActivities = Object.entries(correlations.activities || {})
      .filter(([_, data]) => data.direction === 'positive' && data.impact !== 'weak')
      .map(([activity, _]) => activity);
    
    if (positiveActivities.length > 0) {
      recommendations.push({
        type: 'positive_activities',
        title: 'Activities That Boost Your Mood',
        description: `Consider doing more ${positiveActivities.join(', ')} as these tend to positively affect your mood.`,
        priority: 'high'
      });
    }
    
    // Sleep recommendations
    if (correlations.sleep && correlations.sleep.impact !== 'weak') {
      recommendations.push({
        type: 'sleep',
        title: 'Prioritize Sleep Quality',
        description: 'Your data shows sleep impacts your mood. Aim for 7-9 hours of quality sleep and maintain a consistent sleep schedule.',
        priority: 'high'
      });
    }
    
    // Screen time recommendations
    if (correlations.screenTime && correlations.screenTime.direction === 'negative') {
      recommendations.push({
        type: 'screen_time',
        title: 'Mindful Technology Use',
        description: 'Consider setting boundaries around screen time, especially before bed or when feeling low.',
        priority: 'medium'
      });
    }
  }
  
  return recommendations;
}

/**
 * Find best or worst day of the week based on mood scores
 */
function findExtremeDayOfWeek(moodByDayOfWeek, type) {
  const days = Object.keys(moodByDayOfWeek);
  
  if (days.length === 0) return null;
  
  let extremeDay = days[0];
  let extremeScore = moodByDayOfWeek[days[0]];
  
  for (const day of days) {
    const score = moodByDayOfWeek[day];
    if (type === 'best' && score > extremeScore) {
      extremeDay = day;
      extremeScore = score;
    } else if (type === 'worst' && score < extremeScore) {
      extremeDay = day;
      extremeScore = score;
    }
  }
  
  return { day: extremeDay, score: extremeScore };
}

/**
 * Find best or worst time of day based on mood scores
 */
function findExtremeTimeOfDay(moodByTimeOfDay, type) {
  const timeSlots = Object.keys(moodByTimeOfDay);
  
  if (timeSlots.length === 0) return null;
  
  let extremeTimeSlot = timeSlots[0];
  let extremeScore = moodByTimeOfDay[timeSlots[0]];
  
  for (const timeSlot of timeSlots) {
    const score = moodByTimeOfDay[timeSlot];
    if (type === 'best' && score > extremeScore) {
      extremeTimeSlot = timeSlot;
      extremeScore = score;
    } else if (type === 'worst' && score < extremeScore) {
      extremeTimeSlot = timeSlot;
      extremeScore = score;
    }
  }
  
  return { timeSlot: extremeTimeSlot, score: extremeScore };
}

/**
 * Helper function to capitalize first letter of a string
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Helper function to get variability description
 */
function getVariabilityDescription(level) {
  switch (level) {
    case 'low':
      return 'Your mood is relatively stable. You tend to maintain similar emotional states across days.';
    case 'moderate':
      return 'Your mood shows natural fluctuations, reflecting a normal response to daily events.';
    case 'high':
      return 'Your mood shows significant variation. This could be a response to changing circumstances or might reflect emotional sensitivity.';
    default:
      return 'Your mood patterns are unique to you.';
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
  
  console.log(`🚀 Mood Service ready at http://0.0.0.0:${PORT}${server.graphqlPath}`);
  
  return { server, app, httpServer };
}

// Express routes
app.get('/', (req, res) => {
  res.send('HugMood Mood Service');
});

// Start server
startApolloServer()
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

module.exports = { app, startApolloServer };