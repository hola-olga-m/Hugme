/**
 * Mood Service Resolvers
 * Implements the business logic for mood-related GraphQL operations
 * Using Guild GraphQL tools for enhanced capabilities
 */

const { GraphQLScalarType } = require('graphql');
const { composeResolvers } = require('@graphql-tools/resolvers-composition');
const { Kind } = require('graphql/language');
const { v4: uuidv4 } = require('uuid');

// JSON scalar type for handling complex data
const JSONScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value);
      } catch (error) {
        return null;
      }
    }
    if (ast.kind === Kind.OBJECT) {
      const value = Object.create(null);
      ast.fields.forEach(field => {
        value[field.name.value] = parseLiteral(field.value);
      });
      return value;
    }
    return null;
  }
});

// Authentication middleware using Guild's compose pattern
const isAuthenticated = next => (root, args, context, info) => {
  if (!context.user) {
    throw new Error('You must be logged in to access this resource');
  }
  return next(root, args, context, info);
};

// Permission check for mood ownership
const isOwnerOrPublic = next => async (root, args, context, info) => {
  const { user, pool } = context;
  const moodId = args.id;
  
  // Skip check for mood creation
  if (!moodId) {
    return next(root, args, context, info);
  }
  
  try {
    const result = await pool.query('SELECT "userId", "isPublic" FROM "Moods" WHERE id = $1', [moodId]);
    if (result.rows.length === 0) {
      throw new Error('Mood not found');
    }
    
    const mood = result.rows[0];
    
    // Allow if public or user is owner
    if (mood.isPublic || mood.userId === user?.userId) {
      return next(root, args, context, info);
    }
    
    throw new Error('You do not have permission to access this mood');
  } catch (error) {
    throw new Error('Error checking mood permissions: ' + error.message);
  }
};

