<?php
$host = 'localhost';
$user = 'root';
$pass = ''; // XAMPP 預設空密碼
$dbname = 'midterm_project';

try {
    // 建立資料庫連線（無指定 DB）
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 建立資料庫
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `$dbname`;");

    // 建立 users 表
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // 建立 drinks 表
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS drinks (
            id INT PRIMARY KEY,
            name VARCHAR(100),
            description TEXT,
            price INT,
            image VARCHAR(255)
        );
    ");

    // 建立 orders 表
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            total INT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    ");

    // 建立 order_items 表
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT,
            drink_name VARCHAR(100),
            sweetness VARCHAR(20),
            ice VARCHAR(20),
            toppings TEXT,
            quantity INT,
            subtotal INT,
            FOREIGN KEY (order_id) REFERENCES orders(id)
        );
    ");

    // 匯入預設飲料資料
    $pdo->exec("
        INSERT IGNORE INTO drinks (id, name, description, price, image) VALUES
        (1, '茉香綠茶', '清新淡雅的綠茶香氣。', 35, 'img/drinks/jasmine-green-tea.jpg'),
        (2, '珍珠奶茶', '香濃奶茶搭配Q彈珍珠。', 50, 'img/drinks/bubble-milk-tea.jpg'),
        (3, '四季春茶', '介於綠與烏龍之間的爽口滋味。', 35, 'img/drinks/4season.jpg'),
        (4, '芒果綠茶', '果香與茶香的完美融合。', 55, 'img/drinks/mango-green.jpg'),
        (5, '冬瓜檸檬', '冬瓜的甘甜與檸檬的清爽。', 45, 'img/drinks/wintermelon-lemon.jpg'),
        (6, '紅茶拿鐵', '濃厚紅茶搭配香醇鮮奶。', 55, 'img/drinks/blacktea-latte.jpg'),
        (7, '奶蓋烏龍', '茶香濃郁搭配綿密奶蓋。', 60, 'img/drinks/oolong-cream.jpg'),
        (8, '百香雙響炮', '百香果加珍珠與椰果的熱鬧口感。', 55, 'img/drinks/passionfruit-mix.jpg'),
        (9, '黑糖鮮奶', '濃郁黑糖與鮮奶的完美搭配。', 60, 'img/drinks/brownsugar-milk.jpg');
    ");

    echo "<h2>✅ 資料庫與資料初始化完成！</h2>";
} catch (PDOException $e) {
    echo "<h2>❌ 建立失敗：</h2><pre>" . $e->getMessage() . "</pre>";
}
?>
