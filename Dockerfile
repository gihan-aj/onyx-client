# Stage 1: Build the Angular application
# We use a specific Node.js version. It's good practice to match the version you use locally.
FROM node:22 AS build
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production. 
# The output will be in the /dist/{your-app-name} folder.
# The --configuration production flag enables various optimizations.
RUN npm run build -- --configuration production

# Stage 2: Serve the application with NGINX
# NGINX is a very lightweight and high-performance web server.
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove the default NGINX welcome page
RUN rm -rf ./*

# Copy the built application files from the 'build' stage
# IMPORTANT: Project's name in angular.json
COPY --from=build /usr/src/app/dist/onyx-client/browser/ .

# Copy the custom NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to allow traffic to the web server
EXPOSE 80