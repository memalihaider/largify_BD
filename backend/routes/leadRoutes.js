const express = require('express');
const Lead = require('../models/Lead');
const { protect, authorize } = require('../middleware/authMiddleware.cjs');
const router = express.Router();

// @desc    Get all leads (with pagination, filtering, and search)
// @route   GET /api/leads
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      source,
      assigned_to,
      search,
      sort_by = 'created_at',
      sort_order = 'desc',
      min_value,
      max_value,
      currency
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const filters = {};

    // Apply filters
    if (status) filters.status = status;
    if (source) filters.source = source;
    if (assigned_to) filters.assigned_to = parseInt(assigned_to);
    if (min_value) filters.min_value = parseFloat(min_value);
    if (max_value) filters.max_value = parseFloat(max_value);
    if (currency) filters.currency = currency;

    // For non-admin users, only show their assigned leads
    if (!req.user.hasPermission('admin')) {
      filters.assigned_to = req.user.id;
    }

    const leads = await Lead.findAll(parseInt(page), parseInt(limit), filters);
    
    // Get total count for pagination (simplified for now)
    const totalCount = leads.length;

    res.json({
      success: true,
      data: {
        leads: leads,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(totalCount / parseInt(limit)),
          total_leads: totalCount,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving leads'
    });
  }
});

// @desc    Get lead by ID
// @route   GET /api/leads/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check if user can access this lead
    if (!req.user.hasPermission('admin') && lead.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        lead
      }
    });

  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving lead'
    });
  }
});

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      position,
      status = 'new',
      source = 'manual',
      assigned_to,
      value,
      currency = 'USD',
      probability = 0,
      expected_close_date,
      notes,
      tags,
      lead_score = 0,
      custom_fields
    } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if lead already exists
    const existingLead = await Lead.findByEmail(email);
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'Lead already exists with this email'
      });
    }

    const leadData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      position: position?.trim() || null,
      status,
      source,
      assigned_to: assigned_to || req.user.id,
      value: value ? parseFloat(value) : null,
      currency,
      probability: parseInt(probability) || 0,
      expected_close_date: expected_close_date || null,
      notes: notes?.trim() || null,
      tags: tags || [],
      lead_score: parseInt(lead_score) || 0,
      custom_fields: custom_fields || {},
      metadata_created_by: req.user.id,
      metadata_source: 'manual'
    };

    const lead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: {
        lead
      }
    });

  } catch (error) {
    console.error('Create lead error:', error);
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(400).json({
        success: false,
        message: 'Lead already exists with this email'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating lead'
    });
  }
});

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      company,
      position,
      status,
      source,
      assigned_to,
      value,
      currency,
      probability,
      expected_close_date,
      notes,
      tags,
      lead_score,
      custom_fields
    } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check if user can update this lead
    if (!req.user.hasPermission('admin') && lead.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name?.trim();
    if (email !== undefined) updateData.email = email?.toLowerCase().trim();
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (company !== undefined) updateData.company = company?.trim() || null;
    if (position !== undefined) updateData.position = position?.trim() || null;
    if (status !== undefined) updateData.status = status;
    if (source !== undefined) updateData.source = source;
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to;
    if (value !== undefined) updateData.value = value ? parseFloat(value) : null;
    if (currency !== undefined) updateData.currency = currency;
    if (probability !== undefined) updateData.probability = parseInt(probability) || 0;
    if (expected_close_date !== undefined) updateData.expected_close_date = expected_close_date;
    if (notes !== undefined) updateData.notes = notes?.trim() || null;
    if (tags !== undefined) updateData.tags = tags;
    if (lead_score !== undefined) updateData.lead_score = parseInt(lead_score) || 0;
    if (custom_fields !== undefined) updateData.custom_fields = custom_fields;

    // Add metadata
    updateData.metadata_last_modified_by = req.user.id;

    const updatedLead = await lead.update(updateData);

    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: {
        lead: updatedLead
      }
    });

  } catch (error) {
    console.error('Update lead error:', error);
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating lead'
    });
  }
});

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin or assigned user)
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check if user can delete this lead
    if (!req.user.hasPermission('admin') && lead.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await lead.delete();

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });

  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting lead'
    });
  }
});

// @desc    Add activity to lead
// @route   POST /api/leads/:id/activities
// @access  Private
router.post('/:id/activities', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, description, outcome, next_follow_up } = req.body;

    if (!type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Activity type and description are required'
      });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check if user can add activity to this lead
    if (!req.user.hasPermission('admin') && lead.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const activity = {
      type,
      description: description.trim(),
      outcome: outcome?.trim() || null,
      user_id: req.user.id,
      date: new Date()
    };

    const updatedLead = await lead.addActivity(activity, next_follow_up);

    res.status(201).json({
      success: true,
      message: 'Activity added successfully',
      data: {
        lead: updatedLead
      }
    });

  } catch (error) {
    console.error('Add activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding activity'
    });
  }
});

