const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true // Nullable for social login users
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  currentMood: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastActive: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  premiumUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  theme: {
    type: DataTypes.STRING,
    defaultValue: 'default'
  },
  notificationSettings: {
    type: DataTypes.JSON,
    defaultValue: {
      hugs: true,
      moodUpdates: true,
      achievements: true,
      groupHugs: true,
      followRequests: true
    }
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  facebookId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  appleId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  isArtist: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  therapyModeEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Instance method to check password
User.prototype.isValidPassword = async function(password) {
  if (!this.password) return false; // For social login users without password
  return await bcrypt.compare(password, this.password);
};

module.exports = User;