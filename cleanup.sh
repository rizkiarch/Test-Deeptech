#!/bin/bash

# =============================================================================
# 🧹 DeepTech Microservices - Cleanup Script
# =============================================================================
# Script untuk membersihkan containers dan volumes yang ada
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${WHITE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_step() {
    echo -e "${CYAN}🧹 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

main() {
    clear
    print_header "🧹 CLEANING UP DEEPTECH MICROSERVICES"
    
    print_step "Stopping all running containers..."
    docker-compose down -v --remove-orphans 2>/dev/null || true
    print_success "Containers stopped"
    
    print_step "Removing unused Docker images..."
    docker image prune -f 2>/dev/null || true
    print_success "Unused images removed"
    
    print_step "Removing unused Docker networks..."
    docker network prune -f 2>/dev/null || true
    print_success "Unused networks removed"
    
    print_step "Removing unused Docker volumes..."
    docker volume prune -f 2>/dev/null || true
    print_success "Unused volumes removed"
    
    print_step "Cleaning up environment files..."
    rm -f backend/user-service/.env 2>/dev/null || true
    rm -f backend/data-service/.env 2>/dev/null || true
    rm -f frontend/.env 2>/dev/null || true
    print_success "Environment files cleaned"
    
    print_success "Cleanup completed! You can now run ./setup.sh again"
}

main "$@"