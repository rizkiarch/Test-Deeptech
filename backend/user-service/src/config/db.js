import mysql from 'mysql2/promise';
import ENV from './env.js';

const pool = mysql.createPool({
    host: ENV.DB_HOST,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
    port: ENV.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
});

pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully');
        connection.release();
    })
    .catch(error => {
        console.error('❌ Database connection failed:', error.message);
    });

export default pool;