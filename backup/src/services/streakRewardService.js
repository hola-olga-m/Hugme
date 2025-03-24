/**
 * Streak Reward Service
 * Manages streak rewards and streak tracking
 */
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const UserStreak = require('../models/UserStreak');
const WellnessActivity = require('../models/WellnessActivity');
const StreakReward = require('../models/StreakReward');
const User = require('../models/User');
const { calculateCurrentStreak, calculateLongestStreak, getStreakRewards, checkStreakMilestone, formatStreakMessage } = require('./streakService');

/**
 * Record a wellness activity for streak tracking
 * @param {string} userId - User ID
 * @param {string} activityType - Type of activity
 * @param {string} relatedEntityId - ID of related entity
 * @param {Object} metadata - Additional activity metadata
 * @returns {Promise<Object>} The activity and updated streak info
 */
async function recordWellnessActivity(userId, activityType, relatedEntityId = null, metadata = {}) {
  try {
    // Create the activity record
    const activity = await WellnessActivity.create({
      userId,
      activityType,
      relatedEntityId,
      metadata,
      streakPoints: getPointsForActivityType(activityType)
    });

    // Update user streak
    const streakResult = await updateUserStreak(userId);

    return {
      activity,
      streakUpdate: streakResult
    };
  } catch (error) {
    console.error('Error recording wellness activity:', error);
    throw error;
  }
}

/**
 * Get streak points for different activity types
 * @param {string} activityType - Type of activity
 * @returns {number} Points for the activity
 */
function getPointsForActivityType(activityType) {
  const pointsMap = {
    'mood_log': 1,
    'hug_sent': 1,
    'hug_received': 0.5, // Receiving is passive, so worth less points
    'meditation': 2,
    'gratitude': 1.5,
    'journal': 1.5,
    'exercise': 2
  };

  return pointsMap[activityType] || 1;
}

/**
 * Update a user's streak information
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated streak info
 */
async function updateUserStreak(userId) {
  try {
    // Get user's activities ordered by date (newest first)
    const activities = await WellnessActivity.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      raw: true
    });

    // Map database timestamps to format expected by streak calculation
    const mappedActivities = activities.map(a => ({
      ...a,
      timestamp: a.createdAt.getTime()
    }));

    // Calculate streak information
    const currentStreakInfo = calculateCurrentStreak(mappedActivities);
    const longestStreak = calculateLongestStreak(mappedActivities);

    // Find or create user streak record
    let [userStreak, created] = await UserStreak.findOrCreate({
      where: { userId },
      defaults: {
        currentStreak: currentStreakInfo.count,
        longestStreak,
        lastActivityDate: new Date(),
        lastStreakUpdateDate: new Date(),
        totalMoodEntries: countActivitiesByType(activities, 'mood_log'),
        totalHugsSent: countActivitiesByType(activities, 'hug_sent'),
        totalHugsReceived: countActivitiesByType(activities, 'hug_received'),
        streakHistory: [{
          date: new Date(),
          streak: currentStreakInfo.count
        }]
      }
    });

    if (!created) {
      // Check for streak milestones before updating
      const oldStreak = userStreak.currentStreak;
      const newStreak = currentStreakInfo.count;
      
      // Update existing streak record
      userStreak.currentStreak = newStreak;
      userStreak.longestStreak = Math.max(longestStreak, userStreak.longestStreak);
      userStreak.lastActivityDate = new Date();
      userStreak.lastStreakUpdateDate = new Date();
      userStreak.totalMoodEntries = countActivitiesByType(activities, 'mood_log');
      userStreak.totalHugsSent = countActivitiesByType(activities, 'hug_sent');
      userStreak.totalHugsReceived = countActivitiesByType(activities, 'hug_received');
      
      // Add streak history entry if streak changed
      if (oldStreak !== newStreak) {
        const streakHistory = userStreak.streakHistory || [];
        streakHistory.push({
          date: new Date(),
          streak: newStreak
        });
        userStreak.streakHistory = streakHistory;
      }
      
      await userStreak.save();
      
      // Process milestone rewards if streak increased
      if (newStreak > oldStreak) {
        const rewards = await processStreakMilestones(userId, oldStreak, newStreak);
        return {
          userStreak,
          newMilestoneReached: !!rewards,
          rewards,
          streakMessage: formatStreakMessage(currentStreakInfo)
        };
      }
    }

    return {
      userStreak,
      newMilestoneReached: false,
      rewards: null,
      streakMessage: formatStreakMessage(currentStreakInfo)
    };
  } catch (error) {
    console.error('Error updating user streak:', error);
    throw error;
  }
}

/**
 * Count activities by type
 * @param {Array} activities - Array of activities
 * @param {string} type - Activity type to count
 * @returns {number} Count of activities
 */
function countActivitiesByType(activities, type) {
  return activities.filter(a => a.activityType === type).length;
}

/**
 * Process streak milestones and award rewards
 * @param {string} userId - User ID
 * @param {number} oldStreak - Previous streak count
 * @param {number} newStreak - New streak count
 * @returns {Promise<Array|null>} Rewards or null
 */
