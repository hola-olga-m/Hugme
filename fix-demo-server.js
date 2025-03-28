import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route to serve the live query demo
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'mock-live-demo.html'));
});

// Also keep the original demo accessible
app.get('/original', (req, res) => {
  res.sendFile(path.join(__dirname, 'live-query-demo.html'));
});

// Start server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Live Query Demo server running at http://0.0.0.0:${PORT}`);
  console.log(`📱 Open your browser to see the demo`);
});