const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const router = express.Router();
require('dotenv').config();

// Initialize Passport middleware
router.use(passport.initialize());

// Check if Google authentication is configured
const isGoogleAuthConfigured = () => {
  return process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET;
};

// Only set up Google OAuth strategy if credentials are available
if (isGoogleAuthConfigured()) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ where: { googleId: profile.id } });
      
      if (!user) {
        // Create a new user if doesn't exist
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        const name = profile.displayName || '';
        const profileImage = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
        
        // Check if the email is already associated with another account
        if (email) {
          const existingUser = await User.findOne({ where: { email } });
          
          if (existingUser) {
            // Update existing user with Google ID
            existingUser.googleId = profile.id;
            if (!existingUser.profileImage && profileImage) {
              existingUser.profileImage = profileImage;
            }
            await existingUser.save();
            user = existingUser;
          } else {
            // Create new user
            user = await User.create({
              id: uuidv4(),
              username: `user${Date.now()}`, // Generate a unique username
              email,
              name,
              profileImage,
              googleId: profile.id,
              isVerified: true
            });
          }
        } else {
          // Create new user without email (rare case)
          user = await User.create({
            id: uuidv4(),
            username: `google_user${Date.now()}`, // Generate a unique username
            email: `google_${profile.id.substring(0, 8)}@placeholder.com`, // Placeholder email
            name,
            profileImage,
            googleId: profile.id,
            isVerified: true
          });
        }
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Routes for Google authentication when credentials are available
  router.get('/google', (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  });

  router.get('/google/callback', 
    passport.authenticate('google', { 
      session: false,
      failureRedirect: '/login' 
    }),
    (req, res) => {
      // Generate JWT token
      const token = jwt.sign({ 
        userId: req.user.id,
        email: req.user.email
      }, process.env.JWT_SECRET || 'hugmood-secret-key', { 
        expiresIn: '7d' 
      });
      
      // Redirect to frontend with token
      res.redirect(`/auth-success?token=${token}`);
    }
  );
} else {
  // Provide informative error if Google auth is not configured
  router.get('/google', (req, res) => {
    res.status(503).json({ 
      error: 'Google authentication is not configured. Please set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET.' 
    });
  });
  
  router.get('/google/callback', (req, res) => {
    res.status(503).json({ 
      error: 'Google authentication is not configured. Please set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET.' 
    });
  });
}

module.exports = router;