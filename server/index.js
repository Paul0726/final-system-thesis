const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const { sendOTP, verifyOTP, sendTechnicalSupportReport, sendPasswordResetOTP, verifyPasswordResetOTP, clearPasswordResetOTP } = require('./auth');
require('dotenv').config();

// Encryption key for sensitive data (in production, use environment variable)
// Generate a consistent key if not provided (for development)
let ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  // Use a fixed key for development (in production, MUST use environment variable)
  // This ensures existing encrypted data can be decrypted
  ENCRYPTION_KEY = 'a'.repeat(64); // 32 bytes in hex = 64 characters
  console.warn('⚠️ WARNING: Using default encryption key. Set ENCRYPTION_KEY environment variable in production!');
}
const ALGORITHM = 'aes-256-cbc';

// ============================================
// INPUT VALIDATION & SANITIZATION
// ============================================

// Sanitize user input to prevent XSS and injection attacks
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters and patterns
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .replace(/['"]/g, '') // Remove quotes that could break SQL
    .substring(0, 10000); // Limit length to prevent DoS
}

// Validate email format
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 255;
}

// Validate and sanitize SQL input (already using parameterized queries, but extra safety)
function sanitizeSQLInput(input) {
  if (!input) return null;
  if (typeof input !== 'string') return input;
  
  // Remove SQL injection patterns
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
    /(--|#|\/\*|\*\/|;)/g,
    /(\bor\b|\band\b)\s+\d+\s*=\s*\d+/gi
  ];
  
  let sanitized = input.trim();
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized.substring(0, 10000); // Limit length
}

// Secure error messages - never expose sensitive data
function secureErrorResponse(error, defaultMessage = 'An error occurred') {
  // Never expose database errors, stack traces, or sensitive info
  if (process.env.NODE_ENV === 'production') {
    return { success: false, message: defaultMessage };
  } else {
    // In development, show more details
    return { 
      success: false, 
      message: defaultMessage,
      error: error.message 
    };
  }
}

// Encryption functions
function encrypt(text) {
  if (!text) return null;
  try {
    // Check if already encrypted (contains colon separator)
    if (text.includes(':') && text.split(':').length === 2) {
      // Might already be encrypted, try to decrypt first to verify
      try {
        const testDecrypt = decrypt(text);
        if (testDecrypt !== text) {
          // Successfully decrypted, so it was encrypted - return as is
          return text;
        }
      } catch (e) {
        // Not encrypted, proceed with encryption
      }
    }
    
    // Ensure key is 32 bytes (64 hex characters)
    let keyHex = ENCRYPTION_KEY;
    if (keyHex.length < 64) {
      keyHex = keyHex.padEnd(64, '0');
    } else if (keyHex.length > 64) {
      keyHex = keyHex.slice(0, 64);
    }
    
    const key = Buffer.from(keyHex, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Return original if encryption fails
  }
}

function decrypt(encryptedText) {
  if (!encryptedText) return null;
  
  // If it's not a string, return as is
  if (typeof encryptedText !== 'string') {
    return encryptedText;
  }
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      // Not encrypted (no colon separator), return as is
      return encryptedText;
    }
    
    // Check if it looks like encrypted data (hex strings)
    const ivHex = parts[0];
    const encryptedHex = parts[1];
    
    // Validate hex format
    if (!/^[0-9a-fA-F]+$/.test(ivHex) || !/^[0-9a-fA-F]+$/.test(encryptedHex)) {
      // Doesn't look like encrypted data, return as is
      return encryptedText;
    }
    
    // Ensure key is 32 bytes (64 hex characters)
    let keyHex = ENCRYPTION_KEY;
    if (keyHex.length < 64) {
      keyHex = keyHex.padEnd(64, '0');
    } else if (keyHex.length > 64) {
      keyHex = keyHex.slice(0, 64);
    }
    
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    
    // Validate IV length (should be 16 bytes = 32 hex characters)
    if (iv.length !== 16) {
      console.warn(`[DECRYPT] Invalid IV length: ${iv.length} bytes (expected 16)`);
      return encryptedText;
    }
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Validate decrypted result (should not be empty and should be reasonable text)
    if (!decrypted || decrypted.trim().length === 0) {
      console.warn(`[DECRYPT] Decryption resulted in empty string for: ${encryptedText.substring(0, 50)}...`);
      return encryptedText;
    }
    
    return decrypted;
  } catch (error) {
    // Log the error for debugging
    console.error(`[DECRYPT] Failed to decrypt: ${error.message}`);
    console.error(`[DECRYPT] Encrypted text (first 100 chars): ${encryptedText.substring(0, 100)}...`);
    console.error(`[DECRYPT] Encryption key length: ${ENCRYPTION_KEY ? ENCRYPTION_KEY.length : 0}`);
    
    // If decryption fails, return the encrypted text (so admin can see something)
    // But also log it so we know there's an issue
    return encryptedText;
  }
}

// Helper function to parse and validate date for PostgreSQL DATE type
function parseDate(dateValue) {
  if (!dateValue) return null;
  
  // If it's already a valid date string in YYYY-MM-DD format, return it
  if (typeof dateValue === 'string') {
    // Check if it's an encrypted string (contains colon)
    if (dateValue.includes(':') && dateValue.split(':').length === 2) {
      // Try to decrypt it first
      try {
        const decrypted = decrypt(dateValue);
        // If decryption worked and it's a valid date, use it
        if (decrypted && decrypted !== dateValue) {
          dateValue = decrypted;
        } else {
          // If it's still encrypted or invalid, return null
          return null;
        }
      } catch (e) {
        return null;
      }
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(dateValue)) {
      // Validate it's a real date
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return dateValue; // Return in YYYY-MM-DD format
      }
    }
  }
  
  // If it's a Date object, convert to YYYY-MM-DD
  if (dateValue instanceof Date) {
    if (!isNaN(dateValue.getTime())) {
      return dateValue.toISOString().split('T')[0];
    }
  }
  
  return null;
}

// Helper function to safely parse integer
function parseInteger(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

// Helper function to safely stringify JSON
function safeStringify(value) {
  if (!value) return null;
  try {
    if (typeof value === 'string') {
      // Try to parse it first to validate it's valid JSON
      JSON.parse(value);
      return value;
    }
    // Ensure arrays/objects are properly formatted
    if (Array.isArray(value)) {
      return JSON.stringify(value.filter(item => item !== null && item !== undefined));
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return JSON.stringify(value);
  } catch (e) {
    console.error('Error stringifying JSON:', e);
    // Return empty array/object instead of null to prevent database errors
    if (Array.isArray(value)) return '[]';
    if (typeof value === 'object') return '{}';
    return null;
  }
}

// Helper function to safely parse JSON
function safeParseJSON(value, defaultValue = null) {
  if (!value) return defaultValue;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return defaultValue;
  }
}

// Helper function to safely truncate string values to prevent database errors
function safeTruncate(value, maxLength) {
  if (!value || typeof value !== 'string') return value;
  if (value.length <= maxLength) return value;
  // Truncate and log warning
  console.warn(`⚠️ Value truncated from ${value.length} to ${maxLength} characters: ${value.substring(0, 50)}...`);
  return value.substring(0, maxLength);
}

// Helper function to validate and sanitize survey data before insertion
function sanitizeSurveyData(surveyData) {
  const sanitized = { ...surveyData };
  
  // Define max lengths for each field (matching database schema)
  // Using camelCase keys to match the input data format
  const maxLengths = {
    name: 255,
    mobileNumber: 200,
    emailAddress: 255,
    civilStatus: 100,
    sex: 10,
    courseGraduated: 255,
    schoolYearGraduated: 10, // Fixed: Changed from 20 to 10 to match database VARCHAR(10)
    civilService: 255,
    letLicense: 255,
    otherPRCLicense: 255,
    isEmployed: 10,
    employmentNature: 100,
    employmentClassification: 100,
    jobTitle: 255,
    placeOfWork: 255,
    isITField: 10,
    monthlyIncome: 100,
    isAlumni: 10,
    interestedAlumni: 10
  };
  
  // Truncate fields that exceed max length
  Object.keys(maxLengths).forEach(key => {
    if (sanitized[key] && typeof sanitized[key] === 'string') {
      sanitized[key] = safeTruncate(sanitized[key], maxLengths[key]);
    }
  });
  
  return sanitized;
}

// Helper function to format date_of_birth from database (handles both DATE type and old encrypted data)
function formatDateOfBirth(dateValue) {
  if (!dateValue) return null;
  
  // If it's a Date object, format it as YYYY-MM-DD
  if (dateValue instanceof Date) {
    return dateValue.toISOString().split('T')[0];
  }
  
  if (typeof dateValue === 'string') {
    // If it looks like an encrypted string (old data), try to decrypt
    if (dateValue.includes(':') && dateValue.split(':').length === 2) {
      const decrypted = decrypt(dateValue);
      if (decrypted && decrypted !== dateValue) {
        dateValue = decrypted;
      } else {
        // If decryption failed, it might be invalid encrypted data
        return null;
      }
    }
    
    // Ensure it's in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    
    // Try to parse and format if it's a valid date string
    const dateObj = new Date(dateValue);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString().split('T')[0];
    }
  }
  
  return null;
}

