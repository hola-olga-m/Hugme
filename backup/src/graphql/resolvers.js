/**
 * GraphQL Resolvers
 * 
 * Main resolvers file for the HugMood GraphQL server
 */

const { GraphQLScalarType, Kind } = require('graphql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/database');
const { PubSub, withFilter } = require('graphql-subscriptions');

// Import models
const User = require('../models/User');
const Mood = require('../models/Mood');
const Hug = require('../models/Hug');
const HugRequest = require('../models/HugRequest');
const Follow = require('../models/Follow');
const UserStreak = require('../models/UserStreak');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const GroupHug = require('../models/GroupHug');
const GroupHugParticipant = require('../models/GroupHugParticipant');
const MediaHug = require('../models/MediaHug');
const StreakReward = require('../models/StreakReward');
const WellnessActivity = require('../models/WellnessActivity');

// Create PubSub instance for subscriptions
const pubsub = new PubSub();

// Define event topics for subscriptions
const MOOD_UPDATED = 'MOOD_UPDATED';
const HUG_RECEIVED = 'HUG_RECEIVED';
const HUG_REQUEST_CREATED = 'HUG_REQUEST_CREATED';
const USER_STATUS_CHANGED = 'USER_STATUS_CHANGED';
const STREAK_MILESTONE_REACHED = 'STREAK_MILESTONE_REACHED';
const BADGE_EARNED = 'BADGE_EARNED';
const GROUP_HUG_UPDATED = 'GROUP_HUG_UPDATED';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'hugmood-secret-key';

// Custom scalar type for DateTime
const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value) {
    return value instanceof Date ? value.toISOString() : null;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
});

// Custom scalar type for JSON
const jsonScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value);
      case Kind.OBJECT:
        return ast.fields.reduce((obj, field) => {
          obj[field.name.value] = parseLiteral(field.value);
          return obj;
        }, {});
      default:
        return null;
    }
  }
});

