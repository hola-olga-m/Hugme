const express = require('express');
const router = express.Router();
const { authMiddleware, isPremium } = require('../middleware/auth');
const User = require('../models/User');
const Mood = require('../models/Mood');
const Hug = require('../models/Hug');
const GroupHug = require('../models/GroupHug');
const GroupHugParticipant = require('../models/GroupHugParticipant');
const Follow = require('../models/Follow');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const { Sequelize, Op } = require('sequelize');

// All routes here require authentication
router.use(authMiddleware);

// Get current user's profile
router.get('/user/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { 
          model: Badge,
          as: 'badges',
          through: { attributes: [] } // Don't include junction table
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

// Update user profile
router.put('/user/profile', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, name, bio, profileImage, theme, notificationSettings, isPrivate } = req.body;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user fields
    await user.update({
      username: username || user.username,
      name: name || user.name,
      bio: bio !== undefined ? bio : user.bio,
      profileImage: profileImage || user.profileImage,
      theme: theme || user.theme,
      notificationSettings: notificationSettings || user.notificationSettings,
      isPrivate: isPrivate !== undefined ? isPrivate : user.isPrivate
    });
    
    const userData = { ...user.toJSON() };
    delete userData.password;
    
    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile'
    });
  }
});

// Create a new mood entry
router.post('/mood', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mood, intensity = 5, note = '', isPublic = false } = req.body;
    
    // Validate mood input
    if (!mood) {
      return res.status(400).json({
        success: false,
        message: 'Mood is required'
      });
    }
    
    // Create new mood entry
    const moodEntry = await Mood.create({
      userId,
      mood,
      intensity,
      note,
      isPublic
    });
    
    // Update user's current mood
    await User.update(
      { currentMood: mood },
      { where: { id: userId } }
    );
    
    // TODO: Check for mood-related badges here
    
    res.status(201).json({
      success: true,
      mood: moodEntry
    });
  } catch (error) {
    console.error('Create mood error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating mood entry'
    });
  }
});

// Get user's mood history
router.get('/mood/history', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 30, offset = 0 } = req.query;
    
    const moodHistory = await Mood.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const totalCount = await Mood.count({
      where: { userId }
    });
    
    res.json({
      success: true,
      moods: moodHistory,
      pagination: {
        total: totalCount,
        offset: parseInt(offset),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get mood history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mood history'
    });
  }
});

