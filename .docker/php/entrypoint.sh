#!/bin/sh
set -e

# Set permissions for Laravel directories
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true
chmod -R 775 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true

# Ensure directories exist and are writable
mkdir -p /var/www/storage/logs
mkdir -p /var/www/storage/framework/cache
mkdir -p /var/www/storage/framework/sessions
mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/bootstrap/cache

# Alternative: Set more permissive permissions if chmod fails
if [ ! -w "/var/www/bootstrap/cache" ]; then
    chmod 777 /var/www/bootstrap/cache 2>/dev/null || true
    chmod 777 /var/www/storage -R 2>/dev/null || true
fi

# permissions for PHPMyAdmin
mkdir -p /sessions
chmod 777 /sessions 2>/dev/null || true

# Start nginx in the background
nginx -g "daemon off;" &

# Execute the main command (usually php-fpm)
exec "$@"