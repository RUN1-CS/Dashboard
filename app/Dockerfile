# PHP && Apache image
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Enable Apache modules
RUN a2enmod rewrite headers

# Copy Apache vhost configuration
COPY ./apache/vhost.conf /etc/apache2/sites-available/000-default.conf

# Copy app code
COPY app/src/ ./

# Optionally install Composer
COPY app/composer.json ./
# COPY app/composer.lock ./

# Install dependencies and PHP extensions
RUN apt-get update && \
    apt-get install -y libpq-dev && \
    docker-php-ext-install pdo pdo_pgsql && \
    rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install pdo pdo_pgsql

# Non-root user (if needed)
# RUN useradd -m appuser && chown -R appuser:www-data /var/www/html
# USER appuser

# Expose port 80
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]