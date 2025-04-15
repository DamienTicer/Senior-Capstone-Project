import { fetchSchoolProfile } from './API.js';

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
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('after-login').style.display = 'block';
      loadProfile();
    }
  } catch (err) {
    alert('Error connecting to server');
    console.error(err);
  }
}

async function loadProfile() {
  const profileData = await fetchSchoolProfile();

  if (!profileData) {
    console.error("Failed to load profile data.");
    return;
  }

  // Set school name and logo
  document.getElementById('school-name').textContent = profileData.schoolName;
  document.getElementById('school-logo').src = profileData.logoUrl;

  // Render technology on sale
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
    techContainer.appendChild(card);
  });
}

// Expose login to global scope for inline onclick fallback
window.login = login;

// Optional: wire login button by eventListener if you want to move away from inline onclick
// document.addEventListener("DOMContentLoaded", () => {
//   const loginBtn = document.querySelector("#login-section button");
//   if (loginBtn) loginBtn.addEventListener("click", login);
// });