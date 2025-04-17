const express = require('express');
const router = express.Router();

router.get('/api/external-products', (req, res) => {
  res.json([
    {
      name: 'Echo Dot (5th Gen)',
      price: 49.99,
      discount_price: 39.99,
      image_url: 'https://m.media-amazon.com/images/I/61ym3wDjTRL._AC_SL1000_.jpg'
    },
    {
      name: 'Kindle Paperwhite',
      price: 139.99,
      discount_price: 119.99,
      image_url: 'https://m.media-amazon.com/images/I/61D0fVTwRDL._AC_SL1000_.jpg'
    }
  ]);
});

module.exports = router;