// Admin authentication middleware - ENHANCED SECURITY
const authenticateAdmin = (req, res, next) => {
  try {
    // Log authentication attempts for security monitoring
    const clientIP = req.ip || req.connection.remoteAddress;
    
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    // Also check for token in query or body (for backward compatibility)
    const tokenFromQuery = req.query.token || req.body.token;
    const adminToken = token || tokenFromQuery || req.headers['x-admin-token'];
    
    // SECURITY: Never log the actual token, only log attempts
    if (!adminToken) {
      console.warn(`🔒 SECURITY: Unauthorized admin access attempt from IP ${clientIP}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Admin authentication required' 
      });
    }
    
    // Check if token matches admin token
    if (adminToken === 'admin-token') {
      // Verify admin email from token or session
      // For now, we'll trust the token since it's set after OTP verification
      console.log(`✅ SECURITY: Admin authenticated from IP ${clientIP}`);
      next();
    } else {
      console.warn(`🔒 SECURITY: Invalid admin token attempt from IP ${clientIP}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized: Admin authentication required' 
      });
    }
  } catch (error) {
    console.error('🔒 SECURITY ERROR in authenticateAdmin:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Try to load database, fallback to in-memory if not available
let pool = null;
let useDatabase = false;
try {
  pool = require('./database');
  if (pool) {
    useDatabase = true;
    console.log('✅ Using PostgreSQL database');
  } else {
    console.log('⚠️ Database not available, using in-memory storage');
    console.log('💡 Add PostgreSQL database in Railway for permanent storage');
  }
} catch (error) {
  console.log('⚠️ Database not available, using in-memory storage');
  console.log('💡 Add PostgreSQL database in Railway for permanent storage');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Fallback: In-memory database
let surveys = [];

// ============================================
// SECURITY MIDDLEWARE - PROTECT SENSITIVE DATA
// ============================================

// 1. Helmet - Security headers (XSS, clickjacking, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. Rate Limiting - Prevent brute force attacks
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth endpoints
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute for API endpoints
  message: 'Too many API requests, please slow down.',
});

// Apply rate limiters
app.use('/api/', generalLimiter);
app.use('/api/admin/send-otp', authLimiter);
app.use('/api/admin/verify-otp', authLimiter);
app.use('/api/user/send-otp', authLimiter);
app.use('/api/user/verify-otp', authLimiter);
app.use('/api/surveys', apiLimiter);
app.use('/api/feedbacks', apiLimiter);

// 3. CORS - Restrict cross-origin requests
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, restrict to your domain
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        process.env.ALLOWED_ORIGIN,
        'https://dwcsjgraduatetracer.it.com',
        'https://www.dwcsjgraduatetracer.it.com'
      ].filter(Boolean);
      
      if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
        return callback(new Error('Not allowed by CORS'));
      }
    }
    
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token'],
  exposedHeaders: [],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// 4. HPP - Prevent HTTP Parameter Pollution
app.use(hpp());

// 5. Body Parser with size limits - Prevent DoS attacks
app.use(express.json({ 
  limit: '10mb', // Limit request body size
  verify: (req, res, buf) => {
    // Additional security: check for suspicious patterns
    const bodyString = buf.toString();
    if (bodyString.length > 10 * 1024 * 1024) { // 10MB
      throw new Error('Request body too large');
    }
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  parameterLimit: 100 // Limit number of parameters
}));

// 6. Request timeout - Prevent hanging requests
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds timeout
  res.setTimeout(30000);
  next();
});

// 7. Security logging middleware
const securityLogger = (req, res, next) => {
  // Log suspicious activities
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union.*select/i,
    /drop.*table/i,
    /delete.*from/i,
    /insert.*into/i,
    /update.*set/i,
    /exec\(/i,
    /eval\(/i
  ];
  
  const requestString = JSON.stringify(req.body) + JSON.stringify(req.query) + req.url;
  
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(requestString)) {
      console.warn(`🚨 SECURITY ALERT: Suspicious pattern detected from IP ${req.ip}`);
      console.warn(`   Pattern: ${pattern}`);
      console.warn(`   URL: ${req.url}`);
      console.warn(`   Method: ${req.method}`);
      // In production, you might want to block or alert admin
    }
  });
  
  next();
};

app.use(securityLogger);

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Admin Authentication Routes
app.post('/api/admin/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[ADMIN OTP] Request received for email: ${email}`);
    
    // Only allow specific admin email (from environment variable or default)
    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'dwcsjtracersystem@gmail.com';
    console.log(`[ADMIN OTP] Admin email configured: ${adminEmail}`);
    
    // Case-insensitive comparison with trimmed whitespace
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedAdminEmail = (adminEmail || '').trim().toLowerCase();
    
    if (normalizedEmail !== normalizedAdminEmail) {
      console.log(`[ADMIN OTP] Unauthorized email attempt: ${email} (expected: ${adminEmail})`);
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized email address' 
      });
    }

    console.log(`[ADMIN OTP] Sending OTP to admin email...`);
    const result = await sendOTP(email);
    if (result.success) {
      console.log(`[ADMIN OTP] OTP sent successfully`);
      res.json({ success: true, message: 'OTP sent to your email' });
    } else {
      console.error(`[ADMIN OTP] Failed to send OTP: ${result.message}`);
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('[ADMIN OTP] Error in send-otp endpoint:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

app.post('/api/admin/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Only allow specific admin email (from environment variable or default)
    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || 'dwcsjtracersystem@gmail.com';
    
    // Case-insensitive comparison with trimmed whitespace
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedAdminEmail = (adminEmail || '').trim().toLowerCase();
    
    if (normalizedEmail !== normalizedAdminEmail) {
      console.log(`[ADMIN OTP VERIFY] Unauthorized email attempt: ${email} (expected: ${adminEmail})`);
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized email address' 
      });
    }

    const result = verifyOTP(email, otp);
    if (result.success) {
      res.json({ success: true, message: 'Login successful', token: 'admin-token' });
    } else {
      res.status(401).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
});

// User Authentication Routes (for respondents)
// User Registration
app.post('/api/user/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Check if user already exists
    if (useDatabase && pool) {
      const existingUser = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already registered. Please login instead.' });
      }

      // Hash password (simple hash for now, in production use bcrypt)
      const crypto = require('crypto');
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      // Check if survey exists for this email
      const surveyResult = await pool.query('SELECT id FROM surveys WHERE LOWER(email_address) = LOWER($1) ORDER BY created_at DESC LIMIT 1', [email]);
      const surveyId = surveyResult.rows.length > 0 ? surveyResult.rows[0].id : null;

      // Create user account
      const result = await pool.query(
        'INSERT INTO users (email, password, survey_id) VALUES ($1, $2, $3) RETURNING id, email',
        [email, hashedPassword, surveyId]
      );

      res.json({ success: true, message: 'Account created successfully. Please login.', userId: result.rows[0].id });
    } else {
      // Fallback to in-memory (not recommended for production)
      res.status(503).json({ success: false, message: 'User registration requires database. Please contact administrator.' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    if (error.code === '23505') { // Unique constraint violation
      return res.status(400).json({ success: false, message: 'Email already registered. Please login instead.' });
    }
    res.status(500).json({ success: false, message: 'Error creating account' });
  }
});

// User Login (send OTP)
app.post('/api/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    if (useDatabase && pool) {
      // Verify password
      const crypto = require('crypto');
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      
      const userResult = await pool.query('SELECT id, email FROM users WHERE LOWER(email) = LOWER($1) AND password = $2', [email, hashedPassword]);
      
      if (userResult.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Send OTP
      console.log(`[USER OTP] Sending OTP to user: ${email}`);
      const result = await sendOTP(email);
      if (result.success) {
        console.log(`[USER OTP] OTP sent successfully to ${email}`);
        res.json({ success: true, message: 'OTP sent to your email' });
      } else {
        console.error(`[USER OTP] Failed to send OTP: ${result.message}`);
        res.status(500).json({ success: false, message: result.message });
      }
    } else {
      res.status(503).json({ success: false, message: 'User login requires database. Please contact administrator.' });
    }
  } catch (error) {
    console.error('Error in user login:', error);
    res.status(500).json({ success: false, message: 'Error processing login' });
  }
});

// User OTP Verification
app.post('/api/user/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    // Verify OTP
    const result = verifyOTP(email, otp);
    if (result.success) {
      // Get user info
      if (useDatabase && pool) {
        const userResult = await pool.query('SELECT id, email, survey_id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        if (userResult.rows.length > 0) {
          const user = userResult.rows[0];
          // Generate simple token (in production use JWT)
          const token = Buffer.from(`${user.id}:${email}:${Date.now()}`).toString('base64');
          res.json({ 
            success: true, 
            message: 'Login successful', 
            token: token,
            email: user.email,
            userId: user.id,
            surveyId: user.survey_id
          });
        } else {
          res.status(404).json({ success: false, message: 'User not found' });
        }
      } else {
        res.status(503).json({ success: false, message: 'Authentication requires database' });
      }
    } else {
      res.status(401).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error verifying user OTP:', error);
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
});

// Forgot Password - Send OTP
app.post('/api/user/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    if (useDatabase && pool) {
      // Check if user exists
      const userResult = await pool.query('SELECT id, email FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      
      if (userResult.rows.length === 0) {
        // Don't reveal if email exists or not for security
        return res.json({ success: true, message: 'If the email exists, a password reset OTP has been sent.' });
      }

      // Send password reset OTP
      const result = await sendPasswordResetOTP(email);
      if (result.success) {
        res.json({ success: true, message: 'Password reset OTP sent to your email' });
      } else {
        res.status(500).json({ success: false, message: result.message });
      }
    } else {
      res.status(503).json({ success: false, message: 'Password reset requires database. Please contact administrator.' });
    }
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ success: false, message: 'Error processing password reset request' });
  }
});

// Verify Password Reset OTP (separate from login OTP)
app.post('/api/user/verify-password-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    // Verify password reset OTP
    const result = verifyPasswordResetOTP(email, otp);
    if (result.success) {
      res.json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(401).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error verifying password reset OTP:', error);
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
});

// Verify OTP and Reset Password
app.post('/api/user/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    // Verify OTP
    const otpResult = verifyPasswordResetOTP(email, otp);
    if (!otpResult.success) {
      return res.status(401).json({ success: false, message: otpResult.message });
    }

    if (useDatabase && pool) {
      // Check if user exists
      const userResult = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Hash new password
      const crypto = require('crypto');
      const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

      // Update password
      await pool.query('UPDATE users SET password = $1 WHERE LOWER(email) = LOWER($2)', [hashedPassword, email]);

      // Clear the OTP after successful password reset
      clearPasswordResetOTP(email);

      res.json({ success: true, message: 'Password reset successfully. Please login with your new password.' });
    } else {
      res.status(503).json({ success: false, message: 'Password reset requires database. Please contact administrator.' });
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Error resetting password' });
  }
});

