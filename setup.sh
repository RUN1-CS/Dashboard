#!/bin/bash

#Warning: This script requires root privileges to run.
#Warning: This script hasn't been debugged at all, proceed with caution.

distro=$(cat /etc/os-release | grep ^ID= | cut -d '=' -f2)

if [ "$distro" == "ubuntu" ] || [ "$distro" == "debian" ]; then
    apt list --installed php mysql-server apache2 postgresql php-psql php-pdo 2>/dev/null | grep -q 'installed'
    if [ $? -ne 0 ]; then
        apt update
        apt install -y php mysql-server apache2 php-mysql libapache2-mod-php
        systemctl enable apache2
        systemctl start apache2
    else
        echo "All required packages are already installed."
    fi
elif [ "$distro" == "fedora" ] || [ "$distro" == "centos" ]; then
    dnf list installed php mysql-server httpd postgresql php-pgsql php-pdo 2>/dev/null | grep -q 'Installed'
    if [ $? -ne 0 ]; then
        dnf install -y php mysql-server httpd php-mysqlnd
        sudo postgresql-setup --initdb
        systemctl enable httpd
        systemctl start httpd
    else
        echo "All required packages are already installed."
    fi
else
    echo "Unsupported distribution. Please install PHP, MySQL, and Apache manually."
    exit 1
fi

echo "Do you want to set up the database now? (y/n)"
read setup_db

if [ "$setup_db" == "y" ]; then
    echo "Setting up the database..."
    sudo -i -u postgres
    psql -c "CREATE DATABASE dashboard;"
    echo "Enter the database username:"
    read db_user
    echo "Enter the database password:"
    read -s db_pass
    psql -c "CREATE USER $db_user WITH ENCRYPTED PASSWORD '$db_pass';"
    psql -c "GRANT SELECT, INSERT, UPDATE, DELETE ON DATABASE dashboard TO $db_user;"
    echo "Database and user created."
    echo "Creating tables..."
    psql -d dashboard -c "CREATE TABLE users( id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE, email TEXT NOT NULL UNIQUE, passwd TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW());"
    psql -d dashboard -c "CREATE TABLE sessions( id SERIAL PRIMARY KEY, hash TEXT NOT NULL UNIQUE, started_at TIMESTAMP DEFAULT NOW());"
    psql -d dashboard -c "CREATE TABLE boards( id SERIAL PRIMARY KEY, data JSONB NOT NULL , owner BIGINT NOT NULL UNIQUE, saved_at TIMESTAMP DEFAULT NOW());"
    echo "Tables created successfully."
    echo "Do you wish to create dash-config.php now? (y/n)"
    read create_config
    if [ "$create_config" == "y" ]; then
        echo "Creating dash-config.php..."
        cat <<EOL > dash-config.php<?php
\$db_host = 'localhost';
\$db_name = 'dashboard';
\$db_user = '$db_user';
\$db_pass = '$db_pass';
try {
    \$pdo = new PDO("pgsql:host=\$db_host;dbname=\$db_name", \$db_user, \$db_pass);
    \$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException \$e) {
    die("Database connection failed: " . \$e->getMessage());
}
?>
EOL
        echo "dash-config.php created."
    else
        echo "Skipping dash-config.php creation."
    fi
    echo "Database setup complete."
else
    echo "Skipping database setup."
fi

echo "Do you wish this machine to act as a web server? (y/n)"
read setup_webserver

if [ "$setup_webserver" == "y" ]; then
    echo "Configuring web server..."
    if [ "$distro" == "ubuntu" ] || [ "$distro" == "debian" ]; then
        cp -r * /var/www/html/
        chown -R www-data:www-data /var/www/html/
        systemctl restart apache2
    elif [ "$distro" == "fedora" ] || [ "$distro" == "centos" ]; then
        cp -r * /var/www/html/
        chown -R apache:apache /var/www/html/
        systemctl restart httpd
    fi
    echo "Web server configured."
else
    echo "Skipping web server configuration."
fi