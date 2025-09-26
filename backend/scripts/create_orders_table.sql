-- Create orders table for checkout functionality
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  plan_price DECIMAL(10,2) NOT NULL,
  plan_currency VARCHAR(3) DEFAULT 'PKR',
  plan_period VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'rejected', 'cancelled')),
  payment_method VARCHAR(100) DEFAULT 'bank_transfer',
  receipt_url VARCHAR(500),
  personal_info TEXT,
  notes TEXT,
  approved_by INTEGER,
  approved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);