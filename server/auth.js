const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, pool } = require('./db');
const { authenticateToken, JWT_SECRET } = require('./middleware');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [trimmedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into PostgreSQL
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), trimmedEmail, hashedPassword]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Account created successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Server error during registration: ' + error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Lookup user in PostgreSQL
    const result = await query('SELECT * FROM users WHERE email = $1', [trimmedEmail]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Compare bcrypt password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login: ' + error.message });
  }
});

// GET /api/auth/me (Protected route)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const user = result.rows[0];
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Server error retrieving profile: ' + error.message });
  }
});

// GET /api/auth/health
router.get('/health', async (req, res) => {
  try {
    const dbTest = await query('SELECT NOW() as current_time, count(*) as user_count FROM users');
    return res.json({
      status: 'healthy',
      database: 'connected',
      currentTime: dbTest.rows[0].current_time,
      totalUsers: parseInt(dbTest.rows[0].user_count, 10),
    });
  } catch (error) {
    return res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
    });
  }
});

module.exports = router;
