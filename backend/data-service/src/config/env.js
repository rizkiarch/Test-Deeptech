import dotenv from 'dotenv';

dotenv.config();

const ENV = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'deeptech-db',
    DB_PORT: process.env.DB_PORT || 3306,
    DATABASE_URL: process.env.DATABASE_URL,

    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5002,

    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5242880
};

export default ENV;