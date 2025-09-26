const fs = require('fs').promises;
const path = require('path');

// Create logs directory if it doesn't exist
const ensureLogDirectory = async () => {
  const logDir = path.join(__dirname, '../logs');
  try {
    await fs.access(logDir);
  } catch (error) {
    await fs.mkdir(logDir, { recursive: true });
  }
};

// Log levels
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
  SECURITY: 'SECURITY'
};

// Log to file
const logToFile = async (level, message, metadata = {}) => {
  try {
    await ensureLogDirectory();
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...metadata
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    
    // Determine log file based on level
    let filename = 'application.log';
    if (level === LOG_LEVELS.SECURITY) {
      filename = 'security.log';
    } else if (level === LOG_LEVELS.ERROR) {
      filename = 'error.log';
    }
    
    const logPath = path.join(__dirname, '../logs', filename);
    await fs.appendFile(logPath, logLine);
    
    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${timestamp}] ${level}: ${message}`, metadata);
    }
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;
  
  // Capture response
  res.send = function(data) {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || null,
      userRole: req.user?.role || null
    };
    
    // Log based on status code
    if (res.statusCode >= 500) {
      logToFile(LOG_LEVELS.ERROR, 'Server Error', logData);
    } else if (res.statusCode >= 400) {
      logToFile(LOG_LEVELS.WARN, 'Client Error', logData);
    } else {
      logToFile(LOG_LEVELS.INFO, 'Request Completed', logData);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Security event logger
const securityLogger = {
  loginAttempt: (email, success, ip, userAgent) => {
    logToFile(LOG_LEVELS.SECURITY, 'Login Attempt', {
      event: 'LOGIN_ATTEMPT',
      email,
      success,
      ip,
      userAgent
    });
  },
  
  loginSuccess: (userId, email, ip, userAgent) => {
    logToFile(LOG_LEVELS.SECURITY, 'Successful Login', {
      event: 'LOGIN_SUCCESS',
      userId,
      email,
      ip,
      userAgent
    });
  },
  
  loginFailure: (email, reason, ip, userAgent) => {
    logToFile(LOG_LEVELS.SECURITY, 'Failed Login', {
      event: 'LOGIN_FAILURE',
      email,
      reason,
      ip,
      userAgent
    });
  },
  
  accountLocked: (userId, email, ip) => {
    logToFile(LOG_LEVELS.SECURITY, 'Account Locked', {
      event: 'ACCOUNT_LOCKED',
      userId,
      email,
      ip
    });
  },
  
  passwordChanged: (userId, email, changedBy, ip) => {
    logToFile(LOG_LEVELS.SECURITY, 'Password Changed', {
      event: 'PASSWORD_CHANGED',
      userId,
      email,
      changedBy,
      ip
    });
  },
  
  roleChanged: (userId, email, oldRole, newRole, changedBy, ip) => {
    logToFile(LOG_LEVELS.SECURITY, 'Role Changed', {
      event: 'ROLE_CHANGED',
      userId,
      email,
      oldRole,
      newRole,
      changedBy,
      ip
    });
  },
  
  userCreated: (userId, email, role, createdBy, ip) => {
    logToFile(LOG_LEVELS.SECURITY, 'User Created', {
      event: 'USER_CREATED',
      userId,
      email,
      role,
      createdBy,
      ip
    });
  },
  
  userDeleted: (userId, email, deletedBy, ip) => {
    logToFile(LOG_LEVELS.SECURITY, 'User Deleted', {
      event: 'USER_DELETED',
      userId,
      email,
      deletedBy,
      ip
    });
  },
  
  approvalStatusChanged: (userId, email, oldStatus, newStatus, changedBy, ip) => {
    logToFile(LOG_LEVELS.SECURITY, 'Approval Status Changed', {
      event: 'APPROVAL_STATUS_CHANGED',
      userId,
      email,
      oldStatus,
      newStatus,
      changedBy,
      ip
    });
  },
  
  unauthorizedAccess: (userId, email, attemptedAction, ip, userAgent) => {
    logToFile(LOG_LEVELS.SECURITY, 'Unauthorized Access Attempt', {
      event: 'UNAUTHORIZED_ACCESS',
      userId,
      email,
      attemptedAction,
      ip,
      userAgent
    });
  },
  
  bulkOperation: (operationType, affectedUserIds, performedBy, ip) => {
    logToFile(LOG_LEVELS.SECURITY, 'Bulk Operation Performed', {
      event: 'BULK_OPERATION',
      operationType,
      affectedUserIds,
      affectedCount: affectedUserIds.length,
      performedBy,
      ip
    });
  }
};

// User activity logger
const userActivityLogger = {
  userViewed: (viewedUserId, viewedBy, ip) => {
    logToFile(LOG_LEVELS.INFO, 'User Profile Viewed', {
      event: 'USER_VIEWED',
      viewedUserId,
      viewedBy,
      ip
    });
  },
  
  userUpdated: (userId, updatedFields, updatedBy, ip) => {
    logToFile(LOG_LEVELS.INFO, 'User Profile Updated', {
      event: 'USER_UPDATED',
      userId,
      updatedFields,
      updatedBy,
      ip
    });
  },
  
  userListAccessed: (filters, accessedBy, ip) => {
    logToFile(LOG_LEVELS.INFO, 'User List Accessed', {
      event: 'USER_LIST_ACCESSED',
      filters,
      accessedBy,
      ip
    });
  },
  
  userStatsAccessed: (accessedBy, ip) => {
    logToFile(LOG_LEVELS.INFO, 'User Statistics Accessed', {
      event: 'USER_STATS_ACCESSED',
      accessedBy,
      ip
    });
  }
};

// Error logger
const errorLogger = (error, req, additionalInfo = {}) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    method: req?.method,
    url: req?.originalUrl,
    ip: req?.ip,
    userId: req?.user?.id,
    userRole: req?.user?.role,
    ...additionalInfo
  };
  
  logToFile(LOG_LEVELS.ERROR, 'Application Error', errorData);
};

// Performance logger
const performanceLogger = {
  logPerformance: (operation, duration, userId, ip) => {
    logToFile(LOG_LEVELS.INFO, 'Performance Metric', {
      event: 'PERFORMANCE_LOG',
      operation,
      duration,
      userId,
      ip
    });
  },
  
  slowQuery: (query, duration, userId, ip) => {
    logToFile(LOG_LEVELS.WARN, 'Slow Database Query', {
      event: 'SLOW_QUERY',
      query: query.substring(0, 200), // Truncate long queries
      duration,
      userId,
      ip
    });
  },
  
  highMemoryUsage: (memoryUsage, userId, ip) => {
    logToFile(LOG_LEVELS.WARN, 'High Memory Usage', {
      event: 'HIGH_MEMORY_USAGE',
      memoryUsage,
      userId,
      ip
    });
  }
};

// Log rotation utility
const rotateLogsDaily = async () => {
  try {
    const logDir = path.join(__dirname, '../logs');
    const files = await fs.readdir(logDir);
    const today = new Date().toISOString().split('T')[0];
    
    for (const file of files) {
      if (file.endsWith('.log')) {
        const filePath = path.join(logDir, file);
        const stats = await fs.stat(filePath);
        const fileDate = stats.mtime.toISOString().split('T')[0];
        
        if (fileDate !== today) {
          const archiveName = `${file.replace('.log', '')}-${fileDate}.log`;
          const archivePath = path.join(logDir, 'archive', archiveName);
          
          // Create archive directory if it doesn't exist
          await fs.mkdir(path.join(logDir, 'archive'), { recursive: true });
          
          // Move old log to archive
          await fs.rename(filePath, archivePath);
        }
      }
    }
  } catch (error) {
    console.error('Failed to rotate logs:', error);
  }
};

// Clean old logs (keep logs for 30 days)
const cleanOldLogs = async () => {
  try {
    const logDir = path.join(__dirname, '../logs/archive');
    const files = await fs.readdir(logDir);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    for (const file of files) {
      const filePath = path.join(logDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.mtime < thirtyDaysAgo) {
        await fs.unlink(filePath);
        console.log(`Deleted old log file: ${file}`);
      }
    }
  } catch (error) {
    console.error('Failed to clean old logs:', error);
  }
};

// Initialize logging system
const initializeLogging = () => {
  // Rotate logs daily at midnight
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  
  setTimeout(() => {
    rotateLogsDaily();
    cleanOldLogs();
    
    // Set up daily rotation
    setInterval(() => {
      rotateLogsDaily();
      cleanOldLogs();
    }, 24 * 60 * 60 * 1000); // 24 hours
  }, msUntilMidnight);
};

module.exports = {
  requestLogger,
  securityLogger,
  userActivityLogger,
  errorLogger,
  performanceLogger,
  initializeLogging,
  LOG_LEVELS,
  logToFile
};