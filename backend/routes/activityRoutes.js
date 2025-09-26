const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware.cjs');
const router = express.Router();

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // For now, return empty array as activities functionality is not implemented
    res.json({
      success: true,
      data: {
        activities: [],
        pagination: {
          current_page: 1,
          total_pages: 0,
          total_activities: 0,
          per_page: 10
        }
      }
    });

  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving activities'
    });
  }
});

// @desc    Get activity by ID
// @route   GET /api/activities/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    res.status(404).json({
      success: false,
      message: 'Activity not found'
    });

  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving activity'
    });
  }
});

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    res.status(501).json({
      success: false,
      message: 'Activity creation not implemented yet'
    });

  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating activity'
    });
  }
});

module.exports = router;