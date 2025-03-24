const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance with connection parameters from environment variables
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for Replit's PostgreSQL
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Function to test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Function to synchronize models with database
const syncModels = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Models synchronized with database.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncModels
};