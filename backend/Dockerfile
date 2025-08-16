# Use the official Node.js image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Build the application
RUN npm run build

# Expose container port
EXPOSE 5000

# Run the application
CMD ["node", "dist/index.js"]