// Get mood analytics
router.get('/mood/analytics', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { timeRange = 30 } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));
    
    // Get moods in date range
    const moodEntries = await Mood.findAll({
      where: {
        userId,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['createdAt', 'ASC']]
    });
    
    // Process mood data for analytics
    const moodFrequency = {};
    const moodByDayOfWeek = {
      'Sunday': { count: 0, sum: 0 },
      'Monday': { count: 0, sum: 0 },
      'Tuesday': { count: 0, sum: 0 },
      'Wednesday': { count: 0, sum: 0 },
      'Thursday': { count: 0, sum: 0 },
      'Friday': { count: 0, sum: 0 },
      'Saturday': { count: 0, sum: 0 }
    };
    
    const moodByTimeOfDay = {
      'Morning': { count: 0, sum: 0 },
      'Afternoon': { count: 0, sum: 0 },
      'Evening': { count: 0, sum: 0 },
      'Night': { count: 0, sum: 0 }
    };
    
    const moodTrend = [];
    
    moodEntries.forEach(entry => {
      // Count frequencies
      if (!moodFrequency[entry.mood]) {
        moodFrequency[entry.mood] = 0;
      }
      moodFrequency[entry.mood]++;
      
      // Day of week analysis
      const date = new Date(entry.createdAt);
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
      moodByDayOfWeek[dayOfWeek].count++;
      moodByDayOfWeek[dayOfWeek].sum += entry.intensity;
      
      // Time of day analysis
      const hour = date.getHours();
      let timeOfDay;
      if (hour >= 5 && hour < 12) timeOfDay = 'Morning';
      else if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
      else if (hour >= 17 && hour < 21) timeOfDay = 'Evening';
      else timeOfDay = 'Night';
      
      moodByTimeOfDay[timeOfDay].count++;
      moodByTimeOfDay[timeOfDay].sum += entry.intensity;
      
      // Track trend over time
      moodTrend.push({
        date: date.toISOString().split('T')[0],
        mood: entry.mood,
        intensity: entry.intensity
      });
    });
    
    // Calculate averages
    for (const day in moodByDayOfWeek) {
      if (moodByDayOfWeek[day].count > 0) {
        moodByDayOfWeek[day].average = moodByDayOfWeek[day].sum / moodByDayOfWeek[day].count;
      } else {
        moodByDayOfWeek[day].average = 0;
      }
    }
    
    for (const time in moodByTimeOfDay) {
      if (moodByTimeOfDay[time].count > 0) {
        moodByTimeOfDay[time].average = moodByTimeOfDay[time].sum / moodByTimeOfDay[time].count;
      } else {
        moodByTimeOfDay[time].average = 0;
      }
    }
    
    // Find most common mood
    let mostCommonMood = '';
    let maxCount = 0;
    for (const mood in moodFrequency) {
      if (moodFrequency[mood] > maxCount) {
        maxCount = moodFrequency[mood];
        mostCommonMood = mood;
      }
    }
    
    // Calculate mood variability
    let moodVariability = 'low';
    const uniqueMoods = Object.keys(moodFrequency).length;
    if (uniqueMoods >= 5) {
      moodVariability = 'high';
    } else if (uniqueMoods >= 3) {
      moodVariability = 'moderate';
    }
    
    // Generate insights
    const insights = [];
    
    // Most common mood insight
    if (mostCommonMood) {
      insights.push({
        type: 'common_mood',
        title: `Your most common mood is "${mostCommonMood}"`,
        description: `You've logged "${mostCommonMood}" ${moodFrequency[mostCommonMood]} times in the last ${timeRange} days.`
      });
    }
    
    // Best day insight
    let bestDay = '';
    let bestDayAvg = 0;
    for (const day in moodByDayOfWeek) {
      if (moodByDayOfWeek[day].count > 0 && moodByDayOfWeek[day].average > bestDayAvg) {
        bestDayAvg = moodByDayOfWeek[day].average;
        bestDay = day;
      }
    }
    
    if (bestDay) {
      insights.push({
        type: 'best_day',
        title: `${bestDay} is your best day`,
        description: `You tend to feel better on ${bestDay}s with an average mood rating of ${bestDayAvg.toFixed(1)}/10.`
      });
    }
    
    // Best time insight
    let bestTime = '';
    let bestTimeAvg = 0;
    for (const time in moodByTimeOfDay) {
      if (moodByTimeOfDay[time].count > 0 && moodByTimeOfDay[time].average > bestTimeAvg) {
        bestTimeAvg = moodByTimeOfDay[time].average;
        bestTime = time;
      }
    }
    
    if (bestTime) {
      insights.push({
        type: 'best_time',
        title: `${bestTime} is your best time of day`,
        description: `You tend to feel better during the ${bestTime.toLowerCase()} with an average mood rating of ${bestTimeAvg.toFixed(1)}/10.`
      });
    }
    
    // Variability insight
    insights.push({
      type: 'variability',
      title: `Your mood variability is ${moodVariability}`,
      description: moodVariability === 'high' 
        ? 'Your moods vary significantly day to day.' 
        : moodVariability === 'moderate'
          ? 'Your moods show moderate variation.'
          : 'Your moods are relatively stable.'
    });
    
    res.json({
      success: true,
      analytics: {
        summary: {
          totalEntries: moodEntries.length,
          mostCommonMood,
          moodVariability
        },
        moodFrequency,
        moodByDayOfWeek,
        moodByTimeOfDay,
        moodTrend,
        insights
      }
    });
  } catch (error) {
    console.error('Get mood analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating mood analytics'
    });
  }
});

