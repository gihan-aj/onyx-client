# Dockerfile for Angular App

# --- Stage 1: The 'build' stage ---
# Use a Node.js image to build the application
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
# This leverages Docker caching
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# --- Stage 2: The 'final' stage ---
# Use a lightweight Nginx image to serve the static files
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Remove the default Nginx content
RUN rm -rf ./*

# Copy the built application from the 'build' stage
COPY --from=build /app/dist/onyx-client/browser/ .

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]