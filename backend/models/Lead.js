const { query, insert } = require('../config/database');

class Lead {
  constructor(leadData) {
    this.id = leadData.id;
    this.name = leadData.name;
    this.email = leadData.email;
    this.phone = leadData.phone || null;
    this.company = leadData.company || null;
    this.position = leadData.position || null;
    this.status = leadData.status || 'New';
    this.source = leadData.source || 'Website';
    this.assigned_to = leadData.assigned_to;
    this.value = leadData.value || 0;
    this.currency = leadData.currency || 'USD';
    this.probability = leadData.probability || 10;
    this.expected_close_date = leadData.expected_close_date || null;
    this.last_contact = leadData.last_contact || null;
    this.next_follow_up = leadData.next_follow_up || null;
    this.notes = leadData.notes || '';
    this.tags = leadData.tags || [];
    this.priority = leadData.priority || 'Medium';
    this.lead_score = leadData.lead_score || 0;
    this.qualification = leadData.qualification || {};
    this.contact_id = leadData.contact_id || null;
    this.activities = leadData.activities || [];
    this.custom_fields = leadData.custom_fields || {};
    this.is_active = leadData.is_active !== undefined ? leadData.is_active : true;
    this.converted_at = leadData.converted_at || null;
    this.lost_reason = leadData.lost_reason || null;
    this.created_by = leadData.created_by;
    this.last_modified_by = leadData.last_modified_by || null;
    this.metadata_source = leadData.metadata_source || 'manual';
    this.created_at = leadData.created_at;
    this.updated_at = leadData.updated_at;
  }

