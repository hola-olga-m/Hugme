const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HugRequest = sequelize.define('HugRequest', {
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
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'FULFILLED', 'EXPIRED'),
    defaultValue: 'PENDING'
  }
}, {
  timestamps: true
});

module.exports = HugRequest;