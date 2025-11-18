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
            <h2>📋 System Purpose</h2>
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
            <h2>✨ Key Features</h2>
            <div className="section-content">
              <div className="feature-item">
                <h3>📝 Online Survey Form</h3>
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
                <h3>📊 Public Dashboard</h3>
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
                <h3>👤 Personal Dashboard</h3>
                <p>For registered graduates:</p>
                <ul>
                  <li>View your submitted survey</li>
                  <li>Edit and update your information</li>
                  <li>Access your data anytime</li>
                </ul>
              </div>

              <div className="feature-item">
                <h3>🔐 Admin Panel</h3>
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
            <h2>🔒 Security Features</h2>
            <div className="section-content">
              <p>
                The BSIT Graduate Tracer System implements multiple layers of security to protect your personal information and ensure data integrity.
              </p>

              <div className="security-item">
                <h3>🔐 Authentication Security</h3>
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
                <h3>🛡️ Data Security</h3>
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
                <h3>🔑 Access Control</h3>
                <ul>
                  <li><strong>Admin Access:</strong> Email restriction + OTP authentication required</li>
                  <li><strong>User Access:</strong> Account-based access with email verification</li>
                  <li><strong>Session Management:</strong> Token-based sessions for secure authentication</li>
                  <li><strong>Role-Based Permissions:</strong> Different access levels for different user types</li>
                </ul>
              </div>

              <div className="security-item">
                <h3>💾 Data Storage Security</h3>
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
            <h2>🔐 Privacy and Data Protection</h2>
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
            <h2>📖 How to Use the System</h2>
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
            <h2>⚙️ Technical Information</h2>
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
            <h2>📞 Contact Information</h2>
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
            <h2>⚠️ Important Notes</h2>
            <div className="section-content">
              <div className="note-item">
                <h3>✅ Do's:</h3>
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
                <h3>❌ Don'ts:</h3>
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

