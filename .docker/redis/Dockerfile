# Use official Redis Alpine image for smaller size
FROM redis:7.2-alpine

# Set maintainer label
LABEL maintainer="Developer <dev@example.com>"
LABEL description="Redis server for microservices architecture"

# Install required packages for better process management
RUN apk add --no-cache curl

# Copy custom Redis configuration
COPY redis.conf /usr/local/etc/redis/redis.conf

# Create Redis directories and set permissions
RUN mkdir -p /data /var/log/redis && \
    chown -R redis:redis /data /var/log/redis /usr/local/etc/redis && \
    chmod 755 /data /var/log/redis && \
    chmod 644 /usr/local/etc/redis/redis.conf

# Set working directory
WORKDIR /data

# Expose Redis port
EXPOSE 6379

# Environment variables
ENV REDIS_PORT=6379 \
    REDIS_DATABASES=16 \
    REDIS_MAXMEMORY_POLICY=allkeys-lru

# Health check with improved reliability
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD redis-cli ping || exit 1

# Volume for persistent data
VOLUME ["/data"]

# Start Redis with custom configuration
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
