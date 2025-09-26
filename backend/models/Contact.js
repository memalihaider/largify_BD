const { query, insert } = require('../config/database');

class Contact {
  constructor(contactData) {
    this.id = contactData.id;
    this.name = contactData.name;
    this.email = contactData.email;
    this.phone = contactData.phone || null;
    this.company = contactData.company || null;
    this.position = contactData.position || null;
    this.status = contactData.status || 'Cold';
    this.source = contactData.source || 'Website';
    this.assigned_to = contactData.assigned_to;
    this.customer_id = contactData.customer_id || null;
    this.last_contacted = contactData.last_contacted || null;
    this.next_follow_up = contactData.next_follow_up || null;
    this.notes = contactData.notes || '';
    this.tags = contactData.tags || [];
    this.address = contactData.address || {};
    this.social_media = contactData.social_media || {};
    this.lead_score = contactData.lead_score || 0;
    this.is_active = contactData.is_active !== undefined ? contactData.is_active : true;
    this.interactions = contactData.interactions || [];
    this.custom_fields = contactData.custom_fields || {};
    this.created_by = contactData.created_by;
    this.last_modified_by = contactData.last_modified_by || null;
    this.metadata_source = contactData.metadata_source || 'manual';
    this.created_at = contactData.created_at;
    this.updated_at = contactData.updated_at;
  }

