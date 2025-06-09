<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(["message" => "未登入，無法操作購物車"]);
  exit;
}

// 初始化購物車
if (!isset($_SESSION['cart'])) {
  $_SESSION['cart'] = [];
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
  case 'GET': // 取得購物車
    echo json_encode($_SESSION['cart']);
    break;

  case 'POST': // 新增商品
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
      http_response_code(400);
      echo json_encode(["message" => "資料錯誤"]);
      exit;
    }

    // 檢查是否已存在相同品項（相同名稱＋甜度＋冰塊＋加料）
    foreach ($_SESSION['cart'] as &$item) {
      if (
        $item['name'] === $data['name'] &&
        $item['sweetness'] === $data['sweetness'] &&
        $item['ice'] === $data['ice'] &&
        json_encode($item['toppings']) === json_encode($data['toppings'])
      ) {
        $item['quantity'] += $data['quantity'];
        $item['total'] += $data['totalPrice'];
        echo json_encode(["message" => "已合併項目"]);
        exit;
      }
    }

    // 加入新項目
    $_SESSION['cart'][] = [
      "name" => $data['name'],
      "sweetness" => $data['sweetness'],
      "ice" => $data['ice'],
      "toppings" => $data['toppings'],
      "quantity" => $data['quantity'],
      "total" => $data['totalPrice']
    ];
    echo json_encode(["message" => "已加入購物車"]);
    break;

  case 'DELETE': // 移除指定索引
    $index = $_GET['index'] ?? null;
    if (!is_numeric($index) || !isset($_SESSION['cart'][$index])) {
      http_response_code(400);
      echo json_encode(["message" => "索引錯誤"]);
      exit;
    }
    array_splice($_SESSION['cart'], $index, 1);
    echo json_encode(["message" => "已刪除"]);
    break;

  default:
    http_response_code(405);
    echo json_encode(["message" => "不支援的操作"]);
}
