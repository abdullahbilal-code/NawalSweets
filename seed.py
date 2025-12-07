import sqlite3

DB_PATH = "data.db"

products = [
    # {"id": 1, "name": "Chocolate Fudge", "description": "Rich, creamy fudge chocolate.", "price": 2.50, "image": "/static/images/chocolate_fudge.jpg"},
    # {"id": 2, "name": "Caramel Toffee", "description": "Sweet, chewy caramel toffee.", "price": 1.75, "image": "/static/images/caramel_toffee.jpg"},
    # {"id": 3, "name": "Strawberry Candy", "description": "Delicious strawberry-flavored candy.", "price": 1.25, "image": "/static/images/strawberry_candy.jpg"},
    # {"id": 4, "name": "Mint Delight", "description": "Cool, minty sweet treat.", "price": 1.95, "image": "/static/images/mint_delight.jpg"},
    # {"id": 5, "name": "Gulab Jamun", "description": "Sweet, Pakistani Dessert.", "price": 2.50, "image": "/static/images/gulab_jamun.jpg"},
    # {"id": 6, "name": "Habshi Halwa", "description": "Healthy, sweet delightfull treat.", "price": 3.95, "image": "/static/images/habshi_halwa.jpg"},
    {"id": 7, "name": "Forest Cake", "description": "Fresh Cream Cake", "price": 10, "image": "/static/images/white_forest.jpg"},
]

conn = sqlite3.connect(DB_PATH)
conn.execute("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL, image TEXT)")
for p in products:
    conn.execute("INSERT INTO products (id, name, description, price, image) VALUES (?, ?, ?, ?, ?)", (p["id"], p["name"], p["description"], p["price"], p["image"]))
conn.commit()
conn.close()
