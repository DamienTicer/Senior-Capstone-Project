// frontend/Home.js
import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = './productPage.js'; // Assuming it's served as static
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <img
      src="/img1/bsu2.png"
      alt="Bowie State Logo"  
      style={{ height: '600px', marginBottom: '20px' }}
      />
      <h1>Welcome to Bowie State Product Store</h1>
      {/* Include your slider HTML inside this component or use index.html */}
    </div>
  );
};

export default Home;
