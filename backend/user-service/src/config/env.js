import "dotenv/config";

const ENV = {
    PORT: process.env.PORT || 5001,
    NODE_ENV: process.env.NODE_ENV || 'development',

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'deeptech_user',
    DB_PASSWORD: process.env.DB_PASSWORD || 'deeptech_password',
    DB_NAME: process.env.DB_NAME || 'deeptech-db',
    DB_PORT: process.env.DB_PORT || 3306,
    DATABASE_URL: process.env.DATABASE_URL,

    JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5242880,

    REDIS_PORT: process.env.REDIS_PORT || 6379,
};

export default ENV;
