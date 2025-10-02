// backend/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const { initDb } = require('./initDB');           // async DB initializer
const checkoutRoutes = require('./route/checkout'); // uses req.app.locals.db

// --- create app BEFORE using it ---
const app = express();
app.use(cors());
app.use(express.json());

// Static assets (images)
app.use('/img', express.static(path.join(__dirname, '../frontend/img')));

// Basic health (no DB needed)
app.get('/', (_req, res) => res.send('Bowie Tech Discount API is starting…'));
app.get('/health', (_req, res) => res.status(200).json({ status: 'Server is up' }));

// Bootstrap DB, then mount DB-dependent routes and start server
(async () => {
  try {
    const db = await initDb();   // waits for DB create/connect/seed
    app.locals.db = db;

    // Mount routes that use the DB AFTER app.locals.db is set
    app.use('/api/checkout', checkoutRoutes);

    // ====== Your other routes (already converted to use req.app.locals.db) ======
    app.post('/login', async (req, res) => {
      try {
        const { email } = req.body;
        if (!email || !email.endsWith('@students.bowiestate.edu')) {
          return res.status(400).json({ message: 'Invalid email domain' });
        }
        const [users] = await req.app.locals.db.query(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );
        if (users.length > 0) {
          await req.app.locals.db.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = ?',
            [email]
          );
          return res.json({ message: 'Login successful!', user: users[0] });
        }
        const [ins] = await req.app.locals.db.query(
          'INSERT INTO users (email) VALUES (?)',
          [email]
        );
        return res.json({
          message: 'New user created successfully!',
          user: { id: ins.insertId, email, created_at: new Date(), last_login: new Date() }
        });
      } catch (err) {
        console.error('❗️ /login error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
    });

    app.post('/register', async (req, res) => {
      try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required.' });
        if (!email.endsWith('@students.bowiestate.edu')) {
          return res.status(400).json({ message: 'Invalid email domain' });
        }
        const [users] = await req.app.locals.db.query(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );
        if (users.length > 0) return res.status(409).json({ message: 'Account already exists' });
        const [ins] = await req.app.locals.db.query(
          'INSERT INTO users (email) VALUES (?)',
          [email]
        );
        return res.json({
          message: 'Registration successful!',
          user: { id: ins.insertId, email, created_at: new Date(), last_login: new Date() }
        });
      } catch (err) {
        console.error('❗️ /register error:', err);
        return res.status(500).json({ message: 'Registration failed' });
      }
    });

    app.get('/api/profile/:email', async (req, res) => {
      try {
        const { email } = req.params;
        const [rows] = await req.app.locals.db.query(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
        return res.json(rows[0]);
      } catch (err) {
        console.error('❗️ /api/profile error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
    });

    app.get('/products', async (req, res) => {
      try {
        const [rows] = await req.app.locals.db.query('SELECT * FROM products');
        const products = rows.map(p => ({
          ...p,
          image_url: p.image_url && p.image_url.trim() !== '' ? p.image_url : 'default.jpg'
        }));
        return res.json(products);
      } catch (err) {
        console.error('❗️ /products error:', err);
        return res.status(500).json({ message: 'Failed to fetch products' });
      }
    });

    app.delete('/api/deleteProfile/:email', async (req, res) => {
      try {
        const { email } = req.params;
        if (!email) return res.status(400).json({ message: 'Email is required.' });
        const [result] = await req.app.locals.db.query(
          'DELETE FROM users WHERE email = ?',
          [email]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        console.log(`✅ Deleted user: ${email}`);
        return res.json({ message: 'Profile deleted successfully.' });
      } catch (err) {
        console.error('❗️ /api/deleteProfile error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
    });

    const PORT = process.env.PORT || 3000; // don’t use 3306
    app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❗️ Failed to initialize database:', err);
    process.exit(1);
  }
})();