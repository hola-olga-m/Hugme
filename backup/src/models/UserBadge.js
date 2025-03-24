const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserBadge = sequelize.define('UserBadge', {
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
  badgeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Badges',
      key: 'id'
    }
  },
  isDisplayed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  earnedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = UserBadge;