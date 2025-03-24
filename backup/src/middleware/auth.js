const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to authenticate and protect routes using JWT
 */
const authMiddleware = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No token provided.'
    });
  }

  // Extract token from Bearer format
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'hugmood-secret-key');
    
    // Add user data to request
    req.user = decodedToken;
    
    // Continue to the protected route
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Authentication failed.'
    });
  }
};

/**
 * Optional authentication middleware - doesn't block request if no token
 * but still attaches user data if token is valid
 */
const optionalAuth = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  // Skip if no token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.isAuthenticated = false;
    return next();
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'hugmood-secret-key');
    
    // Add user data to request
    req.user = decodedToken;
    req.isAuthenticated = true;
    
    next();
  } catch (error) {
    // Token is invalid, but we don't block the request
    req.isAuthenticated = false;
    next();
  }
};

/**
 * Check if user is an artist (used for artist-only routes)
 */
const isArtist = async (req, res, next) => {
  try {
    // First verify they're authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get user from database
    const user = await User.findByPk(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is an artist
    if (!user.isArtist) {
      return res.status(403).json({
        success: false,
        message: 'Artist access required'
      });
    }

    // User is verified as an artist
    next();
  } catch (error) {
    console.error('Artist check error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking artist status'
    });
  }
};

/**
 * Check if user has premium status (for premium features)
 */
const isPremium = async (req, res, next) => {
  try {
    // First verify they're authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get user from database
    const user = await User.findByPk(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has premium status
    if (!user.isPremium) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required for this feature'
      });
    }

    // Check if premium subscription is still valid
    const now = new Date();
    if (user.premiumUntil && new Date(user.premiumUntil) < now) {
      return res.status(403).json({
        success: false,
        message: 'Your premium subscription has expired'
      });
    }

    // User is verified as premium
    next();
  } catch (error) {
    console.error('Premium check error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking premium status'
    });
  }
};

module.exports = {
  authMiddleware,
  optionalAuth,
  isArtist,
  isPremium
};