const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Badge = sequelize.define('Badge', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  requirement: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Badge;