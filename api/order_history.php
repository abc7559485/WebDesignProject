<?php
session_start();
require_once '../includes/db.php';

header('Content-Type: application/json');

// 未登入則拒絕
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "未登入，無法查詢訂單紀錄"]);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    // 取得該使用者所有訂單
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $result = [];

    foreach ($orders as $order) {
        $stmtItems = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $stmtItems->execute([$order['id']]);
        $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        $result[] = [
            "order_id" => $order["id"],
            "total" => $order["total"],
            "created_at" => $order["created_at"],
            "items" => $items
        ];
    }

    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "查詢失敗", "error" => $e->getMessage()]);
}
?>
