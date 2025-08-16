# Build stage
FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run start

EXPOSE 8300

RUN npm run start

# Run the application
#CMD ["node", "dist/index.js"]