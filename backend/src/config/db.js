const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'calendly_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL Database successfully!');
    connection.release();
  } catch (error) {
    console.error('Error connecting to MySQL Database:', error.message);
  }
})();

module.exports = pool;
