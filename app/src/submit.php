<?php
// This file handles user registration, login, session management, and logout.
// Modify only if you know what you're doing, as it directly affects user authentication and security.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once 'validation.php';
    global $pdo;
    form_submit($pdo);
} else {
    header('Location: login.php');
    exit();
}