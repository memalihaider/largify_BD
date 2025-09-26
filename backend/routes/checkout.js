const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Email templates
const getEmailTemplate = (emailType, orderData) => {
  const templates = {
    status_update: {
      subject: `Order Status Update - ${orderData.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Status Update</h2>
          <p>Dear ${orderData.user},</p>
          <p>Your order status has been updated:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${orderData.id}</p>
            <p><strong>Plan:</strong> ${orderData.plan}</p>
            <p><strong>Status:</strong> <span style="color: #007bff; font-weight: bold;">${orderData.status.toUpperCase()}</span></p>
            <p><strong>Amount:</strong> ${orderData.amount}</p>
          </div>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>BD SaaS Team</p>
        </div>
      `
    },
    receipt_confirmation: {
      subject: `Receipt Confirmation - ${orderData.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Receipt Confirmation</h2>
          <p>Dear ${orderData.user},</p>
          <p>We have received and processed your payment receipt for the following order:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${orderData.id}</p>
            <p><strong>Plan:</strong> ${orderData.plan}</p>
            <p><strong>Amount:</strong> ${orderData.amount}</p>
            <p><strong>Payment Date:</strong> ${orderData.date}</p>
            <p><strong>Receipt Status:</strong> <span style="color: #28a745; font-weight: bold;">VERIFIED</span></p>
          </div>
          <p>Your subscription is now active and you can access all premium features.</p>
          <p>Thank you for choosing BD SaaS!</p>
          <p>Best regards,<br>BD SaaS Team</p>
        </div>
      `
    }
  };

  return templates[emailType] || templates.status_update;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/receipts');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
  }
});

// Process checkout with order creation (no user registration)
router.post('/process', upload.single('receipt'), async (req, res) => {
  try {
    const {
      // Personal Information
      firstName,
      lastName,
      email,
      phone,
      company,
      city,
      // Plan Information
      planName,
      planPrice,
      planCurrency,
      planPeriod,
      // Additional Information
      notes
    } = req.body;

    // Validate required fields
    const requiredFields = {
      firstName,
      lastName,
      email,
      phone,
      planName,
      planPrice
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.trim() === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields
      });
    }

    // Validate receipt file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Receipt file is required'
      });
    }

    // Create order without user registration
    const orderData = {
      user_id: null, // No user account created yet
      plan_name: planName,
      plan_price: parseFloat(planPrice),
      plan_currency: planCurrency || 'PKR',
      plan_period: planPeriod,
      status: 'pending',
      payment_method: 'bank_transfer',
      receipt_url: `/uploads/receipts/${req.file.filename}`,
      personal_info: {
        firstName,
        lastName,
        email,
        phone,
        company: company || null,
        city: city || null
      },
      notes: notes || null
    };

    const newOrder = await Order.create(orderData);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Checkout processed successfully. Your subscription is pending approval.',
      data: {
        order: {
          id: newOrder.id,
          plan_name: newOrder.plan_name,
          plan_price: newOrder.plan_price,
          plan_currency: newOrder.plan_currency,
          plan_period: newOrder.plan_period,
          status: newOrder.status,
          created_at: newOrder.created_at,
          email: newOrder.personal_info.email
        }
      }
    });

  } catch (error) {
    console.error('Checkout processing error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during checkout processing',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get checkout status by order ID
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const user = await User.findById(order.user_id);
    
    res.json({
      success: true,
      data: {
        order: {
          id: order.id,
          plan_name: order.plan_name,
          plan_price: order.plan_price,
          plan_currency: order.plan_currency,
          status: order.status,
          created_at: order.created_at,
          approved_at: order.approved_at
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          approval_status: user.approval_status,
          is_active: user.is_active
        }
      }
    });

  } catch (error) {
    console.error('Get checkout status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all orders (for admin/management)
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      search
    };

    const result = await Order.findAll(options);
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update order status (for admin approval)
router.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, approvedBy } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    await order.updateStatus(status, approvedBy);

    // If order is approved, create user account and activate subscription
    if (status === 'approved') {
      const personalInfo = typeof order.personal_info === 'string' 
        ? JSON.parse(order.personal_info) 
        : order.personal_info;

      // Generate a temporary password for the user
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();

      // Create new user account
      const userData = {
        name: `${personalInfo.firstName} ${personalInfo.lastName}`,
        email: personalInfo.email.toLowerCase(),
        password: tempPassword,
        role: 'customer',
        approval_status: 'approved',
        is_active: true,
        phone: personalInfo.phone,
        company: personalInfo.company || null,
        source: 'order_approval',
        approved_by: approvedBy,
        approved_at: new Date().toISOString()
      };

      const newUser = await User.create(userData);

      // Update order with user_id
      await order.update({
        user_id: newUser.id,
        status: 'active' // Automatically activate the subscription
      });

      // TODO: Send email notification with login credentials
      console.log(`User created for approved order: ${personalInfo.email}, temp password: ${tempPassword}`);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order: order.toJSON()
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Send email endpoint
router.post('/send-email', async (req, res) => {
  try {
    const { to, orderData, emailType } = req.body;

    if (!to || !orderData || !emailType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, orderData, emailType'
      });
    }

    const template = getEmailTemplate(emailType, orderData);

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@bd-saas.com',
      to: to,
      subject: template.subject,
      html: template.html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@bd-saas.com',
      to: to,
      subject: 'BD SaaS - Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Test Successful!</h2>
          <p>This is a test email from BD SaaS system.</p>
          <p>If you received this email, the email functionality is working correctly.</p>
          <p>Best regards,<br>BD SaaS Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;