const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Initialize Express
const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 4001;

// Middleware
app.use(cors());
app.use(express.json());

// Create HTTP server
const httpServer = http.createServer(app);

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to database at:', res.rows[0].now);
  }
});

// Initialize database tables
async function initDb() {
  try {
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Users" (
        "id" VARCHAR(255) PRIMARY KEY,
        "email" VARCHAR(255) UNIQUE,
        "username" VARCHAR(255) UNIQUE,
        "password" VARCHAR(255),
        "name" VARCHAR(255),
        "isVerified" BOOLEAN DEFAULT false,
        "isAnonymous" BOOLEAN DEFAULT false,
        "lastLoginAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create RefreshTokens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "RefreshTokens" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "token" VARCHAR(255) NOT NULL,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    // Create SocialAuths table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "SocialAuths" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "provider" VARCHAR(50) NOT NULL,
        "providerId" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255),
        "name" VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        UNIQUE("provider", "providerId")
      )
    `);
    
    // Create VerificationTokens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "VerificationTokens" (
        "id" VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255) NOT NULL,
        "token" VARCHAR(255) NOT NULL,
        "type" VARCHAR(50) NOT NULL,
        "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}

// Type definitions
const typeDefs = gql`
  type Query {
    me: User
    userById(id: ID!): User
    userByEmail(email: String!): User
    userByUsername(username: String!): User
    verifyToken(token: String!): TokenVerification
  }

  type Mutation {
    register(input: RegisterInput!): AuthResponse
    login(input: LoginInput!): AuthResponse
    refreshToken(token: String!): AuthResponse
    logout: Boolean
    resetPassword(input: ResetPasswordInput!): Boolean
    changePassword(input: ChangePasswordInput!): Boolean
    requestResetPassword(email: String!): Boolean
    verifyEmail(token: String!): Boolean
    anonymousLogin(nickname: String, avatarId: Int): AuthResponse
    convertAnonymousUser(input: ConvertAnonymousInput!): AuthResponse
    socialLogin(provider: String!, code: String!, redirectUri: String): AuthResponse
    socialAuthUrl(provider: String!, redirectUri: String!): String
  }

  type User {
    id: ID!
    email: String
    username: String!
    name: String
    isVerified: Boolean!
    isAnonymous: Boolean!
    lastLoginAt: String
    createdAt: String!
    updatedAt: String!
  }

  type AuthResponse {
    token: String!
    refreshToken: String!
    user: User!
  }

  type TokenVerification {
    valid: Boolean!
    userId: ID
    error: String
  }

  input RegisterInput {
    email: String!
    username: String!
    password: String!
    name: String
  }

  input LoginInput {
    emailOrUsername: String!
    password: String!
  }

  input ResetPasswordInput {
    token: String!
    newPassword: String!
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input ConvertAnonymousInput {
    email: String!
    username: String!
    password: String!
    name: String
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) {
        return null;
      }
      
      try {
        const userResult = await pool.query(
          'SELECT * FROM "Users" WHERE id = $1',
          [user.userId]
        );
        
        if (userResult.rows.length === 0) {
          return null;
        }
        
        return userResult.rows[0];
      } catch (error) {
        console.error('Error fetching current user:', error);
        throw new Error('Failed to fetch current user');
      }
    },
    
    userById: async (_, { id }, { user }) => {
      // Check for admin rights in a real app
      try {
        const userResult = await pool.query(
          'SELECT * FROM "Users" WHERE id = $1',
          [id]
        );
        
        if (userResult.rows.length === 0) {
          return null;
        }
        
        return userResult.rows[0];
      } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw new Error('Failed to fetch user by ID');
      }
    },
    
    userByEmail: async (_, { email }, { user }) => {
      // Check for admin rights in a real app
      try {
        const userResult = await pool.query(
          'SELECT * FROM "Users" WHERE email = $1',
          [email]
        );
        
        if (userResult.rows.length === 0) {
          return null;
        }
        
        return userResult.rows[0];
      } catch (error) {
        console.error('Error fetching user by email:', error);
        throw new Error('Failed to fetch user by email');
      }
    },
    
    userByUsername: async (_, { username }, { user }) => {
      // Check for admin rights in a real app
      try {
        const userResult = await pool.query(
          'SELECT * FROM "Users" WHERE username = $1',
          [username]
        );
        
        if (userResult.rows.length === 0) {
          return null;
        }
        
        return userResult.rows[0];
      } catch (error) {
        console.error('Error fetching user by username:', error);
        throw new Error('Failed to fetch user by username');
      }
    },
    
    verifyToken: async (_, { token }) => {
      try {
        const decoded = jwt.verify(
          token, 
          process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production'
        );
        
        return {
          valid: true,
          userId: decoded.userId,
          error: null
        };
      } catch (error) {
        return {
          valid: false,
          userId: null,
          error: error.message
        };
      }
    }
  },
  
  Mutation: {
    register: async (_, { input }) => {
      const { email, username, password, name } = input;
      
      try {
        // Check if email already exists
        const emailCheck = await pool.query(
          'SELECT * FROM "Users" WHERE email = $1',
          [email]
        );
        
        if (emailCheck.rows.length > 0) {
          throw new Error('Email already in use');
        }
        
        // Check if username already exists
        const usernameCheck = await pool.query(
          'SELECT * FROM "Users" WHERE username = $1',
          [username]
        );
        
        if (usernameCheck.rows.length > 0) {
          throw new Error('Username already in use');
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const userId = uuidv4();
        const now = new Date();
        
        const userResult = await pool.query(
          `INSERT INTO "Users" 
           (id, email, username, password, name, isVerified, isAnonymous, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
           RETURNING *`,
          [userId, email, username, hashedPassword, name || username, false, false, now, now]
        );
        
        const user = userResult.rows[0];
        
        // Create verification token
        const verificationToken = uuidv4();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24); // 24 hour expiry
        
        await pool.query(
          `INSERT INTO "VerificationTokens" 
           (id, userId, token, type, expiresAt, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [uuidv4(), userId, verificationToken, 'email_verification', expiryDate, now, now]
        );
        
        // In a real app, send verification email here
        
        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        
        // Store refresh token
        await storeRefreshToken(userId, refreshToken);
        
        return {
          token,
          refreshToken,
          user
        };
      } catch (error) {
        console.error('Error registering user:', error);
        throw new Error(error.message || 'Failed to register user');
      }
    },
    
    login: async (_, { input }) => {
      const { emailOrUsername, password } = input;
      
      try {
        // Find user by email or username
        const userResult = await pool.query(
          'SELECT * FROM "Users" WHERE email = $1 OR username = $1',
          [emailOrUsername]
        );
        
        if (userResult.rows.length === 0) {
          throw new Error('Invalid credentials');
        }
        
        const user = userResult.rows[0];
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }
        
        // Update last login
        const now = new Date();
        
        await pool.query(
          'UPDATE "Users" SET "lastLoginAt" = $1, "updatedAt" = $2 WHERE id = $3',
          [now, now, user.id]
        );
        
        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        
        // Store refresh token
        await storeRefreshToken(user.id, refreshToken);
        
        return {
          token,
          refreshToken,
          user
        };
      } catch (error) {
        console.error('Error logging in:', error);
        throw new Error(error.message || 'Failed to login');
      }
    },
    
    refreshToken: async (_, { token }) => {
      try {
        // Verify refresh token
        const refreshTokenResult = await pool.query(
          'SELECT * FROM "RefreshTokens" WHERE token = $1 AND "expiresAt" > NOW()',
          [token]
        );
        
        if (refreshTokenResult.rows.length === 0) {
          throw new Error('Invalid or expired refresh token');
        }
        
        const refreshTokenData = refreshTokenResult.rows[0];
        
        // Get user
        const userResult = await pool.query(
          'SELECT * FROM "Users" WHERE id = $1',
          [refreshTokenData.userId]
        );
        
        if (userResult.rows.length === 0) {
          throw new Error('User not found');
        }
        
        const user = userResult.rows[0];
        
        // Generate new tokens
        const newToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);
        
        // Delete old refresh token
        await pool.query(
          'DELETE FROM "RefreshTokens" WHERE id = $1',
          [refreshTokenData.id]
        );
        
        // Store new refresh token
        await storeRefreshToken(user.id, newRefreshToken);
        
        return {
          token: newToken,
          refreshToken: newRefreshToken,
          user
        };
      } catch (error) {
        console.error('Error refreshing token:', error);
        throw new Error(error.message || 'Failed to refresh token');
      }
    },
    
    logout: async (_, __, { user, token }) => {
      if (!user) {
        return true; // Already logged out
      }
      
      try {
        // Delete refresh tokens for this user
        await pool.query(
          'DELETE FROM "RefreshTokens" WHERE "userId" = $1',
          [user.userId]
        );
        
        return true;
      } catch (error) {
        console.error('Error logging out:', error);
        throw new Error('Failed to logout');
      }
    },
    
    resetPassword: async (_, { input }) => {
      const { token, newPassword } = input;
      
      try {
        // Verify token
        const tokenResult = await pool.query(
          'SELECT * FROM "VerificationTokens" WHERE token = $1 AND type = $2 AND "expiresAt" > NOW()',
          [token, 'password_reset']
        );
        
        if (tokenResult.rows.length === 0) {
          throw new Error('Invalid or expired token');
        }
        
        const tokenData = tokenResult.rows[0];
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        await pool.query(
          'UPDATE "Users" SET password = $1, "updatedAt" = $2 WHERE id = $3',
          [hashedPassword, new Date(), tokenData.userId]
        );
        
        // Delete token
        await pool.query(
          'DELETE FROM "VerificationTokens" WHERE id = $1',
          [tokenData.id]
        );
        
        return true;
      } catch (error) {
        console.error('Error resetting password:', error);
        throw new Error(error.message || 'Failed to reset password');
      }
    },
    
    changePassword: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      const { currentPassword, newPassword } = input;
      
      try {
        // Get user
        const userResult = await pool.query(
          'SELECT * FROM "Users" WHERE id = $1',
          [user.userId]
        );
        
        if (userResult.rows.length === 0) {
          throw new Error('User not found');
        }
        
        const userData = userResult.rows[0];
        
        // Check current password
        const isPasswordValid = await bcrypt.compare(currentPassword, userData.password);
        
        if (!isPasswordValid) {
          throw new Error('Current password is incorrect');
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        await pool.query(
          'UPDATE "Users" SET password = $1, "updatedAt" = $2 WHERE id = $3',
          [hashedPassword, new Date(), user.userId]
        );
        
        return true;
      } catch (error) {
        console.error('Error changing password:', error);
        throw new Error(error.message || 'Failed to change password');
      }
    },
    
    requestResetPassword: async (_, { email }) => {
      try {
        // Find user by email
        const userResult = await pool.query(
          'SELECT * FROM "Users" WHERE email = $1',
          [email]
        );
        
        if (userResult.rows.length === 0) {
          // Don't reveal that the email doesn't exist
          return true;
        }
        
        const user = userResult.rows[0];
        
        // Generate reset token
        const resetToken = uuidv4();
        const now = new Date();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour expiry
        
        // Delete any existing reset tokens for this user
        await pool.query(
          'DELETE FROM "VerificationTokens" WHERE "userId" = $1 AND type = $2',
          [user.id, 'password_reset']
        );
        
        // Create new reset token
        await pool.query(
          `INSERT INTO "VerificationTokens" 
           (id, userId, token, type, expiresAt, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [uuidv4(), user.id, resetToken, 'password_reset', expiryDate, now, now]
        );
        
        // In a real app, send reset email here
        console.log(`Password reset link: /reset-password?token=${resetToken}`);
        
        return true;
      } catch (error) {
        console.error('Error requesting password reset:', error);
        throw new Error('Failed to request password reset');
      }
    },
    
    verifyEmail: async (_, { token }) => {
      try {
        // Verify token
        const tokenResult = await pool.query(
          'SELECT * FROM "VerificationTokens" WHERE token = $1 AND type = $2 AND "expiresAt" > NOW()',
          [token, 'email_verification']
        );
        
        if (tokenResult.rows.length === 0) {
          throw new Error('Invalid or expired token');
        }
        
        const tokenData = tokenResult.rows[0];
        
        // Update user
        await pool.query(
          'UPDATE "Users" SET "isVerified" = true, "updatedAt" = $1 WHERE id = $2',
          [new Date(), tokenData.userId]
        );
        
        // Delete token
        await pool.query(
          'DELETE FROM "VerificationTokens" WHERE id = $1',
          [tokenData.id]
        );
        
        return true;
      } catch (error) {
        console.error('Error verifying email:', error);
        throw new Error(error.message || 'Failed to verify email');
      }
    },
    
    anonymousLogin: async (_, { nickname, avatarId }) => {
      try {
        // Generate random username
        const randomId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        const username = `guest${randomId}`;
        const displayName = nickname || `Guest ${randomId}`;
        
        // Create anonymous user
        const userId = uuidv4();
        const now = new Date();
        
        const userResult = await pool.query(
          `INSERT INTO "Users" 
           (id, username, name, isVerified, isAnonymous, lastLoginAt, createdAt, updatedAt) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
           RETURNING *`,
          [userId, username, displayName, true, true, now, now, now]
        );
        
        const user = userResult.rows[0];
        
        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        
        // Store refresh token
        await storeRefreshToken(userId, refreshToken);
        
        return {
          token,
          refreshToken,
          user
        };
      } catch (error) {
        console.error('Error creating anonymous user:', error);
        throw new Error('Failed to create anonymous user');
      }
    },
    
    convertAnonymousUser: async (_, { input }, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      
      const { email, username, password, name } = input;
      
      try {
        // Check if user is anonymous
        const userResult = await pool.query(
          'SELECT * FROM "Users" WHERE id = $1',
          [user.userId]
        );
        
        if (userResult.rows.length === 0) {
          throw new Error('User not found');
        }
        
        const userData = userResult.rows[0];
        
        if (!userData.isAnonymous) {
          throw new Error('User is not anonymous');
        }
        
        // Check if email already exists
        if (email) {
          const emailCheck = await pool.query(
            'SELECT * FROM "Users" WHERE email = $1 AND id != $2',
            [email, user.userId]
          );
          
          if (emailCheck.rows.length > 0) {
            throw new Error('Email already in use');
          }
        }
        
        // Check if username already exists
        const usernameCheck = await pool.query(
          'SELECT * FROM "Users" WHERE username = $1 AND id != $2',
          [username, user.userId]
        );
        
        if (usernameCheck.rows.length > 0) {
          throw new Error('Username already in use');
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Update user
        const updatedUserResult = await pool.query(
          `UPDATE "Users" 
           SET email = $1, username = $2, password = $3, name = $4, 
               "isAnonymous" = false, "updatedAt" = $5 
           WHERE id = $6 
           RETURNING *`,
          [email, username, hashedPassword, name || username, new Date(), user.userId]
        );
        
        const updatedUser = updatedUserResult.rows[0];
        
        // Generate tokens
        const token = generateToken(updatedUser);
        const refreshToken = generateRefreshToken(updatedUser);
        
        // Invalidate old tokens
        await pool.query(
          'DELETE FROM "RefreshTokens" WHERE "userId" = $1',
          [user.userId]
        );
        
        // Store refresh token
        await storeRefreshToken(user.userId, refreshToken);
        
        return {
          token,
          refreshToken,
          user: updatedUser
        };
      } catch (error) {
        console.error('Error converting anonymous user:', error);
        throw new Error(error.message || 'Failed to convert anonymous user');
      }
    },
    
    socialLogin: async (_, { provider, code, redirectUri }) => {
      try {
        let profile;
        
        // Get profile from OAuth provider
        switch (provider.toLowerCase()) {
          case 'google':
            // In a real app, exchange code for tokens and fetch user profile
            profile = { id: `google_${uuidv4().slice(0, 8)}`, email: 'user@example.com', name: 'Google User' };
            break;
            
          case 'facebook':
            // In a real app, exchange code for tokens and fetch user profile
            profile = { id: `fb_${uuidv4().slice(0, 8)}`, email: 'user@example.com', name: 'Facebook User' };
            break;
            
          case 'apple':
            // In a real app, verify Apple identity token
            profile = { id: `apple_${uuidv4().slice(0, 8)}`, email: 'user@example.com', name: 'Apple User' };
            break;
            
          default:
            throw new Error(`Unsupported provider: ${provider}`);
        }
        
        // Check if social auth already exists
        const socialResult = await pool.query(
          'SELECT * FROM "SocialAuths" WHERE provider = $1 AND "providerId" = $2',
          [provider.toLowerCase(), profile.id]
        );
        
        let userId;
        
        if (socialResult.rows.length > 0) {
          // Social auth exists, get associated user
          userId = socialResult.rows[0].userId;
        } else {
          // Social auth doesn't exist
          
          // Check if user with this email already exists
          let existingUser = null;
          
          if (profile.email) {
            const emailResult = await pool.query(
              'SELECT * FROM "Users" WHERE email = $1',
              [profile.email]
            );
            
            if (emailResult.rows.length > 0) {
              existingUser = emailResult.rows[0];
            }
          }
          
          if (existingUser) {
            // Link social auth to existing user
            userId = existingUser.id;
            
            // Create social auth
            const now = new Date();
            
            await pool.query(
              `INSERT INTO "SocialAuths" 
               (id, userId, provider, providerId, email, name, createdAt, updatedAt) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                uuidv4(),
                userId,
                provider.toLowerCase(),
                profile.id,
                profile.email,
                profile.name,
                now,
                now
              ]
            );
          } else {
            // Create new user
            userId = uuidv4();
            const now = new Date();
            
            // Generate unique username
            const baseUsername = profile.name?.split(' ')[0].toLowerCase() || 'user';
            const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const username = `${baseUsername}_${randomSuffix}`;
            
            // Create user
            await pool.query(
              `INSERT INTO "Users" 
               (id, email, username, name, isVerified, isAnonymous, lastLoginAt, createdAt, updatedAt) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
              [
                userId,
                profile.email,
                username,
                profile.name,
                true, // email is verified from social provider
                false,
                now,
                now,
                now
              ]
            );
            
            // Create social auth
            await pool.query(
              `INSERT INTO "SocialAuths" 
               (id, userId, provider, providerId, email, name, createdAt, updatedAt) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                uuidv4(),
                userId,
                provider.toLowerCase(),
                profile.id,
                profile.email,
                profile.name,
                now,
                now
              ]
            );
          }
        }
        
        // Get user data
        const userResult = await pool.query(
          'SELECT * FROM "Users" WHERE id = $1',
          [userId]
        );
        
        if (userResult.rows.length === 0) {
          throw new Error('User not found');
        }
        
        const user = userResult.rows[0];
        
        // Update last login
        await pool.query(
          'UPDATE "Users" SET "lastLoginAt" = $1, "updatedAt" = $2 WHERE id = $3',
          [new Date(), new Date(), userId]
        );
        
        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        
        // Store refresh token
        await storeRefreshToken(userId, refreshToken);
        
        return {
          token,
          refreshToken,
          user
        };
      } catch (error) {
        console.error('Error with social login:', error);
        throw new Error(error.message || 'Failed to authenticate with social provider');
      }
    },
    
    socialAuthUrl: async (_, { provider, redirectUri }) => {
      try {
        // Generate OAuth authorization URL
        // In a real app, this would use proper OAuth libraries
        
        let authUrl;
        
        switch (provider.toLowerCase()) {
          case 'google':
            authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID || 'dummy_id'}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile`;
            break;
            
          case 'facebook':
            authUrl = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID || 'dummy_id'}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email,public_profile`;
            break;
            
          case 'apple':
            authUrl = `https://appleid.apple.com/auth/authorize?client_id=${process.env.APPLE_CLIENT_ID || 'dummy_id'}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20name`;
            break;
            
          default:
            throw new Error(`Unsupported provider: ${provider}`);
        }
        
        return authUrl;
      } catch (error) {
        console.error('Error generating social auth URL:', error);
        throw new Error('Failed to generate social authentication URL');
      }
    }
  }
};

// Helper Functions

/**
 * Generate JWT token for user
 */
function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      username: user.username,
      isAnonymous: user.isAnonymous
    },
    process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production',
    { expiresIn: '1h' }
  );
}

