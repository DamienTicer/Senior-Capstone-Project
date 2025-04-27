import React from 'react';
import ProductSlider from './ProductSlider';

const Home = () => {
  return (
    <div>
      <img
      src="/img1/bsu2.png"
      alt="Bowie State Logo"  
      style={{ height: '600px', marginBottom: '20px' }}
      />
      <h1>Welcome to Bowie State Product Store</h1>
      <ProductSlider />
    </div>
  );
};

export default Home;
