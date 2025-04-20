const express = require('express'); // load Express library
const app = express();
const cors = require('cors'); // allows backend to accept requests from frontend on another port
const path = require('path'); // helps with static file path resolution
const connection = require('./initDB'); // Import DB connection

app.use(cors()); // allow the frontend to talk to Express app
app.use(express.json()); // make it easy to read data sent as JSON format stored in req.body

// Serve images from frontend/img
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));

// ================== LOGIN ==================
app.post('/login', (req, res) => {
  const { email } = req.body;

  if (!email || !email.endsWith('@students.bowiestate.edu')) {
    return res.status(400).json({ error: 'Invalid email domain' });
  }

  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkUserQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length > 0) {
      const updateQuery = `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = ?`;
      connection.query(updateQuery, [email]);
      return res.json(results[0]);
    } else {
      const insertQuery = `INSERT INTO users (email) VALUES (?)`;
      connection.query(insertQuery, [email], (err, result) => {
        if (err) return res.status(500).json({ error: 'Insert error' });

        const newUser = {
          id: result.insertId,
          email,
          created_at: new Date(),
          last_login: new Date()
        };
        res.json(newUser);
      });
    }
  });
});

// ================== PROFILE ==================
app.get('/api/profile/:email', (req, res) => {
  const { email } = req.params;
  const query = `SELECT * FROM users WHERE email = ?`;

  connection.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

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
    if (err) return res.status(500).json({ error: 'Database error' });

    // Ensure fallback to default image if image_url is empty or null
    const productsWithFallback = results.map(product => ({
      ...product,
      image_url:
        product.image_url && product.image_url.trim() !== ''
          ? product.image_url
          : 'default.jpg'
    }));

    res.json(productsWithFallback);
  });
});

// ================== START SERVER ==================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