  // Create a new contact
  static async create(contactData) {
    try {
      const sql = `
        INSERT INTO contacts (
          name, email, phone, company, position, status, source, assigned_to, 
          customer_id, last_contacted, next_follow_up, notes, tags, address, 
          social_media, lead_score, is_active, interactions, custom_fields, 
          created_by, metadata_source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        contactData.name,
        contactData.email.toLowerCase(),
        contactData.phone || null,
        contactData.company || null,
        contactData.position || null,
        contactData.status || 'Cold',
        contactData.source || 'Website',
        contactData.assigned_to,
        contactData.customer_id || null,
        contactData.last_contacted || null,
        contactData.next_follow_up || null,
        contactData.notes || '',
        JSON.stringify(contactData.tags || []),
        JSON.stringify(contactData.address || {}),
        JSON.stringify(contactData.social_media || {}),
        contactData.lead_score || 0,
        contactData.is_active !== undefined ? contactData.is_active : true,
        JSON.stringify(contactData.interactions || []),
        JSON.stringify(contactData.custom_fields || {}),
        contactData.created_by,
        contactData.metadata_source || 'manual'
      ];

      const result = await insert(sql, values);
      return await Contact.findById(result.lastID);
    } catch (error) {
      throw error;
    }
  }

  // Find contact by ID
  static async findById(id) {
    try {
      const result = await query('SELECT * FROM contacts WHERE id = ?', [id]);
      return result.length > 0 ? new Contact(result[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Find contact by email
  static async findByEmail(email) {
    try {
      const result = await query('SELECT * FROM contacts WHERE email = ?', [email.toLowerCase()]);
      return result.length > 0 ? new Contact(result[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Get all contacts with pagination and filtering
  static async findAll(page = 1, limit = 10, filters = {}) {
    try {
      let sql = 'SELECT * FROM contacts WHERE 1=1';
      const values = [];
      let paramCount = 0;

      // Apply filters
      if (filters.status) {
        paramCount++;
        sql += ` AND status = ?`;
        values.push(filters.status);
      }

      if (filters.assigned_to) {
        paramCount++;
        sql += ` AND assigned_to = ?`;
        values.push(filters.assigned_to);
      }

      if (filters.customer_id) {
        paramCount++;
        sql += ` AND customer_id = ?`;
        values.push(filters.customer_id);
      }

      if (filters.source) {
        paramCount++;
        sql += ` AND source = ?`;
        values.push(filters.source);
      }

      // Add search functionality
      if (filters.search) {
        paramCount++;
        sql += ` AND (name LIKE ? OR email LIKE ? OR company LIKE ?)`;
        values.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
      }

      // Add pagination
      const offset = (page - 1) * limit;
      sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      values.push(limit, offset);

      const result = await query(sql, values);
      return result.map(row => new Contact(row));
    } catch (error) {
      console.error('Error in Contact.findAll:', error);
      throw error;
    }
  }

  // Get contacts by status
  static async getByStatus(status, assignedTo = null) {
    try {
      let sql = 'SELECT * FROM contacts WHERE status = ?';
      const values = [status];

      if (assignedTo) {
        sql += ' AND assigned_to = ?';
        values.push(assignedTo);
      }

      sql += ' ORDER BY created_at DESC';
      const result = await query(sql, values);
      return result.map(row => new Contact(row));
    } catch (error) {
      console.error('Error in Contact.getByStatus:', error);
      throw error;
    }
  }

  // Get overdue follow-ups
  static async getOverdueFollowUps(assignedTo = null) {
    try {
      let sql = 'SELECT * FROM contacts WHERE next_follow_up < datetime("now")';
      const values = [];

      if (assignedTo) {
        sql += ' AND assigned_to = ?';
        values.push(assignedTo);
      }

      sql += ' ORDER BY next_follow_up ASC';
      const result = await query(sql, values);
      return result.map(row => new Contact(row));
    } catch (error) {
      console.error('Error in Contact.getOverdueFollowUps:', error);
      throw error;
    }
  }

  // Update contact
  async update(updateData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 0;

      // Build dynamic update query
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined && key !== 'id') {
          paramCount++;
          fields.push(`${key} = ?`);
          
          // Handle JSON fields
          if (['tags', 'address', 'social_media', 'interactions', 'custom_fields'].includes(key)) {
            values.push(JSON.stringify(updateData[key]));
          } else {
            values.push(updateData[key]);
          }
        }
      });

      if (fields.length === 0) return this;

      // Add updated_at timestamp
      paramCount++;
      fields.push(`updated_at = ?`);
      values.push(new Date().toISOString());

      // Add ID for WHERE clause
      values.push(this.id);

      const sql = `UPDATE contacts SET ${fields.join(', ')} WHERE id = ?`;
      await query(sql, values);
      
      // Fetch updated record
      const updatedContact = await Contact.findById(this.id);
      if (updatedContact) {
        Object.assign(this, updatedContact);
      }
      
      return this;
    } catch (error) {
      console.error('Error in Contact.update:', error);
      throw error;
    }
  }

  // Delete contact (soft delete)
  async delete() {
    try {
      await query(
        'UPDATE contacts SET is_active = 0, updated_at = ? WHERE id = ?',
        [new Date().toISOString(), this.id]
      );
      this.is_active = false;
      return true;
    } catch (error) {
      console.error('Error in Contact.delete:', error);
      throw error;
    }
  }

  // Add interaction
  async addInteraction(interaction) {
    try {
      const currentInteractions = Array.isArray(this.interactions) ? this.interactions : [];
      const newInteraction = {
        ...interaction,
        date: new Date().toISOString(),
        id: Date.now() // Simple ID for interaction
      };
      
      currentInteractions.push(newInteraction);
      
      await query(
        'UPDATE contacts SET interactions = ?, last_contacted = ?, updated_at = ? WHERE id = ?',
        [JSON.stringify(currentInteractions), new Date().toISOString(), new Date().toISOString(), this.id]
      );
      
      this.interactions = currentInteractions;
      this.last_contacted = new Date().toISOString();
      return this;
    } catch (error) {
      console.error('Error in Contact.addInteraction:', error);
      throw error;
    }
  }

  // Update lead score
  async updateLeadScore(score) {
    try {
      const newScore = Math.max(0, Math.min(100, score));
      await query(
        'UPDATE contacts SET lead_score = ?, updated_at = ? WHERE id = ?',
        [newScore, new Date().toISOString(), this.id]
      );
      this.lead_score = newScore;
      return this;
    } catch (error) {
      console.error('Error in Contact.updateLeadScore:', error);
      throw error;
    }
  }

  // Virtual properties
  get daysSinceLastContact() {
    if (!this.last_contacted) return null;
    const diffTime = Math.abs(new Date() - new Date(this.last_contacted));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get isOverdue() {
    if (!this.next_follow_up) return false;
    return new Date(this.next_follow_up) < new Date();
  }

  // Convert to JSON
  toJSON() {
    const contactObj = { ...this };
    
    // Parse JSON fields if they're strings
    if (typeof contactObj.tags === 'string') {
      contactObj.tags = JSON.parse(contactObj.tags);
    }
    if (typeof contactObj.address === 'string') {
      contactObj.address = JSON.parse(contactObj.address);
    }
    if (typeof contactObj.social_media === 'string') {
      contactObj.social_media = JSON.parse(contactObj.social_media);
    }
    if (typeof contactObj.interactions === 'string') {
      contactObj.interactions = JSON.parse(contactObj.interactions);
    }
    if (typeof contactObj.custom_fields === 'string') {
      contactObj.custom_fields = JSON.parse(contactObj.custom_fields);
    }
    
    return contactObj;
  }
}

module.exports = Contact;