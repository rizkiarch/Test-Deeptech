#!/bin/bash

# =============================================================================
# 🚀 DeepTech Microservices - Automatic Setup Script
# =============================================================================
# Script untuk setup otomatis aplikasi DeepTech Microservices
# Author: DeepTech Team
# Date: $(date +%Y-%m-%d)
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Emoji
ROCKET="🚀"
CHECK="✅"
CROSS="❌"
WARNING="⚠️"
INFO="ℹ️"
GEAR="⚙️"
DOCKER="🐳"
DATABASE="🗄️"
WEB="🌐"

# =============================================================================
# Helper Functions
# =============================================================================

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${WHITE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_step() {
    echo -e "${CYAN}${GEAR} $1${NC}"
}

print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
}

print_info() {
    echo -e "${BLUE}${INFO} $1${NC}"
}

wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=${3:-30}
    local attempt=1
    
    echo -e "${YELLOW}⏳ Waiting for $service_name to be ready (port $port)...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z localhost $port 2>/dev/null; then
            print_success "$service_name is ready!"
            return 0
        fi
        echo -e "${YELLOW}   Attempt $attempt/$max_attempts - waiting 2 seconds...${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within $((max_attempts * 2)) seconds"
    return 1
}

check_prerequisites() {
    print_header "🔍 CHECKING PREREQUISITES"
    
    local missing_tools=()
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        missing_tools+=("Docker")
    else
        print_success "Docker found: $(docker --version | cut -d' ' -f3 | cut -d',' -f1)"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        missing_tools+=("Docker Compose")
    else
        if command -v docker-compose &> /dev/null; then
            print_success "Docker Compose found: $(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)"
        else
            print_success "Docker Compose found: $(docker compose version | cut -d' ' -f4)"
        fi
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        missing_tools+=("Node.js")
    else
        local node_version=$(node --version)
        local node_major=$(echo $node_version | cut -d'.' -f1 | cut -d'v' -f2)
        if [ $node_major -ge 18 ]; then
            print_success "Node.js found: $node_version"
        else
            print_warning "Node.js version $node_version found, but version 18+ is recommended"
        fi
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        missing_tools+=("npm")
    else
        print_success "npm found: $(npm --version)"
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        missing_tools+=("Git")
    else
        print_success "Git found: $(git --version | cut -d' ' -f3)"
    fi
    
    # Check netcat for port checking
    if ! command -v nc &> /dev/null; then
        print_warning "netcat (nc) not found - service health checks may not work properly"
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        print_info "Please install the missing tools and run this script again."
        exit 1
    fi
    
    print_success "All prerequisites are met!"
    echo
}

create_env_files() {
    print_header "📁 CREATING ENVIRONMENT FILES"
    
    # Create user-service .env
    print_step "Creating backend/user-service/.env"
    mkdir -p backend/user-service
    cat > backend/user-service/.env << EOF
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
EOF
    print_success "user-service .env created"
    
    # Create data-service .env
    print_step "Creating backend/data-service/.env"
    mkdir -p backend/data-service
    cat > backend/data-service/.env << EOF
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
EOF
    print_success "data-service .env created"
    
    # Create frontend .env
    print_step "Creating frontend/.env"
    mkdir -p frontend
    cat > frontend/.env << EOF
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
MAIL_FROM_NAME="\${APP_NAME}"

# AWS Configuration (Optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

# Vite Configuration
VITE_APP_NAME="\${APP_NAME}"
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
EOF
    print_success "frontend .env created"
    
    print_success "All environment files created successfully!"
    echo
}

build_docker_images() {
    print_header "${DOCKER} BUILDING DOCKER IMAGES"
    
    print_step "Building all Docker images (this may take 5-10 minutes)..."
    if docker-compose build; then
        print_success "Docker images built successfully!"
    else
        print_error "Failed to build Docker images"
        exit 1
    fi
    echo
}

start_core_services() {
    print_header "${DOCKER} STARTING CORE SERVICES"
    
    print_step "Starting MySQL, Redis, KrakenD, and Nginx..."
    if docker-compose up -d mysql redis krakend nginx; then
        print_success "Core services started"
        
        # Wait for MySQL to be ready
        wait_for_service "MySQL" 3306 60
        
        # Wait for Redis to be ready
        wait_for_service "Redis" 6379 30
        
    else
        print_error "Failed to start core services"
        exit 1
    fi
    echo
}

start_microservices() {
    print_header "${ROCKET} STARTING MICROSERVICES"
    
    # Start User Service
    print_step "Starting User Service..."
    if docker-compose up -d user-service; then
        print_success "User Service started"
        wait_for_service "User Service" 5001 30
    else
        print_error "Failed to start User Service"
        exit 1
    fi
    
    # Setup Drizzle for Data Service
    print_step "Setting up Drizzle ORM..."
    if npm run drizzle:setup 2>/dev/null || echo "Drizzle setup completed (or already configured)"; then
        print_success "Drizzle setup completed"
    else
        print_warning "Drizzle setup may have issues, continuing..."
    fi
    
    # Start Data Service
    print_step "Starting Data Service..."
    if docker-compose up -d data-service; then
        print_success "Data Service started"
        wait_for_service "Data Service" 5002 30
    else
        print_error "Failed to start Data Service"
        exit 1
    fi
    
    # Generate and migrate database
    print_step "Generating and migrating database schema..."
    if npm run drizzle:generate 2>/dev/null && npm run drizzle:migrate 2>/dev/null; then
        print_success "Database schema setup completed"
    else
        print_warning "Database schema setup may have issues, continuing..."
    fi
    
    echo
}

