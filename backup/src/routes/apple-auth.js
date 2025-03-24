const express = require('express');
const passport = require('passport');
const AppleStrategy = require('passport-apple');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const router = express.Router();
require('dotenv').config();

// Initialize Passport middleware
router.use(passport.initialize());

// Check if Apple authentication is configured
const isAppleAuthConfigured = () => {
  return process.env.APPLE_CLIENT_ID && 
         process.env.APPLE_TEAM_ID && 
         process.env.APPLE_KEY_ID && 
         process.env.APPLE_PRIVATE_KEY_LOCATION;
};

// Only set up Apple OAuth strategy if credentials are available
if (isAppleAuthConfigured()) {
  passport.use(new AppleStrategy({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
      callbackURL: "/auth/apple/callback",
      passReqToCallback: true
    },
  async (req, accessToken, refreshToken, idToken, profile, done) => {
    try {
      // Apple strategy doesn't provide profile info directly
      // We need to extract it from the tokens
      const appleId = idToken.sub;
      const email = idToken.email;
      
      // Check if user exists
      let user = await User.findOne({ where: { appleId } });
      
      if (!user) {
        // Create a new user if doesn't exist
        // Check if the email is already associated with another account
        if (email) {
          const existingUser = await User.findOne({ where: { email } });
          
          if (existingUser) {
            // Update existing user with Apple ID
            existingUser.appleId = appleId;
            await existingUser.save();
            user = existingUser;
          } else {
            // Get name from the authorization request (Apple provides it only on first login)
            const name = req.body && req.body.user ? 
              `${req.body.user.name.firstName} ${req.body.user.name.lastName}` : 
              'Apple User';
            
            // Create new user
            user = await User.create({
              id: uuidv4(),
              username: `user${Date.now()}`, // Generate a unique username
              email,
              name,
              appleId,
              isVerified: true
            });
          }
        } else {
          // Create new user without email
          user = await User.create({
            id: uuidv4(),
            username: `apple_user${Date.now()}`, // Generate a unique username
            email: `apple_${appleId.substring(0, 8)}@placeholder.com`, // Placeholder email
            name: 'Apple User',
            appleId,
            isVerified: true
          });
        }
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

  // Routes for Apple authentication when credentials are available
  router.post('/apple', (req, res, next) => {
    passport.authenticate('apple', { scope: ['name', 'email'] })(req, res, next);
  });

  router.post('/apple/callback', 
    passport.authenticate('apple', { 
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
} 
// Provide informative error if Apple auth is not configured
else {
  router.post('/apple', (req, res) => {
    res.status(503).json({
      error: 'Apple authentication is not configured. Please set APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY_LOCATION.'
    });
  });
  
  router.post('/apple/callback', (req, res) => {
    res.status(503).json({
      error: 'Apple authentication is not configured. Please set APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY_LOCATION.'
    });
  });
}

module.exports = router;