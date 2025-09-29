import { defineConfig } from 'drizzle-kit';
import ENV from './src/config/env.js';

export default defineConfig({
    schema: './src/db/schema.js',
    out: './src/drizzle',
    dialect: 'mysql',
    dbCredentials: {
        host: ENV.DB_HOST,
        port: ENV.DB_PORT,
        user: ENV.DB_USER,
        password: ENV.DB_PASSWORD,
        database: ENV.DB_NAME,
    },
    verbose: true,
    strict: true,
});