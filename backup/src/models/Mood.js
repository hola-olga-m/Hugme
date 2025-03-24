const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mood = sequelize.define('Mood', {
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
  mood: {
    type: DataTypes.STRING,
    allowNull: false
  },
  intensity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10
    }
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  activities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'createdAt']
    }
  ]
});

module.exports = Mood;