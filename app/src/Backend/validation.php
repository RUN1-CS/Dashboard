<?php
    require_once __DIR__ . '/dash-config.php';

    // Prepare token for validation
    function prepare_token(): string{
        $session_token = $_COOKIE['session_token'];
        return hash_hmac('sha256', $session_token, SESSION_SECRET);
    }

    // Redirect to login and die with message
    function redirect_n_die($issue="", $dest="login.php"): never{
        header("Location: $dest");
        die($issue);
    }

    // Check if session token is expired (12 hours by default)
    function check_time($dbData): bool{
        $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
        $dbTime = new DateTimeImmutable($dbData, new DateTimeZone('UTC'));
        return ($now->getTimestamp() - $dbTime->getTimestamp()) >= TOKEN_LIFE;
    }

    // Restrict access to outside hosts if enabled
    function check_host(): void{
        $ip = $_SERVER['REMOTE_ADDR'];
        if( $ip === 'localhost' || $ip === '127.0.0.1' || $ip === '::1' ){
        } else {
            die("Cannot access outside hosts");
        }
    }

    // Validate session token and host access
    function validate($pdo): bool{
        if( !isset($_COOKIE['session_token']) ){
            // Can't generate tokens, because its generated only upon login
            redirect_n_die("No session token");
        }

        //verify session token
        $computed_cookie = prepare_token();
        $stmt = $pdo->prepare("SELECT user_id, started_at FROM sessions WHERE hash = :token");
        $stmt->execute([':token' => $computed_cookie]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        // If no session found, redirect to login
        if( !$data ){
            redirect_n_die("Invalid session token or not logged in.");
        }

        //verify session expiry
        expireTokens($pdo);

        // If outside host access is restricted, check the host
        if(OUTSIDE_HOSTS_ONLY){
            check_host();
        }
        return true;
    }

    // Register user
    function register($username, $email, $passwd, $pdo) {
        try{
            $hash = password_hash($passwd, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT INTO users (username, email, passwd) VALUES (:username, :email, :hashed_passwd)");
            $stmt->execute([
                ':username' => $username,
                ':email' => $email,
                ':hashed_passwd' => $hash
            ]);
        }catch(Exception $e){
            redirect_n_die("Could not register user: " . $e->getMessage());
        }
        login( $username, $passwd, $pdo);
    }

    function generate_session_token(): string{
        $session_token = bin2hex(random_bytes(16));
        setcookie("session_token", $session_token, time() + (86400 * 30), "/");
        return $session_token;
    }

    // Login user
    function login($username, $passwd, $pdo) {
        $stmt = $pdo->prepare("SELECT passwd FROM users WHERE username = :username");
        $stmt->execute([':username' => $username]);
        $storedHash = $stmt->fetchColumn();

        if ($storedHash && password_verify($passwd, $storedHash)) {
            $ses_tok_hash = hash_hmac('sha256', generate_session_token(), SESSION_SECRET);
            $stmt = $pdo->prepare("INSERT INTO sessions (hash, user_id) VALUES (:token, (SELECT id FROM users WHERE username = :username))");
            $stmt->execute([
                ':token' => $ses_tok_hash,
                ':username' => $username
            ]);
        } else {
            redirect_n_die("Failed to log in");
        }
        header('Location: index.php');
        exit();
    }

    // Fetch user ID from session token
    function fetch_user_id($pdo): int{
        $computed_cookie = hash_hmac('sha256', $_COOKIE['session_token'], SESSION_SECRET);
        $stmt = $pdo->prepare("SELECT user_id FROM sessions WHERE hash = :token");
        $stmt->execute([':token' => $computed_cookie]);
        return $stmt->fetchColumn();
    }

    // Logout user
    function logout($pdo) {
        if (isset($_COOKIE['session_token'])) {
            $stmt = $pdo->prepare("DELETE FROM sessions WHERE hash = :token");
            $stmt->execute([':token' => hash_hmac('sha256', $_COOKIE['session_token'], SESSION_SECRET)]);
            setcookie("session_token", "", time() - 3600, "/");
        }
        header('Location: login.php');
        exit();
    }

    // Expire old tokens
    function expireTokens($pdo){
        $stmt = $pdo->query("SELECT hash, started_at FROM sessions");
        while( $row = $stmt->fetch(PDO::FETCH_ASSOC) ){
            if( check_time($row['started_at']) ){
                $delStmt = $pdo->prepare("DELETE FROM sessions WHERE hash = :token");
                $delStmt->execute([':token' => $row['hash']]);
            }
        }
    }

    function form_submit($pdo){
        // Handle form submission
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Login || Register
            $type = $_POST['type'] ?? '';

            if ($type === 'register') {
                $username = $_POST['username_reg'] ?? '';
                $email = $_POST['email_reg'] ?? '';
                $passwd = $_POST['passwd_reg'] ?? '';
                $passwd_verify = $_POST['passwd_verify'] ?? '';
                if ($passwd !== $passwd_verify) {
                    redirect_n_die("Passwords do not match");
                } else {
                    register( $username, $email, $passwd, $pdo);
                }
            } else if ($type === 'login') {
                $username = $_POST['username_login'] ?? '';
                $passwd = $_POST['passwd_login'] ?? '';
                login($username, $passwd, $pdo);
            } else if ($type === 'logout') {
                logout($pdo);
                header('Location: login.php');
                exit();
            }
            validate($pdo);
        }
    }