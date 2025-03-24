const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * StreakReward model to track rewards earned from streaks
 */
const StreakReward = sequelize.define('StreakReward', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  streakMilestone: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'The streak milestone achieved (3, 7, 14, etc.)'
  },
  rewardType: {
    type: DataTypes.ENUM,
    values: ['badge', 'points', 'hugType', 'theme', 'avatarItem'],
    allowNull: false
  },
  rewardId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Identifier of the specific reward item'
  },
  rewardName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rewardDescription: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rewardValue: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'For point rewards, the points amount'
  },
  isClaimed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  claimedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Optional expiration date for time-limited rewards'
  }
}, {
  tableName: 'StreakRewards',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['streakMilestone']
    },
    {
      fields: ['rewardType']
    },
    {
      fields: ['userId', 'streakMilestone', 'rewardType', 'rewardId'],
      unique: true
    }
  ]
});

module.exports = StreakReward;