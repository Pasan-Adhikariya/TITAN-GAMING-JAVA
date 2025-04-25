// Display cart items on page load
document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('currentCart')) || [];
  const container = document.getElementById('checkout-cart-container');

  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    document.getElementById('checkout-form').style.display = 'none';
    return;
  }

  let total = 0;
  const rows = cart.map(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>USD ${item.price.toFixed(2)}</td>
        <td>USD ${subtotal.toFixed(2)}</td>
      </tr>`;
  }).join('');

  container.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr><td colspan="3"><strong>Total</strong></td><td><strong>USD ${total.toFixed(2)}</strong></td></tr>
      </tfoot>
    </table>`;
});

// Show/hide card details based on payment method
document.getElementById('payment').addEventListener('change', function () {
  const cardDetails = document.getElementById('card-details');
  if (this.value === 'card') {
    cardDetails.style.display = 'block';
  } else {
    cardDetails.style.display = 'none';
  }
});

// Handle form submission
document.getElementById('checkout-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('fullname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const payment = document.getElementById('payment').value;

  if (!name || !email || !phone || !address || !payment) {
    showToast("Please complete all fields.");
    return;
  }

  if (payment === 'card') {
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value.trim();

    if (!cardNumber || !expiry || !cvv) {
      showToast("Please enter all card details.");
      return;
    }

    // Basic card number & CVV validation (length check only)
    if (cardNumber.length < 12 || cvv.length < 3) {
      showToast("Invalid card number or CVV.");
      return;
    }
  }

  // Simulate delivery date: today + 3 days
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDate = deliveryDate.toDateString();

  // Show confirmation
  const message = `
    Thank you, <strong>${name}</strong>!<br/>
    Your order has been placed and will be delivered by <strong>${formattedDate}</strong>.
  `;

  document.getElementById('confirmation-message').innerHTML = message;
  document.getElementById('confirmation-message').style.display = 'block';
  this.style.display = 'none';

  // Clear the cart
  localStorage.removeItem('currentCart');
});

// Toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
