const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./initDB'); // Import DB connection

app.use(cors());
app.use(express.json());

//POST /login
app.post('/login', (req, res) => {
  const { email } = req.body;

  if (!email || !email.endsWith('@students.bowiestate.edu')) {
    return res.status(400).json({ error: 'Invalid email domain' });
  }

  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkUserQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length > 0) {
      // User exists, update last_login
      const updateQuery = `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = ?`;
      connection.query(updateQuery, [email]);
      return res.json(results[0]);
    } else {
      // New user, insert
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

// GET /api/profile/:email
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
