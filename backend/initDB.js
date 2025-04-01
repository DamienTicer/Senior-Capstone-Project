// backend/initDB.js

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Password1234'
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

    // Step 3: Drop products table if it exists
    const dropTableQuery = `DROP TABLE IF EXISTS products`;

    db.query(dropTableQuery, (err) => {
      if (err) {
        console.error('❗️ Error dropping table:', err);
        process.exit(1);
      }
      console.log('✅ Products table dropped (if existed)');

      // Step 4: Create products table
      const createTableQuery = `
        CREATE TABLE products (
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
        console.log('✅ Products table created');

        // Step 5: Insert mock data
        const insertProducts = `
          INSERT INTO products (name, price, discount_price, image_url) VALUES
          ('MacBook Air 2024', 1199.99, 999.99, 'http://localhost:3000/img/MacbookAir2024_2.jpg'),
          ('Microsoft Surface 2024', 1399.99, 1199.99, 'http://localhost:3000/img/MicrosoftSurface2024_2.jpg'),
          ('iPhone 16 Pro Max', 1099.99, 999.99, 'http://localhost:3000/img/iPhone16Promax2.jpg'),
          ('iPad 10th Gen', 499.99, 449.99, 'http://localhost:3000/img/iPad10thGen2.jpg'),
          ('Apple Watch Series 10', 399.99, 349.99, 'http://localhost:3000/img/AppleWatchSeries10_2.jpg');
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
});