const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const User = require('../models/User');

// Get authentication middleware
let authenticateJWT;
// Initialize the middleware when the router is attached to the app
router.use((req, res, next) => {
  if (!authenticateJWT) {
    authenticateJWT = req.app.get('authenticateJWT');
  }
  next();
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { 
        [Sequelize.Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email or username already exists' 
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password, // Will be hashed by User model hooks
      name: name || username
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'hugmood-secret-key',
      { expiresIn: '7d' }
    );

    // Return success with token and user info (excluding password)
    const userData = { ...user.toJSON() };
    delete userData.password;

    res.status(201).json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during registration' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ 
      where: { 
        [Sequelize.Op.or]: [
          { email },
          { username: email } // Allow login with username too
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await user.isValidPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'hugmood-secret-key',
      { expiresIn: '7d' }
    );

    // Update user's online status
    await user.update({ isOnline: true, lastActive: new Date() });

    // Return success with token and user info (excluding password)
    const userData = { ...user.toJSON() };
    delete userData.password;

    res.json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during login' 
    });
  }
});

// Get user profile
router.get('/me', (req, res, next) => authenticateJWT(req, res, next), async (req, res) => {
  try {
    // JWT middleware adds user to req
    const userId = req.user.userId;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching user profile' 
    });
  }
});

// Update user profile
router.put('/me', (req, res, next) => authenticateJWT(req, res, next), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, name, bio, profileImage, theme, notificationSettings, isPrivate } = req.body;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // If username is being changed, check if it's already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username is already taken' 
        });
      }
    }

    // Update fields
    await user.update({
      username: username || user.username,
      name: name || user.name,
      bio: bio !== undefined ? bio : user.bio,
      profileImage: profileImage || user.profileImage,
      theme: theme || user.theme,
      notificationSettings: notificationSettings || user.notificationSettings,
      isPrivate: isPrivate !== undefined ? isPrivate : user.isPrivate
    });

    // Return updated user without password
    const userData = { ...user.toJSON() };
    delete userData.password;

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating user profile' 
    });
  }
});

// Change password
router.put('/change-password', (req, res, next) => authenticateJWT(req, res, next), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify current password
    const isPasswordValid = await user.isValidPassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Update password
    await user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while changing password' 
    });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Don't reveal that the email doesn't exist
      return res.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent'
      });
    }

    // Generate reset token (24 hour expiration)
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email, purpose: 'password-reset' },
      process.env.JWT_SECRET || 'hugmood-secret-key',
      { expiresIn: '24h' }
    );

    // In a real application, send an email with the reset link
    // For this demo, just return the token
    // TODO: Implement email sending functionality

    res.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent',
      // Only include this in development environment
      resetUrl: `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your request' 
    });
  }
});

// Reset password with token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Verify token
    let decodedToken;
    try {
      decodedToken = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'hugmood-secret-key'
      );
    } catch (err) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    // Check token purpose
    if (decodedToken.purpose !== 'password-reset') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token purpose' 
      });
    }

    const user = await User.findByPk(decodedToken.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update password
    await user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while resetting password' 
    });
  }
});

// Logout (just for API completeness - JWT tokens should be handled client-side)
router.post('/logout', (req, res, next) => authenticateJWT(req, res, next), async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Update user status to offline
    await User.update(
      { isOnline: false, lastActive: new Date() },
      { where: { id: userId } }
    );

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during logout' 
    });
  }
});

module.exports = router;