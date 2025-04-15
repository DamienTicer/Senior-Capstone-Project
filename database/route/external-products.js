const express = require('express');
const router = express.Router();
const fetchAmazonProducts = require('../utils/amazonApi');

// Route: /api/external-products
router.get('/api/external-products', async (req, res) => {
  try {
    const products = await fetchAmazonProducts();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch external products' });
  }
});

module.exports = router;