// Initialize users table if it doesn't exist (fallback)
const ensureUsersTable = async () => {
  if (useDatabase && pool) {
    try {
      console.log('🔄 Checking and creating users table...');
      
      // Check if users table exists
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
      
      if (!tableCheck.rows[0].exists) {
        console.log('📝 Users table does not exist. Creating...');
        
        // First ensure surveys table exists (minimal version if it doesn't)
        await pool.query(`
          CREATE TABLE IF NOT EXISTS surveys (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email_address VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        // Then create users table
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            survey_id INTEGER REFERENCES surveys(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        // Create index on email for faster lookups
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(LOWER(email))`);
        console.log('✅ Users table created successfully!');
      } else {
        console.log('✅ Users table already exists');
      }
    } catch (error) {
      console.error('❌ Error ensuring users table:', error.message);
      console.error('Full error:', error);
    }
  } else {
    console.log('⚠️ Database not available for users table creation');
  }
};

// Ensure users table exists on startup (with multiple retries)
const initializeUsersTable = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await ensureUsersTable();
      break;
    } catch (error) {
      if (i < retries - 1) {
        console.log(`⏳ Retry ${i + 1}/${retries} in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error('❌ Failed to create users table after all retries');
      }
    }
  }
};

// Ensure users table exists on startup
setTimeout(() => {
  initializeUsersTable();
}, 3000);

// Manual endpoint to create users table (for debugging/manual trigger)
app.post('/api/admin/create-users-table', async (req, res) => {
  try {
    await ensureUsersTable();
    res.json({ success: true, message: 'Users table check/creation completed. Check server logs for details.' });
  } catch (error) {
    console.error('Error in manual users table creation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get feedbacks and ratings for landing page
app.get('/api/feedbacks', async (req, res) => {
  try {
    if (useDatabase && pool) {
      // Get unique feedbacks per person (by email_address) - only the latest one per person
      const result = await pool.query(`
        SELECT DISTINCT ON (LOWER(email_address)) 
          name, email_address, school_rating, system_rating, school_feedback, system_feedback, created_at
        FROM surveys
        WHERE (school_feedback IS NOT NULL AND school_feedback != '') 
           OR (system_feedback IS NOT NULL AND system_feedback != '')
        ORDER BY LOWER(email_address), created_at DESC
        LIMIT 50
      `);
      
      const feedbacks = result.rows.map(row => ({
        name: row.name,
        email: decrypt(row.email_address) || row.email_address, // Decrypt email for display
        schoolRating: row.school_rating,
        systemRating: row.system_rating,
        schoolFeedback: row.school_feedback,
        systemFeedback: row.system_feedback,
        systemEvaluation: safeParseJSON(row.system_evaluation) || {},
        createdAt: row.created_at
      }));
      
      // Calculate average ratings
      const ratingsResult = await pool.query(`
        SELECT 
          AVG(school_rating) as avg_school_rating,
          AVG(system_rating) as avg_system_rating,
          COUNT(*) as total_ratings
        FROM surveys
        WHERE school_rating IS NOT NULL OR system_rating IS NOT NULL
      `);
      
      const avgRatings = {
        school: ratingsResult.rows[0]?.avg_school_rating ? parseFloat(ratingsResult.rows[0].avg_school_rating).toFixed(1) : 0,
        system: ratingsResult.rows[0]?.avg_system_rating ? parseFloat(ratingsResult.rows[0].avg_system_rating).toFixed(1) : 0,
        total: parseInt(ratingsResult.rows[0]?.total_ratings || 0)
      };
      
      res.json({
        success: true,
        data: feedbacks,
        ratings: avgRatings
      });
    } else {
      // Fallback to in-memory
      const feedbacks = surveys
        .filter(s => (s.schoolFeedback && s.schoolFeedback.trim()) || (s.systemFeedback && s.systemFeedback.trim()))
        .slice(0, 50)
        .map(s => ({
          name: s.name,
          schoolRating: s.schoolRating,
          systemRating: s.systemRating,
          schoolFeedback: s.schoolFeedback,
          systemFeedback: s.systemFeedback,
          createdAt: s.createdAt
        }));
      
      const ratings = surveys.filter(s => s.schoolRating || s.systemRating);
      const avgRatings = {
        school: ratings.length > 0 ? (ratings.reduce((sum, s) => sum + (s.schoolRating || 0), 0) / ratings.length).toFixed(1) : 0,
        system: ratings.length > 0 ? (ratings.reduce((sum, s) => sum + (s.systemRating || 0), 0) / ratings.length).toFixed(1) : 0,
        total: ratings.length
      };
      
      res.json({
        success: true,
        data: feedbacks,
        ratings: avgRatings
      });
    }
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.json({
      success: true,
      data: [],
      ratings: { school: 0, system: 0, total: 0 }
    });
  }
});

// Get all surveys - PROTECTED: Admin only
app.get('/api/surveys', authenticateAdmin, async (req, res) => {
  try {
    if (useDatabase && pool) {
      // SECURITY: Use parameterized query (already safe, but explicit)
      const result = await pool.query('SELECT * FROM surveys ORDER BY created_at DESC');
      console.log(`📊 Found ${result.rows.length} surveys in database`);
      // SECURITY: Never log sensitive data - only count
      // Convert snake_case to camelCase for frontend and decrypt sensitive data
      const surveys = result.rows.map(row => {
        // Decrypt sensitive fields
        const permanentAddress = row.permanent_address ? decrypt(row.permanent_address) : null;
        const mobileNumber = row.mobile_number ? decrypt(row.mobile_number) : null;
        const emailAddress = row.email_address ? decrypt(row.email_address) : null;
        const currentLocation = row.current_location ? decrypt(row.current_location) : null;
        
        return {
          id: row.id,
          name: row.name,
          permanentAddress: permanentAddress || row.permanent_address || '',
          mobileNumber: mobileNumber || row.mobile_number || '',
          emailAddress: emailAddress || row.email_address || '',
          dateOfBirth: formatDateOfBirth(row.date_of_birth),
          age: row.age,
          civilStatus: row.civil_status,
          sex: row.sex,
          currentLocation: currentLocation || row.current_location || '',
          courseGraduated: row.course_graduated,
          schoolYearGraduated: row.school_year_graduated,
          maxAcademicAchievement: row.max_academic_achievement,
          trainings: typeof row.trainings === 'string' ? JSON.parse(row.trainings) : row.trainings,
          civilService: row.civil_service,
          letLicense: row.let_license,
          otherPRCLicense: row.other_prc_license,
          professionalOrganizations: row.professional_organizations,
          isEmployed: row.is_employed,
          employmentNature: row.employment_nature,
          employmentClassification: row.employment_classification,
          jobTitle: row.job_title,
          placeOfWork: row.place_of_work,
          isITField: row.is_it_field,
          monthlyIncome: row.monthly_income,
          additionalRevenueSources: row.additional_revenue_sources,
          ratings: typeof row.ratings === 'string' ? JSON.parse(row.ratings) : row.ratings,
          isAlumni: row.is_alumni,
          interestedAlumni: row.interested_alumni,
          schoolRating: row.school_rating,
          systemRating: row.system_rating,
          schoolFeedback: row.school_feedback,
          systemFeedback: row.system_feedback,
          systemEvaluation: safeParseJSON(row.system_evaluation) || {},
          createdAt: row.created_at
        };
      });
      res.json({
        success: true,
        message: 'Surveys retrieved successfully',
        data: surveys
      });
    } else {
      // Fallback to in-memory
      res.json({
        success: true,
        message: 'Surveys retrieved successfully',
        data: surveys
      });
    }
  } catch (error) {
    // SECURITY: Never expose error details in production
    console.error('Error fetching surveys:', error.message);
    // Fallback to in-memory on error
    res.json({
      success: true,
      message: 'Surveys retrieved successfully',
      data: surveys
    });
  }
});

// Get single survey - PROTECTED: Admin only
app.get('/api/surveys/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (useDatabase && pool) {
      const result = await pool.query('SELECT * FROM surveys WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Survey not found' });
      }
      const row = result.rows[0];
      // Decrypt sensitive data
      const survey = {
        ...row,
        permanent_address: decrypt(row.permanent_address) || row.permanent_address,
        mobile_number: decrypt(row.mobile_number) || row.mobile_number,
        email_address: decrypt(row.email_address) || row.email_address,
        date_of_birth: formatDateOfBirth(row.date_of_birth),
        current_location: decrypt(row.current_location) || row.current_location
      };
      res.json({ success: true, data: survey });
    } else {
      // Fallback to in-memory
      const survey = surveys.find(s => s.id === id);
      if (!survey) {
        return res.status(404).json({ success: false, message: 'Survey not found' });
      }
      res.json({ success: true, data: survey });
    }
  } catch (error) {
    console.error('Error fetching survey:', error);
    res.status(500).json({ success: false, message: 'Error fetching survey' });
  }
});

// Create new survey
app.post('/api/survey', async (req, res) => {
  try {
    // Sanitize and validate survey data to prevent database errors
    const surveyData = sanitizeSurveyData(req.body);
    
    // Basic validation - only check critical required fields
    const validationErrors = [];
    
    // Required fields validation
    if (!surveyData.name || !surveyData.name.trim()) {
      validationErrors.push('Name is required');
    }
    
    if (!surveyData.emailAddress) {
      validationErrors.push('Email address is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(surveyData.emailAddress)) {
      validationErrors.push('Invalid email address format');
    }
    
    if (!surveyData.schoolYearGraduated) {
      validationErrors.push('School year graduated is required');
    } else {
      // Accept single year format (YYYY) - this is the original design
      const yearValue = String(surveyData.schoolYearGraduated).trim();
      if (!/^\d{4}$/.test(yearValue)) {
        validationErrors.push('School year must be a valid year (e.g., 2024)');
      }
    }
    
    if (!surveyData.dateOfBirth) {
      validationErrors.push('Date of birth is required');
    } else {
      const parsedDate = parseDate(surveyData.dateOfBirth);
      if (!parsedDate) {
        validationErrors.push('Invalid date of birth format');
      }
    }
    
    if (!surveyData.courseGraduated) {
      validationErrors.push('Course graduated is required');
    }
    
    if (!surveyData.civilStatus) {
      validationErrors.push('Civil status is required');
    }
    
    if (!surveyData.sex) {
      validationErrors.push('Sex is required');
    }
    
    // Account creation validation - only if account creation is enabled
    if (surveyData.createAccount && surveyData.accountPassword) {
      if (surveyData.accountPassword.length < 6) {
        validationErrors.push('Password must be at least 6 characters long');
      }
    }
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: validationErrors.length === 1 ? validationErrors[0] : 'Please fix the following errors: ' + validationErrors.join(', '),
        errors: validationErrors
      });
    }

    if (useDatabase && pool) {
      // Check for duplicate email/name
      // Since emails are encrypted, we need to check all surveys and decrypt
      try {
        const allSurveys = await pool.query('SELECT id, email_address, name FROM surveys');
        const encryptedEmail = encrypt(surveyData.emailAddress);
        
        const duplicate = allSurveys.rows.find(row => {
          const decryptedEmail = decrypt(row.email_address) || row.email_address;
          const rowName = row.name || '';
          return (
            decryptedEmail.toLowerCase() === surveyData.emailAddress.toLowerCase() ||
            rowName.toLowerCase() === surveyData.name.toLowerCase()
          );
        });
        
        if (duplicate) {
          const existingEmail = decrypt(duplicate.email_address) || duplicate.email_address;
          return res.status(400).json({ 
            success: false, 
            message: 'A survey with this email address or name already exists. You can edit your existing survey by accessing your personal dashboard.',
            existingEmail: existingEmail
          });
        }
      } catch (duplicateError) {
        console.error('Error checking duplicates:', duplicateError);
        // Continue with submission if duplicate check fails (better to allow than block)
      }

      // Use PostgreSQL database - Encrypt sensitive data before storing
      // Parse and validate date_of_birth (don't encrypt dates - PostgreSQL needs DATE type)
      const parsedDateOfBirth = parseDate(surveyData.dateOfBirth);
      
      // Ensure all values are properly formatted before insertion
      // Convert empty strings to null for optional fields
      const cleanValue = (val) => {
        if (val === '' || val === undefined) return null;
        if (typeof val === 'string') return val.trim() || null;
        return val;
      };
      
      const result = await pool.query(`
        INSERT INTO surveys (
          name, permanent_address, mobile_number, email_address, date_of_birth, age,
          civil_status, sex, current_location, course_graduated, school_year_graduated,
          max_academic_achievement, trainings, civil_service, let_license, other_prc_license,
          professional_organizations, is_employed, employment_nature, employment_classification,
          job_title, place_of_work, is_it_field, monthly_income, additional_revenue_sources, ratings,
          is_alumni, interested_alumni, school_rating, system_rating, school_feedback, system_feedback, system_evaluation
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)
        RETURNING *
      `, [
        cleanValue(surveyData.name),
        cleanValue(surveyData.permanentAddress) ? encrypt(cleanValue(surveyData.permanentAddress)) : null,
        cleanValue(surveyData.mobileNumber) ? encrypt(cleanValue(surveyData.mobileNumber)) : null,
        encrypt(surveyData.emailAddress),
        parsedDateOfBirth, // Use parsed date instead of encrypted
        parseInteger(surveyData.age),
        cleanValue(surveyData.civilStatus),
        cleanValue(surveyData.sex),
        cleanValue(surveyData.currentLocation) ? encrypt(cleanValue(surveyData.currentLocation)) : null,
        cleanValue(surveyData.courseGraduated),
        cleanValue(surveyData.schoolYearGraduated),
        cleanValue(surveyData.maxAcademicAchievement),
        safeStringify(surveyData.trainings || []),
        cleanValue(surveyData.civilService),
        cleanValue(surveyData.letLicense),
        cleanValue(surveyData.otherPRCLicense),
        cleanValue(surveyData.professionalOrganizations),
        cleanValue(surveyData.isEmployed),
        cleanValue(surveyData.employmentNature),
        cleanValue(surveyData.employmentClassification),
        cleanValue(surveyData.jobTitle),
        cleanValue(surveyData.placeOfWork),
        cleanValue(surveyData.isITField),
        cleanValue(surveyData.monthlyIncome),
        cleanValue(surveyData.additionalRevenueSources),
        safeStringify(surveyData.ratings || {}),
        cleanValue(surveyData.isAlumni),
        cleanValue(surveyData.interestedAlumni),
        parseInteger(surveyData.schoolRating),
        parseInteger(surveyData.systemRating),
        cleanValue(surveyData.schoolFeedback),
        cleanValue(surveyData.systemFeedback),
        safeStringify(surveyData.systemEvaluation || {})
      ]);

      // Convert snake_case to camelCase for response and decrypt sensitive data
      const savedSurvey = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        permanentAddress: decrypt(result.rows[0].permanent_address) || result.rows[0].permanent_address,
        mobileNumber: decrypt(result.rows[0].mobile_number) || result.rows[0].mobile_number,
        emailAddress: decrypt(result.rows[0].email_address) || result.rows[0].email_address,
        dateOfBirth: formatDateOfBirth(result.rows[0].date_of_birth),
        age: result.rows[0].age,
        civilStatus: result.rows[0].civil_status,
        sex: result.rows[0].sex,
        currentLocation: decrypt(result.rows[0].current_location) || result.rows[0].current_location,
        courseGraduated: result.rows[0].course_graduated,
        schoolYearGraduated: result.rows[0].school_year_graduated,
        maxAcademicAchievement: result.rows[0].max_academic_achievement,
        trainings: typeof result.rows[0].trainings === 'string' ? JSON.parse(result.rows[0].trainings) : result.rows[0].trainings,
        civilService: result.rows[0].civil_service,
        letLicense: result.rows[0].let_license,
        otherPRCLicense: result.rows[0].other_prc_license,
        professionalOrganizations: result.rows[0].professional_organizations,
        isEmployed: result.rows[0].is_employed,
        employmentNature: result.rows[0].employment_nature,
        employmentClassification: result.rows[0].employment_classification,
        jobTitle: result.rows[0].job_title,
        placeOfWork: result.rows[0].place_of_work,
        monthlyIncome: result.rows[0].monthly_income,
        additionalRevenueSources: result.rows[0].additional_revenue_sources,
        ratings: typeof result.rows[0].ratings === 'string' ? JSON.parse(result.rows[0].ratings) : result.rows[0].ratings,
        isAlumni: result.rows[0].is_alumni,
        interestedAlumni: result.rows[0].interested_alumni,
        schoolRating: result.rows[0].school_rating,
        systemRating: result.rows[0].system_rating,
        schoolFeedback: result.rows[0].school_feedback,
        systemFeedback: result.rows[0].system_feedback,
        systemEvaluation: safeParseJSON(result.rows[0].system_evaluation) || {},
        createdAt: result.rows[0].created_at
      };

      // Create user account if requested
      let accountCreated = false;
      if (surveyData.createAccount && surveyData.accountPassword && surveyData.emailAddress) {
        try {
          // Check if user already exists
          const existingUser = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [surveyData.emailAddress]);
          
          if (existingUser.rows.length === 0) {
            // Hash password
            const crypto = require('crypto');
            const hashedPassword = crypto.createHash('sha256').update(surveyData.accountPassword).digest('hex');
            
            // Create user account linked to the survey
            await pool.query(
              'INSERT INTO users (email, password, survey_id) VALUES ($1, $2, $3)',
              [surveyData.emailAddress, hashedPassword, result.rows[0].id]
            );
            accountCreated = true;
            console.log(`✅ User account created for email: ${surveyData.emailAddress}`);
          } else {
            // User exists, just update survey_id
            await pool.query('UPDATE users SET survey_id = $1 WHERE LOWER(email) = LOWER($2)', [result.rows[0].id, surveyData.emailAddress]);
            console.log(`✅ Linked existing user account to survey for email: ${surveyData.emailAddress}`);
          }
        } catch (error) {
          console.error('Error creating user account:', error);
          // Don't fail the survey submission if account creation fails
        }
      }

      console.log('✅ Survey saved to database:', savedSurvey.id);
      res.json({
        success: true,
        message: 'Survey submitted successfully',
        data: savedSurvey,
        accountCreated: accountCreated
      });
    } else {
      // Fallback to in-memory database
      // Check for duplicate email/name
      const duplicate = surveys.find(s => 
        s.emailAddress?.toLowerCase() === surveyData.emailAddress?.toLowerCase() || 
        s.name?.toLowerCase() === surveyData.name?.toLowerCase()
      );
      
      if (duplicate) {
        return res.status(400).json({ 
          success: false, 
          message: 'A survey with this email address or name already exists. You can edit your existing survey by accessing your personal dashboard.',
          existingEmail: duplicate.emailAddress
        });
      }
      
      const newSurvey = {
        id: surveys.length > 0 ? Math.max(...surveys.map(s => s.id)) + 1 : 1,
        ...surveyData,
        createdAt: new Date().toISOString()
      };
      surveys.push(newSurvey);
      
      res.json({
        success: true,
        message: 'Survey submitted successfully (using in-memory storage)',
        data: newSurvey
      });
    }
  } catch (error) {
    console.error('❌ Error creating survey:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      constraint: error.constraint,
      detail: error.detail
    });
    
    // Provide user-friendly error messages
    let errorMessage = 'Error creating survey. Please try again.';
    let statusCode = 500;
    
    if (error.code === '23505') { // Unique constraint violation
      errorMessage = 'A survey with this email address or name already exists. Please use a different email or name.';
      statusCode = 400;
    } else if (error.code === '23502') { // Not null violation
      errorMessage = 'Required fields are missing. Please fill in all required fields.';
      statusCode = 400;
    } else if (error.code === '22007' || error.code === '22008') { // Invalid date format
      errorMessage = 'Invalid date format. Please check your date of birth.';
      statusCode = 400;
    } else if (error.code === '23514') { // Check constraint violation
      errorMessage = 'Invalid data format. Please check your input.';
      statusCode = 400;
    } else if (error.message && error.message.includes('value too long')) {
      errorMessage = 'One or more fields are too long. Please shorten your input.';
      statusCode = 400;
    } else if (error.message && error.message.includes('invalid input syntax')) {
      errorMessage = 'Invalid data format. Please check your input and try again.';
      statusCode = 400;
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      errorMessage = 'Database connection error. Please try again in a few moments.';
      statusCode = 503;
    }
    
    res.status(statusCode).json({ 
      success: false, 
      message: errorMessage,
      errors: error.response?.data?.errors || [],
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get survey by email (for personal dashboard) - User can only access their own data
app.get('/api/survey/email/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    
    if (useDatabase && pool) {
      // Try both encrypted and unencrypted email for backward compatibility
      // First try exact match (for unencrypted data)
      let result = await pool.query(
        'SELECT * FROM surveys WHERE LOWER(email_address) = LOWER($1) ORDER BY created_at DESC LIMIT 1',
        [email]
      );
      
      // If not found, try to find by decrypting all emails (for encrypted data)
      // This is less efficient but necessary for backward compatibility
      if (result.rows.length === 0) {
        const allSurveys = await pool.query('SELECT * FROM surveys ORDER BY created_at DESC');
        const matchingSurvey = allSurveys.rows.find(row => {
          const decryptedEmail = decrypt(row.email_address) || row.email_address;
          return decryptedEmail.toLowerCase() === email.toLowerCase();
        });
        if (matchingSurvey) {
          result = { rows: [matchingSurvey] };
        }
      }
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Survey not found for this email address' });
      }
      
      // Convert snake_case to camelCase and decrypt sensitive data
      const survey = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        permanentAddress: decrypt(result.rows[0].permanent_address) || result.rows[0].permanent_address,
        mobileNumber: decrypt(result.rows[0].mobile_number) || result.rows[0].mobile_number,
        emailAddress: decrypt(result.rows[0].email_address) || result.rows[0].email_address,
        dateOfBirth: formatDateOfBirth(result.rows[0].date_of_birth),
        age: result.rows[0].age,
        civilStatus: result.rows[0].civil_status,
        sex: result.rows[0].sex,
        currentLocation: decrypt(result.rows[0].current_location) || result.rows[0].current_location,
        courseGraduated: result.rows[0].course_graduated,
        schoolYearGraduated: result.rows[0].school_year_graduated,
        maxAcademicAchievement: result.rows[0].max_academic_achievement,
        trainings: typeof result.rows[0].trainings === 'string' ? JSON.parse(result.rows[0].trainings) : result.rows[0].trainings,
        civilService: result.rows[0].civil_service,
        letLicense: result.rows[0].let_license,
        otherPRCLicense: result.rows[0].other_prc_license,
        professionalOrganizations: result.rows[0].professional_organizations,
        isEmployed: result.rows[0].is_employed,
        employmentNature: result.rows[0].employment_nature,
        employmentClassification: result.rows[0].employment_classification,
        jobTitle: result.rows[0].job_title,
        placeOfWork: result.rows[0].place_of_work,
        monthlyIncome: result.rows[0].monthly_income,
        additionalRevenueSources: result.rows[0].additional_revenue_sources,
        ratings: typeof result.rows[0].ratings === 'string' ? JSON.parse(result.rows[0].ratings) : result.rows[0].ratings,
        isAlumni: result.rows[0].is_alumni,
        interestedAlumni: result.rows[0].interested_alumni,
        schoolRating: result.rows[0].school_rating,
        systemRating: result.rows[0].system_rating,
        schoolFeedback: result.rows[0].school_feedback,
        systemFeedback: result.rows[0].system_feedback,
        systemEvaluation: safeParseJSON(result.rows[0].system_evaluation) || {},
        createdAt: result.rows[0].created_at
      };
      
      res.json({ success: true, data: survey });
    } else {
      // Fallback to in-memory
      const survey = surveys.find(s => s.emailAddress?.toLowerCase() === email.toLowerCase());
      if (!survey) {
        return res.status(404).json({ success: false, message: 'Survey not found for this email address' });
      }
      res.json({ success: true, data: survey });
    }
  } catch (error) {
    console.error('Error fetching survey by email:', error);
    res.status(500).json({ success: false, message: 'Error fetching survey' });
  }
});

// Update survey by ID - Users can update their own, admins can update any
app.put('/api/survey/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Sanitize and validate survey data to prevent database errors
    const surveyData = sanitizeSurveyData(req.body);
    
    // Check if user is admin or owns this survey
    const isAdmin = req.headers.authorization?.includes('admin-token') || 
                    req.query.token === 'admin-token' || 
                    req.headers['x-admin-token'] === 'admin-token';
    
    if (useDatabase && pool) {
      // If not admin, verify the email matches
      if (!isAdmin && surveyData.emailAddress) {
        const existingResult = await pool.query('SELECT email_address FROM surveys WHERE id = $1', [id]);
        if (existingResult.rows.length > 0) {
          const existingEmail = decrypt(existingResult.rows[0].email_address) || existingResult.rows[0].email_address;
          if (existingEmail.toLowerCase() !== surveyData.emailAddress.toLowerCase()) {
            return res.status(403).json({ success: false, message: 'Unauthorized: You can only update your own survey' });
          }
        }
      }
      
      // Parse and validate date_of_birth (don't encrypt dates - PostgreSQL needs DATE type)
      const parsedDateOfBirth = parseDate(surveyData.dateOfBirth);
      
      const result = await pool.query(`
        UPDATE surveys SET
          name = $1, permanent_address = $2, mobile_number = $3, email_address = $4,
          date_of_birth = $5, age = $6, civil_status = $7, sex = $8, current_location = $9,
          course_graduated = $10, school_year_graduated = $11, max_academic_achievement = $12,
          trainings = $13, civil_service = $14, let_license = $15, other_prc_license = $16,
          professional_organizations = $17, is_employed = $18, employment_nature = $19,
          employment_classification = $20, job_title = $21, place_of_work = $22,
          is_it_field = $23, monthly_income = $24, additional_revenue_sources = $25, ratings = $26,
          is_alumni = $27, interested_alumni = $28, school_rating = $29, system_rating = $30,
          school_feedback = $31, system_feedback = $32, system_evaluation = $33, updated_at = CURRENT_TIMESTAMP
        WHERE id = $34
        RETURNING *
      `, [
        surveyData.name,
        encrypt(surveyData.permanentAddress) || null,
        encrypt(surveyData.mobileNumber) || null,
        encrypt(surveyData.emailAddress),
        parsedDateOfBirth, // Use parsed date instead of encrypted
        parseInteger(surveyData.age),
        surveyData.civilStatus || null,
        surveyData.sex || null,
        encrypt(surveyData.currentLocation) || null,
        surveyData.courseGraduated || null,
        surveyData.schoolYearGraduated || null,
        surveyData.maxAcademicAchievement || null,
        safeStringify(surveyData.trainings),
        surveyData.civilService || null,
        surveyData.letLicense || null,
        surveyData.otherPRCLicense || null,
        surveyData.professionalOrganizations || null,
        surveyData.isEmployed || null,
        surveyData.employmentNature || null,
        surveyData.employmentClassification || null,
        surveyData.jobTitle || null,
        surveyData.placeOfWork || null,
        surveyData.isITField || null,
        surveyData.monthlyIncome || null,
        surveyData.additionalRevenueSources || null,
        safeStringify(surveyData.ratings),
        surveyData.isAlumni || null,
        surveyData.interestedAlumni || null,
        parseInteger(surveyData.schoolRating),
        parseInteger(surveyData.systemRating),
        surveyData.schoolFeedback || null,
        surveyData.systemFeedback || null,
        safeStringify(surveyData.systemEvaluation || {}),
        id
      ]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Survey not found' });
      }
      
      // Convert snake_case to camelCase for response and decrypt sensitive data
      const updatedSurvey = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        permanentAddress: decrypt(result.rows[0].permanent_address) || result.rows[0].permanent_address,
        mobileNumber: decrypt(result.rows[0].mobile_number) || result.rows[0].mobile_number,
        emailAddress: decrypt(result.rows[0].email_address) || result.rows[0].email_address,
        dateOfBirth: formatDateOfBirth(result.rows[0].date_of_birth),
        age: result.rows[0].age,
        civilStatus: result.rows[0].civil_status,
        sex: result.rows[0].sex,
        currentLocation: decrypt(result.rows[0].current_location) || result.rows[0].current_location,
        courseGraduated: result.rows[0].course_graduated,
        schoolYearGraduated: result.rows[0].school_year_graduated,
        maxAcademicAchievement: result.rows[0].max_academic_achievement,
        trainings: typeof result.rows[0].trainings === 'string' ? JSON.parse(result.rows[0].trainings) : result.rows[0].trainings,
        civilService: result.rows[0].civil_service,
        letLicense: result.rows[0].let_license,
        otherPRCLicense: result.rows[0].other_prc_license,
        professionalOrganizations: result.rows[0].professional_organizations,
        isEmployed: result.rows[0].is_employed,
        employmentNature: result.rows[0].employment_nature,
        employmentClassification: result.rows[0].employment_classification,
        jobTitle: result.rows[0].job_title,
        placeOfWork: result.rows[0].place_of_work,
        monthlyIncome: result.rows[0].monthly_income,
        additionalRevenueSources: result.rows[0].additional_revenue_sources,
        ratings: typeof result.rows[0].ratings === 'string' ? JSON.parse(result.rows[0].ratings) : result.rows[0].ratings,
        isAlumni: result.rows[0].is_alumni,
        interestedAlumni: result.rows[0].interested_alumni,
        schoolRating: result.rows[0].school_rating,
        systemRating: result.rows[0].system_rating,
        schoolFeedback: result.rows[0].school_feedback,
        systemFeedback: result.rows[0].system_feedback,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at
      };
      
      // Update user's survey_id if email matches
      if (useDatabase && pool && surveyData.emailAddress) {
        await pool.query('UPDATE users SET survey_id = $1 WHERE LOWER(email) = LOWER($2)', [id, surveyData.emailAddress]);
      }

      res.json({ success: true, message: 'Survey updated successfully', data: updatedSurvey });
    } else {
      // Fallback to in-memory
      const index = surveys.findIndex(s => s.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Survey not found' });
      }
      surveys[index] = { ...surveys[index], ...surveyData };
      res.json({ success: true, message: 'Survey updated successfully', data: surveys[index] });
    }
  } catch (error) {
    console.error('Error updating survey:', error);
    res.status(500).json({ success: false, message: 'Error updating survey' });
  }
});

// Delete survey - PROTECTED: Admin only
app.delete('/api/surveys/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid survey ID' });
    }
    
    if (useDatabase && pool) {
      // Start a transaction to ensure all deletions succeed or fail together
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // First, check if survey exists and get email (decrypt if needed)
        const surveyResult = await client.query('SELECT email_address FROM surveys WHERE id = $1', [id]);
        
        if (surveyResult.rows.length === 0) {
          await client.query('ROLLBACK');
          client.release();
          return res.status(404).json({ success: false, message: 'Survey not found' });
        }

        const encryptedEmail = surveyResult.rows[0].email_address;
        // Try to decrypt email (in case it's encrypted)
        const email = decrypt(encryptedEmail) || encryptedEmail;

        // Delete user accounts associated with this survey
        // First, delete users that reference this survey by survey_id (most reliable)
        const usersBySurveyId = await client.query('DELETE FROM users WHERE survey_id = $1 RETURNING email', [id]);
        console.log(`✅ Deleted ${usersBySurveyId.rows.length} user account(s) referencing survey ${id} by survey_id`);

        // Also delete user account by email (in case survey_id wasn't set but email matches)
        // Try both encrypted and decrypted email to be safe
        if (email) {
          // Try with decrypted email
          const usersByEmail = await client.query('DELETE FROM users WHERE LOWER(email) = LOWER($1) RETURNING id', [email]);
          if (usersByEmail.rows.length > 0) {
            console.log(`✅ Deleted ${usersByEmail.rows.length} user account(s) with decrypted email`);
          }
          
          // Also try with encrypted email (in case user email is stored encrypted)
          if (encryptedEmail !== email) {
            const usersByEncryptedEmail = await client.query('DELETE FROM users WHERE LOWER(email) = LOWER($1) RETURNING id', [encryptedEmail]);
            if (usersByEncryptedEmail.rows.length > 0) {
              console.log(`✅ Deleted ${usersByEncryptedEmail.rows.length} user account(s) with encrypted email`);
            }
          }
        }

        // Now delete the survey from database (this is the main deletion)
        const deleteResult = await client.query('DELETE FROM surveys WHERE id = $1 RETURNING *', [id]);
        
        if (deleteResult.rows.length === 0) {
          await client.query('ROLLBACK');
          client.release();
          return res.status(404).json({ success: false, message: 'Survey not found or already deleted' });
        }

        // Commit the transaction - this makes the deletion permanent in the database
        await client.query('COMMIT');
        
        console.log(`✅ Survey ${id} deleted successfully from database (email: ${email || 'N/A'})`);
        
        client.release();
        
        res.json({
          success: true,
          message: 'Survey and associated user accounts deleted successfully from database',
          data: {
            id: deleteResult.rows[0].id,
            deleted: true
          }
        });
      } catch (error) {
        // Rollback the transaction on error
        await client.query('ROLLBACK');
        client.release();
        throw error;
      }
    } else {
      // Fallback to in-memory (for development/testing)
      const surveyIndex = surveys.findIndex(s => s.id === id);
      if (surveyIndex === -1) {
        return res.status(404).json({ success: false, message: 'Survey not found' });
      }
      const deletedSurvey = surveys.splice(surveyIndex, 1)[0];
      console.log(`✅ Survey ${id} deleted from in-memory storage`);
      res.json({
        success: true,
        message: 'Survey deleted successfully (in-memory storage)',
        data: deletedSurvey
      });
    }
  } catch (error) {
    console.error('❌ Error deleting survey:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    // Provide more detailed error message
    let errorMessage = 'Error deleting survey from database';
    if (error.code === '23503') {
      errorMessage = 'Cannot delete survey: It is referenced by other records. Please contact administrator.';
    } else if (error.code === '23505') {
      errorMessage = 'Database constraint violation';
    } else if (error.code === '42P01') {
      errorMessage = 'Database table not found. Please ensure database is properly initialized.';
    } else {
      errorMessage = `Error deleting survey: ${error.message}`;
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get statistics (Public endpoint - returns aggregated data only, no personal info)
app.get('/api/stats', async (req, res) => {
  try {
    if (useDatabase && pool) {
      const totalResult = await pool.query('SELECT COUNT(*) as total FROM surveys');
      const totalGraduates = parseInt(totalResult.rows[0].total);

      const employedResult = await pool.query(`
        SELECT COUNT(*) as count FROM surveys 
        WHERE is_employed = 'Yes' AND (employment_nature = 'Government Sector' OR employment_nature = 'Private Sector')
      `);
      const employed = parseInt(employedResult.rows[0].count);

      const selfEmployedResult = await pool.query(`
        SELECT COUNT(*) as count FROM surveys WHERE employment_nature = 'Self-Employed'
      `);
      const selfEmployed = parseInt(selfEmployedResult.rows[0].count);

      const unemployedResult = await pool.query(`
        SELECT COUNT(*) as count FROM surveys 
        WHERE is_employed = 'No' OR employment_nature = 'Not Currently Employed'
      `);
      const unemployed = parseInt(unemployedResult.rows[0].count);

      const letLicenseResult = await pool.query(`
        SELECT COUNT(*) as count FROM surveys 
        WHERE let_license IS NOT NULL AND let_license LIKE 'Yes%'
      `);
      const letLicense = parseInt(letLicenseResult.rows[0].count);

      // Get aggregated chart data (no personal information)
      const incomeResult = await pool.query(`
        SELECT monthly_income, COUNT(*) as count 
        FROM surveys 
        WHERE monthly_income IS NOT NULL 
        GROUP BY monthly_income
      `);
      
      // Function to extract numeric value from income range for sorting
      const getIncomeSortValue = (incomeRange) => {
        if (!incomeRange) return 0;
        const range = incomeRange.replace('₱', 'P');
        if (range.includes('Less than')) return 0;
        if (range.includes('and above')) {
          const match = range.match(/P([\d,]+)/);
          return match ? parseInt(match[1].replace(/,/g, '')) : 999999;
        }
        // Extract first number from range (e.g., "P10,000 – P19,999" -> 10000)
        const match = range.match(/P([\d,]+)/);
        return match ? parseInt(match[1].replace(/,/g, '')) : 0;
      };
      
      const incomeChartData = incomeResult.rows
        .map(row => ({
          name: row.monthly_income?.replace('₱', 'P') || row.monthly_income,
          value: parseInt(row.count),
          sortValue: getIncomeSortValue(row.monthly_income)
        }))
        .sort((a, b) => a.sortValue - b.sortValue)
        .map(({ sortValue, ...item }) => item); // Remove sortValue from final output

      const courseResult = await pool.query(`
        SELECT course_graduated, COUNT(*) as count 
        FROM surveys 
        WHERE course_graduated IS NOT NULL 
        GROUP BY course_graduated
      `);
      const courseChartData = courseResult.rows.map(row => {
        const course = row.course_graduated?.includes('Multimedia') ? 'BSIT Multimedia' :
                      row.course_graduated?.includes('Animation') ? 'BSIT Animation' : 
                      row.course_graduated?.includes('BSIT') ? 'BSIT' : row.course_graduated;
        return { name: course, value: parseInt(row.count) };
      });

      const yearResult = await pool.query(`
        SELECT school_year_graduated, COUNT(*) as count 
        FROM surveys 
        WHERE school_year_graduated IS NOT NULL 
        GROUP BY school_year_graduated
        ORDER BY school_year_graduated
      `);
      const yearChartData = yearResult.rows.map(row => ({
        name: row.school_year_graduated,
        value: parseInt(row.count)
      }));

      const employmentNatureResult = await pool.query(`
        SELECT employment_nature, COUNT(*) as count 
        FROM surveys 
        WHERE employment_nature IS NOT NULL 
        GROUP BY employment_nature
      `);
      const employmentNatureChartData = employmentNatureResult.rows.map(row => ({
        name: row.employment_nature,
        value: parseInt(row.count)
      }));

      const itFieldResult = await pool.query(`
        SELECT is_it_field, COUNT(*) as count 
        FROM surveys 
        WHERE is_employed = 'Yes' AND is_it_field IS NOT NULL 
        GROUP BY is_it_field
      `);
      const itFieldChartData = itFieldResult.rows.map(row => ({
        name: row.is_it_field === 'Yes' ? 'IT Field' : 'Non-IT Field',
        value: parseInt(row.count)
      }));

      // Get ratings data (aggregated only)
      const ratingsResult = await pool.query(`
        SELECT ratings 
        FROM surveys 
        WHERE ratings IS NOT NULL
      `);
      
      const calculateAverageRating = (section) => {
        const ratings = ratingsResult.rows
          .map(row => {
            try {
              const ratingData = typeof row.ratings === 'string' ? JSON.parse(row.ratings) : row.ratings;
              return ratingData?.[section];
            } catch {
              return null;
            }
          })
          .filter(r => r)
          .flatMap(r => Object.values(r))
          .filter(r => r && !isNaN(parseFloat(r)))
          .map(r => parseFloat(r));
        
        if (ratings.length === 0) return 0;
        return parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2));
      };

      const ratingData = [
        { name: 'Job Placement', value: calculateAverageRating('jobPlacement') },
        { name: 'IT Field', value: calculateAverageRating('itField') },
        { name: 'Competitive Edge', value: calculateAverageRating('competitiveEdge') },
        { name: 'Workplace', value: calculateAverageRating('workplace') }
      ].filter(item => item.value > 0);

      const stats = {
        totalGraduates,
        employed,
        selfEmployed,
        unemployed,
        letLicense,
        charts: {
          income: incomeChartData,
          course: courseChartData,
          year: yearChartData,
          employmentNature: employmentNatureChartData,
          itField: itFieldChartData,
          ratings: ratingData
        }
      };

      res.json({ success: true, data: stats });
    } else {
      // Fallback to in-memory
      const stats = {
        totalGraduates: surveys.length,
        employed: surveys.filter(s => {
          return s.isEmployed === 'Yes' && 
                 (s.employmentNature === 'Government Sector' || s.employmentNature === 'Private Sector');
        }).length,
        selfEmployed: surveys.filter(s => s.employmentNature === 'Self-Employed').length,
        unemployed: surveys.filter(s => {
          return s.isEmployed === 'No' || s.employmentNature === 'Not Currently Employed';
        }).length,
        letLicense: surveys.filter(s => {
          return s.letLicense && (s.letLicense.startsWith('Yes') || s.letLicense.toLowerCase().includes('yes'));
        }).length,
        charts: {
          income: [],
          course: [],
          year: [],
          employmentNature: [],
          itField: [],
          ratings: []
        }
      };
      res.json({ success: true, data: stats });
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Fallback to in-memory on error
    const stats = {
      totalGraduates: surveys.length,
      employed: surveys.filter(s => {
        return s.isEmployed === 'Yes' && 
               (s.employmentNature === 'Government Sector' || s.employmentNature === 'Private Sector');
      }).length,
      selfEmployed: surveys.filter(s => s.employmentNature === 'Self-Employed').length,
      unemployed: surveys.filter(s => {
        return s.isEmployed === 'No' || s.employmentNature === 'Not Currently Employed';
      }).length,
      letLicense: surveys.filter(s => {
        return s.letLicense && (s.letLicense.startsWith('Yes') || s.letLicense.toLowerCase().includes('yes'));
      }).length,
      charts: {
        income: [],
        course: [],
        year: [],
        employmentNature: [],
        itField: [],
        ratings: []
      }
    };
    res.json({ success: true, data: stats });
  }
});

// Send notification to respondents
app.post('/api/send-notification', authenticateAdmin, async (req, res) => {
  try {
    console.log('📧 Notification endpoint called');
    console.log('📧 Request headers:', { 
      'x-admin-token': req.headers['x-admin-token'] ? 'present' : 'missing',
      'authorization': req.headers['authorization'] ? 'present' : 'missing'
    });
    const { subject, message, recipientFilter, selectedYear } = req.body;
    console.log('📧 Notification data:', { subject, recipientFilter, selectedYear, messageLength: message?.length });
    
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }
    
    if (!pool) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }
    
    // Build query based on recipient filter
    let query = 'SELECT DISTINCT email_address, name FROM surveys WHERE email_address IS NOT NULL AND email_address != \'\'';
    const queryParams = [];
    
    if (recipientFilter === 'employed') {
      query += ' AND is_employed = $1';
      queryParams.push('Yes');
    } else if (recipientFilter === 'unemployed') {
      query += ' AND is_employed = $1';
      queryParams.push('No');
    } else if (recipientFilter === 'self-employed') {
      query += ' AND employment_nature = $1';
      queryParams.push('Self-Employed');
    } else if (recipientFilter === 'by-year' && selectedYear) {
      query += ' AND school_year_graduated LIKE $1';
      queryParams.push(`${selectedYear}%`);
    }
    // 'all' doesn't need additional filter
    
    const result = await pool.query(query, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No recipients found matching the criteria' });
    }
    
    // Get email addresses (decrypt if needed)
    const recipients = [];
    const emailMap = new Map(); // To avoid duplicates
    
    for (const row of result.rows) {
      let email = decrypt(row.email_address) || row.email_address;
      if (email && !emailMap.has(email.toLowerCase())) {
        emailMap.set(email.toLowerCase(), true);
        recipients.push({
          email: email,
          name: row.name || 'Respondent'
        });
      }
    }
    
    if (recipients.length === 0) {
      return res.status(404).json({ success: false, message: 'No valid email addresses found' });
    }
    
    // Send emails to all recipients
    const emailResults = {
      success: 0,
      failed: 0,
      errors: []
    };
    
    // Use nodemailer to send emails
    const nodemailer = require('nodemailer');
    
    // Create transporter (reuse from auth.js if possible, or create new)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || process.env.EMAIL_USER || 'dwcsjtracersystem@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || process.env.EMAIL_APP_PASSWORD
      }
    });
    
    // Get base URL for links
    const baseUrl = process.env.BASE_URL || 
                    process.env.FRONTEND_URL || 
                    (req.protocol + '://' + req.get('host')) ||
                    'https://dwcsjgraduatetracer.it.com';
    
    // Send emails in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (recipient) => {
          try {
            // Construct personal dashboard link with email
            const dashboardLink = `${baseUrl}/personal-dashboard?email=${encodeURIComponent(recipient.email)}`;
            
            const mailOptions = {
              from: `"BSIT Graduate Tracer System" <${process.env.GMAIL_USER || process.env.EMAIL_USER || 'dwcsjtracersystem@gmail.com'}>`,
              to: recipient.email,
              subject: `[IMPORTANT] ${subject}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #11823b 0%, #0d6b2f 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">BSIT Graduate Tracer System</h1>
                  </div>
                  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #11823b; margin-top: 0;">Important Notification</h2>
                    <p style="color: #1f2937; line-height: 1.6; font-size: 16px;">
                      Dear ${recipient.name || 'Respondent'},
                    </p>
                    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #11823b; margin: 20px 0;">
                      <p style="color: #1f2937; line-height: 1.8; white-space: pre-wrap; margin: 0;">${message}</p>
                    </div>
                    <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border: 2px solid #11823b; margin: 25px 0;">
                      <h3 style="color: #11823b; margin-top: 0; font-size: 18px;">📋 How to Access Your Personal Dashboard:</h3>
                      <ol style="color: #1f2937; line-height: 1.8; padding-left: 20px; margin: 15px 0;">
                        <li style="margin-bottom: 10px;">Click the button below to access your personal dashboard directly</li>
                        <li style="margin-bottom: 10px;">Or copy and paste this link into your browser: <a href="${dashboardLink}" style="color: #11823b; word-break: break-all;">${dashboardLink}</a></li>
                        <li style="margin-bottom: 10px;">You can view and edit your survey responses, including the System Evaluation section</li>
                        <li>If you need to login, use your registered email address and password</li>
                      </ol>
                      <div style="text-align: center; margin-top: 25px;">
                        <a href="${dashboardLink}" style="display: inline-block; background: linear-gradient(135deg, #11823b 0%, #0d6b2f 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Access Your Personal Dashboard</a>
                      </div>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                      This is an automated message from the BSIT Graduate Tracer System.<br>
                      Please do not reply to this email.
                    </p>
                  </div>
                  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} BSIT Graduate Tracer System | Divine Word College of San Jose</p>
                  </div>
                </div>
              `,
              text: `Dear ${recipient.name || 'Respondent'},\n\n${message}\n\nHow to Access Your Personal Dashboard:\n1. Click this link: ${dashboardLink}\n2. Or copy and paste the link into your browser\n3. You can view and edit your survey responses, including the System Evaluation section\n4. If you need to login, use your registered email address and password\n\nThis is an automated message from the BSIT Graduate Tracer System.`
            };
            
            await transporter.sendMail(mailOptions);
            emailResults.success++;
          } catch (error) {
            console.error(`Failed to send email to ${recipient.email}:`, error);
            emailResults.failed++;
            emailResults.errors.push({
              email: recipient.email,
              error: error.message
            });
          }
        })
      );
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Save to notification history
    try {
      await pool.query(
        `INSERT INTO notifications_history (subject, message, recipient_filter, selected_year, recipient_count)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          subject,
          message,
          recipientFilter,
          selectedYear || null,
          emailResults.success
        ]
      );
      console.log('✅ Notification saved to history');
    } catch (historyError) {
      console.error('⚠️ Failed to save notification to history:', historyError.message);
      // Don't fail the request if history save fails
    }
    
    res.json({
      success: true,
      message: `Notification sent to ${emailResults.success} recipient(s)${emailResults.failed > 0 ? `. ${emailResults.failed} failed.` : ''}`,
      recipientCount: emailResults.success,
      totalRecipients: recipients.length,
      failed: emailResults.failed,
      errors: emailResults.errors.length > 0 ? emailResults.errors : undefined
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, message: 'Error sending notification: ' + error.message });
  }
});

