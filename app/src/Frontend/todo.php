<?php
/*
Project: Dashboard
Made by: Mysterio/Run1/Run1-cs
License: MIT

I hope you find this project useful and fun to use! If you have any questions or suggestions, feel free to reach out to me.
*/ 
define('BACKEND_PATH', '/var/www/html/Backend');

require BACKEND_PATH . '/validation.php';
global $pdo;
validate($pdo);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - To-Do List</title>
    <link rel="stylesheet" href="./css/index.css">
    <script src="./dist/todo.js" type="module"></script>
</head>
<body>
    <main id="dash-body">
        <div class="row">
            <a href="index.php">Plan Board List</a>
            <button id="save">Save</button>
            <!-- I will later add an account center -->
            <button id="logout">Logout</button>
        </div>
        <div id="todo-container">
            <h2>To-Do List</h2>
            <ul id="todo-list"></ul>
            <input type="text" id="new-todo" placeholder="New task...">
            <button id="add-todo">Add Task</button>
        </div>
    </main>
</body>
</html>