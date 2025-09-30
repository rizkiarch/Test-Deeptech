# 🚀 Microservices Application

## 📋 Deskripsi Proyek
Aplikasi microservices dengan arsitektur modern menggunakan:
- **Frontend**: Laravel 11 + React 19 + TypeScript + Inertia.js
- **Backend**: Node.js microservices (User Service + Data Service)
- **API Gateway**: KrakenD
- **Database**: MySQL dengan Drizzle ORM
- **Cache**: Redis
- **Containerization**: Docker & Docker Compose

---

## 🛠️ Prasyarat Sistem

Pastikan sistem Anda sudah terinstall:
- ✅ **Docker Desktop** (versi terbaru)
- ✅ **Node.js** (versi 18+) 
- ✅ **npm** atau **yarn**
- ✅ **Git**
- ✅ **WSL2** (untuk Windows) atau Terminal Linux/macOS

---

## ⚙️ Langkah Instalasi

# Cara Mudah
Ke Path Folder

chmod +x setup.sh

./setup.sh

### 📂 **Langkah 1: Setup Environment Variables**

Buat file `.env` di setiap direktori berikut dengan isi yang sama:

#### 1️⃣ **File: `backend/user-service/.env`**
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=deeptech_user
DB_PASSWORD=deeptech_password
DB_NAME=deeptech-db

# Service Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=this-is-jwt-ikay
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### 2️⃣ **File: `backend/data-service/.env`**
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=deeptech_user
DB_PASSWORD=deeptech_password
DB_NAME=deeptech-db

# Service Configuration
PORT=5002
NODE_ENV=development

# JWT Configuration
JWT_SECRET=this-is-jwt-ikay
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

#### 3️⃣ **File: `frontend/.env`**
```bash
# Application Configuration
APP_NAME="DeepTech Frontend"
APP_ENV=development
APP_KEY=base64:8OoALTVpZKDHV5IePwhm4LqLelncEUh8jvlrUt6TJ/Q=
APP_DEBUG=true
APP_URL=http://localhost

# Localization
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

# Maintenance
APP_MAINTENANCE_DRIVER=file

# PHP Configuration
PHP_CLI_SERVER_WORKERS=4
BCRYPT_ROUNDS=12

# Logging
LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=deeptech-db
DB_USERNAME=deeptech_user
DB_PASSWORD=deeptech_password

# Session Configuration
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

# Cache Configuration
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database

# Redis Configuration
REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Email Configuration
MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

# AWS Configuration (Optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

# Vite Configuration
VITE_APP_NAME="${APP_NAME}"
VITE_API_URL=http://localhost/api

# Inertia Configuration
INERTIA_SSR_ENABLED=false
INERTIA_SSR_URL=http://127.0.0.1:13714

# Microservices URLs
API_GATEWAY_URL=http://krakend:8080
USER_SERVICE_URL=http://user-service:5001
DATA_SERVICE_URL=http://data-service:5002

# JWT Configuration (Same as backend)
JWT_SECRET=this-is-jwt-ikay
JWT_EXPIRES_IN=7d
```

---

### 🐳 **Langkah 2: Build & Start Services**

Jalankan perintah berikut **satu per satu** di terminal (pastikan Anda berada di root directory):

#### 1️⃣ **Build semua Docker images**
```bash
docker-compose build
```
*⏳ Proses ini membutuhkan waktu 5-10 menit pertama kali*

#### 2️⃣ **Start core services** (Database, Cache, API Gateway, Web Server)
```bash
docker-compose up -d mysql redis krakend nginx
```
*⏳ Tunggu sekitar 30 detik untuk MySQL selesai setup*

#### 3️⃣ **Start User Service**
```bash
docker-compose up -d user-service
```

#### 4️⃣ **Setup database schema untuk Data Service**
```bash
npm run drizzle:setup
```

#### 5️⃣ **Start Data Service**
```bash
docker-compose up -d data-service
```

#### 6️⃣ **Generate dan migrate database**
```bash
npm run drizzle:generate
npm run drizzle:migrate
```

#### 7️⃣ **Start Frontend Service**
```bash
docker-compose up -d frontend
```

#### 8️⃣ **Build frontend assets**
```bash
docker exec -it frontend npm run build
```

---

