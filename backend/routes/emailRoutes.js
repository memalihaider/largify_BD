const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure email transporter (using Gmail as example)
const transporter = nodemailer.createTransporter({
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