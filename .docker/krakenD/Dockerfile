# Use official KrakenD image
FROM krakend:2.11

# Set maintainer label
LABEL maintainer="Developer <dev@example.com>"

# Copy KrakenD configuration
COPY krakend.json /etc/krakend/krakend.json

# Create logs directory
RUN mkdir -p /var/log/krakend

# Expose port 8080 for API Gateway
EXPOSE 8080

# Expose port 8090 for metrics
EXPOSE 8090

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/__health || exit 1

# Start KrakenD
CMD ["krakend", "run", "-d", "-c", "/etc/krakend/krakend.json"]