// main.js

let cart = [];
let allProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  if (isLoggedIn === "true") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("after-login").style.display = "block";
    loadCart();
    loadProfile();
    loadProducts(); // Load products on startup
    loadRecommendations(); // Load purchase history recommendations
  }
});

async function login() {
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

    if (res.status === 200) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      document.getElementById("login-section").style.display = "none";
      document.getElementById("after-login").style.display = "block";
      loadCart();
      updateCartUI();
      loadProfile();
      loadProducts();
      loadRecommendations();
    } else {
      alert(data.message || "Login failed.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Error connecting to server.");
  }
}

async function loadProfile() {
  const profileData = await fetchSchoolProfile();
  if (!profileData) {
    console.error("Failed to load profile data.");
    return;
  }

  document.getElementById('school-name').textContent = profileData.schoolName;
  document.getElementById('school-logo').src = profileData.logoUrl;
}

async function loadProducts() {
  try {
    const res = await fetch('mockAPI.json');
    const data = await res.json();

    const container = document.getElementById('products');
    container.innerHTML = '';

    allProducts = data.technologyOnSale;

    allProducts.forEach(item => {
      const card = createProductCard(item);
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading products:', err);
  }
}

function createProductCard(item) {
  const card = document.createElement('div');
  card.className = 'deviceItem';
  card.innerHTML = `
    <img class="product-image" src="./img/${item.imageUrl || 'default.jpg'}" alt="${item.name}" onerror="this.onerror=null; this.src='./img/default.jpg';">
    <h2 class="sliderTitle">${item.name}</h2>
    <p>${item.description}</p>
    <h3 class="sliderPrice">${item.price}</h3>
    <button class="buyButton">Buy Now</button>
  `;
  card.querySelector('.buyButton').addEventListener('click', () => addToCart(item));
  return card;
}

async function loadRecommendations() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user?.email) return;

  try {
    const res = await fetch(`http://localhost:3000/api/checkout/purchaseHistory/${user.email}`);
    const data = await res.json();

    const history = data.history || [];

    const recommendedContainer = document.getElementById("recommended-products");
    if (!recommendedContainer) return;

    recommendedContainer.innerHTML = "";

    if (history.length === 0) {
      recommendedContainer.innerHTML = `<p style="text-align:center; font-size:16px;">No recommendations yet. Start shopping to get suggestions!</p>`;
      return;
    }

    history.forEach(purchase => {
      const match = allProducts.find(p => p.name === purchase.product_name);
      if (match) {
        const card = createProductCard(match);
        recommendedContainer.appendChild(card);
      }
    });

  } catch (err) {
    console.error("Failed to fetch recommendations:", err);
  }
}

function addToCart(item) {
  cart.push(item);
  saveCart();
  updateCartUI();
  alert(`${item.name} added to cart!`);
}

function saveCart() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user?.email) {
    localStorage.setItem(`cart-${user.email}`, JSON.stringify(cart));
  }
}

function loadCart() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user?.email) {
    const storedCart = localStorage.getItem(`cart-${user.email}`);
    cart = storedCart ? JSON.parse(storedCart) : [];
    updateCartUI();
  }
}

function updateCartUI() {
  document.getElementById("cart-count").textContent = cart.length;
  const cartList = document.getElementById("cart-items");
  cartList.innerHTML = "";

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
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("currentUser");
  location.reload();
});

window.login = login;