// Rate limiting middleware (simplified - in production use a Redis-based solution)
const rateLimiter = (limit, duration) => {
  const requests = new Map();
  
  return next => (root, args, context, info) => {
    const { user } = context;
    const userId = user?.userId || 'anonymous';
    const key = `${userId}:${info.fieldName}`;
    const now = Date.now();
    
    // Get user's request history
    const userRequests = requests.get(key) || [];
    
    // Filter out expired entries
    const validRequests = userRequests.filter(timestamp => now - timestamp < duration * 1000);
    
    // Check if limit is exceeded
    if (validRequests.length >= limit) {
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((duration - (now - validRequests[0]) / 1000))} seconds`);
    }
    
    // Add current request
    validRequests.push(now);
    requests.set(key, validRequests);
    
    return next(root, args, context, info);
  };
};

// Basic resolvers without middleware
const baseResolvers = {
  JSON: JSONScalar,
  
  Query: {
    mood: async (_, { id }, { pool }) => {
      try {
        const result = await pool.query('SELECT * FROM "Moods" WHERE id = $1', [id]);
        return result.rows[0] || null;
      } catch (error) {
        console.error('Error fetching mood:', error);
        throw new Error('Failed to fetch mood');
      }
    },
    
    moods: async (_, { userId, limit = 20, offset = 0, startDate, endDate }, { user, pool }) => {
      try {
        // Parameters for the query
        const params = [userId, limit, offset];
        let queryIndex = 4;
        
        // Base query
        let query = 'SELECT * FROM "Moods" WHERE "userId" = $1';
        let countQuery = 'SELECT COUNT(*) FROM "Moods" WHERE "userId" = $1';
        
        // Non-owner can only view public moods
        if (userId !== user?.userId) {
          query += ' AND "isPublic" = true';
          countQuery += ' AND "isPublic" = true';
        }
        
        // Add date filters if provided
        if (startDate) {
          query += ` AND "createdAt" >= $${queryIndex}`;
          countQuery += ` AND "createdAt" >= $2`;
          params.push(new Date(startDate));
          queryIndex++;
        }
        
        if (endDate) {
          query += ` AND "createdAt" <= $${queryIndex}`;
          countQuery += ` AND "createdAt" <= $${startDate ? '3' : '2'}`;
          params.push(new Date(endDate));
        }
        
        // Finalize the queries
        query += ' ORDER BY "createdAt" DESC LIMIT $2 OFFSET $3';
        
        // Execute the queries
        const moodsResult = await pool.query(query, params);
        
        // Prepare count params
        const countParams = [userId];
        if (startDate) countParams.push(new Date(startDate));
        if (endDate) countParams.push(new Date(endDate));
        
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
    
    moodHistory: async (_, { userId, period = '30days' }, { user, pool }) => {
      try {
        // Set date range based on period
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
        
        // Get moods for the period
        const accessClause = userId !== user?.userId ? ' AND "isPublic" = true' : '';
        
        const moodsResult = await pool.query(
          `SELECT * FROM "Moods" 
           WHERE "userId" = $1 AND "createdAt" >= $2 AND "createdAt" <= $3${accessClause}
           ORDER BY "createdAt" ASC`,
          [userId, startDate, endDate]
        );
        
        const moods = moodsResult.rows;
        
        // Group by day and process statistics
        const dailyMoods = {};
        const moodCounts = {};
        let totalScore = 0;
        let scoreCount = 0;
        
        moods.forEach(mood => {
          const date = new Date(mood.createdAt).toISOString().split('T')[0];
          
          // Keep first mood of each day
          if (!dailyMoods[date]) {
            dailyMoods[date] = {
              date,
              value: mood.value,
              score: mood.score,
              note: mood.note
            };
          }
          
          // Count mood frequency
          moodCounts[mood.value] = (moodCounts[mood.value] || 0) + 1;
          
          // Sum scores for average
          if (mood.score !== null) {
            totalScore += mood.score;
            scoreCount++;
          }
        });
        
        // Fill in missing days
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
        
        // Calculate average and mood frequency
        const averageScore = scoreCount > 0 ? totalScore / scoreCount : null;
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
    
    moodStreak: async (_, { userId }, { pool }) => {
      try {
        // Get streak data from DB
        const result = await pool.query(
          'SELECT * FROM "MoodStreaks" WHERE "userId" = $1',
          [userId]
        );
        
        if (result.rows.length === 0) {
          // Create a new streak record if none exists
          const newStreak = {
            id: uuidv4(),
            userId,
            currentStreak: 0,
            longestStreak: 0,
            lastRecordedAt: null,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          await pool.query(
            `INSERT INTO "MoodStreaks" 
             (id, "userId", "currentStreak", "longestStreak", "lastRecordedAt", "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              newStreak.id, 
              newStreak.userId, 
              newStreak.currentStreak, 
              newStreak.longestStreak, 
              newStreak.lastRecordedAt, 
              newStreak.createdAt, 
              newStreak.updatedAt
            ]
          );
          
          return newStreak;
        }
        
        return result.rows[0];
      } catch (error) {
        console.error('Error fetching mood streak:', error);
        throw new Error('Failed to fetch mood streak');
      }
    },
    
    moodAnalytics: async (_, { userId, timeRange = 30, includeCorrelations = true }, { user, pool }) => {
      try {
        // Validate access
        if (userId !== user?.userId) {
          throw new Error('You can only access your own mood analytics');
        }
        
        // Set date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);
        
        // Get mood entries for the time range
        const moodsResult = await pool.query(
          `SELECT * FROM "Moods" 
           WHERE "userId" = $1 AND "createdAt" >= $2 AND "createdAt" <= $3
           ORDER BY "createdAt" ASC`,
          [userId, startDate, endDate]
        );
        
        const moodEntries = moodsResult.rows;
        
        // Get streak info
        const streakResult = await pool.query(
          'SELECT * FROM "MoodStreaks" WHERE "userId" = $1',
          [userId]
        );
        
        const streak = streakResult.rows[0] || { currentStreak: 0, longestStreak: 0 };
        
        // Calculate statistics
        // ... (implement detailed analytics logic)
        
        // For this example, we'll return a simplified analytics result
        return {
          userId,
          timeRange,
          moodEntries,
          statistics: {
            totalEntries: moodEntries.length,
            uniqueMoods: new Set(moodEntries.map(m => m.value)).size,
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            averageScore: calculateAverageScore(moodEntries),
            moodVariability: calculateMoodVariability(moodEntries),
            dominantMood: calculateDominantMood(moodEntries),
            improvementTrend: calculateImprovementTrend(moodEntries)
          },
          metrics: {
            moodFrequency: calculateMoodFrequency(moodEntries),
            moodByDayOfWeek: calculateMoodByDayOfWeek(moodEntries),
            moodByTimeOfDay: calculateMoodByTimeOfDay(moodEntries)
          },
          correlations: includeCorrelations ? await generateCorrelationsData(userId, moodEntries, pool) : null,
          insights: generateInsights(moodEntries, streak),
          recommendations: generateRecommendations(moodEntries, streak)
        };
      } catch (error) {
        console.error('Error generating mood analytics:', error);
        throw new Error('Failed to generate mood analytics');
      }
    },
    
    moodInsights: async (_, { userId, limit = 10, offset = 0 }, { user, pool }) => {
      try {
        // Validate access
        if (userId !== user?.userId) {
          throw new Error('You can only access your own mood insights');
        }
        
        // Get insights from DB
        const result = await pool.query(
          `SELECT * FROM "MoodInsights" 
           WHERE "userId" = $1 
           ORDER BY "createdAt" DESC 
           LIMIT $2 OFFSET $3`,
          [userId, limit, offset]
        );
        
        return result.rows;
      } catch (error) {
        console.error('Error fetching mood insights:', error);
        throw new Error('Failed to fetch mood insights');
      }
    },
    
    moodReminders: async (_, { userId }, { user, pool }) => {
      try {
        // Validate access
        if (userId !== user?.userId) {
          throw new Error('You can only access your own mood reminders');
        }
        
        // Get reminders from DB
        const result = await pool.query(
          'SELECT * FROM "MoodReminders" WHERE "userId" = $1 ORDER BY "time" ASC',
          [userId]
        );
        
        return result.rows;
      } catch (error) {
        console.error('Error fetching mood reminders:', error);
        throw new Error('Failed to fetch mood reminders');
      }
    },
    
    communityMoods: async (_, { limit = 20, offset = 0 }, { pool }) => {
      try {
        // Get public moods for community feed
        const moodsResult = await pool.query(
          `SELECT * FROM "Moods" 
           WHERE "isPublic" = true 
           ORDER BY "createdAt" DESC 
           LIMIT $1 OFFSET $2`,
          [limit, offset]
        );
        
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
    
    userActivities: async (_, { userId, type, limit = 20, offset = 0 }, { user, pool }) => {
      try {
        // Validate access
        if (userId !== user?.userId) {
          throw new Error('You can only access your own activity data');
        }
        
        // Build query
        let query = 'SELECT * FROM "UserActivities" WHERE "userId" = $1';
        const params = [userId];
        
        if (type) {
          query += ' AND "activityType" = $2';
          params.push(type);
        }
        
        query += ' ORDER BY "createdAt" DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(limit, offset);
        
        // Get activities from DB
        const result = await pool.query(query, params);
        
        return result.rows;
      } catch (error) {
        console.error('Error fetching user activities:', error);
        throw new Error('Failed to fetch user activities');
      }
    },
    
    _service: () => {
      return {
        name: 'HugMood-Mood-Service',
        version: '1.0.0',
        status: 'operational'
      };
    }
  },
  
  Mutation: {
    createMood: async (_, { input }, { user, pool }) => {
      try {
        const { value, score, note, isPublic, location, activities } = input;
        
        // Create new mood entry
        const moodId = uuidv4();
        const now = new Date();
        
        // Insert new mood
        const result = await pool.query(
          `INSERT INTO "Moods" 
           (id, "userId", value, score, note, "isPublic", location, activities, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
           RETURNING *`,
          [
            moodId, 
            user.userId, 
            value, 
            score, 
            note, 
            isPublic !== undefined ? isPublic : false, 
            location ? JSON.stringify(location) : null, 
            activities || [], 
            now, 
            now
          ]
        );
        
        const mood = result.rows[0];
        
        // Update user streak
        await updateUserStreak(user.userId, pool);
        
        // Generate and store insights if needed
        await generateMoodInsights(user.userId, mood, pool);
        
        return mood;
      } catch (error) {
        console.error('Error creating mood:', error);
        throw new Error('Failed to create mood: ' + error.message);
      }
    },
    
    updateMood: async (_, { id, input }, { pool }) => {
      try {
        // First check if mood exists and belongs to user
        const checkResult = await pool.query(
          'SELECT * FROM "Moods" WHERE id = $1',
          [id]
        );
        
        if (checkResult.rows.length === 0) {
          throw new Error('Mood not found');
        }
        
        const mood = checkResult.rows[0];
        
        // Build update query
        const updates = [];
        const values = [id];
        let paramIndex = 2;
        
        if (input.value !== undefined) {
          updates.push(`value = $${paramIndex++}`);
          values.push(input.value);
        }
        
        if (input.score !== undefined) {
          updates.push(`score = $${paramIndex++}`);
          values.push(input.score);
        }
        
        if (input.note !== undefined) {
          updates.push(`note = $${paramIndex++}`);
          values.push(input.note);
        }
        
        if (input.isPublic !== undefined) {
          updates.push(`"isPublic" = $${paramIndex++}`);
          values.push(input.isPublic);
        }
        
        if (input.location !== undefined) {
          updates.push(`location = $${paramIndex++}`);
          values.push(input.location ? JSON.stringify(input.location) : null);
        }
        
        if (input.activities !== undefined) {
          updates.push(`activities = $${paramIndex++}`);
          values.push(input.activities);
        }
        
        updates.push(`"updatedAt" = $${paramIndex++}`);
        values.push(new Date());
        
        // Execute update
        const updateQuery = `
          UPDATE "Moods" 
          SET ${updates.join(', ')} 
          WHERE id = $1 
          RETURNING *
        `;
        
        const result = await pool.query(updateQuery, values);
        
        return result.rows[0];
      } catch (error) {
        console.error('Error updating mood:', error);
        throw new Error('Failed to update mood: ' + error.message);
      }
    },
    
    deleteMood: async (_, { id }, { user, pool }) => {
      try {
        // Check if mood exists and belongs to user
        const checkResult = await pool.query(
          'SELECT "userId" FROM "Moods" WHERE id = $1',
          [id]
        );
        
        if (checkResult.rows.length === 0) {
          throw new Error('Mood not found');
        }
        
        if (checkResult.rows[0].userId !== user.userId) {
          throw new Error('You cannot delete a mood that does not belong to you');
        }
        
        // Delete the mood
        await pool.query('DELETE FROM "Moods" WHERE id = $1', [id]);
        
        // Handle streak updates if needed
        // This is simplified - a real implementation would need to recalculate streaks
        
        return true;
      } catch (error) {
        console.error('Error deleting mood:', error);
        throw new Error('Failed to delete mood: ' + error.message);
      }
    },
    
    setupMoodReminder: async (_, { input }, { user, pool }) => {
      try {
        const { time, days, isEnabled } = input;
        
        // Create new reminder
        const reminderId = uuidv4();
        const now = new Date();
        
        const result = await pool.query(
          `INSERT INTO "MoodReminders" 
           (id, "userId", time, days, "isEnabled", "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, $6, $7) 
           RETURNING *`,
          [
            reminderId, 
            user.userId, 
            time, 
            days || [0, 1, 2, 3, 4, 5, 6], 
            isEnabled !== undefined ? isEnabled : true, 
            now, 
            now
          ]
        );
        
        return result.rows[0];
      } catch (error) {
        console.error('Error setting up mood reminder:', error);
        throw new Error('Failed to set up mood reminder: ' + error.message);
      }
    },
    
    updateMoodReminder: async (_, { id, input }, { user, pool }) => {
      try {
        // Check if reminder exists and belongs to user
        const checkResult = await pool.query(
          'SELECT "userId" FROM "MoodReminders" WHERE id = $1',
          [id]
        );
        
        if (checkResult.rows.length === 0) {
          throw new Error('Reminder not found');
        }
        
        if (checkResult.rows[0].userId !== user.userId) {
          throw new Error('You cannot update a reminder that does not belong to you');
        }
        
        // Build update query
        const updates = [];
        const values = [id];
        let paramIndex = 2;
        
        if (input.time !== undefined) {
          updates.push(`time = $${paramIndex++}`);
          values.push(input.time);
        }
        
        if (input.days !== undefined) {
          updates.push(`days = $${paramIndex++}`);
          values.push(input.days);
        }
        
        if (input.isEnabled !== undefined) {
          updates.push(`"isEnabled" = $${paramIndex++}`);
          values.push(input.isEnabled);
        }
        
        updates.push(`"updatedAt" = $${paramIndex++}`);
        values.push(new Date());
        
        // Execute update
        const updateQuery = `
          UPDATE "MoodReminders" 
          SET ${updates.join(', ')} 
          WHERE id = $1 
          RETURNING *
        `;
        
        const result = await pool.query(updateQuery, values);
        
        return result.rows[0];
      } catch (error) {
        console.error('Error updating mood reminder:', error);
        throw new Error('Failed to update mood reminder: ' + error.message);
      }
    },
    
    deleteMoodReminder: async (_, { id }, { user, pool }) => {
      try {
        // Check if reminder exists and belongs to user
        const checkResult = await pool.query(
          'SELECT "userId" FROM "MoodReminders" WHERE id = $1',
          [id]
        );
        
        if (checkResult.rows.length === 0) {
          throw new Error('Reminder not found');
        }
        
        if (checkResult.rows[0].userId !== user.userId) {
          throw new Error('You cannot delete a reminder that does not belong to you');
        }
        
        // Delete the reminder
        await pool.query('DELETE FROM "MoodReminders" WHERE id = $1', [id]);
        
        return true;
      } catch (error) {
        console.error('Error deleting mood reminder:', error);
        throw new Error('Failed to delete mood reminder: ' + error.message);
      }
    },
    
    recordUserActivity: async (_, { input }, { user, pool }) => {
      try {
        const { activityType, duration, metadata } = input;
        
        // Create new activity entry
        const activityId = uuidv4();
        const now = new Date();
        
        const result = await pool.query(
          `INSERT INTO "UserActivities" 
           (id, "userId", "activityType", duration, metadata, "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, $6, $7) 
           RETURNING *`,
          [
            activityId, 
            user.userId, 
            activityType, 
            duration, 
            metadata ? JSON.stringify(metadata) : null, 
            now, 
            now
          ]
        );
        
        return result.rows[0];
      } catch (error) {
        console.error('Error recording user activity:', error);
        throw new Error('Failed to record user activity: ' + error.message);
      }
    },
    
    markInsightAsRead: async (_, { id }, { user, pool }) => {
      try {
        // Check if insight exists and belongs to user
        const checkResult = await pool.query(
          'SELECT "userId" FROM "MoodInsights" WHERE id = $1',
          [id]
        );
        
        if (checkResult.rows.length === 0) {
          throw new Error('Insight not found');
        }
        
        if (checkResult.rows[0].userId !== user.userId) {
          throw new Error('You cannot update an insight that does not belong to you');
        }
        
        // Mark as read
        await pool.query(
          `UPDATE "MoodInsights" SET "isRead" = true, "updatedAt" = $1 WHERE id = $2`,
          [new Date(), id]
        );
        
        return true;
      } catch (error) {
        console.error('Error marking insight as read:', error);
        throw new Error('Failed to mark insight as read: ' + error.message);
      }
    },
    
    shareToSocial: async (_, { input }, { user }) => {
      try {
        const { platform, contentType, contentId, text } = input;
        
        // In a real implementation, this would integrate with social media APIs
        // For now, we'll simulate successful sharing
        
        console.log(`User ${user.userId} sharing ${contentType} ${contentId} to ${platform}`);
        
        // Record the share activity
        // This would integrate with an analytics service
        
        return {
          success: true,
          message: `Successfully shared to ${platform}`,
          url: `https://example.com/shared/${contentType}/${contentId}`
        };
      } catch (error) {
        console.error('Error sharing to social platform:', error);
        throw new Error('Failed to share: ' + error.message);
      }
    }
  }
};

