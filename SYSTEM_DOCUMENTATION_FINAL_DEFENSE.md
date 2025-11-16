# BSIT Graduate Tracer System
## Complete System Documentation for Final Defense

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [System Objectives](#2-system-objectives)
3. [System Features](#3-system-features)
4. [Technical Architecture](#4-technical-architecture)
5. [System Components](#5-system-components)
6. [User Roles and Access](#6-user-roles-and-access)
7. [Database Structure](#7-database-structure)
8. [API Endpoints](#8-api-endpoints)
9. [User Flows](#9-user-flows)
10. [Security Features](#10-security-features)
11. [Deployment Information](#11-deployment-information)
12. [System Screenshots and Features](#12-system-screenshots-and-features)
13. [Future Enhancements](#13-future-enhancements)

---

## 1. System Overview

### 1.1 Introduction

The **BSIT Graduate Tracer System** is a comprehensive web-based application designed to track and monitor Bachelor of Science in Information Technology (BSIT) graduates. The system enables educational institutions to collect, manage, and analyze data about their alumni's employment status, career progression, and feedback about their educational experience.

### 1.2 Purpose

The system serves multiple purposes:
- **Data Collection**: Gather comprehensive information from BSIT graduates through structured surveys
- **Employment Tracking**: Monitor graduates' employment status and career paths
- **Feedback Collection**: Collect ratings and feedback about the educational program and system usability
- **Data Analysis**: Provide statistical insights and visualizations for program improvement
- **Alumni Engagement**: Facilitate alumni registration and engagement initiatives

### 1.3 Target Users

1. **BSIT Graduates**: Alumni who complete surveys and provide feedback
2. **Administrators**: Authorized personnel who manage and view all survey data
3. **Public Users**: Visitors who can view statistics and feedback on the landing page

---

## 2. System Objectives

### 2.1 Primary Objectives

1. **Automate Data Collection**: Replace manual survey processes with an automated digital system
2. **Centralize Data Management**: Store all graduate information in a centralized database
3. **Provide Real-time Analytics**: Generate statistics and visualizations from collected data
4. **Ensure Data Security**: Implement secure authentication and data protection measures
5. **Improve User Experience**: Provide an intuitive and user-friendly interface

### 2.2 Secondary Objectives

1. **Alumni Engagement**: Encourage alumni participation through easy-to-use interface
2. **Program Evaluation**: Collect feedback to improve curriculum and teaching methods
3. **Employment Insights**: Track employment trends and success rates
4. **Data Export**: Enable data export for further analysis and reporting

---

## 3. System Features

### 3.1 Landing Page Features

#### 3.1.1 Hero Section
- **Welcome Message**: Clear introduction to the system
- **Call-to-Action Buttons**: 
  - "Start Survey Now" - Direct link to survey form
  - "View Dashboard" - Access to public statistics
  - "Access My Dashboard" - Login for personal dashboard

#### 3.1.2 Features Overview
- **Complete Survey**: Information about survey functionality
- **View Statistics**: Access to data visualizations
- **Admin Access**: Secure administrative panel

#### 3.1.3 Ratings Display
- **Overall Ratings Section**: 
  - School Experience Rating (1-5 stars)
  - System Experience Rating (1-5 stars)
  - Total number of ratings
- **Real-time Updates**: Ratings calculated from all submitted surveys

#### 3.1.4 Feedback Section
- **Scrolling Feedback Display**: 
  - Shows feedback from graduates
  - Auto-scrolling animation
  - Displays both school and system feedback
  - Star ratings for each feedback
- **Privacy Protection**: Names are masked for privacy

#### 3.1.5 Developers Section
- **Team Information**: 
  - Profile photos of all developers
  - Names and roles
  - Professional presentation

#### 3.1.6 Privacy Statement
- **Expandable Section**: 
  - Comprehensive privacy policy
  - Data Privacy Act compliance information
  - Data collection and usage policies
  - Participant rights

### 3.2 Survey Form Features

#### 3.2.1 Alumni Verification Modal
- **Pre-Survey Verification**: 
  - Asks if respondent is a BSIT graduate
  - Asks if interested in alumni activities
  - Ensures data quality

#### 3.2.2 Section A: Individual Information
- Name
- Permanent Address
- Mobile Number
- Email Address
- Date of Birth
- Age
- Civil Status
- Sex
- Current Location
- Course Graduated
- School Year Graduated

#### 3.2.3 Section B: Profile Education
- Maximum Academic Achievement
- Trainings Attended (Dynamic list with multiple entries)
  - Training Title
  - Duration
  - Trainer/Institution
- Civil Service Eligibility
- LET License
- Other PRC License
- Professional Organizations

#### 3.2.4 Section C: Employment Experiences
- Employment Status (Yes/No)
- Employment Nature:
  - Government Sector
  - Private Sector
  - Self-Employed
  - Not Currently Employed
  - Further Studies
- Employment Classification
- Job Title
- Place of Work
- Monthly Income
- Additional Revenue Sources

#### 3.2.5 Section D: After Study Status - Ratings
- **Job Placement Ratings** (1-5 scale):
  - Relevance of education to current job
  - Job satisfaction
  - Career advancement opportunities
  - Overall job placement experience

- **IT Field Competency Ratings**:
  - Technical skills acquired
  - Problem-solving abilities
  - Industry readiness
  - Professional development

- **Competitive Edge Ratings**:
  - Market competitiveness
  - Skill differentiation
  - Career opportunities
  - Professional growth

- **Workplace Environment Ratings**:
  - Work-life balance
  - Team collaboration
  - Professional support
  - Career satisfaction

#### 3.2.6 Section E: Alumni Status & Feedback
- Alumni Status Confirmation
- Interest in Alumni Activities
- **School Experience Rating** (1-5 stars)
- **School Feedback** (Text area)
- **System Experience Rating** (1-5 stars)
- **System Feedback** (Text area)

#### 3.2.7 Account Creation
- **Optional Account Creation**:
  - Create account during survey submission
  - Password setup
  - Enables future access to personal dashboard
  - Edit survey responses later

#### 3.2.8 Form Validation
- Required field validation
- Email format validation
- Duplicate submission prevention
- Real-time error messages

### 3.3 Dashboard Features (Public)

#### 3.3.1 Statistics Overview
- **Total Graduates**: Count of all survey respondents
- **Employment Statistics**:
  - Employed (Government + Private)
  - Self-Employed
  - Unemployed
  - Further Studies

#### 3.3.2 Data Visualizations
- **Employment Status Pie Chart**: Visual breakdown of employment status
- **Monthly Income Bar Chart**: Distribution of income ranges
- **Course Distribution Chart**: Breakdown by course specialization
- **Graduation Year Line Chart**: Trends over time
- **Average Ratings Charts**: 
  - Job Placement ratings
  - IT Field Competency ratings
  - Competitive Edge ratings
  - Workplace Environment ratings

#### 3.3.3 Recent Surveys
- **Latest 5 Survey Responses**: 
  - Name, course, year graduated
  - Employment status
  - Quick overview

### 3.4 Admin Panel Features

#### 3.4.1 Authentication
- **Gmail OTP Authentication**:
  - Email-based login
  - One-Time Password (OTP) sent via email
  - Secure admin access
  - Session management

#### 3.4.2 Survey Management
- **Complete Survey List**: 
  - All submitted surveys in table format
  - Comprehensive data display
  - Sortable columns
  - Searchable entries

#### 3.4.3 Search and Filter
- **Search Functionality**:
  - Search by name
  - Search by email
  - Real-time filtering

- **Filter Options**:
  - Filter by employment status
  - Filter by gender
  - Filter by graduation year

#### 3.4.4 Sorting Options
- Sort by graduation year
- Sort by name (alphabetical)
- Sort by gender

#### 3.4.5 Data Display
- **Detailed Information**:
  - Personal information
  - Educational background
  - Employment details
  - Ratings and feedback
  - All survey responses

#### 3.4.6 Data Management
- **Delete Functionality**:
  - Remove survey entries
  - Delete associated user accounts
  - Data cleanup

#### 3.4.7 Statistics Display
- Total number of surveys
- Filtered count
- Real-time updates

### 3.5 Personal Dashboard Features

#### 3.5.1 User Authentication
- **Registration**: 
  - Email and password registration
  - Account creation
  - Survey linking

- **Login**:
  - Email and password authentication
  - OTP verification
  - Secure session management

#### 3.5.2 Survey Viewing
- **View Own Survey**: 
  - Display all submitted information
  - Read-only view
  - Complete data display

#### 3.5.3 Survey Editing
- **Update Survey**:
  - Edit all survey fields
  - Update employment status
  - Modify feedback
  - Save changes

#### 3.5.4 Account Management
- Email-based access
- Password-protected
- Survey association

### 3.6 User Login Features

#### 3.6.1 Registration
- Email and password registration
- Password confirmation
- Validation checks
- Account creation

#### 3.6.2 Login
- Email and password login
- OTP email verification
- Secure authentication
- Session management

---

## 4. Technical Architecture

### 4.1 System Architecture

The system follows a **3-tier architecture**:

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│         (React Frontend)                │
│  - Landing Page                         │
│  - Survey Form                          │
│  - Dashboard                            │
│  - Admin Panel                          │
│  - Personal Dashboard                   │
└─────────────────────────────────────────┘
                  ↕ HTTP/REST API
┌─────────────────────────────────────────┐
│         APPLICATION LAYER               │
│         (Node.js/Express Backend)       │
│  - RESTful API Endpoints                │
│  - Business Logic                       │
│  - Authentication                       │
│  - Data Validation                      │
└─────────────────────────────────────────┘
                  ↕ SQL Queries
┌─────────────────────────────────────────┐
│         DATA LAYER                      │
│         (PostgreSQL Database)           │
│  - Surveys Table                        │
│  - Users Table                          │
│  - Data Persistence                     │
└─────────────────────────────────────────┘
```

### 4.2 Technology Stack

#### 4.2.1 Frontend Technologies
- **React.js** (v18+): Modern JavaScript library for building user interfaces
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **Recharts**: Charting library for data visualization
- **CSS3**: Styling and responsive design

#### 4.2.2 Backend Technologies
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database management system
- **Nodemailer**: Email sending library for OTP
- **CORS**: Cross-Origin Resource Sharing middleware

#### 4.2.3 Development Tools
- **Git**: Version control
- **GitHub**: Code repository
- **Railway**: Cloud hosting platform
- **NPM**: Package management

### 4.3 System Flow

```
User Request → React Frontend → Express API → PostgreSQL Database
                ↕                    ↕
            Response ← JSON Data ← Query Results
```

---

## 5. System Components

### 5.1 Frontend Components

#### 5.1.1 LandingPage.js
- **Purpose**: Main entry point for visitors
- **Features**: 
  - Hero section
  - Features overview
  - Ratings display
  - Feedback scrolling
  - Developers section
  - Privacy statement

#### 5.1.2 SurveyPage.js
- **Purpose**: Survey form for graduates
- **Features**:
  - Multi-section form
  - Dynamic fields
  - Validation
  - Account creation option
  - Submission handling

#### 5.1.3 DashboardPage.js
- **Purpose**: Public statistics dashboard
- **Features**:
  - Statistics display
  - Charts and graphs
  - Recent surveys
  - Data visualizations

#### 5.1.4 AdminPage.js
- **Purpose**: Administrative panel
- **Features**:
  - OTP authentication
  - Survey management
  - Search and filter
  - Data display
  - Delete functionality

#### 5.1.5 PersonalDashboard.js
- **Purpose**: User's personal survey view/edit
- **Features**:
  - Survey viewing
  - Survey editing
  - Account management

#### 5.1.6 UserLogin.js
- **Purpose**: User authentication
- **Features**:
  - Registration
  - Login
  - OTP verification

### 5.2 Backend Components

#### 5.2.1 server/index.js
- **Purpose**: Main server file
- **Features**:
  - Express server setup
  - API route definitions
  - Middleware configuration
  - Static file serving
  - Error handling

#### 5.2.2 server/database.js
- **Purpose**: Database connection and initialization
- **Features**:
  - PostgreSQL connection pool
  - Table creation
  - Database initialization
  - Connection management

#### 5.2.3 server/auth.js
- **Purpose**: Authentication utilities
- **Features**:
  - OTP generation
  - OTP verification
  - Email sending
  - Session management

### 5.3 Utility Components

#### 5.3.1 utils/helpers.js
- **Purpose**: Helper functions
- **Features**:
  - Name masking for privacy
  - Star rating component
  - Data formatting utilities

---

## 6. User Roles and Access

### 6.1 Public Users
- **Access Level**: Read-only
- **Permissions**:
  - View landing page
  - View public dashboard
  - View statistics
  - View feedback
  - Submit survey

### 6.2 Survey Respondents
- **Access Level**: Limited
- **Permissions**:
  - Submit survey
  - Create account
  - View own survey
  - Edit own survey
  - Login to personal dashboard

### 6.3 Administrators
- **Access Level**: Full
- **Permissions**:
  - View all surveys
  - Search and filter data
  - Delete surveys
  - View statistics
  - Manage data
  - OTP authentication required

---

## 7. Database Structure

### 7.1 Surveys Table

```sql
CREATE TABLE surveys (
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
);
```

**Key Fields**:
- `id`: Primary key, auto-increment
- `email_address`: Unique identifier for respondents
- `trainings`: JSON array of training objects
- `ratings`: JSON object containing all rating sections
- `school_rating`, `system_rating`: Integer ratings (1-5)
- `created_at`, `updated_at`: Timestamps

### 7.2 Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    survey_id INTEGER REFERENCES surveys(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Key Fields**:
- `id`: Primary key
- `email`: Unique email address
- `password`: Hashed password (SHA-256)
- `survey_id`: Foreign key to surveys table
- Index on email for fast lookups

### 7.3 Relationships

- **One-to-One**: User → Survey (via survey_id)
- **One-to-Many**: Email → Surveys (one email can have multiple surveys, but only latest is linked)

---

## 8. API Endpoints

### 8.1 Public Endpoints

#### GET `/api/health`
- **Purpose**: Server health check
- **Response**: Server status and timestamp

#### GET `/api/feedbacks`
- **Purpose**: Get feedbacks and ratings for landing page
- **Response**: 
  - List of feedbacks
  - Average ratings
  - Total rating count

#### GET `/api/surveys`
- **Purpose**: Get all surveys (Admin only)
- **Response**: Array of survey objects

#### GET `/api/stats`
- **Purpose**: Get statistics
- **Response**: 
  - Total graduates
  - Employment statistics
  - Breakdown by status

### 8.2 Survey Endpoints

#### POST `/api/survey`
- **Purpose**: Submit new survey
- **Request Body**: Complete survey data
- **Response**: Created survey object

#### GET `/api/survey/:id`
- **Purpose**: Get survey by ID
- **Response**: Survey object

#### GET `/api/survey/email/:email`
- **Purpose**: Get survey by email
- **Response**: Survey object

#### PUT `/api/survey/:id`
- **Purpose**: Update survey
- **Request Body**: Updated survey data
- **Response**: Updated survey object

#### DELETE `/api/surveys/:id`
- **Purpose**: Delete survey
- **Response**: Success message

### 8.3 Authentication Endpoints

#### POST `/api/admin/send-otp`
- **Purpose**: Send OTP to admin email
- **Request Body**: `{ email: "admin@email.com" }`
- **Response**: Success message

#### POST `/api/admin/verify-otp`
- **Purpose**: Verify admin OTP
- **Request Body**: `{ email: "admin@email.com", otp: "123456" }`
- **Response**: Authentication token

#### POST `/api/user/register`
- **Purpose**: Register new user
- **Request Body**: `{ email: "user@email.com", password: "password" }`
- **Response**: User ID and success message

#### POST `/api/user/login`
- **Purpose**: User login (send OTP)
- **Request Body**: `{ email: "user@email.com", password: "password" }`
- **Response**: Success message

#### POST `/api/user/verify-otp`
- **Purpose**: Verify user OTP
- **Request Body**: `{ email: "user@email.com", otp: "123456" }`
- **Response**: Authentication token and user info

---

## 9. User Flows

### 9.1 Survey Submission Flow

```
1. User visits Landing Page
   ↓
2. Clicks "Start Survey Now"
   ↓
3. Alumni Verification Modal appears
   ↓
4. User confirms alumni status
   ↓
5. Survey form loads
   ↓
6. User fills out all sections:
   - Individual Information
   - Profile Education
   - Employment Experiences
   - Ratings
   - Feedback
   ↓
7. User optionally creates account
   ↓
8. User submits survey
   ↓
9. System validates data
   ↓
10. Survey saved to database
   ↓
11. Success message displayed
   ↓
12. User redirected to landing page
```

### 9.2 Admin Login Flow

```
1. Admin visits Admin Page
   ↓
2. Admin enters email (pre-filled)
   ↓
3. Admin clicks "Send OTP"
   ↓
4. System sends OTP to email
   ↓
5. Admin receives OTP email
   ↓
6. Admin enters OTP
   ↓
7. Admin clicks "Verify OTP"
   ↓
8. System verifies OTP
   ↓
9. Admin authenticated
   ↓
10. Admin panel loads
   ↓
11. Admin can view, search, filter, delete surveys
```

### 9.3 User Dashboard Access Flow

```
1. User visits Login Page
   ↓
2. User registers (if new) OR logs in (if existing)
   ↓
3. User enters email and password
   ↓
4. System sends OTP to email
   ↓
5. User receives OTP email
   ↓
6. User enters OTP
   ↓
7. System verifies OTP
   ↓
8. User authenticated
   ↓
9. Personal Dashboard loads
   ↓
10. User can view/edit own survey
```

### 9.4 Public Dashboard Flow

```
1. User visits Landing Page
   ↓
2. User clicks "View Dashboard"
   ↓
3. Dashboard page loads
   ↓
4. System fetches statistics
   ↓
5. Charts and graphs render
   ↓
6. User can view:
   - Employment statistics
   - Income distribution
   - Course breakdown
   - Graduation trends
   - Average ratings
```

---

## 10. Security Features

### 10.1 Authentication Security

#### 10.1.1 OTP (One-Time Password)
- **Purpose**: Two-factor authentication
- **Implementation**: 
  - 6-digit random OTP
  - Sent via email
  - Expires after use
  - Time-limited validity

#### 10.1.2 Password Hashing
- **Algorithm**: SHA-256
- **Purpose**: Secure password storage
- **Implementation**: Passwords hashed before database storage

#### 10.1.3 Email Verification
- **Purpose**: Verify user identity
- **Implementation**: OTP sent to registered email

### 10.2 Data Security

#### 10.2.1 Input Validation
- **Server-side validation**: All inputs validated on backend
- **SQL Injection Prevention**: Parameterized queries
- **XSS Prevention**: Input sanitization

#### 10.2.2 Privacy Protection
- **Name Masking**: Names masked in public feedback
- **Email Protection**: Emails not exposed in public views
- **Data Access Control**: Role-based access

#### 10.2.3 HTTPS/SSL
- **Encryption**: All data transmitted over HTTPS
- **SSL Certificate**: Railway provides SSL certificates

### 10.3 Access Control

#### 10.3.1 Admin Access
- **Email Restriction**: Only authorized admin email allowed
- **OTP Required**: Two-factor authentication mandatory
- **Session Management**: Token-based sessions

#### 10.3.2 User Access
- **Account-based**: Users can only access own data
- **Email Verification**: OTP verification required
- **Password Protection**: Secure password requirements

---

## 11. Deployment Information

### 11.1 Hosting Platform

**Railway.app**
- **Type**: Cloud Platform as a Service (PaaS)
- **Database**: PostgreSQL (Railway managed)
- **URL**: `https://dwcsjgraduatetracer.it.com`
- **Custom Domain**: Configured with DNS

### 11.2 Deployment Process

1. **Code Repository**: GitHub
2. **Continuous Deployment**: Automatic on git push
3. **Build Process**: 
   - Install dependencies
   - Build React app
   - Start Node.js server
4. **Environment Variables**: Configured in Railway dashboard

### 11.3 Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `GMAIL_USER`: Gmail account for OTP
- `GMAIL_APP_PASSWORD`: Gmail app password
- `NODE_ENV`: Production/Development mode
- `PORT`: Server port (auto-assigned by Railway)

### 11.4 Database Configuration

- **Type**: PostgreSQL
- **Hosting**: Railway managed database
- **Connection**: SSL-enabled
- **Backup**: Automatic backups by Railway
- **Scaling**: Auto-scaling based on usage

---

## 12. System Screenshots and Features

### 12.1 Landing Page
- **Hero Section**: Welcome message and call-to-action buttons
- **Features Section**: Three main features highlighted
- **Ratings Section**: Overall ratings display with stars
- **Feedback Section**: Scrolling feedback cards
- **Developers Section**: Team member profiles with photos
- **Privacy Statement**: Expandable privacy policy

### 12.2 Survey Form
- **Multi-section Form**: Organized into logical sections
- **Dynamic Fields**: Add/remove training entries
- **Validation**: Real-time form validation
- **Progress Indication**: Clear section navigation
- **Account Creation**: Optional account setup

### 12.3 Public Dashboard
- **Statistics Cards**: Key metrics displayed
- **Charts**: Multiple chart types (Pie, Bar, Line)
- **Responsive Design**: Works on all devices
- **Recent Surveys**: Latest submissions displayed

### 12.4 Admin Panel
- **Login Interface**: OTP authentication
- **Data Table**: Comprehensive survey listing
- **Search Bar**: Quick search functionality
- **Filters**: Multiple filter options
- **Sort Options**: Sort by various fields
- **Delete Function**: Remove surveys

### 12.5 Personal Dashboard
- **Survey Display**: Complete survey view
- **Edit Mode**: Update survey information
- **Save Functionality**: Persist changes
- **Account Management**: User account controls

---

## 13. Future Enhancements

### 13.1 Planned Features

1. **Data Export**
   - Export to Excel/CSV
   - PDF report generation
   - Custom report builder

2. **Advanced Analytics**
   - Trend analysis
   - Predictive analytics
   - Comparative analysis

3. **Email Notifications**
   - Survey reminders
   - Update notifications
   - Newsletter functionality

4. **Mobile Application**
   - Native mobile app
   - Push notifications
   - Offline capability

5. **Enhanced Security**
   - JWT tokens
   - Role-based permissions
   - Audit logging

6. **Social Features**
   - Alumni directory
   - Networking features
   - Event management

7. **Integration**
   - LMS integration
   - CRM integration
   - Third-party analytics

### 13.2 Technical Improvements

1. **Performance Optimization**
   - Caching mechanisms
   - Database indexing
   - CDN integration

2. **Scalability**
   - Load balancing
   - Database sharding
   - Microservices architecture

3. **Testing**
   - Unit tests
   - Integration tests
   - End-to-end tests

4. **Documentation**
   - API documentation
   - User manuals
   - Developer guides

---

## Conclusion

The BSIT Graduate Tracer System is a comprehensive solution for tracking and monitoring BSIT graduates. It provides a user-friendly interface for data collection, secure authentication for administrators, and powerful analytics for decision-making. The system is built with modern web technologies, follows best practices for security and data protection, and is deployed on a reliable cloud platform.

The system successfully addresses the need for automated graduate tracking, provides valuable insights through data visualization, and maintains high standards for data privacy and security. With its modular architecture and scalable design, the system can be easily extended with additional features in the future.

---

## System Developers

1. **John Paul Dequilla** - Developer
2. **Marc Paul Adarlo** - Developer
3. **Arben Antonio** - Developer
4. **Angel Bert Guiral** - Developer
5. **Lucky Arielle Lim** - Developer

---

## Contact Information

**System URL**: https://dwcsjgraduatetracer.it.com

**Admin Email**: johnpauld750@gmail.com

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Prepared for**: Final Defense Presentation

---

*This documentation provides a comprehensive overview of the BSIT Graduate Tracer System. For technical details, please refer to the source code and API documentation.*

