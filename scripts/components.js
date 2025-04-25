// Store cart items in memory
let cart = [];

const savedCart = localStorage.getItem('currentCart');
if (savedCart) {
  cart = JSON.parse(savedCart);
  updateCartTable();
}

// Add to cart handler
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.component-card');
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);
      const qtyInput = card.querySelector('input.qty-input');
      const qty = parseInt(qtyInput.value);

      if (isNaN(qty) || qty <= 0) {
        showToast("Please enter a valid quantity.");
        return;
      }

      const existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.qty += qty;
      } else {
        cart.push({ name, price, qty });
      }

      updateCartTable();
      showToast(`${qty} x ${name} added to cart`);
    });
  });
});

// Generate the cart table HTML
function getCartTableHTML() {
  if (cart.length === 0) return '<p class="cart-empty">Your cart is empty.</p>';
  let total = 0;
  let rows = cart.map(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `<tr>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>USD ${item.price.toFixed(2)}</td>
      <td>USD ${subtotal.toFixed(2)}</td>
      <td><button class="btn-clear remove-item" data-name="${item.name}">Remove</button></td>
    </tr>`;
  }).join('');

  return `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Subtotal</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="4"><strong>Total</strong></td>
          <td><strong>USD ${total.toFixed(2)}</strong></td>
        </tr>
      </tfoot>
    </table>`;
}

// Insert or update the cart table in the DOM
function updateCartTable() {
  let container = document.getElementById('cart-table-container');
  if (!container) {
    const section = document.createElement('section');
    section.classList.add('components-section');
    section.innerHTML = `
      <h2 class="section-heading">Cart Summary</h2>
      <div id="cart-table-container" class="order-table-container">
        ${getCartTableHTML()}
      </div>`;
    document.querySelector('main').appendChild(section);
  } else {
    container.innerHTML = getCartTableHTML();
  }

  // Set up remove item buttons
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const nameToRemove = button.dataset.name;
      cart = cart.filter(item => item.name !== nameToRemove);
      updateCartTable();
      showToast(`${nameToRemove} removed from cart.`);
    });
  });

  // Persist to local storage
  localStorage.setItem('currentCart', JSON.stringify(cart));
}

// Save to favourites
function saveToFavourites() {
  localStorage.setItem('favouriteCart', JSON.stringify(cart));
  showToast("Order saved as favourite!");
}

// Apply favourites
function applyFavourites() {
  const fav = localStorage.getItem('favouriteCart');
  if (fav) {
    cart = JSON.parse(fav);
    updateCartTable();
    showToast("Favourite order applied.");
  } else {
    showToast("No favourite order found.");
  }
}

// Proceed to checkout
function goToCheckout() {
  localStorage.setItem('currentCart', JSON.stringify(cart));
  window.location.href = 'checkout.html';
}

// Clear cart
function clearCart() {
  cart = [];
  updateCartTable();
  showToast("Cart cleared.");
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
