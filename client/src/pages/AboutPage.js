import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-container">
        <header className="about-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>About BSIT Graduate Tracer System</h1>
          <p className="about-subtitle">Complete System Manual and Information</p>
        </header>

        <div className="about-content">
          {/* System Purpose Section */}
          <section className="about-section">
            <h2>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              System Purpose
            </h2>
            <div className="section-content">
              <p>
                The <strong>BSIT Graduate Tracer System</strong> is a comprehensive web-based application designed to track and monitor Bachelor of Science in Information Technology (BSIT) graduates. This system enables educational institutions to collect, manage, and analyze data about alumni's employment status, career progression, and feedback.
              </p>
              
              <h3>Primary Objectives:</h3>
              <ul>
                <li><strong>Data Collection:</strong> Gather comprehensive information from BSIT graduates through structured online surveys</li>
                <li><strong>Employment Tracking:</strong> Monitor graduates' employment status and career paths</li>
                <li><strong>Feedback Collection:</strong> Collect ratings and feedback about the educational program and system usability</li>
                <li><strong>Data Analysis:</strong> Provide statistical insights and visualizations for program improvement</li>
                <li><strong>Alumni Engagement:</strong> Facilitate alumni registration and engagement initiatives</li>
              </ul>

              <h3>Who Can Use This System:</h3>
              <ul>
                <li><strong>BSIT Graduates:</strong> Alumni who complete surveys and provide feedback</li>
                <li><strong>Administrators:</strong> Authorized personnel who manage and view all survey data</li>
                <li><strong>Public Users:</strong> Visitors who can view statistics and feedback</li>
              </ul>
            </div>
          </section>

          {/* System Features Section */}
          <section className="about-section">
            <h2>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Key Features
            </h2>
            <div className="section-content">
              <div className="feature-item">
                <h3>
                  <svg className="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  Online Survey Form
                </h3>
                <p>Comprehensive survey form with five main sections:</p>
                <ul>
                  <li><strong>Section A:</strong> Individual Information (Personal details, contact information)</li>
                  <li><strong>Section B:</strong> Educational Background (Course, achievements, trainings, licenses)</li>
                  <li><strong>Section C:</strong> Employment Experiences (Employment status, job details, IT Field classification, income)</li>
                  <li><strong>Section D:</strong> Ratings and Feedback (Job placement, IT field, competitive edge, workplace)</li>
                  <li><strong>Section E:</strong> Alumni Status & Feedback (School and system ratings)</li>
                </ul>
              </div>

              <div className="feature-item">
                <h3>
                  <svg className="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                  Public Dashboard
                </h3>
                <p>Real-time statistics and visualizations:</p>
                <ul>
                  <li>Employment status distribution (Pie Chart)</li>
                  <li>IT Field distribution (IT Field vs Non-IT Field)</li>
                  <li>Monthly income distribution (Line Chart)</li>
                  <li>Course graduated distribution (Bar Chart)</li>
                  <li>Graduation year distribution (Line Chart)</li>
                  <li>Average satisfaction ratings</li>
                  <li>Recent survey submissions</li>
                </ul>
              </div>

              <div className="feature-item">
                <h3>
                  <svg className="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Personal Dashboard
                </h3>
                <p>For registered graduates:</p>
                <ul>
                  <li>View your submitted survey</li>
                  <li>Edit and update your information</li>
                  <li>Access your data anytime</li>
                </ul>
              </div>

              <div className="feature-item">
                <h3>
                  <svg className="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Admin Panel
                </h3>
                <p>For authorized administrators:</p>
                <ul>
                  <li>View all survey submissions</li>
                  <li>Search and filter survey data</li>
                  <li>Export data to PDF</li>
                  <li>Manage survey records</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security Features Section */}
          <section className="about-section">
            <h2>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Security Features
            </h2>
            <div className="section-content">
              <p>
                The BSIT Graduate Tracer System implements multiple layers of security to protect your personal information and ensure data integrity.
              </p>

              <div className="security-item">
                <h3>
                  <svg className="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Authentication Security
                </h3>
                <ul>
                  <li><strong>OTP (One-Time Password) Authentication:</strong> 
                    <ul>
                      <li>6-digit random code sent via email</li>
                      <li>Expires after single use</li>
                      <li>Required for admin and user login</li>
                    </ul>
                  </li>
                  <li><strong>Password Hashing:</strong> 
                    <ul>
                      <li>SHA-256 algorithm for secure password storage</li>
                      <li>Passwords are never stored in plain text</li>
                      <li>One-way encryption ensures password security</li>
                    </ul>
                  </li>
                  <li><strong>Email Verification:</strong> 
                    <ul>
                      <li>OTP sent to registered email for identity verification</li>
                      <li>Prevents unauthorized access</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="security-item">
                <h3>
                  <svg className="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Data Security
                </h3>
                <ul>
                  <li><strong>Input Validation:</strong> Server-side validation for all inputs to prevent malicious data</li>
                  <li><strong>SQL Injection Prevention:</strong> Parameterized queries protect against database attacks</li>
                  <li><strong>XSS Prevention:</strong> Input sanitization prevents cross-site scripting attacks</li>
                  <li><strong>Privacy Protection:</strong> 
                    <ul>
                      <li>Names are masked in public feedback displays</li>
                      <li>Email addresses are protected and not publicly displayed</li>
                      <li>Individual responses are treated with strict confidentiality</li>
                    </ul>
                  </li>
                  <li><strong>HTTPS/SSL Encryption:</strong> All data transmitted over encrypted HTTPS connection</li>
                </ul>
              </div>

              <div className="security-item">
                <h3>
                  <svg className="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                  </svg>
                  Access Control
                </h3>
                <ul>
                  <li><strong>Admin Access:</strong> Email restriction + OTP authentication required</li>
                  <li><strong>User Access:</strong> Account-based access with email verification</li>
                  <li><strong>Session Management:</strong> Token-based sessions for secure authentication</li>
                  <li><strong>Role-Based Permissions:</strong> Different access levels for different user types</li>
                </ul>
              </div>

              <div className="security-item">
                <h3>
                  <svg className="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                  Data Storage Security
                </h3>
                <ul>
                  <li><strong>Secure Database:</strong> PostgreSQL database hosted on Railway cloud platform</li>
                  <li><strong>SSL-Enabled Connection:</strong> Encrypted database connections</li>
                  <li><strong>Automatic Backups:</strong> Regular backups ensure data recovery</li>
                  <li><strong>Access Restrictions:</strong> Database access limited to authorized servers only</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy and Data Protection Section */}
          <section className="about-section">
            <h2>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
              Privacy and Data Protection
            </h2>
            <div className="section-content">
              <p>
                This research study adheres to the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> and ethical guidelines for research involving human subjects.
              </p>

              <h3>Data Collection and Use:</h3>
              <ul>
                <li>Personal information is collected through an online survey form</li>
                <li>Data includes individual information, educational background, and employment status</li>
                <li>Information is used <strong>solely for tracer study research and program improvement</strong></li>
                <li>No data is shared with third parties for commercial purposes</li>
              </ul>

              <h3>Data Protection Measures:</h3>
              <ul>
                <li>All data is stored securely on Railway cloud hosting platform</li>
                <li>Secure HTTPS connection ensures encrypted data transmission</li>
                <li>Access to data is restricted to authorized administrators only</li>
                <li>Individual responses are treated with strict confidentiality</li>
                <li>Names are masked in public displays</li>
              </ul>

              <h3>Your Rights:</h3>
              <ul>
                <li>You provide informed consent by submitting the survey</li>
                <li>You have the right to access, correct, or delete your information</li>
                <li>You may withdraw from the study at any time</li>
                <li>You can request a copy of your submitted data</li>
              </ul>

              <h3>Data Sharing:</h3>
              <ul>
                <li>Aggregated and anonymized data may be used in research publications</li>
                <li>No personally identifiable information is disclosed without explicit consent</li>
                <li>Data is not shared with third parties for commercial purposes</li>
              </ul>

              <div className="privacy-note">
                <strong>Note:</strong> By submitting the survey, you acknowledge that you have read and understood this Privacy Statement and consent to the collection and use of your information as described above.
              </div>
            </div>
          </section>

          {/* How to Use Section */}
          <section className="about-section">
            <h2>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              How to Use the System
            </h2>
            <div className="section-content">
              <div className="usage-item">
                <h3>For Survey Respondents:</h3>
                <ol>
                  <li>Click <strong>"Start Survey Now"</strong> on the landing page</li>
                  <li>Confirm that you are a BSIT graduate</li>
                  <li>Fill out all required fields in the survey form</li>
                  <li>Review your answers before submitting</li>
                  <li>Optionally create an account to access your data later</li>
                  <li>Submit the survey</li>
                </ol>
                <p><strong>Time Required:</strong> Approximately 10-15 minutes</p>
              </div>

              <div className="usage-item">
                <h3>For Registered Users:</h3>
                <ol>
                  <li>Click <strong>"Access My Dashboard"</strong> on the landing page</li>
                  <li>Enter your email address and password</li>
                  <li>Check your email for the OTP code</li>
                  <li>Enter the OTP to verify your identity</li>
                  <li>Access your personal dashboard to view or edit your survey</li>
                </ol>
              </div>

              <div className="usage-item">
                <h3>For Public Users:</h3>
                <ol>
                  <li>Click <strong>"View Dashboard"</strong> on the landing page</li>
                  <li>Browse statistics and visualizations</li>
                  <li>View recent survey submissions (names are masked for privacy)</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Technical Information Section */}
          <section className="about-section">
            <h2>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
              </svg>
              Technical Information
            </h2>
            <div className="section-content">
              <h3>System Architecture:</h3>
              <p>The system uses a 3-tier architecture:</p>
              <ul>
                <li><strong>Presentation Layer:</strong> React.js Frontend</li>
                <li><strong>Application Layer:</strong> Node.js/Express.js Backend</li>
                <li><strong>Data Layer:</strong> PostgreSQL Database</li>
              </ul>

              <h3>Technology Stack:</h3>
              <ul>
                <li><strong>Frontend:</strong> React.js, React Router, Axios, Recharts</li>
                <li><strong>Backend:</strong> Node.js, Express.js, Nodemailer</li>
                <li><strong>Database:</strong> PostgreSQL</li>
                <li><strong>Hosting:</strong> Railway Cloud Platform</li>
              </ul>

              <h3>Browser Compatibility:</h3>
              <p>The system is compatible with:</p>
              <ul>
                <li>Google Chrome (Recommended)</li>
                <li>Mozilla Firefox</li>
                <li>Microsoft Edge</li>
                <li>Safari</li>
              </ul>

              <h3>Mobile Support:</h3>
              <p>The system is fully responsive and optimized for:</p>
              <ul>
                <li>Desktop computers</li>
                <li>Tablets</li>
                <li>Mobile phones (Android and iOS)</li>
              </ul>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="about-section">
            <h2>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Contact Information
            </h2>
            <div className="section-content">
              <p>If you have questions, concerns, or need assistance with the system:</p>
              <ul>
                <li><strong>System URL:</strong> dwcsjgraduatetracer.it.com</li>
                <li><strong>For Technical Support:</strong> Contact your system administrator</li>
                <li><strong>For Data Privacy Concerns:</strong> Refer to the Privacy Statement section above</li>
              </ul>
            </div>
          </section>

          {/* Important Notes Section */}
          <section className="about-section">
            <h2>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Important Notes
            </h2>
            <div className="section-content">
              <div className="note-item">
                <h3>
                  <svg className="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Do's:
                </h3>
                <ul>
                  <li>Fill out all required fields (marked with asterisk *)</li>
                  <li>Provide accurate and truthful information</li>
                  <li>Review your answers before submitting</li>
                  <li>Create a user account if you want to update your information later</li>
                  <li>Use a valid email address for account creation</li>
                  <li>Keep your password secure and confidential</li>
                </ul>
              </div>

              <div className="note-item">
                <h3>
                  <svg className="inline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Don'ts:
                </h3>
                <ul>
                  <li>Don't submit incomplete forms</li>
                  <li>Don't provide false information</li>
                  <li>Don't share your password with others</li>
                  <li>Don't refresh the page while filling out the form</li>
                  <li>Don't use special characters in fields that don't require them</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="about-actions">
            <Link to="/survey" className="btn-primary">
              Start Survey Now
            </Link>
            <Link to="/dashboard" className="btn-secondary">
              View Dashboard
            </Link>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;