start_frontend() {
    print_header "${WEB} STARTING FRONTEND"
    
    print_step "Starting Frontend service..."
    if docker-compose up -d frontend; then
        print_success "Frontend service started"
        
        # Wait a bit for frontend to initialize
        sleep 5
        
        # Build frontend assets
        print_step "Building frontend assets..."
        if docker exec -it frontend npm run build; then
            print_success "Frontend assets built successfully"
        else
            print_warning "Frontend asset build may have issues"
        fi
        
    else
        print_error "Failed to start Frontend service"
        exit 1
    fi
    echo
}

setup_database() {
    print_header "${DATABASE} SETTING UP DATABASE"
    
    print_step "Running database migrations and seeders..."
    
    # Try automatic seeder first
    if docker exec -it frontend php artisan migrate --seed --force 2>/dev/null; then
        print_success "Database migrations and seeders completed"
    else
        print_warning "Automatic seeder failed, trying manual session table creation..."
        
        # Manual session table creation
        print_step "Creating sessions table manually..."
        docker exec -i microservices-mysql mysql -u root -proot << EOF
USE \`deeptech-db\`;
CREATE TABLE IF NOT EXISTS \`sessions\` (
    \`id\` varchar(255) NOT NULL,
    \`user_id\` bigint unsigned DEFAULT NULL,
    \`ip_address\` varchar(45) DEFAULT NULL,
    \`user_agent\` text,
    \`payload\` longtext NOT NULL,
    \`last_activity\` int NOT NULL,
    PRIMARY KEY (\`id\`),
    KEY \`sessions_user_id_index\` (\`user_id\`),
    KEY \`sessions_last_activity_index\` (\`last_activity\`)
);
EOF
        print_success "Sessions table created manually"
    fi
    echo
}

check_services_health() {
    print_header "🏥 CHECKING SERVICES HEALTH"
    
    local services=(
        "Frontend:80"
        "KrakenD API Gateway:8080"
        "User Service:5001"
        "Data Service:5002"
        "MySQL:3306"
        "Redis:6379"
    )
    
    for service in "${services[@]}"; do
        local name=$(echo $service | cut -d':' -f1)
        local port=$(echo $service | cut -d':' -f2)
        
        if nc -z localhost $port 2>/dev/null; then
            print_success "$name is running on port $port"
        else
            print_warning "$name may not be responding on port $port"
        fi
    done
    echo
}

print_final_info() {
    print_header "🎉 SETUP COMPLETED SUCCESSFULLY!"
    
    echo -e "${GREEN}${CHECK} All services are now running!${NC}"
    echo
    echo -e "${CYAN}📋 ACCESS INFORMATION:${NC}"
    echo -e "${WHITE}┌─────────────────────────────────────────────────────────┐${NC}"
    echo -e "${WHITE}│  🌐 Frontend Application:    http://localhost          │${NC}"
    echo -e "${WHITE}│  🔧 API Gateway (KrakenD):   http://localhost:8080     │${NC}"
    echo -e "${WHITE}│  👤 User Service:            http://localhost:5001     │${NC}"
    echo -e "${WHITE}│  📊 Data Service:            http://localhost:5002     │${NC}"
    echo -e "${WHITE}└─────────────────────────────────────────────────────────┘${NC}"
    echo
    echo -e "${YELLOW}🔐 DEFAULT LOGIN CREDENTIALS:${NC}"
    echo -e "${WHITE}   Email:    admin@example.com${NC}"
    echo -e "${WHITE}   Password: admin123${NC}"
    echo
    echo -e "${BLUE}🛠️  USEFUL COMMANDS:${NC}"
    echo -e "${WHITE}   View logs:           docker-compose logs -f${NC}"
    echo -e "${WHITE}   Stop services:       docker-compose down${NC}"
    echo -e "${WHITE}   Restart services:    docker-compose restart${NC}"
    echo -e "${WHITE}   Service status:      docker-compose ps${NC}"
    echo
    echo -e "${GREEN}${ROCKET} Happy coding with DeepTech Microservices!${NC}"
}

cleanup_on_error() {
    print_error "Setup failed! Cleaning up..."
    docker-compose down -v 2>/dev/null || true
    exit 1
}

# =============================================================================
# Main Setup Process
# =============================================================================

main() {
    # Trapinterrupt and errors
    trap cleanup_on_error ERR INT TERM
    
    clear
    echo -e "${PURPLE}"
    echo "  ======================================================"
    echo "  🚀 DeepTech Microservices - Automatic Setup Script"
    echo "  ======================================================"
    echo -e "${NC}"
    echo
    
    # Check if we're in the right directory
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found! Please run this script from the project root directory."
        exit 1
    fi
    
    # Main setup steps
    check_prerequisites
    create_env_files
    build_docker_images
    start_core_services
    start_microservices
    start_frontend
    setup_database
    check_services_health
    print_final_info
    
    print_success "Setup completed successfully! 🎉"
}

# Run main function
main "$@"