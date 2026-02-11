<?php
define('SESSION_SECRET', getenv('SESSION_SECRET') ?: 'default_secret');
define('KEY_LENGHT', 64);
define('CIPHER_ALGO', 'aes-256-gcm');
define('OUTSIDE_HOSTS_ONLY', true);
define('TOKEN_LIFE', (12 * 60 * 60));

// DB credentials
$db   = getenv('DB_NAME') ?: 'dashboard';
$user = getenv('DB_USER') ?: 'dash_user';
$passwd = getenv('DB_PASSWORD') ?: null;
$dsn = null;
if($passwd && $passwd !== ''){
    $dsn = "pgsql:dbname=$db;password=$passwd";
}else{
    $dsn = "pgsql:dbname=$db";
}

try {
    $pdo = new PDO($dsn, $user, $passwd);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection error: " . $e->getMessage());
}
?>
