const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User creation validation
const validateUserCreation = [
  body('first_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  body('last_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  body('role')
    .optional()
    .isIn(['customer', 'team', 'admin', 'superadmin'])
    .withMessage('Role must be one of: customer, team, admin, superadmin'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Company name must not exceed 255 characters'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must not exceed 100 characters'),
  
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position must not exceed 100 characters'),
  
  handleValidationErrors
];

// User update validation
const validateUserUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  
  body('role')
    .optional()
    .isIn(['customer', 'team', 'admin', 'superadmin'])
    .withMessage('Role must be one of: customer, team, admin, superadmin'),
  
  body('approval_status')
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Approval status must be one of: pending, approved, rejected'),
  
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be a boolean value'),
  
  body('phone')
    .optional()
    .custom((value) => {
      if (value === null || value === '') return true;
      return /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''));
    })
    .withMessage('Please provide a valid phone number'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Company name must not exceed 255 characters'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must not exceed 100 characters'),
  
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position must not exceed 100 characters'),
  
  body('email_verified')
    .optional()
    .isBoolean()
    .withMessage('Email verified status must be a boolean value'),
  
  handleValidationErrors
];

// User ID parameter validation
const validateUserId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  handleValidationErrors
];

// Query parameter validation for user listing
const validateUserQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('role')
    .optional()
    .isIn(['customer', 'team', 'admin', 'superadmin'])
    .withMessage('Role must be one of: customer, team, admin, superadmin'),
  
  query('approval_status')
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Approval status must be one of: pending, approved, rejected'),
  
  query('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be a boolean value'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Search term must not exceed 255 characters'),
  
  query('sort_by')
    .optional()
    .isIn(['name', 'email', 'role', 'created_at', 'updated_at', 'last_login'])
    .withMessage('Sort by must be one of: name, email, role, created_at, updated_at, last_login'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc'),
  
  handleValidationErrors
];

// Bulk update validation
const validateBulkUpdate = [
  body('user_ids')
    .isArray({ min: 1 })
    .withMessage('User IDs must be a non-empty array')
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      return value.every(id => Number.isInteger(id) && id > 0);
    })
    .withMessage('All user IDs must be positive integers'),
  
  body('updates')
    .isObject()
    .withMessage('Updates must be an object')
    .custom((value) => {
      const allowedFields = ['role', 'approval_status', 'is_active'];
      const providedFields = Object.keys(value);
      return providedFields.length > 0 && providedFields.every(field => allowedFields.includes(field));
    })
    .withMessage('Updates must contain at least one valid field: role, approval_status, is_active'),
  
  body('updates.role')
    .optional()
    .isIn(['customer', 'team', 'admin', 'superadmin'])
    .withMessage('Role must be one of: customer, team, admin, superadmin'),
  
  body('updates.approval_status')
    .optional()
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Approval status must be one of: pending, approved, rejected'),
  
  body('updates.is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be a boolean value'),
  
  handleValidationErrors
];

// Password validation for password changes
const validatePasswordChange = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  
  body('current_password')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('new_password')
    .isLength({ min: 8, max: 128 })
    .withMessage('New password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  body('confirm_password')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Sanitization middleware
const sanitizeUserInput = (req, res, next) => {
  console.log('sanitizeUserInput middleware called'); // Debug log
  if (req.body) {
    console.log('Original body:', req.body); // Debug log
    
    // Combine first_name and last_name into name if they exist
    if (req.body.first_name && req.body.last_name) {
      req.body.name = `${req.body.first_name} ${req.body.last_name}`.trim();
    }
    
    // Trim string fields
    const stringFields = ['name', 'first_name', 'last_name', 'email', 'phone', 'company', 'department', 'position'];
    stringFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = req.body[field].trim();
      }
    });
    
    // Convert empty strings to null for optional fields
    const optionalFields = ['phone', 'company', 'department', 'position'];
    optionalFields.forEach(field => {
      if (req.body[field] === '') {
        req.body[field] = null;
      }
    });
    
    console.log('Sanitized body:', req.body); // Debug log
  }
  
  next();
};

module.exports = {
  validateUserCreation,
  validateUserUpdate,
  validateUserId,
  validateUserQuery,
  validateBulkUpdate,
  validatePasswordChange,
  sanitizeUserInput,
  handleValidationErrors
};