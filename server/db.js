const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:12345@localhost:5432/test';

const pool = new Pool({
  connectionString,
  // Connection timeout in ms
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// Initialize database tables and demo seed user
async function initDB() {
  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL successfully.');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Verified/Created "users" table.');

    // Check if demo user exists
    const demoEmail = 'admin@example.com';
    const checkRes = await client.query('SELECT id FROM users WHERE email = $1', [demoEmail]);
    
    if (checkRes.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await client.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        ['Admin User', demoEmail, hashedPassword]
      );
      console.log(`Demo user created: ${demoEmail} (password: admin123)`);
    } else {
      console.log(`Demo user already present: ${demoEmail}`);
    }

    return true;
  } catch (error) {
    console.error('Database initialization error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDB,
};

// Run standalone if executed directly
if (require.main === module) {
  initDB()
    .then(() => {
      console.log('Database setup complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Setup failed:', err);
      process.exit(1);
    });
}
