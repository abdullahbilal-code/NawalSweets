# ISC-CA-ONE NAWAL SWEETS Shopping Cart
#Acknowledgements

#----------------------------------FRONTEND----------------------------------------------------------------------

On frontend I have Products listing, Shopping Cart and Login Sigup Button 

On frontend products Data is coming from app.py for this I get help from stackoverflow and w3school
In main.js you can see  fetchproducts function

function fetchProducts() {
  fetch('/api/products')
    .then(response => response.json())
    .then(data => {
      products = data;
      renderProducts();
    })
    .catch(err => console.error('Error fetching products:', err));
}


For Linking CSS Files with Index.html and auth.html I get Help from w3school

 <link rel="stylesheet" href="../static/css/style.css">
 
  <!-- Font Awesome for icons if needed -->
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  

On Auth.html I use Password eye  for that I get Help from w3 School to add the visibility and not visible
  
   <div class="password-container">
        <input type="password" id="signup-password" placeholder="Enter Password" required />
        <button type="button" class="toggle-password" onclick="togglePassword('signup-password', this)">
          <i class="fa fa-eye"></i> 



#--------------------BACKEND--------------------------------

I am using File system so to avoid confusion and get simplicity I kept my products list in app.py   Like using

@app.route('/api/products', methods=['GET'])

To reterive a cart details against user ID, I get Help from ChatGPT

Like Chatgpt use generator expression to get data from DB.json file 

@app.route('/api/cart/<int:user_id>', methods=['GET'])

def get_cart(user_id):

    db = read_db()
    
    user_cart = next((cart['items'] for cart in db['carts'] if cart['userId'] == user_id), [])
    
    return jsonify(user_cart)

To find and return the items from the first cart in db['carts'] where cart['userId'] matches the given user_id.

If no such cart exists, it returns an empty list.
