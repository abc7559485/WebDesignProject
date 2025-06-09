<?php
session_start();
require_once '../includes/db.php';

header('Content-Type: application/json');

// 驗證是否登入
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["message" => "未登入，無法送出訂單"]);
    exit;
}

// 檢查購物車是否存在
if (!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
    http_response_code(400);
    echo json_encode(["message" => "購物車為空"]);
    exit;
}

$cart = $_SESSION['cart'];
$user_id = $_SESSION['user_id'];
$total = 0;

foreach ($cart as $item) {
    $total += intval($item["total"]);
}

try {
    $pdo->beginTransaction();

    // 新增訂單主檔
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
    $stmt->execute([$user_id, $total]);
    $order_id = $pdo->lastInsertId();

    // 新增訂單明細
    $stmtItem = $pdo->prepare("
        INSERT INTO order_items (order_id, drink_name, sweetness, ice, toppings, quantity, subtotal)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    foreach ($cart as $item) {
        $stmtItem->execute([
            $order_id,
            $item["name"],
            $item["sweetness"],
            $item["ice"],
            implode(", ", $item["toppings"]),
            intval($item["quantity"]),
            intval($item["total"])
        ]);
    }

    $pdo->commit();

    // 清空購物車
    unset($_SESSION['cart']);

    echo json_encode(["message" => "付款成功，訂單已成功建立", "order_id" => $order_id]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["message" => "訂單建立失敗", "error" => $e->getMessage()]);
}
?>
