# Stage 1: Build stage
FROM node:lts-alpine AS build

# Install PNPM
RUN npm install -g pnpm

# Workdir
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy
COPY . .

# Build
RUN pnpm build

# Stage 2: Production stage
FROM nginx:alpine

# Salin hasil build 
COPY --from=build /app/dist /usr/share/nginx/html

#salin config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 
EXPOSE 80

# Run
CMD ["nginx", "-g", "daemon off;"]
