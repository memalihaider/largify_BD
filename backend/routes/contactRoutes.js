const express = require('express');
const Contact = require('../models/Contact');
const { protect, authorize } = require('../middleware/authMiddleware.cjs');
const router = express.Router();

// @desc    Get all contacts (with pagination, filtering, and search)
// @route   GET /api/contacts
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
      sort_order = 'desc'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const filters = {};

    // Apply filters
    if (status) filters.status = status;
    if (source) filters.source = source;
    if (assigned_to) filters.assigned_to = parseInt(assigned_to);

    // For non-admin users, only show their assigned contacts
    if (!req.user.hasPermission('admin')) {
      filters.assigned_to = req.user.id;
    }

    const contacts = await Contact.findAll(parseInt(page), parseInt(limit), filters);
    
    // Get total count for pagination (simplified for now)
    const totalCount = contacts.length;

    res.json({
      success: true,
      data: {
        contacts: contacts,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(totalCount / parseInt(limit)),
          total_contacts: totalCount,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving contacts'
    });
  }
});

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Check if user can access this contact
    if (!req.user.hasPermission('admin') && contact.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        contact
      }
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving contact'
    });
  }
});

// @desc    Create new contact
// @route   POST /api/contacts
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
      customer_id,
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

    // Check if contact already exists
    const existingContact = await Contact.findByEmail(email);
    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'Contact already exists with this email'
      });
    }

    const contactData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      position: position?.trim() || null,
      status,
      source,
      assigned_to: assigned_to || req.user.id,
      customer_id: customer_id || null,
      notes: notes?.trim() || null,
      tags: tags || [],
      lead_score: parseInt(lead_score) || 0,
      custom_fields: custom_fields || {},
      metadata_created_by: req.user.id,
      metadata_source: 'manual'
    };

    const contact = await Contact.create(contactData);

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: {
        contact
      }
    });

  } catch (error) {
    console.error('Create contact error:', error);
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(400).json({
        success: false,
        message: 'Contact already exists with this email'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating contact'
    });
  }
});

// @desc    Update contact
// @route   PUT /api/contacts/:id
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
      customer_id,
      notes,
      tags,
      lead_score,
      custom_fields
    } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Check if user can update this contact
    if (!req.user.hasPermission('admin') && contact.assigned_to !== req.user.id) {
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
    if (customer_id !== undefined) updateData.customer_id = customer_id;
    if (notes !== undefined) updateData.notes = notes?.trim() || null;
    if (tags !== undefined) updateData.tags = tags;
    if (lead_score !== undefined) updateData.lead_score = parseInt(lead_score) || 0;
    if (custom_fields !== undefined) updateData.custom_fields = custom_fields;

    // Add metadata
    updateData.metadata_last_modified_by = req.user.id;

    const updatedContact = await contact.update(updateData);

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: {
        contact: updatedContact
      }
    });

  } catch (error) {
    console.error('Update contact error:', error);
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating contact'
    });
  }
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private (Admin or assigned user)
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Check if user can delete this contact
    if (!req.user.hasPermission('admin') && contact.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await contact.delete();

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting contact'
    });
  }
});

// @desc    Add interaction to contact
// @route   POST /api/contacts/:id/interactions
// @access  Private
router.post('/:id/interactions', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, notes, outcome, next_follow_up } = req.body;

    if (!type || !notes) {
      return res.status(400).json({
        success: false,
        message: 'Interaction type and notes are required'
      });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Check if user can add interaction to this contact
    if (!req.user.hasPermission('admin') && contact.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const interaction = {
      type,
      notes: notes.trim(),
      outcome: outcome?.trim() || null,
      user_id: req.user.id,
      date: new Date()
    };

    const updatedContact = await contact.addInteraction(interaction, next_follow_up);

    res.status(201).json({
      success: true,
      message: 'Interaction added successfully',
      data: {
        contact: updatedContact
      }
    });

  } catch (error) {
    console.error('Add interaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding interaction'
    });
  }
});

// @desc    Update lead score
// @route   PUT /api/contacts/:id/lead-score
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

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Check if user can update this contact
    if (!req.user.hasPermission('admin') && contact.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedContact = await contact.updateLeadScore(parseInt(score), reason);

    res.json({
      success: true,
      message: 'Lead score updated successfully',
      data: {
        contact: updatedContact
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

// @desc    Get contacts by status
// @route   GET /api/contacts/status/:status
// @access  Private
router.get('/status/:status', protect, async (req, res) => {
  try {
    const { status } = req.params;
    const { assigned_to } = req.query;

    const filters = { status };
    
    // For non-admin users, only show their assigned contacts
    if (!req.user.hasPermission('admin')) {
      filters.assigned_to = req.user.id;
    } else if (assigned_to) {
      filters.assigned_to = parseInt(assigned_to);
    }

    const contacts = await Contact.findByStatus(status, filters);

    res.json({
      success: true,
      data: {
        contacts,
        count: contacts.length
      }
    });

  } catch (error) {
    console.error('Get contacts by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving contacts'
    });
  }
});

// @desc    Get overdue follow-ups
// @route   GET /api/contacts/overdue-followups
// @access  Private
router.get('/overdue-followups', protect, async (req, res) => {
  try {
    const { assigned_to } = req.query;
    
    const filters = {};
    
    // For non-admin users, only show their assigned contacts
    if (!req.user.hasPermission('admin')) {
      filters.assigned_to = req.user.id;
    } else if (assigned_to) {
      filters.assigned_to = parseInt(assigned_to);
    }

    const contacts = await Contact.getOverdueFollowUps(filters);

    res.json({
      success: true,
      data: {
        contacts,
        count: contacts.length
      }
    });

  } catch (error) {
    console.error('Get overdue follow-ups error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving overdue follow-ups'
    });
  }
});

// @desc    Bulk update contacts
// @route   PUT /api/contacts/bulk
// @access  Private (Admin)
router.put('/bulk', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { contact_ids, updates } = req.body;

    if (!contact_ids || !Array.isArray(contact_ids) || contact_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid contact IDs array'
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

    const result = await Contact.bulkUpdate(contact_ids, updates);

    res.json({
      success: true,
      message: `Successfully updated ${result.updated_count} contacts`,
      data: {
        updated_count: result.updated_count,
        contact_ids: contact_ids
      }
    });

  } catch (error) {
    console.error('Bulk update contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating contacts'
    });
  }
});

module.exports = router;