CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mechanics (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT DEFAULT 'Bangalore',
  experience_years INTEGER DEFAULT 1,
  specializations TEXT,
  verification_status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  address TEXT NOT NULL,
  device_type TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  estimated_price INTEGER DEFAULT 0,
  time_slot TEXT,
  status TEXT DEFAULT 'searching_mechanic',
  mechanic_id TEXT,
  mechanic_name TEXT,
  mechanic_phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
