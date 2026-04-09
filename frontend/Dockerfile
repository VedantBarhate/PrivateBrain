# syntax=docker/dockerfile:1.2

# Stage 1: Build the Vite App
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code (Make sure .env is in .dockerignore!)
COPY . .

# Mount the secret to /app/.env ONLY during the build command
# Vite will read this temporarily mounted file and bake the variables into the static files.
RUN --mount=type=secret,id=frontend_env,target=/app/.env \
    npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built app to nginx docroot
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]