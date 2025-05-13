
async function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const container = document.getElementById('cart-items');
  if (!container) return;
  container.innerHTML = cart.map(i => `<p>${i.name} x${i.quantity} - $${i.price}</p>`).join('');
}

async function loadCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = +(total * 0.07).toFixed(2);
  const shipping = 5.00;
  const final = +(total + tax + shipping).toFixed(2);

  const summary = document.getElementById('order-summary');
  if (!summary) return;
  summary.innerHTML = `
    <ul>${cart.map(i => `<li>${i.name} x${i.quantity}</li>`).join('')}</ul>
    <p>Subtotal: $${total.toFixed(2)}</p>
    <p>Tax: $${tax.toFixed(2)}</p>
    <p>Shipping: $${shipping.toFixed(2)}</p>
    <h3>Total: $${final}</h3>
    <button onclick="submitOrder()">Confirm Purchase</button>
  `;
}

async function submitOrder() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = +(total * 0.07).toFixed(2);
  const shipping = 5.00;
  const userId = 1;

  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, cartItems: cart, total, tax, shipping })
  });

  if (response.ok) {
    alert('Purchase completed!');
    localStorage.removeItem('cart');
    window.location.href = '/';
  } else {
    alert('Checkout failed.');
  }
}

window.onload = () => {
  loadCart();
  loadCheckout();
};
