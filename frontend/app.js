// frontend/app.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import Login from './Login';
import Home from './Home';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// 🔥 Product rendering logic
document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/products')
    .then(response => response.json())
    .then(products => {
      const container = document.getElementById('product-slider');
      if (!container) return;

      container.innerHTML = '';

      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const imageFilename = product.image_url?.trim() || 'default.jpg';
        const imagePath = `./img/${imageFilename}`;

        productCard.innerHTML = `
          <img class="product-img" src="${imagePath}" alt="${product.name}" onerror="this.onerror=null; this.src='./img/default.jpg';" />
          <h3>${product.name}</h3>
          <p>Original Price: $${product.price}</p>
          <p>Discount Price: $${product.discount_price}</p>
        `;

        container.appendChild(productCard);
      });
    })
    .catch(error => console.error('Error fetching products:', error));
});