// Send a hug to another user
router.post('/hug/send', async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { recipientId, hugType, message = null } = req.body;
    
    // Validate input
    if (!recipientId || !hugType) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and hug type are required'
      });
    }
    
    // Check if recipient exists
    const recipient = await User.findByPk(recipientId);
    
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }
    
    // Create new hug
    const hug = await Hug.create({
      senderId,
      recipientId,
      hugType,
      message,
      viewed: false
    });
    
    // TODO: Emit a WebSocket event to notify the recipient if they're online
    // TODO: Check for hug-related badges
    
    res.status(201).json({
      success: true,
      hug
    });
  } catch (error) {
    console.error('Send hug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending hug'
    });
  }
});

// Get hugs sent to the current user
router.get('/hug/received', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 20, offset = 0 } = req.query;
    
    const hugs = await Hug.findAll({
      where: { recipientId: userId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'name', 'profileImage']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const totalCount = await Hug.count({
      where: { recipientId: userId }
    });
    
    res.json({
      success: true,
      hugs,
      pagination: {
        total: totalCount,
        offset: parseInt(offset),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get received hugs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching received hugs'
    });
  }
});

// Get hugs sent by the current user
router.get('/hug/sent', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 20, offset = 0 } = req.query;
    
    const hugs = await Hug.findAll({
      where: { senderId: userId },
      include: [
        {
          model: User,
          as: 'recipient',
          attributes: ['id', 'username', 'name', 'profileImage']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const totalCount = await Hug.count({
      where: { senderId: userId }
    });
    
    res.json({
      success: true,
      hugs,
      pagination: {
        total: totalCount,
        offset: parseInt(offset),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get sent hugs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sent hugs'
    });
  }
});

// Create a group hug
router.post('/hug/group', async (req, res) => {
  try {
    const creatorId = req.user.userId;
    const { name, participantIds, hugType, message = null } = req.body;
    
    // Validate input
    if (!name || !participantIds || !Array.isArray(participantIds) || !hugType) {
      return res.status(400).json({
        success: false,
        message: 'Name, participant IDs array, and hug type are required'
      });
    }
    
    // Create group hug
    const groupHug = await GroupHug.create({
      creatorId,
      name,
      hugType,
      message,
      status: 'active'
    });
    
    // Add participants
    const participants = [creatorId, ...participantIds];
    const participantPromises = participants.map(userId => 
      GroupHugParticipant.create({
        groupHugId: groupHug.id,
        userId,
        status: userId === creatorId ? 'joined' : 'invited',
        joinedAt: userId === creatorId ? new Date() : null
      })
    );
    
    await Promise.all(participantPromises);
    
    // Fetch the complete group hug with participants
    const completeGroupHug = await GroupHug.findByPk(groupHug.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'name', 'profileImage']
        },
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'username', 'name', 'profileImage'],
          through: { attributes: ['status', 'joinedAt'] }
        }
      ]
    });
    
    // TODO: Emit WebSocket events to notify participants
    
    res.status(201).json({
      success: true,
      groupHug: completeGroupHug
    });
  } catch (error) {
    console.error('Create group hug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating group hug'
    });
  }
});

// Get group hugs for the current user
router.get('/hug/group', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const groupHugs = await GroupHug.findAll({
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'name', 'profileImage']
        },
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'username', 'name', 'profileImage'],
          through: { attributes: ['status', 'joinedAt'] }
        },
        {
          model: GroupHugParticipant,
          as: 'memberStatus',
          where: { userId },
          attributes: ['status', 'joinedAt']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      groupHugs
    });
  } catch (error) {
    console.error('Get group hugs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching group hugs'
    });
  }
});

