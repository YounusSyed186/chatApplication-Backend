const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Middleware
app.use(cors());
// Removed body parsing from gateway to allow proxy to forward raw body
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${req.ip}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is running' });
});

// ---------------- SERVICES ---------------- //

// Auth Service - 5000
app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,

  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.originalUrl} to Auth Service`);

    // Forward Authorization header
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
  },

  onProxyRes: (proxyRes, req, res) => {
    console.log(`Response from Auth Service: ${proxyRes.statusCode}`);
  },

  onError: (err, req, res) => {
    console.error('Auth service error:', err.message);
    res.status(503).json({ error: 'Auth service unavailable' });
  }
}));

// User Service - 5001
app.use('/users', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.originalUrl} to User Service`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Response from User Service: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('User service error:', err.message);
    res.status(503).json({ error: 'User service unavailable' });
  }
}));

// Chat Service - 5002
app.use('/chat', createProxyMiddleware({
  target: 'http://localhost:5002',
  changeOrigin: true,
  onError: (err, req, res) => {
    res.status(503).json({ error: 'Chat service unavailable' });
  }
}));

// Confession Service - 5003
app.use('/confessions', createProxyMiddleware({
  target: 'http://localhost:5003',
  changeOrigin: true,
  onError: (err, req, res) => {
    res.status(503).json({ error: 'Confession service unavailable' });
  }
}));

// Event Service - 5004
app.use('/events', createProxyMiddleware({
  target: 'http://localhost:5004',
  changeOrigin: true,
  onError: (err, req, res) => {
    res.status(503).json({ error: 'Event service unavailable' });
  }
}));

// Matching Service - 5005
app.use('/matching', createProxyMiddleware({
  target: 'http://localhost:5005',
  changeOrigin: true,
  onError: (err, req, res) => {
    res.status(503).json({ error: 'Matching service unavailable' });
  }
}));

// Moderation Service - 5006
app.use('/moderation', createProxyMiddleware({
  target: 'http://localhost:5006',
  changeOrigin: true,
  onError: (err, req, res) => {
    res.status(503).json({ error: 'Moderation service unavailable' });
  }
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;