// Helper functions for analytics

function calculateAverageScore(moodEntries) {
  if (!moodEntries || moodEntries.length === 0) {
    return 0;
  }
  
  const scores = moodEntries.filter(m => m.score !== null).map(m => m.score);
  return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
}

function calculateMoodVariability(moodEntries) {
  if (!moodEntries || moodEntries.length < 2) {
    return 'insufficient_data';
  }
  
  const scores = moodEntries.filter(m => m.score !== null).map(m => m.score);
  if (scores.length < 2) {
    return 'insufficient_data';
  }
  
  // Calculate standard deviation
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const sqDiffs = scores.map(score => {
    const diff = score - mean;
    return diff * diff;
  });
  const variance = sqDiffs.reduce((sum, sqDiff) => sum + sqDiff, 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // Classify variability
  if (stdDev < 1) {
    return 'low';
  } else if (stdDev < 2) {
    return 'moderate';
  } else {
    return 'high';
  }
}

function calculateDominantMood(moodEntries) {
  if (!moodEntries || moodEntries.length === 0) {
    return 'neutral';
  }
  
  const moodCounts = {};
  
  moodEntries.forEach(entry => {
    moodCounts[entry.value] = (moodCounts[entry.value] || 0) + 1;
  });
  
  let dominantMood = 'neutral';
  let maxCount = 0;
  
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      dominantMood = mood;
      maxCount = count;
    }
  });
  
  return dominantMood;
}

