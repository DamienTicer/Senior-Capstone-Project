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

async function loadCheckout() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);
  const tax = +(total * 0.07).toFixed(2);
  const shipping = 5.00;
  const grandTotal = +(total + tax + shipping).toFixed(2);

  const container = document.getElementById("order-summary");
  container.innerHTML = `
    <ul>
      ${cart.map(i => `<li>${i.name} x${i.quantity || 1} - $${i.price}</li>`).join('')}
    </ul>
    <p>Subtotal: $${total.toFixed(2)}</p>
    <p>Tax (7%): $${tax.toFixed(2)}</p>
    <p>Shipping: $${shipping.toFixed(2)}</p>
    <h3>Total: $${grandTotal.toFixed(2)}</h3>
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

  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);
  const tax = +(total * 0.07).toFixed(2);
  const shipping = 5.00;

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id || 1,  // fallback
      cartItems: cart,
      total,
      tax,
      shipping
    })
  });

  if (response.ok) {
    alert('Purchase complete!');
    localStorage.removeItem(`cart-${user.email}`);
    window.location.href = '/';
  } else {
    alert('Checkout failed.');
  }
}

window.onload = loadCheckout;
