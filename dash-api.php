<?php
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';
require 'dash-config.php';
global $pdo;
require 'validation.php';
validate();
$user_id = fetch_user_id($pdo);
switch($action){
    case 'save':
        $JSONdata = $data['data'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM boards WHERE owner = :user_id");
        $stmt->execute([':user_id' => $user_id]);
        $exists = $stmt->fetchColumn();
        if( !$exists ){
            $stmt = $pdo->prepare("INSERT INTO boards (owner, data) VALUES (:user_id, :data)");
            $stmt->execute([':user_id' => $user_id, ':data' => json_encode($JSONdata)]);
            break;
        }
        $stmt = $pdo->prepare("UPDATE boards SET data = :data WHERE owner = :user_id");
        $stmt->execute([':data' => json_encode($JSONdata), ':user_id' => $user_id]);
        break;
    case 'load':
        $stmt = $pdo->prepare("SELECT data FROM boards WHERE owner = $user_id");
        $stmt->execute();
        $result = $stmt->fetchColumn();
        if(!$result){
            $result = '{"tablets":[],"lines":[]}';
        }
        echo $result;
        break;
}
?>