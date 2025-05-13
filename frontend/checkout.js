function getCurrentUserEmail() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user?.email || null;
}

function getCart() {
  const email = getCurrentUserEmail();
  if (!email) return [];
  const storedCart = localStorage.getItem(`cart-${email}`);
  return storedCart ? JSON.parse(storedCart) : [];
}

function saveCart(cart) {
  const email = getCurrentUserEmail();
  if (email) {
    localStorage.setItem(`cart-${email}`, JSON.stringify(cart));
  }
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function goHome() {
  window.location.href = './index.html';
}

function removeItem(index) {
  const cart = getCart();
  const item = cart[index];

  if (item.quantity && item.quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  saveCart(cart);
  loadCheckout(); // Re-render
}

function loadCheckout() {
  const cart = getCart();
  const itemList = document.getElementById("item-list");
  const orderSummary = document.getElementById("order-summary");

  itemList.innerHTML = '';
  let total = 0;

  cart.forEach((item, idx) => {
    const quantity = item.quantity || 1;
    const price = parseFloat(item.price.toString().replace(/[^0-9.]/g, ""));
    total += price * quantity;

    const div = document.createElement('div');
    div.className = 'checkoutItem';
    div.innerHTML = `
      <div class="checkoutItemName">${item.name} x${quantity} - ${formatCurrency(price)}</div>
      <button class="checkoutRemoveBtn" onclick="removeItem(${idx})">Remove</button>
    `;
    itemList.appendChild(div);
  });

  const tax = +(total * 0.07).toFixed(2);
  const shipping = 5.00;
  const grandTotal = +(total + tax + shipping).toFixed(2);

  orderSummary.innerHTML = `
    <p><strong>Subtotal:</strong> ${formatCurrency(total)}</p>
    <p><strong>Tax (7%):</strong> ${formatCurrency(tax)}</p>
    <p><strong>Shipping:</strong> ${formatCurrency(shipping)}</p>
    <h3>Total: ${formatCurrency(grandTotal)}</h3>
    <button onclick="submitOrder()">Confirm Purchase</button>
  `;
}

async function submitOrder() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const cart = getCart();

  if (!user || cart.length === 0) {
    alert('Missing user info or empty cart.');
    return;
  }

  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.toString().replace(/[^0-9.]/g, ""));
    return sum + price * (item.quantity || 1);
  }, 0);

  const tax = +(total * 0.07).toFixed(2);
  const shipping = 5.00;

  const response = await fetch('http://localhost:3000/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id || 1,
      userEmail: user.email,
      cartItems: cart,
      total,
      tax,
      shipping
    })
  });

  if (response.ok) {
    alert('Purchase complete!');
    localStorage.removeItem(`cart-${user.email}`);
    window.location.href = './index.html';
  } else {
    alert('Checkout failed.');
  }
}

window.removeItem = removeItem;
window.onload = loadCheckout;
window.goHome = goHome;