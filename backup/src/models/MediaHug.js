const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MediaHug = sequelize.define('MediaHug', {
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
    allowNull: true
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mediaType: {
    type: DataTypes.ENUM('image', 'video', 'gif', 'animation'),
    allowNull: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  artistId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: true
  },
  popularity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = MediaHug;