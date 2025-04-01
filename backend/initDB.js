// backend/initDB.js

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Password1234' // Replace with your MySQL password
});

const databaseName = 'bowie_tech_discount';

// Step 1: Create Database if it doesn't exist
db.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`, (err) => {
  if (err) {
    console.error('❗️ Error creating database:', err);
    process.exit(1);
  }
  console.log('✅ Database created or already exists');

  // Step 2: Connect to the newly created database
  db.changeUser({ database: databaseName }, (err) => {
    if (err) {
      console.error('❗️ Error switching database:', err);
      process.exit(1);
    }

    // Step 3: Create products table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        discount_price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      )
    `;

    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('❗️ Error creating table:', err);
        process.exit(1);
      }
      console.log('✅ Products table created or already exists');

      // Step 4: Insert mock data
      const insertProducts = `
        INSERT INTO products (name, price, discount_price, image_url) VALUES
        ('MacBook Pro 14-inch', 1999.99, 1699.99, 'https://via.placeholder.com/200x150?text=MacBook+Pro'),
        ('Dell XPS 13', 1399.99, 1199.99, 'https://via.placeholder.com/200x150?text=Dell+XPS+13'),
        ('iPhone 14 Pro', 999.99, 849.99, 'https://via.placeholder.com/200x150?text=iPhone+14+Pro'),
        ('Samsung Galaxy S23', 899.99, 749.99, 'https://via.placeholder.com/200x150?text=Galaxy+S23'),
        ('Lenovo ThinkPad X1', 1499.99, 1299.99, 'https://via.placeholder.com/200x150?text=ThinkPad+X1')
        ON DUPLICATE KEY UPDATE id=id;
      `;

      db.query(insertProducts, (err) => {
        if (err) {
          console.error('❗️ Error inserting mock data:', err);
          process.exit(1);
        }
        console.log('✅ Mock product data inserted');
        db.end();
      });
    });
  });
});