function calculateImprovementTrend(moodEntries) {
  if (!moodEntries || moodEntries.length < 5) {
    return 'insufficient_data';
  }
  
  const scores = moodEntries
    .filter(m => m.score !== null)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(m => m.score);
  
  if (scores.length < 5) {
    return 'insufficient_data';
  }
  
  // Simple linear regression
  const n = scores.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  
  const sumX = indices.reduce((sum, x) => sum + x, 0);
  const sumY = scores.reduce((sum, y) => sum + y, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * scores[i], 0);
  const sumXX = indices.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  if (slope > 0.1) {
    return 'improving';
  } else if (slope < -0.1) {
    return 'declining';
  } else {
    return 'stable';
  }
}

function calculateMoodFrequency(moodEntries) {
  if (!moodEntries || moodEntries.length === 0) {
    return {};
  }
  
  const moodCounts = {};
  
  moodEntries.forEach(entry => {
    moodCounts[entry.value] = (moodCounts[entry.value] || 0) + 1;
  });
  
  return moodCounts;
}

function calculateMoodByDayOfWeek(moodEntries) {
  if (!moodEntries || moodEntries.length === 0) {
    return {};
  }
  
  const dayData = [
    { day: 'Sunday', scores: [], count: 0 },
    { day: 'Monday', scores: [], count: 0 },
    { day: 'Tuesday', scores: [], count: 0 },
    { day: 'Wednesday', scores: [], count: 0 },
    { day: 'Thursday', scores: [], count: 0 },
    { day: 'Friday', scores: [], count: 0 },
    { day: 'Saturday', scores: [], count: 0 }
  ];
  
  moodEntries.forEach(entry => {
    if (entry.score !== null) {
      const date = new Date(entry.createdAt);
      const dayOfWeek = date.getDay();
      
      dayData[dayOfWeek].scores.push(entry.score);
      dayData[dayOfWeek].count++;
    }
  });
  
  // Calculate averages
  dayData.forEach(day => {
    if (day.scores.length > 0) {
      day.average = day.scores.reduce((sum, score) => sum + score, 0) / day.scores.length;
    } else {
      day.average = null;
    }
  });
  
  return dayData;
}

