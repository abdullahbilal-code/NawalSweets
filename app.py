from flask import Flask, request, jsonify,render_template
import json, os
from datetime import datetime

app = Flask(__name__)

def read_db():
    with open("./static/js/DB.json", 'r') as f:
        return json.load(f)

def write_db(data):
    with open("./static/js/DB.json", 'w') as f:
        json.dump(data, f, indent=2)

# API endpoint for user signup
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phoneNumber')
    db = read_db()

    # Check if user already exists (case-insensitive)
    if any(user['email'].lower() == email.lower() for user in db['users']):
        return jsonify({'message': 'User with this email already exists.'}), 400

    new_user = {
        "id": int(datetime.now().timestamp()),
        "name": name,
        "email": email,
        "password": password,
        "Contact": phone
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
        return jsonify({'message': 'Email or Password Invalid.'}), 401

# API endpoint to get products
@app.route('/api/products', methods=['GET'])
def get_products():
    products = [
        {
            "id": 1,
            "name": "Chocolate Fudge",
            "description": "Rich, creamy fudge chocolate.",
            "price": 2.50,
            "image": "/static/images/chocolate_fudge.jpg"
        },
        {
            "id": 2,
            "name": "Caramel Toffee",
            "description": "Sweet, chewy caramel toffee.",
            "price": 1.75,
            "image": "/static/images/caramel_toffee.jpg"
        },
        {
           "id": 3,
           "name": "Strawberry Candy",
           "description": "Delicious strawberry-flavored candy.",
           "price": 1.25,
            "image": "/static/images/strawberry_candy.jpg"

        },
       {
         "id": 4,
         "name": "Mint Delight",
         "description": "Cool, minty sweet treat.",
         "price": 1.95,
         "image": "/static/images/mint_delight.jpg"
       },
        {
         "id": 5,
         "name": "Gulab Jamun",
         "description": "Sweet, Pakistani Dessert.",
         "price": 2.50,
         "image": "/static/images/gulab_jamun.jpeg"
       },
        {
         "id": 6,
         "name": "Habshi Halwa",
         "description": "Healthy, sweet delightfull treat.",
         "price": 3.95,
         "image": "/static/images/habshi_halwa.jpg"
       }
       
    ]
    return jsonify(products)

#  endpoint to update a users cart
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



@app.route('/')
def home():
    return render_template("index.html")

@app.route('/auth')
def auth():
    return render_template('auth.html')

if __name__ == '__main__':
    app.run(port=3000, debug=True)
