FROM node:18

RUN apt-get update && apt-get install -y default-jre

WORKDIR /app

COPY . .

WORKDIR /app/backend
RUN npm install

WORKDIR /app

EXPOSE 5000

CMD ["node", "backend/server.js"]