<?php
require_once __DIR__ . '/dash-config.php';
require __DIR__ . '/validation.php';
validate($pdo);

global $pdo;

$input = file_get_contents('php://input');
$data = json_decode($input, true);
if ($data === null) {
    http_response_code(400);
    reply('error', 'Invalid JSON input');
    exit;
}

$action = $data['action'] ?? '';
$user_id = fetch_user_id($pdo);

switch($action){
    case 'save':
        try{
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
            reply('response', 'Successfully saved.');
        }catch(Exception $e){
            reply('error', 'Failed to save board: ' . $e->getMessage());
        }
        break;
    case 'load':
        $template = json_encode(["tablets" => [], "lines" => [], "todos" => []]);
        try{
            $stmt = $pdo->prepare("SELECT data FROM boards WHERE owner = :user_id");
            $stmt->execute([':user_id' => $user_id]);
            $result = $stmt->fetchColumn();
            if(!$result){
                $result = $template;
            }else if ($result === '' || !preg_match('/[^A-Za-z0-9]/', $result) || strtolower($result) === 'null') {
                $result = $template;
            }else{
                $decrypted = decryptData(json_decode($result, true), deriveKey());
                $result = $decrypted ? json_decode($decrypted, true) : $template;
            }
            reply('data', $result);
        }catch(Exception $e){
            reply('error', 'Failed to load board: ' . $e->getMessage());
        }
        break;
}
exit;

// Derives a key from the session secret for encryption/decryption
function deriveKey(): string{
    return hash_hkdf("sha256", SESSION_SECRET, KEY_LENGHT, CIPHER_ALGO);
}

// Encrypts data using AES-256-GCM and returns the ciphertext, nonce, and auth tag
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

// Decrypts data using AES-256-GCM and returns the plaintext, or false on failure

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

// Standardized API response function

function reply(string $type, mixed $message): void {
    // Ensure message is not empty
    if (is_string($message) && strlen(trim($message)) === 0) {
        $message = 'An error occurred, but no message was provided.';
        $type = 'error';
    }

    if($type === 'data'){
        echo json_encode($message, JSON_UNESCAPED_UNICODE | JSON_PARTIAL_OUTPUT_ON_ERROR);
        exit;
    }

    // Make sure string messages are UTF-8 clean
    if (is_string($message)) {
        $message = mb_convert_encoding($message, 'UTF-8', 'UTF-8');
    }

    // Always send exactly one JSON response
    header('Content-Type: application/json');
    echo json_encode([$type => $message], JSON_UNESCAPED_UNICODE | JSON_PARTIAL_OUTPUT_ON_ERROR);
    exit;
}