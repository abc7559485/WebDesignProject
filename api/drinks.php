<?php
require_once '../includes/db.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT * FROM drinks ORDER BY id ASC");
    $drinks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($drinks, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "資料載入失敗",
        "error" => $e->getMessage()
    ]);
}
?>