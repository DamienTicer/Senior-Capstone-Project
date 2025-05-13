const express = require('express');
const router = express.Router();
const connection = require('../initDB');

// POST /api/checkout
router.post('/', (req, res) => {
  const { userId, userEmail, cartItems, total, tax, shipping } = req.body;

  if (!userEmail || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'Invalid checkout data' });
  }

  const orderTime = new Date();

  // Save each item in purchase history
  const insertQuery = `
    INSERT INTO purchase_history (user_email, product_name, product_price, quantity)
    VALUES (?, ?, ?, ?)
  `;

  const insertAll = cartItems.map(item => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    const quantity = item.quantity || 1;

    return new Promise((resolve, reject) => {
      connection.query(insertQuery, [userEmail, item.name, price, quantity], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  });

  Promise.all(insertAll)
    .then(() => {
      // Cleanup: Keep only the 5 most recent purchases for that user
      const cleanupQuery = `
        DELETE FROM purchase_history
        WHERE user_email = ?
        AND id NOT IN (
          SELECT id FROM (
            SELECT id FROM purchase_history
            WHERE user_email = ?
            ORDER BY purchased_at DESC
            LIMIT 5
          ) as recent
        );
      `;
      connection.query(cleanupQuery, [userEmail, userEmail], (err) => {
        if (err) {
          console.error('Cleanup error:', err);
          return res.status(500).json({ message: 'Purchase recorded but cleanup failed.' });
        }

        res.status(200).json({ message: 'Checkout completed and purchase history saved.' });
      });
    })
    .catch(err => {
      console.error('Purchase history error:', err);
      res.status(500).json({ message: 'Failed to save purchase history.' });
    });
});

// GET /api/purchaseHistory/:email
router.get('/purchaseHistory/:email', (req, res) => {
  const email = req.params.email;

  const query = `
    SELECT product_name, product_price, quantity, purchased_at
    FROM purchase_history
    WHERE user_email = ?
    ORDER BY purchased_at DESC
    LIMIT 5;
  `;

  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error('❗️ Error fetching purchase history:', err);
      return res.status(500).json({ message: 'Failed to retrieve history.' });
    }

    res.status(200).json({ history: results });
  });
});

// GET /api/recommendations/:email
router.get('/recommendations/:email', (req, res) => {
  const userEmail = req.params.email;

  // 1. Get all products the user has already purchased
  const purchasedQuery = `SELECT DISTINCT product_name FROM purchase_history WHERE user_email = ?`;

  connection.query(purchasedQuery, [userEmail], (err, userProducts) => {
    if (err) return res.status(500).json({ message: 'Error fetching user history' });

    const purchasedNames = userProducts.map(p => p.product_name);
    if (purchasedNames.length === 0) return res.json({ recommendations: [] });

    // 2. Find popular products that others have purchased but the user has not
    const placeholders = purchasedNames.map(() => '?').join(',');
    const popularQuery = `
      SELECT product_name, COUNT(*) as count
      FROM purchase_history
      WHERE product_name NOT IN (${placeholders})
      GROUP BY product_name
      ORDER BY count DESC
      LIMIT 5;
    `;

    connection.query(popularQuery, purchasedNames, (err, results) => {
      if (err) return res.status(500).json({ message: 'Error generating recommendations' });
      res.json({ recommendations: results });
    });
  });
});

module.exports = router;