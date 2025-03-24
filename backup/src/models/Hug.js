const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Hug = sequelize.define('Hug', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  recipientId: {
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
    type: DataTypes.ENUM('sent', 'delivered', 'read', 'responded'),
    defaultValue: 'sent'
  },
  isTherapeutic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  senderMood: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Hug;