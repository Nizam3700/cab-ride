const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cab_system',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initDatabase = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'driver') NOT NULL
      )
    `);

    // Drivers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS drivers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        vehicle_number VARCHAR(50) NOT NULL,
        is_available BOOLEAN DEFAULT TRUE,
        current_x DECIMAL(10, 2) DEFAULT 0,
        current_y DECIMAL(10, 2) DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Rides table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS rides (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        driver_id INT,
        pickup_x DECIMAL(10, 2) NOT NULL,
        pickup_y DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'assigned',
        distance DECIMAL(10, 2),
        fare DECIMAL(10, 2),
        requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (driver_id) REFERENCES drivers(id)
      )
    `);
    
    console.log('✅ Database ready');
    connection.release();
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
};

const getDB = () => pool;

module.exports = { initDatabase, getDB };