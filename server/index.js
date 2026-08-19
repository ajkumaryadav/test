const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./db');
const authRoutes = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev server
  credentials: true,
}));
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);

// Base route
app.get('/api', (req, res) => {
  res.json({ message: 'PostgreSQL Auth API is running smoothly.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server and initialize DB
async function startServer() {
  try {
    console.log('Connecting to PostgreSQL database...');
    await initDB();
    console.log('Database initialized successfully.');

    app.listen(PORT, () => {
      console.log(`===========================================`);
      console.log(` Backend server running on http://localhost:${PORT}`);
      console.log(` Authentication endpoints at /api/auth/login, /api/auth/register`);
      console.log(`===========================================`);
    });
  } catch (error) {
    console.error('Failed to start server due to DB connection error:', error.message);
    console.log('Attempting to start server in fallback mode (retry DB on requests)...');
    
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT} (Database pending connection)`);
    });
  }
}

startServer();