function calculateMoodByTimeOfDay(moodEntries) {
  if (!moodEntries || moodEntries.length === 0) {
    return {};
  }
  
  const timeData = [
    { period: 'Morning (6AM-12PM)', scores: [], count: 0 },
    { period: 'Afternoon (12PM-6PM)', scores: [], count: 0 },
    { period: 'Evening (6PM-12AM)', scores: [], count: 0 },
    { period: 'Night (12AM-6AM)', scores: [], count: 0 }
  ];
  
  moodEntries.forEach(entry => {
    if (entry.score !== null) {
      const date = new Date(entry.createdAt);
      const hour = date.getHours();
      let periodIndex;
      
      if (hour >= 6 && hour < 12) {
        periodIndex = 0; // Morning
      } else if (hour >= 12 && hour < 18) {
        periodIndex = 1; // Afternoon
      } else if (hour >= 18) {
        periodIndex = 2; // Evening
      } else {
        periodIndex = 3; // Night
      }
      
      timeData[periodIndex].scores.push(entry.score);
      timeData[periodIndex].count++;
    }
  });
  
  // Calculate averages
  timeData.forEach(period => {
    if (period.scores.length > 0) {
      period.average = period.scores.reduce((sum, score) => sum + score, 0) / period.scores.length;
    } else {
      period.average = null;
    }
  });
  
  return timeData;
}

