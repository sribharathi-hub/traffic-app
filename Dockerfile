# ---------- BASE ----------
FROM node:18

# Install Java (required for TrafficFlow.jar)
RUN apt-get update && apt-get install -y openjdk-21-jdk

# Set working directory
WORKDIR /app

# ---------- COPY FILES ----------
# Copy backend first (better caching)
COPY backend ./backend

# Install backend dependencies
WORKDIR /app/backend
RUN npm install --omit=dev

# Go back to root
WORKDIR /app

# Copy Java JAR + models (CRITICAL)
COPY TrafficFlow.jar .
COPY models ./models

# Optional: copy dataset if needed
# COPY src/train_20k.json ./src/train_20k.json

# ---------- ENV ----------
ENV PORT=5000

# ---------- EXPOSE ----------
EXPOSE 5000

# ---------- RUN ----------
CMD ["node", "backend/server.js"]