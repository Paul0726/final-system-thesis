# CHAPTER 4: SYSTEM TESTING AND EVALUATION

## 4.1 SYSTEM TESTING

Software testing is an evaluation process conducted to provide stakeholders with insights into the quality of the product being tested. It offers an objective, independent perspective on the software, helping the business understand and assess the risks associated with its implementation. Testing techniques involve executing a program or application with the goal of identifying software bugs, errors, or other defects.

Software testing can be stated as process of validating and verifying that a software programs/ application/ product:

1. Meets the requirement that guide its design and development;
2. Work as expected; and
3. Can be implement with the same characteristics.

Software Testing depending on the testing method employed, software testing can be conducted at different stages of the development process. However, most testing is generally carried out after the requirements have been defined and the design phase is completed.

The testing process outlined was necessary to ensure that the system operates according to the specified requirements and functionality. To assess its functionality, the **BSIT Graduate Tracer System** was tested on any operating system that supports browsers such as Google Chrome, Firefox, Microsoft Edge, Safari, and other available browsers. The system was also tested on mobile devices, particularly Android devices, to ensure optimal performance and responsiveness.

Abstract testing is a crucial component of any software development project. For safety-critical computer-based systems, testing becomes even more essential due to the strict reliability and safety standards. However, many safety-critical systems, along with current testing and debugging methods, have primarily been developed for sequential (non-real-time) programs. Multiple tests were conducted by providing access to the system link for the BSIT graduates and administrators of the institution.

### Testing Procedures Conducted

The BSIT Graduate Tracer System underwent comprehensive testing to validate the following key functionalities:

1. **Survey Form Functionality**
   - Form validation and required field checking
   - Data submission and storage
   - IT Field question functionality (Yes/No selection)
   - User account creation during survey submission
   - Data persistence to PostgreSQL database

2. **Dashboard Display and Statistics**
   - Real-time statistics calculation
   - Chart rendering (Pie Charts, Bar Charts, Line Charts)
   - IT Field Distribution chart display
   - Employment status visualization
   - Mobile-responsive chart display (simplified list view for low-end devices)

3. **Admin Panel Operations**
   - OTP (One-Time Password) authentication via email
   - Survey data viewing and management
   - Search and filter functionality
   - PDF export with IT Field data included
   - Delete operations and data management

4. **User Account Management**
   - Account creation during survey submission
   - Login functionality
   - Personal dashboard access
   - Profile editing including IT Field information

5. **Performance and Optimization**
   - Mobile device performance testing (Android/low-end devices)
   - Page load time optimization
   - API response time testing
   - Database query optimization
   - Chart rendering performance on mobile devices

6. **Security Testing**
   - Password hashing (SHA-256 algorithm)
   - OTP authentication security
   - SQL injection prevention
   - Input validation and sanitization
   - XSS (Cross-Site Scripting) prevention

### Testing Environment

The system was tested in the following environments:

- **Web Browsers:** Google Chrome, Firefox, Microsoft Edge, Safari
- **Operating Systems:** Windows, Android, iOS
- **Mobile Devices:** Android smartphones and tablets (low-end to high-end devices)
- **Network Conditions:** Various connection speeds including slow connections
- **Hosting Platform:** Railway (cloud deployment platform)

### Test Results

All functional requirements were successfully validated. The system operates as expected with the following confirmed functionalities:

- ✅ Survey form submission with IT Field classification
- ✅ Dashboard statistics display with IT Field Distribution chart
- ✅ Admin panel data management with IT Field information
- ✅ PDF export functionality including IT Field data
- ✅ Mobile responsiveness and performance optimization
- ✅ Data integrity and security measures

---

## 4.2 SYSTEM EVALUATION

### 4.2.1 Participants of the Study

The participants of this study are **BSIT (Bachelor of Science in Information Technology) graduates** from the institution. The study targets:

- BSIT graduates who have completed their degree program
- Graduates from different academic years
- Graduates currently employed, self-employed, unemployed, or pursuing further studies

**Inclusion Criteria:**
- Must be a BSIT graduate
- Must have completed the online tracer survey form
- Must provide valid contact information (email address)

**Data Collection:**
- Survey responses collected through the online BSIT Graduate Tracer System
- Voluntary participation
- Data collected includes:
  - Personal information (name, contact details, demographics)
  - Educational background (course, year graduated, academic achievements)
  - Employment status and details
  - **IT Field work classification (Yes/No)** - New feature added
  - Monthly income range
  - Satisfaction ratings and feedback

**Sample Size:**
- Total number of survey respondents: [To be filled based on actual data from dashboard]
- Number of employed graduates: [To be calculated from Employment Status Distribution]
- Number of IT Field workers: [To be calculated from IT Field Distribution chart]
- Number of Non-IT Field workers: [To be calculated from IT Field Distribution chart]

---

### 4.2.2 Statistical Treatment of Data

The collected data from the BSIT Graduate Tracer System was analyzed using descriptive statistics and data visualization techniques:

#### A. Descriptive Statistics

1. **Frequency Distribution**
   - Employment status distribution (Employed, Self-Employed, Unemployed, Further Studies)
   - **IT Field distribution (IT Field vs Non-IT Field)** - New analysis
   - Employment nature distribution (Government Sector, Private Sector, Self-Employed, etc.)
   - Course graduated distribution
   - Graduation year distribution
   - Monthly income distribution

2. **Percentage Analysis**
   - Calculation formula: (Frequency / Total) × 100
   - Used for:
     - Employment status percentages
     - **IT Field vs Non-IT Field percentages** - New metric
     - Income range distribution percentages
     - Course distribution percentages

3. **Mean/Average Calculation**
   - Calculation formula: Sum of values / Number of values
   - Used for:
     - Average satisfaction ratings (Job Placement, IT Field, Competitive Edge, Workplace)
     - Average ratings scale: 1 (Disagree) to 5 (Strongly Agree)

#### B. Data Visualization

The system provides the following visual representations:

1. **Pie Charts**
   - Employment Status Distribution
   - Employment Nature Distribution
   - **IT Field Distribution** (IT Field vs Non-IT Field) - New chart

2. **Line Charts**
   - Monthly Income Distribution (trend over income ranges)
   - Graduation Year Distribution (trend over years)

3. **Bar Charts**
   - Course Graduated Distribution
   - Average Satisfaction Ratings

#### C. Statistical Analysis Methods

**Key Metrics Calculated:**
- Employment rate: (Employed / Total) × 100
- **IT Field employment rate: (IT Field workers / Total employed) × 100** - New metric
- Average satisfaction rating: Mean of all ratings per category

**Data Presentation:**
- Real-time dashboard statistics
- Visual charts and graphs
- Admin panel detailed reports
- PDF export functionality

---

## 4.3 TESTING RESULTS SUMMARY

| Test Case | Description | Status |
|-----------|-------------|--------|
| TC-001 | Survey Form Submission | ✅ Pass |
| TC-002 | IT Field Question Functionality | ✅ Pass |
| TC-003 | IT Field Distribution Chart Display | ✅ Pass |
| TC-004 | Dashboard Statistics Display | ✅ Pass |
| TC-005 | Admin Panel IT Field Display | ✅ Pass |
| TC-006 | PDF Export with IT Field Data | ✅ Pass |
| TC-007 | Mobile Device Performance | ✅ Pass |
| TC-008 | Data Search and Filter | ✅ Pass |

---

**Note:** Fill in the actual numbers and data based on your system's collected responses from the dashboard.

