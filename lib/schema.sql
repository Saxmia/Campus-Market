-- 1. 用户表 User
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

-- 2. 商品表 Item
CREATE TABLE IF NOT EXISTS items (
    item_id VARCHAR(50) PRIMARY KEY,
    item_name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status INT DEFAULT 0 CHECK (status IN (0, 1)), -- 0: 未售出, 1: 已售出
    seller_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

-- 3. 订单表 Orders
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(50) PRIMARY KEY,
    item_id VARCHAR(50) NOT NULL UNIQUE, -- 每个商品最多只能被交易一次
    buyer_id VARCHAR(50) NOT NULL,
    order_date DATE NOT NULL,
    FOREIGN KEY (item_id) REFERENCES items(item_id),
    FOREIGN KEY (buyer_id) REFERENCES users(user_id)
);

-- 视图：已售商品视图
CREATE OR REPLACE VIEW sold_items_view AS
SELECT i.item_name, o.buyer_id
FROM items i
JOIN orders o ON i.item_id = o.item_id;

-- 视图：未售商品视图
CREATE OR REPLACE VIEW unsold_items_view AS
SELECT * FROM items WHERE status = 0;

-- 初始数据插入
INSERT INTO users (user_id, user_name, phone) VALUES
('u001', 'ZhangSan', '13800000001'),
('u002', 'LiSi', '13800000002'),
('u003', 'WangWu', '13800000003'),
('u004', 'ZhaoLiu', '13800000004')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO items (item_id, item_name, category, price, status, seller_id) VALUES
('i001', 'CalculusBook', 'Book', 20, 0, 'u001'),
('i002', 'DeskLamp', 'DailyGoods', 35, 1, 'u002'),
('i003', 'Microcontroller', 'Electronics', 80, 0, 'u001'),
('i004', 'Chair', 'Furniture', 50, 1, 'u003'),
('i005', 'WaterBottle', 'DailyGoods', 15, 0, 'u004')
ON CONFLICT (item_id) DO NOTHING;

INSERT INTO orders (order_id, item_id, buyer_id, order_date) VALUES
('o001', 'i002', 'u001', '2024-05-01'),
('o002', 'i004', 'u002', '2024-05-03')
ON CONFLICT (order_id) DO NOTHING;
