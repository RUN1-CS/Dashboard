<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="./index.css">
</head>
<body>
    <main>
        <form method="POST" action="/validation.php">
            <input type="hidden" name="type" value="register">
            <label for="username_reg">Username: </label>
            <input type="text" name="username_reg" id="username_reg" required><br>
            <label for="email_reg">Email: </label>
            <input type="email" name="email_reg" id="email_reg" placeholder="Email" required><br>
            <label for="passwd_reg">Password: </label>
            <input type="password" name="passwd_reg" id="passwd_reg" minlength="8" required><br>
            <label for="passwd_verify">Verify Password: </label>
            <input type="password" name="passwd_verify" id="passwd_verify" minlength="8" required><br>
            <div id="strengthBarContainer">
                <div id="strengthBar"></div>
            </div>
            <button type="submit" id="reg_sub">Register</button>
        </form>
        <br>
        <form method="POST" action="/validation.php">
            <input type="hidden" name="type" value="login">
            <label for="username_login">Username: </label>
            <input type="text" name="username_login" id="username_login" required><br>
            <label for="passwd_login">Password: </label>
            <input type="password" name="passwd_login" id="passwd_login" minlength="8" required><br>
            <button type="submit" id="login_sub">Login</button>
        </form>
        <script src="/javascript/login.js"></script>
    </main>
</body>
