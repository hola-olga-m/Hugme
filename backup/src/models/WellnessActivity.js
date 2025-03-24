const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * WellnessActivity model to track all user wellness activities
 * This allows us to consolidate all activity types in one place for streak tracking
 */
const WellnessActivity = sequelize.define('WellnessActivity', {
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
  activityType: {
    type: DataTypes.ENUM,
    values: ['mood_log', 'hug_sent', 'hug_received', 'meditation', 'gratitude', 'journal', 'exercise'],
    allowNull: false
  },
  relatedEntityId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID of the related entity (mood entry, hug, etc.)'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    allowNull: false,
    comment: 'Additional metadata specific to the activity type'
  },
  streakPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    comment: 'Points earned for this activity toward streak'
  }
}, {
  tableName: 'WellnessActivities',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['activityType']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['userId', 'activityType', 'createdAt']
    }
  ]
});

module.exports = WellnessActivity;