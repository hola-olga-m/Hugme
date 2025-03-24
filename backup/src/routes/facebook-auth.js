const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');

const router = express.Router();
require('dotenv').config();

// Initialize Passport middleware
router.use(passport.initialize());

// Check if Facebook authentication is configured
const isFacebookAuthConfigured = () => {
  return process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET;
};

// Only set up Facebook OAuth strategy if credentials are available
if (isFacebookAuthConfigured()) {
  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ where: { facebookId: profile.id } });
      
      if (!user) {
        // Create a new user if doesn't exist
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
        const name = profile.displayName || '';
        const profileImage = profile.photos && profile.photos[0] ? profile.photos[0].value : '';
        
        // Check if the email is already associated with another account
        if (email) {
          const existingUser = await User.findOne({ where: { email } });
          
          if (existingUser) {
            // Update existing user with Facebook ID
            existingUser.facebookId = profile.id;
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
              facebookId: profile.id,
              isVerified: true
            });
          }
        } else {
          // Create new user without email
          user = await User.create({
            id: uuidv4(),
            username: `fb_user${Date.now()}`, // Generate a unique username
            email: `fb_${profile.id}@placeholder.com`, // Placeholder email
            name,
            profileImage,
            facebookId: profile.id,
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

  // Routes for Facebook authentication when credentials are available
  router.get('/facebook', (req, res, next) => {
    passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
  });

  router.get('/facebook/callback', 
    passport.authenticate('facebook', { 
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

// Provide informative error if Facebook auth is not configured
else {
  router.get('/facebook', (req, res) => {
    res.status(503).json({
      error: 'Facebook authentication is not configured. Please set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET.'
    });
  });
  
  router.get('/facebook/callback', (req, res) => {
    res.status(503).json({
      error: 'Facebook authentication is not configured. Please set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET.'
    });
  });
}

module.exports = router;