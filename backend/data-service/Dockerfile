# Use the official Node.js 20 runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Create a non-root user to run the application
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Expose the port that the app runs on
EXPOSE 5002

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5002/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Define the command to run the application
CMD ["npm", "start"]