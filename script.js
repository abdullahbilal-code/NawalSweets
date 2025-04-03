// Sample product data (for testing, will be replaced by API data later)
      const products = [
        { 
            id: 1, 
            name: "Chocolate Fudge", 
            description: "Rich, creamy fudge chocolate.", 
            price: 2.50 
         },
              
        {  id: 2, 
            name: "Caramel Toffee", 
            description: "Sweet, chewy caramel toffee.", 
            price: 1.75 
        }
  ];
  
  // Initialize an empty shopping cart
  let cart = [];
  
  // Render the list of products on the page
  function renderProducts() {
    const productListDiv = document.getElementById('product-list');
    productListDiv.innerHTML = ''; // Clear previous products if any
    
    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: €${product.price.toFixed(2)}</p>
        <input type="number" id="qty-${product.id}" min="1" value="1">
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productListDiv.appendChild(productDiv);
    });
  }
  
  // Function to add a product to the cart
  function addToCart(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);
    
    // Find product by ID
    const product = products.find(p => p.id === productId);
    
    // Check if product already exists in the cart; if so, update its quantity
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    renderCart();
  }
  
  // Function to render the shopping cart details
  function renderCart() {
    const cartDiv = document.getElementById('shopping-cart');
    cartDiv.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
      total += item.price * item.quantity;
      cartDiv.innerHTML += `<p>${item.name} - ${item.quantity} x €${item.price.toFixed(2)}</p>`;
    });
    
    cartDiv.innerHTML += `<p><strong>Total: €${total.toFixed(2)}</strong></p>`;
  }
  
  // Event listener for the checkout button
  document.getElementById('checkout-btn').addEventListener('click', () => {
    // For now, simply clear the cart and show a confirmation message
    cart = [];
    renderCart();
    document.getElementById('confirmation').innerText = "Order successfully placed!";
  });
  
  // Initialize the app after the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', renderProducts);
  