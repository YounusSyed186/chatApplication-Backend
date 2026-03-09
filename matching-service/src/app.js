const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const winston = require("winston");

const matchingRoutes = require("./routes/matching.routes");

const app = express();

// Create logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'matching-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Morgan for HTTP request logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.use(cors());
app.use(express.json());

app.use("/matching", matchingRoutes);

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;