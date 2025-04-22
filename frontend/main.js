import { fetchSchoolProfile } from './API.js';

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("loggedIn");

  if (isLoggedIn === "true") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("after-login").style.display = "block";
    loadCart();
    updateCartUI();
    loadProfile();
    setupLogout(); // ✅ Attach logout functionality
  }
});

async function login() {
  const email = document.getElementById('email').value;
  if (!email) {
    alert('Please enter your email');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (data.message) {
      alert(data.message);
    } else if (data.error) {
      alert(data.error);
    }

    if (res.status === 200) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('after-login').style.display = 'block';
      loadCart();
      updateCartUI();
      loadProfile();
      setupLogout(); // ✅ Attach logout after login succeeds
    }
  } catch (err) {
    alert('Error connecting to server');
    console.error(err);
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("currentUser");
      location.reload(); // Return to login
    });
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

  const techContainer = document.getElementById("products");
  techContainer.innerHTML = "";

  profileData.technologyOnSale.forEach((item) => {
    const card = document.createElement("div");
    card.className = "deviceItem";
    card.innerHTML = `
      <h2 class="sliderTitle">${item.name}</h2>
      <p>${item.description}</p>
      <h3 class="sliderPrice">${item.price}</h3>
      <button class="buyButton">Buy Now</button>
    `;

    const buyBtn = card.querySelector(".buyButton");
    buyBtn.addEventListener("click", () => addToCart(item));
    techContainer.appendChild(card);
  });
}

let cart = [];

function getCurrentUserEmail() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  return user?.email || "guest";
}

function saveCart() {
  const email = getCurrentUserEmail();
  localStorage.setItem(`cart-${email}`, JSON.stringify(cart));
}

function loadCart() {
  const email = getCurrentUserEmail();
  const stored = localStorage.getItem(`cart-${email}`);
  cart = stored ? JSON.parse(stored) : [];
}

function addToCart(item) {
  cart.push(item);
  saveCart();
  updateCartUI();
  alert(`${item.name} added to cart!`);
}

function updateCartUI() {
  document.getElementById("cart-count").textContent = cart.length;

  const cartList = document.getElementById("cart-items");
  cartList.innerHTML = "";

  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ${item.price}
      <button class="removeBtn" data-index="${i}">Remove</button>
    `;
    cartList.appendChild(li);
  });

  document.querySelectorAll(".removeBtn").forEach(button => {
    button.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"));
      removeFromCart(index);
    });
  });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cartBtn").addEventListener("click", () => {
    document.getElementById("cart-modal").style.display = "flex";
  });

  document.getElementById("closeCartBtn").addEventListener("click", () => {
    document.getElementById("cart-modal").style.display = "none";
  });
});

// Inline fallback support
window.login = login;