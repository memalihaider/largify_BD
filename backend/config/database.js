const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create SQLite database connection
const dbPath = path.join(__dirname, '..', 'data', 'bd_saas.db');
const db = new sqlite3.Database(dbPath);

const connectDB = async () => {
  try {
    console.log(`SQLite Connected: ${dbPath}`);
    
    // Create tables if they don't exist
    await createTables();
    
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Create database tables
const createTables = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table with all fields
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'team', 'admin', 'superadmin')),
          approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
          is_active BOOLEAN DEFAULT 1,
          avatar VARCHAR(500),
          phone VARCHAR(50),
          company VARCHAR(255),
          position VARCHAR(255),
          last_login DATETIME,
          login_attempts INTEGER DEFAULT 0,
          locked_until DATETIME,
          password_reset_token VARCHAR(255),
          password_reset_expires DATETIME,
          email_verification_token VARCHAR(255),
          email_verified BOOLEAN DEFAULT 0,
          two_factor_secret VARCHAR(255),
          two_factor_enabled BOOLEAN DEFAULT 0,
          preferences TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Contacts table
      db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          company VARCHAR(255),
          position VARCHAR(255),
          source VARCHAR(100),
          status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
          assigned_to INTEGER,
          tags TEXT,
          notes TEXT,
          last_contact_date DATETIME,
          next_follow_up DATETIME,
          lead_score INTEGER DEFAULT 0,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (assigned_to) REFERENCES users(id),
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);

      // Leads table
      db.run(`
        CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contact_id INTEGER,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          value DECIMAL(10,2),
          currency VARCHAR(3) DEFAULT 'USD',
          stage VARCHAR(100) DEFAULT 'prospect' CHECK (stage IN ('prospect', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost')),
          probability INTEGER DEFAULT 0,
          expected_close_date DATE,
          actual_close_date DATE,
          assigned_to INTEGER,
          source VARCHAR(100),
          campaign VARCHAR(255),
          tags TEXT,
          notes TEXT,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (contact_id) REFERENCES contacts(id),
          FOREIGN KEY (assigned_to) REFERENCES users(id),
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);

      // Activities table
      db.run(`
        CREATE TABLE IF NOT EXISTS activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type VARCHAR(100) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          contact_id INTEGER,
          lead_id INTEGER,
          user_id INTEGER,
          due_date DATETIME,
          completed BOOLEAN DEFAULT 0,
          priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (contact_id) REFERENCES contacts(id),
          FOREIGN KEY (lead_id) REFERENCES leads(id),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Companies table
      db.run(`
        CREATE TABLE IF NOT EXISTS companies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(255) NOT NULL,
          industry VARCHAR(255),
          size VARCHAR(50),
          website VARCHAR(500),
          phone VARCHAR(50),
          email VARCHAR(255),
          address TEXT,
          city VARCHAR(255),
          state VARCHAR(255),
          country VARCHAR(255),
          postal_code VARCHAR(20),
          annual_revenue DECIMAL(15,2),
          employee_count INTEGER,
          description TEXT,
          tags TEXT,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);

      // Orders table
      db.run(`
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
        )
      `);

      // Create indexes for better performance
      db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_leads_contact_id ON leads(contact_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_activities_contact_id ON activities(contact_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON activities(lead_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at)`);
      
      resolve();
    });
  });
};

// Query helper function
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Insert helper function
const insert = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// Update helper function
const update = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
};

// Delete helper function
const deleteRecord = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
};

module.exports = {
  connectDB,
  query,
  insert,
  update,
  delete: deleteRecord,
  db
};