// backend/app.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static images
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Password1234',
  database: 'bowie_tech_discount'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('MySQL Connected...');
});

// Routes

// Home Route
app.get('/', (req, res) => {
  res.send('Bowie Tech Discount API is running...');
});

// Get All Products
app.get('/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Student Email Login
app.post('/login', (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'Invalid email input' });
  }

  if (email.endsWith('@students.bowiestate.edu')) {
    return res.status(200).json({ message: 'Authentication successful' });
  } else {
    return res.status(401).json({ message: 'Invalid Bowie student email' });
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});