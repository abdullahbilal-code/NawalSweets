from flask import Flask, request, jsonify,render_template
import json
import sqlite3

app = Flask(__name__)
DB_PATH = "data.db"


def get_conn():
    return sqlite3.connect(DB_PATH)


def init_db():
    conn = get_conn()
    conn.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, contact TEXT)")
    conn.execute("CREATE TABLE IF NOT EXISTS carts (user_id INTEGER PRIMARY KEY, items TEXT)")
    conn.execute("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL, image TEXT)")
    conn.commit()
    conn.close()


init_db()

# API endpoint for user signup
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phoneNumber')
    conn = get_conn()
    cur = conn.execute("SELECT id FROM users WHERE lower(email)=lower(?)", (email,))
    existing = cur.fetchone()
    if existing:
        conn.close()
        return jsonify({'message': 'User with this email already exists.'}), 400
    cur = conn.cursor()
    cur.execute("INSERT INTO users (name, email, password, contact) VALUES (?, ?, ?, ?)", (name, email, password, phone))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    new_user = {"id": new_id, "name": name, "email": email, "password": password, "Contact": phone}
    return jsonify({'message': 'User signed up successfully!', 'user': new_user}), 201

# API endpoint for user login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    conn = get_conn()
    cur = conn.execute("SELECT id, name, email, password, contact FROM users WHERE lower(email)=lower(?)", (email,))
    row = cur.fetchone()
    conn.close()
    if row and row[3] == password:
        user = {"id": row[0], "name": row[1], "email": row[2], "password": row[3], "Contact": row[4]}
        return jsonify({'message': 'Login successful!', 'user': user})
    return jsonify({'message': 'Email or Password Invalid.'}), 401

# API endpoint to get products
@app.route('/api/products', methods=['GET'])
def get_products():
    conn = get_conn()
    cur = conn.execute("SELECT id, name, description, price, image FROM products")
    rows = cur.fetchall()
    conn.close()
    products = []
    for row in rows:
        products.append({"id": row[0], "name": row[1], "description": row[2], "price": row[3], "image": row[4]})
    return jsonify(products)

#  endpoint to update a users cart
@app.route('/api/cart', methods=['POST'])
def update_cart():
    data = request.get_json()
    user_id = data.get('userId')
    cart_items = data.get('cartItems') or []
    conn = get_conn()
    cur = conn.execute("SELECT user_id FROM carts WHERE user_id=?", (user_id,))
    exists = cur.fetchone()
    items_json = json.dumps(cart_items)
    if exists:
        conn.execute("UPDATE carts SET items=? WHERE user_id=?", (items_json, user_id))
    else:
        conn.execute("INSERT INTO carts (user_id, items) VALUES (?, ?)", (user_id, items_json))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Cart updated successfully.'})

# API endpoint to retrieve a user's cart
@app.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    conn = get_conn()
    cur = conn.execute("SELECT items FROM carts WHERE user_id=?", (user_id,))
    row = cur.fetchone()
    conn.close()
    if row and row[0]:
        return jsonify(json.loads(row[0]))
    return jsonify([])  



@app.route('/')
def home():
    return render_template("index.html")

@app.route('/auth')
def auth():
    return render_template('auth.html')

if __name__ == '__main__':
    app.run(port=3000, debug=True)