// Get notification history
app.get('/api/notifications-history', authenticateAdmin, async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ success: false, message: 'Database not available' });
    }
    
    const result = await pool.query(`
      SELECT 
        id,
        subject,
        message,
        recipient_filter,
        selected_year,
        recipient_count,
        sent_at
      FROM notifications_history
      ORDER BY sent_at DESC
      LIMIT 100
    `);
    
    res.json({
      success: true,
      history: result.rows
    });
  } catch (error) {
    console.error('Error fetching notification history:', error);
    res.status(500).json({ success: false, message: 'Error fetching notification history: ' + error.message });
  }
});

// Get system evaluation statistics
app.get('/api/evaluation-stats', async (req, res) => {
  try {
    if (useDatabase && pool) {
      const result = await pool.query(`
        SELECT system_evaluation 
        FROM surveys 
        WHERE system_evaluation IS NOT NULL AND system_evaluation != 'null' AND system_evaluation != '{}'
      `);
      
      const evaluations = result.rows
        .map(row => safeParseJSON(row.system_evaluation))
        .filter(eval => eval && typeof eval === 'object');
      
      if (evaluations.length === 0) {
        return res.json({
          success: true,
          data: {
            functionality: { mean: 0, rating: 'N/A', indicators: [] },
            reliability: { mean: 0, rating: 'N/A', indicators: [] },
            accuracy: { mean: 0, rating: 'N/A', indicators: [] },
            efficiency: { mean: 0, rating: 'N/A', indicators: [] },
            overall: { mean: 0, rating: 'N/A' }
          }
        });
      }
      
      // Helper function to calculate mean and rating
      const calculateMeanAndRating = (values) => {
        // Filter out null, undefined, empty strings, and invalid values
        const validValues = values.filter(v => {
          if (v === null || v === undefined || v === '') return false;
          const num = parseFloat(v);
          return !isNaN(num) && num >= 1 && num <= 5; // Only accept valid ratings 1-5
        });
        
        if (validValues.length === 0) return { mean: 0, rating: 'N/A' };
        
        const sum = validValues.reduce((acc, val) => acc + parseFloat(val), 0);
        const mean = sum / validValues.length;
        
        let rating = 'N/A';
        if (mean >= 4.51 && mean <= 5.00) rating = 'Excellent';
        else if (mean >= 3.51 && mean <= 4.50) rating = 'Very Good';
        else if (mean >= 2.51 && mean <= 3.50) rating = 'Good';
        else if (mean >= 1.51 && mean <= 2.50) rating = 'Fair';
        else if (mean >= 1.00 && mean <= 1.50) rating = 'Poor';
        
        return { mean: parseFloat(mean.toFixed(2)), rating };
      };
      
      // Functionality
      const functionalityQ1 = evaluations.map(e => e.functionality?.q1).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const functionalityQ2 = evaluations.map(e => e.functionality?.q2).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const functionalityQ3 = evaluations.map(e => e.functionality?.q3).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const functionalityMeans = [
        functionalityQ1.length > 0 ? functionalityQ1.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / functionalityQ1.length : 0,
        functionalityQ2.length > 0 ? functionalityQ2.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / functionalityQ2.length : 0,
        functionalityQ3.length > 0 ? functionalityQ3.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / functionalityQ3.length : 0
      ];
      const functionalityOverall = calculateMeanAndRating([...functionalityQ1, ...functionalityQ2, ...functionalityQ3]);
      
      // Reliability
      const reliabilityQ1 = evaluations.map(e => e.reliability?.q1).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const reliabilityQ2 = evaluations.map(e => e.reliability?.q2).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const reliabilityQ3 = evaluations.map(e => e.reliability?.q3).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const reliabilityMeans = [
        reliabilityQ1.length > 0 ? reliabilityQ1.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / reliabilityQ1.length : 0,
        reliabilityQ2.length > 0 ? reliabilityQ2.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / reliabilityQ2.length : 0,
        reliabilityQ3.length > 0 ? reliabilityQ3.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / reliabilityQ3.length : 0
      ];
      const reliabilityOverall = calculateMeanAndRating([...reliabilityQ1, ...reliabilityQ2, ...reliabilityQ3]);
      
      // Accuracy
      const accuracyQ1 = evaluations.map(e => e.accuracy?.q1).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const accuracyQ2 = evaluations.map(e => e.accuracy?.q2).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const accuracyQ3 = evaluations.map(e => e.accuracy?.q3).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const accuracyMeans = [
        accuracyQ1.length > 0 ? accuracyQ1.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / accuracyQ1.length : 0,
        accuracyQ2.length > 0 ? accuracyQ2.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / accuracyQ2.length : 0,
        accuracyQ3.length > 0 ? accuracyQ3.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / accuracyQ3.length : 0
      ];
      const accuracyOverall = calculateMeanAndRating([...accuracyQ1, ...accuracyQ2, ...accuracyQ3]);
      
      // Efficiency
      const efficiencyQ1 = evaluations.map(e => e.efficiency?.q1).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const efficiencyQ2 = evaluations.map(e => e.efficiency?.q2).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const efficiencyQ3 = evaluations.map(e => e.efficiency?.q3).filter(v => v !== null && v !== undefined && v !== '' && !isNaN(parseFloat(v)));
      const efficiencyMeans = [
        efficiencyQ1.length > 0 ? efficiencyQ1.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / efficiencyQ1.length : 0,
        efficiencyQ2.length > 0 ? efficiencyQ2.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / efficiencyQ2.length : 0,
        efficiencyQ3.length > 0 ? efficiencyQ3.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / efficiencyQ3.length : 0
      ];
      const efficiencyOverall = calculateMeanAndRating([...efficiencyQ1, ...efficiencyQ2, ...efficiencyQ3]);
      
      // Overall mean
      const allMeans = [functionalityOverall.mean, reliabilityOverall.mean, accuracyOverall.mean, efficiencyOverall.mean].filter(m => m > 0);
      const overallMean = allMeans.length > 0 ? allMeans.reduce((a, b) => a + b, 0) / allMeans.length : 0;
      const overallRating = calculateMeanAndRating(allMeans.map(String)).rating;
      
      res.json({
        success: true,
        data: {
          functionality: {
            mean: functionalityOverall.mean,
            rating: functionalityOverall.rating,
            indicators: [
              { text: 'The system is easy to use and learned.', mean: parseFloat(functionalityMeans[0].toFixed(2)), rating: calculateMeanAndRating(functionalityQ1).rating },
              { text: 'The system can be used with comfort and convenience.', mean: parseFloat(functionalityMeans[1].toFixed(2)), rating: calculateMeanAndRating(functionalityQ2).rating },
              { text: 'The system is user-friendly.', mean: parseFloat(functionalityMeans[2].toFixed(2)), rating: calculateMeanAndRating(functionalityQ3).rating }
            ]
          },
          reliability: {
            mean: reliabilityOverall.mean,
            rating: reliabilityOverall.rating,
            indicators: [
              { text: 'The system provides the correct desired output.', mean: parseFloat(reliabilityMeans[0].toFixed(2)), rating: calculateMeanAndRating(reliabilityQ1).rating },
              { text: 'Absence of failures in the system.', mean: parseFloat(reliabilityMeans[1].toFixed(2)), rating: calculateMeanAndRating(reliabilityQ2).rating },
              { text: 'The system is accurate in performance.', mean: parseFloat(reliabilityMeans[2].toFixed(2)), rating: calculateMeanAndRating(reliabilityQ3).rating }
            ]
          },
          accuracy: {
            mean: accuracyOverall.mean,
            rating: accuracyOverall.rating,
            indicators: [
              { text: 'The system gives accurate information/computation.', mean: parseFloat(accuracyMeans[0].toFixed(2)), rating: calculateMeanAndRating(accuracyQ1).rating },
              { text: 'The system provides accurate outputs.', mean: parseFloat(accuracyMeans[1].toFixed(2)), rating: calculateMeanAndRating(accuracyQ2).rating },
              { text: 'The system provides accurate reports.', mean: parseFloat(accuracyMeans[2].toFixed(2)), rating: calculateMeanAndRating(accuracyQ3).rating }
            ]
          },
          efficiency: {
            mean: efficiencyOverall.mean,
            rating: efficiencyOverall.rating,
            indicators: [
              { text: 'The system is well organized and working properly.', mean: parseFloat(efficiencyMeans[0].toFixed(2)), rating: calculateMeanAndRating(efficiencyQ1).rating },
              { text: 'The system is well organized for purpose.', mean: parseFloat(efficiencyMeans[1].toFixed(2)), rating: calculateMeanAndRating(efficiencyQ2).rating },
              { text: 'The system is capable to produce the desired output without delaying the run time performance.', mean: parseFloat(efficiencyMeans[2].toFixed(2)), rating: calculateMeanAndRating(efficiencyQ3).rating }
            ]
          },
          overall: {
            mean: parseFloat(overallMean.toFixed(2)),
            rating: overallRating
          }
        }
      });
    } else {
      // Fallback to in-memory
      res.json({
        success: true,
        data: {
          functionality: { mean: 0, rating: 'N/A', indicators: [] },
          reliability: { mean: 0, rating: 'N/A', indicators: [] },
          accuracy: { mean: 0, rating: 'N/A', indicators: [] },
          efficiency: { mean: 0, rating: 'N/A', indicators: [] },
          overall: { mean: 0, rating: 'N/A' }
        }
      });
    }
  } catch (error) {
    console.error('Error fetching evaluation stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching evaluation statistics' });
  }
});

