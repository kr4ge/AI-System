FROM node:20-alpine

# Install dependencies including ffmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure tmp directory exists with proper permissions
RUN mkdir -p /app/tmp && chmod -R 777 /app/tmp

EXPOSE 3001

CMD ["npm", "start"]