async function processStreakMilestones(userId, oldStreak, newStreak) {
  try {
    const milestone = checkStreakMilestone(oldStreak, newStreak);
    
    if (!milestone) {
      return null;
    }
    
    // Record rewards for this milestone
    const earnedRewards = [];
    
    for (const reward of milestone) {
      const [streakReward, created] = await StreakReward.findOrCreate({
        where: {
          userId,
          streakMilestone: milestone.days,
          rewardType: reward.type,
          rewardId: reward.id
        },
        defaults: {
          rewardName: reward.name,
          rewardDescription: reward.description,
          rewardValue: reward.type === 'points' ? reward.amount : null,
          isClaimed: reward.type === 'points', // Auto-claim points
          claimedAt: reward.type === 'points' ? new Date() : null
        }
      });
      
      if (created) {
        earnedRewards.push(streakReward);
        
        // If this is a points reward, update user's points
        if (reward.type === 'points') {
          await addStreakPointsToUser(userId, reward.amount);
        }
      }
    }
    
    return earnedRewards.length > 0 ? earnedRewards : null;
  } catch (error) {
    console.error('Error processing streak milestones:', error);
    throw error;
  }
}

/**
 * Add streak points to user
 * @param {string} userId - User ID
 * @param {number} points - Points to add
 * @returns {Promise<Object>} Updated user streak
 */
async function addStreakPointsToUser(userId, points) {
  try {
    const userStreak = await UserStreak.findOne({ where: { userId } });
    
    if (userStreak) {
      userStreak.streakPoints += points;
      await userStreak.save();
    }
    
    return userStreak;
  } catch (error) {
    console.error('Error adding streak points:', error);
    throw error;
  }
}

/**
 * Get user's streak information
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Streak information
 */
async function getUserStreakInfo(userId) {
  try {
    // Get user streak record
    const userStreak = await UserStreak.findOne({
      where: { userId },
      raw: true
    });
    
    if (!userStreak) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        streakPoints: 0,
        needsActivity: true,
        message: "You haven't started a wellness streak yet. Log your mood or send a hug to begin!"
      };
    }
    
    // Get recent activities to determine if streak needs activity today
    const recentActivities = await WellnessActivity.findAll({
      where: { 
        userId,
        createdAt: {
          [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 2)) // Last 2 days
        }
      },
      order: [['createdAt', 'DESC']],
      raw: true
    });
    
    // Map to expected format
    const mappedActivities = recentActivities.map(a => ({
      ...a,
      timestamp: a.createdAt.getTime()
    }));
    
    // Calculate current streak details
    const streakDetails = calculateCurrentStreak(mappedActivities);
    
    // Get pending rewards
    const pendingRewards = await StreakReward.findAll({
      where: {
        userId,
        isClaimed: false
      },
      raw: true
    });
    
    return {
      ...userStreak,
      needsActivity: streakDetails.needsActivity,
      activeToday: streakDetails.activeToday,
      streakMessage: formatStreakMessage(streakDetails),
      pendingRewards: pendingRewards.length > 0 ? pendingRewards : null
    };
  } catch (error) {
    console.error('Error getting user streak info:', error);
    throw error;
  }
}

/**
 * Claim a streak reward
 * @param {string} userId - User ID
 * @param {string} rewardId - Reward ID
 * @returns {Promise<Object>} Result of claim operation
 */
async function claimStreakReward(userId, rewardId) {
  try {
    const reward = await StreakReward.findOne({
      where: {
        id: rewardId,
        userId,
        isClaimed: false
      }
    });
    
    if (!reward) {
      return {
        success: false,
        message: 'Reward not found or already claimed'
      };
    }
    
    // Mark as claimed
    reward.isClaimed = true;
    reward.claimedAt = new Date();
    await reward.save();
    
    return {
      success: true,
      reward
    };
  } catch (error) {
    console.error('Error claiming streak reward:', error);
    throw error;
  }
}

/**
 * Reset a user's streak (admin function)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Result of reset operation
 */
async function resetUserStreak(userId) {
  try {
    const userStreak = await UserStreak.findOne({ where: { userId } });
    
    if (!userStreak) {
      return {
        success: false,
        message: 'User streak not found'
      };
    }
    
    // Store longest streak in history before resetting
    const streakHistory = userStreak.streakHistory || [];
    streakHistory.push({
      date: new Date(),
      streak: userStreak.currentStreak,
      reset: true
    });
    
    // Reset the streak
    userStreak.currentStreak = 0;
    userStreak.lastActivityDate = null;
    userStreak.streakHistory = streakHistory;
    await userStreak.save();
    
    return {
      success: true,
      message: 'User streak reset successful'
    };
  } catch (error) {
    console.error('Error resetting user streak:', error);
    throw error;
  }
}

/**
 * Get leaderboard of top streaks
 * @param {number} limit - Number of entries to return
 * @returns {Promise<Array>} Leaderboard entries
 */
async function getStreakLeaderboard(limit = 10) {
  try {
    const leaderboard = await UserStreak.findAll({
      order: [
        ['currentStreak', 'DESC'],
        ['streakPoints', 'DESC']
      ],
      limit,
      include: [{
        model: User,
        attributes: ['username', 'id']
      }]
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error getting streak leaderboard:', error);
    throw error;
  }
}

module.exports = {
  recordWellnessActivity,
  updateUserStreak,
  getUserStreakInfo,
  claimStreakReward,
  resetUserStreak,
  getStreakLeaderboard
};