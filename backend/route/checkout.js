
const express = require('express');
const router = express.Router();
const db = require('../db'); // Make sure you have a db.js that exports a mysql2 connection

router.post('/checkout', async (req, res) => {
  const { userId, userEmail, cartItems, total, tax, shipping } = req.body;

  try {
    // Insert into orders table (if used)
    const [orderResult] = await db.promise().execute(
      'INSERT INTO orders (user_id, total, tax, shipping) VALUES (?, ?, ?, ?)',
      [userId, total, tax, shipping]
    );
    const orderId = orderResult.insertId;

    // Insert each item into order_items and purchase_history
    for (const item of cartItems) {
      const quantity = item.quantity || 1;

      // Optional order_items table
      await db.promise().execute(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.productId || 0, quantity]
      );

      // ✅ Insert into purchase_history
      await db.promise().execute(
        'INSERT INTO purchase_history (user_email, product_name, quantity, price) VALUES (?, ?, ?, ?)',
        [userEmail, item.name, quantity, item.price]
      );
    }

    // Optionally clear cart here if persistent
    await db.promise().execute('DELETE FROM cart WHERE user_id = ?', [userId]);

    res.status(200).json({ message: 'Checkout successful and purchase history saved.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Checkout failed.' });
  }
});

module.exports = router;
