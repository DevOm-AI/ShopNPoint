// ==================== config/db.js ====================
// MySQL Database Configuration and Connection Management

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool for better performance and connection management
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '4312',
  database: process.env.DB_NAME || 'shopping_platform',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in pool
  queueLimit: 0, // Unlimited queue
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4', // Support for emojis and special characters
  timezone: '+00:00' // UTC timezone
});

// Test database connection on startup
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully');
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    console.log(`🌐 Host: ${process.env.DB_HOST}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Please check your .env file and ensure MySQL is running');
    process.exit(1); // Exit process if database connection fails
  }
};

// Execute a single query with parameters (prevents SQL injection)
const executeQuery = async (query, params = []) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    console.error('❌ Query execution error:', error.message);
    console.error('Query:', query);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// Execute multiple queries in a transaction
const executeTransaction = async (queries) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [rows] = await connection.execute(query, params);
      results.push(rows);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    console.error('❌ Transaction failed:', error.message);
    throw error;
  } finally {
    connection.release();
  }
};

// Get a connection from pool (for complex operations)
const getConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('❌ Failed to get connection:', error.message);
    throw error;
  }
};

// Close all connections in pool (for graceful shutdown)
const closePool = async () => {
  try {
    await pool.end();
    console.log('✅ Database connection pool closed');
  } catch (error) {
    console.error('❌ Error closing pool:', error.message);
    throw error;
  }
};

// Ping database to check if connection is alive
const pingDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database ping failed:', error.message);
    return false;
  }
};

// Export all database utilities
module.exports = {
  pool,
  testConnection,
  executeQuery,
  executeTransaction,
  getConnection,
  closePool,
  pingDatabase
};