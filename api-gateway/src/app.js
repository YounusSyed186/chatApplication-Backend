require("dotenv").config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json()); // for REST payloads

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'API Gateway running' }));

// ---------------- CHAT WEBSOCKET ---------------- //
const chatProxy = createProxyMiddleware({
  target: "http://localhost:5002",
  changeOrigin: true,
  ws: true,
  logLevel: "debug",
  pathRewrite: { "^/chat": "" }, // /chat/socket.io -> /socket.io
  onError: (err, req, res) => {
    console.error("Chat service proxy error:", err.message);
    if (!res.headersSent) res.status(503).json({ error: 'Chat service unavailable' });
  }
});

app.use("/chat", chatProxy);

// ------------- OTHER SERVICES ---------------- //
const services = [
  { path: "/auth", port: 5000 },
  { path: "/users", port: 5001 },
  { path: "/confessions", port: 5003 },
  { path: "/events", port: 5004 },
  { path: "/matching", port: 5005 },
  { path: "/moderation", port: 5006 },
];

services.forEach(s => {
  app.use(s.path, createProxyMiddleware({
    target: `http://localhost:${s.port}`,
    changeOrigin: true,
    logLevel: "debug",
    onError: (err, req, res) => {
      console.error(`${s.path} proxy error:`, err.message);
      if (!res.headersSent) res.status(503).json({ error: `${s.path} service unavailable` });
    }
  }));
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Create HTTP server for WebSocket
const server = http.createServer(app);
server.on("upgrade", chatProxy.upgrade);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));