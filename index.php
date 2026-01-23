<?php
try{
    if (!function_exists('validate')) {
        require_once 'validation.php';
    }
    validate();
}catch(Exception $e){
    die($e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="./index.css">
</head>
<body>
    <div class="tablet" id="1">
        <div class="header nomouse"><h1>New Tablet</h1></div>
        <div class="body nomouse">
            Content
        </div>
        <div class="footer nomouse">
            Notes
        </div>
    </div>

    <div id="action-menu">
        <span id="add-tablet">Add Tablet</span>
        <br>
        <span id="edit-tablet">Edit Tablet</span>
        <br>
        <span id="delete-tablet">Delete Tablet</span>
        <hr>
        <span id="add-connections">Add Connection</span>
        <br>
        <span id="remove-connections">Remove Connections</span>
        <hr>
        <span id="save-board">Save Board</span>
    </div>

    <svg id="lines-svg">
        <line id="TheLine" x1="0" y1="0" x2="0" y2="0" stroke="black" stroke-width="6"/>
    </svg>
    <main id="dash-body">
        <div id="mpop">
            <h3 id="mpop-title"></h3>
            <div id="mpop-edit">
                <form id="ch-tablet-form">
                    <label for="ch-id">Tablet Id: </label>
                    <input type="text" id="ch-id" name="ch-id">
                    <br>
                    <label for="ch-title">Tablet Title: </label>
                    <input type="text" id="ch-title" name="ch-title">
                    <br>
                    <label for="ch-content">Table Content: </label>
                    <input type="text" id="ch-content" name="ch-content">
                    <br>
                    <label for="ch-notes">Tablet Notes: </label>
                    <input type="text" id="ch-notes" name="ch-notes">
                    <br>
                    <label for="ch-color">Tablet Color: </label>
                    <input type="color" id="ch-color" name="ch-color">
                    <br>
                    <input type="submit" id="ch-sub">
                </form>
            </div>
            <div id="mpop-dash-settings"></div>
            <div id="mpop-connect">
                <form>
                    <label for="connect">Connect with id(): </label>
                    <input type="text" id="connect" name="connect">

                    <input type="submit" id="connect-sub">
                </form>
            </div>
        </div>
    </main>
    <script src="/javascript/dashboard.js"></script>
</body>
</html>