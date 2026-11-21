const PRODUCTS = {
  keyboard: { name: 'Mechanical Keyboard', priceCents: 8000 },
  hub: { name: 'USB-C Hub', priceCents: 3500 }
};

let cart = {};
let orderSubmitted = false;

const cartElement = document.querySelector('#cart');
const orderTotalElement = document.querySelector('#order-total');
const checkoutForm = document.querySelector('#checkout-form');
const customerNameInput = document.querySelector('#customer-name');
const formError = document.querySelector('#form-error');
const placeOrderButton = document.querySelector('#place-order');
const confirmationElement = document.querySelector('#confirmation');
const startNewOrderButton = document.querySelector('#start-new-order');

function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function getCartCount() {
  return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

function getOrderTotalCents() {
  return Object.entries(cart).reduce((sum, [productId, quantity]) => {
    return sum + PRODUCTS[productId].priceCents * quantity;
  }, 0);
}

function setQuantity(productId, quantity) {
  const safeQuantity = Math.max(0, Number.isFinite(quantity) ? Math.floor(quantity) : 0);
  if (safeQuantity === 0) {
    delete cart[productId];
  } else {
    cart[productId] = safeQuantity;
  }
  renderCart();
}

function renderCart() {
  const productIds = Object.keys(cart);
  if (productIds.length === 0) {
    cartElement.innerHTML = '<p class="empty-cart" data-testid="empty-cart">Your cart is empty.</p>';
  } else {
    cartElement.innerHTML = productIds.map((productId) => {
      const product = PRODUCTS[productId];
      const quantity = cart[productId];
      const lineTotal = product.priceCents * quantity;
      return `
        <div class="cart-item" data-testid="cart-item-${productId}">
          <div>
            <strong>${product.name}</strong>
            <div class="quantity-controls">
              <button type="button" data-action="decrement" data-product="${productId}" aria-label="Decrease ${product.name} quantity">−</button>
              <input type="number" min="0" step="1" value="${quantity}" data-action="quantity" data-product="${productId}" aria-label="${product.name} quantity" data-testid="quantity-${productId}">
              <button type="button" data-action="increment" data-product="${productId}" aria-label="Increase ${product.name} quantity">+</button>
            </div>
          </div>
          <span class="line-total" data-testid="line-total-${productId}">${formatCents(lineTotal)}</span>
        </div>`;
    }).join('');
  }
  orderTotalElement.textContent = formatCents(getOrderTotalCents());
}

function showError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function clearError() {
  formError.textContent = '';
  formError.hidden = true;
}

function generateOrderReference() {
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `ORD-${random}`;
}

document.querySelector('[data-testid="add-keyboard"]').addEventListener('click', () => {
  setQuantity('keyboard', (cart.keyboard || 0) + 1);
});

document.querySelector('[data-testid="add-hub"]').addEventListener('click', () => {
  setQuantity('hub', (cart.hub || 0) + 1);
});

cartElement.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const productId = button.dataset.product;
  const change = button.dataset.action === 'increment' ? 1 : -1;
  setQuantity(productId, (cart[productId] || 0) + change);
});

cartElement.addEventListener('change', (event) => {
  if (!event.target.matches('input[data-action="quantity"]')) return;
  const productId = event.target.dataset.product;
  const parsed = Number.parseInt(event.target.value, 10);
  setQuantity(productId, Number.isNaN(parsed) ? 0 : parsed);
});

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (orderSubmitted) return;

  if (getCartCount() === 0) {
    showError('Your cart is empty. Add at least one item.');
    return;
  }

  const customerName = customerNameInput.value.trim();
  if (!customerName) {
    showError('Customer name is required.');
    return;
  }

  orderSubmitted = true;
  placeOrderButton.disabled = true;
  clearError();

  const orderReference = generateOrderReference();
  const finalTotal = formatCents(getOrderTotalCents());
  confirmationElement.innerHTML = `
    <h3>Order confirmed</h3>
    <p data-testid="confirmation-name">Customer: ${customerName}</p>
    <p data-testid="confirmation-reference">Reference: ${orderReference}</p>
    <p data-testid="confirmation-total">Total: ${finalTotal}</p>`;
  confirmationElement.hidden = false;
  startNewOrderButton.hidden = false;
});

startNewOrderButton.addEventListener('click', () => {
  cart = {};
  orderSubmitted = false;
  customerNameInput.value = '';
  placeOrderButton.disabled = false;
  confirmationElement.innerHTML = '';
  confirmationElement.hidden = true;
  startNewOrderButton.hidden = true;
  clearError();
  renderCart();
});

renderCart();
