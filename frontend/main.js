// main.js

window.login = async function login() {
  const email = document.getElementById('email').value;

  if (!email || !email.endsWith('@students.bowiestate.edu')) {
    alert('Please enter a valid Bowie State student email');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok && data.user) {
      alert(data.message);
      document.getElementById("login-section").style.display = "none";
      document.getElementById("after-login").style.display = "block";
      loadProducts();
    } else {
      alert(data.message || 'Login failed.');
    }
  } catch (err) {
    alert('Error connecting to server');
    console.error(err);
  }
};

async function loadProducts() {
  try {
    const res = await fetch('http://localhost:3000/products');
    const products = await res.json();

    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach((item) => {
      const card = document.createElement("div");
      card.className = "deviceItem";
      card.innerHTML = `
        <img src="${item.image_url}" class="product-image" alt="${item.name}" />
        <h2 class="sliderTitle">${item.name}</h2>
        <p>Original Price: <s>$${item.price}</s></p>
        <h3 class="sliderPrice">Discount Price: $${item.discount_price}</h3>
        <button class="buyButton">Buy Now</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load products:", err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Always show login first
  document.getElementById("login-section").style.display = "block";
  document.getElementById("after-login").style.display = "none";

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      document.getElementById("after-login").style.display = "none";
      document.getElementById("login-section").style.display = "block";
    });
  }
});
