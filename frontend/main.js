// main.js

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  if (isLoggedIn === "true") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("after-login").style.display = "block";
    loadCart();
    loadProfile();
    loadProducts(); // ✅ Add this
  }
});

// Basic login method (unchanged)
async function login() {

  const email = document.getElementById('email').value;

  if (!email || !email.endsWith('@students.bowiestate.edu')) {
    alert('Please enter a valid Bowie State student email');
    return;
  }

  localStorage.setItem("loggedIn", "true");
  document.getElementById("login-section").style.display = "none";
  document.getElementById("after-login").style.display = "block";
  loadCart();
  updateCartUI();
  loadProfile();
  loadProducts(); // ✅ Load mock products on login
}

// Fetch school profile (unchanged)
async function loadProfile() {
  const profileData = await fetchSchoolProfile();
  if (!profileData) {
    console.error("Failed to load profile data.");
    return;
  }

  document.getElementById('school-name').textContent = profileData.schoolName;
  document.getElementById('school-logo').src = profileData.logoUrl;
}

// ✅ Fetch and display products from mockAPI.json
async function loadProducts() {
  try {
    const res = await fetch('mockAPI.json');
    const data = await res.json();

    const container = document.getElementById('products');
    container.innerHTML = '';

    data.technologyOnSale.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'deviceItem';
      card.innerHTML = `
        <img class="product-image" src="./img/${item.imageUrl || 'default.jpg'}" alt="${item.name}" onerror="this.onerror=null; this.src='./img/default.jpg';">
        <h2 class="sliderTitle">${item.name}</h2>
        <p>${item.description}</p>
        <h3 class="sliderPrice">${item.price}</h3>
        <button class="buyButton">Buy Now</button>
      `;

      // Attach event for cart
      const buyBtn = card.querySelector('.buyButton');
      buyBtn.addEventListener('click', () => addToCart(item));

      container.appendChild(card);
    });

  } catch (err) {
    console.error('Error loading products:', err);
  }
}

// Cart functions
function addToCart(item) {
  cart.push(item);
  saveCart();
  updateCartUI();
  alert(`${item.name} added to cart!`);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const storedCart = localStorage.getItem('cart');
  cart = storedCart ? JSON.parse(storedCart) : [];
  updateCartUI();
}

function updateCartUI() {
  document.getElementById("cart-count").textContent = cart.length;
  const cartList = document.getElementById("cart-items");
  cartList.innerHTML = '';

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - ${item.price}
      <button class="removeBtn" data-index="${index}">Remove</button>
    `;
    cartList.appendChild(li);
  });

  document.querySelectorAll('.removeBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      removeFromCart(index);
    });
  });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

document.getElementById('cartBtn')?.addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'flex';
});
document.getElementById('closeCartBtn')?.addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'none';
});
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('cart');
  location.reload();
});

// Expose login globally for inline button
window.login = login;
