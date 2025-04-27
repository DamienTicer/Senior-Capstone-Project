// backend/initDB.js

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Saolaithe00@',
  database: 'bowie_tech_discount'
});

connection.connect(err => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  connection.query(createUsersTable, err => {
    if (err) throw err;
    console.log("🛠️ Users table ready");
  });

  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      discount_price DECIMAL(10, 2) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;
  connection.query(createProductsTable, err => {
    if (err) throw err;
    console.log("🛠️ Products table ready");

    const deleteQuery = `DELETE FROM products`;
    const insertMockProducts = `
      INSERT INTO products (name, price, discount_price, image_url) VALUES
      ('MacBook Air 2024', 1199.99, 999.99, 'img/MacbookAir2024_2.jpg'),
      ('Microsoft Surface 2024', 1399.99, 1199.99, 'img/MicrosoftSurface2024_2.jpg'),
      ('iPhone 16 Pro Max', 1099.99, 949.99, 'img/iPhone16Promax2.jpg'),
      ('iPad 10th Gen', 449.99, 379.99, 'img/iPad10thGen2.jpg'),
      ('Apple Watch Series 10', 499.99, 429.99, 'img/AppleWatchSeries10_2.jpg');
    `;

    connection.query(deleteQuery, err => {
      if (err) throw err;
      connection.query(insertMockProducts, err => {
        if (err) throw err;
        console.log("📦 Mock products inserted");
      });
    });
  });
});

module.exports = connection;
