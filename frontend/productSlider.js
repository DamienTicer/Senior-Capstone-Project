import React, { useEffect, useState } from 'react';
import './style.css';

const ProductSlider = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  return (
    <div id="product-slider">
      {products.map(product => (
        <div className="product-card" key={product.id}>
          <img
            className="product-img"
            src={`./img/${product.image_url}`}
            alt={product.name}
            onError={(e) => { e.target.src = './img/default.jpg'; }}
          />
          <h3>{product.name}</h3>
          <p>Original Price: ${product.price}</p>
          <p>Discount Price: ${product.discount_price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductSlider;
