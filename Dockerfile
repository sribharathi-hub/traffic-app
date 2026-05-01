# ---------- BASE WITH JAVA ----------
FROM openjdk:21-jdk-slim

# ---------- INSTALL NODE ----------
RUN apt-get update && apt-get install -y nodejs npm

# ---------- WORKDIR ----------
WORKDIR /app

# ---------- COPY FILES ----------
COPY backend ./backend
COPY TrafficFlow.jar .
COPY models ./models

# ---------- INSTALL NODE DEP ----------
WORKDIR /app/backend
RUN npm install --omit=dev

# ---------- BACK ----------
WORKDIR /app

# ---------- PORT ----------
EXPOSE 5000

# ---------- START ----------
CMD ["node", "backend/server.js"]