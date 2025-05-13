
const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming db connection is exported from a db.js

router.post('/checkout', async (req, res) => {
  const { userId, cartItems, total, tax, shipping } = req.body;

  try {
    const [orderResult] = await db.promise().execute(
      'INSERT INTO orders (user_id, total, tax, shipping) VALUES (?, ?, ?, ?)',
      [userId, total, tax, shipping]
    );
    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      await db.promise().execute(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.productId, item.quantity]
      );
    }

    await db.promise().execute('DELETE FROM cart WHERE user_id = ?', [userId]);
    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Checkout failed' });
  }
});

module.exports = router;
