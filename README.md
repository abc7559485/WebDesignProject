# 🧋 清心茶飲電商系統（整合後端版）

本專案為期末作業「清心茶飲電子商務系統」，提供使用者客製化選購飲品、登入註冊、購物車管理、訂單結帳與歷史查詢等功能，前後端整合採用 **HTML / CSS / JavaScript + PHP + MySQL（XAMPP）**。

---

## 🔧 系統功能一覽

### 🔹 使用者端功能
- ✅ 飲品首頁推薦展示（隨機 3 款）
- ✅ 飲品總覽頁（含甜度 / 冰量 / 加料 / 數量自定義）
- ✅ 模態視窗查看與加入購物車
- ✅ 購物車預覽浮窗、刪除項目
- ✅ 結帳功能（登入後送出訂單）
- ✅ 使用者登入 / 註冊 / 登出
- ✅ 使用者中心查看個人資料與歷史訂單

### 🔹 後端功能（PHP + MySQL）
- ✅ 使用者註冊、登入、登出（session 實作）
- ✅ 飲料資料由後端資料庫供應（drinks.php）
- ✅ 購物車資料寫入 session（cart.php）
- ✅ 訂單提交並寫入資料庫（order.php）
- ✅ 歷史訂單查詢（order_history.php）

---

## 📁 專案目錄結構

```bash
.
├── index.html               # 首頁（推薦飲品）
├── drinks.html              # 飲品列表與客製化
├── login.html               # 登入頁面
├── register.html            # 註冊頁面
├── user.html                # 使用者中心（個人資料、訂單）
├── order_history.html       # 歷史訂單頁面
├── style.css                # 全站樣式
├── js/
│   ├── main.js              # 首頁邏輯
│   ├── drinks.js            # 飲料清單邏輯
│   └── cart.js              # 購物車管理邏輯
├── api/
│   ├── login.php
│   ├── register.php
│   ├── logout.php
│   ├── check_login.php
│   ├── drinks.php
│   ├── cart.php
│   ├── order.php
│   ├── order_history.php
├── includes/
│   └── db.php               # 資料庫連線
├── img/
│   └── drinks/              # 各式飲料圖片
└── install.php              # 一鍵初始化資料庫（選擇性）
```

---

## 🧪 快速啟動方式（使用 XAMPP）

1. 安裝 [XAMPP](https://www.apachefriends.org/)
2. 將專案放入 `htdocs/` 下的資料夾
3. 啟動 Apache 與 MySQL
4. 在瀏覽器輸入：
   ```bash
   http://localhost/你的資料夾/install.php  # 建立資料庫與預設飲料資料
   ```
5. 瀏覽首頁：
   ```bash
   http://localhost/你的資料夾/index.html
   ```

---

## 🗃️ 資料庫結構（MySQL）

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drinks (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price INT,
  image VARCHAR(255)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
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
```

## 🗃️ ERmodel
![ERmodel](https://github.com/user-attachments/assets/a149427c-76a1-40ab-bc92-0ee9e7538b14)


## 👥 分工表

| 項目         | 負責人   |
|--------------|----------|
| 主頁面       | 徐柏鈞   |
| 瀏覽頁面     | 洪群倫   |
| CSS Style     | 徐柏鈞   |
| 購物車     | 洪群倫   |
| 後端PHP整合     | 洪群倫   |
| 後端資料庫     | 徐柏鈞   |
| 登入、註冊頁面     | 徐柏鈞   |
| 個人資料頁面     | 徐柏鈞   |
| 資料表設計     | 洪群倫   |
| 簡報製作     | 洪群倫   |



## 🧋 項目作者

此專案為網頁設計期末作業用途，由 411177005 徐柏鈞 與 411177002 洪群倫 製作。


