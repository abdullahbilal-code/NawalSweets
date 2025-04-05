from flask import Flask, request, jsonify
import json, os
from datetime import datetime

app = Flask(__name__)

# Path to our JSON file acting as a database
DB_PATH = os.path.join(os.path.dirname(__file__), 'DB.json')

def read_db():
    with open(DB_PATH, 'r') as f:
        return json.load(f)

def write_db(data):
    with open(DB_PATH, 'w') as f:
        json.dump(data, f, indent=2)

# API endpoint for user signup
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    db = read_db()
    # Check if user already exists (case-insensitive)
    if any(user['email'].lower() == email.lower() for user in db['users']):
        return jsonify({'message': 'User with this email already exists.'}), 400

    new_user = {
        "id": int(datetime.now().timestamp()),
        "name": name,
        "email": email,
        "password": password
    }
    db['users'].append(new_user)
    write_db(db)
    return jsonify({'message': 'User signed up successfully!', 'user': new_user}), 201

# API endpoint for user login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    db = read_db()
    user = next((user for user in db['users']
                 if user['email'].lower() == email.lower() and user['password'] == password), None)
    if user:
        return jsonify({'message': 'Login successful!', 'user': user})
    else:
        return jsonify({'message': 'Invalid credentials.'}), 401

# API endpoint to get products
@app.route('/api/products', methods=['GET'])
def get_products():
    products = [
        {
            "id": 1,
            "name": "Chocolate Fudge",
            "description": "Rich, creamy fudge chocolate.",
            "price": 2.50,
            "image": "https://via.placeholder.com/150/000000/FFFFFF?text=Chocolate+Fudge"
        },
        {
            "id": 2,
            "name": "Caramel Toffee",
            "description": "Sweet, chewy caramel toffee.",
            "price": 1.75,
            "image": "https://via.placeholder.com/150/FF5733/FFFFFF?text=Caramel+Toffee"
        }
        # Add more products as needed
    ]
    return jsonify(products)

# API endpoint to update a user's cart
@app.route('/api/cart', methods=['POST'])
def update_cart():
    data = request.get_json()
    user_id = data.get('userId')
    cart_items = data.get('cartItems')
    db = read_db()
    # Find if a cart already exists for the user
    cart_index = next((i for i, cart in enumerate(db['carts']) if cart['userId'] == user_id), None)
    if cart_index is not None:
        db['carts'][cart_index]['items'] = cart_items
    else:
        db['carts'].append({'userId': user_id, 'items': cart_items})
    write_db(db)
    return jsonify({'message': 'Cart updated successfully.'})

# API endpoint to retrieve a user's cart
@app.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    db = read_db()
    user_cart = next((cart['items'] for cart in db['carts'] if cart['userId'] == user_id), [])
    return jsonify(user_cart)

if __name__ == '__main__':
    app.run(port=3000, debug=True)