// Join a group hug
router.post('/hug/group/:id/join', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    // Find the group hug
    const groupHug = await GroupHug.findByPk(id);
    
    if (!groupHug) {
      return res.status(404).json({
        success: false,
        message: 'Group hug not found'
      });
    }
    
    // Check if user is already a participant
    const participant = await GroupHugParticipant.findOne({
      where: {
        groupHugId: id,
        userId
      }
    });
    
    if (!participant) {
      return res.status(403).json({
        success: false,
        message: 'You are not invited to this group hug'
      });
    }
    
    if (participant.status === 'joined') {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this group hug'
      });
    }
    
    // Update participant status
    await participant.update({
      status: 'joined',
      joinedAt: new Date()
    });
    
    // TODO: Emit WebSocket event to notify other participants
    
    res.json({
      success: true,
      message: 'Successfully joined the group hug'
    });
  } catch (error) {
    console.error('Join group hug error:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining group hug'
    });
  }
});

// Follow a user
router.post('/user/follow/:id', async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.id;
    
    // Check if target user exists
    const targetUser = await User.findByPk(followingId);
    
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if already following
    const existingFollow = await Follow.findOne({
      where: {
        followerId,
        followingId
      }
    });
    
    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user'
      });
    }
    
    // Create follow relationship
    await Follow.create({
      followerId,
      followingId
    });
    
    // TODO: Emit WebSocket event to notify followed user
    
    res.status(201).json({
      success: true,
      message: `You are now following ${targetUser.username}`
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error following user'
    });
  }
});

// Unfollow a user
router.delete('/user/follow/:id', async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.id;
    
    // Delete follow relationship
    const deleted = await Follow.destroy({
      where: {
        followerId,
        followingId
      }
    });
    
    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: 'You are not following this user'
      });
    }
    
    res.json({
      success: true,
      message: 'Successfully unfollowed user'
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unfollowing user'
    });
  }
});

// Get followers
router.get('/user/followers', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const followers = await Follow.findAll({
      where: { followingId: userId },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: ['id', 'username', 'name', 'profileImage', 'currentMood', 'isOnline']
        }
      ]
    });
    
    res.json({
      success: true,
      followers: followers.map(f => f.follower)
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching followers'
    });
  }
});

// Get users the current user is following
router.get('/user/following', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const following = await Follow.findAll({
      where: { followerId: userId },
      include: [
        {
          model: User,
          as: 'following',
          attributes: ['id', 'username', 'name', 'profileImage', 'currentMood', 'isOnline']
        }
      ]
    });
    
    res.json({
      success: true,
      following: following.map(f => f.following)
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching following'
    });
  }
});

// Get mood feed from followed users
router.get('/mood/feed', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 20, offset = 0 } = req.query;
    
    // Get IDs of users being followed
    const following = await Follow.findAll({
      where: { followerId: userId },
      attributes: ['followingId']
    });
    
    const followingIds = following.map(f => f.followingId);
    
    // Get mood entries from followed users
    const moodFeed = await Mood.findAll({
      where: {
        userId: { [Op.in]: followingIds },
        isPublic: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'name', 'profileImage']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const totalCount = await Mood.count({
      where: {
        userId: { [Op.in]: followingIds },
        isPublic: true
      }
    });
    
    res.json({
      success: true,
      feed: moodFeed,
      pagination: {
        total: totalCount,
        offset: parseInt(offset),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get mood feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mood feed'
    });
  }
});

// Get user's badges
router.get('/user/badges', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const badges = await UserBadge.findAll({
      where: { userId },
      include: [
        {
          model: Badge,
          as: 'badge'
        }
      ]
    });
    
    res.json({
      success: true,
      badges: badges.map(ub => ({
        ...ub.badge.toJSON(),
        awardedAt: ub.createdAt
      }))
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching badges'
    });
  }
});

// Search for users
router.get('/user/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }
    
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { name: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'username', 'name', 'profileImage', 'isOnline', 'currentMood'],
      limit: 20
    });
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching users'
    });
  }
});

// -- Premium Features --

// Advanced analytics (Premium only)
router.get('/mood/analytics/advanced', isPremium, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // TODO: Implement advanced analytics
    // This would include more detailed analysis, correlations, etc.
    
    res.json({
      success: true,
      message: 'Advanced analytics feature coming soon'
    });
  } catch (error) {
    console.error('Advanced analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating advanced analytics'
    });
  }
});

module.exports = router;