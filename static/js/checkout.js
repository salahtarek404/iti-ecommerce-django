const defaultCart = [
  { name: 'Smartphone', price: 699.99, qty: 1 },
  { name: 'Wireless Headphones', price: 199.99, qty: 1 }
];

let cart = JSON.parse(localStorage.getItem('cart') || 'null') || defaultCart;
const orderItems = document.getElementById('orderItems');
const totalPrice = document.getElementById('totalPrice');

function renderOrder() {
  if (!cart.length) {
    orderItems.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    totalPrice.textContent = '$0.00';
    return;
  }

  orderItems.innerHTML = cart.map(item => `
    <div class="order-item">
      <div>
        <span class="item-name">${item.name}</span>
        <span class="item-meta">Quantity: ${item.qty}</span>
      </div>
      <strong>$${(item.price * item.qty).toFixed(2)}</strong>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalPrice.textContent = `$${total.toFixed(2)}`;
}

function setError(input, errorId, message) {
  document.getElementById(errorId).textContent = message;
  input.classList.toggle('input-invalid', Boolean(message));
}

document.getElementById('checkoutForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.getElementById('name');
  const phone = document.getElementById('phone');
  const address = document.getElementById('address');
  let valid = true;

  if (name.value.trim().length < 2) {
    setError(name, 'nameError', 'Name is required.');
    valid = false;
  } else setError(name, 'nameError', '');

  if (phone.value.trim() && !/^\+?[0-9\s-]{7,15}$/.test(phone.value.trim())) {
    setError(phone, 'phoneError', 'Please enter a valid phone number.');
    valid = false;
  } else setError(phone, 'phoneError', '');

  if (address.value.trim() && address.value.trim().length < 5) {
    setError(address, 'addressError', 'Please enter a valid address.');
    valid = false;
  } else setError(address, 'addressError', '');

  if (!cart.length) {
    alert('Your cart is empty.');
    valid = false;
  }

  if (!valid) return;

  // Front-end only demo: keep the latest order in browser storage, no server/database.
  const order = {
    customer: { name: name.value.trim(), phone: phone.value.trim(), address: address.value.trim() },
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('lastOrder', JSON.stringify(order));

  document.getElementById('successMessage').hidden = false;
  this.reset();
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

renderOrder();
