// frontend/js/login.js

let isRegisterMode = false;
let submitting = false;

function toggleMode() {
  isRegisterMode = !isRegisterMode;
  document.querySelector('.form-mode-title').textContent = isRegisterMode ? 'Register Account' : 'Member Login';
  document.querySelector('.login100-form-btn').textContent = isRegisterMode ? 'Register' : 'Login';
  document.getElementById('confirm-group').style.display = isRegisterMode ? 'block' : 'none';
  document.getElementById('toggleModeText').innerHTML = isRegisterMode
    ? "Already have an account? <a href=\"#\" class=\"txt2\" id=\"toggleModeBtn\">Login</a>"
    : "Create your Account <i class=\"fa fa-long-arrow-right m-l-5\" aria-hidden=\"true\"></i>";
  bindToggleButton();
}

function bindToggleButton() {
  const toggleBtn = document.getElementById('toggleModeBtn');
  if (toggleBtn) toggleBtn.addEventListener('click', e => {
    e.preventDefault();
    toggleMode();
  });
}

async function handleLoginOrRegister(email, password, confirmPassword) {
  if (submitting) return;

  if (!email.endsWith('@students.bowiestate.edu')) {
    return alert('Email must be a Bowie State student email');
  }

  if (!password || (isRegisterMode && !confirmPassword)) {
    return alert('Please fill in all password fields');
  }

  if (isRegisterMode && password !== confirmPassword) {
    return alert('Passwords do not match');
  }

  submitting = true;
  const btn = document.querySelector('.login100-form-btn');
  btn.disabled = true;
  btn.textContent = isRegisterMode ? 'Registering...' : 'Logging in...';

  try {
    const endpoint = isRegisterMode ? 'register' : 'login';
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok && result.user) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('userEmail', email);

      document.querySelector('.limiter').style.display = 'none';
      const afterLogin = document.getElementById('after-login');
      if (afterLogin) afterLogin.style.display = 'block';
      loadProducts();
    } else {
      alert(result.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Server error:', error);
    alert('Could not connect to server. Please try again later.');
  } finally {
    submitting = false;
    btn.disabled = false;
    btn.textContent = isRegisterMode ? 'Register' : 'Login';
  }
}

async function loadProducts() {
  try {
    const res = await fetch('http://localhost:3000/products');
    const products = await res.json();
    const container = document.getElementById('products');
    container.innerHTML = '';
    products.forEach(product => {
      const item = document.createElement('div');
      item.className = 'deviceItem';
      item.innerHTML = `
        <img src="${product.image_url}" class="product-image" alt="${product.name}" />
        <h2 class="sliderTitle">${product.name}</h2>
        <p>Original: $${product.price}</p>
        <h3 class="sliderPrice">Now: $${product.discount_price}</h3>
        <button class="buyButton">Buy Now</button>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.error('❗️ Failed to load products:', err);
  }
}

const form = document.getElementById('loginForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm').value;
  handleLoginOrRegister(email, password, confirmPassword);
});

bindToggleButton();
