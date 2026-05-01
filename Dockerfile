# Use Node base image
FROM node:18

# Install Java (JRE)
RUN apt-get update && apt-get install -y default-jre

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Go back to root
WORKDIR /app

# Expose port (Render uses dynamic port)
EXPOSE 5000

# Start server
CMD ["node", "backend/server.js"]