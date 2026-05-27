# --- Build stage for TypeScript --- #
FROM node:24 AS builder

WORKDIR /app/src/Frontend

# Copy package files and install dependencies
COPY app/src/Frontend/package*.json ./
RUN npm install

# Copy TypeScript source and compile
COPY app/src/Frontend/src/ ./src/
COPY app/src/Frontend/tsconfig.json ./
RUN npm run build

# --- Run Stage --- #

# PHP && Apache image
FROM php:8.2-apache

# 1. Install dependencies
RUN apt-get update && apt-get install -y libpq-dev && rm -rf /var/lib/apt/lists/*
RUN a2enmod rewrite headers proxy proxy_http
RUN docker-php-ext-install pdo pdo_pgsql

# 2. Set Working Directory
WORKDIR /var/www/html/Frontend

# 3. COPY THE PHP FILES FIRST (Crucial Step)
# This copies index.php, login.php, etc. from your host to the container
COPY app/src/Frontend/ ./

# 4. Copy compiled JS from builder into the dist folder
# This will overwrite/populate the dist folder inside /var/www/html/Frontend
COPY --from=builder /app/src/Frontend/dist/ ./dist/

# 5. Configuration & Permissions
COPY ./apache/vhost.conf /etc/apache2/sites-available/000-default.conf
RUN a2ensite 000-default.conf
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
CMD ["apache2-foreground"]