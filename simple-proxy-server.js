import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import fs from 'fs';

const PORT = 3005;
const app = express();

// Proxy all requests to the local server
app.use('/', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  ws: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url} to http://localhost:5000${req.url}`);
  }
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple proxy server running on port ${PORT}`);
  console.log(`Proxying all requests to http://localhost:5000`);
});