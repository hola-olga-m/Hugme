const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * UserStreak model to track user wellness streaks
 */
const UserStreak = sequelize.define('UserStreak', {
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
  currentStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  longestStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  lastActivityDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastStreakUpdateDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalMoodEntries: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  totalHugsSent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  totalHugsReceived: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  streakHistory: {
    type: DataTypes.JSONB,
    defaultValue: [],
    allowNull: false
  },
  streakMilestones: {
    type: DataTypes.JSONB,
    defaultValue: [],
    allowNull: false
  },
  streakPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  tableName: 'UserStreaks',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId']
    }
  ]
});

module.exports = UserStreak;