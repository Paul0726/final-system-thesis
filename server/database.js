const { Pool } = require('pg');
require('dotenv').config();

let pool = null;

// Only create pool if DATABASE_URL is available
if (process.env.DATABASE_URL) {
  try {
    // Fix DATABASE_URL if it uses internal hostname
    let databaseUrl = process.env.DATABASE_URL;
    
    // Replace internal hostname with public if needed
    if (databaseUrl.includes('postgres.railway.internal')) {
      // Try to extract connection details and use public hostname
      // This is a fallback - ideally use public connection string from Railway
      console.log('⚠️ Using internal hostname, may need public connection string');
    }
    
    // Create connection pool
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 10000, // 10 seconds timeout
      idleTimeoutMillis: 30000,
      max: 20 // Maximum number of clients in the pool
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
        // Wait a bit for database to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test connection first with retry
        let retries = 3;
        let connected = false;
        
        while (retries > 0 && !connected) {
          try {
            await pool.query('SELECT NOW()');
            connected = true;
            console.log('✅ Database connection successful');
          } catch (err) {
            retries--;
            if (retries > 0) {
              console.log(`⏳ Retrying database connection... (${retries} attempts left)`);
              await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
              throw err;
            }
          }
        }
        
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
            is_alumni VARCHAR(10),
            interested_alumni VARCHAR(10),
            school_rating INTEGER,
            system_rating INTEGER,
            school_feedback TEXT,
            system_feedback TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Add new columns if they don't exist (for existing tables)
        try {
          await pool.query(`ALTER TABLE surveys ADD COLUMN IF NOT EXISTS is_alumni VARCHAR(10)`);
          await pool.query(`ALTER TABLE surveys ADD COLUMN IF NOT EXISTS interested_alumni VARCHAR(10)`);
          await pool.query(`ALTER TABLE surveys ADD COLUMN IF NOT EXISTS school_rating INTEGER`);
          await pool.query(`ALTER TABLE surveys ADD COLUMN IF NOT EXISTS system_rating INTEGER`);
          await pool.query(`ALTER TABLE surveys ADD COLUMN IF NOT EXISTS school_feedback TEXT`);
          await pool.query(`ALTER TABLE surveys ADD COLUMN IF NOT EXISTS system_feedback TEXT`);
        } catch (err) {
          // Columns might already exist, ignore error
        }

        console.log('✅ Database tables initialized');
      } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        console.log('⚠️ Will retry on first database query');
        // Don't set pool to null - let it retry on first use
      }
    };

    // Initialize on startup (non-blocking, with delay)
    setTimeout(() => {
      initializeDatabase().catch(err => {
        console.error('❌ Failed to initialize database:', err.message);
        console.log('⚠️ Database will be available on first query');
      });
    }, 1000);
  } catch (error) {
    console.error('❌ Failed to create database pool:', error.message);
    pool = null;
  }
} else {
  console.log('⚠️ DATABASE_URL not found, database features disabled');
}

module.exports = pool;

