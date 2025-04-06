// Global variables
let products = [];
let cart = [];
// Use the logged-in user from localStorage (if available)
let loggedInUser = JSON.parse(localStorage.getItem('sweetshop-user')) || null;

// Fetch products from Flask backend
function fetchProducts() {
  fetch('/api/products')
    .then(response => response.json())
    .then(data => {
      products = data;
      renderProducts();
    })
    .catch(err => console.error('Error fetching products:', err));
}

// Render product cards with image, quantity controls, and Add to Cart button
const productQuantities = {};
function renderProducts() {
  const productSection = document.getElementById('product-section');
  productSection.innerHTML = '';
  products.forEach(product => {
    if (!productQuantities[product.id]) productQuantities[product.id] = 1;
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Price: €${product.price.toFixed(2)}</p>
      <div class="quantity-controls">
        <button onclick="decrementQuantity(${product.id})">-</button>
        <span id="quantity-${product.id}">${productQuantities[product.id]}</span>
        <button onclick="incrementQuantity(${product.id})">+</button>
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productSection.appendChild(productCard);
  });
}

function incrementQuantity(productId) {
  productQuantities[productId]++;
  document.getElementById(`quantity-${productId}`).innerText = productQuantities[productId];
}

function decrementQuantity(productId) {
  if (productQuantities[productId] > 1) {
    productQuantities[productId]--;
    document.getElementById(`quantity-${productId}`).innerText = productQuantities[productId];
  }
}

// Add product to cart and update backend
function addToCart(productId) {
  // Clear any confirmation message
  document.getElementById('confirmation').innerText = "";
  const product = products.find(p => p.id === productId);
  const selectedQuantity = productQuantities[productId];
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += selectedQuantity;
  } else {
    cart.push({ ...product, quantity: selectedQuantity });
  }
  // Reset product quantity to 1
  productQuantities[productId] = 1;
  document.getElementById(`quantity-${productId}`).innerText = 1;
  renderCart();
  // Optionally update the cart in backend for the logged in user
  updateCartBackend();
}

// Render the shopping cart with plus/minus controls and remove icon
function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  cartItemsDiv.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');
    cartItemDiv.innerHTML = `
      <p>${item.name} - €${item.price.toFixed(2)}</p>
      <div class="quantity-controls">
        <button onclick="decrementCartQuantity(${item.id})">-</button>
        <span id="cart-quantity-${item.id}">${item.quantity}</span>
        <button onclick="incrementCartQuantity(${item.id})">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">
        <i class="fa fa-trash"></i>
      </button>
    `;
    cartItemsDiv.appendChild(cartItemDiv);
  });
  cartTotalSpan.innerText = total.toFixed(2);
}

function incrementCartQuantity(productId) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity++;
    renderCart();
    updateCartBackend();
  }
}

function decrementCartQuantity(productId) {
  const item = cart.find(item => item.id === productId);
  if (item && item.quantity > 1) {
    item.quantity--;
    renderCart();
    updateCartBackend();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
  updateCartBackend();
}

// Update cart in backend using Fetch API
function updateCartBackend() {
  if (!loggedInUser) return; // only update if user is logged in
  fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: loggedInUser.id, cartItems: cart })
  })
  .then(response => response.json())
  .then(data => console.log(data.message))
  .catch(err => console.error('Error updating cart:', err));
}

// Checkout: clear cart and show success message
function checkout() {
  if (cart.length === 0) {
    alert("Your shopping cart is empty. Please add a product before checking out.");
    return;
  }
  cart = [];
  renderCart();
  document.getElementById('confirmation').innerText = "Order successfully placed!";
  updateCartBackend();
}

// Scroll to cart section
function toggleCartMenu() {
  document.getElementById('cart-section').scrollIntoView({ behavior: 'smooth' });
}

// Initialize the app after DOM load
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  renderCart();
});
