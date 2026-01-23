<?php
    require 'dash-config.php';

    global $pdo;

    // Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $type = $_POST['type'] ?? '';
    if ($type === 'register') {
        $username = $_POST['username_reg'] ?? '';
        $email = $_POST['email_reg'] ?? '';
        $passwd = $_POST['passwd_reg'] ?? '';
        $passwd_verify = $_POST['passwd_verify'] ?? '';
        if ($passwd !== $passwd_verify) {
            echo "Passwords do not match\n";
        } else {
            register($pdo, $username, $email, $passwd);
        }
    } elseif ($type === 'login') {
        $username = $_POST['username_login'] ?? '';
        $passwd = $_POST['passwd_login'] ?? '';
        login($pdo, $username, $passwd);
    }
}
    function validate(){
        $user_id = null;
        if( !isset($_COOKIE['session_token']) ){
            header('Location: login.php');
            die("No session token");
        }else{
            global $pdo;
            $session_token = $_COOKIE['session_token'];
            $stmt = $pdo->prepare("SELECT user_id FROM sessions WHERE hash = :token");
            $stmt->execute([':token' => $session_token]);
            $user_id = $stmt->fetchColumn();
            $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
            $dbTime = new DateTimeImmutable($stmt->fetchColumn(), new DateTimeZone('UTC'));
            $invalid = ($now->getTimestamp() - $dbTime->getTimestamp()) >= 12 * 60 * 60;
            if( $invalid ){
                $stmt = $pdo->prepare("DELETE FROM sessions WHERE hash = :token");
                $stmt->execute([':token' => $session_token]);
                header('Location: login.php');
                die("Session expired");
            }
            if( !$user_id ){
                header('Location: login.php');
                die("Invalid session token");
            }
        }
        if(!$user_id){
            header('Location: login.php');
            die();
        }
        $ip = $_SERVER['REMOTE_ADDR'];
        if( $ip === 'localhost' || $ip === '127.0.0.1' || $ip === '::1' ){
        } else {
            die("Cannot access outside hosts");
        }
    }
    validate();

require 'dash-config.php';

// Register user
function register($pdo, $username, $email, $passwd) {
    try{
        $hash = password_hash($passwd, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO users (username, email, passwd) VALUES (:username, :email, :hashed_passwd)");
        $stmt->execute([
            ':username' => $username,
            ':email' => $email,
            ':hashed_passwd' => $hash
        ]);
    }catch(Exception $e){
        die("Registration failed: " . $e->getMessage());
        return;
    }
    login($pdo, $username, $passwd);
    echo "Registered and loggedin user: $username\n";
}

// Login user
function login($pdo, $username, $passwd) {
    $stmt = $pdo->prepare("SELECT passwd FROM users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    $storedHash = $stmt->fetchColumn();

    if ($storedHash && password_verify($passwd, $storedHash)) {
        $session_token = bin2hex(random_bytes(16));
        setcookie("session_token", $session_token, time() + (86400 * 30), "/");
        $stmt = $pdo->prepare("INSERT INTO sessions (hash, user_id) VALUES (:token, (SELECT id FROM users WHERE username = :username))");
        $stmt->execute([
            ':token' => $session_token,
            ':username' => $username
        ]);
        echo "Logged in!\n";
    } else {
        echo "Failed to log in\n";
    }
}

function fetch_user_id($pdo) {
    $stmt = $pdo->prepare("SELECT user_id FROM sessions WHERE hash = :token");
    $stmt->execute([':token' => $_COOKIE['session_token']]);
    return $stmt->fetchColumn();
}
?>