  // Create a new lead
  static async create(leadData) {
    try {
      const sql = `
        INSERT INTO leads (
          name, email, phone, company, position, status, source, assigned_to, 
          value, currency, probability, expected_close_date, last_contact, 
          next_follow_up, notes, tags, priority, lead_score, qualification, 
          contact_id, activities, custom_fields, is_active, created_by, metadata_source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        leadData.name,
        leadData.email.toLowerCase(),
        leadData.phone || null,
        leadData.company || null,
        leadData.position || null,
        leadData.status || 'New',
        leadData.source || 'Website',
        leadData.assigned_to,
        leadData.value || 0,
        leadData.currency || 'USD',
        leadData.probability || 10,
        leadData.expected_close_date || null,
        leadData.last_contact || null,
        leadData.next_follow_up || null,
        leadData.notes || '',
        JSON.stringify(leadData.tags || []),
        leadData.priority || 'Medium',
        leadData.lead_score || 0,
        JSON.stringify(leadData.qualification || {}),
        leadData.contact_id || null,
        JSON.stringify(leadData.activities || []),
        JSON.stringify(leadData.custom_fields || {}),
        leadData.is_active !== undefined ? leadData.is_active : 1,
        leadData.created_by,
        leadData.metadata_source || 'manual'
      ];

      const result = await query(sql, values);
      // For SQLite, we need to get the inserted row
      const insertedLead = await query('SELECT * FROM leads WHERE id = last_insert_rowid()');
      return new Lead(insertedLead[0]);
    } catch (error) {
      console.error('Error in Lead.create:', error);
      throw error;
    }
  }

  // Find lead by ID
  static async findById(id) {
    try {
      const result = await query('SELECT * FROM leads WHERE id = ?', [id]);
      return result.length > 0 ? new Lead(result[0]) : null;
    } catch (error) {
      console.error('Error in Lead.findById:', error);
      throw error;
    }
  }

  // Find lead by email
  static async findByEmail(email) {
    try {
      const result = await query('SELECT * FROM leads WHERE email = ?', [email.toLowerCase()]);
      return result.length > 0 ? new Lead(result[0]) : null;
    } catch (error) {
      console.error('Error in Lead.findByEmail:', error);
      throw error;
    }
  }

  // Find all leads with pagination and filters
  static async findAll(page = 1, limit = 10, filters = {}) {
    try {
      let sql = 'SELECT * FROM leads WHERE 1=1';
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

      if (filters.priority) {
        paramCount++;
        sql += ` AND priority = ?`;
        values.push(filters.priority);
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
      return result.map(row => new Lead(row));
    } catch (error) {
      console.error('Error in Lead.findAll:', error);
      throw error;
    }
  }

  // Get leads by status
  static async getByStatus(status, assignedTo = null) {
    try {
      let sql = 'SELECT * FROM leads WHERE status = ?';
      const values = [status];

      if (assignedTo) {
        sql += ' AND assigned_to = ?';
        values.push(assignedTo);
      }

      sql += ' ORDER BY created_at DESC';
      const result = await query(sql, values);
      return result.map(row => new Lead(row));
    } catch (error) {
      console.error('Error in Lead.getByStatus:', error);
      throw error;
    }
  }

  // Get pipeline value
  static async getPipelineValue(assignedTo = null) {
    try {
      let sql = `
        SELECT 
          SUM(value) as total_value,
          SUM(value * probability / 100) as weighted_value,
          COUNT(*) as count
        FROM leads 
        WHERE status NOT IN ('Closed Won', 'Closed Lost')
      `;
      const values = [];

      if (assignedTo) {
        sql += ' AND assigned_to = ?';
        values.push(assignedTo);
      }

      const result = await query(sql, values);
      return result[0] || { total_value: 0, weighted_value: 0, count: 0 };
    } catch (error) {
      console.error('Error in Lead.getPipelineValue:', error);
      throw error;
    }
  }

  // Update lead
  async update(updateData) {
    try {
      const fields = [];
      const values = [];

      // Build dynamic update query
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined && key !== 'id') {
          fields.push(`${key} = ?`);
          
          // Handle JSON fields
          if (['tags', 'qualification', 'activities', 'custom_fields'].includes(key)) {
            values.push(JSON.stringify(updateData[key]));
          } else {
            values.push(updateData[key]);
          }
        }
      });

      if (fields.length === 0) return this;

      // Add updated_at timestamp
      fields.push(`updated_at = ?`);
      values.push(new Date().toISOString());

      // Add ID for WHERE clause
      values.push(this.id);

      const sql = `UPDATE leads SET ${fields.join(', ')} WHERE id = ?`;
      await query(sql, values);
      
      // Get updated record
      const updatedLead = await query('SELECT * FROM leads WHERE id = ?', [this.id]);
      if (updatedLead[0]) {
        Object.assign(this, updatedLead[0]);
      }
      
      return this;
    } catch (error) {
      console.error('Error in Lead.update:', error);
      throw error;
    }
  }

  // Delete lead (soft delete)
  async delete() {
    try {
      await query(
        'UPDATE leads SET is_active = 0, updated_at = ? WHERE id = ?',
        [new Date().toISOString(), this.id]
      );
      this.is_active = 0;
      return true;
    } catch (error) {
      console.error('Error in Lead.delete:', error);
      throw error;
    }
  }

  // Add activity
  async addActivity(activity) {
    try {
      const currentActivities = Array.isArray(this.activities) ? this.activities : [];
      const newActivity = {
        ...activity,
        date: new Date().toISOString(),
        id: Date.now() // Simple ID for activity
      };
      
      currentActivities.push(newActivity);
      
      await query(
        'UPDATE leads SET activities = ?, last_contact = ?, updated_at = ? WHERE id = ?',
        [JSON.stringify(currentActivities), new Date().toISOString(), new Date().toISOString(), this.id]
      );
      
      this.activities = currentActivities;
      this.last_contact = new Date().toISOString();
      return this;
    } catch (error) {
      console.error('Error in Lead.addActivity:', error);
      throw error;
    }
  }

  // Update lead score
  async updateLeadScore(score) {
    try {
      const newScore = Math.max(0, Math.min(100, score));
      await query(
        'UPDATE leads SET lead_score = ?, updated_at = ? WHERE id = ?',
        [newScore, new Date().toISOString(), this.id]
      );
      this.lead_score = newScore;
      return this;
    } catch (error) {
      console.error('Error in Lead.updateLeadScore:', error);
      throw error;
    }
  }

  // Convert to customer
  async convertToCustomer() {
    try {
      await query(
        'UPDATE leads SET status = ?, converted_at = ?, probability = 100, updated_at = ? WHERE id = ?',
        ['Closed Won', new Date().toISOString(), new Date().toISOString(), this.id]
      );
      this.status = 'Closed Won';
      this.converted_at = new Date().toISOString();
      this.probability = 100;
      return this;
    } catch (error) {
      console.error('Error in Lead.convertToCustomer:', error);
      throw error;
    }
  }

  // Virtual properties
  get weightedValue() {
    return (this.value * this.probability) / 100;
  }

  get daysSinceLastContact() {
    if (!this.last_contact) return null;
    const diffTime = Math.abs(new Date() - new Date(this.last_contact));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get isOverdue() {
    if (!this.next_follow_up) return false;
    return new Date(this.next_follow_up) < new Date();
  }

  get qualificationScore() {
    const qualification = typeof this.qualification === 'string' ? 
      JSON.parse(this.qualification) : this.qualification;
    
    const scores = {
      budget: { 'Unknown': 0, 'Under $1K': 1, '$1K-$5K': 2, '$5K-$10K': 3, '$10K-$50K': 4, '$50K+': 5 },
      authority: { 'Unknown': 0, 'Influencer': 2, 'Decision Maker': 4, 'Economic Buyer': 5 },
      need: { 'Unknown': 0, 'Identified': 2, 'Urgent': 4, 'Critical': 5 },
      timeline: { 'Unknown': 0, 'Immediate': 5, '1-3 months': 4, '3-6 months': 3, '6+ months': 1 }
    };
    
    return (scores.budget[qualification.budget] || 0) +
           (scores.authority[qualification.authority] || 0) +
           (scores.need[qualification.need] || 0) +
           (scores.timeline[qualification.timeline] || 0);
  }

  // Convert to JSON
  toJSON() {
    const leadObj = { ...this };
    
    // Parse JSON fields if they're strings
    if (typeof leadObj.tags === 'string') {
      leadObj.tags = JSON.parse(leadObj.tags);
    }
    if (typeof leadObj.qualification === 'string') {
      leadObj.qualification = JSON.parse(leadObj.qualification);
    }
    if (typeof leadObj.activities === 'string') {
      leadObj.activities = JSON.parse(leadObj.activities);
    }
    if (typeof leadObj.custom_fields === 'string') {
      leadObj.custom_fields = JSON.parse(leadObj.custom_fields);
    }
    
    return leadObj;
  }
}

module.exports = Lead;