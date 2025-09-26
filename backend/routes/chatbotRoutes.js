const express = require('express');
const router = express.Router();
const ChatbotService = require('../services/ChatbotService');
const { protect } = require('../middleware/authMiddleware.cjs');

const chatbotService = new ChatbotService();

// POST /api/chatbot/chat - Send message to chatbot
router.post('/chat', protect, async (req, res) => {
  try {
    const { message, context = {} } = req.body;
    const userRole = req.user.role;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Add user context
    const enhancedContext = {
      ...context,
      userId: req.user.id,
      userRole: userRole,
      organizationId: req.user.organization_id
    };

    const response = await chatbotService.generateResponse(message, userRole, enhancedContext);
    
    res.json(response);
  } catch (error) {
    console.error('Chatbot route error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      response: "I apologize, but I'm experiencing technical difficulties. Please try again later."
    });
  }
});

// GET /api/chatbot/suggestions - Get contextual suggestions
router.get('/suggestions', protect, async (req, res) => {
  try {
    const { currentPage } = req.query;
    const suggestions = chatbotService.getContextualSuggestions(currentPage);
    
    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
    });
  }
});

// GET /api/chatbot/knowledge - Get knowledge base (Admin/Super Admin only)
router.get('/knowledge', protect, async (req, res) => {
  try {
    // Check if user has admin privileges
    if (!['Admin', 'Super Admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    const knowledge = chatbotService.applicationKnowledge;
    
    res.json({
      success: true,
      knowledge
    });
  } catch (error) {
    console.error('Error getting knowledge base:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get knowledge base'
    });
  }
});

// POST /api/chatbot/feedback - Submit feedback about chatbot response
router.post('/feedback', protect, async (req, res) => {
  try {
    const { messageId, rating, feedback, helpful } = req.body;
    
    // In a production environment, you would store this feedback in a database
    // For now, we'll just log it
    console.log('Chatbot feedback received:', {
      userId: req.user.id,
      messageId,
      rating,
      feedback,
      helpful,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Feedback received successfully'
    });
  } catch (error) {
    console.error('Chatbot feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
});

module.exports = router;