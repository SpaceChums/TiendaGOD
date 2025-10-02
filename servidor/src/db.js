import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '', // ← Cambiado a DB_PASS
  database: process.env.DB_NAME || 'tienda',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función de prueba de conexión
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return false;
  }
};