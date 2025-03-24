const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GroupHugParticipant = sequelize.define('GroupHugParticipant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  groupHugId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'GroupHugs',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  hasJoined: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  joinedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = GroupHugParticipant;