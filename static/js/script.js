// Sample product data (with image URLs)
const products = [
  {
    id: 1,
    name: "Chocolate Fudge",
    description: "Rich, creamy fudge chocolate.",
    price: 2.50,
    image: "https://via.placeholder.com/150/000000/FFFFFF?text=Chocolate+Fudge"
  },
  {
    id: 2,
    name: "Caramel Toffee",
    description: "Sweet, chewy caramel toffee.",
    price: 1.75,
    image: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Caramel+Toffee"
  },
  {
    id: 3,
    name: "Strawberry Candy",
    description: "Delicious strawberry-flavored candy.",
    price: 1.25,
    image: "https://via.placeholder.com/150/FFB6C1/FFFFFF?text=Strawberry"
  },
  {
    id: 4,
    name: "Mint Delight",
    description: "Cool, minty sweet treat.",
    price: 1.95,
    image: "https://via.placeholder.com/150/98FB98/FFFFFF?text=Mint+Delight"
  }
];

// Initialize an empty shopping cart
let cart = [];

// Object to hold the selected quantity for each product
const productQuantities = {};

// Function to render the products in a grid layout with image, name, quantity controls, and Add to Cart button
function renderProducts() {
  const productSection = document.getElementById('cart-items');
  productSection.innerHTML = ''; // Clear previous content

  products.forEach(product => {
    // Initialize quantity to 1 if not set
    if (!productQuantities[product.id]) {
      productQuantities[product.id] = 1;
    }

    // Create a product card container
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

// Increment product quantity in the product card
function incrementQuantity(productId) {
  productQuantities[productId]++;
  document.getElementById(`quantity-${productId}`).innerText = productQuantities[productId];
}

// Decrement product quantity in the product card (minimum 1)
function decrementQuantity(productId) {
  if (productQuantities[productId] > 1) {
    productQuantities[productId]--;
    document.getElementById(`quantity-${productId}`).innerText = productQuantities[productId];
  }
}

// Add product to cart with the selected quantity
function addToCart(productId) {
  document.getElementById('confirmation').innerText = "";
  const product = products.find(p => p.id === productId);
  const selectedQuantity = productQuantities[productId];
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += selectedQuantity;
  } else {
    cart.push({ ...product, quantity: selectedQuantity });
  }

  // Reset quantity in product card back to 1 after adding to cart
  productQuantities[productId] = 1;
  document.getElementById(`quantity-${productId}`).innerText = productQuantities[productId];

  renderCart();
}


// CART FUNCTIONALITY


// Function to render the shopping cart details
function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  cartItemsDiv.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    
    // Create a container for each cart item
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item'); // For styling in CSS

    cartItemDiv.innerHTML = `
      <p>${item.name} - €${item.price.toFixed(2)}</p>
      <div class="quantity-controls">
        <button onclick="decrementCartQuantity(${item.id})">-</button>
        <span id="cart-quantity-${item.id}">${item.quantity}</span>
        <button onclick="incrementCartQuantity(${item.id})">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">
        Remove
      </button>
    `;

    cartItemsDiv.appendChild(cartItemDiv);
  });

  cartTotalSpan.innerText = total.toFixed(2);
}

// Increment function
function incrementCartQuantity(productId) {
  const item = cart.find(cartItem => cartItem.id === productId);
  if (item) {
    item.quantity++;
    renderCart(); // Re-render the cart to update the display and total
  }
}

//Decrement Function 
function decrementCartQuantity(productId) {
  const item = cart.find(cartItem => cartItem.id === productId);
  if (item && item.quantity > 1) {
    item.quantity--;
    renderCart();
  }
}


// Function to update the quantity of a product in the cart
function updateQuantity(productId, newQuantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = parseInt(newQuantity, 10);
    renderCart();
  }
}

// Function to remove a product from the cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

// Event listener for the checkout button with an alert if cart is empty
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Your shopping cart is empty. Please add a product before checking out.");
  } else {
    cart = [];
    renderCart();
    document.getElementById('confirmation').innerText = "Order successfully placed!";
  }
});

// Function to handle the cart menu toggle (if needed)
function toggleCartMenu() {
  // Scroll to the shopping cart section
  document.getElementById('cart-section').scrollIntoView({ behavior: 'smooth' });
}

// Initialize the app after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
});
