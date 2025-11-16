const express = require('express');
const cors = require('cors');
const path = require('path');
const { sendOTP, verifyOTP } = require('./auth');
require('dotenv').config();

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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    
    // Only allow specific admin email
    if (email !== 'johnpauld750@gmail.com') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized email address' 
      });
    }

    const result = await sendOTP(email);
    if (result.success) {
      res.json({ success: true, message: 'OTP sent to your email' });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

app.post('/api/admin/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (email !== 'johnpauld750@gmail.com') {
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
      const result = await sendOTP(email);
      if (result.success) {
        res.json({ success: true, message: 'OTP sent to your email' });
      } else {
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
      const result = await pool.query(`
        SELECT name, school_rating, system_rating, school_feedback, system_feedback, created_at
        FROM surveys
        WHERE (school_feedback IS NOT NULL AND school_feedback != '') 
           OR (system_feedback IS NOT NULL AND system_feedback != '')
        ORDER BY created_at DESC
        LIMIT 50
      `);
      
      const feedbacks = result.rows.map(row => ({
        name: row.name,
        schoolRating: row.school_rating,
        systemRating: row.system_rating,
        schoolFeedback: row.school_feedback,
        systemFeedback: row.system_feedback,
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

// Get all surveys
app.get('/api/surveys', async (req, res) => {
  try {
    if (useDatabase && pool) {
      const result = await pool.query('SELECT * FROM surveys ORDER BY created_at DESC');
      console.log(`📊 Found ${result.rows.length} surveys in database`);
      // Convert snake_case to camelCase for frontend
      const surveys = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        permanentAddress: row.permanent_address,
        mobileNumber: row.mobile_number,
        emailAddress: row.email_address,
        dateOfBirth: row.date_of_birth,
        age: row.age,
        civilStatus: row.civil_status,
        sex: row.sex,
        currentLocation: row.current_location,
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
        monthlyIncome: row.monthly_income,
        additionalRevenueSources: row.additional_revenue_sources,
        ratings: typeof row.ratings === 'string' ? JSON.parse(row.ratings) : row.ratings,
        isAlumni: row.is_alumni,
        interestedAlumni: row.interested_alumni,
        schoolRating: row.school_rating,
        systemRating: row.system_rating,
        schoolFeedback: row.school_feedback,
        systemFeedback: row.system_feedback,
        createdAt: row.created_at
      }));
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
    console.error('Error fetching surveys:', error);
    // Fallback to in-memory on error
    res.json({
      success: true,
      message: 'Surveys retrieved successfully',
      data: surveys
    });
  }
});

// Get single survey
app.get('/api/surveys/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (useDatabase && pool) {
      const result = await pool.query('SELECT * FROM surveys WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Survey not found' });
      }
      res.json({ success: true, data: result.rows[0] });
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
    const surveyData = req.body;
    
    // Required fields validation
    if (!surveyData.name || !surveyData.emailAddress || !surveyData.schoolYearGraduated) {
      return res.status(400).json({ success: false, message: 'Name, email address, and school year graduated are required' });
    }

    if (useDatabase && pool) {
      // Check for duplicate email/name
      const duplicateCheck = await pool.query(
        'SELECT id, email_address, name FROM surveys WHERE LOWER(email_address) = LOWER($1) OR LOWER(name) = LOWER($2)',
        [surveyData.emailAddress, surveyData.name]
      );
      
      if (duplicateCheck.rows.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'A survey with this email address or name already exists. You can edit your existing survey by accessing your personal dashboard.',
          existingEmail: duplicateCheck.rows[0].email_address
        });
      }

      // Use PostgreSQL database
      const result = await pool.query(`
        INSERT INTO surveys (
          name, permanent_address, mobile_number, email_address, date_of_birth, age,
          civil_status, sex, current_location, course_graduated, school_year_graduated,
          max_academic_achievement, trainings, civil_service, let_license, other_prc_license,
          professional_organizations, is_employed, employment_nature, employment_classification,
          job_title, place_of_work, monthly_income, additional_revenue_sources, ratings,
          is_alumni, interested_alumni, school_rating, system_rating, school_feedback, system_feedback
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)
        RETURNING *
      `, [
        surveyData.name,
        surveyData.permanentAddress || null,
        surveyData.mobileNumber || null,
        surveyData.emailAddress,
        surveyData.dateOfBirth || null,
        surveyData.age ? parseInt(surveyData.age) : null,
        surveyData.civilStatus || null,
        surveyData.sex || null,
        surveyData.currentLocation || null,
        surveyData.courseGraduated || null,
        surveyData.schoolYearGraduated,
        surveyData.maxAcademicAchievement || null,
        JSON.stringify(surveyData.trainings || []),
        surveyData.civilService || null,
        surveyData.letLicense || null,
        surveyData.otherPRCLicense || null,
        surveyData.professionalOrganizations || null,
        surveyData.isEmployed || null,
        surveyData.employmentNature || null,
        surveyData.employmentClassification || null,
        surveyData.jobTitle || null,
        surveyData.placeOfWork || null,
        surveyData.monthlyIncome || null,
        surveyData.additionalRevenueSources || null,
        JSON.stringify(surveyData.ratings || {}),
        surveyData.isAlumni || null,
        surveyData.interestedAlumni || null,
        surveyData.schoolRating || null,
        surveyData.systemRating || null,
        surveyData.schoolFeedback || null,
        surveyData.systemFeedback || null
      ]);

      // Convert snake_case to camelCase for response
      const savedSurvey = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        permanentAddress: result.rows[0].permanent_address,
        mobileNumber: result.rows[0].mobile_number,
        emailAddress: result.rows[0].email_address,
        dateOfBirth: result.rows[0].date_of_birth,
        age: result.rows[0].age,
        civilStatus: result.rows[0].civil_status,
        sex: result.rows[0].sex,
        currentLocation: result.rows[0].current_location,
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
        createdAt: result.rows[0].created_at
      };

      console.log('✅ Survey saved to database:', savedSurvey.id);
      res.json({
        success: true,
        message: 'Survey submitted successfully',
        data: savedSurvey
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
    console.error('Error creating survey:', error);
    // Fallback to in-memory on error
    try {
      const newSurvey = {
        id: surveys.length > 0 ? Math.max(...surveys.map(s => s.id)) + 1 : 1,
        ...surveyData,
        createdAt: new Date().toISOString()
      };
      surveys.push(newSurvey);
      
      res.json({
        success: true,
        message: 'Survey submitted successfully (fallback to in-memory storage)',
        data: newSurvey
      });
    } catch (fallbackError) {
      res.status(500).json({ 
        success: false, 
        message: 'Error creating survey: ' + error.message 
      });
    }
  }
});

