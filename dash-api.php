<?php
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';
require 'dash-config.php';
global $pdo;
require_once 'validation.php';
validate();
$user_id = fetch_user_id($pdo);
switch($action){
    case 'save':
        $JSONdata = $data['data'] ?? '';
        $JSONdata = json_encode(encryptData(json_encode($JSONdata), deriveKey()));

        $stmt = $pdo->prepare("SELECT * FROM boards WHERE owner = :user_id");
        $stmt->execute([':user_id' => $user_id]);
        $exists = $stmt->fetchColumn();
        if( !$exists ){
            $stmt = $pdo->prepare("INSERT INTO boards (owner, data) VALUES (:user_id, :data)");
            $stmt->execute([':user_id' => $user_id, ':data' => $JSONdata]);
            break;
        }
        $stmt = $pdo->prepare("UPDATE boards SET data = :data WHERE owner = :user_id");
        $stmt->execute([':data' => $JSONdata, ':user_id' => $user_id]);
        break;
    case 'load':
        $stmt = $pdo->prepare("SELECT data FROM boards WHERE owner = :user_id");
        $stmt->execute([':user_id' => $user_id]);
        $result = $stmt->fetchColumn();
        if(!$result){
            $result = '{"tablets":[],"lines":[]}';
        }else{
            $decrypted = decryptData(json_decode($result, true), deriveKey());
            $result = ($decrypted && $decrypted !== '') ? $decrypted : '{"tablets":[],"lines":[]}';
        }
        echo $result;
        break;
    case 'logout':
        logout($pdo);
        echo "Logged out";
        break;
}

function deriveKey(): string{
    return hash_hkdf("sha256", SESSION_SECRET, KEY_LENGHT, CIPHER_ALGO);
}

function encryptData(string $text, string $key): array{
    $nonce_lenght = openssl_cipher_iv_length(CIPHER_ALGO);
    $nonce = random_bytes($nonce_lenght);

    $ctxt = openssl_encrypt(
        $text,
        CIPHER_ALGO,
        $key,
        OPENSSL_RAW_DATA,
        $nonce,
        $auth_tag,
        "",
        16
    );

    return [
        'ctxt' => base64_encode($ctxt),
        'nonce' => base64_encode($nonce),
        'auth_tag' => base64_encode($auth_tag)
    ];
}

function decryptData(array $ctxt, string $key): string|false{
    return openssl_decrypt(
        base64_decode($ctxt['ctxt']),
        CIPHER_ALGO,
        $key,
        OPENSSL_RAW_DATA,
        base64_decode($ctxt['nonce']),
        base64_decode($ctxt['auth_tag']),
        ""
    );
}
?>