import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
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

        <footer className="landing-footer">
          <p>BSIT Graduate Tracer System © 2024</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;