// Technical Support Report Route
app.post('/api/technical-support', async (req, res) => {
  try {
    const { name, email, subject, issueType, description, priority } = req.body;

    // Validation
    if (!name || !email || !subject || !issueType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const reportData = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      issueType: issueType.trim(),
      description: description.trim(),
      priority: priority || 'Medium'
    };

    // Save to database if available
    if (useDatabase && pool) {
      try {
        await pool.query(
          `INSERT INTO technical_support_reports (name, email, subject, issue_type, description, priority)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            reportData.name,
            reportData.email,
            reportData.subject,
            reportData.issueType,
            reportData.description,
            reportData.priority
          ]
        );
        console.log('✅ Technical support report saved to database');
      } catch (dbError) {
        console.error('Error saving report to database:', dbError);
        // Continue to send email even if database save fails
      }
    }

    const result = await sendTechnicalSupportReport(reportData);

    if (result.success) {
      res.json({
        success: true,
        message: 'Your report has been submitted successfully. We will review it and contact you if needed.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || 'Failed to submit report. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Error processing technical support report:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your report. Please try again later.'
    });
  }
});

// Get Technical Support Reports (Admin only)
app.get('/api/technical-support/reports', authenticateAdmin, async (req, res) => {
  try {
    if (useDatabase && pool) {
      const result = await pool.query(
        `SELECT id, name, email, subject, issue_type, description, priority, is_read, created_at
         FROM technical_support_reports
         ORDER BY created_at DESC`
      );
      res.json({ success: true, data: result.rows });
    } else {
      res.json({ success: true, data: [] });
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
});

// Get unread reports count (Admin only)
app.get('/api/technical-support/reports/count', authenticateAdmin, async (req, res) => {
  try {
    if (useDatabase && pool) {
      const result = await pool.query(
        `SELECT COUNT(*) as count FROM technical_support_reports WHERE is_read = FALSE`
      );
      res.json({ success: true, count: parseInt(result.rows[0].count) });
    } else {
      res.json({ success: true, count: 0 });
    }
  } catch (error) {
    console.error('Error fetching reports count:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reports count' });
  }
});

// Mark report as read (Admin only)
app.put('/api/technical-support/reports/:id/read', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (useDatabase && pool) {
      await pool.query(
        `UPDATE technical_support_reports SET is_read = TRUE WHERE id = $1`,
        [id]
      );
      res.json({ success: true, message: 'Report marked as read' });
    } else {
      res.json({ success: true, message: 'Report marked as read' });
    }
  } catch (error) {
    console.error('Error marking report as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark report as read' });
  }
});

// Delete report (Admin only)
app.delete('/api/technical-support/reports/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (useDatabase && pool) {
      await pool.query(`DELETE FROM technical_support_reports WHERE id = $1`, [id]);
      res.json({ success: true, message: 'Report deleted successfully' });
    } else {
      res.json({ success: true, message: 'Report deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ success: false, message: 'Failed to delete report' });
  }
});

// Catch all handler: send back React's index.html file in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (useDatabase && pool) {
    console.log(`💾 Database: PostgreSQL (Connected)`);
  } else {
    console.log(`💾 Database: In-Memory (Temporary storage)`);
    console.log(`💡 Tip: Add PostgreSQL database in Railway for permanent storage`);
  }
});