async function generateCorrelationsData(userId, moodEntries, pool) {
  if (!moodEntries || moodEntries.length < 5) {
    return null;
  }
  
  // In a real implementation, this would perform sophisticated correlation analysis
  // between mood data and various factors like sleep, weather, activities, etc.
  
  // Sample correlation data
  return {
    activities: {
      exercise: { correlation: 0.65, impact: 'positive', direction: 'upward' },
      socializing: { correlation: 0.45, impact: 'positive', direction: 'upward' },
      work: { correlation: -0.2, impact: 'slight negative', direction: 'downward' }
    },
    sleep: {
      correlation: 0.7,
      impact: 'strong positive',
      direction: 'upward'
    },
    weather: {
      correlation: 0.3,
      impact: 'moderate positive',
      direction: 'upward'
    },
    screenTime: {
      correlation: -0.4,
      impact: 'moderate negative',
      direction: 'downward'
    }
  };
}

function generateInsights(moodEntries, streak) {
  if (!moodEntries || moodEntries.length === 0) {
    return [];
  }
  
  // In a real implementation, this would generate personalized insights
  // based on mood patterns, correlations, and other factors
  
  // Sample insights
  const insights = [];
  
  if (streak && streak.currentStreak > 0) {
    insights.push({
      id: uuidv4(),
      userId: streak.userId,
      type: 'streak',
      title: `You're on a ${streak.currentStreak}-day tracking streak!`,
      description: 'Consistent tracking helps you understand your emotional patterns better.',
      data: { streakDays: streak.currentStreak },
      priority: 'medium',
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }
  
  // Add more insights based on actual data analysis
  
  return insights;
}

function generateRecommendations(moodEntries, streak) {
  if (!moodEntries || moodEntries.length === 0) {
    return [];
  }
  
  // In a real implementation, this would generate personalized recommendations
  // based on mood patterns, activities that correlate with positive moods, etc.
  
  // Sample recommendations
  const recommendations = [
    {
      type: 'activity',
      title: 'Try a 10-minute mindfulness session',
      description: 'Mindfulness can help stabilize your mood throughout the day.',
      priority: 'medium'
    },
    {
      type: 'habit',
      title: 'Track your mood at consistent times',
      description: 'Regular tracking at similar times each day improves pattern recognition.',
      priority: 'high'
    }
  ];
  
  // Add more recommendations based on actual data analysis
  
  return recommendations;
}

async function updateUserStreak(userId, pool) {
  try {
    // Get the current streak record
    const streakResult = await pool.query(
      'SELECT * FROM "MoodStreaks" WHERE "userId" = $1',
      [userId]
    );
    
    const now = new Date();
    let streak;
    
    if (streakResult.rows.length === 0) {
      // Create new streak record
      streak = {
        id: uuidv4(),
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastRecordedAt: now,
        createdAt: now,
        updatedAt: now
      };
      
      await pool.query(
        `INSERT INTO "MoodStreaks" 
         (id, "userId", "currentStreak", "longestStreak", "lastRecordedAt", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          streak.id, 
          streak.userId, 
          streak.currentStreak, 
          streak.longestStreak, 
          streak.lastRecordedAt, 
          streak.createdAt, 
          streak.updatedAt
        ]
      );
    } else {
      streak = streakResult.rows[0];
      
      // Check if this is a new day (not same calendar day as last recorded)
      const lastRecorded = streak.lastRecordedAt ? new Date(streak.lastRecordedAt) : null;
      
      if (!lastRecorded) {
        // First time recording
        streak.currentStreak = 1;
        streak.longestStreak = 1;
      } else {
        const lastRecordedDay = lastRecorded.toISOString().split('T')[0];
        const todayDay = now.toISOString().split('T')[0];
        
        if (lastRecordedDay !== todayDay) {
          // Check if it's consecutive (yesterday or the day before)
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayDay = yesterday.toISOString().split('T')[0];
          
          const twoDaysAgo = new Date(now);
          twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
          const twoDaysAgoDay = twoDaysAgo.toISOString().split('T')[0];
          
          if (lastRecordedDay === yesterdayDay) {
            // Consecutive day
            streak.currentStreak++;
            
            if (streak.currentStreak > streak.longestStreak) {
              streak.longestStreak = streak.currentStreak;
            }
          } else if (lastRecordedDay === twoDaysAgoDay) {
            // Grace period (1 day missed)
            // Some apps allow 1 missed day to maintain streak
            // This is a design choice - can be removed for stricter streak counting
            // For this implementation, we'll allow it
            streak.currentStreak++;
            
            if (streak.currentStreak > streak.longestStreak) {
              streak.longestStreak = streak.currentStreak;
            }
          } else {
            // Streak broken
            streak.currentStreak = 1;
          }
        }
        // If same day, do nothing to the streak count
      }
      
      // Update streak record
      streak.lastRecordedAt = now;
      streak.updatedAt = now;
      
      await pool.query(
        `UPDATE "MoodStreaks" 
         SET "currentStreak" = $1, "longestStreak" = $2, "lastRecordedAt" = $3, "updatedAt" = $4 
         WHERE id = $5`,
        [
          streak.currentStreak, 
          streak.longestStreak, 
          streak.lastRecordedAt, 
          streak.updatedAt, 
          streak.id
        ]
      );
    }
    
    return streak;
  } catch (error) {
    console.error('Error updating user streak:', error);
    throw error;
  }
}

async function generateMoodInsights(userId, mood, pool) {
  try {
    // In a real implementation, this would analyze the new mood entry
    // and generate personalized insights based on patterns and changes
    
    // For this example, we'll just check for simple patterns
    
    // Get recent moods to look for patterns
    const recentMoodsResult = await pool.query(
      `SELECT * FROM "Moods" 
       WHERE "userId" = $1 
       ORDER BY "createdAt" DESC 
       LIMIT 10`,
      [userId]
    );
    
    const recentMoods = recentMoodsResult.rows;
    
    // Check for consecutive identical moods
    if (recentMoods.length >= 3) {
      const lastThreeMoods = recentMoods.slice(0, 3);
      
      if (lastThreeMoods.every(m => m.value === mood.value)) {
        // User has recorded the same mood three times in a row
        
        const now = new Date();
        const insightId = uuidv4();
        
        // Create an insight
        await pool.query(
          `INSERT INTO "MoodInsights" 
           (id, "userId", type, title, description, priority, "isRead", "createdAt", "updatedAt") 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            insightId,
            userId,
            'pattern',
            `You've been feeling ${mood.value} consistently`,
            `You've recorded '${mood.value}' for three consecutive entries. This consistency might indicate a stable pattern in your emotional state.`,
            'medium',
            false,
            now,
            now
          ]
        );
      }
    }
    
    // More sophisticated insight generation would be implemented here
    
  } catch (error) {
    console.error('Error generating mood insights:', error);
    // Non-critical function, so we'll just log errors instead of throwing
  }
}

// Apply middleware to resolvers using GraphQL Tools
const resolvers = composeResolvers(baseResolvers, {
  'Query.mood': [isAuthenticated, isOwnerOrPublic],
  'Query.moods': [isAuthenticated],
  'Query.moodHistory': [isAuthenticated],
  'Query.moodStreak': [isAuthenticated],
  'Query.moodAnalytics': [isAuthenticated],
  'Query.moodInsights': [isAuthenticated],
  'Query.moodReminders': [isAuthenticated],
  'Query.userActivities': [isAuthenticated],
  'Mutation.createMood': [isAuthenticated, rateLimiter(100, 3600)],
  'Mutation.updateMood': [isAuthenticated, isOwnerOrPublic],
  'Mutation.deleteMood': [isAuthenticated, isOwnerOrPublic],
  'Mutation.setupMoodReminder': [isAuthenticated],
  'Mutation.updateMoodReminder': [isAuthenticated],
  'Mutation.deleteMoodReminder': [isAuthenticated],
  'Mutation.recordUserActivity': [isAuthenticated],
  'Mutation.markInsightAsRead': [isAuthenticated],
  'Mutation.shareToSocial': [isAuthenticated, rateLimiter(20, 3600)]
});

module.exports = resolvers;