-- Initialization script untuk database
-- Script ini akan dijalankan otomatis saat container MySQL pertama kali dibuat

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS `deeptech-db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Gunakan database yang baru dibuat
USE `deeptech-db`;

-- Grant privileges untuk user
GRANT ALL PRIVILEGES ON `deeptech-db`.* TO 'deeptech_user'@'%';
FLUSH PRIVILEGES;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    birth_date DATE NOT NULL,
    gender ENUM('laki-laki', 'perempuan') NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Log
SELECT 'Database deeptech-db and users table initialized successfully' as status;