### 🗄️ **Langkah 3: Setup Database (Jika Diperlukan)**

Jika terjadi error pada frontend terkait database, jalankan perintah berikut:

#### **Option A: Automatic Seeder**
```bash
docker exec -it frontend php artisan migrate --seed
```

#### **Option B: Manual Database Setup** (Jika Option A gagal)
```bash
# Masuk ke container MySQL
docker exec -it microservices-mysql mysql -u root -proot

# Jalankan perintah SQL berikut:
USE `deeptech-db`;

CREATE TABLE IF NOT EXISTS `sessions` (
    `id` varchar(255) NOT NULL,
    `user_id` bigint unsigned DEFAULT NULL,
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text,
    `payload` longtext NOT NULL,
    `last_activity` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `sessions_user_id_index` (`user_id`),
    KEY `sessions_last_activity_index` (`last_activity`)
);

# Keluar dari MySQL
EXIT;
```

---

### 🔐 **Langkah 4: Login ke Aplikasi**

1. **Buka browser** dan akses: `http://localhost`
2. **Login menggunakan kredensial default:**
   - **Email**: `admin@example.com`
   - **Password**: `admin123`

---

## 🌐 **URL Akses Aplikasi**

| Service | URL | Deskripsi |
|---------|-----|-----------|
| **Frontend** | http://localhost | Aplikasi utama (Laravel + React) |
| **API Gateway** | http://localhost:8080 | KrakenD API Gateway |
| **User Service** | http://localhost:5001 | Microservice untuk autentikasi |
| **Data Service** | http://localhost:5002 | Microservice untuk data management |
| **MySQL** | localhost:3306 | Database server |
| **Redis** | localhost:6379 | Cache server |

---

## 🔧 **Perintah Berguna**

### **Melihat Status Container**
```bash
docker-compose ps
```

### **Melihat Logs Service**
```bash
# Log semua services
docker-compose logs -f

# Log service tertentu
docker-compose logs -f frontend
docker-compose logs -f user-service
docker-compose logs -f data-service
```

### **Restart Service**
```bash
# Restart service tertentu
docker-compose restart frontend

# Restart semua services
docker-compose restart
```

### **Stop & Clean Up**
```bash
# Stop semua services
docker-compose down

# Stop dan hapus volumes (data akan hilang)
docker-compose down -v
```

### **Masuk ke Container**
```bash
# Masuk ke frontend container
docker exec -it frontend bash

# Masuk ke MySQL container
docker exec -it microservices-mysql mysql -u root -proot
```

---

## 🛠️ **Troubleshooting**

### **❌ Problem: Port sudah digunakan**
**Solution**: Matikan service yang menggunakan port tersebut atau ubah port di `docker-compose.yml`

### **❌ Problem: Database connection error**
**Solution**: 
1. Pastikan MySQL container sudah running: `docker-compose logs mysql`
2. Tunggu beberapa detik untuk MySQL selesai startup
3. Restart frontend: `docker-compose restart frontend`

### **❌ Problem: Frontend tidak loading**
**Solution**:
1. Build ulang assets: `docker exec -it frontend npm run build`
2. Check logs: `docker-compose logs frontend`
3. Clear cache: `docker exec -it frontend php artisan cache:clear`

### **❌ Problem: API Gateway error**
**Solution**:
1. Pastikan semua microservices running
2. Restart KrakenD: `docker-compose restart krakend`
3. Check service health: `curl http://localhost:8080/api/health`

---

## 📚 **Fitur Aplikasi**

### **✅ Authentication System**
- Login/Logout dengan JWT
- Protected routes
- Role-based access

### **✅ CRUD Management**
- **Categories**: Manage product categories
- **Products**: Manage products with image upload
- **Transactions**: Stock in/out transactions
- **Users**: User management system

### **✅ Advanced Features**
- **Bulk Transactions**: Multiple transactions at once
- **Image Upload**: Product image management
- **Real-time Data**: Live updates with caching
- **Responsive Design**: Mobile-friendly interface

---

## 👥 **Tim Development**

Jika Anda mengalami masalah atau memiliki pertanyaan, silakan hubungi tim development atau buat issue di repository ini.

---

**🎉 Selamat! Aplikasi DeepTech sudah siap digunakan!**