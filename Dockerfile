# Stage 1: Build the Angular application
# Using the Long-Term Support (LTS) version of Node.js (node:20) is more stable for production builds.
# The -alpine variant is smaller, leading to a more efficient build process.
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production.
RUN npm run build -- --configuration production

# Stage 2: Serve the application with NGINX
# NGINX is a very lightweight and high-performance web server.
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove the default NGINX welcome page
RUN rm -rf ./*

# Copy the built application files from the 'build' stage.
# The path is confirmed to be correct based on your angular.json.
COPY --from=build /usr/src/app/dist/onyx-client/browser/ .

# Copy the custom NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to allow traffic to the web server
EXPOSE 80