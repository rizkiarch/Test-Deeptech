FROM mysql:8.0

# Copy custom configuration with proper permissions
COPY my.cnf /etc/mysql/conf.d/custom.cnf

# Create log directory and set proper permissions
RUN mkdir -p /var/log/mysql && \
    chown mysql:mysql /var/log/mysql && \
    chmod 644 /etc/mysql/conf.d/custom.cnf && \
    chown mysql:mysql /etc/mysql/conf.d/custom.cnf

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=microservices_db
ENV MYSQL_USER=microservices_user
ENV MYSQL_PASSWORD=microservices_password

# Expose MySQL port
EXPOSE 3306

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD || exit 1
