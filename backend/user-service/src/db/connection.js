import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import ENV from '../config/env.js';
import * as schema from './schema.js';

const connection = mysql.createPool({
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

export const db = drizzle(connection, { schema, mode: 'default' });

export default db;