import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="landing-page">
      <div className="landing-container">
        <header className="landing-header">
          <h1>🎓 BSIT TRACER GRADUATE</h1>
          <p className="landing-subtitle">Track and Monitor BSIT Graduates</p>
        </header>

        <div className="landing-content">
          <div className="landing-hero">
            <h2>Welcome to BSIT Graduate Tracer System</h2>
            <p>
              A comprehensive system for tracking and monitoring BSIT graduates. 
              Help us improve our program by sharing your experiences and current status.
            </p>
          </div>

          <div className="landing-features">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Survey</h3>
              <p>Share your current employment status and experiences</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Dashboard</h3>
              <p>View statistics and insights about graduates</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍💼</div>
              <h3>Admin</h3>
              <p>Manage and monitor graduate data</p>
            </div>
          </div>

          <div className="landing-actions">
            <Link to="/survey" className="btn-primary">
              Take Survey
            </Link>
            <Link to="/dashboard" className="btn-secondary">
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="privacy-section">
          <div className="privacy-header" onClick={() => setShowPrivacy(!showPrivacy)}>
            <h3>🔒 Privacy Statement</h3>
            <span className="privacy-toggle">{showPrivacy ? '▲' : '▼'}</span>
          </div>
          {showPrivacy && (
            <div className="privacy-content">
              <div className="privacy-text">
                <p>
                  <strong>Privacy Statement</strong>
                </p>
                <p>
                  This research study adheres to the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> and ethical guidelines for research involving human subjects. The BSIT Graduate Tracer System (accessible at <strong>dwcsjgraduatetracer.it.com</strong>) collects personal information from BSIT graduates for academic research purposes only.
                </p>
                
                <p>
                  <strong>Data Collection and Use:</strong>
                </p>
                <ul>
                  <li>Personal information is collected through an online survey form</li>
                  <li>Data includes individual information, educational background, and employment status</li>
                  <li>Information is used solely for tracer study research and program improvement</li>
                </ul>

                <p>
                  <strong>Data Protection:</strong>
                </p>
                <ul>
                  <li>All data is stored securely on Railway cloud hosting platform</li>
                  <li>Secure HTTPS connection ensures encrypted data transmission</li>
                  <li>Access to data is restricted to authorized administrators only</li>
                  <li>Individual responses are treated with strict confidentiality</li>
                </ul>

                <p>
                  <strong>Participant Rights:</strong>
                </p>
                <ul>
                  <li>Participants provide informed consent by submitting the survey</li>
                  <li>Participants have the right to access, correct, or delete their information</li>
                  <li>Participants may withdraw from the study at any time</li>
                </ul>

                <p>
                  <strong>Data Sharing:</strong>
                </p>
                <ul>
                  <li>Aggregated and anonymized data may be used in research publications</li>
                  <li>No personally identifiable information is disclosed without explicit consent</li>
                  <li>Data is not shared with third parties for commercial purposes</li>
                </ul>

                <p>
                  <strong>Compliance:</strong>
                </p>
                <p>
                  This study complies with the Data Privacy Act of 2012 (RA 10173) and follows ethical guidelines for research involving human subjects.
                </p>

                <p className="privacy-note">
                  <strong>Note:</strong> By submitting the survey, you acknowledge that you have read and understood this Privacy Statement and consent to the collection and use of your information as described above.
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="landing-footer">
          <p>BSIT Graduate Tracer System © 2024</p>
          <p className="footer-domain">dwcsjgraduatetracer.it.com</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;

