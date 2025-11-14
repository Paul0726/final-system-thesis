const { Pool } = require('pg');
require('dotenv').config();

let pool = null;

// Only create pool if DATABASE_URL is available
if (process.env.DATABASE_URL) {
  try {
    // Create connection pool
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Test connection
    pool.on('connect', () => {
      console.log('✅ Connected to PostgreSQL database');
    });

    pool.on('error', (err) => {
      console.error('❌ Database connection error:', err);
      // Don't crash on connection errors
    });

    // Initialize database tables
    const initializeDatabase = async () => {
      try {
        // Test connection first
        await pool.query('SELECT NOW()');
        
        // Create surveys table
        await pool.query(`
          CREATE TABLE IF NOT EXISTS surveys (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            permanent_address TEXT,
            mobile_number VARCHAR(50),
            email_address VARCHAR(255) NOT NULL,
            date_of_birth DATE,
            age INTEGER,
            civil_status VARCHAR(50),
            sex VARCHAR(10),
            current_location TEXT,
            course_graduated VARCHAR(255),
            school_year_graduated VARCHAR(10),
            max_academic_achievement TEXT,
            trainings JSONB,
            civil_service VARCHAR(50),
            let_license VARCHAR(255),
            other_prc_license VARCHAR(255),
            professional_organizations TEXT,
            is_employed VARCHAR(10),
            employment_nature VARCHAR(100),
            employment_classification VARCHAR(100),
            job_title VARCHAR(255),
            place_of_work VARCHAR(50),
            monthly_income VARCHAR(100),
            additional_revenue_sources TEXT,
            ratings JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        console.log('✅ Database tables initialized');
      } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        // Set pool to null if initialization fails
        pool = null;
      }
    };

    // Initialize on startup (non-blocking)
    initializeDatabase().catch(err => {
      console.error('❌ Failed to initialize database:', err.message);
      pool = null;
    });
  } catch (error) {
    console.error('❌ Failed to create database pool:', error.message);
    pool = null;
  }
} else {
  console.log('⚠️ DATABASE_URL not found, database features disabled');
}

module.exports = pool;