/**
 * Generate refresh token
 */
function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user.id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'hugmood-refresh-secret-key-change-in-production',
    { expiresIn: '7d' }
  );
}

/**
 * Store refresh token in database
 */
async function storeRefreshToken(userId, token) {
  const now = new Date();
  const expiryDate = new Date(now);
  expiryDate.setDate(expiryDate.getDate() + 7); // 7 days
  
  await pool.query(
    `INSERT INTO "RefreshTokens" (id, userId, token, expiresAt, createdAt, updatedAt)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [uuidv4(), userId, token, expiryDate, now, now]
  );
}

// Middleware to handle authentication
const authMiddleware = (req) => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  let user = null;
  
  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'hugmood-dev-secret-key-change-in-production'
      );
      user = decoded;
    } catch (err) {
      console.error('Token verification error:', err.message);
    }
  }
  
  return { user, token };
};

async function startApolloServer() {
  // Initialize database
  await initDb();
  
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return authMiddleware(req);
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return error;
    }
  });
  
  // Start Apollo Server
  await server.start();
  
  // Apply middleware
  server.applyMiddleware({ app, path: '/graphql' });
  
  // Start HTTP server
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  
  console.log(`🚀 Auth Service ready at http://0.0.0.0:${PORT}${server.graphqlPath}`);
  
  return { server, app, httpServer };
}

// Express routes
app.get('/', (req, res) => {
  res.send('HugMood Auth Service');
});

// Start server
startApolloServer()
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

module.exports = { app, startApolloServer };