# BSIT Graduate Tracer System
## System Documentation for Final Defense

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [System Objectives](#2-system-objectives)
3. [Key Features](#3-key-features)
4. [Technical Architecture](#4-technical-architecture)
5. [Database Structure](#5-database-structure)
6. [User Roles](#6-user-roles)
7. [Security Features](#7-security-features)
8. [Deployment](#8-deployment)

---

## 1. System Overview

### 1.1 Introduction

The **BSIT Graduate Tracer System** is a web-based application designed to track and monitor Bachelor of Science in Information Technology (BSIT) graduates. The system enables educational institutions to collect, manage, and analyze data about alumni's employment status, career progression, and feedback.

### 1.2 Purpose

- **Data Collection**: Gather comprehensive information from BSIT graduates through structured surveys
- **Employment Tracking**: Monitor graduates' employment status and career paths
- **Feedback Collection**: Collect ratings and feedback about educational program and system usability
- **Data Analysis**: Provide statistical insights and visualizations for program improvement
- **Alumni Engagement**: Facilitate alumni registration and engagement initiatives

### 1.3 Target Users

1. **BSIT Graduates**: Alumni who complete surveys and provide feedback
2. **Administrators**: Authorized personnel who manage and view all survey data
3. **Public Users**: Visitors who can view statistics and feedback

---

## 2. System Objectives

### 2.1 Primary Objectives

1. Automate data collection process
2. Centralize data management in a secure database
3. Provide real-time analytics and visualizations
4. Ensure data security with authentication and encryption
5. Improve user experience with intuitive interface

### 2.2 Secondary Objectives

1. Encourage alumni participation
2. Collect feedback for curriculum improvement
3. Track employment trends and success rates
4. Enable data export for reporting

---

## 3. Key Features

### 3.1 Landing Page

- **Hero Section**: Welcome message with call-to-action buttons
- **Features Overview**: Three main features (Survey, Statistics, Admin)
- **Ratings Display**: Overall school and system ratings (1-5 stars)
- **Feedback Section**: Scrolling feedback cards from graduates
- **Developers Section**: Team member profiles with photos
- **Privacy Statement**: Comprehensive privacy policy

### 3.2 Survey Form

**Section A: Individual Information**
- Personal details (name, address, contact, email, DOB, age, civil status, sex, location)
- Educational background (course, graduation year)

**Section B: Profile Education**
- Academic achievements, trainings, licenses (LET, PRC), professional organizations

**Section C: Employment Experiences**
- Employment status, nature (Government/Private/Self-Employed/Unemployed/Further Studies)
- Job details (title, place of work, income, additional revenue)

**Section D: After Study Status - Ratings (1-5 scale)**
- Job Placement ratings
- IT Field Competency ratings
- Competitive Edge ratings
- Workplace Environment ratings

**Section E: Alumni Status & Feedback**
- Alumni status confirmation
- School Experience Rating & Feedback (1-5 stars)
- System Experience Rating & Feedback (1-5 stars)
- Optional account creation for future access

**Features:**
- Alumni verification modal before survey
- Dynamic training entries (add/remove)
- Form validation
- Duplicate submission prevention

### 3.3 Public Dashboard

- **Statistics Overview**: Total graduates, employment breakdown (Employed, Self-Employed, Unemployed, Further Studies)
- **Data Visualizations**:
  - Employment Status Pie Chart
  - Monthly Income Bar Chart
  - Course Distribution Chart
  - Graduation Year Line Chart
  - Average Ratings Charts (4 categories)
- **Recent Surveys**: Latest 5 survey responses

### 3.4 Admin Panel

- **Gmail OTP Authentication**: Secure two-factor authentication
- **Survey Management**: Complete list of all surveys in table format
- **Search & Filter**: Search by name/email, filter by status/gender/year
- **Sorting**: Sort by graduation year, name, or gender
- **Data Display**: Comprehensive survey information display
- **Delete Functionality**: Remove surveys and associated accounts

### 3.5 Personal Dashboard

- **User Authentication**: Registration and login with OTP verification
- **Survey Viewing**: View own submitted survey
- **Survey Editing**: Update survey information
- **Account Management**: Email-based access with password protection

### 3.6 User Login

- **Registration**: Email and password registration
- **Login**: Email/password + OTP verification
- **Session Management**: Secure token-based sessions

---

## 4. Technical Architecture

### 4.1 System Architecture

**3-Tier Architecture:**
```
Presentation Layer (React Frontend)
    ↕ HTTP/REST API
Application Layer (Node.js/Express Backend)
    ↕ SQL Queries
Data Layer (PostgreSQL Database)
```

### 4.2 Technology Stack

**Frontend:**
- React.js (v18+)
- React Router
- Axios (HTTP client)
- Recharts (Data visualization)
- CSS3 (Responsive design)

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- Nodemailer (Email/OTP)
- CORS middleware

**Deployment:**
- Railway (Cloud hosting)
- GitHub (Version control)
- PostgreSQL (Railway managed database)

### 4.3 System Flow

```
User Request → React Frontend → Express API → PostgreSQL Database
                ↕                    ↕
            Response ← JSON Data ← Query Results
```

---

## 5. Database Structure

### 5.1 Surveys Table

**Key Fields:**
- `id` (Primary Key)
- `name`, `email_address`, `mobile_number`
- `date_of_birth`, `age`, `civil_status`, `sex`
- `course_graduated`, `school_year_graduated`
- `max_academic_achievement`
- `trainings` (JSONB - array of training objects)
- `civil_service`, `let_license`, `other_prc_license`
- `professional_organizations`
- `is_employed`, `employment_nature`, `employment_classification`
- `job_title`, `place_of_work`, `monthly_income`
- `additional_revenue_sources`
- `ratings` (JSONB - object with 4 rating sections)
- `is_alumni`, `interested_alumni`
- `school_rating`, `system_rating` (Integer 1-5)
- `school_feedback`, `system_feedback` (Text)
- `created_at`, `updated_at` (Timestamps)

### 5.2 Users Table

**Key Fields:**
- `id` (Primary Key)
- `email` (Unique)
- `password` (SHA-256 hashed)
- `survey_id` (Foreign Key to surveys)
- `created_at`, `updated_at` (Timestamps)

### 5.3 Relationships

- **One-to-One**: User → Survey (via survey_id)
- **One-to-Many**: Email → Surveys (latest linked to user account)

---

## 6. User Roles

### 6.1 Public Users
- **Access**: Read-only
- **Permissions**: View landing page, dashboard, statistics, submit survey

### 6.2 Survey Respondents
- **Access**: Limited
- **Permissions**: Submit survey, create account, view/edit own survey, access personal dashboard

### 6.3 Administrators
- **Access**: Full
- **Permissions**: View all surveys, search/filter/delete data, manage all information
- **Authentication**: Gmail OTP required

---

## 7. Security Features

### 7.1 Authentication Security

- **OTP (One-Time Password)**: 6-digit random code sent via email, expires after use
- **Password Hashing**: SHA-256 algorithm for secure password storage
- **Email Verification**: OTP sent to registered email for identity verification

### 7.2 Data Security

- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Prevention**: Input sanitization
- **Privacy Protection**: Names masked in public feedback, emails protected
- **HTTPS/SSL**: All data transmitted over encrypted HTTPS connection

### 7.3 Access Control

- **Admin Access**: Email restriction + OTP authentication
- **User Access**: Account-based, email verification required
- **Session Management**: Token-based sessions

---

## 8. Deployment

### 8.1 Hosting Platform

- **Platform**: Railway.app (Cloud PaaS)
- **Database**: PostgreSQL (Railway managed)
- **URL**: https://dwcsjgraduatetracer.it.com
- **Custom Domain**: Configured with DNS

### 8.2 Deployment Process

1. Code repository: GitHub
2. Continuous deployment: Automatic on git push
3. Build process: Install dependencies → Build React app → Start server
4. Environment variables: Configured in Railway dashboard

### 8.3 Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `GMAIL_USER`: Gmail account for OTP
- `GMAIL_APP_PASSWORD`: Gmail app password
- `NODE_ENV`: Production/Development mode
- `PORT`: Server port (auto-assigned)

### 8.4 Database Configuration

- **Type**: PostgreSQL
- **Hosting**: Railway managed
- **Connection**: SSL-enabled
- **Backup**: Automatic backups
- **Scaling**: Auto-scaling based on usage

---

## API Endpoints Summary

### Public Endpoints
- `GET /api/health` - Server health check
- `GET /api/feedbacks` - Get feedbacks and ratings
- `GET /api/surveys` - Get all surveys (Admin)
- `GET /api/stats` - Get statistics

### Survey Endpoints
- `POST /api/survey` - Submit new survey
- `GET /api/survey/:id` - Get survey by ID
- `GET /api/survey/email/:email` - Get survey by email
- `PUT /api/survey/:id` - Update survey
- `DELETE /api/surveys/:id` - Delete survey

### Authentication Endpoints
- `POST /api/admin/send-otp` - Send admin OTP
- `POST /api/admin/verify-otp` - Verify admin OTP
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login (send OTP)
- `POST /api/user/verify-otp` - Verify user OTP

---

## User Flows Summary

### Survey Submission Flow
1. Visit Landing Page → Click "Start Survey Now"
2. Alumni Verification Modal → Confirm status
3. Fill Survey Form (5 sections)
4. Optional: Create account
5. Submit → Validation → Save to database → Success

### Admin Login Flow
1. Visit Admin Page → Enter email
2. Click "Send OTP" → Receive email
3. Enter OTP → Verify → Access Admin Panel
4. View/Search/Filter/Delete surveys

### User Dashboard Flow
1. Visit Login Page → Register/Login
2. Enter email/password → Receive OTP
3. Verify OTP → Access Personal Dashboard
4. View/Edit own survey

### Public Dashboard Flow
1. Visit Landing Page → Click "View Dashboard"
2. View statistics, charts, recent surveys

---

## System Components

### Frontend Components
- `LandingPage.js` - Main entry point
- `SurveyPage.js` - Survey form
- `DashboardPage.js` - Public statistics
- `AdminPage.js` - Administrative panel
- `PersonalDashboard.js` - User's personal view/edit
- `UserLogin.js` - Authentication

### Backend Components
- `server/index.js` - Main server, API routes
- `server/database.js` - Database connection
- `server/auth.js` - Authentication utilities

### Utilities
- `utils/helpers.js` - Helper functions (name masking, star ratings)

---

## Future Enhancements

1. **Data Export**: Excel/CSV/PDF export
2. **Advanced Analytics**: Trend analysis, predictive analytics
3. **Email Notifications**: Survey reminders, updates
4. **Mobile Application**: Native mobile app
5. **Enhanced Security**: JWT tokens, role-based permissions
6. **Social Features**: Alumni directory, networking
7. **Integration**: LMS, CRM integration

---

## Conclusion

The BSIT Graduate Tracer System is a comprehensive solution for tracking and monitoring BSIT graduates. It provides:
- ✅ User-friendly interface for data collection
- ✅ Secure authentication for administrators
- ✅ Powerful analytics and visualizations
- ✅ Modern web technologies
- ✅ Data privacy and security compliance
- ✅ Reliable cloud deployment

The system successfully automates graduate tracking, provides valuable insights through data visualization, and maintains high standards for data privacy and security.

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

*This documentation provides a comprehensive overview of the BSIT Graduate Tracer System for final defense presentation.*