// Resolvers
const resolvers = {
  Query: {
    healthCheck: () => "GraphQL server is running!",
    
    verifyToken: async (_, { token }, context) => {
      if (token) {
        try {
          // Verify JWT token
          const decoded = jwt.verify(token, JWT_SECRET);
          
          // Get user from database
          const user = await User.findByPk(decoded.userId);
          
          if (!user) {
            return { isValid: false, user: null };
          }
          
          return { isValid: true, user };
        } catch (error) {
          console.error('Token verification error:', error);
        }
      }
      
      return { isValid: false, user: null };
    },
    
    me: async (_, __, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      return user;
    },
    
    userProfile: async (_, { userId }, { user }) => {
      // Check authentication
      if (!user) {
        throw new Error('Authentication required');
      }
      
      try {
        // Get user from database
        const profileUser = await User.findByPk(userId);
        
        if (!profileUser) {
          throw new Error('User not found');
        }
        
        // Get user's mood history
        const moods = await Mood.findAll({
          where: { userId },
          order: [['createdAt', 'DESC']],
          limit: 10
        });
        
        // Get mood streak
        const moodStreak = await UserStreak.findOne({ where: { userId }});
        
        // Get user badges
        const userBadges = await UserBadge.findAll({
          where: { userId },
          include: [{ model: Badge }]
        });
        
        // Get user stats (counts)
        const hugsSent = await Hug.count({ where: { senderId: userId }});
        const hugsReceived = await Hug.count({ where: { recipientId: userId }});
        const moodEntries = await Mood.count({ where: { userId }});
        
        // Calculate average mood score
        const moodScores = await Mood.findAll({
          attributes: ['score'],
          where: { userId }
        });
        
        const avgMoodScore = moodScores.length > 0
          ? moodScores.reduce((sum, m) => sum + m.score, 0) / moodScores.length
          : null;
        
        return {
          user: profileUser,
          moods,
          moodStreak: moodStreak || { currentStreak: 0, longestStreak: 0, totalDays: 0 },
          badges: userBadges,
          stats: {
            hugsGiven: hugsSent,
            hugsReceived,
            moodEntries,
            avgMoodScore,
            completionRate: 0 // Calculate this based on streak data
          }
        };
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile');
      }
    },
    
    // More query resolvers would be added here
  },
  
  Mutation: {
    login: async (_, { input }) => {
      const { email, password } = input;
      
      try {
        // Find user by email
        const user = await User.findOne({
          where: {
            email
          }
        });
        
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        // Update last login
        user.lastActive = new Date();
        await user.save();
        
        // Notify about user status change
        pubsub.publish(USER_STATUS_CHANGED, {
          userStatusChanged: {
            userId: user.id,
            isOnline: true,
            lastActive: user.lastActive
          }
        });
        
        return { token, user };
      } catch (error) {
        console.error('Login error:', error);
        throw new Error('Authentication failed');
      }
    },
    
    register: async (_, { input }) => {
      const { username, email, password, displayName } = input;
      
      try {
        // Check if username or email already exists
        const existingUser = await User.findOne({
          where: {
            [sequelize.Op.or]: [
              { username },
              { email }
            ]
          }
        });
        
        if (existingUser) {
          throw new Error('Username or email already in use');
        }
        
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await User.create({
          id: uuidv4(),
          username,
          email,
          passwordHash,
          displayName: displayName || username,
          isAnonymous: false,
          isOnline: true,
          lastActive: new Date()
        });
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        // Create initial streak record
        await UserStreak.create({
          userId: user.id,
          currentStreak: 0,
          longestStreak: 0,
          totalDays: 0
        });
        
        return { token, user };
      } catch (error) {
        console.error('Registration error:', error);
        throw new Error('Registration failed');
      }
    },
    
    createMood: async (_, { input }, { user }) => {
      // Check authentication
      if (!user) {
        throw new Error('Authentication required');
      }
      
      const { value, score, note, isPublic } = input;
      
      try {
        // Create mood entry
        const mood = await Mood.create({
          id: uuidv4(),
          userId: user.id,
          value,
          score,
          note: note || null,
          isPublic: isPublic || false
        });
        
        // Publish subscription event
        pubsub.publish(MOOD_UPDATED, {
          moodUpdated: mood,
          userId: user.id
        });
        
        return mood;
      } catch (error) {
        console.error('Create mood error:', error);
        throw new Error('Failed to create mood entry');
      }
    },
    
    sendHug: async (_, { input }, { user }) => {
      // Check authentication
      if (!user) {
        throw new Error('Authentication required');
      }
      
      const { recipientId, type, message } = input;
      
      try {
        // Check if recipient exists
        const recipient = await User.findByPk(recipientId);
        
        if (!recipient) {
          throw new Error('Recipient not found');
        }
        
        // Create hug
        const hug = await Hug.create({
          id: uuidv4(),
          senderId: user.id,
          recipientId,
          type,
          message: message || null
        });
        
        // Publish subscription event
        pubsub.publish(HUG_RECEIVED, {
          hugReceived: hug,
          userId: recipientId
        });
        
        return hug;
      } catch (error) {
        console.error('Send hug error:', error);
        throw new Error('Failed to send hug');
      }
    },
    
    // More mutation resolvers would be added here
  },
  
  Subscription: {
    moodUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([MOOD_UPDATED]),
        (payload, variables) => {
          return payload.userId === variables.userId;
        }
      )
    },
    
    hugReceived: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([HUG_RECEIVED]),
        (payload, variables) => {
          return payload.userId === variables.userId;
        }
      )
    },
    
    hugRequestCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([HUG_REQUEST_CREATED]),
        (payload, variables) => {
          // If isPublic is true, only show public requests
          // If isPublic is false/undefined, show all requests
          return variables.isPublic ? payload.hugRequestCreated.isPublic : true;
        }
      )
    },
    
    userStatusChanged: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([USER_STATUS_CHANGED]),
        (payload, variables) => {
          // If userId is provided, only show updates for that user
          return variables.userId ? payload.userStatusChanged.userId === variables.userId : true;
        }
      )
    },
    
    // More subscription resolvers would be added here
  },
  
  // Scalar type resolvers
  DateTime: dateTimeScalar,
  JSON: jsonScalar,
  
  // Type resolvers
  User: {
    followersCount: async (user) => {
      return await Follow.count({ where: { followingId: user.id }});
    },
    
    followingCount: async (user) => {
      return await Follow.count({ where: { followerId: user.id }});
    }
  },
  
  Mood: {
    user: async (mood) => {
      return await User.findByPk(mood.userId);
    }
  },
  
  Hug: {
    sender: async (hug) => {
      return await User.findByPk(hug.senderId);
    },
    
    recipient: async (hug) => {
      return await User.findByPk(hug.recipientId);
    }
  },
  
  // Define FeedItem union type resolver
  FeedItem: {
    __resolveType(obj) {
      if (obj.mood) return 'MoodFeedItem';
      if (obj.hug) return 'HugFeedItem';
      if (obj.achievement) return 'AchievementFeedItem';
      if (obj.request) return 'HugRequestFeedItem';
      return null;
    }
  },
};

module.exports = resolvers;