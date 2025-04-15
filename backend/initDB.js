//jared was here
const mysql = require('mysql2'); //loading Mysql library 
const connection = mysql.createConnection({  //setting up connection details with database
  host: 'localhost',
  user: 'root',
  password: 'Password1234', // update if needed
  database: 'bowie_tech_discount'
});

connection.connect(err => { //try to connect with DB, 
  if (err) throw err;//if it fails,throws an error
  console.log("Connected to MySQL"); //if it works, log success

  // Users Table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  connection.query(createUsersTable, err => { //sends the sql cmds to MySQL to actually create the table.
    if (err) throw err;
    console.log("Users table ready");
  });

  // Products Table
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
    console.log("Products table ready");

    // Clear and Insert Mock Products
    const deleteQuery = `DELETE FROM products`; //empties the products table before inserting new products
    const insertMockProducts = `
      INSERT INTO products (name, price, discount_price, image_url) VALUES
      ('MacBook Air 2024', 1199.99, 999.99, 'img/MacbookAir2024_2.jpg'),
      ('Dell XPS 13', 1399.99, 1199.99, 'img/MicrosoftSurface2024_2.jpg'),
      ('iPhone 16 Pro Max', 1099.99, 949.99, 'img/iPhone16Promax2.jpg'),
      ('Apple Watch Series 10', 499.99, 429.99, 'img/AppleWatchSeries10_2.jpg'),
      ('iPad 10th Gen', 449.99, 379.99, 'img/iPad10thGen2.jpg');
    `;
    connection.query(deleteQuery, err => {
      if (err) throw err;
      connection.query(insertMockProducts, err => {
        if (err) throw err;
        console.log("Mock products inserted");
      });
    });
  });
});

module.exports = connection;