/**
 * Simplified API server for HugMeNow
 * This provides basic API endpoints for the application
 */

import express from 'express';
import cors from 'cors';

// Get port from environment variable or use default
const PORT = process.env.PORT || 3002;

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Dummy database for testing
const users = [
  { id: '1', name: 'Alice', email: 'alice@example.com', password: 'password123', avatar: '/assets/icons/png/SmilingHug.png' },
  { id: '2', name: 'Bob', email: 'bob@example.com', password: 'password123', avatar: '/assets/icons/png/FriendlyHug.png' }
];

const moods = [
  { id: '1', userId: '1', moodType: 'HAPPY', intensity: 8, note: 'Feeling great today!', createdAt: new Date().toISOString() },
  { id: '2', userId: '1', moodType: 'CALM', intensity: 6, note: 'Relaxed afternoon', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', userId: '2', moodType: 'ENERGETIC', intensity: 9, note: 'Ready to conquer the world!', createdAt: new Date().toISOString() }
];

const hugs = [
  { id: '1', senderId: '1', recipientId: '2', hugType: 'FRIENDLY', message: 'Hope you have a great day!', createdAt: new Date().toISOString() },
  { id: '2', senderId: '2', recipientId: '1', hugType: 'SUPPORTIVE', message: 'Hang in there!', createdAt: new Date(Date.now() - 3600000).toISOString() }
];

// Set up a mock GraphQL endpoint
app.use('/graphql', (req, res) => {
  // This is a mock endpoint
  // In a real implementation, we would use a GraphQL library here
  const query = req.body.query || '';
  
  let result = { data: null };
  
  if (query.includes('users')) {
    result.data = { users };
  } else if (query.includes('moods')) {
    result.data = { moods };
  } else if (query.includes('hugs')) {
    result.data = { hugs };
  } else if (query.includes('login')) {
    const variables = req.body.variables || {};
    const email = variables.input?.email;
    const password = variables.input?.password;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      result.data = { 
        login: { 
          token: 'dummy-token-' + user.id, 
          user 
        } 
      };
    } else {
      result.errors = [{ message: 'Invalid credentials' }];
    }
  }
  
  res.json(result);
});

// Set up some REST API endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/user', (req, res) => {
  const user = users.find(u => u.id === req.query.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/api/login', (req, res) => {
  const loginInput = req.body.loginInput || req.body;
  const user = users.find(u => u.email === loginInput.email && u.password === loginInput.password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: 'dummy-token-' + user.id, user });
});

app.get('/api/moods', (req, res) => {
  const userId = req.query.userId;
  const userMoods = userId ? moods.filter(mood => mood.userId === userId) : moods;
  res.json(userMoods);
});

app.post('/api/createMoodEntry', (req, res) => {
  const { moodType, intensity, note } = req.body;
  const id = (moods.length + 1).toString();
  const userId = '1'; // For simplicity, we'll use user 1
  const createdAt = new Date().toISOString();
  const newMood = { id, userId, moodType, intensity, note, createdAt };
  moods.push(newMood);
  res.json(newMood);
});

// Create some custom endpoints
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from HugMeNow API!' });
});

app.get('/manual/users', (req, res) => {
  res.json(users);
});

app.post('/manual/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: 'dummy-token-' + user.id, user });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simplified API server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  console.log(`REST API: http://localhost:${PORT}/api/`);
  console.log(`Example REST endpoints:`);
  console.log(`  - GET    http://localhost:${PORT}/api/users`);
  console.log(`  - GET    http://localhost:${PORT}/api/user?id=<user_id>`);
  console.log(`  - POST   http://localhost:${PORT}/api/login (with body: {"loginInput": {...}})`);
  console.log(`  - GET    http://localhost:${PORT}/api/moods?userId=<user_id>`);
  console.log(`  - POST   http://localhost:${PORT}/api/createMoodEntry (with body)`);
  console.log(`Manual endpoints (custom implementation):`);
  console.log(`  - GET    http://localhost:${PORT}/hello`);
  console.log(`  - GET    http://localhost:${PORT}/manual/users`);
  console.log(`  - POST   http://localhost:${PORT}/manual/login (with body: {"email": "...", "password": "..."})`);
});
