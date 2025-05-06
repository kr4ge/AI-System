# Use a lightweight Node.js base image
FROM node:20.12.2-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Run the app
CMD ["npm", "start"]
