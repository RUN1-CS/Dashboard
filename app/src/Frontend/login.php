<?php

// This file handles user registration, login, session management, and logout.
// Modify only if you know what you're doing, as it directly affects user authentication and security.

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="./css/index.css">
    <link rel="stylesheet" href="./css/login.css">
</head>
<body>
    <main id="forms">
        <form method="POST" action="/validation.php">
            <table>
                <caption><h2>Register</h2></caption>
                <input type="hidden" name="type" value="register">
                <tr>
                    <td><label for="username_reg">Username: </label></td>
                    <td><input type="text" name="username_reg" id="username_reg" required></td>
                </tr>
                <tr>
                    <td><label for="email_reg">Email: </label></td>
                    <td><input type="email" name="email_reg" id="email_reg" required></td>
                </tr>
                <tr>
                    <td><label for="passwd_reg">Password: </label></td>
                    <td><input type="password" name="passwd_reg" id="passwd_reg" minlength="8" required>
                        <div id="strengthBarContainer">
                            <div id="strengthBar"></div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label for="passwd_verify">Verify Password: </label></td>
                    <td><input type="password" name="passwd_verify" id="passwd_verify" minlength="8" required></td>
                </tr>
                <tr>
                    <td colspan="2"><button type="submit" id="reg_sub">Register</button></td>
                </tr>
            </table>
        </form>
        <br>
        <form method="POST" action="/validation.php">
            <table>
                <caption><h2>Login</h2></caption>
                <input type="hidden" name="type" value="login">
                <tr>
                    <td><label for="username_login">Username: </label></td>
                    <td><input type="text" name="username_login" id="username_login" required></td>
                </tr>
                <tr>
                    <td><label for="passwd_login">Password: </label></td>
                    <td><input type="password" name="passwd_login" id="passwd_login" minlength="8" required></td>
                </tr>
                <tr>
                    <td colspan="2"><button type="submit" id="login_sub">Login</button></td>
                </tr>
            </table>
        </form>
        <script src="/javascript/login.js"></script>
    </main>
</body>
</html>