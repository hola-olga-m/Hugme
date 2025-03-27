/**
 * Simple mock server for HugMeNow frontend testing
 * This provides basic API endpoints to allow the frontend to function without a full backend
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'hugmenow-mock-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory store for mock data
const users = [
  {
    id: '506f579c-7564-4ab0-8d17-2150cc9019eb',
    username: 'olga',
    email: 'olga.v.matusevich@gmail.com',
    name: 'Olga Matusevich',
    password: 'Password123!', // In a real app, this would be hashed
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    isAnonymous: false,
    preferences: {
      theme: 'serenity',
      language: 'en',
      notifications: true
    }
  }
];

const moods = {
  '506f579c-7564-4ab0-8d17-2150cc9019eb': [
    {
      id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
      userId: '506f579c-7564-4ab0-8d17-2150cc9019eb',
      mood: 'happy',
      intensity: 8,
      note: 'Had a great day at work!',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Yesterday
    },
    {
      id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
      userId: '506f579c-7564-4ab0-8d17-2150cc9019eb',
      mood: 'calm',
      intensity: 6,
      note: 'Meditation session was helpful',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    }
  ]
};

const hugs = {
  '506f579c-7564-4ab0-8d17-2150cc9019eb': [
    {
      id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
      fromUserId: '2a3b4c5d-6e7f-8g9h-0i1j-2k3l4m5n6o7p',
      toUserId: '506f579c-7564-4ab0-8d17-2150cc9019eb',
      message: 'Sending you positive vibes!',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
    }
  ]
};

// Helper functions
function generateToken(user) {
  // Create a user object without sensitive data
  const userForToken = {
    id: user.id,
    username: user.username,
    email: user.email,
    isAnonymous: user.isAnonymous
  };
  
  return jwt.sign(userForToken, JWT_SECRET, { expiresIn: '7d' });
}

function findUserByEmail(email) {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function findUserByUsername(username) {
  return users.find(user => user.username.toLowerCase() === username.toLowerCase());
}

function findUserById(id) {
  return users.find(user => user.id === id);
}

function sanitizeUser(user) {
  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
}

// API Routes
// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  const user = findUserByEmail(email);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  
  const token = generateToken(user);
  
  res.status(200).json({
    accessToken: token,
    user: sanitizeUser(user)
  });
});

// Register endpoint
app.post('/register', (req, res) => {
  const { username, email, password, name, avatarUrl } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }
  
  if (findUserByEmail(email)) {
    return res.status(400).json({ message: 'Email already in use' });
  }
  
  if (findUserByUsername(username)) {
    return res.status(400).json({ message: 'Username already taken' });
  }
  
  const newUser = {
    id: require('crypto').randomUUID(),
    username,
    email,
    name: name || username,
    password,
    avatarUrl: avatarUrl || `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`,
    isAnonymous: false,
    preferences: {
      theme: 'serenity',
      language: 'en',
      notifications: true
    }
  };
  
  users.push(newUser);
  
  const token = generateToken(newUser);
  
  res.status(201).json({
    accessToken: token,
    user: sanitizeUser(newUser)
  });
});

// Anonymous login endpoint
app.post('/anonymous-login', (req, res) => {
  const { nickname, avatarUrl } = req.body;
  
  if (!nickname) {
    return res.status(400).json({ message: 'Nickname is required' });
  }
  
  const anonymousUser = {
    id: require('crypto').randomUUID(),
    username: `anon_${nickname}_${Date.now().toString(36)}`,
    email: `anon_${Date.now().toString(36)}@hugmenow.anonymous`,
    name: nickname,
    password: null,
    avatarUrl: avatarUrl || `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`,
    isAnonymous: true,
    preferences: {
      theme: 'serenity',
      language: 'en',
      notifications: true
    }
  };
  
  users.push(anonymousUser);
  
  const token = generateToken(anonymousUser);
  
  res.status(200).json({
    accessToken: token,
    user: sanitizeUser(anonymousUser)
  });
});

// Get current user endpoint
app.get('/me', authenticateToken, (req, res) => {
  const user = findUserById(req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.status(200).json(sanitizeUser(user));
});

// Logout endpoint
app.post('/logout', (req, res) => {
  // In a real app, we would invalidate the token
  // For our mock server, we just return success
  res.status(200).json({ message: 'Logged out successfully' });
});

// Mood endpoints
app.get('/moods', authenticateToken, (req, res) => {
  const userMoods = moods[req.user.id] || [];
  res.status(200).json(userMoods);
});

app.post('/moods', authenticateToken, (req, res) => {
  const { mood, intensity, note } = req.body;
  
  if (!mood) {
    return res.status(400).json({ message: 'Mood is required' });
  }
  
  const newMood = {
    id: require('crypto').randomUUID(),
    userId: req.user.id,
    mood,
    intensity: intensity || 5,
    note: note || '',
    timestamp: new Date().toISOString()
  };
  
  if (!moods[req.user.id]) {
    moods[req.user.id] = [];
  }
  
  moods[req.user.id].unshift(newMood);
  
  res.status(201).json(newMood);
});

// Mood streak endpoint
app.get('/moods/streak', authenticateToken, (req, res) => {
  const userMoods = moods[req.user.id] || [];
  
  // Calculate a mock streak
  const streak = {
    current: Math.min(userMoods.length, 3),
    longest: Math.min(userMoods.length + 2, 10),
    lastUpdate: userMoods.length > 0 ? userMoods[0].timestamp : null
  };
  
  res.status(200).json(streak);
});

// Hug endpoints
app.get('/hugs', authenticateToken, (req, res) => {
  const userHugs = hugs[req.user.id] || [];
  res.status(200).json(userHugs);
});

app.post('/hugs', authenticateToken, (req, res) => {
  const { toUserId, message } = req.body;
  
  if (!toUserId) {
    return res.status(400).json({ message: 'Recipient user ID is required' });
  }
  
  const toUser = findUserById(toUserId);
  
  if (!toUser) {
    return res.status(404).json({ message: 'Recipient user not found' });
  }
  
  const newHug = {
    id: require('crypto').randomUUID(),
    fromUserId: req.user.id,
    toUserId,
    message: message || 'Sending a hug!',
    timestamp: new Date().toISOString()
  };
  
  if (!hugs[toUserId]) {
    hugs[toUserId] = [];
  }
  
  hugs[toUserId].push(newHug);
  
  res.status(201).json(newHug);
});

// GraphQL mock endpoint
app.post('/graphql', (req, res) => {
  // Simple GraphQL mock that handles login
  const query = req.body.query || '';
  const variables = req.body.variables || {};
  
  if (query.includes('login')) {
    const email = variables.loginInput?.email;
    const password = variables.loginInput?.password;
    
    if (!email || !password) {
      return res.status(400).json({ errors: [{ message: 'Email and password are required' }] });
    }
    
    const user = findUserByEmail(email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ errors: [{ message: 'Invalid email or password' }] });
    }
    
    const token = generateToken(user);
    
    return res.json({
      data: {
        login: {
          accessToken: token,
          user: sanitizeUser(user)
        }
      }
    });
  }
  
  if (query.includes('register')) {
    const { username, email, password, name, avatarUrl } = variables.registerInput || {};
    
    if (!username || !email || !password) {
      return res.status(400).json({ errors: [{ message: 'Username, email and password are required' }] });
    }
    
    if (findUserByEmail(email)) {
      return res.status(400).json({ errors: [{ message: 'Email already in use' }] });
    }
    
    if (findUserByUsername(username)) {
      return res.status(400).json({ errors: [{ message: 'Username already taken' }] });
    }
    
    const newUser = {
      id: require('crypto').randomUUID(),
      username,
      email,
      name: name || username,
      password,
      avatarUrl: avatarUrl || `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`,
      isAnonymous: false,
      preferences: {
        theme: 'serenity',
        language: 'en',
        notifications: true
      }
    };
    
    users.push(newUser);
    
    const token = generateToken(newUser);
    
    return res.json({
      data: {
        register: {
          accessToken: token,
          user: sanitizeUser(newUser)
        }
      }
    });
  }
  
  if (query.includes('anonymousLogin')) {
    const { nickname, avatarUrl } = variables.anonymousLoginInput || {};
    
    if (!nickname) {
      return res.status(400).json({ errors: [{ message: 'Nickname is required' }] });
    }
    
    const anonymousUser = {
      id: require('crypto').randomUUID(),
      username: `anon_${nickname}_${Date.now().toString(36)}`,
      email: `anon_${Date.now().toString(36)}@hugmenow.anonymous`,
      name: nickname,
      password: null,
      avatarUrl: avatarUrl || `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 10)}.jpg`,
      isAnonymous: true,
      preferences: {
        theme: 'serenity',
        language: 'en',
        notifications: true
      }
    };
    
    users.push(anonymousUser);
    
    const token = generateToken(anonymousUser);
    
    return res.json({
      data: {
        anonymousLogin: {
          accessToken: token,
          user: sanitizeUser(anonymousUser)
        }
      }
    });
  }
  
  // Default response for unhandled queries
  res.json({
    data: null,
    errors: [{ message: 'Unhandled GraphQL operation' }]
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock server running at http://0.0.0.0:${PORT}`);
  console.log(`Test user: { email: 'olga.v.matusevich@gmail.com', password: 'Password123!' }`);
});