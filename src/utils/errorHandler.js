/**
 * Frontend Error Handler Utility
 * Provides centralized error handling and user-friendly error messages
 */

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// User-friendly error messages
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Network connection error. Please check your internet connection and try again.',
  [ERROR_TYPES.AUTH]: 'Authentication failed. Please log in again.',
  [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
  [ERROR_TYPES.SERVER]: 'Server error occurred. Please try again later.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.'
};

/**
 * Determine error type based on error object
 * @param {Error|Object} error - Error object
 * @returns {string} Error type
 */
export const getErrorType = (error) => {
  if (!error) return ERROR_TYPES.UNKNOWN;
  
  // Network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return ERROR_TYPES.NETWORK;
  }
  
  // Authentication errors
  if (error.status === 401 || error.response?.status === 401) {
    return ERROR_TYPES.AUTH;
  }
  
  // Validation errors
  if (error.status === 400 || error.response?.status === 400) {
    return ERROR_TYPES.VALIDATION;
  }
  
  // Server errors
  if (error.status >= 500 || error.response?.status >= 500) {
    return ERROR_TYPES.SERVER;
  }
  
  return ERROR_TYPES.UNKNOWN;
};

/**
 * Get user-friendly error message
 * @param {Error|Object} error - Error object
 * @param {string} fallbackMessage - Custom fallback message
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, fallbackMessage = null) => {
  const errorType = getErrorType(error);
  
  // Try to get specific error message from response
  const specificMessage = error?.response?.data?.message || 
                         error?.response?.data?.error || 
                         error?.message;
  
  // Return specific message if it's user-friendly, otherwise use generic message
  if (specificMessage && specificMessage.length < 100 && !specificMessage.includes('Error:')) {
    return specificMessage;
  }
  
  return fallbackMessage || ERROR_MESSAGES[errorType];
};

/**
 * Log error for debugging while showing user-friendly message
 * @param {Error|Object} error - Error object
 * @param {string} context - Context where error occurred
 * @param {string} fallbackMessage - Custom fallback message
 * @returns {string} User-friendly error message
 */
export const handleError = (error, context = 'Unknown', fallbackMessage = null) => {
  // Log detailed error for debugging
  console.error(`[${context}] Error:`, {
    error,
    message: error?.message,
    stack: error?.stack,
    response: error?.response?.data,
    status: error?.response?.status || error?.status
  });
  
  // Return user-friendly message
  return getErrorMessage(error, fallbackMessage);
};

/**
 * Create error notification object
 * @param {Error|Object} error - Error object
 * @param {string} context - Context where error occurred
 * @param {string} fallbackMessage - Custom fallback message
 * @returns {Object} Notification object
 */
export const createErrorNotification = (error, context = 'Unknown', fallbackMessage = null) => {
  const message = handleError(error, context, fallbackMessage);
  const errorType = getErrorType(error);
  
  return {
    type: 'error',
    title: 'Error',
    message,
    errorType,
    timestamp: new Date().toISOString()
  };
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} Promise that resolves with function result
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication errors
      if (getErrorType(error) === ERROR_TYPES.AUTH) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Debounced error handler to prevent spam
 */
class DebouncedErrorHandler {
  constructor(delay = 1000) {
    this.delay = delay;
    this.timeouts = new Map();
  }
  
  handle(key, error, context, fallbackMessage) {
    // Clear existing timeout
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
    }
    
    // Set new timeout
    const timeout = setTimeout(() => {
      handleError(error, context, fallbackMessage);
      this.timeouts.delete(key);
    }, this.delay);
    
    this.timeouts.set(key, timeout);
  }
}

export const debouncedErrorHandler = new DebouncedErrorHandler();

export default {
  ERROR_TYPES,
  getErrorType,
  getErrorMessage,
  handleError,
  createErrorNotification,
  retryWithBackoff,
  debouncedErrorHandler
};