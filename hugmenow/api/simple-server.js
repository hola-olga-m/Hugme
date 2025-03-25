// Simple API server for demonstration purposes
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:3001', 'http://0.0.0.0:3001', '*'],
  credentials: true
}));

// Simple routes for testing
app.get('/', (req, res) => {
  res.json({
    message: 'NestJS API Server Placeholder',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/info', (req, res) => {
  res.json({
    name: 'HugMeNow API',
    version: '1.0.0',
    description: 'NestJS API for HugMeNow application',
    status: 'running on simple server',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Sample GraphQL endpoint
app.post('/graphql', (req, res) => {
  const query = req.body.query || '';
  
  // Very simple mock response
  if (query.includes('me')) {
    res.json({
      data: {
        me: {
          id: 'user-1',
          name: 'Sample User',
          email: 'user@example.com'
        }
      }
    });
  } else {
    res.json({
      data: null,
      errors: [{
        message: 'Not implemented in simple server'
      }]
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple API server running on http://0.0.0.0:${PORT}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  console.log(`Server is listening on port: ${PORT}`);
  console.log(`Server is bound to address: 0.0.0.0`);
  console.log('Simple API Server is ready to accept connections');
});