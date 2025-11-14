const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// Get all surveys
app.get('/api/surveys', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM surveys ORDER BY created_at DESC');
    res.json({
      success: true,
      message: 'Surveys retrieved successfully',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ success: false, message: 'Error fetching surveys' });
  }
});

// Get single survey
app.get('/api/surveys/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query('SELECT * FROM surveys WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
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

    const result = await pool.query(`
      INSERT INTO surveys (
        name, permanent_address, mobile_number, email_address, date_of_birth, age,
        civil_status, sex, current_location, course_graduated, school_year_graduated,
        max_academic_achievement, trainings, civil_service, let_license, other_prc_license,
        professional_organizations, is_employed, employment_nature, employment_classification,
        job_title, place_of_work, monthly_income, additional_revenue_sources, ratings
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
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
      JSON.stringify(surveyData.ratings || {})
    ]);

    res.json({
      success: true,
      message: 'Survey submitted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ success: false, message: 'Error creating survey' });
  }
});

// Delete survey
app.delete('/api/surveys/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query('DELETE FROM surveys WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Survey not found' });
    }

    res.json({
      success: true,
      message: 'Survey deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting survey:', error);
    res.status(500).json({ success: false, message: 'Error deleting survey' });
  }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching statistics' });
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
  console.log(`💾 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});
