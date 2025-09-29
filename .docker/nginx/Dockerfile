# Use official nginx image as base
FROM nginx:1.25-alpine

# Set maintainer label
LABEL maintainer="Developer <dev@example.com>"

# Remove default nginx configuration
RUN rm /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Create directory for web files (will be mounted from host)
RUN mkdir -p /var/www/public

# Set proper permissions
RUN chown -R nginx:nginx /var/www
RUN chmod -R 755 /var/www

# Create directory for nginx logs
RUN mkdir -p /var/log/nginx

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]