// @desc    Update lead score
// @route   PUT /api/leads/:id/lead-score
// @access  Private
router.put('/:id/lead-score', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { score, reason } = req.body;

    if (score === undefined || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        message: 'Lead score must be between 0 and 100'
      });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check if user can update this lead
    if (!req.user.hasPermission('admin') && lead.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedLead = await lead.updateLeadScore(parseInt(score), reason);

    res.json({
      success: true,
      message: 'Lead score updated successfully',
      data: {
        lead: updatedLead
      }
    });

  } catch (error) {
    console.error('Update lead score error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating lead score'
    });
  }
});

// @desc    Convert lead to customer
// @route   PUT /api/leads/:id/convert
// @access  Private
router.put('/:id/convert', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { conversion_notes } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check if user can convert this lead
    if (!req.user.hasPermission('admin') && lead.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (lead.status === 'converted') {
      return res.status(400).json({
        success: false,
        message: 'Lead is already converted'
      });
    }

    const updatedLead = await lead.convertToCustomer(req.user.id, conversion_notes);

    res.json({
      success: true,
      message: 'Lead converted to customer successfully',
      data: {
        lead: updatedLead
      }
    });

  } catch (error) {
    console.error('Convert lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error converting lead'
    });
  }
});

// @desc    Get leads by status
// @route   GET /api/leads/status/:status
// @access  Private
router.get('/status/:status', protect, async (req, res) => {
  try {
    const { status } = req.params;
    const { assigned_to } = req.query;

    const filters = { status };
    
    // For non-admin users, only show their assigned leads
    if (!req.user.hasPermission('admin')) {
      filters.assigned_to = req.user.id;
    } else if (assigned_to) {
      filters.assigned_to = parseInt(assigned_to);
    }

    const leads = await Lead.findByStatus(status, filters);

    res.json({
      success: true,
      data: {
        leads,
        count: leads.length
      }
    });

  } catch (error) {
    console.error('Get leads by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving leads'
    });
  }
});

// @desc    Get high-value leads
// @route   GET /api/leads/high-value
// @access  Private
router.get('/high-value', protect, async (req, res) => {
  try {
    const { min_value = 10000, assigned_to } = req.query;
    
    const filters = { min_value: parseFloat(min_value) };
    
    // For non-admin users, only show their assigned leads
    if (!req.user.hasPermission('admin')) {
      filters.assigned_to = req.user.id;
    } else if (assigned_to) {
      filters.assigned_to = parseInt(assigned_to);
    }

    const leads = await Lead.getHighValueLeads(filters);

    res.json({
      success: true,
      data: {
        leads,
        count: leads.length,
        min_value: parseFloat(min_value)
      }
    });

  } catch (error) {
    console.error('Get high-value leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving high-value leads'
    });
  }
});

// @desc    Get leads pipeline summary
// @route   GET /api/leads/pipeline
// @access  Private
router.get('/pipeline/summary', protect, async (req, res) => {
  try {
    const { assigned_to } = req.query;
    
    const filters = {};
    
    // For non-admin users, only show their assigned leads
    if (!req.user.hasPermission('admin')) {
      filters.assigned_to = req.user.id;
    } else if (assigned_to) {
      filters.assigned_to = parseInt(assigned_to);
    }

    const pipeline = await Lead.getPipelineSummary(filters);

    res.json({
      success: true,
      data: {
        pipeline
      }
    });

  } catch (error) {
    console.error('Get pipeline summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving pipeline summary'
    });
  }
});

// @desc    Bulk update leads
// @route   PUT /api/leads/bulk
// @access  Private (Admin)
router.put('/bulk', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { lead_ids, updates } = req.body;

    if (!lead_ids || !Array.isArray(lead_ids) || lead_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid lead IDs array'
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide updates to apply'
      });
    }

    // Add metadata
    updates.metadata_last_modified_by = req.user.id;

    const result = await Lead.bulkUpdate(lead_ids, updates);

    res.json({
      success: true,
      message: `Successfully updated ${result.updated_count} leads`,
      data: {
        updated_count: result.updated_count,
        lead_ids: lead_ids
      }
    });

  } catch (error) {
    console.error('Bulk update leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating leads'
    });
  }
});

module.exports = router;