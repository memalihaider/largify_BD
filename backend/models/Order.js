const { query, insert } = require('../config/database');

class Order {
  constructor(orderData) {
    this.id = orderData.id;
    this.user_id = orderData.user_id;
    this.plan_name = orderData.plan_name;
    this.plan_price = orderData.plan_price;
    this.plan_currency = orderData.plan_currency;
    this.plan_period = orderData.plan_period;
    this.status = orderData.status || 'pending';
    this.payment_method = orderData.payment_method || 'bank_transfer';
    this.receipt_url = orderData.receipt_url || null;
    this.personal_info = orderData.personal_info || {};
    this.notes = orderData.notes || null;
    this.approved_by = orderData.approved_by || null;
    this.approved_at = orderData.approved_at || null;
    this.created_at = orderData.created_at;
    this.updated_at = orderData.updated_at;
  }

  // Create a new order
  static async create(orderData) {
    try {
      const insertQuery = `
        INSERT INTO orders (
          user_id, plan_name, plan_price, plan_currency, plan_period, 
          status, payment_method, receipt_url, personal_info, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        orderData.user_id,
        orderData.plan_name,
        orderData.plan_price,
        orderData.plan_currency || 'PKR',
        orderData.plan_period,
        orderData.status || 'pending',
        orderData.payment_method || 'bank_transfer',
        orderData.receipt_url || null,
        JSON.stringify(orderData.personal_info || {}),
        orderData.notes || null
      ];

      const result = await insert(insertQuery, values);
      
      // Get the created order
      const createdOrder = await query('SELECT * FROM orders WHERE id = ?', [result.id]);
      return new Order(createdOrder[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find order by ID
  static async findById(id) {
    try {
      const result = await query('SELECT * FROM orders WHERE id = ?', [id]);
      return result[0] ? new Order(result[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find orders by user ID
  static async findByUserId(userId) {
    try {
      const result = await query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
      return result.map(order => new Order(order));
    } catch (error) {
      throw error;
    }
  }

  // Find all orders with pagination and filtering
  static async findAll(options = {}) {
    try {
      const { page = 1, limit = 10, status, search } = options;
      const offset = (page - 1) * limit;
      
      let whereClause = '';
      let params = [];
      
      if (status) {
        whereClause += ' WHERE o.status = ?';
        params.push(status);
      }
      
      if (search) {
        const searchClause = whereClause ? ' AND' : ' WHERE';
        whereClause += `${searchClause} (o.plan_name LIKE ? OR u.name LIKE ? OR u.email LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      
      const selectQuery = `
        SELECT o.*, u.name as user_name, u.email as user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ${whereClause}
        ORDER BY o.created_at DESC
        LIMIT ? OFFSET ?
      `;
      
      params.push(limit, offset);
      
      const orders = await query(selectQuery, params);
      
      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ${whereClause}
      `;
      
      const countParams = params.slice(0, -2); // Remove limit and offset
      const countResult = await query(countQuery, countParams);
      
      return {
        orders: orders.map(order => new Order(order)),
        total: countResult[0].total,
        page,
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  // Update order status
  async updateStatus(status, approvedBy = null) {
    try {
      const updateQuery = `
        UPDATE orders 
        SET status = ?, approved_by = ?, approved_at = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const approvedAt = status === 'approved' ? new Date().toISOString() : null;
      const values = [status, approvedBy, approvedAt, this.id];
      
      await query(updateQuery, values);
      
      this.status = status;
      this.approved_by = approvedBy;
      this.approved_at = approvedAt;
      
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Update order
  async update(updateData) {
    try {
      const fields = [];
      const values = [];
      
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined && key !== 'id') {
          fields.push(`${key} = ?`);
          if (key === 'personal_info' && typeof updateData[key] === 'object') {
            values.push(JSON.stringify(updateData[key]));
          } else {
            values.push(updateData[key]);
          }
        }
      });
      
      if (fields.length === 0) return this;
      
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(this.id);
      
      const updateQuery = `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`;
      await query(updateQuery, values);
      
      // Update instance properties
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          this[key] = updateData[key];
        }
      });
      
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Delete order
  async delete() {
    try {
      await query('DELETE FROM orders WHERE id = ?', [this.id]);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get order statistics
  static async getStats() {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_orders,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_orders,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_orders,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_orders,
          SUM(CASE WHEN status = 'approved' OR status = 'active' THEN plan_price ELSE 0 END) as total_revenue,
          AVG(CASE WHEN status = 'approved' OR status = 'active' THEN plan_price ELSE NULL END) as avg_order_value
        FROM orders
      `;
      
      const result = await query(statsQuery);
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  // Convert to JSON (excluding sensitive data)
  toJSON() {
    const { ...orderData } = this;
    
    // Parse personal_info if it's a string
    if (typeof orderData.personal_info === 'string') {
      try {
        orderData.personal_info = JSON.parse(orderData.personal_info);
      } catch (e) {
        orderData.personal_info = {};
      }
    }
    
    return orderData;
  }
}

module.exports = Order;