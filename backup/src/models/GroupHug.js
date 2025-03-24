const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GroupHug = sequelize.define('GroupHug', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  creatorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  hugType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mediaId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'MediaHugs',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'completed'),
    defaultValue: 'active'
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = GroupHug;