const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'app.db'));
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  category TEXT,
  is_available BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  reservation_time DATETIME NOT NULL,
  party_size INTEGER NOT NULL,
  special_requests TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  reservation_id INTEGER,
  status TEXT NOT NULL,
  total_amount REAL NOT NULL,
  placed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(reservation_id) REFERENCES reservations(id)
);
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id),
  FOREIGN KEY(menu_item_id) REFERENCES menu_items(id)
);
`);
db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run('alice', 'alice@example.com', 'hash1');
db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run('bob', 'bob@example.com', 'hash2');
db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run('carol', 'carol@example.com', 'hash3');
db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run('dave', 'dave@example.com', 'hash4');
db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').run('eve', 'eve@example.com', 'hash5');
module.exports = db;