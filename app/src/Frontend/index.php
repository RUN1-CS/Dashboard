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
    <title>Dashboard</title>
    <link rel="stylesheet" href="./css/index.css">
    <script src="./dist/dashboard.js" type="module"></script>
</head>
<body>
    <div id="action-menu">
        <span id="add-tablet">Add Tablet</span><br>
        <div class="tablet-req">
            <span id="edit-tablet">Edit Tablet</span><br>
            <span id="delete-tablet">Delete Tablet</span>
            <hr>
            <span id="add-connections">Add Connection</span><br>
            <span id="remove-connections">Remove Connections</span>
        </div>
        <hr>
        <span id="save-board">Save Board</span>
    </div>

    <svg id="lines-svg"></svg>
    <main id="dash-body">
        <div id="mpop">
            <h3 id="mpop-title"></h3>
            <div id="mpop-edit">
                <form id="ch-tablet-form" type="POST">
                    <label for="ch-id">Tablet Id: </label>
                    <input type="text" id="chId" name="chId">
                    <br>
                    <label for="ch-title">Tablet Title: </label>
                    <input type="text" id="chTitle" name="chTitle">
                    <br>
                    <label for="ch-content">Table Content: </label>
                    <input type="text" id="chContent" name="chContent">
                    <br>
                    <label for="ch-notes">Tablet Notes: </label>
                    <input type="text" id="chNotes" name="chNotes">
                    <br>
                    <label for="ch-color">Tablet Color: </label>
                    <input type="color" id="chColor" name="chColor">
                    <br>
                    <button type="submit" id="chSub">Submit Edit</button>
                </form>
            </div>
            <div id="mpop-dash-settings"></div>
            <div id="mpop-connect">
                <form id="connect-form" type="POST">
                    <label for="connect">Connect with id(): </label>
                    <input type="text" id="connect" name="connect">

                    <button type="submit" id="connect-sub">Connect</button>
                </form>
            </div>
        </div>
    </main>
</body>
</html>