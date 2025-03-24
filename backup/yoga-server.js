/**
 * HugMood GraphQL Yoga Server
 * 
 * A modern GraphQL server implementation using GraphQL Yoga.
 * This server integrates with the existing services while providing
 * a more robust and scalable GraphQL API layer with real-time capabilities.
 */

const { createYoga, createPubSub } = require('graphql-yoga');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');

// Import models
const User = require('./src/models/User');
const Mood = require('./src/models/Mood');
const Hug = require('./src/models/Hug');
const MediaHug = require('./src/models/MediaHug');
const Badge = require('./src/models/Badge');
const UserBadge = require('./src/models/UserBadge');
const GroupHug = require('./src/models/GroupHug');
const GroupHugParticipant = require('./src/models/GroupHugParticipant');
const Follow = require('./src/models/Follow');
const UserStreak = require('./src/models/UserStreak');
const WellnessActivity = require('./src/models/WellnessActivity');
const StreakReward = require('./src/models/StreakReward');

// Load the GraphQL schema
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'hugmood-secret-key';

// Define resolvers
const resolvers = {
  Query: {
    verifyToken: async (_, __, context) => {
      if (!context.user) {
        return { isValid: false, user: null };
      }
      return {
        isValid: true,
        user: context.user
      };
    },
    
    me: async (_, __, context) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return context.user;
    },
    
    userProfile: async (_, { userId }, context) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get user from database
        const user = await User.findByPk(userId);
        if (!user) {
          throw new Error('User not found');
        }
        
        // Get user's moods
        const moods = await Mood.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']],
          limit: 10
        });
        
        // Get mood streak info
        const streakInfo = await UserStreak.findOne({ where: { userId }});
        
        // Get user badges
        const userBadges = await UserBadge.findAll({
          where: { userId },
          include: [{ model: Badge }]
        });
        
        // Format badges
        const badges = userBadges.map(ub => ({
          id: ub.Badge.id,
          name: ub.Badge.name,
          description: ub.Badge.description,
          icon: ub.Badge.icon,
          earnedAt: ub.createdAt.toISOString()
        }));
        
        // Get user stats
        const hugsGiven = await Hug.count({ where: { senderId: userId }});
        const hugsReceived = await Hug.count({ where: { recipientId: userId }});
        const moodEntries = await Mood.count({ where: { userId }});
        
        // Calculate average mood score
        const moodScores = await Mood.findAll({
          where: { userId },
          attributes: ['score']
        });
        
        const avgMoodScore = moodScores.length > 0 
          ? moodScores.reduce((sum, mood) => sum + mood.score, 0) / moodScores.length 
          : null;
        
        return {
          user,
          moods,
          moodStreak: streakInfo ? {
            currentStreak: streakInfo.currentStreak,
            longestStreak: streakInfo.longestStreak,
            totalDays: streakInfo.totalDays,
            lastUpdated: streakInfo.lastUpdated?.toISOString()
          } : null,
          badges,
          stats: {
            hugsGiven,
            hugsReceived,
            moodEntries,
            avgMoodScore,
            completionRate: streakInfo ? (streakInfo.currentStreak / 7) * 100 : 0
          }
        };
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile');
      }
    },
    
    moodHistory: async (_, { userId, limit = 30, offset = 0 }, context) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Check if requesting own moods or if has permission
        if (context.user.id !== userId) {
          // Check if the requested user allows mood viewing (not implemented yet)
          // For now, just allow it
        }
        
        const moods = await Mood.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']],
          limit,
          offset
        });
        
        return moods;
      } catch (error) {
        console.error('Error fetching mood history:', error);
        throw new Error('Failed to fetch mood history');
      }
    },
    
    moodAnalytics: async (_, { userId, timeRange = 30 }, context) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Check if requesting own analytics or if has permission
        if (context.user.id !== userId) {
          // Check if the requested user allows analytics viewing (not implemented yet)
          // For now, just allow it
        }
        
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);
        
        // Get moods within time range
        const moods = await Mood.findAll({
          where: {
            userId,
            createdAt: {
              [Op.between]: [startDate, endDate]
            }
          },
          order: [['createdAt', 'ASC']]
        });
        
        // Get mood frequency
        const moodCounts = {};
        moods.forEach(mood => {
          moodCounts[mood.value] = (moodCounts[mood.value] || 0) + 1;
        });
        
        // Calculate average score
        const avgScore = moods.length > 0
          ? moods.reduce((sum, mood) => sum + mood.score, 0) / moods.length
          : 0;
        
        // Determine dominant mood
        let dominantMood = null;
        let maxCount = 0;
        
        Object.entries(moodCounts).forEach(([mood, count]) => {
          if (count > maxCount) {
            maxCount = count;
            dominantMood = mood;
          }
        });
        
        // Generate simple insights
        const insights = [];
        
        if (moods.length > 0) {
          // Add insight about dominant mood
          insights.push({
            id: '1',
            type: 'pattern',
            title: `Your most common mood is ${dominantMood}`,
            description: `You reported feeling ${dominantMood} ${moodCounts[dominantMood]} times in the last ${timeRange} days.`,
            relevanceScore: 0.9
          });
          
          // Add insight about average mood
          let moodCategory = 'neutral';
          if (avgScore > 7) moodCategory = 'positive';
          else if (avgScore < 4) moodCategory = 'negative';
          
          insights.push({
            id: '2',
            type: 'summary',
            title: `Your average mood is ${moodCategory}`,
            description: `Your average mood score is ${avgScore.toFixed(1)} out of 10 over the last ${timeRange} days.`,
            relevanceScore: 0.85
          });
        } else {
          insights.push({
            id: '1',
            type: 'empty',
            title: 'Not enough mood data',
            description: `You haven't tracked your mood in the last ${timeRange} days. Start tracking to get insights!`,
            relevanceScore: 1.0
          });
        }
        
        // Generate recommendations
        const recommendations = [];
        
        if (moods.length < 7) {
          recommendations.push({
            id: '1',
            type: 'tracking',
            title: 'Track your mood daily',
            description: 'Regular tracking helps you understand your emotional patterns.',
            actionSteps: ['Set a daily reminder', 'Track at the same time each day'],
            priority: 'high'
          });
        }
        
        if (avgScore < 5 && moods.length > 0) {
          recommendations.push({
            id: '2',
            type: 'wellbeing',
            title: 'Focus on self-care',
            description: 'Your mood scores suggest you might benefit from more self-care activities.',
            actionSteps: ['Get regular sleep', 'Practice mindfulness', 'Connect with supportive people'],
            priority: 'high'
          });
        }
        
        return {
          statistics: {
            totalEntries: moods.length,
            averageScore: avgScore,
            dominantMood,
            improvementTrend: 'stable', // Simplified - would need more complex analysis
            variability: 'moderate', // Simplified
            lowestScore: moods.length > 0 ? Math.min(...moods.map(m => m.score)) : null,
            highestScore: moods.length > 0 ? Math.max(...moods.map(m => m.score)) : null
          },
          insights,
          recommendations,
          patterns: {
            byDayOfWeek: {},
            byTimeOfDay: {},
            byLocation: {},
            correlations: {}
          }
        };
      } catch (error) {
        console.error('Error generating mood analytics:', error);
        throw new Error('Failed to generate mood analytics');
      }
    },
    
    communityFeed: async (_, { limit = 20, offset = 0 }, context) => {
      // Public feed can be viewed without authentication
      try {
        // Get public moods
        const moods = await Mood.findAll({
          where: { isPublic: true },
          order: [['createdAt', 'DESC']],
          limit,
          offset,
          include: [{ model: User, attributes: ['id', 'username', 'displayName'] }]
        });
        
        // Format feed items
        const moodItems = moods.map(mood => ({
          type: 'MOOD',
          mood: {
            ...mood.toJSON(),
            user: mood.User
          }
        }));
        
        // Get recent hugs (if we want to show them in the feed)
        const hugs = await Hug.findAll({
          order: [['createdAt', 'DESC']],
          limit: Math.floor(limit / 2),
          offset,
          include: [
            { model: User, as: 'sender', attributes: ['id', 'username', 'displayName'] },
            { model: User, as: 'recipient', attributes: ['id', 'username', 'displayName'] }
          ]
        });
        
        // Format hug items
        const hugItems = hugs.map(hug => ({
          type: 'HUG',
          hug: {
            ...hug.toJSON(),
            sender: hug.sender,
            recipient: hug.recipient
          }
        }));
        
        // Combine and sort items
        const feedItems = [...moodItems, ...hugItems].sort(
          (a, b) => new Date(b[b.type.toLowerCase()].createdAt) - new Date(a[a.type.toLowerCase()].createdAt)
        ).slice(0, limit);
        
        return {
          items: feedItems,
          hasMore: (moodItems.length + hugItems.length) >= limit
        };
      } catch (error) {
        console.error('Error fetching community feed:', error);
        throw new Error('Failed to fetch community feed');
      }
    }
    
    // Add more query resolvers as needed...
  },
  
  Mutation: {
    login: async (_, { input }) => {
      const { email, password } = input;
      
      try {
        // Find user by email or username
        const user = await User.findOne({
          where: {
            [Op.or]: [
              { email },
              { username: email } // Allow login with username as well
            ]
          }
        });
        
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        // Update user's last active time
        await user.update({ lastActive: new Date(), isOnline: true });
        
        return {
          token,
          user
        };
      } catch (error) {
        console.error('Login error:', error);
        throw new Error(error.message || 'Authentication failed');
      }
    },
    
    register: async (_, { input }) => {
      const { username, email, password, displayName } = input;
      
      try {
        // Check if username or email already exists
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [
              { username },
              { email }
            ]
          }
        });
        
        if (existingUser) {
          throw new Error(
            existingUser.username === username 
              ? 'Username already exists' 
              : 'Email already exists'
          );
        }
        
        // Create new user
        const user = await User.create({
          username,
          email,
          password, // Will be hashed by model hooks
          displayName: displayName || username,
          isOnline: true,
          lastActive: new Date()
        });
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        return {
          token,
          user
        };
      } catch (error) {
        console.error('Registration error:', error);
        throw new Error(error.message || 'Registration failed');
      }
    },
    
    createMood: async (_, { input }, context) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      const { value, score, note, isPublic = false } = input;
      
      try {
        // Create new mood entry
        const mood = await Mood.create({
          userId: context.user.id,
          value,
          score,
          note,
          isPublic
        });
        
        // Update user's streak
        try {
          // Find or create user streak
          let streak = await UserStreak.findOne({ 
            where: { userId: context.user.id } 
          });
          
          if (!streak) {
            streak = await UserStreak.create({
              userId: context.user.id,
              currentStreak: 1,
              longestStreak: 1,
              totalDays: 1,
              lastUpdated: new Date()
            });
          } else {
            // Update streak logic would go here
            // For simplicity, just increment
            const updatedStreak = streak.currentStreak + 1;
            await streak.update({
              currentStreak: updatedStreak,
              longestStreak: Math.max(updatedStreak, streak.longestStreak),
              totalDays: streak.totalDays + 1,
              lastUpdated: new Date()
            });
          }
        } catch (streakError) {
          console.error('Error updating streak:', streakError);
          // Don't fail the mood creation if streak update fails
        }
        
        return mood;
      } catch (error) {
        console.error('Error creating mood:', error);
        throw new Error('Failed to create mood entry');
      }
    },
    
    sendHug: async (_, { input }, context) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      const { recipientId, type, message } = input;
      
      try {
        // Check if recipient exists
        const recipient = await User.findByPk(recipientId);
        
        if (!recipient) {
          throw new Error('Recipient not found');
        }
        
        // Create a new hug
        const hug = await Hug.create({
          senderId: context.user.id,
          recipientId,
          type,
          message
        });
        
        // Get sender and recipient details
        hug.sender = context.user;
        hug.recipient = recipient;
        
        return hug;
      } catch (error) {
        console.error('Error sending hug:', error);
        throw new Error('Failed to send hug');
      }
    },
    
    requestHug: async (_, { input }, context) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Authentication required');
      }
      
      const { message, mood, isPublic = false } = input;
      
      try {
        // Create a new hug request
        const request = await HugRequest.create({
          userId: context.user.id,
          message,
          mood,
          isPublic
        });
        
        // Add user information to request
        request.user = context.user;
        
        return request;
      } catch (error) {
        console.error('Error creating hug request:', error);
        throw new Error('Failed to create hug request');
      }
    }
    
    // Add more mutation resolvers as needed...
  },
  
  // Define type resolvers to handle relationships
  User: {
    // Resolver for followersCount
    followersCount: async (user) => {
      return await Follow.count({ where: { followingId: user.id } });
    },
    
    // Resolver for followingCount
    followingCount: async (user) => {
      return await Follow.count({ where: { followerId: user.id } });
    }
  },
  
  // Handle the JSON scalar
  JSON: {
    serialize(value) {
      return value;
    },
    parseValue(value) {
      return value;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return JSON.parse(ast.value);
      }
      return null;
    }
  },
  
  // Define union type resolvers
  FeedItem: {
    __resolveType(obj) {
      if (obj.type === 'MOOD') return 'MoodFeedItem';
      if (obj.type === 'HUG') return 'HugFeedItem';
      if (obj.type === 'ACHIEVEMENT') return 'AchievementFeedItem';
      if (obj.type === 'HUG_REQUEST') return 'HugRequestFeedItem';
      return null;
    }
  }
};

// Create the executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Set up the Yoga server
async function startYogaServer() {
  // Create Express app
  const app = express();
  
  // Create HTTP server
  const httpServer = http.createServer(app);
  
  // Extract user from token for context
  const getContextFromRequest = async (req) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      try {
        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user by ID
        const user = await User.findByPk(decoded.userId);
        
        return { user };
      } catch (error) {
        console.error('Token verification error:', error);
      }
    }
    
    return { user: null };
  };
  
  // Create Yoga instance
  const yoga = createYoga({
    schema,
    context: async ({ req }) => getContextFromRequest(req),
    graphiql: true, // Enable GraphiQL in development
    landingPage: false,
    cors: {
      origin: '*',
      credentials: true,
    },
    multipart: true
  });
  
  // Apply Yoga middleware to Express
  app.use('/graphql', yoga);
  
  // Start server
  const PORT = process.env.GRAPHQL_PORT || 4000;
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  
  console.log(`🚀 GraphQL server running at http://localhost:${PORT}/graphql`);
  
  return { app, httpServer };
}

module.exports = { startYogaServer };