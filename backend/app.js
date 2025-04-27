// backend/app.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const connection = require('./initDB');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images from frontend/img
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));

// Verify database connection
connection.connect(err => {
  if (err) {
    console.error('❗️ Database connection failed:', err.stack);
    process.exit(1);
  }
  console.log('✅ Database connection successful.');
});

// ====================== ROUTES ========================= //

// Home/Health Check
app.get('/', (req, res) => {
  res.send('Bowie Tech Discount API is running...');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running fine!' });
});

// ================== LOGIN ==================
app.post('/login', (req, res) => {
  const { email } = req.body;

  if (!email || !email.endsWith('@students.bowiestate.edu')) {
    return res.status(400).json({ message: 'Invalid email domain' });
  }

  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error('❗️ Database error on SELECT:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      const updateQuery = `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = ?`;
      connection.query(updateQuery, [email], err => {
        if (err) console.error('❗️ Database error on UPDATE:', err);
      });
      return res.json({
        message: 'Login successful!',
        user: results[0]
      });
    }

    const insertQuery = `INSERT INTO users (email) VALUES (?)`;
    connection.query(insertQuery, [email], (err, result) => {
      if (err) {
        console.error('❗️ Database error on INSERT:', err);
        return res.status(500).json({ message: 'Insert error' });
      }

      const newUser = {
        id: result.insertId,
        email,
        created_at: new Date(),
        last_login: new Date()
      };
      res.json({
        message: 'New user created successfully!',
        user: newUser
      });
    });
  });
});

// ================== REGISTER ==================
app.post('/register', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  if (!email.endsWith('@students.bowiestate.edu')) {
    return res.status(400).json({ message: 'Invalid email domain' });
  }

  console.log(`📝 Attempting to register: ${email}`);

  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error('❗️ Database error on SELECT (register):', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      console.warn(`⚠️ Email already exists: ${email}`);
      return res.status(409).json({ message: 'Account already exists' });
    }

    const insertQuery = `INSERT INTO users (email) VALUES (?)`;
    connection.query(insertQuery, [email], (err, result) => {
      if (err) {
        console.error('❗️ Database error on INSERT:', err);
        return res.status(500).json({ message: 'Registration failed' });
      }

      const newUser = {
        id: result.insertId,
        email,
        created_at: new Date(),
        last_login: new Date()
      };

      console.log(`✅ New user registered: ${email}`);
      res.json({
        message: 'Registration successful!',
        user: newUser
      });
    });
  });
});

// ================== PROFILE ==================
app.get('/api/profile/:email', (req, res) => {
  const { email } = req.params;
  const query = `SELECT * FROM users WHERE email = ?`;

  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('❗️ Database error on SELECT profile:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(results[0]);
  });
});

// ================== PRODUCTS ==================
app.get('/products', (req, res) => {
  const query = `SELECT * FROM products`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('❗️ Error fetching products:', err);
      return res.status(500).json({ message: 'Failed to fetch products' });
    }

    const productsWithFallback = results.map(product => ({
      ...product,
      image_url: product.image_url && product.image_url.trim() !== ''
        ? product.image_url
        : 'default.jpg'
    }));

    res.json(productsWithFallback);
  });
});

// ================== START SERVER ==================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