// Get survey by email (for personal dashboard)
app.get('/api/survey/email/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    
    if (useDatabase && pool) {
      const result = await pool.query(
        'SELECT * FROM surveys WHERE LOWER(email_address) = LOWER($1) ORDER BY created_at DESC LIMIT 1',
        [email]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Survey not found for this email address' });
      }
      
      // Convert snake_case to camelCase
      const survey = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        permanentAddress: result.rows[0].permanent_address,
        mobileNumber: result.rows[0].mobile_number,
        emailAddress: result.rows[0].email_address,
        dateOfBirth: result.rows[0].date_of_birth,
        age: result.rows[0].age,
        civilStatus: result.rows[0].civil_status,
        sex: result.rows[0].sex,
        currentLocation: result.rows[0].current_location,
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

// Update survey by ID
app.put('/api/survey/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const surveyData = req.body;
    
    if (useDatabase && pool) {
      const result = await pool.query(`
        UPDATE surveys SET
          name = $1, permanent_address = $2, mobile_number = $3, email_address = $4,
          date_of_birth = $5, age = $6, civil_status = $7, sex = $8, current_location = $9,
          course_graduated = $10, school_year_graduated = $11, max_academic_achievement = $12,
          trainings = $13, civil_service = $14, let_license = $15, other_prc_license = $16,
          professional_organizations = $17, is_employed = $18, employment_nature = $19,
          employment_classification = $20, job_title = $21, place_of_work = $22,
          monthly_income = $23, additional_revenue_sources = $24, ratings = $25,
          is_alumni = $26, interested_alumni = $27, school_rating = $28, system_rating = $29,
          school_feedback = $30, system_feedback = $31
        WHERE id = $32
        RETURNING *
      `, [
        surveyData.name,
        surveyData.permanentAddress || null,
        surveyData.mobileNumber || null,
        surveyData.emailAddress,
        surveyData.dateOfBirth || null,
        surveyData.age ? parseInt(surveyData.age) : null,
        surveyData.civilStatus || null,
        surveyData.sex || null,
        surveyData.currentLocation || null,
        surveyData.courseGraduated || null,
        surveyData.schoolYearGraduated,
        surveyData.maxAcademicAchievement || null,
        JSON.stringify(surveyData.trainings || []),
        surveyData.civilService || null,
        surveyData.letLicense || null,
        surveyData.otherPRCLicense || null,
        surveyData.professionalOrganizations || null,
        surveyData.isEmployed || null,
        surveyData.employmentNature || null,
        surveyData.employmentClassification || null,
        surveyData.jobTitle || null,
        surveyData.placeOfWork || null,
        surveyData.monthlyIncome || null,
        surveyData.additionalRevenueSources || null,
        JSON.stringify(surveyData.ratings || {}),
        surveyData.isAlumni || null,
        surveyData.interestedAlumni || null,
        surveyData.schoolRating || null,
        surveyData.systemRating || null,
        surveyData.schoolFeedback || null,
        surveyData.systemFeedback || null,
        id
      ]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Survey not found' });
      }
      
      // Convert snake_case to camelCase for response
      const updatedSurvey = {
        id: result.rows[0].id,
        name: result.rows[0].name,
        permanentAddress: result.rows[0].permanent_address,
        mobileNumber: result.rows[0].mobile_number,
        emailAddress: result.rows[0].email_address,
        dateOfBirth: result.rows[0].date_of_birth,
        age: result.rows[0].age,
        civilStatus: result.rows[0].civil_status,
        sex: result.rows[0].sex,
        currentLocation: result.rows[0].current_location,
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
        createdAt: result.rows[0].created_at
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

// Delete survey
app.delete('/api/surveys/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (useDatabase && pool) {
      // First, get the survey to find associated email
      const surveyResult = await pool.query('SELECT email_address FROM surveys WHERE id = $1', [id]);
      
      if (surveyResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Survey not found' });
      }

      const email = surveyResult.rows[0].email_address;

      // Delete the survey (this will also cascade to users table due to ON DELETE SET NULL)
      const deleteResult = await pool.query('DELETE FROM surveys WHERE id = $1 RETURNING *', [id]);
      
      if (deleteResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Survey not found' });
      }

      // Also delete the user account associated with this survey (optional - you can keep users even if survey is deleted)
      // Uncomment the next lines if you want to delete user accounts when survey is deleted
      // if (email) {
      //   await pool.query('DELETE FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      // }

      console.log(`✅ Survey ${id} deleted successfully (email: ${email})`);
      
      res.json({
        success: true,
        message: 'Survey and associated feedback deleted successfully',
        data: deleteResult.rows[0]
      });
    } else {
      // Fallback to in-memory
      const surveyIndex = surveys.findIndex(s => s.id === id);
      if (surveyIndex === -1) {
        return res.status(404).json({ success: false, message: 'Survey not found' });
      }
      const deletedSurvey = surveys.splice(surveyIndex, 1)[0];
      res.json({
        success: true,
        message: 'Survey deleted successfully',
        data: deletedSurvey
      });
    }
  } catch (error) {
    console.error('Error deleting survey:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Provide more detailed error message
    let errorMessage = 'Error deleting survey';
    if (error.code === '23503') {
      errorMessage = 'Cannot delete survey: It is referenced by other records';
    } else if (error.code === '23505') {
      errorMessage = 'Database constraint violation';
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

// Get statistics
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

      const furtherStudiesResult = await pool.query(`
        SELECT COUNT(*) as count FROM surveys WHERE employment_nature = 'Further Studies'
      `);
      const furtherStudies = parseInt(furtherStudiesResult.rows[0].count);

      const stats = {
        totalGraduates,
        employed,
        selfEmployed,
        unemployed,
        furtherStudies
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
        furtherStudies: surveys.filter(s => s.employmentNature === 'Further Studies').length
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
      furtherStudies: surveys.filter(s => s.employmentNature === 'Further Studies').length
    };
    res.json({ success: true, data: stats });
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
