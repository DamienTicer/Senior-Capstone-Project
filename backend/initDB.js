// backend/initDB.js
const mysql = require('mysql2/promise');

async function initDb() {
  // 1) Ensure DB exists
  const base = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password1234',
  });
  await base.query('CREATE DATABASE IF NOT EXISTS bowie_tech_discount');
  await base.end();
  console.log("📂 Database 'bowie_tech_discount' is ready");

  // 2) Connect to DB
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password1234',
    database: 'bowie_tech_discount',
    multipleStatements: true,
  });
  console.log('✅ Connected to MySQL (bowie_tech_discount)');

  // 3) Schema
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  console.log('🛠️ Users table ready');

  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      discount_price DECIMAL(10, 2) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `);
  console.log('🛠️ Products table ready');

  // 4) Seed products (safe for dev; remove for prod)
  await db.execute('DELETE FROM products');
  await db.execute(`
    INSERT INTO products (name, price, discount_price, image_url) VALUES
    ('MacBook Air 2024', 1199.99, 999.99, 'MacbookAir2024_2.jpg'),
    ('Microsoft Surface 2024', 1399.99, 1199.99, 'MicrosoftSurface2024_2.jpg'),
    ('iPhone 16 Pro Max', 1099.99, 949.99, 'iPhone16Promax2.jpg'),
    ('iPad 10th Gen', 449.99, 379.99, 'iPad10thGen2.jpg'),
    ('Apple Watch Series 10', 499.99, 429.99, 'AppleWatchSeries10_2.jpg'),
    ('Lenovo ThinkPad X1', 1099.99, 899.99, 'thinkpadx1.jpg'),
    ('Samsung Galaxy Tab S9', 799.99, 679.99, 'galaxyTabS9.jpg'),
    ('ASUS ZenBook 14', 999.99, 849.99, 'zenbook14.jpg'),
    ('Logitech MX Master 3S Mouse', 129.99, 99.99, 'mxmaster3s.jpg'),
    ('Razer Kraken V3 Headset', 119.99, 89.99, 'krakenv3.jpg');
  `);
  console.log('📦 Mock products inserted');

  await db.execute(`
    CREATE TABLE IF NOT EXISTS purchase_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      product_price DECIMAL(10, 2) NOT NULL,
      quantity INT DEFAULT 1,
      purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('🛍️ Purchase history table ready');

  return db;
}

module.exports = { initDb };